const question = document.querySelector("#question")
const choices = Array.from(document.querySelectorAll(".choice-text"))
const progressText = document.querySelector("#progressText")
const scoreText = document.querySelector("#score")
const progressBarFull = document.querySelector("#progressBarFull")
const remainedTime = document.querySelector("#time")

const category = document.querySelector("#category")
let time = 15;

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        localStorage.setItem("data", this.response);
    }
};
xhttp.open("GET", "data.json");
xhttp.send();
sessionStorage.setItem('time', time)
remainedTime.innerText = `Remained Time : ${time}`
let decreasingTime = setInterval(() => {
    remainedTime.innerText = `Remained Time : ${--time}`
    if (time === 0) {
        time = sessionStorage.getItem("time")
        getNewQuestion()
    }
}, 1000)
let currentQuestion = {}
let accepingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []
var questions = JSON.parse(localStorage.getItem("data"));
const SCORE_POINTS = 100
const MAX_QUESTIONS = questions.length
if (questions) {
    startGame = () => {
        questionCounter = 0
        score = 0
        availableQuestions = [...questions]
        getNewQuestion()
    }
    getNewQuestion = () => {
        if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
            localStorage.setItem("mostRecentScore", score)
            return window.location.assign("/end.html")
        }
        questionCounter++
        progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
        progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`
        const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
        currentQuestion = availableQuestions[questionsIndex]
        question.innerText = currentQuestion.question
        category.innerText = `Category : ${currentQuestion.category}`
        choices.forEach(choice => {
            const number = choice.dataset['number']
            choice.innerText = currentQuestion['choice' + number]
        })
        availableQuestions.splice(questionsIndex, 1)
        accepingAnswers = true
    }
    choices.forEach(choice => {
        choice.addEventListener('click', e => {
            if (!accepingAnswers) return

            accepingAnswers = false
            const selectedChoice = e.target
            const selectedAnswer = selectedChoice.innerText

            let classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect"

            if (classToApply === 'correct') {
                incrementScore(SCORE_POINTS)
                time = sessionStorage.getItem("time")
            }
            selectedChoice.parentElement.classList.add(classToApply)
            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply)
                time = sessionStorage.getItem("time")

                getNewQuestion()
            }, 400)
        });

    })

    incrementScore = num => {
        score += num
        scoreText.innerText = score
    }
    startGame()
}