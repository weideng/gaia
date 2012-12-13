/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var TaskManager = {
  _apps: [],
  container: document.getElementById("container"),

  init: function tm_init() {
    this.loadApps();
  },

  loadApps: function tm_loadApps() {
    var self = this;

    navigator.mozApps.mgmt.getAll().onsuccess = function mozAppGotAll(evt) {
      var apps = evt.target.result;
      var listFragment = document.createDocumentFragment();
      apps.forEach(function(app) {
        if (!app.removable)
          return;
        self._apps.push(app);

        var item = document.createElement('li');
        var name = document.createTextNode(app.manifest.name);
        var bt = document.createElement("input");
        bt.setAttribute('type','button');
        bt.setAttribute('value','close');
        bt.onclick = function(evt) { 
         alert (app.manifest.name);
        }
        item.appendChild(name);
        item.appendChild(bt);
        listFragment.appendChild(item);
      });
      self.container.appendChild(listFragment);
    }
  }
};

TaskManager.init();
