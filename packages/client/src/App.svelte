<script lang="ts">
  import { exampleFunction } from "common";
  import {
    type ExampleOneRoute,
    type ExampleTwoRoute,
  } from "../../server/src/index";
  import { hc } from "hono/client";
  import Counter from "./lib/Counter.svelte";

  // Put your server address here
  const localServerAddress = `https://ai-alt-51.localcan.dev`;

  /**
   * Initialize the typesafe client
   * http://localhost:8787 is the server address, but we need https for webflow
   * I'm using a Local Can to proxy to a secure connection
   * https://www.localcan.com/?aff=9g86n
   */
  const client = hc<ExampleOneRoute & ExampleTwoRoute>(localServerAddress);

  // Example function coming from the common package
  const test = exampleFunction();
  console.log("Common package message");
  console.log({ test });

  // Example function in the client package
  function notify() {
    webflow.notify({
      type: "Info",
      message: "Hello from the client package",
    });
  }

  // Example call to the server
  async function pingExampleRouteOne() {
    console.log(`Pinging example route one`);
    try {
      const response = await client.exampleOne.$get({
        query: {
          name: "Web Bae",
        },
      });
      const data = await response.json();
      webflow.notify({
        type: "Success",
        message: data.message,
      });
    } catch (e) {
      const error = e as Error;
      webflow.notify({
        type: "Error",
        message: error.message,
      });
      console.error(error);
    }
  }

  async function pingExampleTwoRoute() {
    try {
      const response = await client.exampleTwo[":id"].$get({
        param: {
          id: "123",
        },
      });
      const data = await response.json();
      webflow.notify({
        type: "Success",
        message: data.message,
      });
    } catch (e) {
      const error = e as Error;
      webflow.notify({
        type: "Error",
        message: error.message,
      });
      console.error(error);
    }
  }
</script>

<main>
  <p>Client package</p>

  <p>Open the console to see the message from the common package</p>
  <p>{test.message}</p>

  <div class="button-wrap">
    <button on:click={notify}> Send notification </button>
    <button on:click={pingExampleRouteOne}> Ping Example Route One </button>
    <button on:click={pingExampleTwoRoute}> Ping Example Route Two </button>
    <Counter />
  </div>
</main>

<style>
  .button-wrap {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
