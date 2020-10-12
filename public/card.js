const stripe = Stripe('pk_test_51Ha6EUEsCFPlCMG13YMA2jlqYopE1NnrRpMeZWJYOQM6JuU5KWWq5NqtoDSwtJQ8lKi1Xq5nnB9SYOAR5Jb9pqDp00kPG7meQM'); // Your Publishable Key
const elements = stripe.elements();
alert("hi")

// Create our card inputs
var style = {
  base: {
    color: "#fff"
  }
};

const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.querySelector('form');
const errorEl = document.querySelector('#card-errors');

// Give our token to our form
const stripeTokenHandler = token => {
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);
console.log(token.id);
  form.submit();
}

// Create token from card data
form.addEventListener('submit', e => {
  e.preventDefault();

  stripe.createToken(card).then(res => {
    if (res.error) errorEl.textContent = res.error.message;
    else stripeTokenHandler(res.token);
  })
})
