/* ==========================================================================
   EDIT EVERYTHING HERE
   ========================================================================== */

const invitationData = {
  brideName: "Laila",
  groomName: "Omar",
  initials: "O & L",

  date: "2026-12-30T19:30:00",     // countdown target (local time)
  displayDate: "December 30, 2026",
  time: "7:30 PM",

  hallName: "Rose Hall",
  location: "New Cairo, Egypt",
  ADDRESS: "Gate1",
  mapsUrl: "https://maps.app.goo.gl/cYtCaDegs6n2PTnX8",   // paste your Google Maps link

  envelopeImage: "burgundy_envelope_1080x2400.png",
  coupleImage: "couple.jpg",
  secondImage: "venue.jpg",
  music: "rudo_made_it_COSKO_-_Golden_Brown_x_Love_Story_-_Slowed_(mp3.pm).mp3"         // set to "" to hide the music button
};

/* ==========================================================================
   Nothing below normally needs editing
   ========================================================================== */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- fill the page from the config ---------- */
    /* ---------- RSVP: بيفتح واتساب بالرسالة جاهزة ---------- */
  function setUpRsvp() {
    const form = document.getElementById("rsvpForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.elements.name.value.trim();
      const err = document.getElementById("rsvpError");
      if (!name) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      const yes = form.elements.attend.value === "yes";
      const msg = form.elements.message.value.trim();
      const d = invitationData;
      const text = "RSVP - " + d.groomName + " & " + d.brideName + "\n" +
        "Name: " + name + "\n" +
        "Attending: " + (yes ? "Yes, I'll be there" : "Sorry, I can't make it") +
        (msg ? "\nMessage: " + msg : "");
      window.open("https://wa.me/" + d.rsvpWhatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }
  function applyContent() {
    const d = invitationData;

    // set on each layer so the path resolves against the page, not the stylesheet
    document.querySelectorAll(".env-layer:not(.env-body)").forEach((layer) => {  
    layer.style.backgroundImage = 'url("' + d.envelopeImage + '")';
    });
    $("envelopeScreen").style.setProperty("--env-img", 'url("' + d.envelopeImage + '")');
    $("sealInitials").textContent = d.initials;
    $("cardInitials").textContent = d.initials;

    $("brideName").textContent = d.brideName;
    $("groomName").textContent = d.groomName;
    $("closingBride").textContent = d.brideName;
    $("closingGroom").textContent = d.groomName;

    $("heroDate").textContent = d.displayDate;
    $("countdownLabel").textContent = "To " + d.displayDate;
    $("detailDate").textContent = d.displayDate;
    $("detailTime").textContent = d.time;
    $("detailHall").textContent = d.hallName;
    $("detailLocation").textContent = d.location;

    const couple = $("coupleImage");
    couple.src = d.coupleImage;
    couple.alt = d.brideName + " and " + d.groomName;

    const second = $("secondImage");
    second.src = d.secondImage;
    second.alt = d.brideName + " and " + d.groomName;

    $("mapsButton").href = d.mapsUrl;
        $("mapPin").href = d.mapsUrl;

    document.title = d.groomName + " & " + d.brideName + " — Engagement Invitation";
  }

  /* ---------- 1. the envelope ---------- */

  function setUpEnvelope() {
    const screen = $("envelopeScreen");
    const envelope = $("envelope");
    const invitation = $("invitation");
    let opened = false;

        // timings, in ms, from the moment of the tap
    //   flap lifts at 0  ->  card rises at `release`  ->  envelope fades out at `reveal`
    const T = reduceMotion
      ? { release: 120, reveal: 700, done: 1200 }
           : { release: 900, reveal: 3200, done: 4200 };

    function open() {
      if (opened) return;
      opened = true;

      // hint fades, flap lifts upward
      envelope.classList.add("is-open");

      // card rises out of the envelope
      setTimeout(() => envelope.classList.add("is-releasing"), T.release);

      // invitation fades in underneath
      setTimeout(() => {
        screen.classList.add("is-gone");
        document.body.classList.remove("is-sealed");
        invitation.setAttribute("aria-hidden", "false");
        invitation.classList.add("is-visible");
        window.scrollTo(0, 0);
      }, T.reveal);

      setTimeout(() => {
        screen.remove();
        const music = $("musicToggle");
        if (!music.hidden) music.classList.add("is-ready");
      }, T.done);
    }

    envelope.addEventListener("click", open);
    envelope.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  }

  /* ---------- 2. the countdown ---------- */

  function setUpCountdown() {
    const target = new Date(invitationData.date).getTime();
    const fields = {
      days: $("cdDays"),
      hours: $("cdHours"),
      minutes: $("cdMinutes"),
      seconds: $("cdSeconds")
    };
    const clock = $("countdown");
    const done = $("countdownDone");

    const pad = (n) => String(n).padStart(2, "0");

    let timer = null;

    function tick() {
      const left = target - Date.now();

      if (isNaN(target)) return;

      if (left <= 0) {
        clock.hidden = true;
        done.hidden = false;
        if (timer) clearInterval(timer);
        return;
      }

      const s = Math.floor(left / 1000);
      fields.days.textContent = pad(Math.floor(s / 86400));
      fields.hours.textContent = pad(Math.floor(s / 3600) % 24);
      fields.minutes.textContent = pad(Math.floor(s / 60) % 60);
      fields.seconds.textContent = pad(s % 60);
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---------- 3. background music ---------- */

function setUpMusic() {
  const button = $("musicToggle");
  const audio = $("music");

  if (!invitationData.music) return;

  audio.src = invitationData.music;
  audio.loop = true;
  button.hidden = false;

  function playMusic() {
    audio.play().then(() => {
      button.classList.add("is-playing");
      button.setAttribute("aria-pressed", "true");
      button.setAttribute("aria-label", "Pause background music");
    }).catch(() => {
      button.classList.remove("is-playing");
    });
  }

  function pauseMusic() {
    audio.pause();
    button.classList.remove("is-playing");
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Play background music");
  }

  // Try to play automatically when the page opens
  playMusic();

  // Music button
  button.addEventListener("click", () => {
    if (audio.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  // Start music when user opens the envelope
  $("envelope").addEventListener("click", () => {
    if (audio.paused) {
      playMusic();
    }
  }, { once: true });
}
/* ---------- 4. falling petals ---------- */
 
  function setUpPetals() {
    const field = $("petalField");
    if (!field || reduceMotion) return;
 
    const PETAL_SVG =
      '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M10 1c4 3 5 8 0 18C5 9 6 4 10 1z"/></svg>';
 
    const colors = ["#B98E4C", "#D9BE86", "#7A2130"]; // gold, pale gold, burgundy
    const COUNT = 14;
 
    for (let i = 0; i < COUNT; i++) {
      const petal = document.createElement("div");
      petal.className = "petal";
      petal.innerHTML = PETAL_SVG;
 
      const size = 10 + Math.random() * 12;         // 10–22px
      const duration = 14 + Math.random() * 12;      // 14–26s
      const delay = Math.random() * -26;              // negative = already mid-fall on load
      const drift = 18 + Math.random() * 46;          // sideways sway
      const spin = 90 + Math.random() * 180;
      const spin2 = spin + 90 + Math.random() * 180;
      const peak = 0.35 + Math.random() * 0.3;
 
      petal.style.setProperty("--x", Math.random() * 100 + "%");
      petal.style.setProperty("--size", size + "px");
      petal.style.setProperty("--duration", duration + "s");
      petal.style.setProperty("--delay", delay + "s");
      petal.style.setProperty("--drift", (Math.random() < 0.5 ? -1 : 1) * drift + "px");
      petal.style.setProperty("--spin", spin + "deg");
      petal.style.setProperty("--spin2", spin2 + "deg");
      petal.style.setProperty("--peak-opacity", peak.toFixed(2));
      petal.style.setProperty("--petal-color", colors[i % colors.length]);
 
      field.appendChild(petal);
    }
  }

  applyContent();
    setUpRsvp();
  setUpEnvelope();
  setUpCountdown();
  setUpMusic();
  setUpPetals();
})();