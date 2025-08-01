// We’ll move Firebase logic and form handling into index.js and link it across all HTML pages.

// Example structure for index.js:

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), { email, rewardPoints: 0, createdAt: serverTimestamp() });
      registerForm.reset();
      document.getElementById('successMessage').innerText = "Account created successfully!";
      document.getElementById('successMessage').style.display = 'block';
    } catch (error) { alert(error.message); }
  });
}

// Handle login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginForm.reset();
      document.getElementById('successMessage').innerText = `Welcome back, ${email}!`;
      document.getElementById('successMessage').style.display = 'block';
    } catch (error) { alert(error.message); }
  });
}

// Forgot password
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) { alert(error.message); }
  });
}

// Place order
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const item = document.getElementById('item').value;
    const pickupTime = document.getElementById('pickupTime').value;
    try {
      await addDoc(collection(db, "orders"), { item, pickupTime, createdAt: serverTimestamp() });
      orderForm.reset();
      document.getElementById('orderMessage').innerText = "✅ Order placed successfully!";
    } catch (error) { alert(error.message); }
  });
}

// Auth state changes
onAuthStateChanged(auth, async (user) => {
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (user) {
    if (profileBtn) profileBtn.style.display = 'inline';
    if (logoutBtn) logoutBtn.style.display = 'inline';
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const pointsElement = document.getElementById('rewardPoints');
      if (pointsElement) pointsElement.innerText = userDoc.data().rewardPoints || 0;
    }
  } else {
    if (profileBtn) profileBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
});

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });
      contactForm.reset();
      document.getElementById('contactSuccess').style.display = 'block';
    } catch (error) {
      alert("Error sending message: " + error.message);
    }
  });
}
// Each HTML page must include <script type="module" src="index.js"></script>
