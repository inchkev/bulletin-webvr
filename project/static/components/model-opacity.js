/* A-Frame Component: model-opacity

	Taken from:
  https://stackoverflow.com/questions/43914818/alpha-animation-in-aframe-for-a-object-model
*/

AFRAME.registerComponent('model-opacity', {
  schema: {default: 1.0},
  
  init: function () {
    this.el.addEventListener('object3dset', this.update.bind(this));
  },
  
  update: function () {
    const el = this.el;
    const data = this.data;
    var mesh = el.getObject3D('mesh');
    
    if (!mesh) { return; }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.material.opacity = data;
        node.material.transparent = data < 1.0;
        node.material.needsUpdate = true;
      }
    });
  }
});