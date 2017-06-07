import THREE from 'n3d-threejs'

class Blurring {
  constructor(rdrr) {
    this.rdrr = rdrr;

    const width = window.innerWidth;
    const height =window.innerHeight;

    this.texture_x = new THREE.WebGLRenderTarget(
      width, height, {
        minFilter : THREE.LinearFilter,
        magFilter : THREE.LinearFilter,
      }
    );
    this.texture_y = new THREE.WebGLRenderTarget(
      width, height, {
        minFilter : THREE.LinearFilter,
        magFilter : THREE.LinearFilter,
      }
    );

    this.camera = new THREE.Camera();

    this.unifo_x = { type : "t", value : this.texture_y},
    this.scene_x = new THREE.Scene();
    this.scene_x.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 2.0),
      new THREE.ShaderMaterial({
        uniforms : { unif_texture : this.unifo_x },
        vertexShader : `
        varying vec2 vtex;
        void main(void) {
          vtex = uv;
          gl_Position = vec4(position, 1.0);
        }
        `,
        fragmentShader : `
        uniform sampler2D unif_texture;
        varying vec2 vtex;

        const vec2 cnst_reso = vec2(` + width + `.0, ` + height + `.0);

        void main(void) {
          vec2 offset = vec2(1.0 / cnst_reso.x, 0.0);
          vec4 retcol = vec4(0.0);

          retcol += 0.02 * texture2D(unif_texture, vtex + -3.0 * offset);
          retcol += 0.13 * texture2D(unif_texture, vtex + -2.0 * offset);
          retcol += 0.20 * texture2D(unif_texture, vtex + -1.0 * offset);
          retcol += 0.30 * texture2D(unif_texture, vtex +  0.0 * offset);
          retcol += 0.20 * texture2D(unif_texture, vtex +  1.0 * offset);
          retcol += 0.13 * texture2D(unif_texture, vtex +  2.0 * offset);
          retcol += 0.02 * texture2D(unif_texture, vtex +  3.0 * offset);

          gl_FragColor = retcol;
        }
        `
      })
    ));
    this.unifo_y = { type : "t", value : this.texture_x},
    this.scene_y = new THREE.Scene();
    this.scene_y.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 2.0),
      new THREE.ShaderMaterial({
        uniforms : { unif_texture : this.unifo_y },
        vertexShader : `
        varying vec2 vtex;
        void main(void) {
          vtex = uv;
          gl_Position = vec4(position, 1.0);
        }
        `,
        fragmentShader : `
        uniform sampler2D unif_texture;
        varying vec2 vtex;

        const vec2 cnst_reso = vec2(` + width + `.0, ` + height + `.0);

        void main(void) {
          vec2 offset = vec2(0.0, 1.0 / cnst_reso.y);
          vec4 retcol = vec4(0.0);

          retcol += 0.02 * texture2D(unif_texture, vtex + -3.0 * offset);
          retcol += 0.13 * texture2D(unif_texture, vtex + -2.0 * offset);
          retcol += 0.20 * texture2D(unif_texture, vtex + -1.0 * offset);
          retcol += 0.30 * texture2D(unif_texture, vtex +  0.0 * offset);
          retcol += 0.20 * texture2D(unif_texture, vtex +  1.0 * offset);
          retcol += 0.13 * texture2D(unif_texture, vtex +  2.0 * offset);
          retcol += 0.02 * texture2D(unif_texture, vtex +  3.0 * offset);

          gl_FragColor = retcol;
        }
        `
      })
    ));

  }

  render(texture, range) {
    this.unifo_x.value = texture;
    this.rdrr.render(this.scene_x, this.camera, this.texture_x);
    this.unifo_x.value = this.texture_y;
    for(var cnt = 0 ; cnt < range ; cnt ++) {
      this.rdrr.render(this.scene_y, this.camera, this.texture_y);
      this.rdrr.render(this.scene_x, this.camera, this.texture_x);
    }
    this.rdrr.render(this.scene_y, this.camera, this.texture_y);
  }

    get texture() { return this.texture_y; }

}

export default Blurring
