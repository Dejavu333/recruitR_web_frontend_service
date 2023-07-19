// constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

// elements
const questionElem = document.querySelector("#question");
const scoreContainer = document.querySelector("#scoreContainer");
const scoreText = document.querySelector("#score");
const progressText = document.querySelector("#progressText");
const progressBarFull = document.querySelector("#progressBarFull");
const loader = document.querySelector("#loader");
const game = document.querySelector("#game");
const choicesContainer = document.querySelector("#choicesContainer");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let questions = [];

const sampleQuizData = [
    {
        "question": "Inside which HTML element do we put the JavaScript??",
        "1": "<script>",
        "2": "<javascript>",
        "3": "<js>",
        "4": "<scripting>",
        "5": "<sms>",
        "6": "<css>",
        "7": "<JS>",
        "8": "<ecma>",
        "answer": 1
    },
    {
        "question": "What is the correct syntax for referring to an external script called 'xxx.js'?",
        "1": "<script href='xxx.js'>",
        "2": "<script name='xxx.js'>",
        "3": "<script src='xxx.js'>",
        "4": "<script file='xxx.js'>",
        "answer": 3
    },
    {
        "question": " How do you write 'Hello World' in an alert box?",
        "1": "msgBox('Hello World');",
        "2": "alertBox('Hello World');",
        "3": "msg('Hello World');",
        "4": "alert('Hello World');",
        "5": "pozor('Hello World');",
        "answer": 4
    }
]

setup();
//DO async function fetchQuizDataById(p_id){} //id from the url
//DO const quizDataObj = await fetchQuizDataById("someid");  
questionDTOs = sampleQuizData;
availableQuesions = mapQuestionDTOsToQuestions(questionDTOs);
startGame();

function setup() {
    const hud = new URLSearchParams(window.location.search).get("hud");
    if (hud === "false") {
        // hides the score
        scoreContainer.classList.add("invisible");
        // changes highlights to hide if correct or wrong
        document.documentElement.style.setProperty("--color-goodgreen", "#d2d2d2");
        document.documentElement.style.setProperty("--color-badred", "#d2d2d2");
    }
}

function mapQuestionDTOsToQuestions(questionDTOs) {
    return questionDTOs.map((questionDTO) => {
        const question = questionDTO.question;
        const answer = questionDTO.answer;

        const keys = Object.keys(questionDTO)
        const choicesNum = keys.length - 2;
        const choices = [];
        for (let i = 0; i < choicesNum; i++) {
            choices.push(questionDTO[keys[i]]);
        }
        console.log(choices);
        return {
            question: question,
            choices: choices,
            answer: answer
        }
    });
}

function startGame() {
    questionCounter = 0;
    score = 0;
    renderNewQuestion();
    setTimeout(() => {
        game.classList.remove("hidden");
        loader.classList.add("hidden");
    }, 500);
};

function renderNewQuestion() {
    // check if we have reached the end of the quiz
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        return window.location.assign("./end.html");
    }
    questionCounter++;

    // update the progress bar
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    // set the question
    const questionIndex = randQuestionIndex();
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    // randomize order of choices into a new array but don"t mutate the original array
    const choices = [...currentQuestion.choices];
    const shuffledChoices = choices.sort(() => Math.random() - 0.5);

    // populate with choices
    choicesContainer.innerHTML = "";
    shuffledChoices.forEach((choice, index) => {
        const c = document.createElement("div");
        c.classList.add("choice-container");
        c.innerHTML = `
                <p class="choice-prefix">${LETTERS[index]}</p>
                <p class="choice-text"></p>`;
        c.querySelector(".choice-text").innerText = choice; // this is instead of interpolation in order to escape html (if choice is <script> etc.)
        choicesContainer.appendChild(c);
    });

    // remove the question from the available questions
    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;

    // event listeners for choices
    choiceElems = document.querySelectorAll(".choice-text");
    choiceElems.forEach((choice) => {
        choice.addEventListener("click", handleChoiceClick);
    });
};

function handleChoiceClick(e) {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = e.target.innerText;

    const classToApply =
        selectedAnswer == currentQuestion.choices[currentQuestion.answer - 1] ? "correct" : "incorrect";

    if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        renderNewQuestion();
    }, 1000);
}

function randQuestionIndex() {
    return Math.floor(Math.random() * availableQuesions.length);
}

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}