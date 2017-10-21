import * as THREE from 'three'
import Fur from './OilBrushFur.js'

class OilBrush extends THREE.Object3D {
  constructor() {
    super();

    this.radian = {};

    for(var idx = 0; idx < 10; idx++) this.add(new Fur());
    this.start();
  }

  _random() { return (-0.5 + Math.random()) * Math.PI * 2.0; }

  start(t) {
    const et = t - this.time;
    const rt = Math.max(0.0, 10.0 - et * 0.2);

    const d = Math.random() * Math.random() * 20.0;
    const r = Math.random() * Math.PI * 2.0;
    const x = Math.random() * 14.0 - 7.0;//d * Math.sin(r);
    const y = Math.random() * 14.0 - 7.0;//d * Math.cos(r);
    this.position.x = x;
    this.position.y = y;

    const len = x*x + y*y;
    const sed = Math.random() * rt;

    this.scale.x = 0.2 + sed * 0.25;
    this.scale.y = 0.2 + sed * 0.25;
    
    this.lifetime = 0.1 + sed * 3.0 ;

    this.radian.value = this._random();
    this.radian.velocity = this._random() * 0.2;
    this.radian.accelate = this._random() * 0.1;
    this.radian.speed = 0.01 + Math.random() * 0.01;

    this.children.forEach((obj) => {
      if(obj.start) obj.start(this.position.x / 14.0 + 0.5, this.position.y / 14.0 + 0.5);
    });
  }

  init(t) {
    this.time = t;
    this.start(t);
  }

  end(t) {
    
    this.radian.velocity = 0.0;
    this.radian.accelate = 0.0;
    this.children.forEach((obj) => {
      if(obj.end) obj.end();
    });
  }

  update(t, dt) {
    if(this.lifetime < 0.0) {
      this.end(t);
      this.start(t);
    }

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

  set texture(tex) {
    this.children.forEach((obj) => {
      obj.texture = tex;
    }); 
  }
}

export default OilBrush
