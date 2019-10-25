
AFRAME.registerComponent('extra-controls', {
  
  init: function () {
    this.onButtonPress = this.onButtonPress.bind(this);
    this.onGripDown = this.onGripDown.bind(this);
    this.onGripUp = this.onGripUp.bind(this);
    this.remove = this.remove.bind(this);
    this.vectorAdd = this.vectorAdd.bind(this);
    this.vectorSub = this.vectorSub.bind(this);
    this.vectorMultScalar = this.vectorMultScalar.bind(this);
    
    this.vars = {
      pointing: false,
      selected: true,
      line: null,
      latestColl: null,
      grabbed: null,
    }
    
    this.vars.line = document.createElement("a-box");
    this.vars.line.setAttribute("scale", "0.04 0.04 0.04");
    this.el.sceneEl.appendChild(this.vars.line);
    
    this.el.addEventListener('buttondown', this.onButtonPress);
    this.el.addEventListener('gripdown', this.onGripDown);
    this.el.addEventListener('gripup', this.onGripUp);
  },
  
  tick: function () {
    if (this.vars.pointing) {
      var origin = this.el.object3D.position;      
      var direction = new THREE.Vector3( 0, 0, -1 ).applyQuaternion(this.el.object3D.quaternion );
      var endPoint;
      var far = 2;
      
      var menu = this.el.sceneEl.querySelector("#things");
      
      if (menu.getAttribute("visible")) {
        var ray = new THREE.Raycaster(origin,direction,0,far);
        
        var colls = ray.intersectObjects(menu.object3D.children,true);
        
        if (colls.length > 0) {
          endPoint = colls[0].point;
          this.vars.latestColl = colls[0];
        }
      }
      if (endPoint == null) {
        endPoint = this.vectorAdd(origin,this.vectorMultScalar(direction,far));
        if (this.vars.latestColl != null) {
          this.vars.latestColl = null;
        }
      }
      this.vars.line.object3D.position.set(endPoint.x, endPoint.y, endPoint.z);
    }
  },
  
  onButtonPress: function (evt) {
    if (evt.detail.id == 3) {
      this.vars.pointing = !this.vars.pointing;
      this.vars.line.setAttribute("visible", this.vars.pointing);
    }
  },
  
  onGripDown: function (evt) {
    if (this.vars.pointing && this.vars.latestColl != null) {
      this.grabbed = this.vars.latestColl.object.el;
      console.log('grab-start');
      this.grabbed.emit('grab-start', {hand: this.el});
      this.vars.selected = !0;
      this.vars.pointing = !1;
      this.vars.line.setAttribute("visible", this.vars.pointing);
    }
  },
  
  onGripUp: function (evt) {
    if (this.vars.selected) {
      console.log('grab-end');
      this.grabbed.emit('grab-end', {hand: this.el});
      this.grabbed.emit('hover-end', {hand: this.el});
      this.vars.pointing = !0;
      this.vars.selected = !1;
      this.vars.line.setAttribute("visible", this.vars.pointing);
    }
  },
  
  remove: function () {
    this.el.removeEventListener("buttonup", this.onButtonUp, false);
    //document.removeEventListener("copy", this.onCopy, false);
    //document.removeEventListener("paste", this.onPaste, false);
  },
  
  vectorAdd: function (a,b) { return new THREE.Vector3(a.x + b.x, a.y + b.y, a.z + b.z); },
  vectorSub: function (a,b) { return new THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z); },
  vectorMultScalar: function (v,scalar) { return new THREE.Vector3(v.x*scalar,v.y*scalar,v.z*scalar); },
  
});

