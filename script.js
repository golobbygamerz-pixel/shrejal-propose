
/* =====================================
   RIHAN × SHREJAL
   OUR LITTLE LOVE STORY
===================================== */

const $ = (id) => document.getElementById(id);

const pages = [
  "welcomePage",
  "envelopePage",
  "storyPage",
  "lovePage",
  "proposalPage",
  "celebrationPage"
];

let musicPlaying = false;
let toastTimer;

// PAGE NAVIGATION

function showPage(pageId) {
  pages.forEach(id => {
    const page = $(id);
    if (page) page.classList.remove("active");
  });

  const nextPage = $(pageId);

  if (nextPage) {
    nextPage.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// WELCOME BUTTON

$("enterButton").addEventListener("click", async () => {
  showPage("envelopePage");
  playMusic();
});

// MUSIC PLAYER

const music = $("backgroundMusic");
const musicButton = $("musicToggle");

music.volume = 0.65;

async function playMusic() {
  try {
    await music.play();
    musicPlaying = true;
    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-label", "Pause music");
  } catch (error) {
    showToast("Tap the music button to play music ♡");
  }
}

function pauseMusic() {
  music.pause();
  musicPlaying = false;
  musicButton.textContent = "♫";
  musicButton.setAttribute("aria-label", "Play music");
}

musicButton.addEventListener("click", () => {
  if (musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

music.addEventListener("ended", () => {
  musicPlaying = false;
});

// ENVELOPE ANIMATION

const envelope = $("openEnvelope");
let envelopeOpened = false;

envelope.addEventListener("click", () => {
  if (envelopeOpened) return;

  envelopeOpened = true;
  envelope.classList.add("open");

  showToast("A little letter just for you... 💌");

  setTimeout(() => {
    showPage("storyPage");
  }, 1500);
});

// STORY PAGE

$("storyNextButton").addEventListener("click", () => {
  showPage("lovePage");
});

// LOVE PAGE

$("loveNextButton").addEventListener("click", () => {
  showPage("proposalPage");
});

// TIME BUTTON

$("timeButton").addEventListener("click", () => {
  $("responseMessage").textContent =
    "Take all the time you need, Shrejal. Your feelings matter. ♡";

  showToast("No pressure. Take your time. 💗");
});

// YES BUTTON

$("yesButton").addEventListener("click", async () => {
  showPage("celebrationPage");

  createCelebration();

  $("notificationStatus").textContent =
    "Your moment has been celebrated! ♡";

  // Send explicit YES response to the backend.
  // The backend must be deployed for this request to work.

  try {
    const response = await fetch("/api/yes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        response: "YES"
      })
    });

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    $("notificationStatus").textContent =
      "Your response has been recorded. ♡";

  } catch (error) {
    $("notificationStatus").textContent =
      "Celebrating this special moment! ♡";
  }
});

// CELEBRATION EFFECTS

function createCelebration() {
  const container = $("celebrationEffects");

  container.innerHTML = "";

  const decorations = [
    "♡", "✿", "♥", "🌸", "💕", "✧"
  ];

  for (let i = 0; i < 35; i++) {
    const item = document.createElement("span");

    item.textContent =
      decorations[Math.floor(Math.random() * decorations.length)];

    item.style.left = Math.random() * 100 + "%";
    item.style.animationDelay = Math.random() * 3 + "s";
    item.style.animationDuration =
      3 + Math.random() * 4 + "s";

    container.appendChild(item);
  }
}

// REPLAY CELEBRATION

$("replayButton").addEventListener("click", () => {
  showPage("welcomePage");

  envelopeOpened = false;
  envelope.classList.remove("open");

  $("responseMessage").textContent = "";
  $("notificationStatus").textContent =
    "Saving your response...";

  $("celebrationEffects").innerHTML = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
});

// BACKGROUND FLOWERS

function createBackgroundFlowers() {
  const container = $("backgroundPetals");

  const flowers = ["✿", "♡", "❀", "✧", "❁"];

  for (let i = 0; i < 5; i++) {
    const flower = document.createElement("span");

    flower.textContent = flowers[i];
    flower.style.top = "-30px";
    flower.style.animationDelay = (i * 2) + "s";

    container.appendChild(flower);
  }
}

// TOAST MESSAGE

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// START WEBSITE

createBackgroundFlowers();
});
