/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

/**
 * Debug note: to test this app in a desktop browser, you'll have to set
 * the `dom.mozSettings.enabled' preference to false in order to avoid an
 * `uncaught exception: 2147500033' message (= 0x80004001).
 */

var Settings = {
  get mozSettings() {
    // return navigator.mozSettings when properly supported, null otherwise
    // (e.g. when debugging on a browser...)
    var settings = window.navigator.mozSettings;
    return (settings && typeof(settings.createLock) == 'function') ?
        settings : null;
  },

  init: function settings_init() {
    var settings = this.mozSettings;
    if (!settings)
      return;

    var wifiManager = window.navigator.mozWifiManager;
   
    wifiManager.onenabled = function onWifiEnabled() {
    var a = 1;
    var b = 2;
    dump("==== wifi enabled");
    };

    wifiManager.ondisabled = function onWifiDisabled() {
    var c = 1;
    var d = 2;
    dump("==== wifi disabled");
    };

    // update <input> values when the corresponding setting is changed
    settings.onsettingchange = function settingChanged(event) {
      alert("changeing");
      var key = event.settingName;
      var value = event.settingValue;
      var input = document.querySelector('input[name="' + key + '"]');
      if (!input)
        return;

      switch (input.dataset.type || input.type) { // bug344618
        case 'checkbox':
        case 'switch':
          if (input.checked == value)
            return;
          input.checked = value;
          break;
        case 'range':
          if (input.value == value)
            return;
          input.value = value;
          input.refresh(); // XXX to be removed when bug344618 lands
          break;
        case 'select':
          for (var i = 0; i < input.options.length; i++) {
            if (input.options[i].value == value) {
              input.options[i].selected = true;
              break;
            }
          }
          break;
      }
    };

  },

  handleEvent: function settings_handleEvent(event) {
    var input = event.target;
    var type = input.dataset.type || input.type; // bug344618
    var key = input.name;
    alert("type=" + type);
    alert("key=" + key);
    var settings = window.navigator.mozSettings;
    if (!key || !settings)
      return;

    var value;
    switch (type) {
      case 'checkbox':
      case 'switch':
        value = input.checked; // boolean
        break;
      case 'range':
        value = parseFloat(input.value).toFixed(1); // float
        break;
      case 'select-one':
      case 'radio':
      case 'text':
      case 'password':
        value = parseFloat(input.value).toFixed(1); // text
        break;
    }

    var cset = {}; cset[key] = value;
    settings.createLock().set(cset);
  }
};


window.addEventListener('load', function loadSettings() {
  window.removeEventListener('load', loadSettings);
  window.addEventListener('change', Settings);
  window.addEventListener('click', Settings); // XXX really needed?
  Settings.init();
});

