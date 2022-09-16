let notyf = new Notyf();

function getLocalStorage() {
  const data = localStorage.getItem('panier');

  if (data == null) {
    return [];
  } else {
    return JSON.parse(data);
  }
}

const ApiURL = 'http://localhost:3000/api/products/';
const infoPanier = getLocalStorage();
const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPrice = document.getElementById('totalPrice');

let totalArticles = 0;
let totalPriceCmp = 0;

let h1 = document.querySelector('.cartAndFormContainer > h1');

if (infoPanier == []) {
  h1.textContent = 'Votre panier est vide';
}

for (let data of infoPanier) {
  fetch(ApiURL + data.id)
    .then((res) => res.json())
    .then((product) => {
      let dom = `<article class="cart__item" id="${data.id}" color="${data.color}">
      <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.description}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
          <p>${data.color}</p>
          <p>${product.price},00 €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté :</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${data.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
      </article>`;

      cartItems.innerHTML += dom;
      totalArticles += data.quantity;
      totalPriceCmp += data.quantity * product.price;

      totalQuantity.textContent = totalArticles;
      totalPrice.textContent = totalPriceCmp;
    });
}

const quantityUpdate = () => {
  let cart = getLocalStorage();

  for (let info of cart) {
    fetch(ApiURL + info.id)
      .then((res) => res.json())
      .then(() => {
        document.querySelectorAll('.itemQuantity').forEach((updateQuantity) => {
          updateQuantity.addEventListener('change', () => {
            let article = updateQuantity.closest('article');

            if (updateQuantity.value > 100 || updateQuantity.value < 1) {
              notyf.error('La quantitée dois être comprise entre 1 et 100');

              return;
            } else {
              if (
                article.id == info.id &&
                article.getAttribute('color') == info.color
              ) {
                info.quantity = parseInt(updateQuantity.value);
                updateQuantity.setAttribute('value', updateQuantity.value);
                localStorage.setItem('panier', JSON.stringify(cart));
              }
            }
            updateTotalPrice();
          });
        });
      });
  }
};

const updateTotalPrice = () => {
  let cart = getLocalStorage();

  let quantity = 0;
  let price = 0;

  for (let info of cart) {
    fetch(ApiURL + info.id)
      .then((res) => res.json())
      .then((data) => {
        quantity += info.quantity;
        price += data.price * info.quantity;
        totalPrice.textContent = price;
        totalQuantity.textContent = quantity;
      });
  }
};

const deleteItem = () => {
  let cart = getLocalStorage();

  for (let info of cart) {
    fetch(ApiURL + info.id).then((res) =>
      res.json().then((data) => {
        document.querySelectorAll('.deleteItem').forEach((deleteButton) => {
          deleteButton.addEventListener('click', () => {
            let article = deleteButton.closest('article');

            cart = cart.filter(
              (product) =>
                product.id !== article.id ||
                product.color !== article.getAttribute('color')
            );

            localStorage.setItem('panier', JSON.stringify(cart));
            location.reload();
          });
        });
      })
    );
  }
};

const validateForm = () => {
  let firstName = document.getElementById('firstName');
  let lastName = document.getElementById('lastName');
  let address = document.getElementById('address');
  let city = document.getElementById('city');
  let email = document.getElementById('email');

  const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
  const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
  const addressErrorMsg = document.getElementById('addressErrorMsg');
  const cityErrorMsg = document.getElementById('cityErrorMsg');
  const emailErrorMsg = document.getElementById('emailErrorMsg');

  const regex = /^[a-zA-Z]{2,15}$/;
  const regexAdress = /([0-9a-zA-Z,\. ]*)/;
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const orderButton = document.getElementById('order');

  firstName.addEventListener('change', () => {
    if (firstName.value.trim() === '' || !firstName.value.match(regex)) {
      firstName.style.border = '2px solid red';

      firstNameErrorMsg.textContent =
        'Veuillez saisir un prénom valide (entre 2 et 25 caractères)';
    } else {
      firstName.style.border = '2px solid green';

      firstNameErrorMsg.textContent = '';
    }
  });

  lastName.addEventListener('change', () => {
    if (lastName.value.trim() === '' || !lastName.value.match(regex)) {
      lastName.style.border = '2px solid red';

      lastNameErrorMsg.textContent =
        'Veuillez saisir un nom valide (entre 2 et 25 caractères)';
    } else {
      lastName.style.border = '2px solid green';

      lastNameErrorMsg.textContent = '';
    }
  });

  city.addEventListener('change', () => {
    if (city.value.trim() === '' || !city.value.match(regex)) {
      city.style.border = '2px solid red';

      cityErrorMsg.textContent = 'Veuillez saisir une ville valide';
    } else {
      city.style.border = '2px solid green';

      cityErrorMsg.textContent = '';
    }
  });

  address.addEventListener('change', () => {
    if (address.value.trim() === '' || !address.value.match(regexAdress)) {
      address.style.border = '2px solid red';

      addressErrorMsg.textContent =
        'Veuillez saisir une adresse valide (ex: 115 Avenue des Champs-Élysées 75008 Paris)';
    } else {
      address.style.border = '2px solid green';

      addressErrorMsg.textContent = '';
    }
  });

  email.addEventListener('change', () => {
    if (email.value.trim() === '' || !email.value.match(regexEmail)) {
      email.style.border = '2px solid red';

      emailErrorMsg.textContent =
        'Veuillez saisir une adresse mail valide (ex: hello@world.com)';
    } else {
      email.style.border = '2px solid green';

      emailErrorMsg.textContent = '';
    }
  });

  orderButton.addEventListener('click', (e) => {
    e.preventDefault();

    let cart = localStorage.getItem('panier');

    if (cart === '[]') {
      alert('Votre panier est vide');
    } else if (
      firstNameErrorMsg.textContent === '' &&
      firstName.value.trim() !== '' &&
      lastNameErrorMsg.textContent === '' &&
      lastName.value.trim() !== '' &&
      addressErrorMsg.textContent === '' &&
      address.value.trim() !== '' &&
      cityErrorMsg.textContent === '' &&
      city.value.trim() !== '' &&
      emailErrorMsg.textContent === '' &&
      email.value.trim() !== ''
    ) {
      let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      };

      let products = [];

      getLocalStorage().forEach((product) => {
        products.push(product.id);
      });

      let dataOrder = {
        contact,
        products,
      };
    }
  });
};

quantityUpdate();
updateTotalPrice();
deleteItem();
validateForm();
