<!-- Popup.svelte -->
<script>
    import { broadcastEvent } from "cupevents";
    import dragula from "dragula";
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import QuizQuestionEditor from "./QuizQuestionEditor.svelte";

    export let isOpen = false;

    class QuizQuestion {
        question;
        options = [];
        isMultipleChoice = false;
        answerIndecies = [];
        constructor(question, options, isMultipleChoice, answerIndecies) {
            this.question = question;
            this.options = options;
            this.isMultipleChoice = isMultipleChoice;
            this.answerIndecies = answerIndecies;
        }
    }

    $: questions = [new QuizQuestion("are you happy?", ["option 1", "option 2", "option 3"], false, [0]), new QuizQuestion("questionasdasd????", ["option 1", "option 2", "option 3"], false, [0]), new QuizQuestion("hardquestionasdasd?", ["option 1", "option 2", "option 3"], false, [0])];
    let selectedQuizQuestion = new QuizQuestion("question 1", ["option 1", "option 2", "option 3"], false, [0]);
    let dragulaInstanceForQuizQuestions;

    onMount(() => {
        dragulaInstanceForQuizQuestions?.destroy();
        dragulaInstanceForQuizQuestions = configurateDragulForQuizQuestions();
    });

    // function updateQuestionNames() {
      
    // }

    function trimmedQuestionName(questionName) {
        if (questionName?.length > 10) {
            return questionName.substring(0, 10) + "...";
        }
        return questionName;
    }
    $: isOpen && configurateDragulForQuizQuestions();

    function configurateDragulForQuizQuestions() {
        console.log("configurateDragulForQuizQuestions");
        if (isOpen) {
            // Configure dragula instance only when isOpen is true
            setTimeout(() => {
                console.log("list:" + document.querySelector("#questions-list"));
                dragulaInstanceForQuizQuestions = dragula([document.querySelector("#questions-list")]);
                dragulaInstanceForQuizQuestions.on('dragend', () => {
                    //update spans with indecies
                    const questionsList = document.querySelector("#questions-list");
                    const questionSpans = questionsList.querySelectorAll("span");
                    questionSpans.forEach((span, index) => {
                        span.innerText = index + 1 + ".";
                    });
                });
            }, 100);
        }
    }

    $: console.log("isOpen", isOpen);

    function closeQuizEditor() {
        broadcastEvent("closeQuizEditor");
    }

    function feedQuizQuestionEditor(e) {
        const questionIndex = questions.indexOf(e.target.innerText);
        selectedQuizQuestion = new QuizQuestion("question " + (questionIndex + 1), ["option 1", "option 2", "option 3"], false, [0]); //todo array must contain indecies of correct answers
    }

    function addQuizQuestion() {
        questions = [...questions, new QuizQuestion("asdasdasddddd" + (questions.length + 1), ["option 1", "option 2", "option 3"], false, [0])];
    }

    // $: configurateDragulForQuizQuestions();
    // $: addQuizQuestion();

</script>
  
  {#if isOpen}
  <div class="popup-background" in:fade out:fade>
    <div class="popup-content">
      <input type="text" placeholder="quiz title" />
      <input type="text" placeholder="time limit (s)" />
      <label for="isOrderedQuiz">ordered</label>
      <input type="checkbox" id="isOrderedQuiz" name="isOrderedQuiz" value="isOrderedQuiz">
      <br>
      <button on:click={addQuizQuestion}>add question</button>
      <ul id="questions-list">
        {#each questions as quizQuestion, index}
           <li on:dblclick={feedQuizQuestionEditor}><span>{index+1}.</span>{trimmedQuestionName(quizQuestion.question)}</li>
        {/each}
      </ul>
      <QuizQuestionEditor quizQuestion={selectedQuizQuestion} />
      <button on:click={closeQuizEditor}>Save</button>
      <button on:click={closeQuizEditor}>Cancel</button>
    </div>
  </div>
  {/if}
  
  <!-- <button on:click={openPopup}>Open Popup</button> -->
  
  <style>
    /* Add your blur CSS here */
    .popup-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
      backdrop-filter: blur(10px); /* Apply blur to the background */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }
  
    .popup-content {
      min-width: 20vw;
      background-color: var(--color-white);
      padding: 20px;
      border-radius: 2rem;
    }

    #isOrderedQuiz {
      width: 1rem;
      height: 1rem;
    }

    #questions-list {
      list-style-type: none;
      border: 1px solid black;
    }

    #questions-list li {
      margin: 1rem;
      border-bottom: 1px solid black;
    }
  </style>
  