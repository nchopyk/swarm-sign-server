import Errors from '../../../errors';
import organizationsErrors from '../../organizations/service/organizations.errors';
import organizationsMembersErrors from './organizations-members.errors';
import organizationsRepository from '../../organizations/service/organizations.repository';
import organizationsMembersRepository from './organizations-members.repository';
import { Collection, CollectionOptions } from '../../general/general.types';
import { OrganizationId } from '../../organizations/service/organizations.types';
import {
  OrganizationMemberDTO,
} from './organizations-members.types';


export class OrganizationsMembersService {
  async getAllMembers(organizationId: OrganizationId, collectionOptions: CollectionOptions): Promise<Collection<OrganizationMemberDTO>> {
    const organization = await organizationsRepository.getModelById(organizationId);


    if (!organization) {
      throw new Errors.NotFoundError(organizationsErrors.withSuchIdNotFound({ organizationId }));
    }

    const organizationMembers = await organizationsMembersRepository.getAllMembersDTOs(organizationId, collectionOptions);

    return {
      data: organizationMembers,
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
