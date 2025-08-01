window.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.querySelector('.hero-cta-btn-btn1:nth-child(1)');
  const orderBtn = document.querySelector('.hero-cta-btn-btn1:nth-child(2)');
  const loginBtn = document.querySelector('.header-cta-btn:nth-child(1)');
  const headerOrderBtn = document.querySelector('.header-cta-btn:nth-child(2)');

  registerBtn.addEventListener('click', () => {
    alert('Registration feature coming soon!');
  });

  orderBtn.addEventListener('click', () => {
    alert('Online ordering will be available shortly!');
  });

  loginBtn.addEventListener('click', () => {
    alert('Login portal coming soon!');
  });

  headerOrderBtn.addEventListener('click', () => {
    alert('Online ordering will be available shortly!');
  });
});


function sendOrderToSquare(order) {
  fetch('https://connect.squareup.com/v2/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_SQUARE_ACCESS_TOKEN'
    },
    body: JSON.stringify({
      order: {
        location_id: 'YOUR_LOCATION_ID',
        line_items: [
          { name: order.item, quantity: '1', base_price_money: { amount: 1000, currency: 'USD' }}
        ]
      }
    })
  })
  .then(res => res.json())
  .then(data => console.log('Order sent to Square:', data))
  .catch(err => console.error(err));
}


function register(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Account created!"))
    .catch(err => alert(err.message));
}

function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("Logged in!"))
    .catch(err => alert(err.message));
}

function placeOrder(item, price) {
  db.collection("orders").add({
    item: item,
    price: price,
    user: auth.currentUser.email,
    timestamp: new Date()
  })
  .then(() => alert("Order placed!"))
  .catch(err => alert(err.message));
}

