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
      this.addTextWithID = this.addTextWithID.bind(this);
      this.removeTextWithID = this.removeTextWithID.bind(this);
    },

    onTextPlaced: function() {
      var cam = document.getElementById('cam');
      var position = cam.object3D.position;
      var rotation = cam.object3D.rotation;
      var x = rotation.x;
      var y = rotation.y;

      var r = 2.5;
      var h = 2.5;
      var mid = 2;
      var camheight = 1.6;
      var ypos = r * Math.tan(x) + camheight;

      if (ypos < mid - h/2 || ypos > mid + h/2) {
        console.log('Text placement out of bounds');
        return 1;
      }

      var id = 1234;
      var text = "If you are working on something that you really care about, you don’t have to be pushed. The vision pulls you."
      
      this.addTextWithID(x, y, text, id);
    },

    addTextWithID: function(x, y, str, id) {
      var scene = document.querySelector('a-scene');
      var text = document.createElement('a-text');

      var r = 2.5;
      var camheight = 1.6;
      
      var xpos = -r * Math.sin(y);
      var ypos = r * Math.tan(x) + camheight;
      var zpos = -r * Math.cos(y);
      var rot = y * (180 / Math.PI);

      text.setAttribute('id', id);
      text.setAttribute('position', xpos.toString() + ' ' + ypos.toString() + ' ' + zpos.toString());
      text.setAttribute('rotation', '0 ' + rot.toString() + ' 0');
      var textvalue = 'color: white; align: center; width: 1.25; value: ' + str;
      text.setAttribute('text', textvalue);
      text.setAttribute('font', 'sourcecodepro');
      text.setAttribute('wrap-count', 25);
      scene.appendChild(text);

      // text.setAttribute('geometry', 'primitive: plane; height: auto; width: auto');
      // text.setAttribute('material', 'color: #FFFFFF');
    },

    removeTextWithID: function(id) {
      var elem = document.getElementById(id);
      var scene = document.querySelector('a-scene');
      if (elem == null) {
        return 1;
      } else {
        return scene.removeChild(elem);
      }
    }
  });
