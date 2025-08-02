// admin.js - Admin Dashboard for Loaded Bites with Success/Error banners
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase config (reuse from index.js)
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

// Elements
const ordersTable = document.getElementById('adminOrders');
const messageBanner = document.createElement('div');
messageBanner.style.position = 'fixed';
messageBanner.style.top = '20px';
messageBanner.style.right = '20px';
messageBanner.style.padding = '12px 20px';
messageBanner.style.borderRadius = '8px';
messageBanner.style.color = 'white';
messageBanner.style.fontWeight = '600';
messageBanner.style.display = 'none';
document.body.appendChild(messageBanner);

function showMessage(text, type) {
  messageBanner.innerText = text;
  messageBanner.style.backgroundColor = type === 'success' ? 'green' : 'red';
  messageBanner.style.display = 'block';
  setTimeout(() => messageBanner.style.display = 'none', 3000);
}

// Only allow admin emails
const adminEmails = ["loadedbitesfoodstand@gmail.com"];

onAuthStateChanged(auth, async (user) => {
  if (user && adminEmails.includes(user.email)) {
    const querySnapshot = await getDocs(collection(db, "orders"));
    ordersTable.innerHTML = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${data.item}</td>
        <td>${data.pickupTime}</td>
        <td>${data.createdAt?.toDate().toLocaleString() || ''}</td>
        <td>
          <button class="completeBtn" data-id="${docSnap.id}">Complete</button>
          <button class="deleteBtn" data-id="${docSnap.id}">Delete</button>
        </td>
      `;
      ordersTable.appendChild(row);
    });

    // Handle Complete/Delete
    document.querySelectorAll('.completeBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await updateDoc(doc(db, "orders", btn.dataset.id), { status: "Completed" });
          showMessage("✅ Order marked as completed!", 'success');
          setTimeout(() => location.reload(), 1500);
        } catch (error) {
          showMessage("❌ Error updating order: " + error.message, 'error');
        }
      });
    });

    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await deleteDoc(doc(db, "orders", btn.dataset.id));
          showMessage("✅ Order deleted!", 'success');
          setTimeout(() => location.reload(), 1500);
        } catch (error) {
          showMessage("❌ Error deleting order: " + error.message, 'error');
        }
      });
    });
  } else {
    document.body.innerHTML = "<h2>Access Denied</h2><p>You must be an admin to view this page.</p>";
  }
});
