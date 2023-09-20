import {writable } from "svelte/store";

const quizzesStore = writable([]);

class QuizDTO {
    title;
    columnNameItBelongsTo;
    indexInColumn;
    quizQuestions;
    isOrdered;
    timeLimit;
    constructor(columnNameItBelongsTo="", indexInColumn=-1, title="untitled", quizQuestions=[], isOrdered=false, timeLimit=600) {
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