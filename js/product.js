let productId;
let cartUpdated = false;

window.addEventListener("load", () => {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  productId = getProductIdFromUrl();
  const existingItemIndex = existingCart.findIndex(
    (item) => item.productId === productId
  );
  if (existingItemIndex !== -1) {
    cartUpdated = true;
    const addToCartButton = document.getElementById("addToCartButton");
    addToCartButton.textContent = "Go to Cart";
  }
});

function showLoadingIndicator() {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block";
}

function hideLoadingIndicator() {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "none";
}

showLoadingIndicator();

function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
productId = getProductIdFromUrl();

function fetchProductDetails(productId) {
  const apiUrl = `https://api.noroff.dev/api/v1/gamehub/${productId}`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((productData) => {
      return productData;
    })
    .catch((error) => {
      console.error("Error fetching product data", error);
      displayErrorMessage("An error occurred. Please try again later.");
      throw error;
    });
}

function updateProductPage(productData) {
  const titleElement = document.querySelector("h1");
  const imageElement = document.querySelector("img.shopimagebig");
  const descriptionElement = document.querySelector("p#description");
  const releaseElement = document.querySelector("p#release");
  const genreElement = document.querySelector("p#genre");
  const ageElement = document.querySelector("p#age");
  const priceElement = document.querySelector("p#price");

  hideLoadingIndicator();

  titleElement.textContent = productData.title;
  imageElement.src = productData.image;
  imageElement.alt = `Image showing the game cover for the game ${productData.title}`;
  descriptionElement.textContent = productData.description;
  releaseElement.textContent = `Released: ${productData.released}`;
  genreElement.textContent = `Genre: ${productData.genre}`;
  ageElement.textContent = `Age Rating: ${productData.ageRating}`;
  priceElement.textContent = `$ ${productData.price}`;
}

fetchProductDetails(productId)
  .then((productData) => {
    updateProductPage(productData);
  })
  .catch((error) => {
    console.error("Error in fetchProductDetails:", error);
  });

function addToCart(productData) {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItemIndex = existingCart.findIndex(
    (item) => item.productId === productData.id
  );

  if (existingItemIndex !== -1) {
    alert("This item is already in your cart.");
  } else {
    const newItem = {
      productId: productData.id,
      quantity: 1,
      price: productData.price,
      title: productData.title,
      image: productData.image,
    };
    existingCart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    cartUpdated = true;

    const addToCartButton = document.getElementById("addToCartButton");
    addToCartButton.textContent = "Go to Cart";
    addToCartButton.classList.add("green-button");

    alert("Product added to cart");
  }
}

const addToCartButton = document.getElementById("addToCartButton");

addToCartButton.addEventListener("click", () => {
  if (cartUpdated) {
    window.location.href = "cart.html";
  } else {
    fetchProductDetails(productId)
      .then((productData) => {
        addToCart(productData);
      })
      .catch((error) => {
        console.error("Error in fetchProductDetails", error);
      });
  }
});
