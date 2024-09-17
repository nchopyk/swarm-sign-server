import postgresClient from '../../../modules/postgres-db';
import organizationsRepository from '../../organizations/service/organizations.repository';
import * as crypto from 'node:crypto';
import { STATUSES } from '../../../constants/user-activity';
import { convertFiltersToQueryCondition } from '../../../modules/collection-query-processor/filter/filter.knex-condition-builder';
import { convertModelSortRulesToTableSortRules } from '../../../modules/collection-query-processor/sort/sort.rules-converters';
import { addTablePrefixToColumns, convertFieldsToColumns } from '../../general/utils/general.repository.utils';
import { Knex } from 'knex';
import { CollectionRepositoryOptions, CollectionWhere, ModelToColumnsMapping, ModelToPrefixedColumnsMapping } from '../../general/general.types';
import { OrganizationId } from '../../organizations/service/organizations.types';
import {
  UserActivityLogCreationAttributes,
  UserActivityLogId,
  UserActivityLogModel,
  UserCreationAttributes,
  UserEmail,
  UserId,
  UserModel,
  UserOrganization,
  UserOrganizationRelationModel,
  UserOrganizationRelationCreationAttributes,
  UserUpdatableAttributes,
} from './users.types';


export class UsersRepository {
  public readonly usersModelToColumnsMap: ModelToColumnsMapping<UserModel>;
  public readonly usersModelToPrefixedColumnsMap: ModelToPrefixedColumnsMapping;
  public readonly usersModelToPrefixedColumnsMapWithAliases: ModelToPrefixedColumnsMapping;

  public readonly usersOrganizationRelationModelToColumnsMap: ModelToColumnsMapping<UserOrganizationRelationModel>;
  public readonly usersOrganizationRelationModelToPrefixedColumnsMap: ModelToPrefixedColumnsMapping;

  public readonly inviterUsersModelToPrefixedColumnsMapWithAliases: ModelToPrefixedColumnsMapping;

  public readonly userOrganizationsColumns: ModelToPrefixedColumnsMapping;

  constructor(private postgresClient: Knex) {
    this.postgresClient = postgresClient;

    this.usersModelToColumnsMap = {
      id: 'id',
      email: 'email',
      password: 'password',
      firstName: 'first_name',
      lastName: 'last_name',
      emailVerifiedAt: 'email_verified_at',
      avatarUrl: 'avatar_url',
      language: 'language',
      twoFactorAuthEnabled: 'two_factor_auth_enabled',
      accountBlockedAt: 'account_blocked_at',
      accountBlockedReason: 'account_blocked_reason',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    this.usersOrganizationRelationModelToColumnsMap = {
      userId: 'user_id',
      organizationId: 'organization_id',
      role: 'role',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };



    this.usersModelToPrefixedColumnsMap = addTablePrefixToColumns(this.usersModelToColumnsMap, 'user');

    this.usersModelToPrefixedColumnsMapWithAliases = addTablePrefixToColumns(this.usersModelToColumnsMap, 'user', {
      includePrefixInAliases: true,
      relationColumn: true
    });

    this.usersOrganizationRelationModelToPrefixedColumnsMap = addTablePrefixToColumns(this.usersOrganizationRelationModelToColumnsMap, 'organizations_members');

    this.inviterUsersModelToPrefixedColumnsMapWithAliases = addTablePrefixToColumns(this.usersModelToColumnsMap, 'inviters', { includePrefixInAliases: true });

    this.userOrganizationsColumns = {
      ...this.usersOrganizationRelationModelToPrefixedColumnsMap,
      ...organizationsRepository.organizationsModelToPrefixedColumnsMapWithAliases,
    };
  }

  async create(user: UserCreationAttributes, trx?: Knex.Transaction): Promise<UserId> {
    const newUserId = crypto.randomUUID();
    const columns = convertFieldsToColumns({ ...user, id: newUserId }, this.usersModelToColumnsMap);

    await (trx || this.postgresClient)
      .insert(columns)
      .into('users');

    return newUserId;
  }

  async createUserToOrganizationRelation({ userId, organizationId, role }: UserOrganizationRelationCreationAttributes, trx?: Knex.Transaction) {
    await (trx || this.postgresClient)
      .insert({
        user_id: userId,
        organization_id: organizationId,
        role,
      })
      .into('organizations_members');
  }

  async getAllUserOrganizationsWithPagination(userId: UserId, collectionOptions: CollectionRepositoryOptions): Promise<Array<UserOrganization>> {
    const columns = {
      ...this.usersOrganizationRelationModelToPrefixedColumnsMap,
      ...organizationsRepository.organizationsModelToPrefixedColumnsMapWithAliases,
    };

    const rows = await this.postgresClient
      .select(columns)
      .from('organizations as organization')
      .join('organizations_members', 'organization.id', 'organizations_members.organization_id')
      .where('organizations_members.user_id', userId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, collectionOptions.where, columns))
      .orderBy(convertModelSortRulesToTableSortRules(collectionOptions.sort, columns))
      .limit(collectionOptions.limit)
      .offset(collectionOptions.skip);

    return this.toUserOrganizationDTO(rows);
  }

