import Joi from 'joi';
import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation';

export interface GroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string,
    permissions: string[],
  }
}

export const groupSchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).required()
});
