var shaderChunks = {
  yVertex : [
    'uniform float coolestTemp;',
    'uniform float tempRange;',
    
    'attribute float vertexY;',
    
    'varying float temperature;',
    
    'void main() {',
      'temperature = (vertexY - coolestTemp) / tempRange;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n'),
  
  xyzVertex : [
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
}

var temperature = {
  uniforms: {
    coolestTemp : { type : 'f', value : 0 },
    tempRange : { type : 'f', value : 1 },
    coolestColor : { type : 'v3', value : new THREE.Vector4(0.0, 0.0, 1.0) },
    hottestColor : { type : 'v3', value : new THREE.Vector4(1.0, 0.0, 0.0) }
  },
  
  vertexShader: shaderChunks.yVertex,
  
  fragmentShader: [
    '',
    'uniform vec3 coolestColor;',
    'uniform vec3 hottestColor;',
    'varying float temperature;',

    'void main() {',
      'vec3 color = mix(coolestColor, hottestColor, temperature);',
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
  
  vertexShader: shaderChunks.yVertex,
  
  fragmentShader: [
    'varying float temperature;',

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

      'gl_FragColor = vec4(color, 1.0);',
    '}'
  ].join('\n'),
}

var rgbcube = {
  uniforms: {
    coolestTemp : { type : 'f', value : 0 },
    tempRange : { type : 'f', value : 1 },
  },
  
  vertexShader: shaderChunks.xyzVertex,
  
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
  
  vertexShader: shaderChunks.xyzVertex,
  
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
  
  vertexShader: shaderChunks.xyzVertex,
  
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

var reversehsvcube = {
  uniforms: {
    coolestTemp : { type : 'f', value : 0 },
    tempRange : { type : 'f', value : 1 },
  },
  
  vertexShader: shaderChunks.xyzVertex,
  
  fragmentShader: [
    '',
    'uniform vec3 coolestColor;',
    'uniform vec3 hottestColor;',
    'varying float tempX;',
    'varying float tempY;',
    'varying float tempZ;',
    
    'vec3 rgb2hsv(vec3 c) {',
      'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);',
      'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));',
      'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));',
      'float d = q.x - min(q.w, q.y);',
      'float e = 1.0e-10;',
      'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);',
    '}',
    
    'void main() {',
      'vec3 color;',
      'color.r = tempX;',
      'color.g = tempZ;',
      'color.b = tempY;',
      'gl_FragColor = vec4(rgb2hsv(color), 1.0);',
    '}',
    ''
  ].join('\n'),
}
