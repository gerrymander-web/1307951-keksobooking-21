'use strict';
// Variables
const DATA_ARRAY_LENGTH = 8;
const DATA_ARRAY = [];
const MAX_PRICE_NIGHT = 1000000;
const MIN_HOUSE_PRICES = [10000, 1000, 5000, 0];
const HOUSE_TYPE = [`Дворец`, `Квартира`, `Дом`, `Бунгало`];
const CHECKIN_CHECKOUT = [`12:00`, `13:00`, `14:00`];
const ROOM_NUMBERS = [100, 2, 3, 1];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const GUESTS_NUMBER = [`не для гостей`, `для 2 гостей`, `для 3 гостей`, `для 1 гостя`];
const PICTURE_SRC = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const PIN_SHIFT_X = 32.5;
const PIN_SHIFT_Y = 22;

let pinTemplate = document.querySelector(`#pin`).content;

// Functions
// Функция генерации случайных данных
let getRandomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Функция заполнения DOM-элементами на основе массива JS-объектов
let getObjectsDataArray = function () {
  for (let i = 0; i < DATA_ARRAY_LENGTH; i++) {
    const card = {
      author: {
        avatar: `img/avatars/user0${i + 1}.png`
      },
      offer: {
        title: `Уютное гнездо №${i + 1}`,
        address: `${getRandomNumber(200, 700)}, ${getRandomNumber(150, 450)}`,
        price: getRandomNumber(MIN_HOUSE_PRICES[i % MIN_HOUSE_PRICES.length], MAX_PRICE_NIGHT),
        type: HOUSE_TYPE[i % HOUSE_TYPE.length],
        rooms: ROOM_NUMBERS[i % ROOM_NUMBERS.length],
        guests: GUESTS_NUMBER[i % GUESTS_NUMBER.length],
        checkin: CHECKIN_CHECKOUT[i % CHECKIN_CHECKOUT.length],
        checkout: CHECKIN_CHECKOUT[i % CHECKIN_CHECKOUT.length],
        features: FEATURES.slice(0, i % FEATURES.length + 1),
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        photos: PICTURE_SRC.slice(0, i % PICTURE_SRC.length + 1)
      },
      location: {
        x: getRandomNumber(0, 1000),
        y: getRandomNumber(130, 630)
      }
    };
    DATA_ARRAY[i] = card;
  }
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

// ---------- Run ------------

getObjectsDataArray();
document.querySelector(`.map`).classList.remove(`map--faded`);
renderPins();
