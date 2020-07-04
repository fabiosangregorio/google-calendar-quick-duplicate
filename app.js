'use strict';

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
  /**
   * Inject the duplicate icon on a Google Calendar event click 
   */
  addEvent(document, 'click', '.NlL62b[data-eventid]', function () {
    const eventId = this.getAttribute('data-eventid');
    const dupBtn = `<div class="dup-btn" data-id="${eventId}">${dupIcon}</div>`;
    intervalInjectIcon = setInterval(function () {
      const eventNode = document.querySelector('.pPTZAe');
      if (eventNode == null) return;
      clearInterval(intervalInjectIcon);
      if (eventNode.querySelector('.dup-btn') != null) return;
      eventNode.prepend(htmlToElement(dupBtn));
    }, DELAY);
  });

  /** Toggle active state on duplicate icon click */
  addEvent(document, 'click', '.dup-btn', function () { duplicateEvent(); });
};

function duplicateEvent() {
  intervalDuplicateEvent = setInterval(function () {
    /** Trigger click on the duplicate button in the options list */
    var optionsButton = document.querySelector('div[aria-label=Options]');
    var duplicateButton = document.querySelector('span[aria-label=Duplicate]');

    if (optionsButton != null && duplicateButton != null) {
      // Then click the duplicate button
      currentDate = getCurrentDate();
      clearInterval(intervalDuplicateEvent);
      simulateClick(duplicateButton);
      saveEvent();
    }
  }, DELAY);
}

function saveEvent() {
  intervalSaveEvent = setInterval(function() {
    /** Trigger save button when edit modal has opened */
    var saveButton = document.querySelector('div[aria-label=Save]');
    if (saveButton == null) return;
    clearInterval(intervalSaveEvent);
    saveButton.click();

    goToCurrentDate();
  }, DELAY);
}

function goToCurrentDate() {
  intervalGoToDay = setInterval(function() {
    if(location.href.includes("duplicate")) return;
    clearInterval(intervalGoToDay);
    
    const miniDay = document.querySelector(".W0m3G");
    const miniWeek = miniDay.parentNode;
    const clonedDay = miniDay.cloneNode();
    clonedDay.setAttribute("data-date", currentDate);
    miniWeek.append(clonedDay); // TODO: try triggering click without appending
    clonedDay.click();
    clonedDay.remove();
  }, DELAY);
}
/** ======================================== */

/** ========== UTILITY FUNCTIONS ========== */
function getCurrentDate() {
  let date;
  let splittedUrl = location.href.split('/');
  let len = splittedUrl.length;
  if (isNaN(splittedUrl[len - 1]) || isNaN(splittedUrl[len - 2]) || isNaN(splittedUrl[len - 3])) {
    const today = new Date();
    date = padDate(today.getFullYear(), today.getMonth() + 1, today.getDay());
  } else {
    date = padDate(splittedUrl[len - 3], splittedUrl[len - 2], splittedUrl[len -1]);
  }
  return date;
}

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
  element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }));
  element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window }))
}
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

/** ========== TEMPLATES ========== */
const dupIcon = `
<div>
  <div id="duplicate-event" class="uArJ5e Y5FYJe cjq2Db d29e1c"
    jslog="74327; 2:[&quot;43aadic948fhep9u1afopevksk&quot;,&quot;acd52hqnogl5bokq04klqkdqfg@group.calendar.google.com&quot;,false,null,0,0,null,null,0,false,[1,2,null,[&quot;&quot;,2]],false]; track:JIbuQc"
    jscontroller="VXdfxd"
    jsaction="click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue;touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc(preventMouseEvents=true|preventDefault=true); touchcancel:JMtRjd;focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef;"
    jsshadow="" jsname="VkLyEc" 
    aria-label="Duplicate event" aria-disabled="false" tabindex="0"
    data-tooltip="Duplicate event" data-tooltip-vertical-offset="-12" data-tooltip-horizontal-offset="0">
    <div class="PDXc1b MbhUzd"></div>
    <span jsslot="" class="XuQwKc">
      <span class="GmuOkf">
          <svg height="20" viewBox="0 0 24 24" width="20" focusable="false" class=" NMm5M"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"/></svg>
      </span>
    </span>
  </div>
</div>
`;