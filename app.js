"use strict";

/** ========== CONSTANTS ========== */
const GCQD_DUPLICATE_BUTTON_CLASS = "dup-btn";
const GCQD_DUPLICATE_BUTTON_SELECTOR = `.${GCQD_DUPLICATE_BUTTON_CLASS}`;
const CIRCLE_BUTTON_CLASS = "VbA1ue";
const CALENDAR_EVENT_SELECTOR = ".NlL62b[data-eventid]";
const EVENT_PANEL_SELECTOR = ".pPTZAe";
const OPTIONS_BUTTON_SELECTOR = '.pPTZAe > div:last-child > div[role="button"]';
const SAVE_BUTTON_SELECTOR = '[jsname="x8hlje"]';
const DUPLICATE_BUTTON_SELECTOR = '.qjTEB [jsname="lbYRR"]';
const MINI_CALENDAR_DAY_SELECTOR = ".W0m3G";
const INTERVAL_DELAY = 50;
/** ======================================== */

/** ========== TEMPLATES ========== */
/**
 * Creates the duplicate event icon
 * An event named "Lunch" will have dark buttons because there is an image behind them
 * @param {boolean} isCircle - for events that have circle buttons
 */
const dupIcon = (isCircle) => `
 <div>
   ${isCircle ? `<div class="${CIRCLE_BUTTON_CLASS}"></div>` : ""}
   <div id="duplicate-event" class="uArJ5e Y5FYJe ${
     isCircle ? `A1NRff` : `cjq2Db`
   } d29e1c"
     jslog="74327; 2:[&quot;43aadic948fhep9u1afopevksk&quot;,&quot;acd52hqnogl5bokq04klqkdqfg@group.calendar.google.com&quot;,false,null,0,0,null,null,0,false,[1,2,null,[&quot;&quot;,2]],false]; track:JIbuQc"
     jscontroller="VXdfxd"
     jsaction="mouseenter:tfO1Yc; mouseleave:JywGue;touchstart:p6p2H; focus:AHmuwe; blur:O22p3e;"
     jsshadow="" jsname="VkLyEc" 
     aria-label="Duplicate event" aria-disabled="false" tabindex="0"
     data-tooltip="Duplicate event" data-tooltip-vertical-offset="-12" data-tooltip-horizontal-offset="0">
     <div class="PDXc1b MbhUzd"></div>
     <span  class="XuQwKc">
       <span class="GmuOkf">
           <svg height="20" viewBox="0 0 24 24" width="20" focusable="false" class=" NMm5M"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"/></svg>
       </span>
     </span>
   </div>
 </div>
 `;

// Hide event menu when extension is active
const css = `
 .gcqd-active .JPdR6b.Q3pIde.qjTEB {
   display: none;
 }
 `;
/** ======================================== */

/** ========== MAIN FUNCTION ========== */
let intervalInjectIcon;
let intervalDuplicateEvent;
let intervalGoToDay;
let intervalSaveEvent;
let currentDate = "";

function app() {
  var style = document.createElement("style");
  document.head.appendChild(style);
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));

  // Inject the duplicate icon on a Google Calendar event click
  addEvent(document, "click", CALENDAR_EVENT_SELECTOR, function () {
    const eventId = this.getAttribute("data-eventid");
    intervalInjectIcon = setInterval(function () {
      const eventPanelNode = document.querySelector(EVENT_PANEL_SELECTOR);
      if (eventPanelNode == null) return;
      clearInterval(intervalInjectIcon);
      if (eventPanelNode.querySelector(GCQD_DUPLICATE_BUTTON_SELECTOR) != null)
        return;

      // make sure the button matches the other buttons
      const hasCircleBtns =
        eventPanelNode.querySelector(CIRCLE_BUTTON_CLASS) !== null;
      const dupBtn = `
        <div class="${GCQD_DUPLICATE_BUTTON_CLASS}" data-id="${eventId}">
          ${dupIcon(hasCircleBtns)}
        </div>`;
      eventPanelNode.prepend(htmlToElement(dupBtn));
    }, INTERVAL_DELAY);
  });

  addEvent(document, "click", GCQD_DUPLICATE_BUTTON_SELECTOR, function () {
    duplicateEvent();
  });
}

function duplicateEvent() {
  document.body.classList.add("gcqd-active");
  clearInterval(intervalDuplicateEvent);
  intervalDuplicateEvent = setInterval(function () {
    var optionsButton = document.querySelector(OPTIONS_BUTTON_SELECTOR);
    var duplicateButton = document.querySelector(DUPLICATE_BUTTON_SELECTOR);
    if (optionsButton != null && duplicateButton == null) {
      // Trigger click on the duplicate button in the options list
      simulateClick(optionsButton);
    } else if (duplicateButton != null) {
      // Then click the duplicate button
      currentDate = document.querySelector(".folmac").getAttribute("data-date");
      simulateClick(duplicateButton.parentNode);
      saveEvent();
    }
  }, INTERVAL_DELAY);
}

function saveEvent() {
  clearInterval(intervalSaveEvent);
  intervalSaveEvent = setInterval(function () {
    /** Trigger save button when edit modal has opened */
    var saveButton = document.querySelector(SAVE_BUTTON_SELECTOR);
    if (saveButton == null) return;
    clearInterval(intervalDuplicateEvent);
    clearInterval(intervalSaveEvent);
    saveButton.click();

    goToCurrentDate();
  }, INTERVAL_DELAY);
}

function goToCurrentDate() {
  clearInterval(intervalGoToDay);
  intervalGoToDay = setInterval(function () {
    if (location.href.includes("duplicate")) return;
    clearInterval(intervalGoToDay);

    var d = new Date();
    var date = padDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (currentDate !== date) {
      // Doing this when duplicating an event on today date results in a change of view
      const miniDay = document.querySelector(MINI_CALENDAR_DAY_SELECTOR);
      const miniWeek = miniDay.parentNode;
      const clonedDay = miniDay.cloneNode();
      clonedDay.setAttribute("data-date", currentDate);
      miniWeek.append(clonedDay);
      clonedDay.click();
      clonedDay.remove();
    }

    document.body.classList.remove("gcqd-active");
  }, INTERVAL_DELAY);
}
/** ======================================== */

/** ========== SHORTCUT LISTENERS ========== */
// alt+click (option+click macos) to trigger duplicate event
document.addEventListener("mousedown", function (e) {
  // make sure that only the alt key is pressed
  if (!e.altKey || e.shiftKey || e.ctrlKey) return;

  // make sure the click's target element is inside a calendar event box
  const calendarEvents = [...document.querySelectorAll("div[data-eventid]")];
  if (
    calendarEvents.some((calendarEvent) => calendarEvent.contains(e.target))
  ) {
    // duplicate the event. But timeout after one second in case of a false alarm
    duplicateEvent();
    setTimeout(() => {
      clearInterval(intervalDuplicateEvent);
    }, 1000);
  }
});

/** ======================================== */

/** ========== READY EVENT ========== */
if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  app();
} else {
  document.addEventListener("DOMContentLoaded", app);
}
/** ======================================== */

/** ========== UTILITY FUNCTIONS ========== */
function padDate(year, month, day) {
  return year + String(month).padStart(2, "0") + String(day).padStart(2, "0");
}

function addEvent(parent, evt, selector, handler) {
  parent.addEventListener(
    evt,
    function (event) {
      if (event.target.matches(selector + ", " + selector + " *")) {
        handler.apply(event.target.closest(selector), arguments);
      }
    },
    false
  );
}

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function simulateClick(element) {
  element.click();
  element.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );
  element.dispatchEvent(
    new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window })
  );
}
/** ======================================== */
