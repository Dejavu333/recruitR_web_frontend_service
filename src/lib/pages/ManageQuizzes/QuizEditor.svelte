<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import { broadcastEvent } from "cupevents";
    import { draw, fade, fly, scale, crossfade } from "svelte/transition";
    import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import { onMount } from "svelte";
    import { QuizDTO, QuizQuestionDTO, quizzesStore } from "../../../store";

  // variables, constants
  //====================================================================================================
  export let currentlyEditedQuizTitle;
  let quizTitleInp;
  let timeLimitInp;
  let isOrderedQuizInp;
  let isOrderedOptionsInp;
  
  $: quiz = $quizzesStore.find(q => q.title == currentlyEditedQuizTitle);
  $: questions = $quizzesStore.find(q => q.title == currentlyEditedQuizTitle)?.quizQuestions ?? [];
  let selectedQuizQuestionInd = -1;
  let dragulaInstanceForQuizQuestions;
  
  // setup
  //====================================================================================================
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
    
    // functions
    //====================================================================================================
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
                span.style.backgroundImage = "none";
            });
            //vertical gradient that goes from red to "#b8dbc7";
            e.target.style.backgroundImage = "linear-gradient(to right, #73cb72, #abd4bc)";

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
    <div class="popup-content" in:fly out:scale>
      <div class="quiz-container">
        <div id="questionsEditor" class="editor-section">
          <label for="quizTitle">quiz title:</label>
          <br>
          <input type="text" placeholder="quiz title" id="quizTitleInp" value="{quiz?.title}" />
          <br>
          <label for="timeLimit">time limit (s):</label>
          <input type="text" placeholder="time limit (s)" id="timeLimitInp" value="{quiz?.timeLimit}" />
          <br>
          <label for="isOrderedQuiz">ordered questions:</label>
          <input type="checkbox" id="isOrderedQuizInp" name="isOrderedQuiz" checked="{quiz?.isOrdered}" />
          <br>
          <button on:click={addQuizQuestionSkeleton}>add question</button>
            <div class="master">
              <ul id="questions-list" class="sleeve">
                {#each questions as quizQuestion, index (quizQuestion)}
                <li on:dblclick={selectQuizQuestion} id={String(index)} class="sleeve" ><span>  {index+1}.</span>
                  {trimmedQuestionName(quizQuestion.questionText)}</li>
                {/each}
              </ul>
            </div>
          </div><!-- questions editor -->
    
    {#if selectedQuizQuestionInd != -1}
    <div id="optionsEditor" class="editor-section" in:fly out:scale>
        <label for="questionText">question text:</label>
          <textarea placeholder="enter question text..." value={questions[selectedQuizQuestionInd].questionText}
          on:blur={(e)=> updateQuesionText(e)}  
          on:focus={(e) => removeInputContent(e, "<<question>>")} />
            
          <br>
          <label for="isOrderedOptions">ordered options:</label>
          <input type="checkbox" id="isOrderedOptionsInp" name="isOrderedOptions" checked={questions[selectedQuizQuestionInd]?.isOrdered ?? false} />   
          
          <br>
          <button on:click={addOption}>add option</button>
          <ul>
                {#each questions[selectedQuizQuestionInd].options as option, index}
                <div class="optionDiv">
                <input type="checkbox" checked={questions[selectedQuizQuestionInd].answerIndecies.includes(index)}
                    on:change={() => updateAnswer(index)} />
    
                <input type="text" class="optionInput" value={option} placeholder="enter option text..."
                    on:blur={(e) => updateOptionText(e, index)} 
                    on:focus={(e) => removeInputContent(e, "<<option>>")} />
                </div>
                {/each}
           </ul>
            
            <!-- <ul>
                <p>Answers:</p>
            {#each questions[selectedQuizQuestionInd].answerIndecies as answerIndex}
              <li>{answerIndex}</li>
              {/each}
            </ul> -->
        </div><!-- options editor -->
        <div class="button-container">
          <button id="saveAndCloseEditorBtn" on:click={saveAndCloseQuizEditor}>save</button>
          <button id="closeEditorBtn" on:click={closeQuizEditor}>cancel</button>
        </div>
        {/if}
    </div><!-- quiz container -->

    </div> <!-- popup content -->
</div> <!-- popup background -->
  
<style>
span {
    margin-left: 0.5rem;
    opacity: 0.25;
}
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
    overflow: hidden;
    min-width: 70rem;
    min-height: 45rem;
    background-color: var(--color-light);
    padding: 0px;
    border-radius: 2rem;
}

.quiz-container {
    min-height: 40rem;
    display: flex;
    justify-content: space-between;
    position: relative; 
}

#questionsEditor {
    width: 18rem;
    padding: 20px;
    left: 0; 
    z-index: 2; /* Increase the z-index to make it appear above the quiz container */
}

#optionsEditor {
    width: 45rem;
    min-height: 50rem;
    position: absolute; 
    right: 3rem; 
    background-color: white; 
    padding: 20px;
    z-index: 10; /* Increase the z-index to make it appear above the quiz container */
}

#optionsEditor:after {
    content: "";
    position: absolute;
    right: -7.5rem;
    top: -10rem;
    height: 70rem;
    width: 58rem;
    background: var(--color-primary);
    transform: rotate(7deg);
    box-shadow: 0 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
    z-index: -1;
}

#optionsEditor:before {
    content: "";
    position: absolute;
    right: 10rem;
    top: 31.1rem;
    height: 70rem;
    width: 58rem;
    background: var(--color-secondary);
    transform: rotate(87deg);
    box-shadow: 0 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
    z-index: -1;
}

.button-container {
    position: absolute;
    display: flex;
    justify-content: space-between;
    bottom: -5rem;
    margin: 1rem;
    z-index:10;

}

button {
    width: 5.5rem;
    height: 3rem;
    border-radius: var(--border-radius-primary);
    margin: 0.25rem;
}
.button-container>button {
    background-color: var(--color-secondary);
}
.button-container>button:hover {
    background-color: var(--color-highlight-secondary);
}
#questionsEditor>button {
    background-color: var(--color-light);
}
#questionsEditor>button:hover {
    background-color: var(--color-highlight-light);
}

.optionDiv {
    display: flex;
    align-items: center;
}

ul {
    height: 25rem; 
    overflow-y: auto; /* Enable vertical scrolling when content exceeds the container */
    /* box-shadow: var(--shadow-primary); */
}

textarea {
    width: 45rem;
    height: 10rem;
    border-radius: var(--border-radius-primary);
    padding: 1rem;
}

/* .master div is for left side scrollbar */
.master {
    min-height: 20rem;
}


</style>
