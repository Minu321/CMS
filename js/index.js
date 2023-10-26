function showLoadingIndicator() {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block";
  const productList = document.querySelector(".container");
  productList.classList.add("grey-out");
}

function hideLoadingIndicator() {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "none";
  const productList = document.querySelector(".container");
  productList.classList.remove("grey-out");
}

showLoadingIndicator();

import { fetchProducts } from "./api.js";

function displayErrorMessage(message) {
  const errorContainer = document.getElementById("error-container");
  const errorMessage = document.getElementById("error-message");

  errorMessage.textContent = message;
  errorContainer.style.display = "block";
}

function hideErrorMessage() {
  const errorContainer = document.getElementById("error-container");
  errorContainer.style.display = "none";
}

fetchProducts()
  .then((productData) => {
    const imageElement = document.querySelectorAll(".shopitem img#shopimage");
    const titleElement = document.querySelectorAll(".shopitem h2#title");
    const priceElements = document.querySelectorAll(".shopitem p#price");
    const descriptionElement = document.querySelectorAll(
      ".shopitem p#description"
    );

    hideLoadingIndicator();

    productData.forEach((product, index) => {
      const currentImageElement = imageElement[index];
      currentImageElement.src = product.image;
      currentImageElement.alt = `Image showing the game cover for the game $(product.title)`;

      const currentTitleElement = titleElement[index];
      currentTitleElement.textContent = product.title;

      const currentPriceElement = priceElements[index];
      currentPriceElement.textContent = `${product.price}$`;

      const currentDescriptionElement = descriptionElement[index];
      currentDescriptionElement.textContent = product.description;
    });
  })
  .catch((error) => {
    console.error("Error in fetchProducts:", error);
    displayErrorMessage(
      "An error occurred while fetching product data. Please try again later."
    );
  });
