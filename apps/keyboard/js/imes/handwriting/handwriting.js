/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

(function() {

function importScripts(urls, callback) {
  if (urls.length > 1) {
    // Load the nth file as soon as everything up to the
    // n-1th one is done.
    importScripts(urls.slice(0,urls.length-1), function () {
      importScripts([urls[urls.length-1]], callback);
    });
    return;
  }
  var script = document.createElement('script');
  script.src = urls[0];
  script.onload = callback;
  document.body.appendChild(script);
}

var IMEngineBase = function engineBase_constructor() {
  this._glue = {};
};

IMEngineBase.prototype = {
  /**
   * Glue ojbect between the IMEngieBase and the IMEManager.
   */
  _glue: {
    /**
     * The source code path of the IMEngine
     * @type String
     */
    path: '',

    /**
     * Sends candidates to the IMEManager
     */
    sendCandidates: function(candidates) {},

    /**
     * Sends pending symbols to the IMEManager.
     */
    sendPendingSymbols: function(symbols) {},

    /**
     * Passes the clicked key to IMEManager for default action.
     * @param {number} keyCode The key code of an integer.
     */
    sendKey: function(keyCode) {},

    /**
     * Sends the input string to the IMEManager.
     * @param {String} str The input string.
     */
    sendString: function(str) {},

    /**
     * Change the keyboad
     * @param {String} keyboard The name of the keyboard.
     */
    alterKeyboard: function(keyboard) {}
  },

  /**
   * Initialization.
   * @param {Glue} glue Glue object of the IMManager.
   */
  init: function engineBase_init(glue) {
    this._glue = glue;
  },

  /**
   * Notifies when a keyboard key is clicked.
   * @param {number} keyCode The key code of an integer number.
   */
  click: function engineBase_click(keyCode) {
  },

  /**
   * Notifies when pending symbols need be cleared
   */
  empty: function engineBase_empty() {
  },

  /**
   * Notifies when a candidate is selected.
   * @param {String} text The text of the candidate.
   * @param {Object} data User data of the candidate.
   */
  select: function engineBase_select(text, data) {
  },

  /**
   * Notifies when the IM is shown
   */
  activate: function engineBase_activate(language, state, options) {
  },

  /**
   * Called when the keyboard is hidden
   */
  deactivate: function engineBase_deactivate() {
  }
};

var IMEngine = function engine_constructor() {
  IMEngineBase.call(this);
};

IMEngine.prototype = {
  // Implements IMEngineBase
  __proto__: new IMEngineBase(),

  _firstCandidate: '',
  _keypressQueue: [],
  _isWorking: false,

  _isActive: false,

  // Current keyboard
  _keyboard: 'zh-Hans-Handwriting',

  _timeOutId: null,
  _writing: false,
  _isInited: false,

  isInCanvas: function(event) {
    var canvas = IMERender.activeIme.querySelector('.handwriting-pad');
    if (!canvas) {
      return false;
    };
    if (!this._isInited) {
      canvas.height = canvas.clientHeight;
      Render.init(canvas.width, canvas.height);
      this._isInited = true;
    }
    var canvasRect = canvas.getBoundingClientRect();
    var body = canvas.ownerDocument.body;
    var left = canvasRect.left - body.clientLeft;
    var top = canvasRect.top - body.clientTop;
    var right = canvasRect.right - body.clientLeft;
    var bottom = canvasRect.bottom - body.clientTop;
    if (event.pageX > left && event.pageX < right && event.pageY > top && event.pageY < bottom) {
      return true;
    } else {
      return false;
    }
  },

  canvasMouseDown: function engine_mousedown(event){
    clearTimeout(this._timeOutId);
    var point = Board.getMousePoint(event);
    Board.addStrokePoint(point[0], point[1]);
    this._writing = true;
    Render.draw(point[0], point[1], true);
  },

  canvasMouseMove: function engine_mousemove(event) {
    if (!this._writing) {
      return;
    }
    
    var point = Board.getMousePoint(event);
    Board.addStrokePoint(point[0], point[1]);
    Render.draw(point[0], point[1], false);
  },

  canvasMouseUp: function engine_mouseup(event) {
    this._timeOutId = setTimeout(Board.sendStrokePoints.bind(Board), 500);
    this._writing = false;
    Board.addStrokePoint(-1, 0);
  },

  /**
   * Send candidates list.
   * @param {Array.<string>} candidates The candidates to be sent.
   * @return {void}  No return value.
   */
  _sendCandidates: function engine_sendCandidates(candidates) {
    var list = [];
    var len = candidates.length;
    for (var id = 0; id < len; id++) {
      var cand = candidates[id];
      if (id == 0) {
        this._firstCandidate = cand;
      }
      list.push([cand, id]);
    }

    this._glue.sendCandidates(list);
    if (this._firstCandidate) {
      this._glue.setComposition(this._firstCandidate);
    } else {
      this._glue.endComposition();
    }
  },

  _start: function engine_start() {
    if (this._isWorking)
      return;

    this._isWorking = true;
    this._next();
  },

  _next: function engine_next() {
    if (!this._keypressQueue.length) {
      this._isWorking = false;
      return;
    }

    var code = this._keypressQueue.shift();

    var sendKey = true;

    if (this._firstCandidate) {
      switch (code) {
        case KeyEvent.DOM_VK_BACK_SPACE:
          sendKey = false;
          break;
        case KeyEvent.DOM_VK_RETURN:
        case KeyEvent.DOM_VK_SPACE:
          // candidate list exists; output the first candidate
          this._glue.endComposition(this._firstCandidate);
          sendKey = false;
          break;
        default:
          this._glue.endComposition(this._firstCandidate);
          break;
      }
      this.empty();
    }

    //pass the key to IMEManager for default action
    if (sendKey) {
      this._glue.sendKey(code);
    }
    this._next();
  },

  _alterKeyboard: function engine_changeKeyboard(keyboard) {
    this._resetKeypressQueue();
    this.empty();

    this._keyboard = keyboard;
    this._glue.alterKeyboard(keyboard);
  },

  _resetKeypressQueue: function engine_abortKeypressQueue() {
    this._keypressQueue = [];
    this._isWorking = false;
  },

  /**
   * Override
   */
  init: function engine_init(glue) {
    IMEngineBase.prototype.init.call(this, glue);
    importScripts(['js/imes/handwriting/zinnia-engine.js',
                   'js/imes/handwriting/emscripten_zinnia.js'], function() {
    });
  },

  /**
   *Override
   */
  click: function engine_click(keyCode) {
    if (this._layoutPage !== LAYOUT_PAGE_DEFAULT) {
      this._glue.sendKey(keyCode);
      return;
    }

    IMEngineBase.prototype.click.call(this, keyCode);

    switch (keyCode) {
      case -11: // Switch to handwriting Panel
        this._alterKeyboard('zh-Hans-Handwriting');
        break;
      case -20: // Switch to Chinese Symbol Panel, Same page
      case -21: // Switch to Chinese Symbol Panel, Page 1
      case -22: // Switch to Chinese Symbol Panel, Page 2
      case -30: // Switch to English Symbol Panel, Same page
      case -31: // Switch to English Symbol Panel, Page 1
      case -32: // Switch to English Symbol Panel, Page 2
        var index = Math.abs(keyCode);
        var symbolType = index < 30 ? 'Ch' : 'En';
        var symbolPage = index % 10;
        if (!symbolPage)
          symbolPage = this._keyboard.substr(-1);
        this._alterKeyboard(
          'zh-Hans-Handwriting-Symbol-' + symbolType + '-' + symbolPage);
        break;
      default:
        this._keypressQueue.push(keyCode);
        break;
    }

    this._start();
  },

  _layoutPage: LAYOUT_PAGE_DEFAULT,

  setLayoutPage: function engine_setLayoutPage(page) {
    this._layoutPage = page;
  },

  /**
   * Override
   */
  select: function engine_select(text, data) {
    IMEngineBase.prototype.select.call(this, text, data);

    this._glue.sendString(text);
    this.empty();
    this._start();
  },

  /**
   * Override
   */
  empty: function engine_empty() {
    IMEngineBase.prototype.empty.call(this);
    this._firstCandidate = '';
    this._sendCandidates([]);
    Board.clear();
  },

  /**
   * Override
   */
  activate: function engine_activate(language, state, options) {
    IMEngineBase.prototype.activate.call(this, language, state, options);

    var inputType = state.type;

    var keyboard = 'zh-Hans-Handwriting';
    if (inputType == '' || inputType == 'text' || inputType == 'textarea') {
      keyboard = this._keyboard;
    }

    this._glue.alterKeyboard(keyboard);

    this._isActive = true;

    var canvas = IMERender.activeIme.querySelector('.handwriting-pad');
    if (!canvas) {
      return;
    };
    Render.init(canvas.width, canvas.height);
  },

  /**
   * Override
   */
  deactivate: function engine_deactivate() {
    IMEngineBase.prototype.deactivate.call(this);

    if (!this._isActive)
      return;

    this._isActive = false;

    this._resetKeypressQueue();
    this.empty();

    var self = this;
  }
};

var Render = {
  _lastX: -1,
  _lastY: -1,
  _ctx: null,
  _width: 280,
  _height: 280,

  init: function(width, height) {
    var canvas = IMERender.activeIme.querySelector('.handwriting-pad');
    this._ctx = canvas.getContext('2d');
    this._ctx.strokeStyle = "#df4b26";
    this._ctx.lineJoin = "round";
    this._ctx.lineWidth = 5;
    this._width = width;
    this._height = height;
  },

  clear: function() {
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._lastX = this._lastY = -1;
  },

  draw: function(x, y, start) {
    this._ctx.beginPath();
    if (start) {
      this._lastX = x-1;
      this._lastY = y;
    }
    this._ctx.moveTo(this._lastX, this._lastY);
    this._ctx.lineTo(x, y);
    this._ctx.closePath();
    this._ctx.stroke();
    this._lastX = x;
    this._lastY = y;
  },
};

var Board = {
  _strokePoints: [],

  addStrokePoint: function(x, y) {
    if (x < -1 || y < -1) {
      dump("dd");
    }
    this._strokePoints.push(x, y);
  },

  getMousePoint: function(event) {
    var canvas = IMERender.activeIme.querySelector('.handwriting-pad');
    if (!canvas) {
      return [0, 0];
    }
    var canvasRect = canvas.getBoundingClientRect();
    var posX = canvasRect.left - document.body.clientLeft;
    var posY = canvasRect.top - document.body.clientTop;
    return [event.pageX - posX, event.pageY - posY];
  },

  sendStrokePoints: function() {
    if (this._strokePoints.length <= 1) {
      return;
    }
    var str = HWREngine.recognize(this._strokePoints);
    if (handwriting._firstCandidate) {
      handwriting.select(handwriting._firstCandidate, {});
    }
    handwriting._sendCandidates(str);
    Board.clear();
  },

  clear: function() {
      this._strokePoints = [];
      Render.clear();
  },
};

var handwriting = new IMEngine();

// Expose the engine to the Gaia keyboard
if (typeof InputMethods !== 'undefined') {
  InputMethods.handwriting = handwriting;
}
})();
