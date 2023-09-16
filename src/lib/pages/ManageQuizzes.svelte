<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import { onMount } from "svelte";
    import QuizColumn from "../QuizColumn.svelte";
    import dragula from "dragula";

    // variables, constants
    //====================================================================================================
    const columns = ["testTitle", "testTitlee", "testTitleee"];
    const errorMessages = {
        emptyError: "cannot be empty",
        duplicateError: "already exists"
    }
    let dragulaInstance; // Define a variable to hold the Dragula instance.
    let columnTitleInp;

    // setup
    //====================================================================================================
    onMount(() => {
        // Initialize Dragula initially.
        dragulaInstance = configurate();
        columnTitleInp = document.getElementById("columnTitleInp")
        columnTitleInp.addEventListener("focus", function () {
            columnTitleInp.value = "";
        });
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

<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->

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

<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->

<style>
.add-quiz-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 20rem;
  height: 5.3rem;
  margin: 5rem auto;
  background: var(--color-primary);
  border: var(--color-primary-light) 0.2rem solid;
  border-radius: 0rem;
  padding: 0.4rem;
}

.columns {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  margin: 1.6rem auto;
}

.addcategory-button {
  background-color: var(--color-primary-dark);
  padding: 0 1rem;
  height: 2.8rem;
  width: 10rem;
  margin-top: 0.6rem;
}
.addcategory-button:hover {
  background-color: var(--color-hightlight);
}

</style>
