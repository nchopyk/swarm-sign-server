import screenService from '../../../service';


export class ScreensController {
  activate = async (req, res) => {
    const { code } = req.body;

    await screenService.activate(code);

    return res.status(200).send({ message: 'Screen activated successfully.' });
  };


}

export default new ScreensController();
