var m3 = {
  identity: function(){
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0*3+0], a01 = a[0*3+1], a02 = a[0*3+2];
    var a10 = a[1*3+0], a11 = a[1*3+1], a12 = a[1*3+2];
    var a20 = a[2*3+0], a21 = a[2*3+1], a22 = a[2*3+2];

    var b00 = b[0*3+0], b01 = b[0*3+1], b02 = b[0*3+2];
    var b10 = b[1*3+0], b11 = b[1*3+1], b12 = b[1*3+2];
    var b20 = b[2*3+0], b21 = b[2*3+1], b22 = b[2*3+2];

    return [
        b00*a00 + b01*a10 + b02*a20,  b00*a01 + b01*a11 + b02*a21,  b00*a02 + b01*a12 + b02*a22,
        b10*a00 + b11*a10 + b12*a20,  b10*a01 + b11*a11 + b12*a21,  b10*a02 + b11*a12 + b12*a22,
        b20*a00 + b21*a10 + b22*a20,  b20*a01 + b21*a11 + b22*a21,  b20*a02 + b21*a12 + b22*a22,
    ];
},

  translation: function(tx,ty){
    return [
      1,  0,  0,
      0,  1,  0,
      tx, ty, 1
    ];
  },

  scaling: function(sx,sy){
    return [
      sx, 0,  0,
      0,  sy, 0,
      0,  0,  1
    ];
  },

  rotation: function(angleInRadians){
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
        c, s, 0,
       -s, c, 0,
        0, 0, 1
    ];
  },

  translate: function(m,tx,ty){
    var t = m3.translation(tx,ty);
    return m3.multiply(t,m);
  },

  scale: function(m,sx,sy){
    var s = m3.scaling(sx,sy);
    return m3.multiply(s,m);
  },

  rotate: function(m,angleInRadians){
    var r = m3.rotation(angleInRadians);
    return m3.multiply(r,m);
  },

  setClippingWindow: function(xw_min, yw_min, xw_max, yw_max) {
    // Create the clipping matrix
    var clippingMatrix = [
      2 / (xw_max-xw_min), 0, 0,
      0, 2 / (yw_max-yw_min), 0,
      -(xw_max + xw_min) / (xw_max - xw_min), -(yw_max + yw_min) / (yw_max - yw_min), 1
    ];

    return clippingMatrix;
  }
  
};