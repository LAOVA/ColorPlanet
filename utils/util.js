const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//RGB转轮盘角度
let rgbToHsl = function(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; 
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
  
  let hslToRgb = function(h, s, l) {
    var r, g, b;
    if (s == 0) {
      r = g = b = l; 
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  
  let drawRing = function(ctx, width, height) {
    // 画圆环
    var radius = width / 2;
    var toRad = (2 * Math.PI) / 360;
    var step = 0.1;
    for (var i = 0; i < 360; i += step) {
      var rad = i * toRad;
      var color = hslToRgb(i / 360, 1, 0.5);
      ctx.strokeStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.lineTo(radius + radius * Math.cos(rad), radius + radius * Math.sin(rad));
      ctx.stroke();
    }
  
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.strokeStyle = 'rgb(0, 255, 255)';
    ctx.beginPath();
    ctx.arc(radius, radius, radius * 0.65, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.draw();
  };
  
  let drawSlider = function(ctx, width, height, angle) {
    var radius = width / 2;
  
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
  
    var color = hslToRgb(angle, 1, 0.5);
  
    ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.rotate((angle * 360) * Math.PI / 180);
  
    ctx.beginPath()
    ctx.setLineWidth(height * 0.015);
    //圆心的 x 坐标  , 圆心的 Y 坐标 , 圆的半径
    ctx.arc(height * 0.41, 0, 17, 0, 2 * Math.PI)
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.stroke()
  
    ctx.draw();
    ctx.restore();
  };

  export function rgbToHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B) }
  export function toHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return "00";
    n = Math.max(0, Math.min(n, 255));
    return "0123456789ABCDEF".charAt((n - n % 16) / 16)
      + "0123456789ABCDEF".charAt(n % 16);
  }
  export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }


module.exports = {
  formatTime,
  rgbToHsl: rgbToHsl,
  hslToRgb: hslToRgb,
  drawRing: drawRing,
  drawSlider: drawSlider,
  //getColor : getColor,
  rgbToHex : rgbToHex,
  hexToRgb : hexToRgb,
}
