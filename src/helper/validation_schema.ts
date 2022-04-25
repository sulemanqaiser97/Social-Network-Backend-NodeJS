import Joi from "joi";

const authSchemaValidation = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

const loginSchemaValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export { authSchemaValidation, loginSchemaValidation };
