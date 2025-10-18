import { z } from 'zod';

const emailFieldSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(254);

export const credentialsSchema = z.object({
  email: emailFieldSchema,
  password: z
    .string()
    .min(8)
    .max(128),
});

export type CredentialsPayload = z.infer<typeof credentialsSchema>;

export const emailOnlySchema = z.object({
  email: emailFieldSchema,
});

export type EmailOnlyPayload = z.infer<typeof emailOnlySchema>;

const assetCreditsSchema = z.union([z.literal('free'), z.number().int().min(0)]);

const assetDownloadOptionSchema = z.object({
  label: z.string().trim().min(1),
  size: z.string().trim().min(1),
  url: z.string().trim().url().optional(),
});

const assetTagsSchema = z.array(z.string().trim().min(1)).optional();

export const assetUpsertSchema = z
  .object({
    id: z.string().trim().min(1).optional(),
    type: z.enum(['MODEL', 'SCENE', 'TEXTURE', 'FEATURED']).default('MODEL'),
    title: z.string().trim().min(1),
    subtitle: z.string().trim().optional(),
    author: z.string().trim().optional(),
    category: z.string().trim().optional(),
    brand: z.string().trim().optional(),
    description: z.string().trim().optional(),
    credits: assetCreditsSchema.optional(),
    size: z.string().trim().optional(),
    aspectRatio: z.string().trim().optional(),
    image: z.string().trim().url(),
    gallery: z.array(z.string().trim().url()).optional(),
    downloadOptions: z.array(assetDownloadOptionSchema).optional(),
    tags: assetTagsSchema,
    status: z.enum(['DRAFT', 'PUBLISHED']).default('PUBLISHED'),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
    date: z.string().trim().optional(),
    views: z.number().int().nonnegative().optional(),
    likes: z.number().int().nonnegative().optional(),
    createdAt: z.string().trim().optional(),
    updatedAt: z.string().trim().optional(),
  })
  .strict();

export type AssetUpsertPayload = z.infer<typeof assetUpsertSchema>;
