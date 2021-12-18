import Joi from 'joi';
import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation';

export interface AutoSuggestRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    loginSubstring: string,
    limit: number,
  }
}

export const autoSuggestSchema = Joi.object({
    loginSubstring: Joi.string().required(),
    limit: Joi.number().required()
});
