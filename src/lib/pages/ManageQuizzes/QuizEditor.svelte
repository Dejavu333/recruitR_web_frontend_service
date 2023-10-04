<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import { broadcastEvent } from "cupevents";
    import dragula from "dragula";
    import { fade, scale } from "svelte/transition";
    import { onMount } from "svelte";
    import { QuizDTO, QuizQuestionDTO, quizzesStore } from "../../../store";

    export let currentlyEditedQuizTitle;
    let quizTitleInp;
    let timeLimitInp;
    let isOrderedQuizInp;
    let isOrderedOptionsInp;

    $: quiz = $quizzesStore.find(q => q.title == currentlyEditedQuizTitle);
    $: questions = $quizzesStore.find(q => q.title == currentlyEditedQuizTitle)?.quizQuestions ?? [];
    let selectedQuizQuestionInd = -1;
    let dragulaInstanceForQuizQuestions;

    function trimmedQuestionName(questionName) {
        if (questionName?.length > 16) {
            return questionName.substring(0, 16) + "...";
        }
        return questionName;
    }

    onMount (() => {
        console.log("QuizEditor mounted");
        configurateDragulForQuizQuestions();
        quizTitleInp = document.getElementById("quizTitleInp");
        timeLimitInp = document.getElementById("timeLimitInp");
        isOrderedQuizInp = document.getElementById("isOrderedQuizInp");
        quizTitleInp.addEventListener("focus", function () {
            if (quizTitleInp.value == "cannot be empty") quizTitleInp.value = "";
        });
    });

    function configurateDragulForQuizQuestions() {
        console.log("configurateDragulForQuizQuestions");

        dragulaInstanceForQuizQuestions = dragula([document.querySelector("#questions-list")]);
        dragulaInstanceForQuizQuestions.on('drop', () => {
            //update spans with indecies
            const questionsList = document.querySelector("#questions-list");
            const questionSpans = questionsList.querySelectorAll("span");
            //updates questions array based on positions in DOM
            const reorderedQuestions = [];
            questionSpans.forEach((span, index) => {
                reorderedQuestions.push(questions[Number(span.parentElement.id)]);
            });
            questions = reorderedQuestions;
           
        });
    }

    function closeQuizEditor() {
        broadcastEvent("closeQuizEditor");
    }
    
    function saveAndCloseQuizEditor() {
        if (quizTitleInp.value == "") {
            quizTitleInp.value = "cannot be empty";
            return;
        }
        //todo check if title already exists
        quizzesStore.update(store => {
            const quiz = store.find(q => q.title == currentlyEditedQuizTitle)
            quiz.title = quizTitleInp.value;
            quiz.timeLimit = timeLimitInp.value;
            quiz.isOrdered = isOrderedQuizInp.checked;
            quiz.quizQuestions = questions;
            return store;
        });

        upsertQuizInDB(quiz);
        closeQuizEditor();
    }

    function upsertQuizInDB(quiz) {
        //todo
    }

    function selectQuizQuestion(e) {
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
        questions = Array(...questions, new QuizQuestionDTO());
        console.log(questions);
    }

    function addOption(e) {
        questions[selectedQuizQuestionInd].options = Array(...questions[selectedQuizQuestionInd].options, "<<option>>");
    }

    function updateOptionText(e, index) {
        questions[selectedQuizQuestionInd].options[index] = e.target.value;
    }

    //todo remember always change $: questions because thats what we use when saveAndClose is clicked, 
    function updateAnswer(index) {
        if (index == undefined) {console.log("index is undefined"); return;}
        console.log(questions[selectedQuizQuestionInd].answerIndecies);
        //if not already in answers, add it
        if (!questions[selectedQuizQuestionInd].answerIndecies.includes(index)) {
            questions[selectedQuizQuestionInd].answerIndecies.push(index);
            //rerender
            questions = [...questions];

            return;
        }
        //if already in answers, remove it
        questions[selectedQuizQuestionInd].answerIndecies = questions[selectedQuizQuestionInd].answerIndecies.filter(i => i != index);
    }

    function updateQuesionText(e) {
        questions[selectedQuizQuestionInd].questionText = e.target.value;
    }

    function removeInputContent(e, ifContent) {
        if (e.target.value.endsWith(ifContent)) {
            e.target.value = "";
        }
    }
</script>
<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
  <div class="popup-background" in:fade out:fade>
    <div class="popup-content">
      <input type="text" placeholder="quiz title" id="quizTitleInp" value="{quiz?.title}" />
      <input type="text" placeholder="time limit (s)" id="timeLimitInp" value="{quiz?.timeLimit}" />
      <label for="isOrderedQuiz">ordered</label>
      <input type="checkbox" id="isOrderedQuizInp" name="isOrderedQuiz" checked="{quiz?.isOrdered}" />
      <br>
      <div id="info">
          <button on:click={addQuizQuestionSkeleton}>add question</button>
        <ul id="questions-list">
            {#each questions as quizQuestion, index (quizQuestion)}
            <li on:dblclick={selectQuizQuestion} id={String(index)}><span>{index+1}.</span> {trimmedQuestionName(quizQuestion.questionText)}</li>
            {/each}
        </ul>
        <br>

      {#if selectedQuizQuestionInd != -1}
      <div id="info2">
            <textarea placeholder="Enter Question Text" value={questions[selectedQuizQuestionInd].questionText}
                on:blur={(e) => updateQuesionText(e)}  
                on:focus={(e) => removeInputContent(e, "<<question>>")} />
            
                    <br>
                <label for="isOrderedOptions">ordered</label>
                <input type="checkbox" id="isOrderedOptionsInp" name="isOrderedOptions" checked={questions[selectedQuizQuestionInd]?.isOrdered ?? false} />   
    
                <ul>
                    {#each questions[selectedQuizQuestionInd].options as option, index}
                    <div class="optionDiv">
                        <input type="checkbox" checked={questions[selectedQuizQuestionInd].answerIndecies.includes(index)}
                            on:change={() => updateAnswer(index)} />
    
                        <input type="text" class="optionInput" value={option}
                            on:blur={(e) => updateOptionText(e, index)} 
                            on:focus={(e) => removeInputContent(e, "<<option>>")} />
                    </div>
                    {/each}
                </ul>
    
                <ul>
                    <p>answers:</p>
                    {#each questions[selectedQuizQuestionInd].answerIndecies as answerIndex}
                        <li>{answerIndex}</li>
                    {/each}
                </ul>
</div>

            <button on:click={addOption}>add opt</button>
            {/if}
        </div>

      <button id="closeEditorBtn" on:click={closeQuizEditor}>Cancel</button>
      <button id="saveAndCloseEditorBtn" on:click={saveAndCloseQuizEditor}>Save</button>
    </div>
  </div>
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
  <style>
    #closeEditorBtn {
      float: right;
    }

    /* blur */
    .popup-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* semi-transparent background */
      backdrop-filter: blur(10px); /* applies blur to the background */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }

    .popup-content {
      min-width: 75vw;
      background-color: var(--color-white);
      padding: 20px;
      border-radius: 2rem;
    }

    input[type="checkbox"] {
      height: 1rem;
      width: 1rem;
    }

    #questions-list {
      overflow: scroll;
      width: 20rem;
      height: 35rem;
      list-style-type: none;
      border: 1px solid black;
    }

    #questions-list li {
      margin: 1rem;
      border-bottom: 1px solid black;
    }

    #info {
      display: flex;
    }

    #info2 {
      display: block;
    }
  </style>
