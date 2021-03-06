function writeImageDataToCanvas(canvas, data, width, height) {
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext("2d");
  var imageData = context.createImageData(width, height);
  imageData.data.set(data);
  context.putImageData(imageData, 0, 0);
  return canvas;
}

function randInt() {
  return Math.floor(Math.random() * 256);
}
const h = 600,
  w = 1800;
var init = true;
function refresh() {
    if (init) {
      _ioSetDouble(3, zoom);
      init = false;
    }

  writeImageDataToCanvas(
    document.getElementById("main_canvas"),
    new Uint8Array(Module.HEAPU8.buffer, _getTestData(), w * h * 4),
    w,
    h
  );
}
window.onload = function () {
  function test() {
    refresh();
  }
  setInterval(test, 16);
};

var zoom = 20;
function wheel(event) {
  event.preventDefault();
  zoom += zoom * event.deltaY * -0.002;
  zoom = Math.max(0.1, zoom);
  document.getElementById("sld_zoom").value = zoom;
  _ioSetDouble(3, zoom);
}

const el = document.getElementById("main_canvas");
el.onwheel = wheel;

// drag
let offset_x = 0;
let offset_y = 0;

let down_x = 0;
let down_y = 0;

let is_down = false;
let can = false;
let start = true;

document.addEventListener("mousemove", dragTree);
document.addEventListener("mousedown", btnDown);
document.addEventListener("mouseup", btnUp);

el.addEventListener(
  "mouseenter",
  function (event) {
    can = true;
  },
  false
);

el.addEventListener(
  "mouseleave",
  function (event) {
    can = false;
  },
  false
);

function btnDown(e) {
  console.log(can);
  if (can) {
    is_down = true;
  }
  down_x = -e.screenX;
  down_y = e.screenY;
}

function btnUp(e) {
  is_down = false;
  offset_x = _ioGetDouble(1);
  offset_y = _ioGetDouble(2);
}

function dragTree(e) {
  let x = -e.screenX;
  let y = e.screenY;

  if (is_down || start) {
    if (start) {
      _ioSetDouble(1, 0);
      _ioSetDouble(2, 0);
    } else {
      if (can) {
        x = (x - down_x) * (1 / zoom) + offset_x;
        y = (y - down_y) * (1 / zoom) + offset_y;

        _ioSetDouble(1, x);
        _ioSetDouble(2, y);

        document.getElementById("sld_x").value = x;
        document.getElementById("sld_y").value = y;
      }
    }
    start = false;
  }
}
