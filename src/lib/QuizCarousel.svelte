<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
  import { fade, fly, scale } from "svelte/transition";
  import {onEvent, broadcastEvent} from "cupevents";
  import { QuizDTO, quizzesStore } from "../Store";
  import { onMount } from "svelte";
  export let quizTitle;

  let showOptions = false;

  onMount( () => {
    console.log("onMount in QuizCarousel");
  })

  function toggleOptions() {
    try {
      hideOptions();
    }
    catch (e) {
      console.log(e);
    }
    showOptions = !showOptions;
  }

  function hideOptions(event) {
    showOptions = false;
  }

  function openQuizEditor() {
    broadcastEvent("openQuizEditor");
  }

  function deleteQuiz() {
    console.log("deleteQuiz");
    quizzesStore.update(store => {
      store.splice(store.findIndex(q => q.title == quizTitle), 1);
      return store;
    });
    broadcastEvent("updateQuizzesBasedOnDOM");
  }

  function deployQuiz() {
    console.log("deployQuiz");
  }

  // Add a global event listener for clicks
  onEvent("click", hideOptions);
</script>
<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->

<li class="quiz" on:dblclick|self={toggleOptions} in:scale>
  {#if showOptions}
    <div in:scale out:fade class="options">
      <div on:click|once={openQuizEditor}>E</div>
      <div on:click|once={deployQuiz} style="margin-left: 0.5rem;">I</div>
      <div on:click|once={deleteQuiz}>X</div>
    </div>
  {/if}
  {quizTitle}
</li>

<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
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
    min-height: 4rem;
    min-width: 10vw;
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

  .options > div:hover {
    background-color: var(--color-hightlight);
  }
</style>