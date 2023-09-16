<script>
  import { fade, scale } from "svelte/transition";
  export let carouselTitle;
  let showOptions = false;

  function toggleOptions() {
    try {
      hideOptions();
    }
    catch (e) {
      console.log(e);
    }
    showOptions = !showOptions;
  }

  // Function to hide options when clicking somewhere else on the page
  function hideOptions(event) {
    showOptions = false;
  }

  // Add a global event listener for clicks
  document.addEventListener('click', hideOptions);
</script>

<style>
  .quiz {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style-type: none;
    background: var(--color-white);
    transition: all 0.3s;
    margin: 1rem;
    height: 4rem;
    width: 11vw;
    cursor: move;
    text-align: center;
    box-shadow: var(--shadow-primary);
    border-radius: 2rem;
  }

  .options {
    position: absolute;
    bottom: -2rem; /* Position slightly below the quiz item */
    text-align: center;
    left: 100%;
    top: -10%;
  }

  .options > div {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
    cursor: pointer;
    margin: 0.1rem;
    box-shadow: var(--shadow-primary);
    border-radius: 10rem;
    background-color: var(--color-secondary);
  }
</style>

<li class="quiz" on:dblclick={toggleOptions}>
  {#if showOptions}
    <div in:scale out:fade class="options">
      <div>E</div>
      <div style="margin-left: 0.5rem;">I</div>
      <div>X</div>
    </div>
  {/if}
  <p>{carouselTitle}</p>
</li>
