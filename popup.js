const todayEl = document.getElementById("today");
const modeEl = document.getElementById("mode");
const targetEl = document.getElementById("target");
const minutesEl = document.getElementById("minutes");
const breakLabel = document.getElementById("breakLabel");

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
    const { settings, breakUntil, today } = res;
    todayEl.textContent = `${today.count}/${settings.dailyTarget}`;
    modeEl.value = settings.mode;
    targetEl.value = settings.dailyTarget;
    tickBreak(breakUntil);
  });
}

document.getElementById("save").addEventListener("click", () => {
  const settings = {
    mode: modeEl.value,
    dailyTarget: Math.max(1, parseInt(targetEl.value || "1", 10))
  };
  chrome.runtime.sendMessage({ type: "setSettings", settings }, () => {
    refresh();
  });
});

document.getElementById("mark1").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "manualMarkOne" }, () => {
    refresh();
  });
});

document.getElementById("startBreak").addEventListener("click", () => {
  const mins = Math.max(1, parseInt(minutesEl.value || "15", 10));
  chrome.runtime.sendMessage({ type: "startBreak", ms: mins * 60000 }, (r) => {
    tickBreak(r?.breakUntil || null);
    refresh();
  });
});

document.getElementById("endBreak").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "endBreak" }, () => {
    refresh();
  });
});

refresh();
