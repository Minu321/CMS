function fetchProducts() {
  const apiUrl = "https://gamehub.geekie.no/wp-json/wc/store/products/";

  return fetch(apiUrl, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .then((data) => {
      console.log(data);

      return data;
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
      throw error;
    });
}

export { fetchProducts };
