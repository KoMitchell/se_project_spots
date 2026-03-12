import "./index.css";
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";

// Initial cards
const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// Profile
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// Edit Profile Modal
const editProfileButtonEl = document.querySelector(
  ".profile__edit-profile-button",
);
const editProfileModalEl = document.querySelector("#edit-profile-modal");
const editProfileCloseBtnEl = editProfileModalEl.querySelector(
  ".modal__close-button",
);
const editProfileFormEl = editProfileModalEl.querySelector(".modal__form");
const editProfileNameInputEl = editProfileModalEl.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInputEl = editProfileModalEl.querySelector(
  "#profile-description-input",
);

// New Post Modal
const newPostButtonEl = document.querySelector(".profile__new-post-button");
const newPostModalEl = document.querySelector("#new-post-modal");
const newPostCloseBtnEl = newPostModalEl.querySelector(".modal__close-button");
const newPostFormEl = newPostModalEl.querySelector(".modal__form");
const newPostImageInputEl = newPostModalEl.querySelector("#card-image-input");
const newPostCaptionInputEl = newPostModalEl.querySelector(
  "#image-caption-input",
);

// Preview Image Modal
const previewModalEl = document.querySelector("#preview-modal");
const previewModalImageEl = previewModalEl.querySelector(".modal__image");
const previewModalCaptionEl = previewModalEl.querySelector(".modal__caption");
const previewModalCloseBtnEl = previewModalEl.querySelector(
  ".modal__close-button",
);

// Cards
const cardsListEl = document.querySelector(".cards__list");
const cardTemplateEl = document
  .querySelector("#card-template")
  .content.querySelector(".card");

// Create card element
function getCardElement(data) {
  const cardElement = cardTemplateEl.cloneNode(true);

  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  const cardDeleteButtonEl = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Open preview modal
  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModalEl);
  });

  // Like toggle
  cardLikeButtonEl.addEventListener("click", () => {
    cardLikeButtonEl.classList.toggle("card__like-button_active");
  });

  // Delete card
  cardDeleteButtonEl.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

//Modal Helpers (Corrected)

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

// Overlay click-to-close
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

//Edit Profile Modal

editProfileButtonEl.addEventListener("click", () => {
  editProfileNameInputEl.value = profileNameEl.textContent;
  editProfileDescriptionInputEl.value = profileDescriptionEl.textContent;

  resetValidation(editProfileFormEl, settings);
  openModal(editProfileModalEl);
});

editProfileCloseBtnEl.addEventListener("click", () => {
  closeModal(editProfileModalEl);
});

editProfileFormEl.addEventListener("submit", (evt) => {
  evt.preventDefault();

  profileNameEl.textContent = editProfileNameInputEl.value;
  profileDescriptionEl.textContent = editProfileDescriptionInputEl.value;

  closeModal(editProfileModalEl);
});

//New Post Modal

newPostButtonEl.addEventListener("click", () => {
  resetValidation(newPostFormEl, settings);
  openModal(newPostModalEl);
});

newPostCloseBtnEl.addEventListener("click", () => {
  closeModal(newPostModalEl);
});

newPostFormEl.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const inputValues = {
    name: newPostCaptionInputEl.value,
    link: newPostImageInputEl.value,
  };

  const newCard = getCardElement(inputValues);
  cardsListEl.prepend(newCard);

  newPostFormEl.reset();
  resetValidation(newPostFormEl, settings);
  closeModal(newPostModalEl);
});

// Preview Modal

previewModalCloseBtnEl.addEventListener("click", () => {
  closeModal(previewModalEl);
});

//Initial Render

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsListEl.append(cardElement);
});

enableValidation(settings);
