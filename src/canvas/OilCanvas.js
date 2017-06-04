import THREE from 'n3d-threejs'

class OilCanvas extends THREE.Scene {
  constructor() {
    super();

    this.tex = new THREE.WebGLRenderTarget(
      window.innerWidth, window.innerHeight, {
      minFilter : THREE.LinearFilter,
      magFilter : THREE.LinearFilter
    });

    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.scene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 2.0),
      new THREE.MeshBasicMaterial({ map : this.tex })
    ))
  }

  update(dt) {
    this.children.forEach((object) => {
      if(object.update) object.update(dt);
    });
  }

  render(rdrr, camera) {
    rdrr.autoClear = false;
    rdrr.render(this, camera, this.tex);
    rdrr.autoClear = true;
    rdrr.render(this.scene, this.camera);

  }

  get texture() { return this.tex; }
}
export default OilCanvas
