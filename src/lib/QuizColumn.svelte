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
  min-width: 8.4rem;
  margin: 0 0.6rem;
  background: var(--color-primary);
  border: var(--color-light-primary) 0.2rem solid;
  border-radius: 0.2rem;
}

.column-header {
  padding: 0.1rem;
  border-bottom: var(--color-light-primary) 0.2rem solid;
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
  background-color: var(--color-primary-dark);
  margin: 0.1rem auto 0.6rem auto;
}
.addquiz-button:hover {
  background-color: var(--color-hightlight);
}
</style>