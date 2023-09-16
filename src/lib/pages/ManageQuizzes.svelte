<script>
    import { onMount } from "svelte";
    import QuizColumn from "../QuizColumn.svelte";
    import dragula from "dragula";

    let columns = ["testTitle", "testTitlee", "testTitleee"];

    let dragulaInstance; // Define a variable to hold the Dragula instance.

    onMount(() => {
        // Initialize Dragula initially.
        dragulaInstance = configurate();
    });

    function addColumn() {
        const columnTitleInp = document.getElementById("columnTitleInp")
        let columnTitle = columnTitleInp.value;
        if (columnTitle == "") return;
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
        dragulaInstance = configurate();
    }
    
    function configurate() {
        const columnsDOMRepres = [];
        columns.forEach(c => {
            columnsDOMRepres.push(document.getElementById(c));
        });
        const dragulaInstance = dragula([...columnsDOMRepres]);
        // You can add any additional event listeners or configurations here.
        // For example, you can add the `removeOnSpill: true` option if needed.
        return dragulaInstance;
    }
</script>



<h1>quizzes </h1>

<div class="add-quiz-container">
    <input type="text" maxlength="12" id="columnTitleInp" placeholder="new category..." onkeydown="if (event.keyCode == 13)
                            document.getElementById('add').click()">
    <button id="add" class="button addcategory-button" on:click={addColumn}>add category</button>
</div>

<div class="main-container">
    <ul class="columns">
        <QuizColumn columnTitle="testTitle" />  
        <QuizColumn columnTitle="testTitlee" />
        <QuizColumn columnTitle="testTitleee" />
    </ul>
</div>
