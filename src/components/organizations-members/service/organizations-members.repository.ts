import * as crypto from 'node:crypto';
import postgresClient from '../../../modules/postgres-db';
import usersRepository from '../../users/service/users.repository';
import { Knex } from 'knex';
import { CollectionRepositoryOptions, CollectionWhere, ModelToColumnsMapping, ModelToPrefixedColumnsMapping } from '../../general/general.types';
import { convertModelSortRulesToTableSortRules } from '../../../modules/collection-query-processor/sort/sort.rules-converters';
import { convertFiltersToQueryCondition } from '../../../modules/collection-query-processor/filter/filter.knex-condition-builder';
import { addTablePrefixToColumns, convertFieldsToColumns } from '../../general/utils/general.repository.utils';
import { OrganizationId } from '../../organizations/service/organizations.types';
import { UserModel } from '../../users/service/users.types';
import {
  DeleteOrganizationUserRelationFunctionParams,
  GetInviteeInvitationFunctionParams,
  GetOrganizationInvitationByIdFunctionParams,
  InvitationId,
  OrganizationInvitationCreationAttributes,
  OrganizationInvitationModel,
  OrganizationMemberDTO,
  UpdateOrganizationUserRelationFunctionParams,
  GetOrganizationMemberByIdFunctionParams,
  GetOrganizationMemberByEmailFunctionParams,
  OrganizationInvitation,
} from './organizations-members.types';

export class OrganizationsMembersRepository {
  private readonly memberModelToColumnsMapWithTableName: ModelToColumnsMapping<UserModel>;

  private readonly inviterModelToPrefixedColumnsMapWithAliases: ModelToPrefixedColumnsMapping;

  private readonly invitationModelToTableColumnsMap: ModelToColumnsMapping<OrganizationInvitationModel>;
  private readonly invitationModelToPrefixedColumnsMap: ModelToPrefixedColumnsMapping;

  public readonly memberColumns: ModelToPrefixedColumnsMapping;

  public readonly invitationColumns: ModelToPrefixedColumnsMapping;

  constructor(private postgresClient: Knex) {
    this.postgresClient = postgresClient;

    this.invitationModelToTableColumnsMap = {
      id: 'id',
      organizationId: 'organization_id',
      inviterId: 'inviter_id',
      email: 'invitee_email',
      role: 'invitee_role',
      acceptedAt: 'accepted_at',
      rejectedAt: 'rejected_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    this.memberModelToColumnsMapWithTableName = Object.entries(usersRepository.usersModelToColumnsMap).reduce(
      (acc, [key, value]) => {
        acc[`user.${key}`] = `user.${value}`;
        return acc;
      },
      {} as Record<keyof UserModel, string>,
    );

    this.inviterModelToPrefixedColumnsMapWithAliases = addTablePrefixToColumns(usersRepository.usersModelToColumnsMap, 'inviter', { includePrefixInAliases: true });

    this.invitationModelToPrefixedColumnsMap = addTablePrefixToColumns(this.invitationModelToTableColumnsMap, 'organizations_invitations');

    this.memberColumns = {
      ...usersRepository.usersOrganizationRelationModelToPrefixedColumnsMap,
      ...this.memberModelToColumnsMapWithTableName,
    };

    this.invitationColumns = {
      ...this.invitationModelToPrefixedColumnsMap,
      ...this.inviterModelToPrefixedColumnsMapWithAliases,
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

  async createInvitation({ organizationId, inviterId, email, role }: OrganizationInvitationCreationAttributes): Promise<InvitationId> {
    const newInvitationId = crypto.randomUUID();
    const columns = convertFieldsToColumns({ id: newInvitationId, organizationId, inviterId, email, role }, this.invitationModelToTableColumnsMap);

    await this.postgresClient
      .insert(columns)
      .into('organizations_invitations');

    return newInvitationId;
  }

  async getActiveInviteeInvitation({ organizationId, inviteeEmail }: GetInviteeInvitationFunctionParams): Promise<OrganizationInvitation | null> {
    const invitationRows = await this.postgresClient
      .select(this.invitationColumns)
      .from('organizations_invitations')
      .join('users as inviter', 'organizations_invitations.inviter_id', 'inviter.id') // TODO: fix on delete cascade
      .where('organizations_invitations.organization_id', organizationId)
      .andWhere('invitee_email', inviteeEmail)
      .andWhere('accepted_at', null)
      .andWhere('rejected_at', null)
      .first();

    if (!invitationRows) {
      return null;
    }

    return this.convertInvitationRowsToInvitationDTO(invitationRows);
  }

  async getMemberInvitationById({ organizationId, invitationId }: GetOrganizationInvitationByIdFunctionParams): Promise<OrganizationInvitation | null> {
    const invitationRows = await this.postgresClient
      .select(this.invitationColumns)
      .from('organizations_invitations')
      .join('users as inviter', 'organizations_invitations.inviter_id', 'inviter.id')
      .where('organizations_invitations.id', invitationId)
      .andWhere('organization_id', organizationId)
      .first();

    if (!invitationRows) {
      return null;
    }

    return this.convertInvitationRowsToInvitationDTO(invitationRows);
  }

  async getAllMembersInvitations(organizationId: OrganizationId, collectionOptions: CollectionRepositoryOptions): Promise<Array<OrganizationInvitation>> {
    const rows = await this.postgresClient
      .select(this.invitationColumns)
      .from('organizations_invitations')
      .join('users as inviter', 'organizations_invitations.inviter_id', 'inviter.id')
      .where('organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, collectionOptions.where, this.invitationColumns))
      .orderBy(convertModelSortRulesToTableSortRules(collectionOptions.sort, this.invitationColumns))
      .limit(collectionOptions.limit)
      .offset(collectionOptions.skip);

    return <Array<OrganizationInvitation>>rows.map(this.convertInvitationRowsToInvitationDTO);
  }

  async getAllInvitationsCount(organizationId: OrganizationId, filters: CollectionWhere): Promise<number> {
    const result: { count: string } = await this.postgresClient
      .count('organizations_invitations.id')
      .from('organizations_invitations')
      .join('users as inviter', 'organizations_invitations.inviter_id', 'inviter.id')
      .where('organization_id', organizationId)
      .andWhere((builder) => convertFiltersToQueryCondition(builder, filters, this.invitationColumns))
      .first();

    return parseInt(result.count);
  }

  async deleteInvitation(invitationId: InvitationId): Promise<void> {
    await this.postgresClient.delete().from('organizations_invitations').where('id', invitationId);
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

  private convertInvitationRowsToInvitationDTO(invitationRows): OrganizationInvitation | null {
    return Object.entries(invitationRows).reduce(
      (acc, [key, value]) => {
        const [tableName, columnName] = key.split('.');

        if (tableName === 'inviter') {
          acc.inviter[columnName] = value;
        } else {
          acc[key] = value;
        }

        return acc;
      },
      { inviter: {} } as OrganizationInvitation,
    );
  }
}

export default new OrganizationsMembersRepository(postgresClient.getClient());
