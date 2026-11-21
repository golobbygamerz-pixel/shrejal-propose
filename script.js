
document.addEventListener("DOMContentLoaded", () => {

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
  let envelopeOpened = false;
  let toastTimer;

  const music = $("backgroundMusic");
  const musicButton = $("musicToggle");
  const envelope = $("openEnvelope");

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

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  async function playMusic() {
    if (!music) return;

    try {
      await music.play();
      musicPlaying = true;

      if (musicButton) {
        musicButton.textContent = "♫";
        musicButton.setAttribute("aria-label", "Pause music");
      }
    } catch (error) {
      showToast("Tap the music button to play music ♡");
    }
  }

  function pauseMusic() {
    if (!music) return;

    music.pause();
    musicPlaying = false;

    if (musicButton) {
      musicButton.textContent = "♫";
      musicButton.setAttribute("aria-label", "Play music");
    }
  }

  // WELCOME BUTTON
  $("enterButton")?.addEventListener("click", () => {
    showPage("envelopePage");
    playMusic();
  });

  // MUSIC BUTTON
  musicButton?.addEventListener("click", () => {
    if (musicPlaying) pauseMusic();
    else playMusic();
  });

  // ENVELOPE
  envelope?.addEventListener("click", () => {
    if (envelopeOpened) return;

    envelopeOpened = true;
    envelope.classList.add("open");

    showToast("A little letter just for you... 💌");

    setTimeout(() => {
      showPage("storyPage");
    }, 1500);
  });

  // STORY
  $("storyNextButton")?.addEventListener("click", () => {
    showPage("lovePage");
  });

  // LOVE LETTER
  $("loveNextButton")?.addEventListener("click", () => {
    showPage("proposalPage");
  });

  // TIME BUTTON
  $("timeButton")?.addEventListener("click", () => {
    $("responseMessage").textContent =
      "Take all the time you need, Shrejal. Your feelings matter. ♡";

    showToast("No pressure. Take your time. 💗");
  });

  // YES BUTTON
  $("yesButton")?.addEventListener("click", () => {
    showPage("celebrationPage");
    createCelebration();

    $("notificationStatus").textContent =
      "Your moment has been celebrated! ♡";
  });

  // CELEBRATION
  function createCelebration() {
    const container = $("celebrationEffects");
    if (!container) return;

    container.innerHTML = "";

    const decorations = ["♡", "✿", "♥", "🌸", "💕", "✧"];

    for (let i = 0; i < 35; i++) {
      const item = document.createElement("span");

      item.textContent =
        decorations[Math.floor(Math.random() * decorations.length)];

      item.style.left = Math.random() * 100 + "%";
      item.style.animationDelay = Math.random() * 3 + "s";
      item.style.animationDuration = 3 + Math.random() * 4 + "s";

      container.appendChild(item);
    }
  }

  // REPLAY
  $("replayButton")?.addEventListener("click", () => {
    showPage("welcomePage");

    envelopeOpened = false;
    envelope?.classList.remove("open");

    $("responseMessage").textContent = "";
    $("notificationStatus").textContent = "Ready for another visit ♡";

    $("celebrationEffects").innerHTML = "";
  });

  // BACKGROUND FLOWERS
  function createBackgroundFlowers() {
    const container = $("backgroundPetals");
    if (!container) return;

    const flowers = ["✿", "♡", "❀", "✧", "❁"];

    for (let i = 0; i < 5; i++) {
      const flower = document.createElement("span");

      flower.textContent = flowers[i];
      flower.style.top = "-30px";
      flower.style.animationDelay = (i * 2) + "s";

      container.appendChild(flower);
    }
  }

  if (music) {
    music.volume = 0.65;
    music.addEventListener("ended", () => {
      musicPlaying = false;
    });
  }

  createBackgroundFlowers();

});
}

// START WEBSITE

createBackgroundFlowers();
});
