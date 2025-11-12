// CONFIG
const QUESTIONS_PER_GAME = 30;
const TIME_PER_QUESTION = 60; // seconds

// QUESTION POOL (your full list)
const QUESTION_POOL = [
// --- 16 Chemistry / school (cleaned & safe) ---
{ q: 'Which is a noble gas?', choices:['Iron','Oxygen','Barni after eating too much carrot','Neon'], answer:3, topic:'Elements' },
{ q: 'Which is a metal?', choices:['Helium','Oxygen','Nirvana','Gold'], answer:3, topic:'Elements' },
{ q: 'Which element\'s symbol is O?', choices:['Osmium','Orange','Oxygen','Omg idk'], answer:2, topic:'Elements' },
{ q: 'Which is a liquid at room temperature?', choices:['Iron','My tears before exams','Mercury','Oxygen'], answer:2, topic:'States' },
{ q: 'Which is an acid?', choices:['Water','Soap','Lemon juice','Nino'], answer:2, topic:'Acids & Bases' },
{ q: 'Which color does litmus paper turn in acid?', choices:['Blue','Red','Green','Rainbow if you believe hard enough'], answer:1, topic:'Acids & Bases' },
{ q: 'Which is a gas?', choices:['Sodium','Nitrogen','Ask Jews','Silver'], answer:1, topic:'States' },
{ q: 'Which element is the lightest?', choices:['Gold','My wallet after lunch','Carbon','Hydrogen'], answer:3, topic:'Elements' },
{ q: 'Which is a halogen?', choices:['Sodium','Chlorine','Iron','I only know Halloween'], answer:1, topic:'Elements' },
{ q: 'Which side of the periodic table are metals mostly on?', choices:['Right','Left','shublze maxatia','Middle'], answer:1, topic:'Periodic Table' },
{ q: 'What is water\'s chemical formula?', choices:['First break up','H₂O','CO₂','NaCl'], answer:1, topic:'Compounds' },
{ q: 'Which is table salt?', choices:['H₂O','CO₂','NaCl','A chef\'s secret powder'], answer:2, topic:'Compounds' },
{ q: 'Which element do we breathe in that helps our cells?', choices:['Carbon','Oxygen','Nitrogen','daqalis worebi'], answer:1, topic:'Elements' },
{ q: 'Which gas makes party balloons float?', choices:['idioti levani','Oxygen','Helium','Carbon dioxide'], answer:2, topic:'Gases' },
{ q: 'Which is a shiny metal?', choices:['Sulfur','Copper','Carbon','breketebi'], answer:1, topic:'Elements' },
{ q: 'Which is used in pencils?', choices:['Iron','Gold','zangi bavshvis','Graphite (Carbon)'], answer:3, topic:'Materials' },

// --- 7 Flirty ---
{ q: 'Is this handsome teacher gay?', choices:['definitly','No','not gay but loves men','he wishes to'], answer:1, topic:'Flirty' },
{ q: 'Are you a popsicle? Cuz I wanna pop that a$$ 😏', choices:['kys','chagetvala','🤪🤪🤪','cota nela'], answer:2, topic:'Flirty' },
{ q: 'Which xinkali is best?', choices:['Iasna MTIULURI BIWOO','hmm qalaquri','atria jobia','wadi sheni'], answer:0, topic:'Flirty' },
{ q: 'December is over, but can you still destroy my tower?', choices:['😨','modi gijoo','kys','😲'], answer:1, topic:'Flirty' },
{ q: 'If I was a man… would you still look at me the same?', choices:['VICODII','NOPE','jirapic ro iyo ar gishvelis','😭"saidan igoneb ameebs"'], answer:0, topic:'Flirty' },
{ q: 'Who\'s got more chemistry — us or Na + Cl?', choices:['lit us - >🐱🐭','idioti','▶︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 0:10','Na + Cl'], answer:1, topic:'Flirty' },
{ q: 'Do we have covalent or ionic bond going on here? 😉', choices:['😳','🤓','kys🔥','😬'], answer:2, topic:'Flirty' },

// --- 3 Funny ---
{ q: 'Who won best black gay trans midget award?', choices:['Raioo??','arvici','Lenka','Neta VIN?!'], answer:2, topic:'Funny' },
{ q: 'Mamaflex tu Emiliatv?', choices:['Sade','Mamaflex','Luna','Emilia'], answer:3, topic:'Funny' },
{ q: 'Which of these is the most unstable thing?', choices:["Levanis iumori","yvela sworia","chemi tma gagvidzebisas","My sleep schedule😭"], answer:1, topic:'Funny' },

// --- 4 Random facts ---
{ q: 'Which planet has the most moons?', choices:['Jupiter','Mars','Saturn','Uranus'], answer:2, topic:'Trivia' },
{ q: 'How many bones are in the adult human body?', choices:['53','206','324','197'], answer:1, topic:'Trivia' },
{ q: 'Which animal can sleep for 3 years?', choices:['Snail','Bear','Chemi da','skandinaviuri machvi'], answer:0, topic:'Trivia' },
{ q: 'What food famously never spoils?', choices:['skolis lobiani','Honey','dakonservebuli banani','marili'], answer:1, topic:'Trivia' }
];

// GAME STATE
let gameQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedChoiceIndex = null;
let timerId = null;
let timeLeft = TIME_PER_QUESTION;
let userAnswers = [];

