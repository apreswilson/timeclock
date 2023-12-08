const clockIn = document.querySelector(".clock-in");
const clockOut = document.querySelector(".clock-out");
const startPeriod = document.querySelector(".start-period");
const endPeriod = document.querySelector(".end-period");
const statusText = document.querySelector(".status");
let workingStatus = localStorage.getItem("workingStatus");
let periodStatus = localStorage.getItem("periodStatus");

clockIn.addEventListener("click", () => {

  clockIn.setAttribute("disabled", "disabled");
  setTimeout(() => {
    clockIn.removeAttribute("disabled");
  }, 2000)

  if (workingStatus === true) {
    statusText.textContent = "Already clocked in";
    clearStatus(statusText);
  }
  else if (periodStatus === null || periodStatus === false) {
    statusText.textContent = "Not in a period";
    clearStatus(statusText);
  }
  else {
    workingStatus = true;
    localStorage.setItem("workingStatus", workingStatus);

    let clockInTime = new Date();
    let clockInValues = [clockInTime.getHours(), clockInTime.getMinutes(), clockInTime.getSeconds()];
    localStorage.setItem("clockInTime", clockInValues);

    statusText.textContent = "Clocked in successfully";
    clearStatus(statusText);
  }
})

clockOut.addEventListener("click", () => {
  clockOut.setAttribute("disabled", "disabled");
  setTimeout(() => {
    clockOut.removeAttribute("disabled");
  }, 2000)

  if (workingStatus === null || workingStatus === false) {
    statusText.textContent = "Not on clock";
    clearStatus(statusText);
  } else {
    workingStatus = false;
    localStorage.setItem("workingStatus", workingStatus);

    let clockInTime = localStorage.getItem("clockInTime").split(",");
    let [inHours, inMinutes, inSeconds] = [Number(clockInTime[0]), Number(clockInTime[1]), Number(clockInTime[2])];

    const clockOutTime = new Date();
    let [outHours, outMinutes, outSeconds] = [clockOutTime.getHours(), clockOutTime.getMinutes(), clockOutTime.getSeconds()];

    let totalSeconds = outSeconds - inSeconds;
    let totalMinutes = outMinutes - inMinutes;
    let totalHours = outHours - inHours;

    if (totalSeconds < 0) {
      totalSeconds += 60;
      totalMinutes -= 1;
    }
    if (totalMinutes < 0) {
      totalMinutes += 60;
      totalHours -= 1;
    }
    if (totalHours < 0) {
      totalHours = Math.abs(totalHours);
      accumulatedHours -= totalHours;
    }

    // Construct the total time string
    let totalTime = `${totalHours} hours ${totalMinutes} minutes ${totalSeconds} seconds`;

    // Update accumulated time in localStorage
    let accumulatedTime = localStorage.getItem("accumulatedTime").split(",");
    let accumulatedHours = Number(accumulatedTime[0]) + totalHours;
    let accumulatedMinutes = Number(accumulatedTime[1]) + totalMinutes;
    let accumulatedSeconds = Number(accumulatedTime[2]) + totalSeconds;

    // Save non-negative accumulated time
    if (accumulatedSeconds >= 0 && accumulatedMinutes >= 0 && accumulatedHours >= 0) {
      localStorage.setItem("accumulatedTime", `${accumulatedHours},${accumulatedMinutes},${accumulatedSeconds}`);
    }

    statusText.textContent = totalTime;
    clearStatus(statusText);

    localStorage.removeItem("clockInTime");
  }
})

startPeriod.addEventListener("click", () => {

  startPeriod.setAttribute("disabled", "disabled");
  setTimeout(() => {
    startPeriod.removeAttribute("disabled");
  }, 2000)

  if (periodStatus === true) {
    statusText.textContent = "Already in a period";
    clearStatus(statusText);
  } else {
    periodStatus = true;
    localStorage.setItem("periodStatus", periodStatus);

    let periodStartTime = new Date();
    let periodStartValues = [
      periodStartTime.getHours(),
      periodStartTime.getMinutes(),
      periodStartTime.getSeconds(),
      periodStartTime.getMonth() + 1,
      periodStartTime.getDate() //+ 3 This is a reminder for how dumb this mistake was. Don't make it again.
      , periodStartTime.getFullYear()
    ];
    localStorage.setItem("periodStart", periodStartValues);

    let accumulatedSeconds = 0, accumulatedMinutes = 0, accumulatedHours = 0;
    let accumulatedTime = [accumulatedHours, accumulatedMinutes, accumulatedSeconds];
    localStorage.setItem("accumulatedTime", accumulatedTime);
  }
})

endPeriod.addEventListener("click", () => {

  endPeriod.setAttribute("disabled", "disabled");
  setTimeout(() => {
    endPeriod.removeAttribute("disabled");
  }, 2000)

  if (periodStatus === null || periodStatus === false) {
    statusText.textContent = "Not in a period";
    clearStatus(statusText);
  } else if (workingStatus === null || workingStatus === false) {
    periodStatus = false;
    localStorage.setItem("periodStatus", periodStatus);

    let startPeriodTime = localStorage.getItem("periodStart").split(",");
    const endPeriodTime = new Date();

    let accumulatedTime = localStorage.getItem("accumulatedTime").split(",");
    let [accumulatedHours, accumulatedMinutes, accumulatedSeconds] = [accumulatedTime[0], accumulatedTime[1], accumulatedTime[2]];
    let totalPeriodTime = `Hours: ${accumulatedHours} Minutes: ${accumulatedMinutes} Seconds: ${accumulatedSeconds}`;

    statusText.textContent = totalPeriodTime;
    clearStatus(statusText);

    let [periodStartMonth, periodStartDay, periodStartYear] = [startPeriodTime[3], startPeriodTime[4], startPeriodTime[5]];

    const recipient = 'placeholderemail@gmail.com';
    const subject = `Hours for: ${periodStartMonth}/${periodStartDay}/${periodStartYear} - ${endPeriodTime.getMonth() + 1}/${endPeriodTime.getDate()}/${endPeriodTime.getFullYear()}`;
    const body = totalPeriodTime;
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    localStorage.removeItem("periodStart");
    localStorage.removeItem("accumulatedTime");
  }
})

function clearStatus(currentText) {
  setTimeout(() => {
    currentText.textContent = "";
  }, 3000);
}

console.log("hello");
