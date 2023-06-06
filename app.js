"use strict";

/** ========== CONSTANTS ========== */
const EXTENSION_ID = "belnijodgolpgmpahmdkjbjehbobnfpd";
const GCQD_DUPLICATE_BUTTON_CLASS = "dup-btn";
const GCQD_DUPLICATE_BUTTON_SELECTOR = `.${GCQD_DUPLICATE_BUTTON_CLASS}`;
const CIRCLE_BUTTON_CLASS = "VbA1ue";
const CALENDAR_EVENT_SELECTOR = ".NlL62b[data-eventid]";
const EVENT_PANEL_SELECTOR = ".pPTZAe";
const OPTIONS_BUTTON_SELECTOR = '.d29e1c';
const SAVE_BUTTON_SELECTOR = '[jsname="x8hlje"]';
const DUPLICATE_BUTTON_SELECTOR = '[jsname="lbYRR"]';
const INTERVAL_DELAY = 50;
const LONG_INTERVAL_DELAY = 500;
/** ======================================== */

/** ========== TEMPLATES ========== */
/**
 * Creates the duplicate event button.
 *
 * An event named "Lunch" should have a dark circle button because there is an
 * image behind it.
 *
 * @param {boolean} hasCircleBtn - true if the event has a circle button
 */
function getDuplicateButton(eventId, hasCircleBtn) {
  return `
    <div class="${GCQD_DUPLICATE_BUTTON_CLASS}" data-id="${eventId}">
      <div>
        ${hasCircleBtn ? `<div class="${CIRCLE_BUTTON_CLASS}"></div>` : ""}
        <div id="duplicate-event" class="uArJ5e Y5FYJe ${
          hasCircleBtn ? `A1NRff` : `cjq2Db`
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
    </div>
  `;
}

// Hide event menu when extension is active
const cssStyle = `
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

function app() {
  appendStyleTag(cssStyle);

  addEvent(document, "click", CALENDAR_EVENT_SELECTOR, (e) => {
    injectDuplicateButton(e);
    setUpShortcut(e);
  });

  addEvent(document, "click", GCQD_DUPLICATE_BUTTON_SELECTOR, () => {
    duplicateEvent();
  });
}

/**
 * Injects the duplicate button in the event panel when the user clicks on the
 * event.
 */
function injectDuplicateButton(event) {
  const eventId = event.target.getAttribute("data-eventid");

  intervalInjectIcon = setInterval(function () {
    const eventPanelNode = document.querySelector(EVENT_PANEL_SELECTOR);
    if (eventPanelNode == null) return;

    clearInterval(intervalInjectIcon);
    const duplicateButton = eventPanelNode.querySelector(
      GCQD_DUPLICATE_BUTTON_SELECTOR
    );
    // Inject the button if it's not already there
    if (duplicateButton == null) {
      prependDuplicateButton(eventPanelNode, eventId);
    }
  }, INTERVAL_DELAY);
}

/** Prepends the duplicate button to the event panel buttons list. */
function prependDuplicateButton(eventPanelNode, eventId) {
  const hasCircleBtn = hasCircleButton(eventPanelNode);
  const duplicateButton = getDuplicateButton(eventId, hasCircleBtn);
  eventPanelNode.prepend(htmlToElement(duplicateButton));
}

/** Returns true if the event panel has circle buttons. */
function hasCircleButton(eventPanelNode) {
  return eventPanelNode.querySelector(`.${CIRCLE_BUTTON_CLASS}`) != null;
}

function duplicateEvent() {
  clearInterval(intervalDuplicateEvent);

  intervalDuplicateEvent = setInterval(function () {
    var optionsButton = document.querySelector(OPTIONS_BUTTON_SELECTOR);
    var duplicateButton = document.querySelector(DUPLICATE_BUTTON_SELECTOR);

    if(optionsButton == null || duplicateButton == null) return;

    // Open the options menu if it's closed, then click the duplicate button.
    if (isOptionsMenuClosed(optionsButton, duplicateButton)) {
      simulateClick(optionsButton);
    } else if (duplicateButton != null) {
      clearInterval(intervalDuplicateEvent);
      simulateClick(duplicateButton);
      saveEvent();
    }
  }, INTERVAL_DELAY);
}

/**
 * Returns true if the options menu inside an event panel is closed, true
 * otherwise.
 */
function isOptionsMenuClosed(optionsButton, duplicateButton) {
  return optionsButton != null && duplicateButton == null;
}

/** Saves the duplicated event when the save modal has opened. */
function saveEvent() {
  clearInterval(intervalSaveEvent);
  
  intervalSaveEvent = setInterval(function () {
    var saveButton = document.querySelector(SAVE_BUTTON_SELECTOR);
    if (saveButton == null) return;

    clearInterval(intervalSaveEvent);
    saveButton.click();
  }, LONG_INTERVAL_DELAY);
}


/** Triggers event duplication on shortcut click. */
function setUpShortcut(event) {
  if (event.altKey && !event.shiftKey && !event.ctrlKey) duplicateEvent();
}

/** ======================================== */

/** ========== UTILITY FUNCTIONS ========== */
/** Appends a style tag to the document's head containing the css in input. */
function appendStyleTag(css) {
  var styleTag = document.createElement("style");
  document.head.appendChild(styleTag);
  styleTag.type = "text/css";
  styleTag.appendChild(document.createTextNode(css));
}

/** Pads a date with leading zeros. */
function padDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

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

/** Returns the element node corresponding to the html in input. */
function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node with whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

/** Simulates a click by the user. */
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
