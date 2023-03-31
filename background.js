"use strict";

/** ========== CONSTANTS ========== */
const REDIRECT_TO_PREVIOUS_CALENDAR_VIEW_MESSAGE = "REDIRECT_TO_PREV_CALENDAR_VIEW_MESSAGE";
/** ======================================== */


/** ========== MESSAGE HANDLERS ========== */
chrome.runtime.onMessage.addListener(
  function (request) {
    if (request.type === REDIRECT_TO_PREVIOUS_CALENDAR_VIEW_MESSAGE){
      chrome.tabs.update({
        url: request.message
      });
    }
  }
);
/** ======================================== */