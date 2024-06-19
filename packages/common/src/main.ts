export type ExampleType = {
  message: string;
};

export function exampleFunction(): ExampleType {
  console.log("Hello from common second");
  return { message: "hello world" };
}
