
//variables to prevent from re-initializing everytime the function runs
let randomCategory = null
let randomClueIndex = null
let cluesArray = []
let randomQuestion = ''
let randomAnswer = ''
let scoreTracker = 0

//DOM elements
let title = document.querySelector('.title')
let contentDiv = document.querySelector('.content')
let buttonsDiv = document.querySelector('.buttonsDiv')
let scoreCounter = document.querySelector('.scoreCounter')

let startBtn = document.createElement('button')
startBtn.innerText = 'START'
startBtn.classList = 'button'

let submitBtn = document.createElement('button')
submitBtn.innerText = 'SUBMIT'
submitBtn.classList = 'button'

let nextQuestionBtn = document.createElement('button')
nextQuestionBtn.innerText = 'NEXT'
nextQuestionBtn.classList = 'button'

let restartBtn = document.createElement('button')
restartBtn.innerHTML = '<p>START</br>OVER</p>'
restartBtn.classList = 'button'

let answerInput = document.createElement('input')
answerInput.classList = 'answerInput'
answerInput.placeholder = 'Enter Your Answer'

let answerDiv = document.createElement('div')
answerDiv.classList = 'answerDiv'

let correctAnswerText = document.createElement('p')
correctAnswerText.innerText = 'CORRECT!'
correctAnswerText.classList = 'title'


function startingPage() {
    fetch(`https://jservice.io/api/categories?count=100`)
    .then(response => response.json())
    .then(data => {
        let randomCategoryIndex = Math.floor(Math.random() * 100)
        randomCategory = data[randomCategoryIndex]
        fetch(`https://jservice.io/api/clues?category=${randomCategoryIndex}`)
            .then(response => response.json())
            .then(clues => {
                cluesArray = clues
            })
        })

    scoreCounter.style.display = 'none'
    title.innerHTML = '<h2 class = "introTitle">Welcome to JEOPARDY</h2>'
    contentDiv.innerHTML = '<h4 class = "contentsText">Test Your Wits</br>With Random Jeopardy Questions</h4><h5 id = "instructions" class = "contentsText">Be Sure to Answer Questions EXACTLY!</h5><h3 id ="toStartPhrase" class = "contentsText">Press START to Begin</h3>'
    buttonsDiv.innerHTML = ''
    buttonsDiv.append(startBtn)
}

//Initial Page Render and fetch for question info
startingPage()

//console.log for what the answer is
function callQuestion () { 
    console.log("Question: " + randomQuestion)
        
    setTimeout(function() { 
        console.log("Answer: " + randomAnswer) 
    }, 5000)
}


function questionRender () {
    //clearing the page for each question
    title.innerHTML = ''
    contentDiv.innerHTML = ''
    buttonsDiv.innerHTML = ''
    answerInput.value = ''

    randomClueIndex = Math.floor(Math.random() * (cluesArray.length))
    randomQuestion = cluesArray[randomClueIndex].question
    
    // If the question is blank, keep searching for a question with content
    while(true) {
        if (randomQuestion == "") {
            randomClueIndex -=1
            randomQuestion = cluesArray[randomClueIndex].question
        } else {
            break
        }
    }
    
    randomAnswer = cluesArray[randomClueIndex].answer

    // Filtering out html elements in the answers. All observed answers contain single letter tags, does not work for tags with 2 letters. i.e. <em></em>
    let elFirstIndex = ''
    let elEndingFirstIndex = ''
    let wordArray = []

    if (randomAnswer[0] === '<'){
        randomAnswer = randomAnswer.slice(3, -4)
    } else {
        wordArray = randomAnswer.split('')
        for (let i = 0; i < wordArray.length; i++) {

            if (wordArray[i] === '<' && wordArray[i-1] === ' ') {
                elFirstIndex = i
            } else if (wordArray[i] === '<') {
                elEndingFirstIndex = i
            }
        }
        if (elFirstIndex === '') {
            randomAnswer = randomAnswer
        } else {
            wordArray.splice(elFirstIndex, 3)
            wordArray.splice((elEndingFirstIndex - 3), 4)
            randomAnswer = wordArray.join('')
        }
    }
    
    //Page render for question display
    title.innerHTML = '<h2>JEOPARDY<h2>'
    scoreCounter.innerText = scoreTracker

    //'Renders' (turns on ) the score tracker
    scoreCounter.style.display = 'flex'

    contentDiv.innerHTML = `<h4 id = "category">Category:</br>${randomCategory.title}</h4><p id = "question">${randomQuestion}</p>`

    contentDiv.append(answerInput)
    buttonsDiv.append(submitBtn)

    callQuestion()
}

function answerRender() {
    //Clearing page for answer reveal
    contentDiv.innerHTML = ''
    buttonsDiv.innerHTML = ''

    //Individual renders for if the answer is correct or not
    if (randomAnswer.toLocaleLowerCase() === answerInput.value.toLowerCase()) {
        answerDiv.style.border = '0.5rem solid lightgreen'
        answerDiv.style.borderRadius = '30px'
        answerDiv.style.background = 'lightgreen'
        answerDiv.style.boxShadow = 'inset 9px 9px 18px #7ccd7c, inset -9px -9px 18px #a4ffa4';
        answerDiv.innerText = randomAnswer
        contentDiv.append(answerDiv)

        correctAnswerText.style.fontSize = '2rem'
        contentDiv.append(correctAnswerText)

        scoreTracker += 1
        scoreCounter.innerText = scoreTracker

        buttonsDiv.append(nextQuestionBtn)

    } else {
        answerDiv.style.border = '0.5rem solid salmon'
        answerDiv.style.borderRadius = '30px'
        answerDiv.style.background = 'salmon'
        answerDiv.style.boxShadow = 'inset 9px 9px 18px #d76e62, inset -9px -9px 18px #ff9282';
        answerDiv.innerText = 'Game Over'
        contentDiv.append(answerDiv)

        let correctAnswerDiv = document.createElement('div')
        correctAnswerDiv.innerHTML = `<p>Correct Answer:</br>${randomAnswer}`
        contentDiv.append(correctAnswerDiv)

        buttonsDiv.append(restartBtn)

        scoreTracker = 0
    }


}

startBtn.addEventListener('click', questionRender)
submitBtn.addEventListener('click', answerRender)
nextQuestionBtn.addEventListener('click', questionRender)
restartBtn.addEventListener('click', startingPage)