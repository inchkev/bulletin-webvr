/**
  A-Frame Component: sides

  Author:
      Paul Armstrong
      NIST SURF
      ITL
      7/26/2017
      
      Edited by
      Kevin Chen
      NIST SHIP
      ITL
      7/2/2018
      
    
  Versatility:
      This component is very modular. It depends on nothing.
    
  Dependencies:
      None
  
  Description:
      This component attempts to update the entity's material's side property
      each time the schema is updated, or model-loaded is emitted.
**/

AFRAME.registerComponent('sides', {
  schema: {type: 'int', default: 2},
  
  init: function () {
    this.el.addEventListener('object3dset', this.update.bind(this));
  },
  
  update: function() {
    const el = this.el;
    const data = this.data;
    var mesh = el.getObject3D('mesh');
    
    if (!mesh) { return; }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.material.side = data;
      }
    });
    
    /*
    const el = this.el;
    const data = this.data;
    var mesh = el.getObject3D('mesh');

    if (!mesh) { return; }
    mesh.traverse((node) => {
      if (node.isMesh) {
        // do stuff to nodes
      }
    });
    */
  }
});
