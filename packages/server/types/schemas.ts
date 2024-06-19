import { z } from "zod";

export const accessTokenResonseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string(),
});

export const authInfoResponseSchema = z.object({
  authorization: z.object({
    id: z.string(),
    createdOn: z.string(),
    lastUsed: z.string(),
    grantType: z.string(),
    rateLimit: z.number(),
    scope: z.string(),
    authorizedTo: z.object({
      siteIds: z.array(z.string()),
      workspaceIds: z.array(z.string()),
      userIds: z.array(z.string()),
    }),
  }),
});

export const authUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});
