<script>
  import { createEventDispatcher } from "svelte";

  export let href = undefined;
  export let disabled = false;
  export let loading = false;

  const dispatch = createEventDispatcher();

  const handelClick = (event) => {
    dispatch("click", event);
  };
</script>

{#if href}
  <a class:loading class:disabled {href}><slot /></a>
{:else}
  <button class:loading class:disabled {disabled} on:click={handelClick}
    ><slot /></button>
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
    color: var(--grey-6);
    font-size: 1rem;
    font-weight: 600;
    background: var(--background, var(--radix-blue));
  }

  .disabled {
    cursor: not-allowed;
    color: var(--grey-5);
    background: var(--grey-4);
  }

  .loading {
    color: transparent;
    cursor: not-allowed;
    pointer-events: none;
  }
  .loading::after {
    position: absolute;
    content: "";
    width: 1rem;
    height: 1rem;
    border: 0.2rem solid var(--grey-6);
    border-top-color: var(--radix-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
