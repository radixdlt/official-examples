<script>
  export let href = undefined;
  export let width = "";
  export let background = "";
</script>

{#if href}
  <a {href} style:--width={width} style:--background={background}><slot /></a>
{:else}
  <button style:--width={width} style:--background={background}
    ><slot /></button>
{/if}

<style>
  a,
  button {
    display: flex;
    width: var(--width, 183px);
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
</style>
