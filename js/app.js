const grid = document.querySelector('#grid');
const names = document.getElementsByClassName('name');
const items = document.getElementsByClassName('grid-item');
const emails = document.getElementsByClassName('email');

// Random User API //
function getUsers() {
  let settings = {
    url: "https://randomuser.me/api/?results=12&nat=US",
    dataType: "json",
    success: function(data) {
      console.log(data);
    }
  }

  return $.ajax(settings)
};

let users = getUsers();

// Populate the grid items and add event listeners//
$.when(users).done(function () {
  for (let i = 0; i < users.responseJSON.results.length; i++) {
    let user = users.responseJSON.results[i];
    grid.innerHTML +=
      `
      <div class="grid-item flex-row-center">
        <img class="profile-pic" src="${user.picture.large}" alt="">
        <div class="text-container flex-column-center">
          <h2 class="name">${user.name.first} ${user.name.last}</h2>
          <p class="email">${user.email}</p>
          <p class="loc">${user.location.city}</p>
        </div>
      </div>
      `
  }
  
  // Overlay Function //
  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function(event) {
      $('.over-pic').attr('src', event.target.firstElementChild.src);
      $('body').addClass('is-dimmed');
      $('#overlay').css("display", "flex");   
    });
  }

  $('#close').click(function() {
    $('body').removeClass('is-dimmed');
    $('#overlay').css("display", "none");
  });
});


// Search Function //
function search() {
  let search = document.getElementById('search');
  for (let i = 0; i < items.length; i++) {
    if (names[i].textContent.toLowerCase().includes(search.value.toLowerCase()) || emails[i].textContent.toLowerCase().includes(search.value.toLowerCase())) {
      names[i].parentNode.parentNode.style.display = '';
    } else {
      names[i].parentNode.parentNode.style.display = 'none';
    }
  }
} 

document.getElementById('search').addEventListener('keyup', search);