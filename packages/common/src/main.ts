export type ExampleType = {
  message: string;
};

export function exampleFunction(): ExampleType {
  console.log("Hello from common");
  return { message: "hello world" };
}
