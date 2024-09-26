import screenService from '../../../service';
import { ScreenCreationAttributes, ScreenServiceUpdatableAttributes } from '../../../service/screens.types';
import { CollectionOptions } from '../../../../general/general.types';


export class ScreensController {
  create = async (req, res) => {
    const { organizationId } = req.params;
    const { name, notes, location } = req.body;

    const newVehicleData: ScreenCreationAttributes = {
      organizationId,
      name,
      notes,
      location,
    };

    const screen = await screenService.create(newVehicleData);

    return res.status(200).send(screen);
  };

  getAllForOrganization = async (req, res) => {
    const { organizationId } = req.params;
    const { sort, where } = req.query;

    const collectionOptions: CollectionOptions = { sort, where };
    const collection = await screenService.getAllForOrganization(organizationId, collectionOptions);

    return res.status(200).send(collection);
  };

  getByIdForOrganization = async (req, res) => {
    const { organizationId, screenId } = req.params;

    const screen = await screenService.getByIdForOrganization({ organizationId, screenId });

    return res.status(200).send(screen);
  };

  updateByIdForOrganization = async (req, res) => {
    const { organizationId, screenId } = req.params;
    const { name, notes, location } = req.body;

    const fieldsToUpdate: ScreenServiceUpdatableAttributes = { name, notes, location };
    const updatedScreen = await screenService.updateByIdForOrganization({ organizationId, screenId, fieldsToUpdate });

    return res.status(200).send(updatedScreen);
  };

  deleteByIdForOrganization = async (req, res) => {
    const { organizationId, screenId } = req.params;

    await screenService.deleteByIdForOrganization({ organizationId, screenId });

    return res.status(200).send({ message: 'Screen deleted successfully.' });
  };

  activate = async (req, res) => {
    const { code } = req.body;

    await screenService.activate(code);

    return res.status(200).send({ message: 'Screen activated successfully.' });
  };


}

export default new ScreensController();
