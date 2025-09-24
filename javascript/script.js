const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const startbtn = document.querySelector(".start-quiz-button");
const nextbtn = document.querySelector(".next-question-btn");
const answerOption = document.querySelector(".answer-options");
const questionStatus = document.querySelector(".question-status");
const resultContainer = document.querySelector(".result-container");
const tryagainbtn = document.querySelector(".try-again-btn");
const timerDisplay = document.querySelector(".time-duration");


  let currentQuestion = null;
  let quizCategory = "geography"
  const questionIndexHistory = [];
  let numberOfQuestions = 5;
  let correctAnswerCount = 0;
  const QUIZ_TIME_LIMIT = 15;
  let currentTime = QUIZ_TIME_LIMIT;
  let timer = null;

  const startfnc = () =>{
    startbtn.addEventListener("click" , startQuiz)
  }
const nextfnc = ()=> {
    nextbtn.addEventListener("click" , renderQuestion)
}
 const tryfnc = () => {
    tryagainbtn.addEventListener("click" , resetQuiz)
 }
 // clear and reset the timer
 const resetTimer =() => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}`;
    quizContainer.querySelector(".quiz-timer").style.background = "#000"; // reset to black
}
 // initialize and start the timer for the current question
const startTimer = () => {
    timer = setInterval(()=> {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if(currentTime <=0) {
            clearInterval(timer);
            highlightCorrectAnswer();
            document.querySelector(".next-question-btn").style.visibility = "visible";
            quizContainer.querySelector(".quiz-timer").style.background = "#c31402";
            // disable all anser options after one option is selected
            answerOption.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
        }
    },1000)
}

// display the quiz result and hide the quiz container

const showQuizResult = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const resultText = `You answered <b>${correctAnswerCount}<b/> out of <b>${numberOfQuestions}</b> questions correctly. Great Effort!`;
    document.querySelector(".result-message").innerHTML = resultText;
}

 const getRandomQuestion = ()=>{
    const categoryQuestions = questions.find(cat =>  cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];
    console.log(categoryQuestions);
    
    
    //show the results if all questions have been used
    if(questionIndexHistory.length >= numberOfQuestions){
        return showQuizResult();
    }
    
    // filter out the already asked questions and choose a random one
    const availableQuestions = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    console.log(randomQuestion);
    return randomQuestion;
    
 }
 // handle the correct answer option and add icon
const highlightCorrectAnswer = () => {
    const correctOption = answerOption.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class = "material-symbols-outlined">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}

// handle the user answer selection
const handleAnswer = (option, answerIndex) => {
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect? 'correct':'incorrect');

   !isCorrect ? highlightCorrectAnswer():correctAnswerCount++;

    // insert icon based on correctness
    const iconHTML = `<span class="material-symbols-outlined">${isCorrect? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    // disable all answer options after one option is selected
    answerOption.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
    document.querySelector(".next-question-btn").style.visibility = "visible";


}
const renderQuestion = ()=> {
    currentQuestion = getRandomQuestion();
   if(!currentQuestion) return;

    resetTimer();
    startTimer();

    // update the ui
    answerOption.innerHTML = "";
    document.querySelector(".next-question-btn").style.visibility = "hidden";
    document.querySelector(".question-text").textContent = currentQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

    // create option list element and append them and add click event listeners
     currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOption.appendChild(li);
         li.addEventListener("click", ()=> handleAnswer(li, index));
     })
}

// start the quiz and render the question 
const startQuiz =()=> {
    configContainer.style.display = "none";
    quizContainer.style.display = " block";
    
    // update the quiz category and number of questions
    quizCategory = configContainer.querySelector(".category-option.active").textContent;
    numberOfQuestions = parseInt(configContainer.querySelector(".question-option.active").textContent);

    renderQuestion();
}
// highlight the selected option on click category or no of questions
document.querySelectorAll(".category-option,.question-option").forEach(option => {
    option.addEventListener("click", ()=> {
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    })
})
// reset the quiz and return to the configuration container
const resetQuiz = () => {
    correctAnswerCount = 0;
    questionIndexHistory.length = 0;
    resultContainer.style.display = "none";
    configContainer.style.display = "block";
}

startfnc();
tryfnc();
nextfnc();