// DOM REFS
const qNumber = document.getElementById('qNumber');
const qTopic = document.getElementById('qTopic');
const questionText = document.getElementById('questionText');
const choicesWrap = document.getElementById('choices');
const submitBtn = document.getElementById('submitBtn');
const skipBtn = document.getElementById('skipBtn');
const timeLeftEl = document.getElementById('timeLeft');
const timerBar = document.getElementById('timerBar');
const scoreEl = document.getElementById('score');
const qIndex = document.getElementById('qIndex');
const restartBtn = document.getElementById('restart');
const resultTemplate = document.getElementById('resultTemplate');

// UTILS
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// GAME LIFECYCLE
function prepareGame() {
  const poolCopy = QUESTION_POOL.slice();
  shuffle(poolCopy);
  gameQuestions = poolCopy.slice(0, Math.min(QUESTIONS_PER_GAME, poolCopy.length));
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  updateScoreUI();
  showQuestion();
}

function showQuestion() {
  clearTimer();
  if (currentIndex >= gameQuestions.length) {
    endGame();
    return;
  }

  const q = gameQuestions[currentIndex];
  qNumber.textContent = `Question ${currentIndex + 1} / ${gameQuestions.length}`;
  qIndex.textContent = `${currentIndex + 1}`;
  qTopic.textContent = q.topic || '';
  questionText.textContent = q.q || 'No question text';

  choicesWrap.innerHTML = '';
  selectedChoiceIndex = null;
  q.choices.forEach((choiceText, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    btn.setAttribute('data-index', i);
    btn.innerText = choiceText;
    btn.addEventListener('click', () => selectChoice(i));
    choicesWrap.appendChild(btn);
  });

  submitBtn.disabled = false;
  timeLeft = TIME_PER_QUESTION;
  updateTimeUI();
  startTimer();
}

function selectChoice(i) {
  const previous = choicesWrap.querySelector('.choice.selected');
  if (previous) previous.classList.remove('selected');
  const btn = choicesWrap.querySelector(`.choice[data-index="${i}"]`);
  btn.classList.add('selected');
  selectedChoiceIndex = i;
}

function handleSubmit() {
  const q = gameQuestions[currentIndex];
  submitBtn.disabled = true;
  clearTimer();
  const selected = typeof selectedChoiceIndex === 'number' ? selectedChoiceIndex : null;

  userAnswers.push({
    question: q.q,
    selectedChoice: selected !== null ? q.choices[selected] : 'No answer',
    correctChoice: q.choices[q.answer],
    isCorrect: selected === q.answer,
    topic: q.topic
  });

  const buttons = choicesWrap.querySelectorAll('.choice');
  buttons.forEach(btn => {
    const idx = Number(btn.getAttribute('data-index'));
    btn.classList.remove('selected');
    if (idx === q.answer) btn.classList.add('correct');
    else if (idx === selected) btn.classList.add('wrong');
    btn.disabled = true;
  });

  if (selected === q.answer) {
    score++;
    updateScoreUI();
  }

  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 800);
}

function handleSkip() {
  clearTimer();
  currentIndex++;
  showQuestion();
}

// ✅ EMAILJS SETUP
const EMAILJS_SERVICE_ID = "service_fqqu33e";
const EMAILJS_TEMPLATE_ID = "template_loph1rs";
const EMAILJS_PUBLIC_KEY = "5FIW1hSOqDH-I32Rw";

emailjs.init(EMAILJS_PUBLIC_KEY);

// END GAME
function endGame() {
  clearTimer();

  let answersSummary = `Quiz Results: ${score} / ${gameQuestions.length}\n\n`;
  userAnswers.forEach((a, i) => {
    answersSummary += `Q${i + 1}: ${a.question}\nYour Answer: ${a.selectedChoice}\nCorrect: ${a.correctChoice}\nResult: ${a.isCorrect ? "✅" : "❌"}\nTopic: ${a.topic}\n\n`;
  });

  const templateParams = {
    to_email: "itsyourfavplayboy@gmail.com",
    message: answersSummary,
    score: `${score}/${gameQuestions.length}`
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => console.log("✅ Results sent successfully!"))
    .catch(err => console.error("❌ Email failed:", err));

  const tpl = resultTemplate.content.cloneNode(true);
  const finalScoreEl = tpl.querySelector('#finalScore') || tpl.querySelector('.bigscore');
  if (finalScoreEl) finalScoreEl.textContent = `${score} / ${gameQuestions.length}`;
  document.querySelector('.question-area').innerHTML = '';
  document.querySelector('.question-area').appendChild(tpl);
}

function updateScoreUI() {
  scoreEl.textContent = score;
}

function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearTimer();
      revealTimeUp();
      return;
    }
    updateTimeUI();
  }, 1000);
}

function clearTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function updateTimeUI() {
  timeLeftEl.textContent = `${timeLeft}s`;
  if (timerBar) timerBar.style.width = `${(timeLeft / TIME_PER_QUESTION) * 100}%`;
}

function revealTimeUp() {
  const q = gameQuestions[currentIndex];
  const buttons = choicesWrap.querySelectorAll('.choice');
  buttons.forEach(btn => {
    const idx = Number(btn.getAttribute('data-index'));
    btn.disabled = true;
    if (idx === q.answer) btn.classList.add('correct');
  });

  userAnswers.push({
    question: q.q,
    selectedChoice: 'No answer',
    correctChoice: q.choices[q.answer],
    isCorrect: false,
    topic: q.topic
  });

  submitBtn.disabled = true;
  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 900);
}

submitBtn.addEventListener('click', handleSubmit);
skipBtn.addEventListener('click', handleSkip);
restartBtn.addEventListener('click', () => location.reload());
window.addEventListener('load', prepareGame);
