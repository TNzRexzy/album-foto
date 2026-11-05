const photos = [
  {
    src: "assets/moment-01.png",
    alt: "Dua avatar bermahkota dengan sweater merah hitam, berdiri di taman kotak-kotak.",
    caption: "Outfit serasi, mood berbeda."
  },
  {
    src: "assets/moment-02.png",
    alt: "Dua avatar duduk bersama di bawah langit ungu dan biru malam.",
    caption: "Jam pulang? nggak kenal."
  },
  {
    src: "assets/moment-03.png",
    alt: "Satu avatar duduk di rumput sementara yang lain rebahan nyaman di sampingnya.",
    caption: "Ruang tamu? taman juga jadi."
  }
];

const cards = [...document.querySelectorAll(".photo-card")];
const filters = [...document.querySelectorAll(".filter-chip")];
const photoCount = document.querySelector("#photo-count");
const emptyState = document.querySelector("#empty-state");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCounter = document.querySelector("#lightbox-counter");
const toast = document.querySelector("#toast");
const audio = document.querySelector("#album-audio");
const musicPlayer = document.querySelector(".music-player");
const musicPlayButton = document.querySelector("#music-play");
const musicPlayIcon = document.querySelector("#music-play-icon");
const musicMuteButton = document.querySelector("#music-mute");
const musicProgress = document.querySelector("#music-progress");
const musicCurrentTime = document.querySelector("#music-current-time");
const musicDuration = document.querySelector("#music-duration");
const musicStatus = document.querySelector("#music-status");
const musicVolume = document.querySelector("#music-volume");
const musicVolumeValue = document.querySelector("#music-volume-value");
let activeIndex = 0;
let toastTimer;
let playEffectTimer;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateMusicProgress() {
  const duration = audio.duration;
  if (!Number.isFinite(duration) || duration <= 0) return;
  const progress = (audio.currentTime / duration) * 100;
  musicProgress.value = String(audio.currentTime);
  musicProgress.style.setProperty("--progress", `${progress}%`);
  musicCurrentTime.textContent = formatTime(audio.currentTime);
}

function updateMusicVolume() {
  const volume = Number(musicVolume.value);
  audio.volume = volume;
  musicVolumeValue.value = `${Math.round(volume * 100)}%`;
  musicVolume.style.setProperty("--volume", `${volume * 100}%`);
  musicMuteButton.setAttribute("aria-pressed", String(audio.muted));
  musicMuteButton.setAttribute("aria-label", audio.muted ? "Nyalakan suara" : "Bisukan musik");
  musicMuteButton.textContent = audio.muted ? "×" : "♫";
}

function playStartEffect() {
  musicPlayer.classList.remove("has-play-effect");
  void musicPlayer.offsetWidth;
  musicPlayer.classList.add("has-play-effect");
  window.clearTimeout(playEffectTimer);
  playEffectTimer = window.setTimeout(() => musicPlayer.classList.remove("has-play-effect"), 850);
}

audio.volume = Number(musicVolume.value);
updateMusicVolume();
musicVolume.addEventListener("input", updateMusicVolume);
audio.addEventListener("loadedmetadata", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    musicStatus.textContent = "durasi lagu tidak dapat dibaca";
    return;
  }
  musicProgress.max = String(audio.duration);
  musicProgress.disabled = false;
  musicDuration.textContent = formatTime(audio.duration);
  musicStatus.textContent = "siap menemani album";
});
audio.addEventListener("timeupdate", updateMusicProgress);
audio.addEventListener("play", () => {
  musicPlayer.classList.add("is-playing");
  musicPlayButton.setAttribute("aria-label", "Jeda musik");
  musicPlayIcon.textContent = "Ⅱ";
  musicStatus.textContent = "sedang diputar · little archive radio";
  playStartEffect();
});
audio.addEventListener("pause", () => {
  musicPlayer.classList.remove("is-playing");
  musicPlayButton.setAttribute("aria-label", "Putar musik");
  musicPlayIcon.textContent = "▶";
  if (!audio.ended && !audio.error) musicStatus.textContent = "dijeda · lanjut kapan saja";
});
audio.addEventListener("ended", () => {
  musicProgress.value = "0";
  musicProgress.style.setProperty("--progress", "0%");
  musicCurrentTime.textContent = "0:00";
  musicStatus.textContent = "selesai diputar · putar lagi? ♡";
});
audio.addEventListener("error", () => {
  musicProgress.disabled = true;
  musicStatus.textContent = "lagu gagal dimuat · coba muat ulang halaman";
});
musicPlayButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {
      musicStatus.textContent = "musik belum bisa diputar · coba lagi";
    });
  } else {
    audio.pause();
  }
});
musicMuteButton.addEventListener("click", () => {
  audio.muted = !audio.muted;
  updateMusicVolume();
});
musicProgress.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  audio.currentTime = Number(musicProgress.value);
  updateMusicProgress();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function openPhoto(index) {
  activeIndex = (index + photos.length) % photos.length;
  const photo = photos[activeIndex];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = photo.caption;
  lightboxCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  if (!lightbox.open) lightbox.showModal();
}

function filterPhotos(filter) {
  let visibleCount = 0;
  cards.forEach((card) => {
    const visible = filter === "all" || card.dataset.mood === filter;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  photoCount.textContent = String(visibleCount).padStart(2, "0");
  emptyState.hidden = visibleCount > 0;
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    filterPhotos(button.dataset.filter);
  });
});

cards.forEach((card) => {
  card.querySelector(".photo-card__image-button").addEventListener("click", () => {
    openPhoto(Number(card.dataset.index));
  });
  card.querySelector(".heart-button").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const saved = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute("aria-label", saved ? "Hapus dari foto favorit" : "Simpan foto favorit");
    button.querySelector("span").textContent = saved ? "♥" : "♡";
    showToast(saved ? "Masuk daftar gemas ♡" : "Dilepas dari daftar gemas");
  });
});

document.querySelector("#shuffle-button").addEventListener("click", () => {
  const visibleCards = cards.filter((card) => !card.hidden);
  const picked = visibleCards[Math.floor(Math.random() * visibleCards.length)];
  if (!picked) return;
  picked.scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("Pilihan semesta hari ini ✳");
  window.setTimeout(() => openPhoto(Number(picked.dataset.index)), 350);
});

document.querySelector(".lightbox__close").addEventListener("click", () => lightbox.close());
document.querySelector(".lightbox__arrow--prev").addEventListener("click", () => openPhoto(activeIndex - 1));
document.querySelector(".lightbox__arrow--next").addEventListener("click", () => openPhoto(activeIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") openPhoto(activeIndex - 1);
  if (event.key === "ArrowRight") openPhoto(activeIndex + 1);
});
