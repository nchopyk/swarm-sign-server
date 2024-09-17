import usersService from '../../../service/index';
import { CollectionOptions } from '../../../../general/general.types';
import { SignUpFunctionParams, UserUpdatableAttributes } from '../../../service/users.types';

export class UsersController {
  signUp = async (req, res) => {
    const { email, password, firstName, lastName, language, organizationName } = req.body;

    const userCreationAttributes: SignUpFunctionParams = {
      email, password, firstName, lastName, language, organizationName
    };

    await usersService.signUp(userCreationAttributes);

    return res.code(201).send({ message: 'You have successfully signed up.' });
  };

  signUpInvitedUser = async (req, res) => {
    const { firstName, lastName, password, language, code } = req.body;

    const userDataWithTokens = await usersService.signUpInvitedUser({
      firstName,
      lastName,
      password,
      language,
      code,
    });

    return res.code(200).send(userDataWithTokens);
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const userDataWithTokens = await usersService.login({ email, password, ipAddress, userAgent });

    return res.code(200).send(userDataWithTokens);
  };

  refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const tokens = await usersService.refreshTokens(refreshToken, ipAddress, userAgent);

    return res.code(200).send(tokens);
  };

  getCurrentUser = async (req, res) => {
    const { id } = req.user;

    const user = await usersService.getById(id);

    return res.code(200).send(user);
  };

  updateCurrentUser = async (req, res) => {
    const { id } = req.user;
    const { firstName, lastName, newPassword, currentPassword, avatarUrl, language, twoFactorAuthEnabled } = req.body;

    const attributesToUpdate: UserUpdatableAttributes = {
      firstName,
      lastName,
      newPassword,
      currentPassword,
      avatarUrl,
      language,
      twoFactorAuthEnabled,
    };

    const user = await usersService.update(id, attributesToUpdate);

    return res.code(200).send(user);
  };

  deleteCurrentUser = async (req, res) => {
    const { id } = req.user;

    await usersService.delete(id);

    return res.code(200).send({ message: 'User and all his organizations were successfully deleted' });
  };

  createUserOrganization = async (req, res) => {
    const { id: userId } = req.user;
    const { name } = req.body;

    const organization = await usersService.createUserOrganization({ userId, name });

    return res.code(201).send(organization);
  };

  getAllUserOrganizationsWithPagination = async (req, res) => {
    const { id } = req.user;
    const { sort, page, where } = req.query;

    const collectionOptions: CollectionOptions = { sort, page, where };
    const collection = await usersService.getAllUserOrganizationsWithPagination(id, collectionOptions);

    return res.code(200).send(collection);
  };

  getUserOrganizationById = async (req, res) => {
    const { id: userId } = req.user;
    const { organizationId } = req.params;

    const organization = await usersService.getUserOrganizationById({ userId, organizationId });

    return res.code(200).send(organization);
  };

  leaveOrganization = async (req, res) => {
    const { id: userId } = req.user;
    const { organizationId } = req.params;

    await usersService.leaveOrganization({ userId, organizationId });

    return res.code(200).send({ message: 'User was successfully removed from organization' });
  };

  getAllInvitationsToOrganizationsWithPagination = async (req, res) => {
    const { id: userId } = req.user;
    const { sort, page, where } = req.query;

    const collectionOptions: CollectionOptions = { sort, page, where };
    const collection = await usersService.getAllInvitationsToOrganizationsWithPagination(userId, collectionOptions);

    return res.code(200).send(collection);
  };
}

export default new UsersController();
