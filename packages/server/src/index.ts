import { Hono } from "hono";
import { cors } from "hono/cors";
import { ExampleType, exampleFunction } from "common";

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

export default app;
