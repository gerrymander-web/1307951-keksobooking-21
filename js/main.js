'use strict';
// Variables
const DATA_ARRAY_LENGTH = 8;
const DATA_ARRAY = [];
const MAX_PRICE_NIGHT = 1000000;
const HOUSE_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const CHECKIN_CHECKOUT = [`12:00`, `13:00`, `14:00`];
const ROOM_NUMBERS = [100, 2, 3, 1];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const GUESTS_NUMBER = [`не для гостей`, `для 2 гостей`, `для 3 гостей`, `для 1 гостя`];
const PICTURE_SRC = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const PIN_SHIFT_X = 32;
const PIN_SHIFT_Y = 22;
const PIN_X = Number.parseInt(document.querySelector(`.map__pin--main`).style.left.slice(0, -2), 10);
const PIN_Y = Number.parseInt(document.querySelector(`.map__pin--main`).style.top.slice(0, -2), 10);

let pinTemplate = document.querySelector(`#pin`).content;
let cardTemplate = document.querySelector(`#card`).content;

let activeElements = `.map__filters select, .map__filters input, .ad-form input, .ad-form select, .ad-form textarea, .ad-form button`;
let mapPinMain = document.querySelector(`.map__pin--main`);

let capacity = document.querySelector(`#capacity`);
let roomNumber = document.querySelector(`#room_number`);

// Functions
// Функция генерации случайных данных от min до max
let getRandomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};
// возвращает int on 0 до max
let getRandomInt = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

// Функция заполнения DOM-элементами на основе массива JS-объектов
let getObjectDataArray = function (index) {
  const card = {
    author: {
      avatar: `img/avatars/user0${index + 1}.png`
    },
    offer: {
      title: `Уютное гнездо №${index + 1}`,
      address: `${getRandomNumber(200, 700)}, ${getRandomNumber(150, 450)}`,
      price: getRandomInt(MAX_PRICE_NIGHT),
      rooms: ROOM_NUMBERS[getRandomInt(ROOM_NUMBERS.length - 1)],
      guests: GUESTS_NUMBER[getRandomInt(GUESTS_NUMBER.length - 1)],
      checkin: CHECKIN_CHECKOUT[getRandomInt(CHECKIN_CHECKOUT.length - 1)],
      checkout: CHECKIN_CHECKOUT[getRandomInt(CHECKIN_CHECKOUT.length - 1)],
      features: FEATURES.slice(0, getRandomNumber(1, FEATURES.length)),
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      photos: PICTURE_SRC.slice(0, getRandomNumber(1, PICTURE_SRC.length))
    },
    location: {
      x: getRandomNumber(0, 1000),
      y: getRandomNumber(130, 630)
    }
  };

  switch (HOUSE_TYPE[getRandomInt(HOUSE_TYPE.length - 1)]) {
    case `palace`:
      card.offer.type = `Дворец`;
      break;
    case `flat`:
      card.offer.type = `Квартира`;
      break;
    case `house`:
      card.offer.type = `Дом`;
      break;
    case `bungalow`:
      card.offer.type = `Бунгало`;
      break;
  }

  return card;
};

let getObjectsDataArray = function () {
  for (let i = 0; i < DATA_ARRAY_LENGTH; i++) {
    DATA_ARRAY[i] = getObjectDataArray(i);
  }
  return DATA_ARRAY;
};

let createPinElement = function (pin) {
  let pinElement = pinTemplate.cloneNode(true);
  pinElement.querySelector(`img`).src = pin.src;
  pinElement.querySelector(`img`).alt = pin.alt;
  pinElement.querySelector(`.map__pin`).style = pin.style;
  return pinElement;
};

let renderPins = function () {
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < DATA_ARRAY_LENGTH; i++) {
    const pin = {
      src: DATA_ARRAY[i].author.avatar,
      style: `left: ${DATA_ARRAY[i].location.x + PIN_SHIFT_X}px; top: ${DATA_ARRAY[i].location.y + PIN_SHIFT_Y}px`,
      alt: DATA_ARRAY[i].offer.title
    };
    fragment.appendChild(createPinElement(pin));
  }
  let setPinList = document.querySelector(`.map__pins`);
  setPinList.appendChild(fragment);
};

