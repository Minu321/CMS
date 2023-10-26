function fetchProductDetails(productId) {
  const apiUrl = `https://gamehub.geekie.no/wp-json/wc/store/products/${productId}`;

  return fetch(apiUrl, {
    method: "GET",
  })
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
      console.error("Error fetching product details:", error);
      throw error;
    });
}

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
      price: parseFloat(productData.prices.price) / 100,
      title: productData.name,
      image: productData.images[0].src,
    };
    existingCart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    alert("Product added to cart");
  }
}

function displayProductDetails(product) {
  const titleElement = document.querySelector("h1");
  const imageElement = document.querySelector(".shopimagebig");
  const descriptionElement = document.getElementById("description");
  const releaseElement = document.getElementById("release");
  const genreElement = document.getElementById("genre");
  const ageElement = document.getElementById("age");
  const priceElement = document.getElementById("price");
  const addToCartButton = document.getElementById("addToCartButton");

  titleElement.textContent = product.name;
  imageElement.src = product.images[0].src;
  imageElement.alt = `Image showing the game cover for the game ${product.name}`;
  descriptionElement.textContent = product.description.replace(/<\/?p>/g, "");
  releaseElement.textContent = `Released: ${product.attributes[2].terms[0].name}`;
  genreElement.textContent = `Genre: ${product.attributes[1].terms[0].name}`;
  ageElement.textContent = `Age Rating: ${product.attributes[0].terms[0].name}`;
  priceElement.textContent =
    (parseFloat(product.prices.price) / 100).toFixed(2) +
    ` ${product.prices.currency_symbol}`;

  addToCartButton.addEventListener("click", () => {
    addToCart(product);
  });
}

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (productId) {
  fetchProductDetails(productId)
    .then((productData) => {
      displayProductDetails(productData);
    })
    .catch((error) => {
      console.error("Error in fetchProductDetails:", error);
    });
} else {
  console.error("Product ID not found in URL");
}
