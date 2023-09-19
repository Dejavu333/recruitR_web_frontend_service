import {writable } from "svelte/store";

const quizzesStore = writable([]);

class QuizDTO {
    title = "untitled"
    columnNameItBelongsTo = "";
    quizQuestions = [];
    isOrdered = false;
    timeLimit = 600;
    constructor(columnNameItBelongsTo, title, quizQuestions, isOrdered, timeLimit) {
        this.title = title;
        this.columnNameItBelongsTo = columnNameItBelongsTo;
        this.quizQuestions = quizQuestions;
        this.isOrdered = isOrdered;
        this.timeLimit = timeLimit;
    }
}

class QuizQuestionDTO {
    questionText = "";
    options = [];
    answerIndecies = [];
    constructor(questionText, options, answerIndecies) {
        this.questionText = questionText;
        this.options = options;
        this.answerIndecies = answerIndecies;
    }
}


export {quizzesStore, QuizDTO, QuizQuestionDTO};