const form = $("section form");
const input = $("section form input");
const msg = $("section .feedback ");
const profiles = $("section .profiles");
form.submit((e) => {
  e.preventDefault();
  if (input.val().replace(/\s/g, "") === "") {
    msg.show();
    msg.text("Please enter a valid username");
    timer(3000);
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
      console.log(profileNamesArray);
      if (!name || !location) {
        msg.show();
        msg.text(`${login} not specified his informations!`);
        timer(5000);
      }
      if (profileNamesArray.length > 0) {
        const filteredArray = profileNamesArray.filter(
          (profileCard) => $(profileCard).find(" h2").text() == name
        );
        if (filteredArray.length > 0) {
          msg.show();
          msg.text(
            `You already searched the ${name}, Please search for another profile`
          );
          timer(5000);
          return;
        } else if (profiles.children.length > 5) {
          msg.show();

          msg.text(`You can only check for 6 profiles`);
          timer(5000);
          $(".container").append("<hr>");
          return;
        }
      }
      profiles.append(`
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
    beforeSend: (request) => {
      //   console.log("before ajax send");
    },
    complete: () => {
      form.trigger("reset");
    },
    error: (XMLHttpRequest) => {
      if ((XMLHttpRequest.status = 404)) {
        msg.show();
        // msg.fadeOut(3000);
        msg.text(`We can't find the ${input.val()}'s profile`);
        timer(5000);
        // return;
      } else {
        msg.text(XMLHttpRequest.status);
        timer(5000);
      }
    },
  });
};

function timer(time) {
  setTimeout(() => {
    msg.text("");
    msg.hide();
  }, time);
}

$(".trash").click((e) => {
  profiles.empty();
  e.preventDefault();
});
