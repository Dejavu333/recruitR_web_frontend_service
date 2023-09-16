<!-- svelte -->

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

<style>
</style>