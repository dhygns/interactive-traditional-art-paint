import * as THREE from 'three'

class OilCanvas extends THREE.Scene {
  constructor(rdrr) {
    super();

    this.rdrr = rdrr;

    this.tex = new THREE.WebGLRenderTarget(
      window.innerWidth, window.innerHeight, {
      minFilter : THREE.LinearFilter,
      magFilter : THREE.LinearFilter
    });

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 15.0

    this.object = new THREE.Object3D();
    this.object.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 2.0),
      new THREE.MeshBasicMaterial({ map : this.tex })
    ));
    this.scene.add(this.object);
  }

  start(t, tex) {
    this.children.forEach((object) => {
      if(object.init) {
        object.init(t);
        object.texture = tex;
      }
    });
  }

  update(t, dt) {
    this.children.forEach((object) => {
      if(object.update) object.update(t, dt);
    });
  }

  render() {
    this.rdrr.autoClear = false;
    this.rdrr.render(this, this.camera, this.tex);
    this.rdrr.autoClear = true;
  }

  get texture() { return this.tex; }
}
export default OilCanvas
