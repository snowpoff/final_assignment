let userQuestion
let userHint
let questionArray = []
let questionLog
let questionCounter
let flashcardArray = []

const ls = localStorage


// saves question from values in fields. id is for locating the element for use in delete function

function saveQuestion() {
    userQuestion = document.getElementById("questionEntry").value
    userHint = document.getElementById("hintEntry").value
    
    if (userQuestion === null || userQuestion === undefined || userQuestion == ""){
        window.alert("Please enter a question.")
    } else {
        if (userHint === null || userHint === undefined || userHint == "") {
            userHint = "no hint available"
            questionLog = {
            question: userQuestion,
            hint: "no hint available",
            key: (Math.random()*1000).toFixed(3)
            }
        } else {
            questionLog = {
            question: userQuestion,
            hint: userHint,
            key: (Math.random()*1000).toFixed(3)
            }
        }

        questionArray.push(questionLog)
        
        let id = questionLog.key

        const ol = document.querySelector("ol")
        const li = document.createElement("li")
        const span = document.createElement("span")
        const button = document.createElement("button")
        li.textContent = "question: " + userQuestion + ", hint: " + userHint
        span.setAttribute("id", id)
        button.textContent = "[delete]"
        button.setAttribute("onClick","deleteQuestion(this.previousSibling.id)")
        button.setAttribute("style","margin-left: 4px; color: red; background-color: lightskyblue; border: none;")
        ol.appendChild(li)
        li.appendChild(span)
        li.appendChild(button)
        
        resetField()
    }
    
}



// resets entry fields

function resetField() {
    document.getElementById("question").value = ""
    document.getElementById("hint").value = ""
}




// saves all questions in questionArray to localstorage

function saveQuestions() {
    localStorage.setItem("questionList", JSON.stringify(questionArray))
}




// loads all questions from localstorage and appends them to list

function loadQuestions() {
    let oldQuestionArray = JSON.parse(localStorage.getItem("questionList"))
    questionArray.push.apply(questionArray, oldQuestionArray)
    
    
    for (i = (questionArray.length - oldQuestionArray.length); i < questionArray.length; i++) {
        const ol = document.querySelector("ol")
        const li = document.createElement("li")
        li.textContent = "question: " + questionArray[i].question + ", hint: " + questionArray[i].hint
        ol.appendChild(li)
    }
}


// deletes specific question from list

function deleteQuestion(id) {
    const li = document.getElementById(id)
    li.parentNode.parentNode.removeChild(li.parentNode);
    
    let indexToRemove    
    for (let i = 0; i < questionArray.length; i++) {
        if (questionArray[i].key == id) {
            indexToRemove = i;
            questionArray.splice(indexToRemove, 1)
            break
        }
    }

}


// deletes entire question list

function deleteAll() {
    let listNode = document.getElementById("questionList")
    while (listNode.firstChild) {
        listNode.removeChild(listNode.firstChild)
    }
    questionArray.splice(0, questionArray.length)
    localStorage.setItem("questionList", JSON.stringify(questionArray))
}



// starts flashcards (hides question creation and shows flashcards in a shuffled array)

function startQuiz() {
    
    if (questionArray.length == 0) {
        window.alert("You have not entered any questions!")
    } else {
    document.getElementById("questionMaking").style = "display: none;"
    document.getElementById("endQuiz").style = "display: inline;"
    document.getElementById("flashcards").style = "display: block;"
    document.getElementById("nextQuestion").style = "display: inline;"
    document.getElementById("saveQuestions").style = "display: none;"
    document.getElementById("loadQuestions").style = "display: none;"
    
    flashcardArray = Array.from(questionArray)
    flashcardArray = shuffle(flashcardArray)
    
    questionCounter = 0
    generateFlashcards()

    }
}


// creates flashcards from shuffled array and counts number of questions remaining

function generateFlashcards() {
    document.getElementById("question").innerHTML = flashcardArray[questionCounter].question
    document.getElementById("hint").innerHTML = flashcardArray[questionCounter].hint
    document.getElementById("showHint").style = "display: inline;"
    document.getElementById("hint").style = "display: none;"
    document.getElementById("questionsRemaining").innerHTML = "There are " + (flashcardArray.length - (questionCounter + 1))+ " questions remaining."
    
   if ((flashcardArray.length - (questionCounter + 1) == 0 )) {
        document.getElementById("nextQuestion").style = "display: none;"
        } 
}



// skip to next question 

function nextQuestion() {
        questionCounter++
        generateFlashcards()
}

// show hint

function showHint() {
    document.getElementById("hint").style = "display: inline;"
    document.getElementById("showHint").style = "display: none;"
}

// ends flashcards (by hiding flashcards and displaying question creation/list)

function endQuiz() {
    document.getElementById("questionMaking").style = "display: block;"
    document.getElementById("endQuiz").style = "display: none;"
    document.getElementById("flashcards").style = "display: none;"
    document.getElementById("saveQuestions").style = "display: inline;"
    document.getElementById("loadQuestions").style = "display: inline;"
}





// -- Fisher-Yates shuffle 
// -- code from: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

