document.addEventListener("DOMContentLoaded", () => {
  const sumbtn = document.getElementById("sumbtn");
  const inputname = document.getElementById("inputname");
  const inputurl = document.getElementById("inputurl");
  const tbody = document.getElementById("tbody");
  const overlay = document.querySelector(".overlay");
  const closebtn = document.querySelector(".close-icon i");

  let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

  const saveToLocalStorage = () => {
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
  };

  const renderTable = () => {
    tbody.innerHTML = allProducts
      .map(
        (product, index) =>
          `<tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>
          <button class="btn btn-success" onclick="window.open('${
            product.url
          }', '_blank')">
            <i class="fa-solid fa-eye"></i> Visit
          </button>
        </td>
        <td>
          <button class="btn btn-danger" onclick="deleteProduct(${index})">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>
      </tr>`
      )
      .join("");
  };

  const addProduct = () => {
    const name = inputname.value.trim();
    const url = inputurl.value.trim();

    if (!isValidName(name) || !isValidURL(url)) {
      showError();
      return;
    }

    allProducts.push({ name, url });
    saveToLocalStorage();
    renderTable();
    clearInputs();
  };

  const deleteProduct = (index) => {
    allProducts.splice(index, 1);
    saveToLocalStorage();
    renderTable();
  };

  const isValidName = (name) => /^[A-Z][a-zA-Z\s]{2,50}$/.test(name);
  const isValidURL = (url) =>
    /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(url);

  const showError = () => {
    inputname.classList.add("is-invalid");
    inputurl.classList.add("is-invalid");
    overlay.classList.add("appear");
    document.body.style.overflow = "hidden"; // Prevent scrolling
    document.body.classList.add("overlay-active"); // Add overlay-active class
  };

  const clearInputs = () => {
    inputname.value = "";
    inputurl.value = "";
    inputname.classList.remove("is-invalid", "is-valid");
    inputurl.classList.remove("is-invalid", "is-valid");
  };

  const closeOverlay = () => {
    overlay.classList.remove("appear");
    document.body.style.overflow = "auto"; // Restore scrolling
    document.body.classList.remove("overlay-active"); // Remove overlay-active class
  };

  const validateInput = (input, validator) => {
    const value = input.value.trim();
    if (validator(value)) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  };

  // Validate inputs in real-time as the user types
  inputname.addEventListener("input", () =>
    validateInput(inputname, isValidName)
  );
  inputurl.addEventListener("input", () => validateInput(inputurl, isValidURL));

  sumbtn.addEventListener("click", addProduct);
  closebtn.addEventListener("click", closeOverlay);

  renderTable();

  // Expose deleteProduct globally for inline onclick handlers
  window.deleteProduct = deleteProduct;
});
