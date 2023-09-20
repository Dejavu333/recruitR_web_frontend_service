<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
import { onMount } from "svelte";
import QuizColumn from "../QuizColumn.svelte";
import QuizEditor from "./QuizEditor.svelte";
import { QuizDTO, QuizQuestionDTO, quizzesStore } from "../../Store";
import dragula from "dragula";
import { onEvent } from "cupevents";

// variables, constants
//====================================================================================================
const columnTitles = ["test", "asdasd", "abcabcabc"];
const errorMessages = {
    emptyError: "cannot be empty",
    duplicateError: "already exists"
}
let dragulaInstanceForQuizzes; // Define a variable to hold the Dragula instance.
let isQuizEditorOpen = false; //todo maybe move to inner component
let columnTitleInp;

// setup
//====================================================================================================
//todo fetch quizzes from server
quizzesStore.update(store => { store.push(new QuizDTO("test",0, "test", [new QuizQuestionDTO("test", ["test", "test", "test"],[])], false, 600)); return store; });
// // console.log("quizzesStore in managequiz:"+$quizzesStore);
onMount(() => {
    console.log("onMount in ManageQuizzes");
    // Initialize Dragula initially.
    dragulaInstanceForQuizzes = configurateDragula();
    columnTitleInp = document.getElementById("columnTitleInp")
    columnTitleInp.addEventListener("focus", function () {
        columnTitleInp.value = "";
    });

});

onEvent("openQuizEditor", function (e) {
    isQuizEditorOpen = true;
});
onEvent("closeQuizEditor", function (e) {
    isQuizEditorOpen = false;
});
// functions
//====================================================================================================
function addColumn() {
    const existingColumnTitles = columnTitles.map(c => c.toLowerCase());
    const columnTitle = columnTitleInp.value;
    if (columnTitle == "" || columnTitle == errorMessages.emptyError) {
        columnTitleInp.value = errorMessages.emptyError;
        return;
    }
    if (existingColumnTitles.includes(columnTitle.toLowerCase()) || columnTitle == errorMessages.duplicateError) {
        columnTitleInp.value = errorMessages.duplicateError;
        return;
    }
    columnTitles.push(columnTitle);

    const quizColumn = new QuizColumn({
        target: document.querySelector(".columns"),
        props: {
            columnTitle: columnTitle
        }
    });
    columnTitleInp.value = "";

    // Destroy the previous Dragula instance and create a new one.
    dragulaInstanceForQuizzes.destroy();
    dragulaInstanceForQuizzes = configurateDragula();
}

function configurateDragula() {
    const columnsDOMRepres = [];
    columnTitles.forEach(c => {
        columnsDOMRepres.push(document.getElementById(c));
    });
    const dragulaInstanceForQuizzes = dragula([...columnsDOMRepres]);
    // add any additional event listeners or configurations here.
    // add the `removeOnSpill: true` option if needed.
    //on dragend adds column name to quiz
    dragulaInstanceForQuizzes.on("drop", function (el, target, source, sibling) {
    // class QuizDTO {
    // title;
    // columnNameItBelongsTo;
    // indexInColumn;
    // quizQuestions;
    // isOrdered;
    // timeLimit;
    // constructor(columnNameItBelongsTo="", indexInColumn=-1, title="untitled", quizQuestions=[], isOrdered=false, timeLimit=600) {
    //     this.title = title;
    //     this.columnNameItBelongsTo = columnNameItBelongsTo;
    //     this.quizQuestions = quizQuestions;
    //     this.isOrdered = isOrdered;
    //     this.timeLimit = timeLimit;
    // }
    // }
    //update quiz columnNameItBelongsTo and indexInColumn
        const quizTitle = el.innerText;
        setTimeout(() => {
            //every quiz in every column updates its columnnameitbelongsto and indexincolumn
            const columnsDOMRepres = document.querySelectorAll(".column");
            columnsDOMRepres.forEach(c => {
                const ulElement = c.querySelector("ul");
                if (ulElement!=undefined) {
                    const ulId = ulElement.id;
                    const quizDOMRepres = ulElement.querySelectorAll(".quiz");
                    quizDOMRepres.forEach((q, i) => {
                        const quizTitle = q.querySelector("p").innerText;
                        const quiz = $quizzesStore.find(q => q.title == quizTitle);
                        quiz.columnNameItBelongsTo = ulId;
                        quiz.indexInColumn = i;
                    });
                }
            });
            console.log($quizzesStore);

          
            }, 500);  
        });

    return dragulaInstanceForQuizzes;
}

function searchCategory() {
    const searchValue = document.querySelector("#searchCategoryInp").value.toLowerCase();
    const columnsDOMRepres = document.querySelectorAll(".column");

    columnsDOMRepres.forEach(c => {
        const ulElement = c.querySelector("ul");
        if (ulElement) {
            const ulId = ulElement.id.toLowerCase();
            if (searchValue === "") {
                c.style.display = "block";
            }
            else if (ulId.includes(searchValue)) {
                c.style.display = "block";
            } 
            else {
                c.style.display = "none";
            }
        }
    });
}

function searchQuiz() {
    const searchValue = document.querySelector("#searchQuizInp").value.toLowerCase();
    const quizDOMRepres = document.querySelectorAll(".quiz");
    quizDOMRepres.forEach(q => {
        const quizTitle = q.querySelector("p").innerText.toLowerCase();
        if (searchValue === "") {
            q.style.display = "flex";
        }
        else if (quizTitle.includes(searchValue)) {
            q.style.display = "flex";
        } 
        else {
            q.style.display = "none";
        }
    });
    
}
</script>

<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<h1>{$quizzesStore[$quizzesStore.length-1]}</h1>
<h1>quizzes </h1>

<QuizEditor isOpen={isQuizEditorOpen} />

<div class="add-quiz-container">
    <input type="text" maxlength="12" id="columnTitleInp" placeholder="new category..." onkeydown="if (event.keyCode == 13)
        document.getElementById('add').click()"> 
    <button id="add" class="button addcategory-button" on:click={addColumn}>add category</button>

    <input type="text" maxlength="12" id="searchCategoryInp" on:input={searchCategory} placeholder="search category..." onkeydown="if (event.keyCode == 13)
        document.getElementById('add').click()">
    <input type="text" maxlength="12" id="searchQuizInp" on:input={searchQuiz} placeholder="search quiz..." onkeydown="if (event.keyCode == 13)
        document.getElementById('add').click()">
</div>

<div class="main-container">
    <ul class="columns">
        {#each columnTitles as columnTitle}
        <QuizColumn columnTitle={columnTitle} />
        {/each}
    </ul>
</div>

<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->

<style>
.add-quiz-container {
  display: flex;
  width: fit-content;
  height: fit-content;
  margin: 1rem auto;
  background: var(--color-light);
  border-radius: 2rem;
  padding: 0.4rem;
  box-shadow: var(--shadow-primary);
}
.columns {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
}

.addcategory-button {
  padding: 0 1rem;
  height: 4rem;
  width: 11vw;
  border-radius: 2rem;
  background: var(--color-secondary);
  padding: 0.4rem;
  box-shadow: var(--shadow-primary);
}

.addcategory-button:hover {
  background-color: var(--color-hightlight);
}

</style>
