
function openPage(){
  document.getElementById("landing").style.display = "none";
  document.getElementById("main").style.display = "block";
}

/* COUNTDOWN */
const targetDate = new Date("2026-12-12T00:00:00").getTime();

function updateCountdown(){
  const now = new Date().getTime();
  const diff = targetDate - now;

  document.getElementById("days").innerText =
    Math.floor(diff/(1000*60*60*24));

  document.getElementById("hours").innerText =
    Math.floor((diff/(1000*60*60))%24);

  document.getElementById("minutes").innerText =
    Math.floor((diff/(1000*60))%60);

  document.getElementById("seconds").innerText =
    Math.floor((diff/1000)%60);
}

setInterval(updateCountdown,1000);
updateCountdown();

/* RSVP */
const form = document.getElementById("rsvpForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", e=>{
  e.preventDefault();

  fetch("YOUR_GOOGLE_SCRIPT_URL_HERE",{
    method:"POST",
    body:new FormData(form)
  })
  .then(()=>{
    msg.innerText = "Sofea & Syahir have received your RSVP";
    form.reset();
  })
  .catch(()=>{
    msg.innerText = "Error. Try again.";
  });
});

/* APPLE CALENDAR */
function downloadICS(){

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Wedding Sofea & Syahir
DTSTART:20261212T120000
DTEND:20261212T160000
LOCATION:Kamalinda Secret Garden Hall
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics],{type:"text/calendar"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding.ics";
  a.click();
}