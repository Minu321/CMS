console.log(8);
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  var removeCartItemButtons = document.getElementsByClassName("cartremove");
  console.log(removeCartItemButtons);
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  var cartItem = buttonClicked.parentElement.parentElement;
  var productId = cartItem.dataset.productId;

  cartItem.remove();
  updateCartTotal();

  var existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  var existingItemIndex = existingCart.findIndex(function (item) {
    return item.productId === productId;
  });

  if (existingItemIndex !== -1) {
    existingCart.splice(existingItemIndex, 1);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    if (document.querySelectorAll(".cart-row").length === 0) {
      cartUpdated = false;
      const addToCartButton = document.getElementById("addToCartButton");
      addToCartButton.textContent = "Add to Cart";
    }
  }
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
}
populateCartFromLocalStorage();
function populateCartFromLocalStorage() {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemContainer = document.querySelector(".cart-items");
  let total = 0;

  cartItemContainer.innerHTML = "";

  existingCart.forEach((item) => {
    const cartRow = document.createElement("div");
    cartRow.classList.add("cart-row");
    cartRow.dataset.productId = item.productId;

    const cartContent = `
      <div class="cart-item cart-column">
        <img class="cart-item-image" src="${
          item.image
        }" width="100" height="100" />
        <span class="cart-item-title">${item.title}</span>
      </div>
      <span class="cart-price cart-column">$${item.price.toFixed(2)}</span>
      <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="${
          item.quantity
        }" />
        <button class="cartremove" type="button">REMOVE</button>
      </div>
    `;

    cartRow.innerHTML = cartContent;
    cartItemContainer.appendChild(cartRow);

    total += item.price * item.quantity;

    const removeButton = cartRow.querySelector(".cartremove");
    removeButton.addEventListener("click", removeCartItem);

    const quantityInput = cartRow.querySelector(".cart-quantity-input");
    quantityInput.addEventListener("change", quantityChanged);
  });

  const cartTotalPrice = document.querySelector(".cart-total-price");
  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  if (existingCart.length === 0) {
    cartItemContainer.innerHTML = "<p>Cart is empty</p>";
    cartTotalPrice.style.display = "none";
  } else {
    cartTotalPrice.style.display = "block";
  }
}

populateCartFromLocalStorage();
