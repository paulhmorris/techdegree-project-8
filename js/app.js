const url = "https://randomuser.me/api/?results=12&nat=US&noinfo";
const grid = document.querySelector('#grid');
const names = document.getElementsByClassName('name');
const items = document.getElementsByClassName('grid-item');
const emails = document.getElementsByClassName('email');
const overlay = document.querySelector('#overlay');

let clickedUser = 0;
let users = [];

// Random User API Functions //
async function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(data => {
      users = data.results;
      generateItems(data);
      addListeners(items);
      console.log(data);
    })
    .catch(error => console.log('Looks like there was a problem:', error));
}

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

// Content Generation Functions //
function generateItems(data) {
  const items = data.results.map(item => {
    grid.innerHTML +=
      `
        <div class="grid-item flex-row-center">
          <img class="profile-pic" src="${item.picture.large}" alt="">
          <div class="text-container flex-column-center">
            <h2 class="name">${item.name.first} ${item.name.last}</h2>
            <p class="email">${item.email}</p>
            <p class="loc">${item.location.city}</p>
          </div>
        </div>  
        `;
  });
  return items;
}

function addListeners(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].addEventListener("click", () => {
      let user = users[i];
      clickedUser = i;
      generateOverlay(user);
      console.log(user);

      $('body').addClass('is-dimmed');
      $('#overlay').css("display", "flex");
    });
  }
}

// Fill overlay with information
function generateOverlay(user) {
  const dob = new Date(Date.parse(user.dob.date)).toLocaleDateString(navigator.language);
  let html =
    `
    <p id="left" class="left">❮</p>
    <div class="over-wrapper">
      <p id="close">&#10005;</p>
      <div class="over-pic">
        <img id="over-pic" src="${user.picture.large}">
      </div>
      <div class="over-text-container">
        <h2 id="over-name">${user.name.first} ${user.name.last}</h2>
        <p id="over-email">${user.email}</p>
        <p id="over-loc">${user.location.city}</p>
      </div>
      <div class="over-text-container-2">
        <p id="phone"></p>
        <p id="address">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
        <p id="birthday">${dob}</p>
      </div>
    </div>
    <p id="right" class="right">❯</p>
    `;
  overlay.innerHTML = html;
  
  // Event Listeners
  $('#close').click( () => {
    $('body').removeClass('is-dimmed');
    $('#overlay').css("display", "none");
  });

  $('#left').on('click', () =>{
    // Cycles through array at the beginning
    if (clickedUser === 0) {
      generateOverlay(users[users.length - 1]);
      clickedUser = users.length;
    } else {
      generateOverlay(users[clickedUser - 1]);
    }
    clickedUser -= 1;
  });

  $('#right').on('click', () => {
    // Cycles through array at the end
    if (clickedUser === users.length - 1) {
      generateOverlay(users[0]);
      clickedUser = -1;
    } else {
      generateOverlay(users[clickedUser + 1]);
    }
    clickedUser += 1;
  });
} // Modal //

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

$('#search').on('keyup', search);

fetchData(url);