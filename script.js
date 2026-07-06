const scriptURL = "https://script.google.com/macros/s/AKfycbw9h3Jtk0QOVi0L5zBPz1wb0TU5KG-nPvxrHxyKsHAgg0inrqLu0Yj1z6gbnbjbeahuWQ/exec";

let guestMessages = [];
let currentMessageIndex = 0;
let messageRotationTimer = null;

const maxWords = 200;

function openPage(){
  const landing = document.getElementById("landing");
  const main = document.getElementById("main");

  landing.classList.add("hide");

  setTimeout(()=>{
    landing.style.display = "none";
    main.style.display = "block";

    setTimeout(()=>{
      main.classList.add("show");
      revealOnScroll();
      loadGuestMessages();
    },50);

  },900);
}

/* SLIDE PANEL */
function togglePanel(panelId){
  const selectedPanel = document.getElementById(panelId);
  const allPanels = document.querySelectorAll(".slide-panel");

  allPanels.forEach(panel=>{
    if(panel !== selectedPanel){
      panel.classList.remove("open");
    }
  });

  selectedPanel.classList.toggle("open");
}

/* MESSAGE WORD COUNTER */
const messageInput = document.getElementById("messageInput");
const charCounter = document.getElementById("charCounter");

function getWords(text){
  const trimmedText = text.trim();

  if(trimmedText === ""){
    return [];
  }

  return trimmedText.split(/\s+/);
}

function updateCharacterCounter(){
  const words = getWords(messageInput.value);
  charCounter.innerText = words.length + " / " + maxWords + " words";
}

function limitMessageWords(){
  const words = getWords(messageInput.value);

  if(words.length > maxWords){
    messageInput.value = words.slice(0, maxWords).join(" ");
  }

  updateCharacterCounter();
}

if(messageInput && charCounter){
  updateCharacterCounter();

  messageInput.addEventListener("input", ()=>{
    limitMessageWords();
  });
}

/* COUNTDOWN */
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

  document.getElementById("days").innerText =
    Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById("hours").innerText =
    Math.floor((diff / (1000 * 60 * 60)) % 24);

  document.getElementById("minutes").innerText =
    Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("seconds").innerText =
    Math.floor((diff / 1000) % 60);
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* SCROLL REVEAL */
function revealOnScroll(){
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach(item=>{
    const windowHeight = window.innerHeight;
    const itemTop = item.getBoundingClientRect().top;
    const revealPoint = 90;

    if(itemTop < windowHeight - revealPoint){
      item.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

/* RSVP */
const form = document.getElementById("rsvpForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", e=>{
  e.preventDefault();

  const btn = document.getElementById("submitBtn");

  btn.innerText = "Sending...";
  btn.disabled = true;

  fetch(scriptURL,{
    method:"POST",
    body:new FormData(form)
  })
  .then(()=>{
    msg.innerText = "";
    form.reset();

    if(messageInput && charCounter){
      updateCharacterCounter();
    }

    showPopup();

    setTimeout(()=>{
      loadGuestMessages();
    },1200);
  })
  .catch(()=>{
    msg.innerText = "Error. Try again.";
    msg.style.color = "red";
  })
  .finally(()=>{
    btn.innerText = "Send RSVP";
    btn.disabled = false;
  });
});

/* POPUP */
function showPopup(){
  const popup = document.getElementById("successPopup");
  popup.classList.add("show");
}

function closePopup(){
  const popup = document.getElementById("successPopup");
  popup.classList.remove("show");
}

/* GUEST MESSAGES */
async function loadGuestMessages(){
  try{
    const response = await fetch(scriptURL + "?action=getMessages&cache=" + Date.now());
    const data = await response.json();

    if(Array.isArray(data.messages)){
      const newMessages = data.messages.filter(item => item.message && item.message.trim() !== "");

      const oldData = JSON.stringify(guestMessages);
      const newData = JSON.stringify(newMessages);

      guestMessages = newMessages;

      if(currentMessageIndex >= guestMessages.length){
        currentMessageIndex = 0;
      }

      if(oldData !== newData){
        startMessageRotation();
      }

      if(guestMessages.length === 0){
        showCurrentMessage();
      }
    }
  }catch(error){
    console.log("Unable to load guest messages:", error);
  }
}

function startMessageRotation(){
  clearInterval(messageRotationTimer);

  showCurrentMessage();

  if(guestMessages.length > 1){
    messageRotationTimer = setInterval(()=>{
      currentMessageIndex = (currentMessageIndex + 1) % guestMessages.length;
      showCurrentMessage();
    },5000);
  }
}

function showCurrentMessage(){
  const card = document.querySelector(".message-card");
  const text = document.getElementById("guestMessageText");
  const name = document.getElementById("guestMessageName");

  if(!card || !text || !name){
    return;
  }

  if(guestMessages.length === 0){
    text.innerText = "Your wishes will appear here soon.";
    name.innerText = "";
    return;
  }

  const current = guestMessages[currentMessageIndex];

  card.classList.add("fade-out");

  setTimeout(()=>{
    text.innerText = "“" + current.message + "”";
    name.innerText = current.name ? "— " + current.name : "";

    card.classList.remove("fade-out");
    card.classList.add("fade-in");

    setTimeout(()=>{
      card.classList.remove("fade-in");
    },500);
  },450);
}

/* AUTO REFRESH MESSAGES */
setInterval(()=>{
  loadGuestMessages();
},15000);

/* APPLE CALENDAR */
function downloadICS(){
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Wedding Sofea & Syahir
DTSTART:20261212T120000
DTEND:20261212T160000
LOCATION:Kamalinda Secret Garden Hall
DESCRIPTION:Wedding Invitation
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], {type:"text/calendar"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}