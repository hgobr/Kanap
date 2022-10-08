const APIproduct = 'http://localhost:3000/api/products/';

const items = document.getElementById('items');

fetch(APIproduct).then((res) =>
  res
    .json()
    .then((data) => {
      for (kanap of data) {
        const link = document.createElement('a');
        link.setAttribute('href', 'product.html?id=' + kanap._id);

        const article = document.createElement('article');

        const img = document.createElement('img');
        img.setAttribute('src', kanap.imageUrl);
        img.setAttribute('alt', kanap.altTxt);

        const h3 = document.createElement('h3');
        h3.setAttribute('class', 'productName');
        h3.innerText = kanap.name;

        const p = document.createElement('p');
        p.setAttribute('class', 'productDescription');
        p.innerText = kanap.description;

        article.appendChild(img);
        article.appendChild(h3);
        article.appendChild(p);
        link.appendChild(article);
        items.appendChild(link);
      }
    })
    .catch((err) => console.log('Erreur:' + err))
);
