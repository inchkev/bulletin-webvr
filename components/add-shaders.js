var temperature = {
  uniforms: {
    coolestTemp : { type : 'f', value : 0 },
    tempRange : { type : 'f', value : 1 },
    coolestColor : { type : 'v3', value : new THREE.Vector4(0.0, 0.0, 1.0) },
    hottestColor : { type : 'v3', value : new THREE.Vector4(1.0, 0.0, 0.0) }
  },
  
  vertexShader: [
    'uniform float coolestTemp;',
    'uniform float tempRange;',
    
    'attribute float vertexY;',
    
    'varying float temperature;',
    
    'void main() {',
      'temperature = (vertexY - coolestTemp) / tempRange;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n'),
  
  fragmentShader: [
    '',
    'uniform vec3 coolestColor;',
    'uniform vec3 hottestColor;',
    'varying float temperature;',

    'void main() {',
      'vec3 color = mix(coolestColor, hottestColor, temperature);',
      //clippingChunks.fragment.main,
      'gl_FragColor = vec4(color, 1.0);',
    '}',
    ''
  ].join('\n'),
}

var modulus = {
  uniforms: {
    coolestTemp : { type : 'f', value : 0 },
    tempRange : { type : 'f', value : 1 }
  },
  
  vertexShader: [
    'uniform float coolestTemp;',
    'uniform float tempRange;',
    
    'attribute float vertexY;',
    
    'varying float temperature;',
    
    'void main() {',
      'temperature = (vertexY - coolestTemp) / tempRange;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n'),
  
  fragmentShader: [
    'varying float temperature;',

    //clippingChunks.fragment.variables,

    'void main() {',
      'vec3 color;',
      'if (temperature <= 0.25) {',
        'color.r = 0.0;',
        'color.g = temperature / 0.25;',
        'color.b = 1.0;',
      '} else if (temperature <= 0.5 && temperature > 0.25) {',
        'color.r = 0.0;',
        'color.g = 1.0;',
        'color.b = (0.5 - temperature) / 0.25;',
      '} else if (temperature <= 0.75 && temperature > 0.5) {',
        'color.r = (temperature - 0.5) / 0.25;',
        'color.g = 1.0;',
        'color.b = 0.0;',
      '} else if (temperature > 0.75) {',
        'color.r = 1.0;',
        'color.g = (1.0 - temperature) / 0.25;',
        'color.b = 0.0;',
      '}',

      //clippingChunks.fragment.main,

      'gl_FragColor = vec4(color, 1.0);',
    '}'
  ].join('\n'),
}

var rgbcube = {
  uniforms: {
    coolestTemp : { type : 'f', value : 0 },
    tempRange : { type : 'f', value : 1 },
  },
  
  vertexShader: [
    'uniform float coolestTemp;',
    'uniform float tempRange;',
    
    'attribute float vertexX;',
    'attribute float vertexY;',
    'attribute float vertexZ;',
    
    'varying float tempX;',
    'varying float tempY;',
    'varying float tempZ;',
    
    'void main() {',
      'tempX = (vertexX - coolestTemp) / tempRange;',
      'tempY = (vertexY - coolestTemp) / tempRange;',
      'tempZ = (vertexZ - coolestTemp) / tempRange;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n'),
  
  fragmentShader: [
    '',
    'uniform vec3 coolestColor;',
    'uniform vec3 hottestColor;',
    'varying float tempX;',
    'varying float tempY;',
    'varying float tempZ;',

    'void main() {',
      'vec3 color;',
      'color.r = tempX;',
      'color.g = tempY;',
      'color.b = tempZ;',
      'gl_FragColor = vec4(color, 1.0);',
    '}',
    ''
  ].join('\n'),
}

var hslcube = {
  uniforms: {
    coolestTemp : { type : 'f', value : 0 },
    tempRange : { type : 'f', value : 1 },
  },
  
  vertexShader: [
    'uniform float coolestTemp;',
    'uniform float tempRange;',
    
    'attribute float vertexX;',
    'attribute float vertexY;',
    'attribute float vertexZ;',
    
    'varying float tempX;',
    'varying float tempY;',
    'varying float tempZ;',
    
    'void main() {',
      'tempX = (vertexX - coolestTemp) / tempRange;',
      'tempY = (vertexY - coolestTemp) / tempRange;',
      'tempZ = (vertexZ - coolestTemp) / tempRange;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n'),
  
  fragmentShader: [
    '',
    'uniform vec3 coolestColor;',
    'uniform vec3 hottestColor;',
    'varying float tempX;',
    'varying float tempY;',
    'varying float tempZ;',
    
    'float hue2rgb(float f1, float f2, float hue) {',
      'if (hue < 0.0)',
        'hue += 1.0;',
      'else if (hue > 1.0)',
        'hue -= 1.0;',
      'float res;',
      'if ((6.0 * hue) < 1.0)',
        'res = f1 + (f2 - f1) * 6.0 * hue;',
      'else if ((2.0 * hue) < 1.0)',
        'res = f2;',
      'else if ((3.0 * hue) < 2.0)',
        'res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;',
      'else',
        'res = f1;',
      'return res;',
    '}',
    
    'vec3 hsl2rgb(vec3 hsl) {',
      'vec3 rgb;',

      'if (hsl.y == 0.0) {',
        'rgb = vec3(hsl.z);',  // Luminance
      '} else {',
       'float f2;',

        'if (hsl.z < 0.5)',
          'f2 = hsl.z * (1.0 + hsl.y);',
        'else',
          'f2 = hsl.z + hsl.y - hsl.y * hsl.z;',

        'float f1 = 2.0 * hsl.z - f2;',

        'rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));',
        'rgb.g = hue2rgb(f1, f2, hsl.x);',
        'rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));',
      '}',
      'return rgb;',
    '}',
    
    'vec3 hsl2rgb(float h, float s, float l) {',
      'return hsl2rgb(vec3(h, s, l));',
    '}',
    
    'void main() {',
      'vec3 color;',
      'color.r = tempX;',
      'color.g = tempZ;',
      'color.b = tempY;',
      'gl_FragColor = vec4(hsl2rgb(color), 1.0);',
    '}',
    ''
  ].join('\n'),
}

