AFRAME.registerComponent('add-collision', {
  dependencies: ['super-hands'],
  
  init: function () {
    this.pulse = this.pulse.bind(this);
    
    
    this.el.sceneEl.addEventListener('toggleRaycast', function () {
      console.log('test');
    });
    
    this.el.addEventListener('model-loaded', this.addevents.bind(this));
  },
  
  addevents: function () {
    const el = this.el;
    var grab = false;
    
    
    el.addEventListener('grab-start', function (e) {
      console.log('grabstart');
      el.setAttribute('model-opacity', '0.75');  // for redundancy
      grab = true;
      this.pulse(e.detail.hand);
    }.bind(this));
    
    el.addEventListener('grab-end', function (e) {
      //console.log('grabend');
      grab = false;
      //pulse(e.detail.hand);
    });
    
    el.addEventListener('hover-start', function (e) {
      console.log('hoverstart');
      el.setAttribute('model-opacity', '0.75');
    });
    
    el.addEventListener('hover-end', function () {
      //console.log('hoverend');
      if (!grab) {
        el.setAttribute('model-opacity', '1');
      }
    });
    
  },
  
  pulse: function (hand) {
    hand.components.haptics.pulse(0.35, 100);
  }
});
