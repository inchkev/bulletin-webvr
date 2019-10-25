/**
  A-Frame Component: autoscale

  Author:
      Kevin Chen
      NIST SHIP
      ITL
      7/2/2018
      
    
  Versatility:
      Very
      
  Dependencies:
      None
  
  Description:
      This component automatically resizes an entity to the specified dimensions.
**/

AFRAME.registerComponent('autoscale', {
  schema: {type: 'number', default: 1},

  init: function () { 
    this.test = this.test.bind(this);
    this.el.addEventListener('object3dset', this.test);
  },
  
  test: function () {
    const el = this.el;
    const size = this.data;
    var mesh = el.getObject3D('mesh');
    
    if (!mesh) return;
    var bbox = new THREE.Box3().setFromObject(mesh);
    const scale = size / bbox.getSize().length();
    mesh.scale.set(scale, scale, scale);
  }
});
