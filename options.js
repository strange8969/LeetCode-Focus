const modeEl = document.getElementById("mode");
const targetEl = document.getElementById("target");
const targetRow = document.getElementById("targetRow");
const todayEl = document.getElementById("today");
const minutesEl = document.getElementById("minutes");
const breakLabel = document.getElementById("breakLabel");
const modeDescription = document.getElementById("modeDescription");

function updateModeUI() {
  const mode = modeEl.value;
  if (mode === "daily") {
    targetRow.style.display = "none";
    modeDescription.innerHTML = `
      <strong>📅 Daily Problem Mode:</strong> You must solve LeetCode's official daily challenge to unlock the web. 
      Only the daily challenge counts - other problems won't count towards your goal. Target is fixed at 1 problem per day.
    `;
  } else {
    targetRow.style.display = "grid";
    modeDescription.innerHTML = `
      Choose <strong>"Any Problem"</strong> to practice any LeetCode problem, or <strong>"Daily Problem"</strong> to focus on daily challenges. 
      Set your target to build a consistent solving habit!
    `;
  }
}

// Listen for mode changes
modeEl.addEventListener("change", updateModeUI);

function fmtCountdown(until) {
  const ms = until - Date.now();
  if (ms <= 0) return "No break active.";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `Break ends in ${m}m ${s}s`;
}

function tickBreak(until) {
  if (!until) {
    breakLabel.textContent = "No break active.";
    return;
  }
  function update() {
    breakLabel.textContent = fmtCountdown(until);
    if (Date.now() < until) requestAnimationFrame(update);
    else breakLabel.textContent = "No break active.";
  }
  update();
}

function refresh() {
  chrome.runtime.sendMessage({ type: "getState" }, (res) => {
    if (!res) return;
    const { settings, today, breakUntil } = res;
    const displayTarget = settings.mode === "daily" ? 1 : settings.dailyTarget;
    modeEl.value = settings.mode;
    targetEl.value = settings.dailyTarget;
    todayEl.textContent = `${today.count}/${displayTarget}`;
    updateModeUI();
    tickBreak(breakUntil);
  });
}

document.getElementById("save").addEventListener("click", () => {
  const mode = modeEl.value;
  const settings = {
    mode: mode,
    dailyTarget: mode === "daily" ? 1 : Math.max(1, parseInt(targetEl.value || "1", 10))
  };
  chrome.runtime.sendMessage({ type: "setSettings", settings }, () => refresh());
});

document.getElementById("startBreak").addEventListener("click", () => {
  const mins = Math.max(1, parseInt(minutesEl.value || "15", 10));
  chrome.runtime.sendMessage({ type: "startBreak", ms: mins * 60000 }, (r) => {
    tickBreak(r?.breakUntil || null);
    refresh();
  });
});

document.getElementById("endBreak").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "endBreak" }, () => refresh());
});

refresh();
