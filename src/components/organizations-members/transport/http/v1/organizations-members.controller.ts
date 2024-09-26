import organizationsService from '../../../service/index';
import { CollectionOptions } from '../../../../general/general.types';


export class OrganizationsMembersController {
  getAllMembers = async (req, res) => {
    const { organizationId } = req.params;
    const { sort, where } = req.query;

    const collectionOptions: CollectionOptions = { sort, where };
    const members = await organizationsService.getAllMembers(organizationId, collectionOptions);

    return res.send(members);
  };

  updateMember = async (req, res) => {
    const { organizationId, userId } = req.params;
    const { role } = req.body;

    const updatedMember = await organizationsService.updateMember({ organizationId, userId, role });

    return res.send(updatedMember);
  };

}

export default new OrganizationsMembersController();
