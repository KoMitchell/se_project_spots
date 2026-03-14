import "./index.css";
import Api from "../utils/Api.js";

// API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "d21d6e35-807e-4429-b2ee-c827b486a154",
    "Content-Type": "application/json",
  },
});

// DOM ELEMENTS
const cardsListEl = document.querySelector(".cards__list");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const editProfileButton = document.querySelector(
  ".profile__edit-profile-button",
);
const newPostButton = document.querySelector(".profile__new-post-button");
const avatarEditButton = document.querySelector(".profile__avatar-edit-button");

const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const avatarModal = document.querySelector("#edit-avatar-modal");
const deleteModal = document.querySelector("#delete-card-modal");
const previewModal = document.querySelector("#preview-modal");

const editProfileForm = document.forms["edit-profile"];
const newPostForm = document.forms["new-post"];
const avatarForm = document.forms["edit-avatar"];
const deleteForm = document.forms["delete-card"];

const nameInput = document.querySelector("#profile-name-input");
const descriptionInput = document.querySelector("#profile-description-input");

const cardLinkInput = document.querySelector("#card-image-input");
const cardTitleInput = document.querySelector("#image-caption-input");

const avatarInput = document.querySelector("#profile-avatar-input");

const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const modals = document.querySelectorAll(".modal");

// SELECTED CARD FOR DELETE
let selectedCard = null;
let selectedCardId = null;

// MODAL FUNCTIONS
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  if (!document.querySelector(".modal.modal_is-opened")) {
    document.removeEventListener("keydown", handleEscape);
  }
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal.modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

modals.forEach((modal) => {
  const closeButton = modal.querySelector(".modal__close-button");

  if (closeButton) {
    closeButton.addEventListener("click", () => closeModal(modal));
  }

  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

// PROFILE HELPERS
function setProfileData(userData) {
  profileNameEl.textContent = userData.name;
  profileDescriptionEl.textContent = userData.about;
  profileAvatarEl.src = userData.avatar;
}

// PREVIEW
function handleImageClick(data) {
  previewImageEl.src = data.link;
  previewImageEl.alt = data.name;
  previewCaptionEl.textContent = data.name;
  openModal(previewModal);
}

// CARD FUNCTIONS
function getCardElement(data) {
  const cardTemplate = document
    .querySelector("#card-template")
    .content.querySelector(".card");

  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  if (data.isLiked) {
    likeButton.classList.add("card__like-button_active");
  }

  cardImage.addEventListener("click", () => {
    handleImageClick(data);
  });

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_active");

    const likeRequest = isLiked
      ? api.unlikeCard(data._id)
      : api.likeCard(data._id);

    likeRequest
      .then((updatedCard) => {
        if (updatedCard.isLiked) {
          likeButton.classList.add("card__like-button_active");
        } else {
          likeButton.classList.remove("card__like-button_active");
        }
      })
      .catch(console.error);
  });

  deleteButton.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  return cardElement;
}

function renderCard(data, method = "append") {
  const cardElement = getCardElement(data);
  cardsListEl[method](cardElement);
}

// FORM HANDLERS
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .editUserInfo({
      name: nameInput.value,
      about: descriptionInput.value,
    })
    .then((userData) => {
      setProfileData(userData);
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .addCard({
      name: cardTitleInput.value,
      link: cardLinkInput.value,
    })
    .then((cardData) => {
      renderCard(cardData, "prepend");
      newPostForm.reset();
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Saving...";

  api
    .updateAvatar({
      avatar: avatarInput.value,
    })
    .then((userData) => {
      profileAvatarEl.src = userData.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// OPEN MODALS
editProfileButton.addEventListener("click", () => {
  nameInput.value = profileNameEl.textContent;
  descriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

newPostButton.addEventListener("click", () => {
  newPostForm.reset();
  openModal(newPostModal);
});

avatarEditButton.addEventListener("click", () => {
  avatarForm.reset();
  openModal(avatarModal);
});

// FORM EVENTS
editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

// INITIAL LOAD
api
  .getAppInfo()
  .then(([userData, cards]) => {
    setProfileData(userData);

    cards.forEach((card) => {
      renderCard(card);
    });
  })
  .catch(console.error);
