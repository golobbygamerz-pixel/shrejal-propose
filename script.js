
"use strict";

/* =========================================================
   PERSONAL CONTENT — EDIT YOUR OWN WORDS IN THIS SECTION
   Replace the prompts with your real story and messages.
   ========================================================= */

const personalContent = {
  story: `
OUR STORY

How we first met:
[Write how and where you first met.]

How our conversations started:
[Write how your first conversations began.]

My first impression of you:
[Write your honest first impression.]

Our special moments:
[Add your favourite real moments together.]

When I started liking you:
[Write when you realised you liked her.]

Why you became special to me:
[Explain what makes this connection special.]

Our journey so far:
[Write about your journey together.]
  `,

  love: `
HOW MUCH I LOVE YOU

Why I love you:
[Write what you genuinely love about her.]

What makes you special:
[Write the little things that make her unique.]

What I admire about you:
[Write what you admire about her.]

What makes me happy:
[Write the moments that make you smile.]

What I wish for us:
[Write your hopes for the future, without pressure.]

A personal ending message:
[Write your own heartfelt ending.]
  `,

  stars: [
    "Something I like about you: [Add your message here.]",
    "Why you are special: [Add your message here.]",
    "Something that makes me smile: [Add your message here.]",
    "A little promise: [Add a promise you can genuinely keep.]",
    "A secret message: [Add your own little secret here.]"
  ]
};

/* =========================================================
   APP ELEMENTS
   ========================================================= */

const screens = [...document.querySelectorAll(".screen")];
const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");
const volumeControl = document.getElementById("volumeControl");
const toast = document.getElementById("toast");

let celebrationTimer = null;
let toastTimer = null;
let yesRequestStarted = false;

music.volume = Number(volumeControl.value);

/* =========================================================
   NAVIGATION
   ========================================================= */

function showScreen(screenId) {
  const target = document.getElementById(screenId);
  if (!target) return;

  screens.forEach(screen => screen.classList.remove("active"));
  target.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.go);
  });
});

/* =========================================================
   GALAXY BACKGROUND
   ========================================================= */

function createGalaxy() {
  const galaxy = document.getElementById("galaxy");
  const symbols = ["✦", "✧", "·", "♡"];

  for (let i = 0; i < 90; i++) {
    const star = document.createElement("span");
    star.className = "galaxy-star";
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.fontSize = `${8 + Math.random() * 15}px`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    galaxy.appendChild(star);
  }
}
createGalaxy();

/* =========================================================
   MUSIC PLAYER
   ========================================================= */

async function playMusic() {
  try {
    await music.play();
    musicToggle.textContent = "Ⅱ";
    musicToggle.classList.add("playing");
    musicStatus.textContent = "Now playing";
  } catch (error) {
    musicStatus.textContent = "Tap play to start";
    showToast("Music could not start. Please tap the music button.");
  }
}

function pauseMusic() {
  music.pause();
  musicToggle.textContent = "▶";
  musicToggle.classList.remove("playing");
  musicStatus.textContent = "Music paused";
}

musicToggle.addEventListener("click", () => {
  if (music.paused) playMusic();
  else pauseMusic();
});

volumeControl.addEventListener("input", event => {
  music.volume = Number(event.target.value);
});

/* Music starts only after the visitor taps START */
document.getElementById("startButton").addEventListener("click", async () => {
  showScreen("teddyWorld");
  await playMusic();
});

/* =========================================================
   TEDDY INTERACTIONS
   ========================================================= */

document.querySelectorAll(".teddy-card").forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("teddyMessage").textContent =
      card.dataset.message;
    card.classList.add("teddy-selected");
    setTimeout(() => card.classList.remove("teddy-selected"), 500);
  });
});

/* =========================================================
   EDITABLE LETTER CONTENT
   ========================================================= */

document.getElementById("storyContent").textContent =
  personalContent.story.trim();

document.getElementById("loveContent").textContent =
  personalContent.love.trim();

