const form = $("section form");
const input = $("section form input");
const msg = $("section .feedback ");
const profiles = $("section .profiles");
form.submit((e) => {
  e.preventDefault();
  if (input.val().replace(/\s/g, "") === "") {
    msg.text("Please enter a valid username");
    msg.fadeToggle(2000);
    timer();
    return;
  }
  getUserData();
});

const getUserData = async () => {
  let url = `https://api.github.com/users/${input.val()}`;
  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: (response) => {
      const {
        avatar_url,
        name,
        html_url,
        location,
        public_repos,
        followers,
        login,
      } = response;
      const profileNamesArray = Array.from($(".card-container")); 
      if (!name || !location) {
        msg.text(`${login} not specified his informations!`);
        msg.fadeToggle(2000);
        timer();
      }
      if (profileNamesArray.length > 0) {
        const filteredArray = profileNamesArray.filter(
          (profileCard) => $(profileCard).find(" h2").text() == name
        );
        if (filteredArray.length > 0) {
          msg.text(
            `You already searched the ${name}, Please search for another profile`
          );
          msg.fadeToggle(2000);
          timer();
          return;
        } else if (profileNamesArray.length > 5) {
          msg.text(`You can only check for 6 profiles`);
          msg.fadeToggle(2000);
          timer();
          $(".container").append("<hr>");
          return;
        }
      }
      profiles.prepend(`
      <div class="card-container">
            <span class="pro">Github</span>
            <img class="round" src="${avatar_url}" alt="user" />
            <h2 class="name"><span>${name}</span></h2>
            <h5 class="location">${location}</h5>

            <div class="buttons">
                <a href="${html_url}" target="_blank">Visit Profile</a> 
            </div>
            <div class="infos">
                <div class="repos">
                    <h4>Public Repos</h4>
                    <p>${public_repos}</p>
                </div>
                <div class="followers">
                    <h4>Followers</h4>
                    <p>${followers}</p>
                </div> 
            </div>
        </div> 
      `);
    },
    // beforeSend: (request) => {
    //   console.log("before ajax send");
    // },
    complete: () => {
      form.trigger("reset");
    },
    error: (XMLHttpRequest) => {
      if ((XMLHttpRequest.status = 404)) {
        msg.text(`We can't find the ${input.val()}'s profile`);
        msg.fadeToggle(2000);
        timer();
      } else {
        msg.text(XMLHttpRequest.status);
        msg.fadeToggle(2000);
        timer();
      }
    },
  });
};
function timer() {
  setTimeout(() => {
    msg.fadeToggle(1000);
  });
}
$(".trash").click(() => {
  profiles.empty(); 
});
