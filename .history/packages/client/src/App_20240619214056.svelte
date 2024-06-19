<script lang="ts">
  import { exampleFunction } from "common";

  const test = exampleFunction();

  function notify() {
    webflow.notify({
      type: "Info",
      message: "Hello from the client package",
    });
  }

  async function pingServer() {
    console.log("Pinging server");
    try {
      const url = "http://localhost:8787/hello";
      const response = await fetch(url);
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

  <button on:click={notify}> Send notification </button>
  <button on:click={pingServer}> Ping server </button>
</main>

<style>
</style>
