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
  let pass = document.getElementById("password").value;
  let cpassword = document.getElementById("cpassword").value;
  if (pass != cpassword) {
    notyf.error("Passwords do not match");
    return;
  }
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
    pass,
  };

  fetch("/register/school", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      console.log(res.status);
      if (res.status === 200) {
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
