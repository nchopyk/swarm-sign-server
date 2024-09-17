import Errors from '../../../errors';
import organizationsErrors from '../../organizations/service/organizations.errors';
import organizationsMembersErrors from './organizations-members.errors';
import organizationsRepository from '../../organizations/service/organizations.repository';
import organizationsMembersRepository from './organizations-members.repository';
import { calculatePagination, resolveSkipAndLimitFromPagination } from '../../../modules/collection-query-processor/pagination/pagination.resolver';
import { Collection, CollectionOptions } from '../../general/general.types';
import { OrganizationId } from '../../organizations/service/organizations.types';
import {
  OrganizationMemberDTO,
} from './organizations-members.types';


export class OrganizationsMembersService {
  async getAllMembers(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<Collection<OrganizationMemberDTO>> {
    const [organization, total] = await Promise.all([
      organizationsRepository.getModelById(organizationId),
      organizationsMembersRepository.getAllMembersTotalCount(organizationId, collectionOptions.where),
    ]);

    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    const { sort, page, where } = collectionOptions;
    const pagination = calculatePagination(page.number, page.size, total);
    const { skip, limit } = resolveSkipAndLimitFromPagination(pagination);

    const organizationMembers = await organizationsMembersRepository.getAllMembersDTOs(organizationId, { sort, skip, limit, where });

    return {
      data: organizationMembers,
      meta: pagination,
    };
  }

  async updateMember({ organizationId, userId, role }: { organizationId: OrganizationId; userId: string; role: string }): Promise<OrganizationMemberDTO> {
    const userOrganizationRelation = await organizationsMembersRepository.getMemberDTOById({ organizationId, userId });

    if (!userOrganizationRelation) {
      throw new Errors.BadRequest(organizationsMembersErrors.organizationNotRelatedToUser({ userId, organizationId }));
    }

    await organizationsMembersRepository.updateMember({ organizationId, userId, fieldsToUpdate: { role } });

    const updatedMember = await organizationsMembersRepository.getMemberDTOById({ organizationId, userId });

    if (!updatedMember) {
      throw new Errors.InternalError(organizationsMembersErrors.relationNotFound({ organizationId, userId }));
    }

    return updatedMember;
  }
}

export default new OrganizationsMembersService();
