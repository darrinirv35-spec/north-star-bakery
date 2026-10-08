const products = [
  { id: "signature-loaf", name: "Signature Loaf", category: "Breads", price: "$6–$9" },
  { id: "country-sourdough", name: "Country Sourdough", category: "Breads", price: "$7–$10" },
  { id: "butter-croissant", name: "Butter Croissant", category: "Pastries", price: "$3–$5" },
  { id: "seasonal-danish", name: "Seasonal Danish", category: "Pastries", price: "$4–$6" },
  { id: "celebration-cake", name: "Celebration Cake", category: "Cakes", price: "$35–$65" },
  { id: "event-cake", name: "Small Event Cake", category: "Cakes", price: "$25–$45" }
];

const categories = {
  Breads: "Fresh loaves for breakfast, sandwiches, and family meals.",
  Pastries: "Flaky, buttery treats made for mornings and gatherings.",
  Cakes: "Celebration options for birthdays and special events."
};

const FAVORITE_KEY = "northStarBakeryFavorite";

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function saveFavorite(productId) {
  localStorage.setItem(FAVORITE_KEY, productId);
}

function loadFavorite() {
  return localStorage.getItem(FAVORITE_KEY);
}

function updateFavoritePanel(productId) {
  const message = document.querySelector("#favorite-message");
  const count = document.querySelector("#favorite-count");
  if (!message) return;

  const product = getProduct(productId);
  if (product) {
    message.textContent = `Your favorite is ${product.name} (${product.category}, ${product.price}).`;
    count.textContent = "1 favorite saved";
  } else {
    message.textContent = "Choose a bakery item to save as your favorite.";
    count.textContent = "No favorite saved yet";
  }
}

function updateFavoriteButtons(productId) {
  document.querySelectorAll(".favorite-button").forEach((button) => {
    const isFavorite = button.dataset.productId === productId;
    button.classList.toggle("is-favorite", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
    button.textContent = isFavorite ? "★ Favorite saved" : "☆ Save as favorite";
  });
}

function handleFavoriteClick(event) {
  const productId = event.currentTarget.dataset.productId;
  const currentFavorite = loadFavorite();
  const nextFavorite = currentFavorite === productId ? null : productId;

  if (nextFavorite) saveFavorite(nextFavorite);
  else localStorage.removeItem(FAVORITE_KEY);

  updateFavoritePanel(nextFavorite);
  updateFavoriteButtons(nextFavorite);
}

function initializeFavorites() {
  const buttons = document.querySelectorAll(".favorite-button");
  if (!buttons.length) return;

  buttons.forEach((button) => button.addEventListener("click", handleFavoriteClick));
  const savedFavorite = loadFavorite();
  updateFavoritePanel(savedFavorite);
  updateFavoriteButtons(savedFavorite);
}

function showFieldError(input, message) {
  const error = document.querySelector(`#${input.id}-error`);
  input.classList.add("invalid");
  input.setAttribute("aria-invalid", "true");
  if (error) error.textContent = message;
}

function clearFieldError(input) {
  const error = document.querySelector(`#${input.id}-error`);
  input.classList.remove("invalid");
  input.removeAttribute("aria-invalid");
  if (error) error.textContent = "";
}

function validateRequired(input, label) {
  if (!input.value.trim()) {
    showFieldError(input, `${label} is required.`);
    return false;
  }
  clearFieldError(input);
  return true;
}

function validateEmail(input) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(input.value.trim())) {
    showFieldError(input, "Enter a valid email address.");
    return false;
  }
  clearFieldError(input);
  return true;
}

function validateMinimumLength(input, minimum) {
  if (input.value.trim().length < minimum) {
    showFieldError(input, `Please enter at least ${minimum} characters.`);
    return false;
  }
  clearFieldError(input);
  return true;
}

function validateDate(input) {
  const today = new Date().toISOString().split("T")[0];
  if (!input.value) {
    showFieldError(input, "Pickup date is required.");
    return false;
  }
  if (input.value < today) {
    showFieldError(input, "Pickup date cannot be in the past.");
    return false;
  }
  clearFieldError(input);
  return true;
}

function validateForm(form) {
  const name = document.querySelector("#name");
  const email = document.querySelector("#email");
  const pickupDate = document.querySelector("#pickup-date");
  const details = document.querySelector("#details");

  const validName = validateRequired(name, "Name");
  const validEmail = validateEmail(email);
  const validDate = validateDate(pickupDate);
  const validDetails = validateMinimumLength(details, 10);

  if (!validName) name.focus();
  else if (!validEmail) email.focus();
  else if (!validDate) pickupDate.focus();
  else if (!validDetails) details.focus();

  return validName && validEmail && validDate && validDetails;
}

function initializeFormValidation() {
  const form = document.querySelector("#preorder-form");
  if (!form) return;

  const fields = ["name", "email", "pickup-date", "details"];
  fields.forEach((id) => {
    const input = document.querySelector(`#${id}`);
    input.addEventListener("input", () => {
      if (id === "name") validateRequired(input, "Name");
      if (id === "email") validateEmail(input);
      if (id === "pickup-date") validateDate(input);
      if (id === "details") validateMinimumLength(input, 10);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    if (!validateForm(form)) {
      status.textContent = "Please correct the highlighted fields before submitting your inquiry.";
      status.classList.remove("success");
      return;
    }

    status.textContent = "Your inquiry is ready to send. Thank you for contacting North Star Bakery!";
    status.classList.add("success");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeFavorites();
  initializeFormValidation();
});
