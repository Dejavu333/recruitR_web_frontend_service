<script>
    import { onMount } from "svelte";
    import { quizzesStore } from "../../Store";

    export let selectedQuesitonInd;
    export let questions;

    function addopt() {
        questions[selectedQuesitonInd].options.push("new option");
        rerender();
    }
  
    function updateOption(e, index) {
        questions[selectedQuesitonInd].options[index] = e.target.value;
    }

    function updateQuesion(e) {
        questions[selectedQuesitonInd].question = e.target.value;
    }

    function rerender() {
        questions[selectedQuesitonInd] = {...questions[selectedQuesitonInd]};
    }
</script>

{#if selectedQuesitonInd != -1}
     <div>
         <input id="questionTextInp" type="text" value={questions[selectedQuesitonInd].question} on:blur={(e) => updateQuesion(e)} />
    <ul>
        {#each questions[selectedQuesitonInd].options as option, index}
        <div class="optionDiv"><input type="text" value={option} on:blur={(e) => updateOption(e, index)} /></div>
        {/each}
    </ul>
    <ul>
        {#each questions[selectedQuesitonInd].answerIndecies as answerIndex}
        <li>{answerIndex}</li>
        {/each}
    </ul>
    <button on:click={addopt}>add opt</button>
</div>
{/if}

<style>
    .optionDiv {
        display: inline-block;
        margin: var(--margin-primary);
    }

    #questionTextInp {
        width: 60%;
        height: 4rem;
    }
</style>