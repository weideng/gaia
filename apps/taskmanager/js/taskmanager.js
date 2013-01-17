/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var TaskManager = {
  _apps: [],
  container: document.getElementById("container"),

  init: function tm_init() {
    this.loadApps();
    document.addEventListener('mozvisibilitychange', this.loadApps.bind(this));
  },

  loadApps: function tm_loadApps() {
    var self = this;
    container.innerHTML = "";
    navigator.mozApps.mgmt.getAllRunning().onsuccess = function mozAppGotAll(evt) {
      var apps = evt.target.result;
      var count = document.getElementById('count');
      count.innerHTML = apps.length - 2;

      //close all the running apps
      var closeAll = document.getElementById('closeAll');
      closeAll.onclick = function(e){
        apps.forEach(function(app){
          navigator.mozApps.mgmt.close(app.origin);
        });
        container.innerHTML = "";
      };

      var list = document.createElement("ul");
      apps.forEach(function(app) {
        self._apps.push(app);

        var item = document.createElement('li');
        var icon = document.createElement('img');
        var span = document.createElement('span');

        var manifest = new ManifestHelper(app.manifest ? app.manifest : app.updateManifest);

        var entryPoints = app.manifest.entry_points;
        if (entryPoints) {
          for (var ep in entryPoints) {
            var currentEp = entryPoints[ep];
            if ( app.origin.indexOf(currentEp.launch_path) != -1) {
              span.innerHTML = currentEp.locales['en-US'].name;
              if (currentEp.icons && Object.keys(currentEp.icons).length) {
                key = Object.keys(currentEp.icons)[0];
                iconURL = currentEp.icons[key];
                if (!(iconURL.slice(0,4) === 'data')) {
                  var end = app.origin.indexOf("/",6);
                  iconURL = app.origin.substr(0,end) + iconURL;
                  //iconURL = app.origin + '/' +  iconURL;
                }
               icon.src = iconURL;
              }
              break;
            }
          }
        }else {
          if (manifest.icons && Object.keys(manifest.icons).length) {
            var key = Object.keys(manifest.icons)[0];
            var iconURL = manifest.icons[key];
           // Adding origin if it's not a data URL
           if (!(iconURL.slice(0,4) === 'data')) {
             iconURL = app.origin + '/' +  iconURL;
           }
           icon = document.createElement('img');
           icon.src = iconURL;
          }
          span.innerHTML = app.manifest.name;
        }
        var bt = document.createElement("input");
        bt.setAttribute('type','button');
        bt.setAttribute('value','close');
        bt.onclick = function(evt) { 
         navigator.mozApps.mgmt.close(app.origin);
         TaskManager.loadApps();
        };
        item.appendChild(icon);
        item.appendChild(span);
        item.appendChild(bt);
        if (app.manifest.name != 'Homescreen' && app.manifest.name != 'Cost Control')
          list.appendChild(item);
      });
      self.container.appendChild(list);
    },

    navigator.mozApps.mgmt.getAllRunning().onerror = function ()
    {
      alert("error");
    }
  }
};

TaskManager.init();

