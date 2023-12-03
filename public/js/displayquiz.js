// const questions = [
//   {
//       question: "What is the capital of France?",
//       options: ["Paris", "London", "Berlin", "Madrid"],
//       correctAnswer: "Paris",
//   },
//   {
//       question: "Which planet is known as the Red Planet?",
//       options: ["Venus", "Mars", "Jupiter", "Saturn"],
//       correctAnswer: "Mars",
//   },
//   // Add more questions here
// ];
// Get a reference to the div element by its ID
var dataContainer = document.getElementById("data-container");

// Get the data attribute value as a string
var dataAttribute = dataContainer.getAttribute("data-ejs-data");

// Parse the JSON string into a JavaScript object
var questions = JSON.parse(dataAttribute);

let currentQuestion = 0;
let selectedOptions = [];
let timer;
const timerContent = document.querySelector("#timer").textContent;
let timeLeft = timerContent;
console.log(timeLeft); // 5 minutes in seconds

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");
const resultElement = document.getElementById("result");
const timerElement = document.getElementById("timer");

function startTimer() {
  timer = setInterval(function () {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    // Format the time into "HH:MM:SS" and update the timer element
    timerElement.textContent = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    
    if (timeLeft === 0) {
      clearInterval(timer);
      submitQuiz(); // Call your submitQuiz function when the timer reaches 0
    } else {
      timeLeft--;
    }
  }, 1000);
}

function loadQuestion() {
  const question = questions[currentQuestion];
  questionElement.textContent = question.question;
  optionsElement.innerHTML = "";
  question.options.forEach((option, index) => {
    const optionElement = document.createElement("li");
    optionElement.textContent = option;
    optionElement.addEventListener("click", () => selectOption(index));
    optionsElement.appendChild(optionElement);
  });

  if (selectedOptions[currentQuestion] !== undefined) {
    optionsElement.children[selectedOptions[currentQuestion]].classList.add(
      "selected"
    );
  }

  prevButton.disabled = currentQuestion === 0;
  nextButton.disabled = currentQuestion === questions.length - 1;
  submitButton.style.display =
    currentQuestion === questions.length - 1 ? "block" : "none"; // Show submit button on the last question
}

function selectOption(index) {
  selectedOptions[currentQuestion] = index;

  // Remove the "selected" class from all options and add it to the selected one.
  for (let i = 0; i < optionsElement.children.length; i++) {
    optionsElement.children[i].classList.remove("selected");
  }
  optionsElement.children[index].classList.add("selected");
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  }
}

function calculateScore() {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (
      selectedOptions[i] !== undefined &&
      questions[i].options[selectedOptions[i]] === questions[i].correctOption
    ) {
      score++;
    }
  }
  return score;
}

// function submitQuiz() {
//   clearInterval(timer);
//   prevButton.disabled = true;
//   nextButton.disabled = true;
//   submitButton.disabled = true;

//   const score = calculateScore();
//   resultElement.value = `Your Score: ${score} out of ${questions.length}`;
// }

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  clearInterval(timer);
  prevButton.disabled = true;
  nextButton.disabled = true;
  submitButton.disabled = true;
  e.preventDefault(); // Prevent the form from actually submitting
  const score = calculateScore();
  resultElement.value = `${score}`;
  form.submit(); // Manually submit the form
});

loadQuestion();
startTimer();
