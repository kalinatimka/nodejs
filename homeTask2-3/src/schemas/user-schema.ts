import Joi from 'joi';
import JoiPassword from 'joi-password';
import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation';

export interface UserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string,
    password: string,
    age: number,
  }
}

export const userSchema = Joi.object({
    login: Joi.string().required(),
    password: JoiPassword.string().min(3).minOfNumeric(1).minOfLowercase(1).minOfUppercase(1).required(),
    age: Joi.number().min(4).max(130).required()
});
