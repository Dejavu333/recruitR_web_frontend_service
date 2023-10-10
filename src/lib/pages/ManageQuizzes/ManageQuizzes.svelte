<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import { onMount } from "svelte";
    import QuizColumn from "./QuizColumn.svelte";
    import QuizEditor from "./QuizEditor.svelte";
    import QuizInstanceEditor from "./QuizInstanceEditor.svelte";
    import { QuizDTO, QuizQuestionDTO, quizzesStore } from "../../../store";
    import dragula from "dragula";
    import { broadcastEvent, onEvent } from "cupevents";
    import Config from "../../../config";

    // variables, constants
    //====================================================================================================
    const errorMessages = {
        emptyError: "cannot be empty",
        duplicateError: "already exists"
    }
    let dragulaInstanceForQuizzes; // Define a variable to hold the Dragula instance.
    let isQuizEditorOpen = false; //todo maybe move to inner component //todo remove this
    let isQuizInstanceEditorOpen = false; //todo maybe move to inner component
    let currentlyEditedQuizTitle = undefined; //todo maybe move to inner component
    let columnTitleInp;

    // setup
    //====================================================================================================
    readQuizzesFromDB();
    quizzesStore.update(store => { store.push(new QuizDTO("test", 2, "test1", [new QuizQuestionDTO("test?", ["test1", "test2", "test3"], [])], false, 600)); return store; });
    quizzesStore.update(store => { store.push(new QuizDTO("asdasd", 1, "test2", [new QuizQuestionDTO("test", ["test1", "test2", "test3"], [])], false, 600)); return store; });
    quizzesStore.update(store => { store.push(new QuizDTO("asdasd", 4, "test4", [new QuizQuestionDTO("test", ["test", "test", "test"], [])], false, 600)); return store; });
    quizzesStore.update(store => { store.push(new QuizDTO("test", 0, "test3", [new QuizQuestionDTO("test", ["test", "test", "test"], [])], false, 600)); return store; });
    quizzesStore.update(store => { store.push(new QuizDTO("hellogovner", 0, "test5", [new QuizQuestionDTO("test", ["test", "test", "test"], [])], false, 600)); return store; });
    let columnTitles = [...new Set($quizzesStore.map(q => q.columnNameItBelongsTo))];
    onMount(() => {
        console.log("ManageQuizzes mounted");
        // Initialize Dragula initially.
        dragulaInstanceForQuizzes = configurateDragulaForQuizColumns();
        columnTitleInp = document.getElementById("columnTitleInp")
        columnTitleInp.addEventListener("focus", function () {
            columnTitleInp.value = "";
        });
    });

    onEvent("openQuizEditor", function (e) {
        isQuizEditorOpen = true;
        currentlyEditedQuizTitle = e.detail;
    });
    onEvent("closeQuizEditor", function (e) {
        isQuizEditorOpen = false;
        currentlyEditedQuizTitle = undefined;
    });
    onEvent("updateQuizzesBasedOnDOM", function (e) {
        updateQuizzesBasedOnDOM();
    });
    onEvent("closeQuizInstanceEditor", function (e) {
        isQuizInstanceEditorOpen = false;
    });
    onEvent("openQuizInstanceEditor", function (e) {
        isQuizInstanceEditorOpen = true;
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
        dragulaInstanceForQuizzes = configurateDragulaForQuizColumns();
    }

    function configurateDragulaForQuizColumns() {
        const columnsDOMRepres = [];
        columnTitles.forEach(c => {
            columnsDOMRepres.push(document.getElementById(c));
        });
        const dragulaInstanceForQuizzes = dragula([...columnsDOMRepres]);
        // add any additional event listeners or configurations here.
        // add the `removeOnSpill: true` option if needed.
        //on dragend adds column name to quiz

        dragulaInstanceForQuizzes.on("drop", function (el, target, source, sibling) {
            broadcastEvent("updateQuizzesBasedOnDOM");
        });

        return dragulaInstanceForQuizzes;
    }

    function updateQuizzesBasedOnDOM() {
        setTimeout(() => {
            //every quiz in every column updates its columnnameitbelongsto and indexincolumn based on its position in the dom
            //track changes in the dom due to reposotioning of quizzes

            const columnsDOMRepres = document.querySelectorAll(".column");
            let updatedQuizzes = [];
            columnsDOMRepres.forEach(c => {
                const ulElement = c.querySelector("ul");
                if (ulElement != undefined) {
                    const columnName = ulElement.id;
                    const quizzesDOMRepres = ulElement.querySelectorAll(".quiz");
                    quizzesDOMRepres.forEach((q, i) => {
                        const quizTitle = q.innerText;
                        const quiz = $quizzesStore.find(q => q.title === quizTitle);
                        if (quiz != undefined) {
                            quiz.columnNameItBelongsTo = columnName;
                            quiz.indexInColumn = i;
                            updatedQuizzes.push(quiz);
                        }
                    });
                }
            });
            //update quizzesStore
            quizzesStore.update(store => {
                store.map(q => {
                    const updatedQuiz = updatedQuizzes.find(uq => uq.title === q.title);
                    if (updatedQuiz != undefined) {
                        q.columnNameItBelongsTo = updatedQuiz.columnNameItBelongsTo;
                        q.indexInColumn = updatedQuiz.indexInColumn;
                    }
                });
                return store;
            });
            // $quizzesStore.map(q => {
            //     const updatedQuiz = updatedQuizzes.find(uq => uq.title === q.title);
            //     if (updatedQuiz!=undefined) {
            //         q.columnNameItBelongsTo = updatedQuiz.columnNameItBelongsTo;
            //         q.indexInColumn = updatedQuiz.indexInColumn;
            //     }});

            console.log($quizzesStore);
        }, 500);
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
        const quizzesDOMRepres = document.querySelectorAll(".quiz");
        quizzesDOMRepres.forEach(q => {
            const quizTitle = q.innerText.toLowerCase();
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
        // hides columns that have no quizzes shown
        const columnsDOMRepres = document.querySelectorAll(".column");
        columnsDOMRepres.forEach(c => {
            const quizzesInColumn = c.querySelectorAll(".quiz");
            const allQuizzesHidden = [...quizzesInColumn].every(q => q.style.display === "none");
            if (allQuizzesHidden) {
                c.style.display = "none";
            } else {
                c.style.display = "block";
            }
        });

    }

    function readQuizzesFromDB() {
        //todo get email from jwt
        const email = document.cookie.split(";").find(c => c.includes("email"))?.split("=")[1];
        if (email == undefined) {
            console.log("email is undefined");
            return;
        }
        const url = Config.CURATOR_SERVICE_URL + Config.LIST_QUIZZES_ROUTE + "?owneremail=" + email;
        const res = fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(quizzesData => {
                console.log(quizzesData);
                //todo update quizzesStore
            });
    }
</script>

<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<h1>quizzes </h1>
{#if isQuizEditorOpen}
<QuizEditor currentlyEditedQuizTitle={currentlyEditedQuizTitle} />
{/if}
{#if isQuizInstanceEditorOpen}
<QuizInstanceEditor currentlyEditedQuizTitle={currentlyEditedQuizTitle} />
{/if}

<div class="add-quiz-container">
    <input type="text" maxlength="12" id="columnTitleInp" placeholder="new category..." onkeydown="if (event.keyCode == 13)
        document.getElementById('add').click()">
    <button id="add" class="button addcategory-button" on:click={addColumn}>add category</button>

    <input type="text" maxlength="12" id="searchCategoryInp" on:input={searchCategory} placeholder="search category..."
        onkeydown="if (event.keyCode == 13)
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
        background: var(--color-primary);
        border-radius: var(--border-radius-primary);
        padding: var(--padding-primary);
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
        width: 5rem;
        border-radius: var(--border-radius-primary);
        background: var(--color-primary);
        padding: var(--padding-primary);
        box-shadow: var(--shadow-primary);
    }

    .addcategory-button:hover {
        background-color: var(--color-hightlight);
    }
</style>