AFRAME.registerComponent('surface-ui', {
  schema: {
    radius: {default: 0.5},
    interval: {default: 100},
    menu_vis: {default: false},
    interaction: {default: true} // doesn't do anything!
  },
  
  dependencies: [''],
  
  init: function() {
    var el = this.el;
    var data = this.data;
    
    this.bsphereEl;
    this.menuEl;
    this.radius = this.data.radius;
    this.controllerName;
    this.clicked = false;
    this.axisMoved = false;
    
    this.bindMethods();  
    this.string = this.el.getAttribute('gltf-model', 'string');
    
    
    el.addEventListener('model-loaded', this.initUI);
    
    el.sceneEl.addEventListener('controllerconnected', this.onControllerConnected);
//    this.menuEl.addEventListener('raycaster-triggerdown', this.onButtonClicked);
//    this.menuEl.addEventListener('raycaster-triggerup', this.onButtonCleared);
  },
  
  bindMethods: function() {
    this.initUI = this.initUI.bind(this);
    this.initBsphere = this.initBsphere.bind(this);
    this.initInfo = this.initInfo.bind(this);
    this.initMenu = this.initMenu.bind(this);
    
    this.getBoundingSphere = this.getBoundingSphere.bind(this);
    this.onButtonHovered = this.onButtonHovered.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.onButtonCleared = this.onButtonCleared.bind(this);
    this.vectorAdd = this.vectorAdd.bind(this);
    this.vectorSub = this.vectorSub.bind(this);
    this.vectorMultScalar = this.vectorMultScalar.bind(this);
    
    this.syncUI = this.syncUI.bind(this);
  },
  
  initUI: function () {
    var el = this.el;
    var menuEl = this.menuEl;
    
    //this.getBoundingSphere();
    this.initBsphere();
    this.initInfo();
    this.initMenu();
    //this.initJson();
    
//    el.setAttribute('dynamic-body', 'true');
//    el.setAttribute('sleepy', {allowSleep: true,
//                               angularDamping: 0.1,
//                               speedLimit: 1,
//                               linearDamping: 0.85});
//    el.setAttribute('collision-filter', {group: 'surface',
//                                         collidesWith: 'default, hands'});
//    
//    el.addEventListener('shader-changed', this.onShaderChanged);
//    el.addEventListener('scale-changed', this.onScaleChanged);
//    el.addEventListener('surface-highighted', this.onHighlighted);
  },
  
  getBoundingSphere: function () {
    var el = this.el;
    var mesh = el.getObject3D('mesh');
    
    if (!mesh) { return; }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.geometry.computeBoundingSphere();
        this.radius = node.geometry.boundingSphere.radius;
      }
    })
  },
  
  initBsphere: function () {
    var el = this.el;
    var radius = this.radius;
    
    var bsphereEl = document.createElement('a-sphere');
    bsphereEl.setAttribute('id', 'surface-bsphere');
    el.appendChild(bsphereEl);
    
    bsphereEl.classList.add('bsphere');
    console.log(radius);
    bsphereEl.setAttribute('radius', this.radius);
    bsphereEl.setAttribute('material', {opacity: 0.00,
                                        transparent: true,
                                        color: 'black',
                                        depthTest: false,
                                        side: 'double'});
    
    this.bsphereEl = bsphereEl;
  },
  
  initInfo: function () {
    var el = this.el;
    var bsphereEl = this.bsphereEl;
    var radius = this.radius;
    var title = document.createElement('a-entity');
    
    this.bsphereEl.appendChild(title);
    title.setAttribute('id', 'title-text');
    title.object3D.position.set(0, 0.17, 0.17);
    title.setAttribute('geometry', {primitive: 'plane',
                                    width: 0.45,
                                    height: 0.06});
    title.setAttribute('material', {opacity: 0.75,
                                    transparent: true,
                                    color: '#333333',
                                    depthTest: false,
                                    side: 'double'});
    title.setAttribute('text', {align: 'center',
                                color: 'white',
                                value: this.string,
                                width: 1});
  },
  
  initMenu: function () {
    
  },
  
  tick: function (time) {
    return;
    var el = this.el;
    var data = this.data;
    var prevCheckTime = this.prevCheckTime;
    if (prevCheckTime && (time - prevCheckTime < data.interval)) { return; }
    
    if (this.axisMoved) {
//      var direction = this.direction;
//      console.log(this.dis);
//      this.el.setAttribute('constraint', {distance: this.dis+=1,
//                                         target: this.handEl});
////      this.el.object3D.position.sub(direction);
////      var elVec = el.object3D.position;
////      this.el.setAttribute('position', {x: elVec.x + direction.x,
////                                        y: elVec.y + direction.y,
////                                        z: elVec.z + direction.z});
//      this.el.components['dynamic-body'].syncToPhysics();
//      this.axisMoved = false;
    }
  },
  
  onControllerConnected: function (evt) {
    this.controllerName = evt.detail.name;
  },
  
  onButtonHovered: function (evt) {
    
  },
   
  onButtonClicked: function (evt) { return;
    if (!this.gripped) {
      var el = this.el;
      var handEl = evt.detail.el;
      
      this.gripped = true;
      el.emit('grab-start', {hand: handEl});
      handEl.addEventListener('scroll', this.onAxisMoved);
    }
  },
  
  onButtonCleared: function (evt) { return;
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