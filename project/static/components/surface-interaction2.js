AFRAME.registerComponent('surface-ui', {
  schema: {
    interval: {default: 100},
    interaction: {default: true} // doesn't do anything!
  },
  
  dependencies: [''],
  
  init: function() {
    var el = this.el;
    this.bsphereEl;
    this.size;
    this.scale;
    this.controllerName;
    this.gripped = false;
    this.axisMoved = false;
    
    this.bindMethods();
    this.constraints = new Map();
    
    this.bsphereEl = document.createElement('a-box');
    el.appendChild(this.bsphereEl);
    this.bsphereEl.setAttribute('id', 'surface-bbox');
    
    el.addEventListener('object3dset', this.initSurface);
    
    el.sceneEl.addEventListener('controllerconnected', this.onControllerConnected);
    this.bsphereEl.addEventListener('raycaster-triggerdown', this.onButtonClicked);
    this.bsphereEl.addEventListener('raycaster-triggerup', this.onButtonCleared);
  },
  
  bindMethods: function() {
    this.initSurface = this.initSurface.bind(this);
    this.autoscale = this.autoscale.bind(this);
    this.initBbox = this.initBbox.bind(this);
    
    this.onButtonHovered = this.onButtonHovered.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.onButtonCleared = this.onButtonCleared.bind(this);
    this.onAxisMoved = this.onAxisMoved.bind(this);
    this.vectorAdd = this.vectorAdd.bind(this);
    this.vectorSub = this.vectorSub.bind(this);
    this.vectorMultScalar = this.vectorMultScalar.bind(this);
    
    this.syncUI = this.syncUI.bind(this);
    this.addAxesLabels = this.addAxesLabels.bind(this);
    this.onShaderChanged = this.onShaderChanged.bind(this);
    this.onScaleChanged = this.onScaleChanged.bind(this);
    this.onHighlighted = this.onHighlighted.bind(this);
  },
  
  initSurface: function () {
    var el = this.el;
    var bsphereEl = this.bsphereEl;
    
    this.autoscale();
    this.initBbox();
    this.addAxesLabels();
    
    el.setAttribute('dynamic-body', 'true');
    el.setAttribute('sleepy', {allowSleep: true,
                               angularDamping: 0.1,
                               speedLimit: 1,
                               linearDamping: 0.80});
    el.setAttribute('collision-filter', {group: 'surface',
                                         collidesWith: 'default, hands'});
    
    el.addEventListener('shader-changed', this.onShaderChanged);
    el.addEventListener('scale-changed', this.onScaleChanged);
    el.addEventListener('surface-highighted', this.onHighlighted);
  },
  
  autoscale: function() {
    var el = this.el;
    var data = this.data.scale;
    var mesh = el.getObject3D('mesh');
    var self = this;
    
    if (!mesh) { return; }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.geometry.computeBoundingBox();
        this.size = node.geometry.boundingBox.getSize();
        console.log(this.size);
        var scale = data / this.size.length();
        this.scale = new THREE.Vector3(scale, scale, scale);
//        el.setAttribute('scale', this.scale);
//        mesh.scale.set(scale, scale, scale);
        el.object3D.scale.set(scale, scale, scale);
      }
    })
  },
  
  initBbox: function() {
    var el = this.el;
    var size = this.size;
    var bsphereEl = this.bsphereEl;
    console.log('size');
    console.log(size);
    var scale = this.scale;
    console.log(size);
    console.log(scale);
    
    bsphereEl.classList.add('bbox');
//    this.bsphereEl.setAttribute('scale', new THREE.Vector3(this.size.x, this.size.y, this.size.z));
//    this.bsphereEl.getObject3D('mesh').scale.set(this.size.x, this.size.y, this.size.z);
    bsphereEl.object3D.scale.set(size.x, size.y, size.z);
    bsphereEl.setAttribute('material', 'opacity: 0.2; transparent: true');
    
  },
  
  tick: function(time) {
    var el = this.el;
    var data = this.data;
    var prevCheckTime = this.prevCheckTime;
    if (prevCheckTime && (time - prevCheckTime < data.interval)) { return; }
    
    if (this.axisMoved) {
      var direction = this.direction;
      console.log(this.dis);
      this.el.setAttribute('constraint', {distance: this.dis+=1,
                                         target: this.handEl});
//      this.el.object3D.position.sub(direction);
//      var elVec = el.object3D.position;
//      this.el.setAttribute('position', {x: elVec.x + direction.x,
//                                        y: elVec.y + direction.y,
//                                        z: elVec.z + direction.z});
      this.el.components['dynamic-body'].syncToPhysics();
      this.axisMoved = false;
    }
  },
  
  onControllerConnected: function (evt) {
    this.controllerName = evt.detail.name;
  },
  
  onButtonHovered: function (evt) {
    
  },
   
  onButtonClicked: function (evt) {    
    if (!this.gripped) {
      var el = this.el;
      var handEl = evt.detail.el;
      
      this.gripped = true;
      el.emit('grab-start', {hand: handEl});
      handEl.addEventListener('scroll', this.onAxisMoved);
    }
  },
  
  onButtonCleared: function (evt) {
    var el = this.el;
    var handEl = evt.detail.el;
    
    this.gripped = false;
    el.emit('grab-end', {hand: handEl});
    
    handEl.removeEventListener('scroll', this.onAxisMoved);
  },
  
  vectorAdd: function (a, b) {
    return new THREE.Vector3(a.x+b.x, a.y+b.y, a.z+b.z);
  },
  
  vectorSub: function (a, b) {
    return new THREE.Vector3(a.x-b.x, a.y-b.y, a.z-b.z);
  },
  
  vectorMultScalar: function (v, scalar) {
    return new THREE.Vector3(v.x*scalar, v.y*scalar,v.z*scalar);
  },
  
  syncUI: function () {
    console.log('si-syncui');
    return;
    //nothing yet
  }
});