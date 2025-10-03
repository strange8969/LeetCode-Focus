// content.js — robust Accepted detection (only after real Submit)

(function () {
  const SUBMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes after you submit
  let submittedUntil = 0;                  // time until which we accept "Accepted"
  let lastMarkedSlug = null;               // de-dupe within the page
  let lastToastAt = 0;                     // recent "Accepted" toast timestamp

  const DEBUG = false; // set true for console logs

  // ------------ helpers ------------
  function log(...a){ if (DEBUG) console.log("[LC-Focus]", ...a); }

  function getSlug() {
    const m = location.pathname.match(/\/problems\/([^/]+)\//);
    return m ? m[1] : null;
  }

  function armWindow() {
    submittedUntil = Date.now() + SUBMIT_WINDOW_MS;
    log("Submit window armed until", new Date(submittedUntil).toLocaleTimeString());
  }

  function canCountNow() {
    // Accept if in submit window OR very recent success toast appeared
    const inWindow = Date.now() <= submittedUntil;
    const recentToast = Date.now() - lastToastAt <= 30 * 1000; // 30s since toast
    return inWindow || recentToast;
  }

  function markSolved(reason) {
    const slug = getSlug();
    if (!slug) return;
    if (!canCountNow()) { log("Accepted seen but outside allowed window"); return; }
    if (lastMarkedSlug === slug) { log("Already marked this slug on this page"); return; }

    lastMarkedSlug = slug;
    submittedUntil = 0; // close window to avoid double counts
    log("Marking solved for", slug, "reason:", reason);
    chrome.runtime.sendMessage({ type: "markSolved", slug }, () => {});
  }

  // ------------ hook UI submit ------------
  function hookSubmitButton() {
    const seen = new WeakSet();

    function attach(btn) {
      if (seen.has(btn)) return;
      seen.add(btn);
      btn.addEventListener("click", () => {
        const t = (btn.textContent || "").trim().toLowerCase();
        // Only arm when this looks like the Submit button
        if (/^submit$/.test(t) || /submit code/.test(t)) {
          armWindow();
        }
      }, { capture: true });
    }

    function scan() {
      // Known selectors LeetCode uses (they change often, so we’re generous)
      const sels = [
       
