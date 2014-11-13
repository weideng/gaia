'use strict';

/* global ActiveTargetsManager, KeyEvent, HandwritingPadsManager,
          DefaultTargetHandler, NullTargetHandler, SpaceKeyTargetHandler,
          CandidateSelectionTargetHandler, CompositeTargetHandler,
          PageSwitchingTargetHandler, CapsLockTargetHandler,
          SwitchKeyboardTargetHandler, ToggleCandidatePanelTargetHandler,
          DismissSuggestionsTargetHandler, BackspaceTargetHandler,
          HandwritingPadTargetHandler */

(function(exports) {

var TargetHandlersManager = function(app) {
  this.handlers = undefined;
  this.activeTargetsManager = null;
  this.handwritingPadsManager = null;
  this.app = app;

  this.ignoreNewUserPress = false;
  this.ignoreMoveInActions = false;
  this.ignoreMoveOutActions = false;
};

TargetHandlersManager.prototype.start = function() {
  this.app.console.log('TargetHandlersManager.start()');

  this.handlers = new WeakMap();

  this.handwritingPadsManager = new HandwritingPadsManager(this.app);
  this.handwritingPadsManager.start();

  var activeTargetsManager = this.activeTargetsManager =
    new ActiveTargetsManager(this.app);

  // Create partial functions and hook to the callback properties,
  // see http://mdn.io/bind#Partial_Functions
  activeTargetsManager.ontargetactivated =
    this._callTargetAction.bind(this, 'activate', true, false);
  activeTargetsManager.ontargetlongpressed =
    this._callTargetAction.bind(this, 'longPress', false, false);
  activeTargetsManager.ontargetmoved =
    this._callTargetAction.bind(this, 'move', false, true);
  activeTargetsManager.ontargetmovedout =
    this._callTargetAction.bind(this, 'moveOut', false, true);
  activeTargetsManager.ontargetmovedin =
    this._callTargetAction.bind(this, 'moveIn', true, false);
  activeTargetsManager.ontargetcommitted =
    this._callTargetAction.bind(this, 'commit', false, true);
  activeTargetsManager.ontargetcancelled =
    this._callTargetAction.bind(this, 'cancel', false, true);
  activeTargetsManager.ontargetdoubletapped =
    this._callTargetAction.bind(this, 'doubleTap', false, true);
  activeTargetsManager.onnewtargetwillactivate =
    this._callTargetAction.bind(this, 'newTargetActivate', false, false);

  activeTargetsManager.getStates = function(state) {
    return this[state];
  }.bind(this);

  activeTargetsManager.start();
};

TargetHandlersManager.prototype.stop = function() {
  this.app.console.log('TargetHandlersManager.stop()');

  this.handlers = null;
  this.activeTargetsManager.stop();
  this.activeTargetsManager = null;

  this.handwritingPadsManager.stop();
  this.handwritingPadsManager = null;
};

// This method is the scaffold of our partical functions:
// The first 3 arguments are instructions set with bind() on how the function
// should process the target (put/delete the handler instance in the handers
// map, and call the named action method), and the fourth argument is the actual
// active target to handle.
//
// An active target and it's handler enjoys a life cycle that beginning with
// "activate" or "moveIn", and end with "commit", "cancel", or "moveout".
// "longpress" is noticeably an optional step during the life cycle and does
// not start or end the handler/active target, so it was not mentioned in the
// above list.
// "newTargetActivate" is similar to "longpress",  it is an optional step too,
// so it was not mentioned in the above list. newTargetActivate is called on
// the current target(s) when there is a new target is about to be activated.
//
// Please note that since we are using target (an abstract key object associated
// with one DOM element) as the identifier of handlers, we do not assign new
// handler if there are two touches on the same element. If two touches happens
// on one (maybe quite big) button, the same method on the same handler will
// be called again with a console warning.
TargetHandlersManager.prototype._callTargetAction = function(action,
                                                             setHandler,
                                                             deleteHandler,
                                                             target,
                                                             press) {
  this.app.console.log('TargetHandlersManager._callTargetAction()',
    action, setHandler, deleteHandler, target);

  if (this._filterActions(action, target)) {
    return;
  }

  var handler;
  if (this.handlers.has(target)) {
    handler = this.handlers.get(target);
    if (setHandler) {
      console.warn('TargetHandlersManager: ' +
        'calling targetHandler.' + action + '() on existing handler.');
    }
    if (deleteHandler) {
      this.handlers.delete(target);
    }
  } else {
    handler = this._createHandlerForTarget(target);
    if (!setHandler) {
      console.warn('TargetHandlersManager: ' +
        'calling targetHandler.' + action + '() on non-existing handler.');
    }
    if (!deleteHandler) {
      this.handlers.set(target, handler);
    }
  }

  handler[action](press);
};

// This method decide which of the TargetHandler is the right one to
// handle the active target. It decide the TargetHandler to use and create
// and instance of it, and return the instance.
// |target| is an object, not a DOM element.
TargetHandlersManager.prototype._createHandlerForTarget = function(target) {
  this.app.console.log('TargetHandlersManager._createHandlerForTarget()');

  var handler;

  // This is unfortunately very complex but this is essentially what's already
  // specified in keyboard.js.
  // We will need to normalize the identifier for each targets in the future.
  if ('isDismissSuggestionsButton' in target) {
    handler = new DismissSuggestionsTargetHandler(target, this.app);
  } else if ('selection' in target) {
    handler = new CandidateSelectionTargetHandler(target, this.app);
  } else if ('compositeKey' in target) {
    handler = new CompositeTargetHandler(target, this.app);
  } else if (target.isHandwritingPad) {
    handler = new HandwritingPadTargetHandler(target, this.app,
                                              this.handwritingPadsManager);
  } else if ('keyCode' in target) {
    switch (target.keyCode) {
      // Delete is a special key, it reacts when pressed not released
      case KeyEvent.DOM_VK_BACK_SPACE:
        handler = new BackspaceTargetHandler(target, this.app);
        break;
      case KeyEvent.DOM_VK_SPACE:
        handler = new SpaceKeyTargetHandler(target, this.app);
        break;

      case KeyEvent.DOM_VK_ALT:
        handler = new PageSwitchingTargetHandler(target, this.app);
        break;

      case this.app.layoutManager.KEYCODE_SWITCH_KEYBOARD:
        handler = new SwitchKeyboardTargetHandler(target, this.app);
        break;

      case this.app.layoutManager.KEYCODE_TOGGLE_CANDIDATE_PANEL:
        handler = new ToggleCandidatePanelTargetHandler(target, this.app);
        break;

      case KeyEvent.DOM_VK_CAPS_LOCK:
        handler = new CapsLockTargetHandler(target, this.app);
        break;

      default:
        handler = new DefaultTargetHandler(target, this.app);
        break;
    }
  } else {
    handler = new NullTargetHandler(target, this.app);
  }

  return handler;
};

TargetHandlersManager.prototype._filterActions = function(action,target) {
  switch(action) {
    case 'activate':
      this.ignoreNewUserPress = target.isHandwritingPad;
      return this.ignoreNewUserPress;
    case 'moveOut':
      if (this.ignoreNewUserPress) {
        return true;
      }
      break;
  }
  if (target.isHandwritingPad) {
  }
  return false;
};

exports.TargetHandlersManager = TargetHandlersManager;

})(window);
