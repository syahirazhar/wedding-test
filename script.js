/* =========================
   LANDING PAGE CONTROL
========================= */

function openPage(){
  const landing = document.getElementById("landing");
  const main = document.getElementById("main");

  landing.style.opacity = "0";

  setTimeout(()=>{
    landing.style.display = "none";
    main.style.display = "block";
    main.style.opacity = "1";
  }, 700);
}

/* =========================
   COUNTDOWN (12 DEC 2026)
========================= */

const targetDate = new Date("2026-12-12T00:00:00").getTime();

function updateCountdown(){
  const now = new Date().getTime();
  const diff = targetDate - now;

  if(diff <= 0){
    document.getElementById("days").innerText = 0;
    document.getElementById("hours").innerText = 0;
    document.getElementById("minutes").innerText = 0;
    document.getElementById("seconds").innerText = 0;
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* =========================
   RSVP GOOGLE SHEETS
========================= */

const scriptURL = "https://script.google.com/macros/s/AKfycbw9h3Jtk0QOVi0L5zBPz1wb0TU5KG-nPvxrHxyKsHAgg0inrqLu0Yj1z6gbnbjbeahuWQ/exec";

const form = document.getElementById("rsvpForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", function(e){
  e.preventDefault();

  const btn = document.getElementById("submitBtn");
  btn.innerText = "Sending...";
  btn.disabled = true;

  fetch(scriptURL, {
    method: "POST",
    body: new FormData(form)
  })
  .then(res => {
    msg.innerText = "RSVP received. Thank you!";
    msg.style.color = "green";

    form.reset();
  })
  .catch(err => {
    msg.innerText = "Something went wrong. Try again.";
    msg.style.color = "red";
  })
  .finally(()=>{
    btn.innerText = "Send RSVP";
    btn.disabled = false;
  });
});