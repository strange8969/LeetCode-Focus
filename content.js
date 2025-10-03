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

  function isDailyChallenge() {
    // Check if this is the daily challenge page
    // Daily challenge URLs typically have /problems/ and the page has a calendar icon or "Daily Challenge" indicator
    const url = location.href;
    const isDailyURL = /leetcode\.com.*daily/.test(url) || /problem-of-today/.test(url);
    
    // Also check for daily challenge indicators in the DOM
    const dailyBadge = document.querySelector('[class*="daily"]');
    const calendarIcon = document.querySelector('[class*="calendar"]');
    
    return isDailyURL || dailyBadge || calendarIcon;
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
    
    const isDaily = isDailyChallenge();
    log("Marking solved for", slug, "reason:", reason, "isDaily:", isDaily);
    
    chrome.runtime.sendMessage({ 
      type: "markSolved", 
      slug: slug,
      isDaily: isDaily
    }, () => {});
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
      // Known selectors LeetCode uses (they change often, so we're generous)
      const sels = [
        "button[data-e2e-locator=\"console-submit-button\"]",
        "button[class*=\"submit\"]",
        "button[data-cy=\"submit\"]"
      ];
      for (const sel of sels) {
        document.querySelectorAll(sel).forEach(attach);
      }
      // Also scan all buttons with "Submit" text
      document.querySelectorAll("button").forEach((btn) => {
        const text = (btn.textContent || "").trim().toLowerCase();
        if (text === "submit" || text === "submit code") {
          attach(btn);
        }
      });
    }

    scan();
    const obs = new MutationObserver(scan);
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // ------------ detect "Accepted" status ------------
  function detectAccepted() {
    // Watch for success indicators in the DOM
    const checkForAccepted = () => {
      // Look for "Accepted" text in various places
      const acceptedElements = Array.from(
        document.querySelectorAll("[class*=\"success\"], [class*=\"accepted\"], [data-e2e-locator*=\"success\"]")
      );
      
      for (const el of acceptedElements) {
        const text = el.textContent || "";
        if (/\bAccepted\b/i.test(text)) {
          log("Found Accepted indicator");
          lastToastAt = Date.now();
          markSolved("DOM-Accepted");
          break;
        }
      }
    };

    // Observe for toast/notification elements
    const obs = new MutationObserver(() => {
      checkForAccepted();
    });
    
    obs.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ["class"]
    });
    
    // Initial check
    checkForAccepted();
  }

  // ------------ initialization ------------
  function init() {
    log("LeetCode Focus content script loaded");
    hookSubmitButton();
    detectAccepted();
  }

  // Wait for page to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();