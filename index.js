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
