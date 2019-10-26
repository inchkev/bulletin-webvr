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
    },

    bindMethods: function() {
      this.onTextPlaced = this.onTextPlaced.bind(this);
      this.placeText = this.placeText.bind(this);
    },

    onTextPlaced: function() {
      console.log('detected enter');
      
      var cam = document.getElementById('cam');
      var position = cam.object3D.position;
      var rotation = cam.object3D.rotation;
      var x = rotation.x;
      var y = rotation.y;

      console.log(position);
      console.log(x);
      console.log(y);
      var text = "If you are working on something that you really care about, you don’t have to be pushed. The vision pulls you."
      this.placeText(x, y, text, 2.5, 2.5, 2);
    },

    placeText: function(x, y, str, r, h, mid) {
      var camheight = 1.6;
      var scene = document.querySelector('a-scene');

      var xpos = -r * Math.sin(y);
      var ypos = r * Math.tan(x) + camheight;
      var zpos = -r * Math.cos(y);
      var rot = y * (180 / Math.PI);
      if (ypos < mid - h/2 || ypos > mid + h/2) {
        console.log('Text placement out of bounds');
        return;
      }

      // console.log(xpos);
      // console.log(ypos);
      // console.log(zpos);
      var text = document.createElement('a-text');
      
      text.setAttribute('position', xpos.toString() + ' ' + ypos.toString() + ' ' + zpos.toString());
      text.setAttribute('rotation', '0 ' + rot.toString() + ' 0');
      var textvalue = 'color: white; align: center; font: sourcecodepro; width: 1.25; value: ' + str;
      text.setAttribute('text', textvalue);
      text.setAttribute('font', 'sourcecodepro');
      text.setAttribute('wrap-count', 25);

      // text.setAttribute('geometry', 'primitive: plane; height: auto; width: auto');
      // text.setAttribute('material', 'color: #FFFFFF');

      scene.appendChild(text);
    }
  });
