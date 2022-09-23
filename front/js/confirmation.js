const orderId = new URL(window.location.href).searchParams.get('orderId');

const order = document.getElementById('orderId');

order.innerText = orderId;
