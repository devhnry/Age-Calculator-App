const btn = document.querySelector(".arrowBtn");

const inputDay = document.getElementById("input-day");
const inputMonth = document.getElementById("input-month");
const inputYear = document.getElementById("input-year");

const lblDay = document.querySelector(".label-day");
const lblMonth = document.querySelector(".label-month");
const lblYear = document.querySelector(".label-year");

const resultDay = document.querySelector(".result--days");
const resultMonth = document.querySelector(".result--month");
const resultYear = document.querySelector(".result--year");

const currentDate = new Date();
const curYear = currentDate.getFullYear();
const curMonth = currentDate.getMonth() + 1;
const curDay = currentDate.getDate();

const errDay = document.getElementById("error-day");
const errMonth = document.getElementById("error-month");
const errYear = document.getElementById("error-year");

const errorClr = "hsl(0, 100%, 67%)";
const validClr = "hsla(0, 1%, 44%,0.65)";

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const validateNonEmptyField = (element, label, errorlbl, errorMsg) => {
  if (element.value === "") {
    element.classList.add("invalid");
    label.style.color = errorClr;
    errorlbl.textContent = errorMsg;
  } else {
    element.classList.remove("invalid");
    label.style.color = validClr;
    errorlbl.textContent = "";
  }
};

function invalidInput(element, label, errorlbl, errorMsg) {
  element.classList.add("invalid");
  label.style.color = errorClr;
  errorlbl.textContent = errorMsg;
}

const validateYear = (element) => {
  validateNonEmptyField(element, lblYear, errYear, "This field is required");
  if (element.value != "") {
    if (element.value > 0) {
      if (element.value > curYear) {
        invalidInput(inputYear, lblYear, errYear, "Must be in the past");
      } else {
        return element.value;
      }
    } else {
      invalidInput(element, lblYear, errYear, "Invalid Year");
    }
  } else {
    validateNonEmptyField(
      inputYear,
      lblYear,
      errYear,
      "This field is required"
    );
  }
};

const validateMonth = (element) => {
  validateNonEmptyField(element, lblMonth, errMonth, "This field is required");
  if (element.value != "") {
    if (element.value >= 1 && element.value <= 12) {
      if (element.value > curMonth) {
        invalidInput(element, lblMonth, errMonth, "Must be in the past");
      } else {
        return element.value;
      }
    } else {
      invalidInput(element, lblMonth, errMonth, "Not a valid Month");
    }
  } else {
    validateNonEmptyField(
      inputMonth,
      lblMonth,
      errMonth,
      "This field is required"
    );
  }
};

const validateDay = (element) => {
  validateNonEmptyField(element, lblDay, errDay, "This field is required");
  let mth = Number(inputMonth.value);
  if (element.value != "") {
    let maxDays;
    if (mth === 4 || mth === 6 || mth === 9 || mth === 12) {
      maxDays = 30;
    } else if (mth === 2) {
      maxDays = isLeapYear(inputYear.value) ? 29 : 28;
    } else {
      maxDays = 31;
    }

    if (element.value >= 1 && element.value <= maxDays) {
      if (mth === curMonth && element.value > curDay) {
        invalidInput(element, lblDay, errDay, "Must be in the past");
      } else {
        return element.value;
      }
    } else {
      invalidInput(element, lblDay, errDay, "Not a valid Day");
      if (
        element.value != "" &&
        inputYear.value != "" &&
        inputMonth.value != ""
      ) {
        invalidInput(element, lblDay, errDay, "Not a valid Date");
        invalidInput(inputYear, lblYear, errMonth);
        invalidInput(inputMonth, lblMonth, errMonth);
      }
    }
  } else {
    validateNonEmptyField(inputDay, lblDay, errDay, "This field is required");
  }
};

function getDaysTillNow(year, month, day) {
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const startTimestamp = new Date(year, month, day).getTime();
  const endTimestamp = new Date().getTime();

  const daysDiff = Math.round(
    Math.abs((endTimestamp - startTimestamp) / oneDay)
  );
  return daysDiff;
}

function countTo(endNo, element, callback) {
  let start = 0;
  if (start === endNo) {
    element.textContent = start;
    if (callback) {
      callback();
    }
    return;
  }
  let counter = setInterval(function () {
    start += 1;
    element.textContent = start;
    if (start === endNo) {
      clearInterval(counter);
      if (callback) {
        callback();
      }
    }
  }, 100);
}

btn.addEventListener("click", () => {
  let year = Number(validateYear(inputYear));
  let month = Number(validateMonth(inputMonth)) - 1;
  let day = Number(validateDay(inputDay));

  if(inputDay.value !== "" && inputMonth.value !== "" &&inputYear.value !== ""){
    let daysBetween = getDaysTillNow(year, month, day);
    let resultYr = 0;

    const maxDaysInMonth = [
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    while (daysBetween > 365 + (isLeapYear(year) ? 1 : 0)) {
      daysBetween -= 365 + (isLeapYear(year) ? 1 : 0);
      year++;
      resultYr++;
    }

    let resultM = 0;
    while (daysBetween > maxDaysInMonth[month]) {
      daysBetween -= maxDaysInMonth[month];
      month++;
      resultM++;
    }

    let resultD = daysBetween;
    countTo(resultYr, resultYear, () => {
      countTo(resultM, resultMonth, () => {
        countTo(resultD, resultDay);
      });
    });

  }
});
