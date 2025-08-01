import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.addEventListener('DOMContentLoaded', () => {
  const profileLink = document.getElementById('profileLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginLink = document.getElementById('loginLink');
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const forgotPasswordToggle = document.getElementById('forgotPasswordToggle');
  const closeForgot = document.getElementById('closeForgot');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      profileLink.style.display = 'inline-block';
      logoutBtn.style.display = 'inline-block';
      loginLink.style.display = 'none';
    } else {
      profileLink.style.display = 'none';
      logoutBtn.style.display = 'none';
      loginLink.style.display = 'inline-block';
    }

    if (!user && window.location.hash === '#order') {
      alert('You must be logged in to place an order. Redirecting to login.');
      window.location.hash = '#login';
    }
  });

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          rewards: 0
        });
        alert('Account created successfully! You can now log in.');
        window.location.hash = '#login';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.hash = '#hero';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmail').value;
      try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset link sent! Check your email.');
      } catch (error) {
        alert(error.message);
      }
    });
  }

  if (forgotPasswordToggle) {
    forgotPasswordToggle.addEventListener('click', () => {
      forgotPasswordForm.style.display = 'block';
    });
  }

  if (closeForgot) {
    closeForgot.addEventListener('click', () => {
      forgotPasswordForm.style.display = 'none';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      signOut(auth).then(() => {
        const banner = document.getElementById('logoutBanner');
        banner.style.display = 'block';
        setTimeout(() => {
          banner.style.display = 'none';
          window.location.hash = '#hero';
        }, 3000);
      });
    });
  }
});
