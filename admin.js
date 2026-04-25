import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.addMovie = async () => {
  await addDoc(collection(db, "movies"), {
    name: name.value,
    img: img.value
  });

  alert("Movie Added");
};
