<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import { onMount } from "svelte";
    import QuizColumn from "../QuizColumn.svelte";
    import dragula from "dragula";
    import { onEvent } from "cupevents";
    import QuizEditor from "./QuizEditor.svelte";

    // variables, constants
    //====================================================================================================
    const columns = ["testTitle", "testTitlee", "testTitleee"];
    const errorMessages = {
        emptyError: "cannot be empty",
        duplicateError: "already exists"
    }
    let dragulaInstance; // Define a variable to hold the Dragula instance.
    let columnTitleInp;
    let isQuizEditorOpen = false;

    // setup
    //====================================================================================================
    onMount(() => {
        // Initialize Dragula initially.
        dragulaInstance = configurateDragula();
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
        const existingColumnTitles = columns.map(c => c.toLowerCase());
        const columnTitle = columnTitleInp.value;
        if (columnTitle == "" || columnTitle == errorMessages.emptyError) {
            columnTitleInp.value = errorMessages.emptyError;
            return;
        }
        if (existingColumnTitles.includes(columnTitle.toLowerCase()) || columnTitle == errorMessages.duplicateError) {
            columnTitleInp.value = errorMessages.duplicateError;
            return;
        }
        columns.push(columnTitle);

        const quizColumn = new QuizColumn({
            target: document.querySelector(".columns"),
            props: {
                columnTitle: columnTitle
            }
        });
        columnTitleInp.value = "";

        // Destroy the previous Dragula instance and create a new one.
        dragulaInstance.destroy();
        dragulaInstance = configurateDragula();
    }
    
    function configurateDragula() {
        const columnsDOMRepres = [];
        columns.forEach(c => {
            columnsDOMRepres.push(document.getElementById(c));
        });
        const dragulaInstance = dragula([...columnsDOMRepres]);
        // add any additional event listeners or configurations here.
        // add the `removeOnSpill: true` option if needed.
        return dragulaInstance;
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
        <QuizColumn columnTitle="testTitle" />  
        <QuizColumn columnTitle="testTitlee" />
        <QuizColumn columnTitle="testTitleee" />
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
