const movies = [
  {
    name: "Leo",
    img: "https://image.tmdb.org/t/p/w500/8bZ7Q7xHkZlNw9QXK3iW5pXk6s.jpg"
  },
  {
    name: "KGF Chapter 2",
    img: "https://image.tmdb.org/t/p/w500/9ZedQHPQVveaIYmDSTazhT3y273.jpg"
  }
];

const cinemas = [
  {
    name: "PVR Lulu Mall Kochi",
    img: "https://images.unsplash.com/photo-1581905764498-8c63f6c7a8c2"
  },
  {
    name: "Cinepolis Centre Square Kochi",
    img: "https://images.unsplash.com/photo-1505685296765-3a2736de412f"
  },
  {
    name: "Carnival Cinemas Trivandrum",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
  }
];

const timings = ["10:00 AM", "2:00 PM", "6:00 PM"];

let selectedMovie = "";
let selectedCinema = "";
let selectedTime = "";
let total = 0;
let selectedSeats = [];

const moviesDiv = document.getElementById("movies");
const cinemasDiv = document.getElementById("cinemas");
const showsDiv = document.getElementById("shows");

movies.forEach(m => {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<img src="${m.img}"><p>${m.name}</p>`;
  div.onclick = () => selectCinema(m);
  moviesDiv.appendChild(div);
});

function selectCinema(movie) {
  selectedMovie = movie.name;

  cinemaTitle.classList.remove("hidden");
  cinemasDiv.innerHTML = "";

  cinemas.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${c.img}"><p>${c.name}</p>`;
    div.onclick = () => selectShow(c);
    cinemasDiv.appendChild(div);
  });
}

function selectShow(cinema) {
  selectedCinema = cinema.name;

  showTitle.classList.remove("hidden");
  showsDiv.innerHTML = "";

  timings.forEach(t => {
    const btn = document.createElement("button");
    btn.innerText = t;
    btn.onclick = () => selectSeats(t);
    showsDiv.appendChild(btn);
  });
}

function selectSeats(time) {
  selectedTime = time;

  seatSection.classList.remove("hidden");
  const seatDiv = document.getElementById("seats");

  seatDiv.innerHTML = "";
  total = 0;
  selectedSeats = [];

  for (let i = 0; i < 40; i++) {
    const s = document.createElement("div");
    s.className = "seat";

    s.onclick = () => {
      s.classList.toggle("selected");
      if (s.classList.contains("selected")) {
        total += 150;
        selectedSeats.push(i);
      } else {
        total -= 150;
        selectedSeats = selectedSeats.filter(x => x !== i);
      }
      document.getElementById("total").innerText = total;
    };

    seatDiv.appendChild(s);
  }
}

function checkout() {
  if (selectedSeats.length === 0) {
    alert("Select seats first");
    return;
  }

  document.getElementById("checkout").classList.remove("hidden");

  document.getElementById("summary").innerText =
    `Movie: ${selectedMovie}
Cinema: ${selectedCinema}
Time: ${selectedTime}
Seats: ${selectedSeats.join(", ")}
Total: ₹${total}`;
}

function confirmBooking() {
  document.getElementById("result").innerHTML = `
    <h2>🎟️ Booking Confirmed</h2>
    <p>${selectedMovie} - ${selectedCinema}</p>
    <p>${selectedTime}</p>
    <p>Seats: ${selectedSeats.join(", ")}</p>
  `;
}
