var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _numbers, _lotto, _bonusNumber;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const parsePrice = (priceInput) => {
  return Number(priceInput);
};
const parseWinningNumber = (winningNumberInput) => {
  return winningNumberInput.map(Number);
};
const parseBonusNumber = (bonusNumberInput) => {
  return Number(bonusNumberInput);
};
const LOTTO_NUMBERS = {
  LENGTH: 6,
  MIN: 1,
  MAX: 45
};
const LOTTO_PRICE = 1e3;
const LOTTO_PRIZE = {
  3: 5e3,
  4: 5e4,
  5: 15e5,
  6: 2e9,
  bonus: 3e7
};
const LOTTO_MATCH_CRITERIA = {
  MIN_MATCH_COUNT: 3,
  BONUS_MATCH_COUNT: 5
};
const LOTTO_NUMBERS_ERROR_MESSAGE = {
  EMPTY: "로또 번호를 입력해주세요",
  EMPTY_ITEM: "로또 번호에 빈 값이 포함되어 있습니다. 다시 입력해주세요",
  LENGTH: `로또 번호는 ${LOTTO_NUMBERS.LENGTH}개 여야합니다. 다시 입력해 주세요.`,
  RANGE: `로또 번호는 ${LOTTO_NUMBERS.MIN}부터 ${LOTTO_NUMBERS.MAX}사이의 숫자여야 합니다. 다시 입력해 주세요.`,
  DUPLICATE: "로또 번호가 중복됐습니다. 다시 입력해 주세요.",
  NUMBER: "정수만 입력할 수 있습니다. 다시 입력해 주세요."
};
const BONUS_NUMBER_ERROR_MESSAGE = {
  EMPTY: "보너스 번호를 입력해주세요.",
  NUMBER: "정수를 입력해주세요.",
  RANGE: `보너스 번호는 ${LOTTO_NUMBERS.MIN}부터 ${LOTTO_NUMBERS.MAX}사이의 숫자여야 합니다. 다시 입력해 주세요.`,
  DUPLICATE: "보너스 번호가 당첨 번호와 중복됩니다. 다시 입력해주세요."
};
const PRICE_ERROR_MESSAGE = {
  EMPTY: "구입 금액을 입력해주세요.",
  NUMBER: "정수를 입력해주세요.",
  UNDER_PRICE: `${LOTTO_PRICE}원보다 큰 수를 입력해주세요`,
  INDIVISIBLE: `구입 금액은 ${LOTTO_PRICE}원 단위여야 합니다.`
};
const validationCondition = {
  isInteger(input) {
    return Number.isInteger(Number(input));
  },
  isEmpty(input) {
    return input === "" || input.length === 0;
  },
  isUnder(input) {
    return Number(input) < LOTTO_PRICE;
  },
  isDivisible(input) {
    return Number(input) % LOTTO_PRICE === 0;
  },
  isLengthValid(numbers) {
    return numbers.length === LOTTO_NUMBERS.LENGTH;
  },
  isRangeValid(numbers) {
    return !numbers.some((number) => number < LOTTO_NUMBERS.MIN || number > LOTTO_NUMBERS.MAX);
  },
  isDistinct(numbers) {
    return new Set(numbers).size === numbers.length;
  },
  isBonusDistinct(numbers, bonusNumber) {
    return (/* @__PURE__ */ new Set([...numbers, Number(bonusNumber)])).size !== numbers.length;
  },
  isBonusRangeValid(bonusNumber) {
    return Number(bonusNumber) <= LOTTO_NUMBERS.MAX && Number(bonusNumber) >= LOTTO_NUMBERS.MIN;
  }
};
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _numbers);
    if (!validationCondition.isLengthValid(numbers)) {
      throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.LENGTH);
    }
    if (!validationCondition.isRangeValid(numbers)) {
      throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.RANGE);
    }
    if (!validationCondition.isDistinct(numbers)) {
      throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.DUPLICATE);
    }
    __privateSet(this, _numbers, numbers.sort((a, b) => a - b));
  }
  toString() {
    return String(__privateGet(this, _numbers));
  }
  has(number) {
    return __privateGet(this, _numbers).includes(number);
  }
  match(lotto) {
    return __privateGet(this, _numbers).filter((number) => lotto.has(number));
  }
}
_numbers = new WeakMap();
const randomNumberGenerator = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const pickUniqueNumbersInRange = (min, max, count) => {
  const uniqueNumbers = /* @__PURE__ */ new Set();
  while (uniqueNumbers.size < count) {
    uniqueNumbers.add(randomNumberGenerator(min, max));
  }
  return [...uniqueNumbers];
};
const getLottoCount = (price) => {
  return price / LOTTO_PRICE;
};
const getLottoArray = (count) => Array.from({ length: count }, () => new Lotto(pickUniqueNumbersInRange(LOTTO_NUMBERS.MIN, LOTTO_NUMBERS.MAX, LOTTO_NUMBERS.LENGTH)));
const purchaseLottos = (price) => {
  const lottoCount = getLottoCount(price);
  const lottoArray = getLottoArray(lottoCount);
  return { lottoArray, lottoCount };
};
const runValidators = (validators, input) => validators.forEach((validate) => validate(input));
const checkEmptyInput = (input, errorMessage) => {
  if (validationCondition.isEmpty(input)) {
    throw new Error(errorMessage);
  }
};
const checkEmpty$2 = (priceInput) => checkEmptyInput(priceInput, PRICE_ERROR_MESSAGE.EMPTY);
const checkIsInteger$2 = (priceInput) => {
  if (!validationCondition.isInteger(priceInput)) {
    throw new Error(PRICE_ERROR_MESSAGE.NUMBER);
  }
};
const checkUnderPrice = (priceInput) => {
  if (validationCondition.isUnder(priceInput)) {
    throw new Error(PRICE_ERROR_MESSAGE.UNDER_PRICE);
  }
};
const checkDivisiblePrice = (priceInput) => {
  if (!validationCondition.isDivisible(priceInput)) {
    throw new Error(PRICE_ERROR_MESSAGE.INDIVISIBLE);
  }
};
const validatePrice = (priceInput) => runValidators([checkEmpty$2, checkIsInteger$2, checkUnderPrice, checkDivisiblePrice], priceInput);
const resetError = (errorElement) => {
  errorElement.textContent = "";
  errorElement.style.visibility = "hidden";
};
const showError = (errorElement, message) => {
  errorElement.textContent = message;
  errorElement.style.visibility = "visible";
};
const disableButton = (button) => {
  if (!button) return;
  button.disabled = true;
  button.style.backgroundColor = "#ccc";
  button.style.cursor = "not-allowed";
};
function $(selector) {
  return document.querySelector(selector);
}
function $all(selector) {
  return document.querySelectorAll(selector);
}
const formatNumber = (number) => {
  return number.toLocaleString();
};
const SYSTEM_MESSAGE = {
  PRICE: "구입 금액을 입력해 주세요.",
  COUNT: (count) => `${count}개를 구매했습니다.`,
  WINNING_NUMBER: "당첨 번호를 입력해 주세요.",
  BONUS_NUMBER: "보너스 번호를 입력해 주세요.",
  RETRY: "다시 시작하시겠습니까? (y/n)",
  WINNING_STATISTICS: (matchingCount) => `당첨 통계
--------------------
  3개 일치(${formatNumber(LOTTO_PRIZE[3])}) - ${matchingCount[3]}개
  4개 일치(${formatNumber(LOTTO_PRIZE[4])}) - ${matchingCount[4]}개
  5개 일치(${formatNumber(LOTTO_PRIZE[5])}) - ${matchingCount[5]}개
  5개 일치, 보너스 볼 일치(${formatNumber(LOTTO_PRIZE["bonus"])}) - ${matchingCount["bonus"]}개
  6개 일치(${formatNumber(LOTTO_PRIZE[6])}) - ${matchingCount[6]}개`,
  MATCH_COUNT: (count, prize) => `${count}개 일치 (${formatNumber(prize)}원) - ${count}개`,
  MATCH_BONUS_COUNT: (count, prize) => `5개 일치, 보너스 볼 일치 (${formatNumber(prize)}원) - ${count}개`,
  PROFIT: (profit) => `총 수익률을 ${profit}% 입니다.`
};
const showLottoCount = (lottoCount) => {
  const purchaseResult = $(".purchase-result");
  const lottoCountUI = document.createElement("p");
  lottoCountUI.textContent = SYSTEM_MESSAGE.COUNT(lottoCount);
  purchaseResult.appendChild(lottoCountUI);
};
const showLottoTickets = (lottoArray) => {
  const purchaseResult = $(".purchase-result");
  const lottoList = document.createElement("ul");
  lottoList.classList.add("lotto-list");
  const fragment = document.createDocumentFragment();
  lottoArray.forEach((lotto) => {
    fragment.appendChild(createLottoListItem(lotto));
  });
  lottoList.appendChild(fragment);
  purchaseResult.appendChild(lottoList);
};
const createLottoListItem = (lotto) => {
  const listItem = document.createElement("li");
  const ticketIcon = document.createElement("img");
  ticketIcon.src = "public/ticket.png";
  ticketIcon.alt = "로또 티켓";
  ticketIcon.classList.add("lotto-icon");
  const numbersSpan = document.createElement("span");
  numbersSpan.classList.add("lotto-numbers");
  numbersSpan.textContent = lotto.toString();
  listItem.appendChild(ticketIcon);
  listItem.appendChild(numbersSpan);
  return listItem;
};
const submitPurchaseForm = () => {
  return new Promise((resolve) => {
    $("#purchase-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const { lottoArray, lottoCount } = handleLottoPurchase();
      disableButton($("#purchase-form button"));
      showLottoCount(lottoCount);
      showLottoTickets(lottoArray);
      showWinningNumberForm(true);
      return resolve(lottoArray);
    });
  });
};
const handleLottoPurchase = () => {
  const priceInput = $("#price");
  const errorUI = $("#price-error");
  resetError(errorUI);
  try {
    const priceValue = priceInput.value.trim();
    validatePrice(priceValue);
    const price = parsePrice(priceValue);
    return purchaseLottos(price);
  } catch (error) {
    showError(errorUI, error.message);
    showWinningNumberForm(false);
  }
};
const showWinningNumberForm = (isValid) => {
  const winningNumberForm = $("#winning-number-form");
  winningNumberForm.style.display = isValid ? "block" : "none";
};
class WinningLotto {
  constructor(lotto, bonusNumber) {
    __privateAdd(this, _lotto);
    __privateAdd(this, _bonusNumber);
    if (!validationCondition.isBonusRangeValid(bonusNumber)) {
      throw new Error(BONUS_NUMBER_ERROR_MESSAGE.RANGE);
    }
    if (lotto.has(bonusNumber)) {
      throw new Error(BONUS_NUMBER_ERROR_MESSAGE.DUPLICATE);
    }
    __privateSet(this, _lotto, lotto);
    __privateSet(this, _bonusNumber, bonusNumber);
  }
  has(number) {
    return __privateGet(this, _lotto).has(number);
  }
  isBonusMatched(lotto) {
    return lotto.has(__privateGet(this, _bonusNumber));
  }
}
_lotto = new WeakMap();
_bonusNumber = new WeakMap();
const calculateMatchingResult = (winningLotto, lottoArray) => {
  return lottoArray.reduce(
    (acc, lotto) => {
      const matchingCount = lotto.match(winningLotto).length;
      if (matchingCount < LOTTO_MATCH_CRITERIA.MIN_MATCH_COUNT) return acc;
      if (matchingCount === LOTTO_MATCH_CRITERIA.BONUS_MATCH_COUNT && winningLotto.isBonusMatched(lotto)) {
        return { ...acc, bonus: acc.bonus + 1 };
      }
      return { ...acc, [matchingCount]: acc[matchingCount] + 1 };
    },
    { 3: 0, 4: 0, 5: 0, 6: 0, bonus: 0 }
  );
};
const calculatePrizeMoney = (matchingCount) => {
  return Object.keys(matchingCount).reduce((sum, count) => sum + matchingCount[count] * (LOTTO_PRIZE[count] || 0), 0);
};
const calculateProfitRate = (matchingCount, lottoCount) => {
  const winningAmount = calculatePrizeMoney(matchingCount);
  const profitRatio = winningAmount / (lottoCount * LOTTO_PRICE);
  return (profitRatio * 100).toFixed(1);
};
const lockScroll = () => {
  const body = document.body;
  body.style.overflow = "hidden";
};
const unlockScroll = () => {
  const body = document.body;
  body.style.overflow = "auto";
};
const showModal = (modal) => {
  modal.style.display = "flex";
  lockScroll();
};
const closeModal = (modal) => {
  modal.style.display = "none";
  unlockScroll();
};
const restartGame = (modal) => {
  closeModal(modal);
  location.reload();
};
const checkEmpty$1 = (bonusNumberInput) => checkEmptyInput(bonusNumberInput, BONUS_NUMBER_ERROR_MESSAGE.EMPTY);
const checkIsInteger$1 = (bonusNumberInput) => {
  if (!validationCondition.isInteger(bonusNumberInput)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.NUMBER);
  }
};
const checkRange$1 = (bonusNumberInput) => {
  if (!validationCondition.isBonusRangeValid(bonusNumberInput)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.RANGE);
  }
};
const checkDuplicate = (winningNumbers, bonusNumberInput) => {
  if (!validationCondition.isBonusDistinct(winningNumbers, bonusNumberInput)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.DUPLICATE);
  }
};
const checkDuplicatedWinningNumber = (winningNumbers) => (bonusNumberInput) => checkDuplicate(winningNumbers, bonusNumberInput);
const validateBonusNumber = (winningNumbers, bonusNumberInput) => {
  runValidators(
    [checkEmpty$1, checkIsInteger$1, checkRange$1, checkDuplicatedWinningNumber(winningNumbers)],
    bonusNumberInput
  );
};
const checkEmpty = (winningNumberInput) => checkEmptyInput(winningNumberInput, LOTTO_NUMBERS_ERROR_MESSAGE.EMPTY);
const checkEmptyItem = (winningNumberInput) => {
  if (winningNumberInput.some((number) => validationCondition.isEmpty(number))) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.EMPTY_ITEM);
  }
};
const checkIsInteger = (winningNumberInput) => {
  if (winningNumberInput.some((number) => !validationCondition.isInteger(number))) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.NUMBER);
  }
};
const checkLengthValid = (winningNumberInput) => {
  if (!validationCondition.isLengthValid(winningNumberInput)) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.LENGTH);
  }
};
const checkRange = (winningNumberInput) => {
  if (!validationCondition.isRangeValid(winningNumberInput)) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.RANGE);
  }
};
const checkIsDistinct = (winningNumberInput) => {
  if (!validationCondition.isDistinct(winningNumberInput)) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.DUPLICATE);
  }
};
const validateWinningNumber = (winningNumberInput) => {
  return runValidators([checkEmpty, checkEmptyItem, checkIsInteger, checkLengthValid, checkRange, checkIsDistinct], winningNumberInput);
};
const setupModalControl = () => {
  const modal = $("#result-modal");
  const closeButton = $(".close-button");
  const restartButton = $("#restart-button");
  closeButton.addEventListener("click", () => closeModal(modal));
  restartButton.addEventListener("click", () => restartGame(modal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal(modal);
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
};
const updateMatchingResult = (matchingResult, profitRate) => {
  $("#match-3").textContent = `${matchingResult[3]}개`;
  $("#match-4").textContent = `${matchingResult[4]}개`;
  $("#match-5").textContent = `${matchingResult[5]}개`;
  $("#match-bonus").textContent = `${matchingResult["bonus"]}개`;
  $("#match-6").textContent = `${matchingResult[6]}개`;
  const profitRateText = `당신의 총 수익률은 ${profitRate}%입니다.`;
  $("#profit-rate").textContent = profitRateText;
};
const submitWinningNumberForm = (lottoArray) => {
  $("#winning-number-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const winningLotto = handleWinningNumber();
    const matchingResult = calculateMatchingResult(winningLotto, lottoArray);
    const profitRate = calculateProfitRate(matchingResult, lottoArray.length);
    updateMatchingResult(matchingResult, profitRate);
    showModal($("#result-modal"));
    setupModalControl();
  });
};
const handleWinningNumber = () => {
  const errorUI = $("#winning-number-error");
  resetError(errorUI);
  try {
    const { winningNumbers, bonusNumber } = getWinningNumbers();
    const winningLotto = new WinningLotto(new Lotto(winningNumbers), bonusNumber);
    return winningLotto;
  } catch (error) {
    showError(errorUI, error.message);
  }
};
const getWinningNumbers = () => {
  const winningNumberInput = Array.from($all(".winning-number-boxes input")).map((input) => input.value.trim()).filter((value) => value !== "");
  const bonusNumberInput = $("#bonus").value.trim();
  validateWinningNumber(winningNumberInput);
  const winningNumbers = parseWinningNumber(winningNumberInput);
  validateBonusNumber(winningNumbers, bonusNumberInput);
  const bonusNumber = parseBonusNumber(bonusNumberInput);
  return { winningNumbers, bonusNumber };
};
document.addEventListener("DOMContentLoaded", async () => {
  const lottoArray = await submitPurchaseForm();
  submitWinningNumberForm(lottoArray);
});
