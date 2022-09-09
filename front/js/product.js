let notyf = new Notyf();

const url = window.location.href;

const productId = new URL(url).searchParams.get('id');

const addProductButton = document.getElementById('addToCart');
const itemsQuantity = document.getElementById('quantity');
const selectColor = document.getElementById('colors');

fetch('http://localhost:3000/api/products/' + productId).then((res) =>
  res.json().then((data) => {
    const img = document.createElement('img');

    img.setAttribute('src', data.imageUrl);
    img.setAttribute('alt', data.altTxt);

    document.querySelector('.item__img').appendChild(img);
    document.getElementById('title').innerHTML = data.name;
    document.getElementById('price').innerHTML = data.price;
    document.getElementById('description').innerHTML = data.description;

    const productColors = data.colors;

    for (color of productColors) {
      const option = document.createElement('option');

      option.setAttribute('value', color);
      option.innerHTML = color;
      selectColor.appendChild(option);
    }

    function getLocalStorage() {
      const data = localStorage.getItem('panier');

      if (data == null) {
        return [];
      } else {
        return JSON.parse(data);
      }
    }

    const addItem = () => {
      let dataPanier = getLocalStorage();

      let product = new Object();

      const quantity = parseInt(itemsQuantity.value);

      product.quantity = quantity;
      product.id = productId;
      product.color = selectColor.value;

      let sameProduct = false;

      if (selectColor.value == '') {
        notyf.error('Vous devez mettre une couleur');
      } else {
        if (quantity <= 0 || quantity > 100) {
          notyf.error('La quantitée dois etre comprise entre 1 et 100');
        } else {
          for (let data of dataPanier) {
            if (product.id == data.id && product.color == data.color) {
              data.quantity += product.quantity;
              sameProduct = true;
              break;
            }
          }

          if (sameProduct == false) {
            dataPanier.push(product);
          }

          localStorage.setItem('panier', JSON.stringify(dataPanier));
          notyf.success('Le produit a bien été ajouté au panier');
        }
      }
    };

    addProductButton.addEventListener('click', () => {
      addItem();
    });
  })
);
