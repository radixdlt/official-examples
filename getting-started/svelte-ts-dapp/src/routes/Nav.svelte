<script>
  import radixLogo from "$lib/assets/radix-logo-dark.png";
  import developerImg from "$lib/assets/developer-img.png";
</script>

<nav>
  <div class="navbar">
    <img src={radixLogo} alt="scrypto logo" />
    <img src={developerImg} alt="radix logo" />
  </div>
  <div class="connect-btn">
    <radix-connect-button />
  </div>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    border-bottom: 1px solid var(--grey-3);
    background: var(--grey-2);
    padding: 1rem 4rem;
  }
  @media (max-width: 768px) {
    nav {
      padding: 1rem;
    }
  }

  .connect-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    --radix-connect-button-width: 11.25rem;
    --radix-connect-button-height: 2.875rem;
    --radix-connect-button-border-radius: 0.5rem;
  }
  @media (max-width: 384px) {
    .connect-btn {
      --radix-connect-button-width: 100px;
    }
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
  }
</style>
