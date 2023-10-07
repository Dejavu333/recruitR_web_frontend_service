<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import { broadcastEvent } from "cupevents";
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

    onMount(() => {
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
                span.style.backgroundColor = "transparent";
            });
            e.target.style.backgroundColor = "#ae9acb";
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
        if (index == undefined) { console.log("index is undefined"); return; }
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
<div class="popup-background">
    <div class="popup-content">
      <div class="quiz-container">
        <div id="questionsEditor" class="editor-section">
          <label for="quizTitle">Quiz Title</label>
          <input type="text" placeholder="Quiz Title" id="quizTitleInp" value="{quiz?.title}" />
          <br>
          <label for="timeLimit">Time Limit (s)</label>
          <input type="text" placeholder="Time Limit (s)" id="timeLimitInp" value="{quiz?.timeLimit}" />
          <br>
          <label for="isOrderedQuiz">Ordered Questions</label>
          <input type="checkbox" id="isOrderedQuizInp" name="isOrderedQuiz" checked="{quiz?.isOrdered}" />
          <br>
          <button on:click={addQuizQuestionSkeleton}>Add Question</button>
          <ul id="questions-list">
            {#each questions as quizQuestion, index (quizQuestion)}
            <li on:dblclick={selectQuizQuestion} id={String(index)}><span>{index+1}.</span>
              {trimmedQuestionName(quizQuestion.questionText)}</li>
            {/each}
          </ul>
        </div><!-- questions editor -->
        {#if selectedQuizQuestionInd != -1}
        <div id="optionsEditor" class="editor-section" in:scale out:scale>
          <textarea placeholder="Enter Question Text" value={questions[selectedQuizQuestionInd].questionText}
            on:blur={(e)=> updateQuesionText(e)}  
            on:focus={(e) => removeInputContent(e, "<<question>>")} />
          
          <br>
          <label for="isOrderedOptions">Ordered Options</label>
          <input type="checkbox" id="isOrderedOptionsInp" name="isOrderedOptions" checked={questions[selectedQuizQuestionInd]?.isOrdered ?? false} />   
  
          <ul>
            <button on:click={addOption}>Add Option</button>
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
            <p>Answers:</p>
            {#each questions[selectedQuizQuestionInd].answerIndecies as answerIndex}
              <li>{answerIndex}</li>
            {/each}
          </ul>
        </div><!-- options editor -->
        {/if}
      </div><!-- quiz container -->
  
      <div class="button-container">
        <button id="closeEditorBtn" on:click={closeQuizEditor}>Cancel</button>
        <button id="saveAndCloseEditorBtn" on:click={saveAndCloseQuizEditor}>Save</button>
      </div>

    </div> <!-- popup content -->
</div> <!-- popup background -->
  
<style>
.popup-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.popup-content {
    min-width: 75vw;
    background-color: var(--color-light);
    padding: 20px;
    border-radius: 2rem;
}

.quiz-container {
    display: flex;
    justify-content: space-between;
}

#optionsEditor {
  width: 50%;
  height: 110%;
  position: relative; /* Remove absolute positioning */
  background-color: white; /* Set the background color to create the "paper sheet" effect */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Add a box shadow */
  border-radius: 2rem;
  padding: 20px;
  z-index: 1; /* Bring the optionsEditor to the front */
}

.button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.optionDiv {
    display: flex;
    align-items: center;
}
</style>
