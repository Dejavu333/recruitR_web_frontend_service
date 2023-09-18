<script>
    export let quizQuestion;
</script>

<div>
    <p>{quizQuestion.question}</p>
    <ul>
        {#each quizQuestion.options as option}
        <li>{option}</li>
        {/each}
    </ul>
    <p>{quizQuestion.isMultipleChoice}</p>
    <ul>
        {#each quizQuestion.answerIndecies as answerIndex}
        <li>{answerIndex}</li>
        {/each}
    </ul>
</div>