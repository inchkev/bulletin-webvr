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

      this.placeText(x, y, "Hello, World!");
    },

    placeText: function(x, y, str) {
      var r = 3;
      var h = 3;
      var mid = 2;
      var cam = 1.6;
      var scene = document.querySelector('a-scene');

      var text = document.createElement('a-entity');
      var xpos = -r * Math.sin(y);
      var ypos = r * Math.tan(x) + cam;
      var zpos = -r * Math.cos(y);
      console.log(xpos);
      console.log(ypos);
      console.log(zpos);
      text.setAttribute('position', xpos.toString() + ' ' + ypos.toString() + ' ' + zpos.toString());
      text.setAttribute('geometry', 'primitive: box; acolor: red');
      // text.setAttribute('text', 'value: ' + str + '; width: 40; color: black');

      scene.appendChild(text);

    }
  });