var hsvcube = {
  uniforms: {
    coolestTemp : { type : 'f', value : 0 },
    tempRange : { type : 'f', value : 1 },
  },
  
  vertexShader: [
    'uniform float coolestTemp;',
    'uniform float tempRange;',
    
    'attribute float vertexX;',
    'attribute float vertexY;',
    'attribute float vertexZ;',
    
    'varying float tempX;',
    'varying float tempY;',
    'varying float tempZ;',
    
    'void main() {',
      'tempX = (vertexX - coolestTemp) / tempRange;',
      'tempY = (vertexY - coolestTemp) / tempRange;',
      'tempZ = (vertexZ - coolestTemp) / tempRange;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n'),
  
  fragmentShader: [
    '',
    'uniform vec3 coolestColor;',
    'uniform vec3 hottestColor;',
    'varying float tempX;',
    'varying float tempY;',
    'varying float tempZ;',
    
    'vec3 hsv2rgb(vec3 c) {',
      'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);',
      'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);',
      'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);',
    '}',
    
    'void main() {',
      'vec3 color;',
      'color.r = tempX;',
      'color.g = tempZ;',
      'color.b = tempY;',
      'gl_FragColor = vec4(hsv2rgb(color), 1.0);',
    '}',
    ''
  ].join('\n'),
}

AFRAME.registerComponent('add-shaders', {
  schema: {type: 'string', default:''},
  
  init: function () {
    this.colorToVector = this.colorToVector.bind(this);
    
    this.el.addEventListener('object3dset', this.load.bind(this));
  },
  
  load: function() {
    const el = this.el;
    const shader = this.data;
    var rangeX, rangeY, rangeZ;
    var mesh = el.getObject3D('mesh');
    
    if (shader === "temperature") {
      this.material = new THREE.ShaderMaterial(temperature);
    } else if (shader === "modulus") {
      this.material = new THREE.ShaderMaterial(modulus);
    } else if (shader === "rgbcube") {
      this.material = new THREE.ShaderMaterial(rgbcube);
    } else if (shader === "hslcube") {
      this.material = new THREE.ShaderMaterial(hslcube);
    } else if (shader === "hsvcube") {
      this.material = new THREE.ShaderMaterial(hsvcube);
    } else {
      return;
    }
    
    if (!mesh) { return; }
    
    mesh.traverse((node) => {
      if (node.isMesh) {
        
        node.material = this.material;
        node.material.side = 2;
        
        node.geometry.computeBoundingBox();
        var bbox = node.geometry.boundingBox;
        
//        const el = this.el;
//        const size = this.data;
//        var mesh = el.getObject3D('mesh');
//
//        if (!mesh) return;
//        var bbox = new THREE.Box3().setFromObject(mesh);
//        const scale = size / bbox.getSize().length();
//        mesh.scale.set(scale, scale, scale);

        rangeX = bbox.max.x - bbox.min.x;
        rangeY = bbox.max.y - bbox.min.y;
        rangeZ = bbox.max.z - bbox.min.z;
        
        var vertices = node.geometry.attributes.position.array;
        var vertexX = new Float32Array(vertices.length/3);
        var vertexY = new Float32Array(vertices.length/3);
        var vertexZ = new Float32Array(vertices.length/3);
        
        for (var i = 0; i < vertices.length; i+=3) {
          vertexX[i/3] = (vertices[i] - bbox.min.x) / rangeX;
          vertexY[i/3] = (vertices[i+1] - bbox.min.y) / rangeY;
          vertexZ[i/3] = (vertices[i+2] - bbox.min.z) / rangeZ;
        }

        node.geometry.addAttribute('vertexX', new THREE.BufferAttribute(vertexX, 1));
        node.geometry.addAttribute('vertexY', new THREE.BufferAttribute(vertexY, 1));
        node.geometry.addAttribute('vertexZ', new THREE.BufferAttribute(vertexZ, 1));
      }
    });  
  },
  
  colorToVector: function (color) {
    if (color instanceof Array) {
      return new THREE.Vector3(color[0] / 255, color[1] / 255, color[2] / 255);
    } else if (typeof color == 'string') {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result ? 
      new THREE.Vector3(parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255)
      : null;
    } else {
      return null;
    }
  }
  
});