import { Schema, ValidationResult, ValidationError } from 'joi';

const validatorCompiler = ({ schema }: { schema: Schema }) => async (data: object): Promise<ValidationResult> => {
  try {
    const value = await schema.validateAsync(data, { abortEarly: false });

    return { value, error: undefined };
  } catch (err) {
    return { value: undefined, error: err as ValidationError };
  }
};

export default validatorCompiler;
