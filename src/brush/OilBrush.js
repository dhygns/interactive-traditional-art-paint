import * as THREE from 'three'
import Fur from './OilBrushFur.js'

class OilBrush extends THREE.Object3D {
  constructor(texture) {
    super();

    this.radian = {};

    for(var idx = 0; idx < 10; idx++) this.add(new Fur(texture));
    this.start();
  }

  _random() { return (-0.5 + Math.random()) * Math.PI * 2.0; }

  start() {
    const d = Math.random() * Math.random() * 9.0;
    const r = Math.random() * Math.PI * 2.0;
    const x = d * Math.sin(r);
    const y = d * Math.cos(r);
    this.position.x = x;
    this.position.y = y;

    const len = x*x + y*y;
    this.lifetime = 0.1 + len * 0.1;

    this.radian.value = this._random();
    this.radian.velocity = this._random() * 0.2;
    this.radian.accelate = this._random() * 0.1;
    this.radian.speed = 0.01 + Math.random() * 0.01;

    this.children.forEach((obj) => {
      if(obj.start) obj.start(this.position.x / 10.0 + 0.5, this.position.y / 10.0 + 0.5);
    });
  }

  end() {
    this.radian.velocity = 0.0;
    this.radian.accelate = 0.0;
    this.children.forEach((obj) => {
      if(obj.end) obj.end();
    });
    this.start();
  }

  update(dt) {
    if(this.lifetime < 0.0) this.end();

    this.radian.velocity += this.radian.accelate * dt;
    this.radian.value += this.radian.velocity * dt;

    this.rotation.z = this.radian.value;
    //
    this.position.x += this.radian.speed * Math.sin(this.radian.value);
    this.position.y += this.radian.speed * Math.cos(this.radian.value);

    this.children.forEach((obj) => {
      if(obj.update) { obj.update(dt); }
    });
    // console.log(dt);
    this.lifetime -= dt;
  }

}

export default OilBrush
