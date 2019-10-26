AFRAME.registerComponent('bulletin-text', {
  
    init: function () {
      // poll database of messages

      this.el.addEventListener('loaded', this.load.bind(this));
    },
    
    load: function() {
      var scene = document.querySelector('a-scene');
      var el = document.createElement('a-box');

      el.setAttribute('mixin', 'note');
      scene.appendChild(el);
      
      // const num = 4;
      // const length = 2.5;
      
      // for (var i = 0; i < this.filesets.length; i++) {
      //   var x = i % num;
      //   var y = ~~(i/num) % num;
      //   var z = ~~(i/(num * num)) % num;
      //   var el = document.createElement('a-entity');
      //   el.setAttribute('gltf-model','url(../../data/'+this.filesets[i%this.filesets.length]+'.glb)');
      //   el.setAttribute('mixin', 'surface');
      //   el.object3D.position.set(length/2 - x*(length/(num-1)),
      //                            length/2 - y*(length/(num-1))+1.6,
      //                            length/2 - z*(length/(num-1))-1.5);
      //   scene.appendChild(el);
      //}

    }
  });