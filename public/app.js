const API = "http://localhost:3000";

// NAVIGATION
function goBrowse() {
  window.location.href = "browse.html";
}

function goHome() {
  window.location.href = "index.html";
}

function goProfile() {
  window.location.href = "profile.html";
}

function goAdmin() {
  window.location.href = "admin.html";
}

// AUTH
async function login() {
  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();
  if (!data.token) {
    alert("Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);

  if (typeof token !== "undefined") {
    token.value = data.token;
  }

  alert("Logged in as " + data.role);
}

async function register() {
  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: regEmail.value,
      password: regPassword.value,
      role: regRole.value
    })
  });

  alert(res.status === 201 ? "Registered!" : "Error");
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// MOVIES
async function loadMovies(type) {
  const url = type ? API + "/movies?type=" + type : API + "/movies";
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data);
}

async function addMovie() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  const res = await fetch(API + "/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      name: name.value,
      genre: genre.value,
      year: Number(year.value),
      director: director.value,
      description: description.value,
      type: type.value
    })
  });

  if (res.status === 201) {
    loadMovies();
  } else {
    alert("Access denied");
  }
}

// FAVORITES
async function loadFavorites() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  const res = await fetch(API + "/users/favorites", {
    headers: { Authorization: "Bearer " + token }
  });

  renderMovies(await res.json());
}

async function addToFavorites(id) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  await fetch(API + "/users/favorites/" + id, {
    method: "POST",
    headers: { Authorization: "Bearer " + token }
  });

  alert("Added to favorites");
}

// RENDER MOVIES
function renderMovies(movies) {
  const container = document.getElementById("movies");
  if (!container) return;

  container.innerHTML = "";
  const role = localStorage.getItem("role");

  movies.forEach(m => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <h3>${m.name}</h3>
      <p>${m.description}</p>

      <div class="rating">
        ⭐ Rating: ${m.avgRating ?? "No ratings yet"}
      </div>
    `;

    if (role === "admin") {
      card.innerHTML += `
        <button onclick="deleteMovie('${m._id}')">🗑 Delete</button>
      `;
    } else {
      card.innerHTML += `
        <select id="rate-${m._id}">
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="5">5 ⭐</option>
        </select>

        <button onclick="rateMovie('${m._id}')">Rate</button>
        <button class="favorite" onclick="addToFavorites('${m._id}')">❤️ Favorite</button>
      `;
    }

    container.appendChild(card);
  });
}

// DELETE MOVIE (ADMIN)
async function deleteMovie(id) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  if (!confirm("Delete this movie?")) return;

  const res = await fetch(API + "/movies/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  if (res.ok) {
    alert("Movie deleted");
    loadMovies();
  } else {
    alert("Error deleting movie");
  }
}

// PROFILE
async function loadProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const emailEl = document.getElementById("profileEmail");
    const roleEl = document.getElementById("profileRole");

    if (emailEl) emailEl.innerText = payload.email || "User";
    if (roleEl) roleEl.innerText = payload.role;

  } catch {
    console.error("Invalid token");
  }

  const favRes = await fetch(API + "/users/favorites", {
    headers: { Authorization: "Bearer " + token }
  });
  renderProfileMovies("favoriteMovies", await favRes.json());

  const revRes = await fetch(API + "/users/reviews", {
    headers: { Authorization: "Bearer " + token }
  });
  if (revRes.ok) {
    renderReviews(await revRes.json());
  }
}

function renderProfileMovies(containerId, movies) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  movies.forEach(m => {
    container.innerHTML += `
      <div class="movie-card">
        <h3>${m.name}</h3>
        <p>${m.description}</p>
      </div>
    `;
  });
}

function renderReviews(reviews) {
  const container = document.getElementById("myReviews");
  if (!container) return;

  container.innerHTML = "";
  reviews.forEach(r => {
    container.innerHTML += `
      <div class="card">
        <p><b>${r.movie.name}</b>: ${r.text} (⭐ ${r.rating})</p>
      </div>
    `;
  });
}

// RATE MOVIE
async function rateMovie(movieId) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  const ratingEl = document.getElementById("rate-" + movieId);
  if (!ratingEl) return;

  const rating = Number(ratingEl.value);

  const res = await fetch(API + "/reviews/" + movieId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      text: "User rating",
      rating
    })
  });

  if (res.ok) {
    alert("Rating saved");
    loadMovies();
  } else {
    alert("Error saving rating");
  }
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    loadProfile();
  }

  const role = localStorage.getItem("role");
  
});
