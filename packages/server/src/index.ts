import { Hono } from "hono";
import { cors } from "hono/cors";
import { ExampleType, exampleFunction } from "common";
import { sites } from "../db/schema/sites";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import {
  accessTokenResonseSchema,
  authInfoResponseSchema,
  authUserResponseSchema,
} from "../types/schemas";

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hello, world!");
});

app.get("/example", (c) => {
  const example: ExampleType = exampleFunction();
  return c.json(example);
});

app.get("sites", async (c) => {
  const db = drizzle(c.env.DB);
  const response = await db.select().from(sites).all();
  return c.json(response);
});

app.get("/auth", async (c) => {
  const code = c.req.query().code;

  // If no code is provided, redirect user to Webflow OAuth
  if (!code) {
    return c.redirect(
      `https://webflow.com/oauth/authorize?response_type=code&client_id=${c.env.CLIENT_ID}&scope=app_subscriptions%3Aread+authorized_user%3Aread+cms%3Aread+cms%3Awrite+sites%3Aread+workspace%3Aread`
    );
  }

  try {
    // Fetch access token from Webflow
    const response = await fetch("https://api.webflow.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        grant_type: "authorization_code",
        client_id: c.env.CLIENT_ID,
        client_secret: c.env.CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(
        `Failed to fetch access token: ${response.status} ${response.statusText}. Webflow Response: ${responseBody}`
      );
    }

    const accessTokenResponseData = await response.json();

    // Validate the response data using Zod
    const validatedAccesTokenResponseData = accessTokenResonseSchema.parse(
      accessTokenResponseData
    );

    console.log("Validated response data:", validatedAccesTokenResponseData);

    const { access_token } = validatedAccesTokenResponseData;

    const authInfoUrl = "https://api.webflow.com/v2/token/introspect";
    const authUserUrl = "https://api.webflow.com/v2/token/authorized_by";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    const authInfoResponse = await fetch(authInfoUrl, options);
    const authUserResponse = await fetch(authUserUrl, options);
    const authInfoData = await authInfoResponse.json();
    const authUserData = await authUserResponse.json();

    const authInfoDataValidated = authInfoResponseSchema.parse(authInfoData);
    const authUserDataValidated = authUserResponseSchema.parse(authUserData);

    if (!authInfoResponse.ok || !authUserResponse.ok) {
      throw new Error(
        `Failed to fetch auth info: ${authInfoResponse.status} ${authInfoResponse.statusText}.`
      );
    }

    const authorizedSiteIds =
      authInfoDataValidated.authorization.authorizedTo.siteIds;
    const authorizedWorkspaceIds =
      authInfoDataValidated.authorization.authorizedTo.workspaceIds;

    if (authorizedWorkspaceIds.length > 0) {
      throw new Error(
        "Workspace authorization is not supported yet. Please go back and select by site."
      );
    }

    // for specific sites.
    for (const siteId of authorizedSiteIds) {
      // Check for existing site in Dq drizzle
      const db = drizzle(c.env.DB);
      let existingSite = await db
        .select()
        .from(sites)
        .where(eq(sites.siteId, siteId))
        .get();

      if (!existingSite) {
        // insert the new site into the database
        const response = await db.insert(sites).values({
          siteId,
          accessToken: access_token,
        });

        console.log("Inserted site:", response);
      } else {
        // update existing site with new access token
        const response = await db
          .update(sites)
          .set({ accessToken: access_token })
          .where(eq(sites.siteId, siteId))
          .run();

        console.log("Updated site:", response);
      }
    }

    // Redirect user to a success page or the main application
    return c.redirect("https://webflow.com/dashboard");
  } catch (err) {
    const error = err as Error;
    console.error(error);
    const errorDetails = {
      name: error.name,
      message: error.message,
    };
    c.status(401);
    return c.text(JSON.stringify(errorDetails));
  }
});

export default app;
