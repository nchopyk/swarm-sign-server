import Errors from '../../../errors';
import usersErrors from './users.errors';
import organizationsErrors from '../../organizations/service/organizations.errors';
import generalErrors from '../../general/general.errors';
import postgresDB from '../../../modules/postgres-db';
import usersRepository from './users.repository';
import organizationsRepository from '../../organizations/service/organizations.repository';
import jwtService from '../../../modules/jwt-service';
import TOKEN_TYPES from '../../../constants/token-types';
import { ORGANIZATION_ROLES } from '../../../constants/organization-roles';
import { JWT_CONFIG } from '../../../config';
import { ACTIONS, SECTIONS, STATUSES } from '../../../constants/user-activity';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { comparePasswords, hashPassword } from '../../general/utils/general.hash.utils';
import { Collection, CollectionOptions } from '../../general/general.types';
import {
  CreateOrganizationFunctionParams,
  JWTAuthTokenPayload,
  LoginFunctionParams,
  LoginFunctionReturn,
  SignUpFunctionParams,
  UserActivityLogIp,
  UserActivityLogUserAgent,
  UserId,
  UserModel,
  UserOrganizationRelationModel,
  UserTokens,
  UserUpdatableAttributes,
  UserOrganization,
} from './users.types';


export class UsersService {
  async signUp({
    email,
    password,
    firstName,
    lastName,
    language,
    organizationName,
  }: SignUpFunctionParams): Promise<void> {
    email = email.toLowerCase();

    const existingUser = await usersRepository.getModelByEmail(email);

    if (existingUser) {
      throw new Errors.BadRequest(usersErrors.withSuchEmailAlreadyExists({ email }));
    }

    const hashedPassword = await hashPassword(password);

    await postgresDB.getClient().transaction(async (trx) => {
      const newUserId = await usersRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        language,
        emailVerifiedAt: new Date(),
      }, trx);

      const newOrganizationId = await organizationsRepository.create({ name: organizationName }, trx);

      await usersRepository.createUserToOrganizationRelation({ userId: newUserId, organizationId: newOrganizationId, role: ORGANIZATION_ROLES.OWNER }, trx);

      return newUserId;
    });
  }


  async login({ email, password, ipAddress, userAgent }: LoginFunctionParams): Promise<LoginFunctionReturn> {
    email = email.toLowerCase();

    const user = await usersRepository.getModelByEmail(email);

    if (!user) {
      throw new Errors.BadRequest(usersErrors.wrongEmailOrPasswordProvided());
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new Errors.BadRequest(usersErrors.wrongEmailOrPasswordProvided());
    }

    if (!user.emailVerifiedAt) {
      throw new Errors.BadRequest(usersErrors.emailNotVerified({ email }));
    }

    const tokens = await this.generateUserTokens(user);

    await usersRepository.createUserActivityLog({ userId: user.id, section: SECTIONS.USERS, action: ACTIONS.LOGIN, status: STATUSES.SUCCESS, ipAddress, userAgent });

    return { user, tokens };
  }

  async refreshTokens(refreshToken: string, ipAddress: UserActivityLogIp, userAgent: UserActivityLogUserAgent): Promise<UserTokens> {
    const refreshTokenPayload = (await jwtService.verifyJWT(refreshToken)) as JWTAuthTokenPayload | null;

    if (!refreshTokenPayload) {
      throw new Errors.BadRequest(generalErrors.invalidJWTToken());
    }

    if (refreshTokenPayload.tokenType !== TOKEN_TYPES.REFRESH_TOKEN) {
      throw new Errors.BadRequest(generalErrors.invalidJWTTokenType());
    }

    const user = await usersRepository.getModelById(refreshTokenPayload.userId);

    if (!user) {
      throw new Errors.BadRequest(generalErrors.invalidJWTToken());
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      jwtService.generateJWT({ userId: user.id, email: user.email, tokenType: TOKEN_TYPES.ACCESS_TOKEN } satisfies JWTAuthTokenPayload, JWT_CONFIG.ACCESS_EXPIRES_IN),
      jwtService.generateJWT({ userId: user.id, email: user.email, tokenType: TOKEN_TYPES.REFRESH_TOKEN } satisfies JWTAuthTokenPayload, JWT_CONFIG.REFRESH_EXPIRES_IN),
    ]);

    await usersRepository.createUserActivityLog({
      userId: user.id,
      section: SECTIONS.USERS,
      action: ACTIONS.REFRESH_TOKEN,
      status: STATUSES.SUCCESS,
      ipAddress,
      userAgent,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getById(userId: UserId): Promise<UserModel | null> {
    const user = usersRepository.getModelById(userId);

    if (!user) {
      throw new Errors.NotFoundError(usersErrors.withSuchIdNotFound({ userId }));
    }

    return user;
  }

  async update(userId: UserId, attributesToUpdate: UserUpdatableAttributes): Promise<UserModel | null> {
    const user = await usersRepository.getModelById(userId);

    if (!user) {
      throw new Errors.NotFoundError(usersErrors.withSuchIdNotFound({ userId }));
    }

    if (attributesToUpdate.newPassword && attributesToUpdate.currentPassword) {
      const isCurrentPasswordValid = await comparePasswords(attributesToUpdate.currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        throw new Errors.BadRequest(usersErrors.wrongCurrentPassword());
      }

      attributesToUpdate.newPassword = await hashPassword(attributesToUpdate.newPassword);
    } else {
      delete attributesToUpdate.newPassword;
      delete attributesToUpdate.currentPassword;
    }

    await usersRepository.update(userId, attributesToUpdate);

    return await this.getById(userId);
  }

  async delete(userId: UserId): Promise<void> {
    const [user, userOrganizations] = await Promise.all([usersRepository.getModelById(userId), usersRepository.getAllUserOrganizationRelations(userId)]);

    if (!user) {
      throw new Errors.NotFoundError(usersErrors.withSuchIdNotFound({ userId }));
    }

    const ownerOrganizations = userOrganizations.filter((userOrganization) => userOrganization.role === ORGANIZATION_ROLES.OWNER);

    for (const organization of ownerOrganizations) {
      await organizationsRepository.delete(organization.organizationId);
    }

    await usersRepository.delete(userId);
  }

  async createUserOrganization(creationAttributes: CreateOrganizationFunctionParams): Promise<UserOrganization> {
    const { userId, name } = creationAttributes;

    const user = await usersRepository.getModelById(userId);

    if (!user) {
      throw new Errors.NotFoundError(usersErrors.withSuchIdNotFound({ userId }));
    }

    const newOrganizationId = await postgresDB.getClient().transaction(async (trx) => {
      const organizationId = await organizationsRepository.create({ name }, trx);

      await usersRepository.createUserToOrganizationRelation({ userId, organizationId, role: ORGANIZATION_ROLES.OWNER }, trx);

      return organizationId;
    });

    return this.getUserOrganizationById({ userId, organizationId: newOrganizationId });
  }

  async getAllUserOrganizationsWithPagination(userId: UserId, collectionOptions: CollectionOptions): Promise<Collection<UserOrganizationRelationModel>> {
    const user = await usersRepository.getModelById(userId);

    if (!user) {
      throw new Errors.NotFoundError(usersErrors.withSuchIdNotFound({ userId }));
    }

    const userOrganizations = await usersRepository.getAllUserOrganizationsWithPagination(userId, collectionOptions);

    return {
      data: userOrganizations,
    };
  }

  async getUserOrganizationById({ userId, organizationId }: { userId: UserId; organizationId: OrganizationId }): Promise<UserOrganization> {
    const [user, relation, organization] = await Promise.all([
      usersRepository.getModelById(userId),
      usersRepository.getUserOrganizationRelation({ userId, organizationId }),
      organizationsRepository.getModelById(organizationId),
    ]);

    if (!user) {
      throw new Errors.NotFoundError(usersErrors.withSuchIdNotFound({ userId }));
    }

    if (!relation) {
      throw new Errors.NotFoundError(usersErrors.userNotBelongsToOrganization({ userId, organizationId }));
    }

    if (!organization) {
      throw new Errors.InternalError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    return { ...relation, organization };
  }

  async leaveOrganization({ userId, organizationId }: { userId: UserId; organizationId: OrganizationId }): Promise<void> {
    const [user, organization, organizationRelation] = await Promise.all([
      usersRepository.getModelById(userId),
      organizationsRepository.getModelById(organizationId),
      usersRepository.getUserOrganizationRelation({ userId, organizationId }),
    ]);


    if (!organizationRelation) {
      throw new Errors.BadRequest(usersErrors.userNotBelongsToOrganization({ userId, organizationId }));
    }

    if (organizationRelation.role === ORGANIZATION_ROLES.OWNER) {
      throw new Errors.BadRequest(usersErrors.ownerCannotLeaveOrganization({ userId, organizationId }));
    }

    if (!user) {
      throw new Errors.BadRequest(usersErrors.withSuchIdNotFound({ userId }));
    }

    if (!organization) {
      throw new Errors.BadRequest(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    await usersRepository.deleteUserOrganizationRelation({ userId, organizationId });
  }

  private async generateUserTokens(user: UserModel): Promise<UserTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      jwtService.generateJWT({ userId: user.id, email: user.email, tokenType: TOKEN_TYPES.ACCESS_TOKEN } satisfies JWTAuthTokenPayload, JWT_CONFIG.ACCESS_EXPIRES_IN),
      jwtService.generateJWT({ userId: user.id, email: user.email, tokenType: TOKEN_TYPES.REFRESH_TOKEN } satisfies JWTAuthTokenPayload, JWT_CONFIG.REFRESH_EXPIRES_IN),
    ]);

    return { accessToken, refreshToken };
  }
}

export default new UsersService();
