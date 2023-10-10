<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
  import { onMount } from "svelte";
  import { QuizDTO, quizzesStore } from "../../../store";
  import QuizCarousel from "./QuizCarousel.svelte";

  // variables, constants
  //====================================================================================================
  export let columnTitle;
  let thisColumnDOMRepres;
  $: quizzesOfThisColumn = $quizzesStore.filter(q => q.columnNameItBelongsTo == columnTitle).sort((a, b) => a.indexInColumn - b.indexInColumn);
  
  // setup
  //====================================================================================================
  onMount(() => {
    thisColumnDOMRepres = document.getElementById(columnTitle);
    console.log("QuizColumn mounted");
  });

  // functions
  //====================================================================================================
  function addQuizCarouselSkeleton() {
    quizzesStore.update(store => {
      let ind = thisColumnDOMRepres.children.length;
      if (store.find(q => q.title == "<<quiz>>")) {
        console.log("found quiz");
        let i = 1;
        while (store.find(q => q.title == i +". <<quiz>>")) { //todo no. should be in spans
          i++;
        }
        store.push(new QuizDTO(columnTitle, ind, i +". <<quiz>>"));
        return store;
      }
      store.push(new QuizDTO(columnTitle, ind, "<<quiz>>"));
      return store;
    });
  }
</script>

<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<li class="column default-quiz-column">
  <div class="column-header">
    <h4>{columnTitle}</h4>
  </div>
  <div class="column-button">
    <button class="button addquiz-button" on:click={addQuizCarouselSkeleton}>+</button>
  </div>
  <ul class="quiz-list" id="{columnTitle}">
    {#each quizzesOfThisColumn as quiz (quiz.title)}
        <QuizCarousel quizTitle={quiz.title} />
    {/each}
  </ul>
</li>
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
<style>
  .column {
    width: fit-content;
    min-width: 13vw;
    margin: 1rem;
    padding-bottom: var(--margin-primary);
    background: var(--color-light);
    border-radius: 2rem;
    box-shadow: var(--shadow-primary);
  }

  .column-header {
    height: 4rem;
    border-radius: 2rem;
    padding: 0.1rem;
    box-shadow: var(--shadow-primary);
    background-color: var(--color-light) !important;

  }

  .default-quiz-column .column-header {
    background: var(--color-primary);
  }

  .quiz-list {
    min-height: 3rem;
  }

  .column-button {
    text-align: center;
  }

  .addquiz-button {
    background-color: var(--color-light);
    margin: 0.6rem auto 0.6rem auto;
  }

  .addquiz-button:hover {
    background-color: var( --color-highlight-light);
  }
</style>