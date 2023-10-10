import {get, writable } from "svelte/store";

const quizzesStore = writable([]);

function listQuizzes(filter) {
    if (filter) {
        return get(quizzesStore).filter(filter);
    }
    return get(quizzesStore);
}

function addQuiz(quiz) {
    quizzesStore.update(store => {
        store.push(quiz);
        return store;
    });
}
function removeQuiz(filter) {   //filter is a lambda that returns true if the quiz should be removed (i.e. filter = (quiz) => quiz.title == "quiz1")
    quizzesStore.update(store => {
        store.splice(store.findIndex(filter), 1);
        return store;
    });
}
function updateQuiz(filter, quiz) {
    quizzesStore.update(store => {
        store[store.findIndex(filter)] = quiz;
        return store;
    });
}
//=======================================================
const emailsStore = writable([]);

class QuizDTO {
    title;
    columnNameItBelongsTo;
    indexInColumn;
    quizQuestions;
    isOrdered;
    timeLimit;
    constructor(columnNameItBelongsTo="", indexInColumn=-1, title="<<question>>", quizQuestions=[], isOrdered=false, timeLimit=0) { //todo add default values <<new quiz>>
        this.title = title;
        this.indexInColumn = indexInColumn;
        this.columnNameItBelongsTo = columnNameItBelongsTo;
        this.quizQuestions = quizQuestions;
        this.isOrdered = isOrdered;
        this.timeLimit = timeLimit;
    }
    //todo add methods to add/remove questions so properties aren't directly accessible
}

class QuizQuestionDTO {
    questionText;
    options;
    answerIndecies;
    isOrdered;
    constructor(questionText="<<question>>", options=["<<option>>", "<<option>>"], answerIndecies=[], isOrdered=false) {
        this.questionText = questionText;
        this.options = options;
        this.answerIndecies = answerIndecies;
        this.isOrdered = isOrdered;
    }
}


export {quizzesStore, QuizDTO, QuizQuestionDTO, listQuizzes, addQuiz, removeQuiz, updateQuiz};