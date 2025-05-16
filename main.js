document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  AOS.init({ duration: 800, once: true });

  // Mobile menu toggle
  const toggle   = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Back to top
  const backBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(link.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' });
      navLinks.classList.remove('show');
    });
  });

  // Pricing PayPal Buttons
  document.querySelectorAll('.pay-btn').forEach(btn => {
    const amount = btn.dataset.amount;
    paypal.Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,
      style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'pay', height: 45 },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: amount },
            payee: { email_address: 'davidsamaan23@gmail.com' }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          alert(`Payment of $${amount} completed by ${details.payer.name.given_name}!`);
        });
      },
      onError: err => {
        console.error('PayPal Pricing Error', err);
        alert('Payment error. Please try again.');
      }
    }).render(btn);
  });

  // Dedicated PayPal Section
  paypal.Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: { layout: 'horizontal', color: 'blue', shape: 'pill', label: 'checkout', height: 45 },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: { value: '1.00' },
          payee: { email_address: 'davidsamaan23@gmail.com' }
        }],
        application_context: {
          brand_name: 'David – Certified Graphic Designer',
          shipping_preference: 'NO_SHIPPING'
        }
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        alert(`Thank you ${details.payer.name.given_name}! Your payment is confirmed.`);
      });
    },
    onError: err => {
      console.error('PayPal Dedicated Error', err);
      alert('Payment failed. Please try again.');
    }
  }).render('#paypal-button-container');

  // Custom Order Form + PayPal
  const form = document.getElementById('orderForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Send request details
    fetch('https://formspree.io/f/moqgrzlw', {
      method: 'POST',
      body:   new FormData(form),
      headers:{ 'Accept': 'application/json' }
    }).then(res => {
      if (res.ok) {
        // Render custom PayPal button
        const cont = document.getElementById('paypal-custom-container');
        cont.innerHTML = '';
        paypal.Buttons({
          fundingSource: paypal.FUNDING.PAYPAL,
          style: { layout: 'horizontal', color: 'blue', shape: 'pill', label: 'checkout', height: 45 },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: '20.00' },
                payee:  { email_address: 'davidsamaan23@gmail.com' }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              alert(`Thanks ${details.payer.name.given_name}! Your request and payment are received.`);
              form.reset();
              cont.innerHTML = '';
            });
          },
          onError: err => {
            console.error('PayPal Custom Error', err);
            alert('Payment error. Try again.');
          }
        }).render(cont);
      } else {
        alert('Error sending your request. Please try again.');
      }
    });
  });

});