document.querySelectorAll(".envelope-card").forEach(button => {
  button.addEventListener("click", () => {
    const letterId = button.dataset.letter;
    const letter = document.getElementById(letterId);

    document.querySelectorAll(".letter-paper").forEach(item => {
      item.hidden = true;
    });

    letter.hidden = false;
    letter.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

document.querySelectorAll(".close-letter").forEach(button => {
  button.addEventListener("click", () => {
    button.closest(".letter-paper").hidden = true;
  });
});

/* =========================================================
   INTERACTIVE STARS
   ========================================================= */

document.querySelectorAll(".star-node").forEach(star => {
  star.addEventListener("click", () => {
    const index = Number(star.dataset.star);
    const message = personalContent.stars[index];

    document.getElementById("starMessage").textContent = message;

    document.querySelectorAll(".star-node").forEach(node => {
      node.classList.remove("selected-star");
    });

    star.classList.add("selected-star");
  });
});

/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/* =========================================================
   RESPECTFUL "I NEED SOME TIME" BUTTON
   ========================================================= */

document.getElementById("timeButton").addEventListener("click", () => {
  document.getElementById("responseMessage").textContent =
    "Of course. Take all the time you need. Your feelings and comfort matter. ❤️";
});

/* =========================================================
   YES CELEBRATION
   ========================================================= */

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createBalloon(container, index) {
  const balloon = document.createElement("div");
  const colors = ["#ef6e9d", "#fff", "#c93468", "#f6a6c2"];
  const names = ["RIHAN", "SHREJAL", "♥", "♥"];

  balloon.className = "balloon";
  balloon.textContent = names[index % names.length];
  balloon.style.left = `${randomBetween(0, 96)}%`;
  balloon.style.background = colors[index % colors.length];
  balloon.style.setProperty("--duration", `${randomBetween(7, 13)}s`);
  balloon.style.animationDelay = `${randomBetween(0, 2)}s`;

  container.appendChild(balloon);
}

function createPetal(container) {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.textContent = Math.random() > 0.5 ? "🌹" : "🌸";
  petal.style.left = `${randomBetween(0, 100)}%`;
  petal.style.setProperty("--duration", `${randomBetween(5, 10)}s`);
  petal.style.animationDelay = `${randomBetween(0, 3)}s`;
  container.appendChild(petal);
}

function createConfetti(container) {
  const piece = document.createElement("span");
  const colors = ["#e94d83", "#f8a7c4", "#ffffff", "#c83265"];

  piece.className = "confetti";
  piece.style.left = `${randomBetween(0, 100)}%`;
  piece.style.background = colors[Math.floor(Math.random() * colors.length)];
  piece.style.setProperty("--duration", `${randomBetween(3, 7)}s`);
  piece.style.animationDelay = `${randomBetween(0, 2)}s`;
  container.appendChild(piece);
}

function startCelebrationEffects() {
  const container = document.getElementById("celebrationEffects");
  container.replaceChildren();

  for (let i = 0; i < 32; i++) createBalloon(container, i);
  for (let i = 0; i < 28; i++) createPetal(container);
  for (let i = 0; i < 100; i++) createConfetti(container);

  clearTimeout(celebrationTimer);
  celebrationTimer = setTimeout(() => {
    container.replaceChildren();
  }, 18000);
}

function showCelebration() {
  document.getElementById("celebration").hidden = false;
  startCelebrationEffects();
}

/* =========================================================
   SECURE YES NOTIFICATION
   The server saves the explicit YES response and sends email.
   No email credentials are stored in this frontend file.
   ========================================================= */

async function sendYesNotification() {
  const status = document.getElementById("notificationStatus");

  try {
    const response = await fetch("/api/yes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: "YES" })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "The server could not save the response.");
    }

    if (result.emailSent) {
      status.textContent = "Your response has been saved and the notification was sent. ❤️";
    } else {
      status.textContent = "Your response has been saved. Email notification is not confirmed.";
    }
  } catch (error) {
    console.error("YES notification error:", error);
    status.textContent =
      "The celebration is here, but the server could not confirm the notification.";
  }
}

document.getElementById("yesButton").addEventListener("click", () => {
  if (yesRequestStarted) return;

  yesRequestStarted = true;
  document.getElementById("yesButton").disabled = true;

  showCelebration();
  sendYesNotification();
});

document.getElementById("replayButton").addEventListener("click", () => {
  startCelebrationEffects();
});

/* Make music status clear if the audio file fails */
music.addEventListener("error", () => {
  musicStatus.textContent = "Audio file not found";
});
