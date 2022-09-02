var notyf = new Notyf();

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
        document.querySelectorAll('.itemQuantity').forEach((updateQuantiy) => {
          updateQuantiy.addEventListener('change', () => {
            let article = updateQuantiy.closest('article');

            if (updateQuantiy.value > 100 || updateQuantiy.value < 1) {
              notyf.error('La quantitée dois être comprise entre 1 et 100');

              return;
            } else {
              if (
                article.id == info.id &&
                article.getAttribute('color') == info.color
              ) {
                info.quantity = parseInt(updateQuantiy.value);
                updateQuantiy.setAttribute('value', updateQuantiy.value);
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

const deleteItem = () => {};

quantityUpdate();
updateTotalPrice();
