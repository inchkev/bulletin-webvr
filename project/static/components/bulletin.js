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

      // var banner = document.createElement('a-text');
      // banner.setAttribute('id', 'bulletin-banner');
      // banner.setAttribute('geometry', 'primitive: plane; height: auto; width: 3.75');
      // banner.setAttribute('material', 'color: #FFFFFF');
      //
      // var y = mid + h/2 - 0.5;
      // var z = -r + 0.75;
      // banner.setAttribute('position', '0 ' + y.toString() + ' ' + z.toString());
      //
      // var bannervalue = 'color: white; baseline: center; align: center; width: 4.5; value: ' + text;
      // banner.setAttribute('text', bannervalue);
      // banner.setAttribute('font', 'roboto');
      // banner.setAttribute('wrap-count', 38);
      // scene.appendChild(banner);
    }
  });
