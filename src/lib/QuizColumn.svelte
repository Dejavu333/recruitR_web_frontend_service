<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import QuizCarousel from "./QuizCarousel.svelte";

    export let columnTitle;

    function addQuizCarousel() {
        const quizCarousel = new QuizCarousel({
            target: document.getElementById(columnTitle),
            props: {
                carouselTitle: "frominput"
            }
        });
    }
</script>

<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<li class="column to-do-column">
    <div class="column-header">
        <h4>{columnTitle}</h4>
    </div>
    <div class="column-button">
        <button class="button addquiz-button" on:click={addQuizCarousel}>+</button>
    </div>
    <ul class="quiz-list" id="{columnTitle}">
        <!-- generated -->
    </ul>
</li>
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
<style>
    
.column {
  min-width: 9vw;
  padding-bottom:var(--margin-primary);
  margin: 0 1rem;
  background: var(--color-light);
  border-radius: 2rem;
  box-shadow: var(--shadow-primary);


  -webkit-transition: all 0.3s;
}

.column-header {
  height: 4rem;
  border-radius: 2rem;
  padding: 0.1rem;
  box-shadow: var(--shadow-primary);
}
.to-do-column .column-header {
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