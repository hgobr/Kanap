function getLocalStorage() {
  const data = localStorage.getItem('panier');

  if (data == null) {
    return [];
  } else {
    return JSON.parse(data);
  }
}

const infoPanier = getLocalStorage();

let h1 = document.querySelector('.cartAndFormContainer > h1');

if (infoPanier == []) {
  console.log(h1);

  h1.textContent = 'test';
}
