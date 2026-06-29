# React Hook Form + Zod conventions

## Schema location

Co-located `ComponentName.schema.ts` next to the component. Exports exactly three things:

```ts
export const schema = z.object({ ... });
export type FormValues = z.infer<typeof schema>;
export const DEFAULTS: FormValues = { ... };
```

No UI or component dependencies in schema files.

## No Zod transforms

`.transform()` is banned in form schemas. Validate as string, coerce manually in `onSubmit`:

```ts
// schema
price: z.string().min(1, "Required").refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Must be positive"),

// onSubmit
const dto = { price: parseFloat(data.price) };
```

Single type per form: `FormValues = z.infer<typeof schema>`. No `FormIn`/`FormOut`.

## useForm setup

```ts
useForm<FormValues>({
  resolver: zodResolver(schema),
  mode: "onTouched",
  defaultValues: DEFAULTS,
});
```

`"onTouched"` — validates on blur first, switches to onChange after touch. Never `"onChange"`.

## Form element

Always `<Box as="form" onSubmit={handleSubmit(onSubmit)}>` + `<Button type="submit">`. Never a button with onClick workaround.

## Submit loading state

`formState.isSubmitting` only. Not TanStack `isPending`.

## Server errors

```ts
async function onSubmit(data: FormValues) {
  try {
    await mutate.mutateAsync(dto);
    onSuccess();
  } catch {
    setError("root", { message: "Save failed. Please try again." });
  }
}
```

Render `errors.root` near the submit button.

## register vs Controller

- `register()` — native HTML: `<Input>`, `<NativeSelectField>`, `<Textarea>`
- `Controller` — Chakra composites, Stripe elements, any non-native ref

## watch()

Reserve for reactive derived state (e.g. conditional field visibility). Never for styling.

## FormField

Renders a `<label>` via `htmlFor`. Pass `name` + matching `id`:

```tsx
<FormField name="price" label="Price" error={errors.price}>
  <Input id="price" {...register("price")} />
</FormField>
```

Props: `name` (required, drives `htmlFor`), `label` (optional), `error` (`FieldError | string`), `flex` (layout).

## Form logic location

Stays in the component file. No custom hook unless genuinely reused across multiple components.
