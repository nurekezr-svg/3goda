(() => {
  'use strict';

  const music = document.getElementById('backgroundMusic');
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  const beginBtn = document.getElementById('beginBtn');
  const acceptBtn = document.getElementById('acceptBtn');
  const acceptedMessage = document.getElementById('acceptedMessage');
  const runawayBtn = document.getElementById('runawayBtn');
  const runawayWrap = document.getElementById('runawayWrap');
  let runawayCount = 0;

  // Music starts only after a deliberate user action; browsers block autoplay with sound.
  let musicUnavailableMessageShown = false;

  async function toggleMusic() {
    if (!music.paused) {
      music.pause();
      soundLabel.textContent = 'Включить музыку';
      soundToggle.setAttribute('aria-label', 'Включить музыку');
      return;
    }

    try {
      await music.play();
      soundLabel.textContent = 'Выключить музыку';
      soundToggle.setAttribute('aria-label', 'Выключить музыку');
    } catch (error) {
      soundLabel.textContent = 'Добавь music.mp3';
      soundToggle.setAttribute('aria-label', 'Для музыки добавь файл music.mp3');
      if (!musicUnavailableMessageShown) {
        musicUnavailableMessageShown = true;
        alert('Чтобы музыка играла, положи аудиофайл рядом с index.html и назови его music.mp3. Используй файл, который имеешь право использовать.');
      }
    }
  }

  soundToggle.addEventListener('click', toggleMusic);

  beginBtn.addEventListener('click', async () => {
    document.getElementById('how').scrollIntoView({ behavior: 'smooth' });
    if (music.paused) {
      try {
        await music.play();
        soundLabel.textContent = 'Выключить музыку';
        soundToggle.setAttribute('aria-label', 'Выключить музыку');
      } catch (error) {
        // The page remains fully usable even when music.mp3 hasn't been added yet.
      }
    }
  });

  function dodgeButton(event) {
    if (!runawayBtn || runawayBtn.hidden) return;
    if (event) event.preventDefault();
    runawayCount++;
    if (runawayCount >= 6) {
      runawayWrap.classList.add('runaway-gone');
      window.setTimeout(() => { runawayWrap.hidden = true; acceptBtn.hidden = false; }, 550);
      return;
    }
    const maxX = Math.max(0, window.innerWidth - runawayBtn.offsetWidth - 28);
    const maxY = Math.max(0, window.innerHeight - runawayBtn.offsetHeight - 28);
    runawayBtn.style.position = 'fixed';
    runawayBtn.style.left = Math.round(14 + Math.random() * Math.max(1, maxX - 14)) + 'px';
    runawayBtn.style.top = Math.round(14 + Math.random() * Math.max(1, maxY - 14)) + 'px';
    runawayBtn.style.zIndex = '9999';
    runawayBtn.style.transform = 'rotate(' + (Math.random() * 12 - 6) + 'deg)';
  }
  if (runawayBtn) {
    runawayBtn.addEventListener('pointerenter', dodgeButton);
    runawayBtn.addEventListener('touchstart', dodgeButton, { passive: false });
    runawayBtn.addEventListener('click', dodgeButton);
  }

  acceptBtn.addEventListener('click', () => {
    acceptedMessage.hidden = false;
    acceptBtn.textContent = 'Секрет принят ❤️';
    acceptBtn.disabled = true;
    acceptBtn.style.opacity = '.7';
    acceptedMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    createSoftHearts();
  });

  function createSoftHearts() {
    const section = document.getElementById('invite');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    for (let i = 0; i < 18; i++) {
      const heart = document.createElement('span');
      heart.textContent = ['♡', '♥', '✦'][i % 3];
      heart.setAttribute('aria-hidden', 'true');
      heart.style.cssText = [
        'position:absolute',
        'left:' + (8 + Math.random() * 84) + '%',
        'top:' + (20 + Math.random() * 55) + '%',
        'color:rgba(220,178,157,' + (0.35 + Math.random() * 0.45) + ')',
        'font-size:' + (12 + Math.random() * 17) + 'px',
        'pointer-events:none',
        'z-index:2',
        'animation:softFloat ' + (2 + Math.random() * 1.5) + 's ease-out forwards'
      ].join(';');
      section.appendChild(heart);
      window.setTimeout(() => heart.remove(), 4000);
    }
  }

  const floatStyle = document.createElement('style');
  floatStyle.textContent = '@keyframes softFloat{0%{transform:translateY(0) rotate(0);opacity:0}15%{opacity:1}100%{transform:translateY(-100px) rotate(18deg);opacity:0}}';
  document.head.appendChild(floatStyle);

  // Reveal content as the reader reaches it; disable animation if reduced motion is preferred.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Photo slots are intentionally placeholders until the matching photos are selected.
  // To add a photo, replace the placeholder div's contents in index.html with an <img>,
  // or set the background image in style.css for the relevant .image-astana/.image-mom/.image-chain.

  // A short, affectionate quiz based on real moments from their story.
  const quizQuestions = [
    {
      question: 'Какого числа я впервые написал тебе в Instagram?',
      options: ['18 октября ❤️', '30 октября — сразу с предложением встречаться 😂', '1 января, с Нового года начал новую жизнь'],
      correct: 0,
      correctText: '18 октября! А началось всё с простого «привет» и легендарного «Пибет пибет» 😂',
      wrongText: 'Не-а, черт 😄 Первый раз я написал тебе в Instagram 18 октября.'
    },
    {
      question: 'На чей концерт ты ходила, когда я тебя забирал?',
      options: ['Мона Сонгз', 'На концерт самого sktrw 😂', 'На концерт, о котором мы до сих пор спорим'],
      correct: 0,
      correctText: 'Мона Сонгз! Кто бы тогда подумал, что обычная поездка домой станет началом нашей истории ❤️',
      wrongText: 'Мимо, Нурсик! Это был концерт Мона Сонгз 😄'
    },
    {
      question: 'Какой у меня был ник в TikTok, когда мы только знакомились?',
      options: ['nurik_love_2003', 'sktrw', 'Е_дауай_короч'],
      correct: 1,
      correctText: 'sktrw 😂 Ник, конечно, легендарный. Историю его появления уже не будем расследовать.',
      wrongText: 'Нет, черт 😂 Правильный ответ — sktrw. Запоминай, это архивные данные!'
    },
    {
      question: 'Когда я предложил тебе быть вместе?',
      options: ['18 октября 2023 года', '30 октября 2023 года ❤️', 'Когда ты разгадала мой ник в TikTok'],
      correct: 1,
      correctText: '30 октября 2023 года — и та самая цепочка, которую ты носишь до сих пор. ❤️',
      wrongText: 'Не-а 😄 Это было 30 октября 2023 года — день, который я очень хорошо помню.'
    },
    {
      question: 'Что мы говорим, когда что-то не нравится или уже надоело?',
      options: ['«Е дауай короч»', '«Всё, вызываю комиссию»', '«Я официально обиделся на 3–5 рабочих дней»'],
      correct: 0,
      correctText: 'Е ДАУАЙ КОРОЧ 😂 Вот это уже наш культурный код.',
      wrongText: 'Не угадала, черт! Наш фирменный вариант — «Е дауай короч» 😂'
    }
  ];
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;
  const quizCard = document.getElementById('quizCard');
  const quizResult = document.getElementById('quizResult');
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizNumber = document.getElementById('quizNumber');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizNext = document.getElementById('quizNext');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const quizProgressLabel = document.getElementById('quizProgressLabel');
  const quizResultTitle = document.getElementById('quizResultTitle');
  const quizResultText = document.getElementById('quizResultText');

  function renderQuizQuestion() {
    const item = quizQuestions[quizIndex];
    quizAnswered = false;
    quizNumber.textContent = `ВОПРОС ${String(quizIndex + 1).padStart(2, '0')}`;
    quizQuestion.textContent = item.question;
    quizOptions.innerHTML = '';
    quizFeedback.textContent = '';
    quizNext.hidden = true;
    quizProgressBar.style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
    quizProgressLabel.textContent = `Вопрос ${quizIndex + 1} из ${quizQuestions.length}`;
    item.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.dataset.answer = String(index);
      button.textContent = option;
      button.addEventListener('click', () => answerQuiz(index));
      quizOptions.appendChild(button);
    });
  }

  function answerQuiz(answer) {
    if (quizAnswered) return;
    quizAnswered = true;
    const item = quizQuestions[quizIndex];
    const buttons = [...quizOptions.querySelectorAll('.quiz-option')];
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === item.correct) button.classList.add('correct');
      else if (index === answer) button.classList.add('wrong');
    });
    if (answer === item.correct) {
      quizScore++;
      quizFeedback.textContent = item.correctText;
    } else {
      quizFeedback.textContent = item.wrongText;
    }
    quizNext.textContent = quizIndex === quizQuestions.length - 1 ? 'Узнать результат' : 'Следующий вопрос →';
    quizNext.hidden = false;
  }

  if (quizCard) {
    renderQuizQuestion();
    quizNext.addEventListener('click', () => {
      if (quizIndex < quizQuestions.length - 1) {
        quizIndex++;
        renderQuizQuestion();
      } else {
        quizCard.hidden = true;
        quizResult.hidden = false;
        quizProgressBar.style.width = '100%';
        quizProgressLabel.textContent = 'Викторина пройдена';
        if (quizScore === quizQuestions.length) {
          quizResultTitle.textContent = 'Ну ты даёшь, черт! 🏆';
          quizResultText.textContent = '5 из 5! Похоже, наша история у тебя тоже на повторе. Приз — обнимашки на свидании. Обжалованию не подлежит.';
        } else if (quizScore >= 2) {
          quizResultTitle.textContent = 'Зачёт, Нурсик! 💗';
          quizResultText.textContent = `${quizScore} из ${quizQuestions.length}. Главное ты помнишь — а спорные моменты можем обсудить на свидании. Е дауай короч, без апелляций 😂`;
        } else {
          quizResultTitle.textContent = 'Надо повторить материал, черт 😂';
          quizResultText.textContent = `${quizScore} из ${quizQuestions.length}. Ничего страшного — для этого у нас есть целая жизнь, чтобы пересказывать друг другу любимые моменты.`;
        }
      }
    });
    document.getElementById('quizRestart').addEventListener('click', () => {
      quizIndex = 0;
      quizScore = 0;
      quizResult.hidden = true;
      quizCard.hidden = false;
      renderQuizQuestion();
    });
  }

})();
