<script lang="ts">
  import { createEventDispatcher } from "svelte";

  interface Option {
    value: string;
    label: string;
  }

  export let label: string;
  export let options: Option[] = [];

  let active = false;
  const handleClick = () => {
    active = !active;
  };

  // add a select event to select and options
  const dispatch = createEventDispatcher();
  const handleOptionClick = (option: Option) => {
    dispatch("select", option.value);
    label = option.label;
    active = false;
  };
</script>

<div class="select">
  <button
    on:click={handleClick}
    class="button"
    role="combobox"
    aria-labelledby="select button"
    aria-haspopup="listbox"
    aria-expanded={active}
    aria-controls="dropdown">
    <span class="selected-value">{label}</span>
    <span class="arrow" style={active ? "transform: rotate(180deg)" : ""} />
  </button>
  <ul class="dropdown {active ? 'active' : ''}" role="listbox">
    {#each options as option}
      <li
        role="option"
        aria-selected="false"
        on:click={() => handleOptionClick(option)}
        on:keypress={(e) => {
          if (e.key === "Enter") handleOptionClick(option);
        }}>
        <input type="radio" name={option.label} value="${option.value}" />
        <label for="${option.label}">
          {option.label}
        </label>
      </li>
    {/each}
  </ul>
</div>

<style>
  .select {
    position: relative;
    width: 400px;
    max-width: 100%;
    font-size: 1.15rem;
    color: #000;
  }

  .button {
    width: 100%;
    font-size: 1.15rem;
    background-color: var(--grey-2);
    padding: 0.675em 1em;
    border: 1px solid var(--grey-5);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .selected-value {
    text-align: left;
    color: var(--grey-6);
  }

  .arrow {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid var(--grey-5);
    transition: transform ease-in-out 0.15s;
  }

  .dropdown {
    position: absolute;
    list-style: none;
    width: calc(100% - 1em);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    background-color: var(--grey-2);
    border: 1px solid var(--grey-5);
    border-radius: 8px;
    padding: 0.5em;
    margin-top: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
    transition: 0.15s ease;
    transform: scaleY(0);
    opacity: 0;
    visibility: hidden;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .dropdown:focus-within {
    box-shadow: 0 10px 25px rgba(94, 108, 233, 0.6);
  }

  .dropdown li {
    position: relative;
    cursor: pointer;
    display: flex;
    gap: 1rem;
    align-items: center;
    color: var(--grey-6);
    border-radius: 8px;
    background: var(--gradient-account-2);
  }

  .dropdown li label {
    width: 100%;
    padding: 8px 10px;
    cursor: pointer;
  }

  .dropdown::-webkit-scrollbar {
    width: 7px;
  }

  .dropdown::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 25px;
  }

  .dropdown::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 25px;
  }

  .dropdown li:hover,
  .dropdown input:checked ~ label {
    background-color: #f2f2f2;
  }

  .dropdown input:focus ~ label {
    background-color: #dfdfdf;
  }

  .dropdown input[type="radio"] {
    position: absolute;
    left: 0;
    opacity: 0;
  }

  .active {
    opacity: 1;
    visibility: visible;
    transform: scaleY(1);
  }
</style>
