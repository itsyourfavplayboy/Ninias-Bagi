// CONFIG
const QUESTIONS_PER_GAME = 30;
const TIME_PER_QUESTION = 60; // seconds



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
{ q: 'Which element do we breathe in that helps our cells? (commonly referenced)', choices:['Carbon','Oxygen','Nitrogen','daqalis worebi'], answer:1, topic:'Elements' },
{ q: 'Which gas makes party balloons float?', choices:['idioti levani','Oxygen','Helium','Carbon dioxide'], answer:2, topic:'Gases' },
{ q: 'Which is a shiny metal?', choices:['Sulfur','Copper','Carbon','breketebi'], answer:1, topic:'Elements' },
{ q: 'Which is used in pencils?', choices:['Iron','Gold','zangi bavshvis','Graphite (Carbon)'], answer:3, topic:'Materials' },


// --- 7 Flirty  ---
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
{ q: 'What is a food that famously never spoils?', choices:['skolis lobiani','Honey','dakonservebuli banani','marili'], answer:1, topic:'Trivia' }
];



// GAME STATE
let gameQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedChoiceIndex = null;
let timerId = null;
let timeLeft = TIME_PER_QUESTION;

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
const classroomImg = document.getElementById('classroomImg');
const teacherImg = document.getElementById('teacherImg');
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
  // Create a shallow copy and shuffle
  const poolCopy = QUESTION_POOL.slice();
  shuffle(poolCopy);

  // limit to QUESTIONS_PER_GAME or pool length
  gameQuestions = poolCopy.slice(0, Math.min(QUESTIONS_PER_GAME, poolCopy.length));
  currentIndex = 0;
  score = 0;
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
  // update header / meta
  qNumber.textContent = `Question ${currentIndex + 1} / ${gameQuestions.length}`;
  qIndex.textContent = `${currentIndex + 1}`;
  qTopic.textContent = q.topic || '';
  questionText.textContent = q.q || 'No question text';

  // render choices
  choicesWrap.innerHTML = '';
  selectedChoiceIndex = null;

  q.choices.forEach((choiceText, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    btn.setAttribute('data-index', i);
    btn.setAttribute('aria-pressed', 'false');
    btn.innerText = choiceText;
    btn.addEventListener('click', () => selectChoice(i));
    choicesWrap.appendChild(btn);
  });

  // reset submit button
  submitBtn.disabled = false;

  // initialize timer for this question
  timeLeft = TIME_PER_QUESTION;
  updateTimeUI();
  startTimer();
}

function selectChoice(i) {
  const previous = choicesWrap.querySelector('.choice.selected');
  if (previous) {
    previous.classList.remove('selected');
    previous.setAttribute('aria-pressed', 'false');
  }

  const btn = choicesWrap.querySelector(`.choice[data-index="${i}"]`);
  if (btn) {
    btn.classList.add('selected');
    btn.setAttribute('aria-pressed', 'true');
  }

  selectedChoiceIndex = i;
}

function disableChoices() {
  const buttons = choicesWrap.querySelectorAll('.choice');
  buttons.forEach(b => {
    b.disabled = true;
  });
}

function handleSubmit() {
  // If no selection, treat as wrong/skip after pressing submit
  const q = gameQuestions[currentIndex];

  // prevent double submit
  submitBtn.disabled = true;
  clearTimer();

  // If nothing selected, mark as no answer (wrong)
  const selected = typeof selectedChoiceIndex === 'number' ? selectedChoiceIndex : null;

  // Reveal correct / wrong styles
  const buttons = choicesWrap.querySelectorAll('.choice');
  buttons.forEach(btn => {
    const idx = Number(btn.getAttribute('data-index'));
    btn.classList.remove('selected');
    if (idx === q.answer) {
      btn.classList.add('correct');
    } else if (idx === selected) {
      btn.classList.add('wrong');
    }
    btn.disabled = true;
  });

  // award point if correct
  if (selected === q.answer) {
    score++;
    updateScoreUI();
  }

  // after short delay move to next
  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 800);
}

function handleSkip() {
  // skip immediately: stop timer and go to next question without scoring
  clearTimer();
  currentIndex++;
  showQuestion();
}

function endGame() {
  clearTimer();

  // render results from template
  const tpl = resultTemplate.content.cloneNode(true);
  // update score inside template clone
  const finalScoreEl = tpl.querySelector('#finalScore') || tpl.querySelector('.bigscore');
  if (finalScoreEl) finalScoreEl.textContent = `${score} / ${gameQuestions.length}`;

  // replace question-area content with results
  const questionArea = document.querySelector('.question-area');
  if (questionArea) {
    questionArea.innerHTML = '';
    questionArea.appendChild(tpl);
  }
}

// TIMER
function startTimer() {
  updateTimeUI();
  timerId = setInterval(() => {
    timeLeft = timeLeft - 1;
    if (timeLeft <= 0) {
      // time's up: treat as auto-submit (no selection)
      clearTimer();
      revealTimeUp();
      return;
    }
    updateTimeUI();
  }, 1000);
}

function clearTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimeUI() {
  timeLeftEl.textContent = `${timeLeft}s`;
  const pct = Math.max(0, (timeLeft / TIME_PER_QUESTION) * 100);
  if (timerBar) timerBar.style.width = `${pct}%`;
}

function revealTimeUp() {
  // Show correct answer and mark wrong, then continue
  const q = gameQuestions[currentIndex];
  const buttons = choicesWrap.querySelectorAll('.choice');
  buttons.forEach(btn => {
    const idx = Number(btn.getAttribute('data-index'));
    btn.disabled = true;
    if (idx === q.answer) btn.classList.add('correct');
  });

  submitBtn.disabled = true;
  // advance after short pause
  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 900);
}

function updateScoreUI() {
  scoreEl.textContent = score;
}

// EVENT BINDINGS
submitBtn.addEventListener('click', () => {
  handleSubmit();
});

skipBtn.addEventListener('click', () => {
  handleSkip();
});

restartBtn.addEventListener('click', () => {
  // Restore the original question-area if it was replaced by results
  const questionArea = document.querySelector('.question-area');
  if (questionArea) {
    // Recreate expected HTML structure if results replaced it
    // (We will rebuild from scratch: simple approach is to reload page content,
    // but to remain in JS, we'll just re-run prepareGame and re-render.)
    // For safety, reload page to guarantee original layout restored:
    location.reload();
  } else {
    prepareGame();
  }
});

// When the page is hidden (user switches tab) pause timer to avoid unexpected behavior
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // pause
    clearTimer();
  } else {
    // When visible again, restart the timer for the current question
    // (keeps remaining time as-is)
    if (currentIndex < gameQuestions.length) startTimer();
  }
});

// keyboard accessibility: number keys to pick choices, Enter to submit, S to skip
document.addEventListener('keydown', (e) => {
  // ignore when focus is in an input or textarea
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  const key = e.key;
  if (key >= '1' && key <= '9') {
    const n = Number(key) - 1;
    const choiceBtn = choicesWrap.querySelector(`.choice[data-index="${n}"]`);
    if (choiceBtn) selectChoice(n);
  } else if (key === 'Enter') {
    handleSubmit();
  } else if (key.toLowerCase() === 's') {
    handleSkip();
  }
});

// Start
window.addEventListener('load', () => {
  // Ensure there is at least one question; otherwise show empty state
  if (!QUESTION_POOL || QUESTION_POOL.length === 0) {
    questionText.textContent = 'No questions defined. Please add questions to QUESTION_POOL in script.js';
    submitBtn.disabled = true;
    skipBtn.disabled = true;
    return;
  }
  prepareGame();
});
