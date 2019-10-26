AFRAME.registerComponent('bulletin', {
  
    init: function () {
      // poll database of messages

      this.el.addEventListener('loaded', this.load.bind(this));
    },
    
    load: function() {
      var scene = document.querySelector('a-scene');

      var board = document.createElement('a-entity');
      board.setAttribute('geometry', 'primitive: cylinder; height: 3; radius: 3; open-ended: true');
      board.setAttribute('material', 'color: #F7B860; opacity: 0.7; side: double');
      board.setAttribute('position', '0 2 0');

      scene.appendChild(board);
    }
  });