  async getAllUserOrganizationsTotalCount(userId: UserId, condition: CollectionWhere): Promise<number> {
    const columns = {
      ...this.usersOrganizationRelationModelToPrefixedColumnsMap,
      ...organizationsRepository.organizationsModelToPrefixedColumnsMapWithAliases,
    };

    const result: { count: string } = await this.postgresClient
      .count('id')
      .from('organizations as organization')
      .join('organizations_members', 'organization.id', 'organizations_members.organization_id')
      .where('organizations_members.user_id', userId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, condition, columns))
      .first();

    return parseInt(result.count, 10);
  }

  async getUserOrganizationRelation({ userId, organizationId }: { userId: UserId; organizationId: OrganizationId }): Promise<UserOrganizationRelationModel | null> {
    const userOrganizationRelation = await this.postgresClient
      .select(this.usersOrganizationRelationModelToColumnsMap)
      .from('organizations_members')
      .where({ user_id: userId, organization_id: organizationId })
      .first();

    return userOrganizationRelation || null;
  }

  async getAllUserOrganizationRelations(userId: UserId): Promise<Array<UserOrganizationRelationModel>> {
    return this.postgresClient.select(this.usersOrganizationRelationModelToColumnsMap).from('organizations_members').where({ user_id: userId });
  }

  async deleteUserOrganizationRelation({ userId, organizationId }: { userId: UserId; organizationId: OrganizationId }): Promise<void> {
    await this.postgresClient.delete().from('organizations_members').where({ user_id: userId, organization_id: organizationId });
  }

  async getModelByEmail(email: string): Promise<UserModel | null> {
    const user = await this.postgresClient
      .select(this.usersModelToColumnsMap)
      .from('users')
      .where({ email })
      .first();

    return user || null;
  }

  async getModelById(userId: UserId): Promise<UserModel | null> {
    const user = await this.postgresClient
      .select(this.usersModelToColumnsMap)
      .from('users')
      .where({ id: userId })
      .first();

    return user || null;
  }

  async update(userId: UserId, attributesToUpdate: UserUpdatableAttributes): Promise<void> {
    const columnsToUpdate = convertFieldsToColumns(attributesToUpdate, this.usersModelToColumnsMap);

    if (Object.keys(columnsToUpdate).length === 0) {
      return;
    }

    await this.postgresClient
      .update(columnsToUpdate)
      .from('users')
      .where({ id: userId });
  }

  async delete(userId: UserId): Promise<void> {
    await this.postgresClient.delete().from('users').where({ id: userId });
  }

  async createUserActivityLog(
    { userId, section, action, status, ipAddress, userAgent, meta }: UserActivityLogCreationAttributes,
    trx?: Knex.Transaction,
  ): Promise<UserActivityLogId> {
    const newLogId = crypto.randomUUID();

    await (trx || this.postgresClient)
      .insert({
        id: newLogId,
        user_id: userId,
        section,
        action,
        status,
        ip_address: ipAddress,
        user_agent: userAgent,
        meta,
      })
      .into('users_activity_logs');

    return newLogId;
  }

  async getLastSuccessfulUserActivityLog(userId: UserId): Promise<UserActivityLogModel | null> {
    const log = await this.postgresClient
      .select(
        'id',
        'user_id as userId',
        'section',
        'action',
        'status',
        'ip_address as ipAddress',
        'user_agent as userAgent',
        'meta',
        'created_at as createdAt',
        'updated_at as updatedAt',
      )
      .from('users_activity_logs')
      .where({ user_id: userId, status: STATUSES.SUCCESS })
      .orderBy('created_at', 'desc')
      .first();

    return log || null;
  }






  private async toUserOrganizationDTO(rows) {
    return rows.map((row) =>
      Object.entries(row).reduce(
        (acc, [key, value]) => {
          const [table, column] = key.split('.');

          if (table === 'organization') {
            acc.organization[column] = value;
          } else {
            acc[key] = value;
          }

          return acc;
        },
        { organization: {} } as UserOrganization,
      ),
    );
  }


}

export default new UsersRepository(postgresClient.getClient());
