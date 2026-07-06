function openPage(){
  document.getElementById("landing").style.display = "none";
  document.getElementById("main").style.display = "block";
}

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

const form = document.getElementById("rsvpForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", e=>{
  e.preventDefault();

  const btn = document.getElementById("submitBtn");

  btn.innerText = "Sending...";
  btn.disabled = true;

  fetch("https://script.google.com/macros/s/AKfycbw9h3Jtk0QOVi0L5zBPz1wb0TU5KG-nPvxrHxyKsHAgg0inrqLu0Yj1z6gbnbjbeahuWQ/exec",{
    method:"POST",
    body:new FormData(form)
  })
  .then(()=>{
    msg.innerText = "Sofea & Syahir have received your RSVP";
    msg.style.color = "#4A2C2A";
    form.reset();
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