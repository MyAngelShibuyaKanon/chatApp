import { z } from "@hono/zod-openapi";

// --- Type helpers ---

// Checks for extra keys in schema not defined in the model
type ExtraKeys<Schema, Model> = Exclude<keyof Schema, keyof Model>;

// If there are extra keys, raise a type error
type ThrowIfExtraKeys<Schema, Model>
  = ExtraKeys<Schema, Model> extends never ? unknown : { [key: string]: never };

// --- Main utility function ---
export function withZodSchema<Model>() {
  return <
    Schema extends { [K in keyof Model]: z.ZodType<Model[K]> } & ThrowIfExtraKeys<
      Schema,
      Model
    >,
  >(
    schema: Schema,
  ): z.ZodObject<Schema, z.core.$strip> => {
    return z.object(schema);
  };
}

export function fromZodSchema<Model>() {
  return <
    Schema extends
    { [K in keyof Model]: z.ZodType<Model[K]> }
    & ThrowIfExtraKeys<z.infer<Schema>, Model>,
  >(
    schema: Schema,
  ): z.ZodObject<Schema, z.core.$strip> & { _model: Model } => {
    return z.object(schema) as any;
  };
}
export function validateZodSchema<Model>() {
  return <
    Schema extends z.ZodObject<z.ZodRawShape>
    & ThrowIfExtraKeys<z.output<Schema>, Model>
    & ThrowIfExtraKeys<Model, z.output<Schema>>,
  >(schema: Schema): Schema => {
    return schema;
  };
}
