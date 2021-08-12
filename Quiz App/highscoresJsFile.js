const highScoresList = document.querySelector("#highScoresList")
const hishScore = JSON.parse(localStorage.getItem("highScores")) || []
highScoresList.innerHTML = hishScore.map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`
}).join('')