let createCardElement = function (card) {
  let cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector(`.map__card`).classList.add(`hidden`);
  cardElement.querySelector(`.popup__avatar`).src = card.author.avatar;
  cardElement.querySelector(`.popup__avatar`).alt = card.offer.title;
  cardElement.querySelector(`.popup__title`).textContent = card.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = card.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${card.offer.price}Р`; // &#x20bd;
  cardElement.querySelector(`.popup__text--price`).appendChild(document.createElement(`span`)).textContent = `\/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = card.offer.type;
  cardElement.querySelector(`.popup__text--capacity`).textContent = (card.offer.rooms === 1) ? `1 комната для 1 гостя` : `${card.offer.rooms} комнат для ${card.offer.guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `заезд после ${card.offer.checkin}, выезд до ${card.offer.checkout}`;

  let featuresList = cardElement.querySelectorAll(`.popup__feature`);

  featuresList.forEach((e) => e.classList.add(`hidden`));

  for (let i = 0; i < card.offer.features.length; i++) {
    for (let j = 0; j < featuresList.length; j++) {
      if (featuresList[j].className.includes(card.offer.features[i])) {
        featuresList[j].classList.remove(`hidden`);
      }
    }
  }

  cardElement.querySelector(`.popup__description`).textContent = card.offer.description;

  for (let i = 0; i < card.offer.photos.length; i++) {
    if (i > 0) {
      let newImage = document.createElement(`img`);
      newImage.classList.add(`popup__photo`);
      newImage.width = 45;
      newImage.height = 40;
      newImage.alt = `Фотография жилья`;
      newImage.src = card.offer.photos[i];
      cardElement.querySelector(`.popup__photos`).appendChild(newImage);
    } else {
      cardElement.querySelector(`.popup__photo`).src = card.offer.photos[i];
    }
  }
  return cardElement;
};

let renderCard = function () {
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < DATA_ARRAY_LENGTH; i++) {
    fragment.appendChild(createCardElement(DATA_ARRAY[i]));
  }
  let setCardsList = document.querySelector(`.map`);
  let insertBeforeElement = document.querySelector(`.map__filters-container`);

  setCardsList.insertBefore(fragment, insertBeforeElement);
};

let toggleActiveElements = function (selectingElements, condition) {

  let elementsArray = document.querySelectorAll(selectingElements);

  if (condition) {
    elementsArray.forEach((element) => {
      element.setAttribute(`disabled`, `disabled`);
    });
  } else {
    elementsArray.forEach((element) => {
      element.removeAttribute(`disabled`, `disabled`);
    });
  }
};

let enableElementsListener = function (evt) {
  if (evt.button === 0 || evt.key === `Enter`) {
    toggleActiveElements(activeElements, false);
  }
};

let setAddress = function (x, y) {
  document.querySelector(`#address`).value = `${x}, ${y}`;
};

let activateFormScreen = function (evt) {
  enableElementsListener(evt);
  setAddress(PIN_X + PIN_SHIFT_X, PIN_Y + PIN_SHIFT_Y);
};

let checkValidCapacity = function () {
  if (roomNumber.value !== `100` && capacity.value === `0`) {
    capacity.setCustomValidity(`Жаль, что вы не приедете ;-D`);
  } else if (roomNumber.value === `100` && capacity.value !== `0`) {
    capacity.setCustomValidity(`Ваш тип жилья не для гостей`);
  } else if (parseInt(capacity.value, 10) > parseInt(roomNumber.value, 10)) {
    capacity.setCustomValidity(`Число гостей не должно превышать количество комнат`);
  } else {
    capacity.setCustomValidity(``);
  }
  capacity.reportValidity();
};

// let onPopupClose = function (evt) {
//   if (evt.key === `Escape` || evt.type === `click`) {
//     evt.preventDefault();
//     popupClose(this);
//   }
// };

// let onPopupEscapePress = function (evt, obj) {

// };

// let popupClose = function (popupButtonClose) {
//   popupButtonClose.parentElement.classList.add(`hidden`);
// };
// ---------- Run ------------
document.querySelector(`.map`).classList.remove(`map--faded`);

getObjectsDataArray();
renderPins();
// ------------------------------


toggleActiveElements(activeElements, true);
document.querySelector(`#address`).setAttribute(`placeholder`, `${PIN_X}, ${PIN_Y}`);

mapPinMain.addEventListener(`mousedown`, activateFormScreen, true);
mapPinMain.addEventListener(`keydown`, activateFormScreen, true);

// check room number

capacity.addEventListener(`change`, checkValidCapacity, false);

renderCard();

// let listOfPins = document.querySelectorAll(`.map__pin:not(.map__pin--main)`);
// let listOfCards = document.querySelectorAll(`.map__card`);

// for (let i = 0; i < listOfPins.length; i++) {
//   listOfPins[i].addEventListener(`click`, function () {

//     for (let j = 0; j < listOfCards.length; j++) {
//       if (j !== i) {
//         listOfCards[j].classList.add(`hidden`);
//         listOfCards[j].querySelector(`.popup__close`).removeEventListener(`click`, onPopupClose);
//         listOfCards[j].querySelector(`.popup__close`).removeEventListener(`keydown`, onPopupClose);
//       } else {
//         listOfCards[j].classList.remove(`hidden`);
//         listOfCards[j].querySelector(`.popup__close`).addEventListener(`click`, onPopupClose);
//         listOfCards[j].querySelector(`.popup__close`).addEventListener(`keydown`, onPopupClose);
//       }
//     }
//   }, false);
// };
