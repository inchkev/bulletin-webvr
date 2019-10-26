AFRAME.registerComponent('bulletin-text', {
  
    init: function () {
      var el = this.el;

      // poll database of messages
      this.bindMethods();
      this.el.addEventListener('loaded', this.load.bind(this));
    },
    
    load: function() {
      var scene = document.querySelector('a-scene');

      scene.addEventListener('textPlace', this.onTextPlaced);

      // var board = document.createElement('a-entity');
      // board.setAttribute('geometry', 'primitive: cylinder; height: 3; radius: 3; open-ended: true');
      // board.setAttribute('material', 'color: #F7B860; opacity: 0.7; side: double');
      // board.setAttribute('position', '0 2 0');

      // scene.appendChild(board);
    },

    bindMethods: function() {
      this.onTextPlaced = this.onTextPlaced.bind(this);
    },

    onTextPlaced: function() {
      var cam = document.getElementById('cam');
      console.log('detected enter');
      var position = cam.object3D.position;
      var rotation = cam.object3D.rotation;
      console.log(position);
      console.log(rotation.x);
      console.log(rotation.y);
    }
  });