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
  if ( schoolName == "" || schoolAddress == "" || schoolEmail == "" || teacherName == "" || teacherEmail == "" || teacherPhone == "" || studentName == "" || studentEmail == "" ||studentPhone == "" || pass == "" ) {
    notyf.error("Please fill all the fields");
    return;
  }
  if (pass.length < 8) {
    notyf.error("Password must be atleast 8 characters long");
    return;
  }
  if (teacherPhone.length < 10 || studentPhone.length < 10) {
    notyf.error("Invalid Phone Number");
    return;
  }
  function ValidateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  if (!ValidateEmail(schoolEmail) || !ValidateEmail(teacherEmail) || !ValidateEmail(studentEmail)) {
    notyf.error("Invalid School, Teacher or Student Email");
    return;
  }
  if (clubEmail != "") {
    if (!ValidateEmail(clubEmail)) {
      notyf.error("Invalid Club Email");
      return;
    }
  }

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
    pass
  };

  document.getElementById("regButton").innerHTML = "Registering...";
  document.getElementById("regButton").disabled = true;
  fetch("/register/school", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.status === 200) {
        notyf.success("Registration Successful");
        setTimeout(() => {
          window.location.href = "/register/team";
        }, 2000);
      } else {
        notyf.error("Registration Failed");
        document.getElementById("regButton").innerHTML = "Register";
        document.getElementById("regButton").disabled = false;
      }
    })
    .catch((err) => {
      notyf.error("Registration Failed");
    });
});
