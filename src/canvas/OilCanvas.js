import THREE from 'n3d-threejs'

class OilCanvas extends THREE.Scene {
  constructor() {
    super();

    this.tex = new THREE.WebGLRenderTarget(
      window.innerWidth, window.innerHeight, {
      minFilter : THREE.LinearFilter,
      magFilter : THREE.LinearFilter
    });
  }

  update(dt) {
    this.children.forEach((object) => {
      if(object.update) object.update(dt);
    });
  }

  render(rdrr, camera) {
    rdrr.render(this, camera, this.tex);
  }

  get texture() { return this.tex; }
}
export default OilCanvas
