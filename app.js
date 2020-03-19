'use strict';

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


if (document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  app();
} else {
  document.addEventListener("DOMContentLoaded", app);
}

function addEvent(parent, evt, selector, handler) {
  parent.addEventListener(evt, function (event) {
    if (event.target.matches(selector + ', ' + selector + ' *')) {
      handler.apply(event.target.closest(selector), arguments);
    }
  }, false);
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

let intervalAddIcon;
let intervalClick;

function app() {
  // Click on an event
  addEvent(document, 'click', '.NlL62b[data-eventid]', function () {
    const eventId = this.getAttribute('data-eventid');
    const dupBtn = `<div class="dup-btn" data-id="${eventId}">${dupIcon}</div>`;
    intervalAddIcon = setInterval(function () {
      const eventNode = document.querySelector('.pPTZAe');
      if(eventNode == null) return;
      clearInterval(intervalAddIcon);
      if(eventNode.querySelector('.dup-btn') != null) return;
      eventNode.prepend(htmlToElement(dupBtn));
    }, 50);
  });

  // Click on my duplicate button
  addEvent(document, 'click', '.dup-btn', function () {
    history.pushState("", "", "https://calendar.google.com/calendar/r/eventedit/duplicate/" + this.getAttribute('data-id'));
    location.hash = "duplicate";
    intervalClick = setInterval(function () {
      if(document.querySelector('#xSaveBu') == null) return;
      clearInterval(intervalClick);
      document.querySelector('#xSaveBu').click();
    }, 50);
  });
};