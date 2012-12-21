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
    container.innerHTML = "";
    navigator.mozApps.mgmt.getAllRunning().onsuccess = function mozAppGotAll(evt) {
      var apps = evt.target.result;
      var listFragment = document.createDocumentFragment();
      apps.forEach(function(app) {
        //if (!app.removable)
        //  return;
        self._apps.push(app);

        var item = document.createElement('li');
        var name;
        var entryPoints = app.manifest.entry_points;
        if (entryPoints) {
          for (var ep in entryPoints) {
            var currentEp = entryPoints[ep];
            if ( app.origin.indexOf(currentEp.launch_path) != -1) {
              name = document.createTextNode(currentEp.locales["en-US"].name);
              break;
            }
          }
        }else {
          name = document.createTextNode(app.manifest.name);
        }
        var bt = document.createElement("input");
        bt.setAttribute('type','button');
        bt.setAttribute('value','close');
        bt.onclick = function(evt) { 
         navigator.mozApps.mgmt.close(app.origin);
         TaskManager.loadApps();
        }
        item.appendChild(name);
        item.appendChild(bt);
        listFragment.appendChild(item);
        container.appendChild(listFragment);
      });
      self.container.appendChild(listFragment);
    },

    navigator.mozApps.mgmt.getAllRunning().onerror = function ()
    {
      alert("error");
    }
  }
};

TaskManager.init();

