AFRAME.registerComponent('controller-interaction', {
  schema: {
    interval: {default: 200},
  },
  dependencies: ['ui-raycaster'],
  
  init: function () {
    var el = this.el;
    var rayEl = this.rayEl = document.createElement('a-entity');
    this.bindMethods();
    this.closed = true;
    
    this.triggeredPressed = false;
    this.gripPressed = false;
    this.triggeredPressedObject = null;
    this.gripPressedObject = null;
    
    this.intersections = [];
    this.intersectedObjects = [];
    this.hoveredOnObjects = [];
    this.hoveredOffObjects = [];
    this.pressedObjects = {};
    this.unpressedObjects = {};
    this.selectedObjects = {};
    this.highlightMaterials = {};
    
    this.direction = new THREE.Vector3();
    this.rayViewDistance = 1.5;
    this.rayDistanceNear = 0.0;
    this.rayAngle = 45;
    
    rayEl.setAttribute('line', {
      color: 'white'
    });
    el.appendChild(rayEl);
    
    el.setAttribute('ui-raycaster', {
      far: Infinity,
      near: this.rayDistanceNear,
      objects: '.bbox, .menu',
      rotation: -this.rayAngle,
    });
    
    this.controller = null;
    var self = this;
    
    el.addEventListener('controllerconnected', function (evt) {
      var controllerName = evt.detail.name;
      // get tooltips
      // https://github.com/aframevr/a-painter/blob/master/src/components/ui.js
      
      self.controller = {
        name: controllerName,
        hand: evt.detail.component.data.hand
      }
      
      if (controllerName === 'oculus-touch-controls') {
        self.rayAngle = 0;
        el.setAttribute('ui-raycaster', {rotation: -44});
      } else if (controllerName === 'windows-motion-controls') {
        self.rayAngle = 25;
        el.setAttribute('ui-raycaster', {rotation: -30});
      }
      
      if (el.isPlaying) {
        self.addToggleEvent();
      }
    });
  },
  
  bindMethods: function() {
    this.addToggleEvent = this.addToggleEvent.bind(this);
    this.removeToggleEvent = this.removeToggleEvent.bind(this);
    this.toggleRaycast = this.toggleRaycast.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    
    this.onTriggerDown = this.onTriggerDown.bind(this);
    this.onTriggerUp = this.onTriggerUp.bind(this);
    this.onGripDown = this.onGripDown.bind(this);
    this.onGripUp = this.onGripUp.bind(this);
    this.updateLine = this.updateLine.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this);
    this.addHandListeners = this.addHandListeners.bind(this);
    this.removeHandListeners = this.removeHandListeners.bind(this);
    this.onIntersection = this.onIntersection.bind(this);
    this.onIntersectionCleared = this.onIntersectionCleared.bind(this);
    this.onDirectionChanged = this.onDirectionChanged.bind(this);
  },
  
  update: function () {},
  
  tick: function(time) {
    var prevCheckTime = this.prevCheckTime;
    if (prevCheckTime && (time - prevCheckTime < data.interval)) { return; }
    
    if (!this.closed && this.el) {
      //console.log('tick');
      this.updateLine();
      this.handleHover();
      //this.handleInteraction();
      //console.log('tock');
    }
  },
  
//  play: function () {
//    var el = this.el;
//    
//    if (this.controller) {
//      this.addToggleEvent();
//    }
//    
//    el.addEventListener('raycaster-intersection', this.onIntersection);
//    el.addEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
//    el.addEventListener('raycaster-direction-changed', this.onDirectionChanged);
//    
//    this.addHandListeners();
//  },
//  
//  pause: function () {
//    var el = this.el;
//    
//    if (this.controller) {
//      this.removeToggleEvent();
//    }
//    
//    el.removeEventListener('raycaster-intersection', this.onIntersection);
//    el.removeEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
//    el.removeEventListener('raycaster-direction-changed', this.onDirectionChanged);
//  
//    this.removeHandListeners();
//  },
  
  addToggleEvent: function () {
    this.el.addEventListener('toggleRaycast', this.toggleRaycast);
  },

  removeToggleEvent: function () {
    this.el.removeEventListener('toggleRaycast', this.toggleRaycast);
  },
  
  toggleRaycast: function (evt) {
    if (this.closed) {
      this.open();
    } else {
      this.close();
    }
  },
  
  open: function () {
    if (!this.closed) { return; }
    var el = this.el;
    
    el.setAttribute('ui-raycaster', {enabled: true})
    this.rayEl.setAttribute('visible', true);
    el.addEventListener('raycaster-intersection', this.onIntersection);
    el.addEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
    el.addEventListener('raycaster-direction-changed', this.onDirectionChanged);
    this.addHandListeners();
    this.closed = false;
  },
  
  close: function() {
    if (this.closed) { return; }
    var el = this.el;
    
    el.setAttribute('ui-raycaster', {enabled: false})
    this.rayEl.setAttribute('visible', false);
    this.removeHandListeners;
    el.removeEventListener('raycaster-intersection', this.onIntersection);
    el.removeEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
    el.removeEventListener('raycaster-direction-changed', this.onDirectionChanged);
    this.removeHandListeners();
    this.closed = true;
  },
  
  onTriggerDown: function () {
    if (!this.triggeredPressed) {
      var intersectedObjects = this.intersectedObjects;
      
      if (intersectedObjects && intersectedObjects.length) {
        this.triggeredPressed = true;
        objectEl = intersectedObjects[0];
        objectEl.emit('raycaster-triggerdown', {el: this.el});
        this.triggeredPressedObject = objectEl;
      }
    }
  },
  
  onTriggerUp: function () {
    if (this.triggeredPressed) {
      this.triggeredPressed = false;
      this.triggeredPressedObject.emit('raycaster-triggerup', {el: this.el});
    }
  },
  
  onGripDown: function () {
    if (!this.gripPressed) {
      var intersectedObjects = this.intersectedObjects;
      
      if (intersectedObjects && intersectedObjects.length) {
        this.gripPressed = true;
        objectEl = intersectedObjects[0];
        objectEl.emit('raycaster-gripdown', {el: this.el});
        this.gripPressedObject = objectEl;
      }
    }
  },
  
  onGripUp: function () {
    if (this.gripPressed) {
      this.gripPressed = false;
      this.gripPressedObject.emit('raycaster-gripup', {el: this.el});
    }
  },
  
  updateLine: function () {
    var endpoint = new THREE.Vector3();   
    var handRayEl = this.rayEl;
    var intersections = this.intersections;
    var direction = this.direction;
    
    var origin = this.el.object3D.position;
  
    if (intersections && intersections.length) {
      endpoint = intersections[0].point;
    } else {
      endpoint = origin.add(direction.multiplyScalar(this.rayViewDistance));
    }
    
    handRayEl.object3D.worldToLocal(endpoint);
    handRayEl.setAttribute('line', 'end', endpoint);
  },
  
  handleHover: function() {
    var intersectedObjects = this.intersectedObjects;
    this.hoveredOffObjects = this.hoveredOnObjects.filter(function (obj) {
      return intersectedObjects.indexOf(obj) === -1;
    });
    this.hoveredOnObjects = intersectedObjects;
  },
  
  handleInteraction: function () { // unused for now
    if (!this.triggeredPressed && !this.gripPressed) { return; }
    
    if (this.triggeredPressed) {
    } else { // this.gripPressed
    }
    var self = this;
  },
  
  addHandListeners: function () {
    var el = this.el;
    el.addEventListener('triggerdown', this.onTriggerDown);
    el.addEventListener('triggerup', this.onTriggerUp);
    el.addEventListener('gripdown', this.onGripDown);
    el.addEventListener('gripup', this.onGripUp);
  },
  
  removeHandListeners: function () {
    var el = this.el;
    this.onGripUp();
    this.onTriggerUp();
    el.removeEventListener('triggerdown', this.onTriggerDown);
    el.removeEventListener('triggerup', this.onTriggerUp);
    el.removeEventListener('gripdown', this.onGripDown);
    el.removeEventListener('gripup', this.onGripUp);
  },
  
  onIntersection: function (evt) {
    // update intersection(s) arrays
    this.intersectedObjects = evt.detail.els;
    this.intersections = evt.detail.intersections;
  },
  
  onIntersectionCleared: function (evt) {
  },
  
  onDirectionChanged: function (evt) {
    // update direction vector
    this.direction = evt.detail.direction;
  }
  
});