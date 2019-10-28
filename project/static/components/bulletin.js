AFRAME.registerComponent('bulletin', {

    init: function () {
      this.bindMethods();
      this.el.addEventListener('loaded', this.load.bind(this));
    },

    load: function() {
      var scene = document.querySelector('a-scene');
      this.initBulletin(3, 3, 2);
    },

    bindMethods: function() {
      this.initBulletin = this.initBulletin.bind(this);
    },

    initBulletin: function(h, r, mid) {
      var scene = document.querySelector('a-scene');

      var board = document.createElement('a-entity');
      board.setAttribute('geometry', 'primitive: cylinder; height: ' + h + '; radius: ' + r + '; open-ended: true');
      board.setAttribute('material', 'color: #F7B860; opacity: 0.7; side: double');
      board.setAttribute('position', '0 ' + mid + ' 0');
      scene.appendChild(board);
    }
  });
