<script>
  import { createEventDispatcher } from "svelte";

  export let label;
  export let options = [];
  export let disabled = false;

  let active = false;
  let selected = { label, value: "", style: "" };
  // if label changes or options changes to empty, reset selected
  $: if (label || !options[0]) {
    selected = {
      label: label,
      value: "",
      style: "",
    };
  }

  const handleClick = () => {
    active = !active;
  };

  // add a select event to select and options
  const dispatch = createEventDispatcher();
  const handleOptionClick = (option) => {
    selected = option;
    dispatch("select", selected.value);
    active = false;
  };
</script>

<div class="select">
  <button
    on:click={handleClick}
    class="button"
    role="combobox"
    aria-label="Select an Account"
    aria-haspopup="listbox"
    aria-expanded={active}
    aria-controls="dropdown"
    style={selected.style}
    {disabled}>
    <span class="selected-value">{selected.label}</span>
    <span class="arrow" style={active ? "transform: rotate(180deg)" : ""} />
  </button>
  <ul class="dropdown {active ? 'active' : ''}" role="listbox">
    {#each options as option}
      <li
        role="option"
        aria-selected="false"
        style={option.style}
        on:click={() => handleOptionClick(option)}
        on:keypress={(e) => {
          if (e.key === "Enter") handleOptionClick(option);
        }}>
        <label for="${option.label}">
          {option.label}
        </label>
        <input
          type="radio"
          name={option.label}
          value="${option.value}"
          checked={selected.value === option.value} />
      </li>
    {/each}
  </ul>
</div>

<style>
  .select {
    position: relative;
    width: 24rem;
    max-width: 100%;
    font-size: 1.15rem;
    font-weight: 500;
  }
  @media (max-width: 768px) {
    .select {
      max-width: 24rem;
      width: 100%;
    }
  }

  .button {
    width: 100%;
    font-size: 1.15rem;
    color: var(--grey-6);
    background-color: var(--grey-2);
    padding: 0.675em 1em;
    border: 1px solid var(--grey-5);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .button:disabled {
    cursor: not-allowed;
    color: var(--grey-5);
    background-color: var(--grey-4);
  }

  .selected-value {
    text-align: left;
    line-height: 1.5;
    font-weight: 500;
  }
  .arrow {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid var(--grey-6);
    transition: transform ease-in-out 0.15s;
  }
  .button:disabled .arrow {
    border-top: 6px solid var(--grey-5);
  }
  .dropdown {
    position: absolute;
    list-style: none;
    width: 100%;
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
    z-index: 1;
  }

  .dropdown:focus-within {
    box-shadow: 0 10px 25px rgba(94, 108, 233, 0.6);
  }

  .dropdown li {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--grey-6);
    border-radius: 8px;
    padding-left: 1em;
  }

  .dropdown li label {
    width: 100%;
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

  .dropdown input[type="radio"] {
    margin: 1rem;
    cursor: pointer;
  }

  .active {
    opacity: 1;
    visibility: visible;
    transform: scaleY(1);
  }
</style>
