var notyf = new Notyf();

let regForm = document.getElementById("regForm");
let regButton = document.getElementById("regButton");
regButton.addEventListener("click", (e) => {
  e.preventDefault();

  let schoolName = document.getElementById("schoolName").value;
  let schoolAddress = document.getElementById("schoolAddress").value;
  let schoolEmail = document.getElementById("schoolEmail").value;
  let clubName = document.getElementById("clubName").value;
  let clubEmail = document.getElementById("clubEmail").value;
  let clubWebsite = document.getElementById("clubWebsite").value;
  let teacherName = document.getElementById("teacherName").value;
  let teacherEmail = document.getElementById("teacherEmail").value;
  let teacherPhone = document.getElementById("teacherPhone").value;
  let studentName = document.getElementById("studentName").value;
  let studentEmail = document.getElementById("studentEmail").value;
  let studentPhone = document.getElementById("studentPhone").value;
  let data = {
    schoolName,
    schoolAddress,
    schoolEmail,
    clubName,
    clubEmail,
    clubWebsite,
    teacherName,
    teacherEmail,
    teacherPhone,
    studentName,
    studentEmail,
    studentPhone,
  };

  fetch("/register/school", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg === "success") {
        notyf.success("Registration Successful");
        window.location.href = "/register/team";
      } else {
        notyf.error("Registration Failed");
      }
    })
    .catch((err) => {
      notyf.error("Registration Failed");
    });
});
