import organizationsService from '../../../service/index';


export class OrganizationsController {
  getById = async (req, res) => {
    const { organizationId } = req.params;

    const organization = await organizationsService.getById(organizationId);

    return res.send(organization);
  };

  update = async (req, res) => {
    const { organizationId } = req.params;
    const { name } = req.body;

    const fieldsToUpdate = { name };

    const updatedOrganization = await organizationsService.update(organizationId, fieldsToUpdate);

    return res.send(updatedOrganization);
  };

  delete = async (req, res) => {
    const { organizationId } = req.params;

    await organizationsService.delete(organizationId);

    return res.send({ message: 'Organization was successfully deleted' });
  };
}

export default new OrganizationsController();
