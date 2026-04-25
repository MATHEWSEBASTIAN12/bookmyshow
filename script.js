import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser;
let selectedSeats = [];
let total = 0;
let currentShowId = "";

// AUTH
window.signup = async () => {
  await createUserWithEmailAndPassword(auth, email.value, password.value);
};

window.login = async () => {
  await signInWithEmailAndPassword(auth, email.value, password.value);
};

window.logout = () => signOut(auth);

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    authDiv.classList.add("hidden");
    app.classList.remove("hidden");
    loadMovies();
  } else {
    authDiv.classList.remove("hidden");
    app.classList.add("hidden");
  }
});

// LOAD MOVIES FROM DB
async function loadMovies() {
  const snapshot = await getDocs(collection(db, "movies"));
  movies.innerHTML = "";

  snapshot.forEach(docSnap => {
    const m = docSnap.data();
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `<img src="${m.img}"><p>${m.name}</p>`;
    div.onclick = () => loadShows(docSnap.id);
    movies.appendChild(div);
  });
}

// LOAD SHOWS
async function loadShows(movieId) {
  selectedMovie.innerText = "Select Show";

  const snapshot = await getDocs(collection(db, "shows"));
  shows.innerHTML = "";

  snapshot.forEach(docSnap => {
    const s = docSnap.data();
    if (s.movieId === movieId) {
      const div = document.createElement("div");
      div.className = "show";
      div.innerText = s.time;
      div.onclick = () => loadSeats(docSnap.id);
      shows.appendChild(div);
    }
  });
}

// SEATS WITH LOCKING
async function loadSeats(showId) {
  currentShowId = showId;
  const seatRef = doc(db, "seats", showId);
  let data = (await getDoc(seatRef)).data();

  if (!data) {
    data = { seats: Array(100).fill("available") };
    await setDoc(seatRef, data);
  }

  seats.innerHTML = "";
  total = 0;
  selectedSeats = [];

  data.seats.forEach((status, i) => {
    const s = document.createElement("div");
    s.className = "seat " + status;

    s.onclick = async () => {
      if (status === "available") {
        data.seats[i] = "locked";
        await updateDoc(seatRef, data);

        s.classList.add("selected");
        total += 150;
        selectedSeats.push(i);
        document.getElementById("total").innerText = total;

        // Auto release after 2 minutes
        setTimeout(async () => {
          data.seats[i] = "available";
          await updateDoc(seatRef, data);
        }, 120000);
      }
    };

    seats.appendChild(s);
  });
}

// PAYMENT + BOOKING
window.proceedPayment = async () => {
  if (selectedSeats.length === 0) return alert("Select seats");

  const seatRef = doc(db, "seats", currentShowId);
  const data = (await getDoc(seatRef)).data();

  selectedSeats.forEach(i => data.seats[i] = "booked");
  await updateDoc(seatRef, data);

  generateTicket();
};

// TICKET WITH QR
function generateTicket() {
  ticket.innerHTML = `
    <h2>🎟️ Booking Confirmed</h2>
    <p>Seats: ${selectedSeats.join(", ")}</p>
    <p>Total: ₹${total}</p>
    <img src="https://api.qrserver.com/v1/create-qr-code/?data=${selectedSeats}">
  `;
}
