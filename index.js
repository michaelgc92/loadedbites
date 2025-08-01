// index.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBw8_X1WR4sorkQmyVgSBAv6J9Xwt33OXs",
  authDomain: "loadedbitesorders.firebaseapp.com",
  databaseURL: "https://loadedbitesorders-default-rtdb.firebaseio.com",
  projectId: "loadedbitesorders",
  storageBucket: "loadedbitesorders.firebasestorage.app",
  messagingSenderId: "779273803973",
  appId: "1:779273803973:web:3f117a784918631a39f8ac",
  measurementId: "G-W8Y81CPLX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Dropdown Login/Logout setup
const formSelect = document.getElementById('formSelect');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotPasswordForm');

onAuthStateChanged(auth, (user) => {
  if (formSelect) {
    formSelect.innerHTML = "";
    if (user) {
      formSelect.innerHTML = `<option value="logout">Logout</option>`;
      if (loginForm) loginForm.style.display = 'none';
      if (registerForm) registerForm.style.display = 'none';
      if (forgotForm) forgotForm.style.display = 'none';
    } else {
      formSelect.innerHTML = `
        <option value="login">Login</option>
        <option value="signup">Sign Up</option>
        <option value="forgot">Forgot Password</option>`;
      if (loginForm) loginForm.style.display = 'block';
    }
  }
});

if (formSelect) {
  formSelect.addEventListener('change', async () => {
    if (formSelect.value === 'logout') {
      await signOut(auth);
      window.location.href = 'index.html';
    }
    if (loginForm) loginForm.style.display = formSelect.value === 'login' ? 'block' : 'none';
    if (registerForm) registerForm.style.display = formSelect.value === 'signup' ? 'block' : 'none';
    if (forgotForm) forgotForm.style.display = formSelect.value === 'forgot' ? 'block' : 'none';
  });
}

// Profile page: Load orders
const orderHistory = document.getElementById('orderHistory');
if (orderHistory) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      document.getElementById('userEmail').innerText = user.email;
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      orderHistory.innerHTML = "";
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${data.item}</td>
          <td>${data.pickupTime}</td>
          <td>${data.createdAt?.toDate().toLocaleString() || ''}</td>
        `;
        orderHistory.appendChild(row);
      });
    }
  });
}

// Profile page: Place new order
const orderForm = document.getElementById('newOrderForm');
if (orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const item = document.getElementById('orderItem').value;
    const pickupTime = document.getElementById('orderPickupTime').value;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await addDoc(collection(db, "orders"), {
            userId: user.uid,
            item,
            pickupTime,
            createdAt: serverTimestamp()
          });
          alert("✅ Order placed successfully!");
          orderForm.reset();
        } catch (err) {
          alert("Error placing order: " + err.message);
        }
      } else {
        alert("Please log in to place an order.");
      }
    });
  });
}

export { auth, db };
