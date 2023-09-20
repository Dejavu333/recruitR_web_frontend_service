<!-- Popup.svelte -->
<script>
    import { broadcastEvent } from "cupevents";
    import dragula from "dragula";
    import { fade, scale } from "svelte/transition";
    import QuizQuestionEditor from "./QuizQuestionEditor.svelte";
    import { onMount } from "svelte";
    import { QuizDTO, QuizQuestionDTO, quizzesStore } from "../../Store";

    export let isOpen = false;
    let quizTitleInp;
    let timeLimitInp;
    let isOrderedQuizInp;
    let answerIndecies = [];


    $: questions = [new QuizQuestionDTO("are you happy?", ["option 1", "option 2", "option 3"], [0]), new QuizQuestionDTO("questionasdasd????", ["option 1", "option 2", "option 3"], [0]), new QuizQuestionDTO("hardquestionasdasd?", ["option 1", "option 2", "option 3"], [0])];
    let selectedQuizQuestionInd = -1;
    let dragulaInstanceForQuizQuestions;

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
            // Configure dragula instance only when isOpen is true and inits variables using setTimeout because when isOpen is true we need to wait for the DOM to be rendered
            setTimeout(() => {
                quizTitleInp = document.getElementById("quizTitleInp");
                timeLimitInp = document.getElementById("timeLimitInp");
                isOrderedQuizInp = document.getElementById("isOrderedQuizInp");
                quizTitleInp.addEventListener("focus", function () {
                    if (quizTitleInp.value == "cannot be empty") quizTitleInp.value = "";
                });

                dragulaInstanceForQuizQuestions = dragula([document.querySelector("#questions-list")]);
                dragulaInstanceForQuizQuestions.on('dragend', () => {
                    //update spans with indecies
                    const questionsList = document.querySelector("#questions-list");
                    const questionSpans = questionsList.querySelectorAll("span");
                    questionSpans.forEach((span, index) => {
                        span.innerText = index + 1 + ". ";
                    });
                });
            }, 100);
        }
    }

    function closeQuizEditor() {
        broadcastEvent("closeQuizEditor");
    }
    
    function saveAndCloseQuizEditor() {
        if (quizTitleInp.value == "") {
            quizTitleInp.value = "cannot be empty";
            return;
        }
        closeQuizEditor();
    }

    function feedQuizQuestionEditor(e) {
    try {
        selectedQuizQuestionInd = Number(e.target.id);
        //highlights selected question
        const questionsList = document.querySelector("#questions-list");
        const questionSpans = questionsList.querySelectorAll("li");
        questionSpans.forEach((span, index) => {
            span.style.backgroundColor = "white";
        });
        e.target.style.backgroundColor = "lightblue";
    } catch (e) {
        console.log(e);
        }
    }

    function addQuizQuestionSkeleton() {
        questions = Array(...questions, new QuizQuestionDTO("new question", [], []));
    }

</script>

  {#if isOpen}
  <div class="popup-background" in:fade out:fade>
    <div class="popup-content">
      <input type="text" placeholder="quiz title" id="quizTitleInp" />
      <!-- <input type="text" placeholder="question" id="quizTitleInp" /> -->
      <input type="text" placeholder="time limit (s)" id="timeLimitInp" />
      <label for="isOrderedQuiz">ordered</label>
      <input type="checkbox" id="isOrderedQuizInp" name="isOrderedQuiz" value="isOrderedQuiz">
      <br>
      <button on:click={addQuizQuestionSkeleton}>add question</button>
      <ul id="questions-list">
        {#each questions as quizQuestion, index}
           <li on:dblclick={feedQuizQuestionEditor} id={String(index)}><span>{index+1}. </span>{trimmedQuestionName(quizQuestion.question)}</li>
        {/each}
      </ul>
      <QuizQuestionEditor bind:questions={questions} bind:selectedQuesitonInd={selectedQuizQuestionInd} />
      <button on:click={closeQuizEditor}>Done</button>
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

    #isOrderedQuizInp {
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
