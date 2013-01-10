/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var Settings = {
  get mozSettings() {
    // return navigator.mozSettings when properly supported, null otherwise
    // (e.g. when debugging on a browser...)
    var settings = window.navigator.mozSettings;
    return (settings && typeof(settings.createLock) == 'function') ?
        settings : null;
  },

  init: function settings_init() {
    bug344618_polyfill();
    var settings = this.mozSettings;
    if (!settings)
      return;
    var wb = document.getElementById("wifi-checkbox");
    var bb = document.getElementById("bluetooth-checkbox");
    var bn = document.getElementById("brightness");

    var req = settings.createLock().get('*');
    req.onsuccess = function wf_getStatusSuccess() {
      settings.createLock().set({'screen.automatic-brightness':false});
      wb.checked =  !!req.result['wifi.enabled'];
      bb.checked = !!req.result['bluetooth.enabled'];
      bn.value = parseFloat(req.result['screen.brightness']);
      bn.refresh();
    }

    var wifiManager = window.navigator.mozWifiManager;

    // update <input> values when the corresponding setting is changed
    settings.onsettingchange = function settingChanged(event) {
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

