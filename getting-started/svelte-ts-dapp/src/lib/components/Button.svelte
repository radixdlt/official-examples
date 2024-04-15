<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let href: string | undefined = undefined;
  export let width = "";
  export let background = "";

  const dispatch = createEventDispatcher();

  const handelClick = (event: Event) => {
    dispatch("click", event);
  };
</script>

{#if href}
  <a {href} style:--width={width} style:--background={background}><slot /></a>
{:else}
  <button
    style:--width={width}
    style:--background={background}
    on:click={handelClick}><slot /></button>
{/if}

<style>
  a,
  button {
    cursor: pointer;
    display: flex;
    width: var(--width, 183px);
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: none;
    text-decoration: none;
    cursor: pointer;
    color: var(--grey-6);
    font-size: 1rem;
    font-weight: 600;
    background: var(--background, var(--radix-blue));
  }
</style>
