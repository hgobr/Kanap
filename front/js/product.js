const url = window.location.href;

const productId = new URL(url).searchParams.get('id');

fetch('http://localhost:3000/api/products/' + productId).then((res) =>
  res.json().then((data) => {
    // console.log(data.colors);

    const img = document.createElement('img');
    img.setAttribute('src', data.imageUrl);
    img.setAttribute('alt', data.altTxt);
    document.querySelector('.item__img').appendChild(img);

    document.getElementById('title').innerHTML = data.name;

    document.getElementById('price').innerHTML = data.price;

    document.getElementById('description').innerHTML = data.description;

    const selectColor = document.getElementById('colors');

    const productColors = data.colors;

    for (color of productColors) {
      const option = document.createElement('option');

      option.setAttribute('value', color);

      option.innerHTML = color;

      selectColor.appendChild(option);
    }
  })
);
