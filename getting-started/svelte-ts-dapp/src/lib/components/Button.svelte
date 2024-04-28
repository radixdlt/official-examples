<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let href: string | undefined = undefined;

  const dispatch = createEventDispatcher();

  const handelClick = (event: Event) => {
    dispatch("click", event);
  };
</script>

{#if href}
  <a {href}><slot /></a>
{:else}
  <button on:click={handelClick}><slot /></button>
{/if}

<style>
  a,
  button {
    cursor: pointer;
    display: flex;
    width: var(--width, 183px);
    max-width: var(--max-width, 100%);
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
