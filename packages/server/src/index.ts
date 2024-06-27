// server
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { exampleFunction } from "common";

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/", (c) => {
  const obj = exampleFunction();
  return c.json(obj);
});

// Define route handlers
const exampleRouteOne = app.get(
  "/exampleOne",
  zValidator(
    "query",
    z.object({
      name: z.string(),
    })
  ),
  (c) => {
    const { name } = c.req.valid("query");
    return c.json({
      message: `Hello! ${name}`,
    });
  }
);

const exampleRouteTwo = app.get(
  "/exampleTwo/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  (c) => {
    const { id } = c.req.valid("param");

    return c.json({
      message: `You requested the id: ${id}`,
    });
  }
);

export default app;
export type ExampleOneRoute = typeof exampleRouteOne;
export type ExampleTwoRoute = typeof exampleRouteTwo;
