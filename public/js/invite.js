var notyf = new Notyf();

const inviteBtn = document.getElementById("inviteBtn");

inviteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const schName = document.getElementById("school_name");
  const schEmail = document.getElementById("school_email");
  const clubName = document.getElementById("club_name");
  const clubEmail = document.getElementById("club_email");

  fetch("/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schName: schName.value,
      schEmail: schEmail.value,
      clubName: clubName.value,
      clubEmail: clubEmail.value,
    }),
  }).then(async (res) => {
    if (res.status === 200) {
      notyf.success("Invite Sent");
    } else {
      notyf.error("some error occurred");
    }
  });
});
