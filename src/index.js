import * as THREE from 'three'
import OilPaint from "./oilpaint.js"

var renderer = undefined;
var oilpaint = undefined;

var setup = function() {
  renderer = new THREE.WebGLRenderer({ alpha : true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  oilpaint = new OilPaint(renderer);

}

var update = function() {
  oilpaint.update();
  oilpaint.render();
  requestAnimationFrame(update);
}

setup();
update();
