'use strict';

/** ========== TEMPLATES ========== */

/**
 * Makes the duplicate event icon
 * An event named "Lunch" will have dark buttons because there is an image behind them
 * @param {boolean} isCircle - for events that have circle buttons
 */
const dupIcon = (isCircle) => `
<div>
  ${isCircle ? `<div class="VbA1ue"></div>` : ""}
  <div id="duplicate-event" class="uArJ5e Y5FYJe ${isCircle ? `A1NRff` : `cjq2Db`} d29e1c"
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


/** ========== CONSTANTS ========== */
let intervalInjectIcon;
let intervalDuplicateEvent;
let intervalGoToDay;
let intervalSaveEvent;
const DELAY = 50;
let currentDate = "";
/** ======================================== */


/** ========== MAIN FUNCTION ========== */
function app() {
  var style = document.createElement('style');
  document.head.appendChild(style);
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  /**
   * Inject the duplicate icon on a Google Calendar event click 
   */
  addEvent(document, 'click', '.NlL62b[data-eventid]', function () {
    const eventId = this.getAttribute('data-eventid');
    intervalInjectIcon = setInterval(function () {
      const eventNode = document.querySelector('.pPTZAe');
      if (eventNode == null) return;
      clearInterval(intervalInjectIcon);
      if (eventNode.querySelector('.dup-btn') != null) return;
      // make sure the button matches the other buttons
      const hasCircleBtns = eventNode.querySelector('.VbA1ue') !== null; // 'VbA1ue' is the circle class
      const dupBtn = `<div class="dup-btn" data-id="${eventId}">${dupIcon(hasCircleBtns)}</div>`;
      eventNode.prepend(htmlToElement(dupBtn));
    }, DELAY);
  });

  /** Toggle active state on duplicate icon click */
  addEvent(document, 'click', '.dup-btn', function () { duplicateEvent(); });
};

function duplicateEvent() {
  document.body.classList.add('gcqd-active');
  clearInterval(intervalDuplicateEvent);
  intervalDuplicateEvent = setInterval(function () {
    var optionsButton = document.querySelector('.pPTZAe > div:last-child > div[role="button"]');
    console.log(optionsButton);
    var duplicateButton = document.querySelector('.qjTEB [jsname="lbYRR"]');
    if (optionsButton != null && duplicateButton == null) {
      // Trigger click on the duplicate button in the options list
      simulateClick(optionsButton);
    } else if (duplicateButton != null) {
      // Then click the duplicate button
      currentDate = document.querySelector('.folmac').getAttribute('data-date');
      simulateClick(duplicateButton.parentNode);
      saveEvent();
    }
  }, DELAY);
}

function saveEvent() {
  clearInterval(intervalSaveEvent);
  intervalSaveEvent = setInterval(function() {
    /** Trigger save button when edit modal has opened */
    var saveButton = document.querySelector('[jsname="x8hlje"]');
    if (saveButton == null) return;
    clearInterval(intervalDuplicateEvent);
    clearInterval(intervalSaveEvent);
    saveButton.click();

    goToCurrentDate();
  }, DELAY);
}

function goToCurrentDate() {
  clearInterval(intervalGoToDay);
  intervalGoToDay = setInterval(function() {
    if(location.href.includes("duplicate")) return;
    clearInterval(intervalGoToDay);

    var d = new Date();
    var date = padDate(d.getFullYear(), (d.getMonth() + 1), d.getDate());
    console.log(currentDate, date);
    if(currentDate !== date) {
      // Doing this when duplicating an event on today date results in a change of view
      console.log("true");
      const miniDay = document.querySelector(".W0m3G");
      const miniWeek = miniDay.parentNode;
      const clonedDay = miniDay.cloneNode();
      clonedDay.setAttribute("data-date", currentDate);
      miniWeek.append(clonedDay);
      clonedDay.click();
      clonedDay.remove();
    }
    
    document.body.classList.remove('gcqd-active');
  }, DELAY);
}
/** ======================================== */

/** ========== UTILITY FUNCTIONS ========== */
function padDate(year, month, day) {
  return year + String(month).padStart(2, "0") + String(day).padStart(2, "0");
}

function addEvent(parent, evt, selector, handler) {
  parent.addEventListener(evt, function (event) {
    if (event.target.matches(selector + ', ' + selector + ' *')) {
      handler.apply(event.target.closest(selector), arguments);
    }
  }, false);
}

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function simulateClick(element) {
  element.click();
  element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }));
  element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window }))
}
/** ======================================== */


/** ========== SHORTCUT LISTENERS ========== */

// alt+click (option+click macos) to trigger duplicate event
document.addEventListener("mousedown", function (e) {
  
  // make sure that only the alt key is pressed
  if (e.shiftKey || e.ctrlKey) return;
  if (!e.altKey) return;
  
  // make sure the click's target element is inside a calendar event box
  const calendarEvents = [...document.querySelectorAll('div[data-eventid]')];
  if (calendarEvents.some(calendarEvent=>calendarEvent.contains(e.target))) {

    // duplicate the event. But timeout after one second in case of a false alarm
    duplicateEvent();
    setTimeout(() => {
      clearInterval(intervalDuplicateEvent);
    }, 1000);
  }
});

/** ======================================== */

/** ========== READY EVENT ========== */
if (document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  app();
} else {
  document.addEventListener("DOMContentLoaded", app);
}
/** ======================================== */

