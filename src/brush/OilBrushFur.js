import * as THREE from 'three'

class OilBrushFur extends THREE.Object3D {
  constructor() {
    super();

    this.uniforms = {
      unif_texture : { type : "t", value : undefined},
      unif_texcoord : { type : "2f", value : [0.0, 0.0]},
      unif_seed : { type : "1f", value : 0.9 + 0.1 * Math.random()}
    };

    this.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 2.0),
      new THREE.ShaderMaterial({
        transparent : true,
        uniforms : this.uniforms,
        vertexShader : `
        uniform sampler2D unif_texture;
        uniform vec2 unif_texcoord;
        uniform float unif_seed;

        varying vec4 vcol;
        varying vec2 vtex;
        void main(void) {
          vcol = texture2D(unif_texture, unif_texcoord) * unif_seed; //
          vtex = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
        `,
        fragmentShader : `
        varying vec4 vcol;
        varying vec2 vtex;
        void main(void) {
          float alpha = smoothstep(0.25, 0.24, length(vtex - 0.5));
          gl_FragColor = vec4(vcol.rgb, vcol.a * alpha);
        }
        `
      })
    ));
    this.start({x : 0.0, y : 0.0});

  }

  _lerp(a, b, t) {
    return a + (b - a) * t;
  }

  start(x, y) {

    const maxsize = 0.08;
    this.scale.max = maxsize + Math.random() * maxsize;
    this.scale.min = Math.random() * this.scale.max;
    this.scale.now = this._lerp(this.scale.min, this.scale.max, Math.random());

    this.position.x = Math.random() * 0.2 - 0.1;
    this.position.y = Math.random() * 0.2 - 0.1;

    this.scale.x = this.scale.y = this.scale.now;
    this.uniforms.unif_texcoord.value = [x, y];
    this.uniforms.unif_seed.value = 0.8 + 0.2 * Math.random();
  }

  end() {
    this.scale.max = 0.0;
    this.scale.min = 0.0;
    this.scale.now = 0.001;
    this.scale.x = this.scale.y = this.scale.now;
  }

  update(dt) {
    this.scale.min += (0.001 - this.scale.min) * dt * 5.0;
    this.scale.max += (0.001 - this.scale.max) * dt * 5.0;

    this.scale.now += (this._lerp(this.scale.min, this.scale.max, Math.random()) - this.scale.now) * dt * 5.0;

    this.scale.y = this.scale.x += (this.scale.now - this.scale.x) * 1.0 * dt;
  }

  set texture(tex) { this.uniforms.unif_texture.value = tex; }
}

export default OilBrushFur
