import * as THREE from 'three'
import OilCanvas from './canvas/OilCanvas.js'
import OilBrush from './brush/OilBrush.js'
import ShadowCanvas from './blur/Blurring.js'

class OilPaint {
  constructor(rdrr) {
    this.rdrr = rdrr;
    this.oldtime = new Date() * 0.001;
    this.newtime = new Date() * 0.001;
    this.deltime = 0.0;

    // this.camera = new THREE.Camera();
    // this.camera;
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();



    // this.brush = new OilBrush();
    this.tl = new THREE.TextureLoader();        
    this.tl.crossOrigin = '';
    

    {
      this.oilpaint = new OilCanvas(this.rdrr);
      this.oilpaint_canvas = new THREE.Object3D();
      this.oilpaint_canvas.add(new THREE.Mesh(
        new THREE.PlaneGeometry(2.0, 2.0),
        new THREE.MeshBasicMaterial({ transparent: true, map: this.oilpaint.texture })
      ));

      this.scene.add(this.oilpaint_canvas);

      for (var cnt = 0; cnt < 100; cnt++) this.oilpaint.add(new OilBrush());

      this.shadow = new ShadowCanvas(this.rdrr);
      this.shadow_canvas = new THREE.Object3D();
      this.shadow_canvas.add(new THREE.Mesh(
        new THREE.PlaneGeometry(2.0, 2.0),
        new THREE.ShaderMaterial({
          transparent: true,
          uniforms: { unif_texture: { type: "t", value: this.shadow.texture } },
          fragmentShader: `
          uniform sampler2D unif_texture;
          varying vec2 vtex;

          void main(void) {
            vec4 retcol = texture2D(unif_texture, vtex);

            gl_FragColor = vec4(0.0, 0.0, 0.0, retcol.a * 0.5);
          }
          `,
          vertexShader: `
          varying vec2 vtex;
          void main(void) {
            vtex = uv;
            gl_Position = vec4(position + vec3(0.0,-0.05, 0.0), 1.0);
          }
          `

        })
      ));
      this.scene.add(this.shadow_canvas);

      this.oilpaint_canvas.position.z = -0.001;
      this.shadow_canvas.position.z = 0.000;
      this.shadow_canvas.position.y = -0.300;


    }
  }

  update() {
    this.newtime = new Date() * 0.001;
    this.deltime = this.newtime - this.oldtime;
    this.oldtime = new Date() * 0.001;

    if (this.deltime < 0.0 || this.deltime > 0.1) this.deltime = 0.0;

    // console.log(this.canvas)
    if (this.oilpaint) this.oilpaint.update(this.newtime, this.deltime);
    // if(this.shadow) this.oilpaint.update(this.newtime, this.deltime);

  }

  render() {
    if (this.oilpaint) this.oilpaint.render();
    if (this.shadow) this.shadow.render(this.oilpaint.texture, 10);
    this.rdrr.render(this.scene, this.camera);
    // console.log(this.canvas.texture);
  }

  loadTexture(url) {
    this.tl.load(url, (img) => {
      img.minFilter = THREE.LinearFilter;
      img.magFilter = THREE.LinearFilter;

      this.oilpaint.start(new Date() * 0.001, img);
    });
  }
}

export default OilPaint
