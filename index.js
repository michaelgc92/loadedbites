// index.js (final cleaned-up structure)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) return alert("Passwords do not match");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), { email, rewardPoints: 0, createdAt: serverTimestamp() });
      registerForm.reset();
      document.getElementById('successMessage').innerText = "✅ Account created successfully!";
      document.getElementById('successMessage').style.display = 'block';
    } catch (err) { alert(err.message); }
  });
}

// Login
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
    } catch (err) { alert(err.message); }
  });
}

// Forgot Password
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (err) { alert(err.message); }
  });
}

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    try {
      await addDoc(collection(db, "messages"), { name, email, message, createdAt: serverTimestamp() });
      contactForm.reset();
      document.getElementById('contactSuccess').style.display = 'block';
    } catch (err) { alert("Error sending message: " + err.message); }
  });
}

// Auth state & Admin Link
const profileBtn = document.getElementById('profileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminLink = document.getElementById('adminLink');
const adminBadge = document.getElementById('adminBadge');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (profileBtn) profileBtn.style.display = 'inline';
    if (logoutBtn) logoutBtn.style.display = 'inline';

    // Admin check
    if (user.email === "loadedbitesfoodstand@gmail.com") {
      if (adminLink) adminLink.style.display = 'inline';
      if (adminBadge) adminBadge.style.display = 'inline';
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const pointsElement = document.getElementById('rewardPoints');
      if (pointsElement) pointsElement.innerText = userDoc.data().rewardPoints || 0;
    }
  } else {
    if (profileBtn) profileBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
  }
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
  });
}

// Admin Messages Table
const messagesTable = document.getElementById('messagesTable');
const messagesTableContainer = document.getElementById('messagesTableContainer');
const accessDenied = document.getElementById('accessDenied');

if (messagesTable) {
  onAuthStateChanged(auth, async (user) => {
    if (user && user.email === "loadedbitesfoodstand@gmail.com") {
      messagesTableContainer.style.display = 'table';
      accessDenied.style.display = 'none';
      const querySnapshot = await getDocs(collection(db, "messages"));
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${data.name}</td>
          <td>${data.email}</td>
          <td>${data.message}</td>
          <td>${data.createdAt?.toDate().toLocaleString() || ''}</td>
        `;
        messagesTable.appendChild(row);
      });
    } else if (accessDenied) {
      accessDenied.style.display = 'block';
    }
  });
}
