const APIURL = "https://api.openweathermap.org/data/2.5/";
const ajaxHTML = document.getElementById('ajax-data');
let type;
let city;

let searchForm = document.getElementById("searchBtn");
searchForm.addEventListener("click", function(e){
  e.preventDefault();
  type = document.getElementById('type').value;
  city = document.getElementById('querySearch').value;
  getPosts(type, city);
});


function getPosts(type, city) {
   ajaxHTML.innerHTML = '';
  fetch(`${APIURL}${type}?q=${city}&appid=5990bc472b4bb74ee8d0e6b86913e0f9&units=metric`)
  .then(response => response.json())
  .then(posts => {
  console.log(posts);
  if(type == 'weather'){
      ajaxHTML.appendChild(renderPosts(posts));
    }else{
      let cityname = posts.city.name;
      posts.list.forEach(post => {
        ajaxHTML.appendChild(renderPostsForecast(cityname, post))
      });
    }
  })
  .catch(error => console.error(error));
}

function renderPosts(post) {
 
  const postData = 
          `<div class="card-body">`+
            `<h5 class="card-title mb-5">${post.name}</h5>`+
            `<ul class="list-group">`+
              `<li class="list-group-item">Weather is <strong>${post.weather[0].main} - ${post.weather[0].description}</strong></li>`+
              `<li class="list-group-item">Current temperature is <strong>${post.main.temp}°C</strong></li>`+
              `<li class="list-group-item">Min temperature is <strong>${post.main.temp_min}°C</strong></li>`+
              `<li class="list-group-item">Max temperature is <strong>${post.main.temp_max}°C</strong></li>`+
              `<li class="list-group-item">Wind speed is <strong>${post.wind.speed} m/s</strong></li>`+
            `</ul>`+
        `</div>`;
  
  const postWrapper = document.createElement('div');
  postWrapper.classList.add('card');
  postWrapper.style.width = "100%"
  postWrapper.innerHTML = postData;

  return postWrapper;
}
function renderPostsForecast(cityname, post) {
 
  const postData = 
  `<div class="card-body">` +
  `<h5 class="card-title mb-5">${cityname}</h5>` +
  `<ul class="list-group">` +
      `<li class="list-group-item">On <strong>${post.dt_txt}</strong></li>`+
      `<li class="list-group-item">It will be <strong>${post.main.temp}°C</strong></li>` +
      `<li class="list-group-item">Wind speed is <strong>${post.wind.speed} m/s</strong></li>` +
  `</ul>` +
 `</div>`;
  
  const postWrapper = document.createElement('div');
  postWrapper.classList.add('card');
  postWrapper.style.width = "100%"
  postWrapper.innerHTML = postData;

  return postWrapper;
}
