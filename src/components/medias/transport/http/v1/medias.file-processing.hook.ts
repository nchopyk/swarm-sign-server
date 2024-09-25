import Errors from '../../../../../errors';
import mediasErrors from '../../../service/medias.errors';

export default async (req, res) => {
  if (!req.isMultipart()) {
    throw new Errors.BadRequest(mediasErrors.notMultipartFormData());
  }

  const parts = req.parts();

  if (!parts) {
    throw new Errors.BadRequest(mediasErrors.noFieldsProvided());
  }

  if (!req.body) {
    req.body = {};
  }

  for await (const part of parts) {
    if (part.type === 'file') {
      const { filename, mimetype, fieldname, encoding } = part;
      const data = await part.toBuffer();

      req.body[fieldname] = {
        filename,
        mimetype,
        encoding,
        size: data.length,
      };

      req['file'] = data;
    } else {
      const { fieldname, value } = part;

      req.body[fieldname] = value;
    }
  }
};
