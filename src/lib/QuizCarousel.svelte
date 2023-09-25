<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
  import {onEvent, broadcastEvent} from "cupevents";
  import { onMount } from "svelte";
  import { quizzesStore } from "../Store";
  import { scale } from "svelte/transition";
  export let quizTitle;

  let showOptions = false;


  onMount( () => {
    console.log("quizCarousel mounted");
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
    broadcastEvent("openQuizEditor", quizTitle);
  }

  function deleteQuiz() {
    quizzesStore.update(store => {
      store.splice(store.findIndex(q => q.title == quizTitle), 1);
      return store;
    });
    broadcastEvent("updateQuizzesBasedOnDOM"); //todo drag drop changes store without trigger render on quizzes, 
    //but this backfires when deleting a quiz or add because we now update the store (store.update) and that triggers
    //previous changes to be rendered too
    //option 1. own drag and drop algorithm
    //somehow trigger render on quizzes only when we want to
    deleteQuizInDB();

  }

  function deleteQuizInDB() {
    //todo
  }

  function openQuizInstanceEditor() {
    broadcastEvent("openQuizInstanceEditor", quizTitle);
  }

  // adds a global event listener for clicks
  onEvent("click", hideOptions);
</script>

<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<li class="quiz scale-element" on:dblclick|self={toggleOptions} in:scale={{duration: 300, delay: 100}} out:scale={{duration: 300, delay: 100}}>
  {#if showOptions}
    <div class="options">
      <div on:click|once={openQuizEditor}>E</div>
      <div on:click|once={openQuizInstanceEditor} style="margin-left: 0.5rem;">I</div>
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