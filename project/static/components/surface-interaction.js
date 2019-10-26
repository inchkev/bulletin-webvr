AFRAME.registerComponent('surface-interaction', {
  schema: {
    src: {default: ""},
    scale: {default: 1.0},
    interval: {default: 100},
    interaction: {default: true} // doesn't do anything!
  },
  
  dependencies: ['shader-library'],
  
  init: function() {
    var el = this.el;
    var data = this.data;
    
    this.bboxEl;
    this.size;
    this.scale;
    this.controllerName;
    this.gripped = false;
    this.axisMoved = false;
    this.dis = 0;
    
    this.bindMethods();
    //this.constraints = new Map();
    
    this.el.setAttribute('gltf-model', '../'+data.src+'');
    el.addEventListener('model-loaded', this.initSurface);
    
    el.sceneEl.addEventListener('controllerconnected', this.onControllerConnected);
    el.addEventListener('grab-start', function () { this.gripped = true; });
    el.addEventListener('grab-end', function () { this.gripped = false; });
  },
  
  bindMethods: function() {
    this.initSurface = this.initSurface.bind(this);
    this.autoscale = this.autoscale.bind(this);
    this.initBbox = this.initBbox.bind(this);
    
    this.onSurfaceGripped = this.onSurfaceGripped.bind(this);
    this.onSurfaceCleared = this.onSurfaceCleared.bind(this);
    this.onAxisMoved = this.onAxisMoved.bind(this);
    this.onHovered = this.onHovered.bind(this);
    this.onHoveredCleared = this.onHoveredCleared.bind(this);
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
    
    this.autoscale();
    this.initBbox();
    this.addAxesLabels();
    
    el.setAttribute('dynamic-body', 'true');
    el.setAttribute('sleepy', {allowSleep: true,
                               angularDamping: -0.5,
                               speedLimit: 1,
                               linearDamping: 0.9});
    el.setAttribute('collision-filter', {group: 'surface',
                                         collidesWith: 'default, hands'});
    
    this.bboxEl.addEventListener('raycaster-gripdown', this.onSurfaceGripped);
    this.bboxEl.addEventListener('raycaster-gripup', this.onSurfaceCleared);
    this.bboxEl.addEventListener('raycaster-hoveron', this.onHovered);
    this.bboxEl.addEventListener('raycaster-hoveroff', this.onHoveredCleared);
    
    el.addEventListener('shader-changed', this.onShaderChanged);
    el.addEventListener('scale-changed', this.onScaleChanged);
    el.addEventListener('surface-highighted', this.onHighlighted);
  },
  
  autoscale: function() {
    var el = this.el;
    var data = this.data;
    var mesh = el.getObject3D('mesh');
    
    if (!mesh) { return; }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.geometry.computeBoundingBox();
        this.size = node.geometry.boundingBox.getSize();
        var scale = data.scale / this.size.length();
        this.scale = new THREE.Vector3(scale, scale, scale);
        mesh.scale.set(scale, scale, scale);
      }
    });
    
    console.log(this.size);
    console.log(this.scale);
  },
  
  initBbox: function() {
    var el = this.el;
    var size = this.size;
    var scale = this.scale;
    
    var bboxEl = document.createElement('a-box');
    el.appendChild(bboxEl);
    bboxEl.setAttribute('id', 'surface-bbox');
    
    bboxEl.classList.add('bbox');
//    bboxEl.setAttribute('scale', new THREE.Vector3(size.x*scale.x, size.y*scale.y, size.z*scale.z));
//    bboxEl.getObject3D('box3').scale.set(size.x*scale.x, size.y*scale.y, size.z*scale.z);
    bboxEl.object3D.scale.set(size.x*scale.x, size.y*scale.y, size.z*scale.z);
    console.log(size.x*scale.x + ', ' + size.y*scale.y + ', ' + size.z*scale.z);
    bboxEl.setAttribute('material', {opacity: 0.00,
                                     transparent: true,
                                     color: 'white',
                                     depthTest: false,
                                     side: 'double'});
    
    // Create the lines for axes.
    var lineID = 1;
    var sides = [size.z*scale.z, size.y*scale.y, size.x*scale.x];
    for (var i = 0; i < sides.length; i++) {
      for (j of [0.5, -0.5]) {
        for (k of [0.5, -0.5]) {
          var one = [sides[(i+2)%3]*j, sides[(i+1)%3]*k, sides[i]*0.5];
          var two = [sides[(i+2)%3]*j, sides[(i+1)%3]*k, sides[i]*(-0.5)];
          el.setAttribute('line__' + lineID,
            {start: new THREE.Vector3(one[i], one[(i+1)%3], one[(i+2)%3]),
             end: new THREE.Vector3(two[i], two[(i+1)%3], two[(i+2)%3]),
             color: 'white'});
          lineID = lineID + 2;
        }
      }
    }
    
    this.bboxEl = bboxEl;
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
   
  onSurfaceGripped: function (evt) {    
    if (!this.gripped) {
      var el = this.el;
      var handEl = evt.detail.el;
      
      this.gripped = true;
      el.emit('grab-start', {hand: handEl});
      handEl.addEventListener('scroll', this.onAxisMoved);
    }
  },
  
  onSurfaceCleared: function (evt) {
    var el = this.el;
    var handEl = evt.detail.el;
    
    this.gripped = false;
    el.emit('grab-end', {hand: handEl});
    
    handEl.removeEventListener('scroll', this.onAxisMoved);
  },
  
  onAxisMoved: function (evt) {
    return;
    var el = this.el;
    var handEl = evt.target;
    var xAxis = evt.detail.axis[0];
    var yAxis = evt.detail.axis[1];
    
    console.log('x' + xAxis + ', y' + yAxis);
    
    var elVec = el.object3D.position;
    var handVec = handEl.object3D.position;
    console.log(elVec);
    console.log(handVec);
    
    var direction = this.vectorSub(handVec, elVec);
    direction.normalize();
    direction = this.vectorMultScalar(direction, yAxis*Math.abs(yAxis)*(-0.05));
    
    this.direction = direction;
    if (!this.axisMoved) {
//      let constraintId = this.constraints.get(evt.target);
//      this.el.removeAttribute('constraint__' + constraintId);
//      this.constraints.delete(evt.target);
      
//      el.removeAttribute('constraint');
//      el.removeAttribute('dynamic-body');
      this.axisMoved = true;
      this.handEl = evt.target;
    }
  },
  
  onHovered: function (evt) {
    var el = this.el;
    var handEl = evt.detail.el;
    
    console.log('hoveron');
  },
  
  onHoveredCleared: function (evt) {
    var el = this.el;
    var handEl = evt.detail.el;
    console.log('hoveroff');
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
  },
  
  addAxesLabels: function () {
    var el = this.el;
  },
  
  onShaderChanged: function (evt) {
    var el = this.el;
    return;
  },
  
  onScaleChanged: function (evt) {
    var el = this.el;
    return;
  },
  
  onHighlighted: function (evt) {
    var el = this.el;
    var bboxEl = this.bboxEl;
    return;
  }
});