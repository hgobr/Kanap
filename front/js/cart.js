function getLocalStorage() {
  const data = localStorage.getItem('panier');

  if (data == null) {
    return [];
  } else {
    return JSON.parse(data);
  }
}

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
  fetch('http://localhost:3000/api/products/' + data.id)
    .then((res) => res.json())
    .then((product) => {
      let dom = `<article class="cart__item" data-id="${data.id}" data-color="${data.color}">
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
