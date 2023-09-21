<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import { onMount } from "svelte";
    import { QuizDTO, quizzesStore } from "../Store";
    import QuizCarousel from "./QuizCarousel.svelte";
    import { broadcastEvent } from "cupevents";

    export let columnTitle;
    let quizzesOfThisColumn;
    let thisColumnDOMRepres;
    $: 
    {
      quizzesOfThisColumn = $quizzesStore.filter(q => q.columnNameItBelongsTo == columnTitle).sort((a, b) => a.indexInColumn - b.indexInColumn); 
      console.log("thiscolumnquizzes",quizzesOfThisColumn);
    // delete every quizcarousel in this column
    const thisColumnDOMRepres = document.getElementById(columnTitle);
    if (thisColumnDOMRepres!=undefined) {
    while (thisColumnDOMRepres.children.length > 0) {
        thisColumnDOMRepres.removeChild(thisColumnDOMRepres.firstChild);
    }

    //add every quizcarousel in this column
      quizzesOfThisColumn.forEach(q => {
          const quizCarousel = new QuizCarousel({
              target: document.getElementById(columnTitle),
              props: {
                  quizTitle: q.title
              }
          });
          });
        }
    }
        

    onMount(() => {
    thisColumnDOMRepres = document.getElementById(columnTitle);
    console.log("onMount in QuizColumn");
    });


    function addQuizCarouselSkeleton() {
      // // const quizCarousel = new QuizCarousel({
      // //     target: document.getElementById(columnTitle),
      // //     props: {
      // //         carouselTitle: "untitled"
      // //     }
      // // });
      // console.log(quizzesOfThisColumn);
      quizzesStore.update(store => {
        console.log("_______________",columnTitle);
        let ind = thisColumnDOMRepres.children.length;
            if (store.find(q => q.title == "untitled")) {
                console.log("found untitled");
                let i = 1;
                while (store.find(q => q.title == "untitled" + i)) {
                    i++;
                }
                store.push(new QuizDTO(columnTitle, ind, "untitled" + i));
                return store;
            }
            store.push(new QuizDTO(columnTitle, ind, "untitled"));
            return store;
        });
    }
</script>

<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<li class="column default-quiz-column" >
    <div class="column-header">
        <h4>{columnTitle}</h4>
    </div>
    <div class="column-button">
        <button class="button addquiz-button" on:click={addQuizCarouselSkeleton}>+</button>
    </div>
    <ul class="quiz-list" id="{columnTitle}">
      <!-- {#each $quizzesStore.filter(q => q.columnNameItBelongsTo == columnTitle).sort((a, b) => a.indexInColumn - b.indexInColumn) as quiz}
        {#if quiz.columnNameItBelongsTo == columnTitle}
          <QuizCarousel quizTitle={quiz.title} />
        {/if}
      {/each} -->
    </ul>
</li>
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
<style>
    
.column {
  width: fit-content;
  min-width: 13vw;
  margin: 1rem;
  padding-bottom:var(--margin-primary);
  background: var(--color-light);
  border-radius: 2rem;
  box-shadow: var(--shadow-primary);
}

.column-header {
  height: 4rem;
  border-radius: 2rem;
  padding: 0.1rem;
  box-shadow: var(--shadow-primary);
}
.default-quiz-column .column-header {
  background: var(--color-primary);
}
.quiz-list {
  min-height: 3rem;
}

.column-button {
  text-align: center;
  padding: 0.1rem;
}
.addquiz-button {
  background-color: var(--color-primary);
  margin: 0.6rem auto 0.6rem auto;
}
.addquiz-button:hover {
  background-color: var(--color-hightlight);
}
</style>