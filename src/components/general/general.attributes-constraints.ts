import Joi from 'joi';

const generalAttributesConstraints = {
  redirectUrlWithCode: Joi.string()
    .uri()
    .min(1)
    .max(500)
    .custom((value) => {
      if (!value.includes(':code')) {
        throw new Error('"redirectUrl" must contain ":code"');
      }

      return value;
    }),

  JWTToken: Joi.string().min(1).max(500),

  redirectUrl: Joi.string().uri().min(1).max(500),

  coordinates: Joi.object().keys({
    lat: Joi.number().min(-90).max(90),
    lng: Joi.number().min(-180).max(180),
  }),

  modelRelation: Joi.valid(null), // used only with nullable operator in models like trip.<field>
};

export default generalAttributesConstraints;
