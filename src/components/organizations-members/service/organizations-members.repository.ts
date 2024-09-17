import postgresClient from '../../../modules/postgres-db';
import usersRepository from '../../users/service/users.repository';
import { Knex } from 'knex';
import { CollectionRepositoryOptions, CollectionWhere, ModelToColumnsMapping, ModelToPrefixedColumnsMapping } from '../../general/general.types';
import { convertModelSortRulesToTableSortRules } from '../../../modules/collection-query-processor/sort/sort.rules-converters';
import { convertFiltersToQueryCondition } from '../../../modules/collection-query-processor/filter/filter.knex-condition-builder';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { UserModel } from '../../users/service/users.types';
import {
  DeleteOrganizationUserRelationFunctionParams,
  OrganizationMemberDTO,
  UpdateOrganizationUserRelationFunctionParams,
  GetOrganizationMemberByIdFunctionParams,
  GetOrganizationMemberByEmailFunctionParams,
} from './organizations-members.types';

export class OrganizationsMembersRepository {
  private readonly memberModelToColumnsMapWithTableName: ModelToColumnsMapping<UserModel>;



  public readonly memberColumns: ModelToPrefixedColumnsMapping;

  constructor(private postgresClient: Knex) {
    this.postgresClient = postgresClient;


    this.memberModelToColumnsMapWithTableName = Object.entries(usersRepository.usersModelToColumnsMap).reduce(
      (acc, [key, value]) => {
        acc[`user.${key}`] = `user.${value}`;
        return acc;
      },
      {} as Record<keyof UserModel, string>,
    );

    this.memberColumns = {
      ...usersRepository.usersOrganizationRelationModelToPrefixedColumnsMap,
      ...this.memberModelToColumnsMapWithTableName,
    };
  }

  async getMemberDTOById({ organizationId, userId }: GetOrganizationMemberByIdFunctionParams): Promise<OrganizationMemberDTO | null> {
    const memberRows = await this.postgresClient
      .select(this.memberColumns)
      .from('users as user')
      .join('organizations_members', 'user.id', 'organizations_members.user_id')
      .where('organizations_members.organization_id', organizationId)
      .andWhere('organizations_members.user_id', userId)
      .first();

    return memberRows ? this.toMemberDTO(memberRows) : null;
  }

  async getMemberDTOByEmail({ organizationId, userEmail }: GetOrganizationMemberByEmailFunctionParams): Promise<OrganizationMemberDTO | null> {
    const memberRaw = await this.postgresClient
      .select(this.memberColumns)
      .from('users as user')
      .join('organizations_members', 'user.id', 'organizations_members.user_id')
      .where('organizations_members.organization_id', organizationId)
      .andWhere('user.email', userEmail)
      .first();

    return memberRaw ? this.toMemberDTO(memberRaw) : null;
  }

  async getAllMembersDTOs(organizationId: OrganizationId, collectionOptions: CollectionRepositoryOptions): Promise<Array<OrganizationMemberDTO>> {
    const rows = await this.postgresClient
      .select(this.memberColumns)
      .from('users as user')
      .join('organizations_members', 'user.id', 'organizations_members.user_id')
      .where('organizations_members.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, collectionOptions.where, this.memberColumns))
      .orderBy(convertModelSortRulesToTableSortRules(collectionOptions.sort, this.memberColumns))
      .limit(collectionOptions.limit)
      .offset(collectionOptions.skip);

    return rows.map(this.toMemberDTO);
  }

  async getAllMembersTotalCount(organizationId: OrganizationId, filters: CollectionWhere): Promise<number> {
    const result: { count: string } = await this.postgresClient
      .count('user.id')
      .from('users as user')
      .join('organizations_members', 'user.id', 'organizations_members.user_id')
      .where('organizations_members.organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, filters, this.memberColumns))
      .first();

    return parseInt(result.count);
  }

  async getAllMembersModels(organizationId: OrganizationId): Promise<UserModel[]> {
    return this.postgresClient
      .select(usersRepository.usersModelToPrefixedColumnsMap)
      .from('users as user')
      .join('organizations_members', 'user.id', 'organizations_members.user_id')
      .where('organizations_members.organization_id', organizationId);
  }

  async updateMember({ organizationId, userId, fieldsToUpdate }: UpdateOrganizationUserRelationFunctionParams): Promise<void> {
    await this.postgresClient.update({ role: fieldsToUpdate.role }).from('organizations_members').where('organization_id', organizationId).andWhere('user_id', userId);
  }

  async deleteMember({ organizationId, userId }: DeleteOrganizationUserRelationFunctionParams): Promise<void> {
    await this.postgresClient.delete().from('organizations_members').where('organization_id', organizationId).andWhere('user_id', userId);
  }

  private toMemberDTO(memberRows): OrganizationMemberDTO {
    return Object.entries(memberRows).reduce(
      (acc, [key, value]) => {
        if (key.startsWith('user.')) {
          acc.user[key.replace('user.', '')] = value;
        } else {
          acc[key] = value;
        }

        return acc;
      },
      { user: {} } as OrganizationMemberDTO,
    );
  }
}

export default new OrganizationsMembersRepository(postgresClient.getClient());
