var notyf = new Notyf();
let teamBtn = document.getElementById("teamBtn");

teamBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let creativeParticipant1 = document.getElementById(
    "creativeParticipant1"
  ).value;
  let creativeParticipant2 = document.getElementById(
    "creativeParticipant2"
  ).value;
  let creativeParticipant3 = document.getElementById(
    "creativeParticipant3"
  ).value;
  let creativeParticipant4 = document.getElementById(
    "creativeParticipant4"
  ).value;
  let creativeParticipant5 = document.getElementById(
    "creativeParticipant5"
  ).value;
  let creativeParticipant6 = document.getElementById(
    "creativeParticipant6"
  ).value;
  let crossparticipant1 = document.getElementById("crossparticipant1").value;
  let crossparticipant2 = document.getElementById("crossparticipant2").value;
  let gdparticipant1 = document.getElementById("gdparticipant1").value;
  let surpparticipant1 = document.getElementById("surpparticipant1").value;
  let surpparticipant2 = document.getElementById("surpparticipant2").value;
  let progparticipant1 = document.getElementById("progparticipant1").value;
  let progparticipant2 = document.getElementById("progparticipant2").value;
  let filmparticipant1 = document.getElementById("filmparticipant1").value;
  let filmparticipant2 = document.getElementById("filmparticipant2").value;
  let filmparticipant3 = document.getElementById("filmparticipant3").value;
  let filmparticipant4 = document.getElementById("filmparticipant4").value;
  let gamingparticipant1 = document.getElementById("gamingparticipant1").value;
  let gamingparticipant2 = document.getElementById("gamingparticipant2").value;
  let quizparticipant1 = document.getElementById("quizparticipant1").value;
  let roboticsparticipant1 = document.getElementById(
    "roboticsparticipant1"
  ).value;
  let roboticsparticipant2 = document.getElementById(
    "roboticsparticipant2"
  ).value;
  let roboticsparticipant3 = document.getElementById(
    "roboticsparticipant3"
  ).value;
  let photoparticipant1 = document.getElementById("photoparticipant1").value;
  let paintparticipant1 = document.getElementById("paintparticipant1").value;
  let gamedevpartipant1 = document.getElementById("gamedevpartipant1").value;
  let gamedevpartipant2 = document.getElementById("gamedevpartipant2").value;
  let minecraftparticipant1 = document.getElementById(
    "minecraftparticipant1"
  ).value;
  let minecraftparticipant2 = document.getElementById(
    "minecraftparticipant2"
  ).value;
  let schId = document.getElementById("schId").value;
  let schName = document.getElementById("schName").value;
  let data = {
    creativeParticipant1,
    creativeParticipant2,
    creativeParticipant3,
    creativeParticipant4,
    creativeParticipant5,
    creativeParticipant6,
    crossparticipant1,
    crossparticipant2,
    gdparticipant1,
    surpparticipant1,
    surpparticipant2,
    progparticipant1,
    progparticipant2,
    filmparticipant1,
    filmparticipant2,
    filmparticipant3,
    filmparticipant4,
    gamingparticipant1,
    gamingparticipant2,
    quizparticipant1,
    roboticsparticipant1,
    roboticsparticipant2,
    roboticsparticipant3,
    photoparticipant1,
    paintparticipant1,
    gamedevpartipant1,
    gamedevpartipant2,
    minecraftparticipant1,
    minecraftparticipant2,
    schId,
    schName,
  };
  fetch("/register/team", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status === 200) {
      notyf.success("Team Updated Successfully");
    } else {
      notyf.error("Team Registration Failed");
    }
  });
});
