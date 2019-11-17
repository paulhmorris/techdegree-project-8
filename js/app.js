const grid = document.querySelector('#grid');
const names = document.getElementsByClassName('name');
const items = document.getElementsByClassName('grid-item');
const emails = document.getElementsByClassName('email');
const users = getUsers();

// Random User API //
function getUsers() {
  let settings = {
    url: "https://randomuser.me/api/?results=12&nat=US&noinfo",
    dataType: "json",
    success: function(data) {
      console.log(data);
    }
  }
  return $.ajax(settings)
};

// Fill overlay with information
function newOverlay(user) {
  $('#over-pic').attr('src', user.picture.large);
  $('#over-name').text(`${user.name.first} ${user.name.last}`)
  $('#over-email').text(user.email);
  $('#over-loc').text(user.location.city);
  $('#phone').text(user.phone);
  $('#address').text(`${user.location.street.number} ${user.location.street.name} ${user.location.city}, ${user.location.state} ${user.location.postcode}`)
  let birthday = user.dob.date.substring(0, 10);
  $('#birthday').text(birthday);
};

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
};

$('#search').on('keyup', search);

// Populate the grid items and add event listeners//
$.when(users).done( function() {
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
  // Modal Overlay //
  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function(e) {
      let user = users.responseJSON.results[i];
      // Global variable
      clickedUser = i;
      newOverlay(user);
      console.log(user);
      $('body').addClass('is-dimmed');
      $('#overlay').css("display", "flex");  
    });
  }

  $('#close').click( function() {
    $('body').removeClass('is-dimmed');
    $('#overlay').css("display", "none");
  });
});

// Overlay Navigation //
$('#left').on('click', function() {
  // Cycles through array at the beginning
  if (clickedUser === 0) {
    newOverlay(users.responseJSON.results[users.responseJSON.results.length - 1]);
    clickedUser = users.responseJSON.results.length;
  } else {
    newOverlay(users.responseJSON.results[clickedUser - 1]);
  }
  clickedUser -= 1;
});

$('#right').on('click', function() {
  // Cycles through array at the end
  if (clickedUser === users.responseJSON.results.length - 1) {
    newOverlay(users.responseJSON.results[0]);
    clickedUser = -1;
  } else {
    newOverlay(users.responseJSON.results[clickedUser + 1]);
  }
  clickedUser += 1;
});