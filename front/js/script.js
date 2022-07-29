const APIproduct = 'http://localhost:3000/api/products/';

const items = document.getElementById('items');

let aProduct;

fetch(APIproduct).then((res) =>
  res
    .json()
    .then((data) => {
      for (kanap of data) {
        aProduct = document.createElement('a');
        aProduct.href = './product.html?id=' + kanap._id;
        let dataKanap = `<article>
        <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
        <h3 class="productName">${kanap.name}</h3>
        <p class="productDescription">${kanap.description}</p>
      </article>`;

        aProduct.innerHTML = dataKanap;
        items.appendChild(aProduct);
      }
    })
    .catch((err) => console.log('Erreur:' + err))
);
