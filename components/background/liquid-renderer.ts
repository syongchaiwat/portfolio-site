import type { LiquidPreset } from "./prism-preset";

export interface LiquidHandle {
  destroy(): void;
}

const VERTEX_SHADER = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

// A domain-warped height field, shaded as a reflective surface.
const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 R;
uniform float T;
uniform vec3 C[5];
uniform float scale, warp, crease, stretch, angle, bands, relief, film, depth, rampTop, streakSharpness, streakGain, vignette, ceiling;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  float a=hash(i)*6.2832,b=hash(i+vec2(1,0))*6.2832,c=hash(i+vec2(0,1))*6.2832,d=hash(i+vec2(1,1))*6.2832;
  return mix(mix(dot(vec2(cos(a),sin(a)),f),dot(vec2(cos(b),sin(b)),f-vec2(1,0)),u.x),
             mix(dot(vec2(cos(c),sin(c)),f-vec2(0,1)),dot(vec2(cos(d),sin(d)),f-vec2(1,1)),u.x),u.y);
}
const mat2 M=mat2(.8,.6,-.6,.8);
float fbm2(vec2 p){return .62*noise(p)+.26*noise(M*p*2.03+3.1);}
float fbm3(vec2 p){return .6*noise(p)+.26*noise(M*p*2.03+3.1)+.1*noise(M*M*p*4.1+7.7);}
vec3 ramp(float x){
  x=clamp(x,0.,1.)*4.;
  float i=floor(min(x,3.999));
  float f=smoothstep(0.,1.,x-i);
  if(i<1.)return mix(C[0],C[1],f);
  if(i<2.)return mix(C[1],C[2],f);
  if(i<3.)return mix(C[2],C[3],f);
  return mix(C[3],C[4],f);
}
float field(vec2 p){
  float t=T;
  vec2 q=vec2(fbm2(p+vec2(0.,t*.31)),fbm2(p+vec2(5.2,1.3)-t*.23));
  vec2 r=vec2(fbm2(p+warp*q+vec2(1.7,9.2)+t*.17),fbm2(p+warp*q+vec2(8.3,2.8)-t*.13));
  float f=fbm3(p+warp*r);
  return mix(f,-2.*sqrt(f*f+.0016)+.3,crease);
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/min(R.x,R.y);
  vec2 p=vec2(uv.x*cos(angle)-uv.y*sin(angle),uv.x*sin(angle)+uv.y*cos(angle));
  p=p*vec2(scale/stretch,scale);
  float e=.006*scale,h=field(p);
  vec2 g=vec2(field(p+vec2(e,0.))-h,field(p+vec2(0.,e))-h)/e;
  float soft=mix(.55,1.,smoothstep(.75,.15,abs(uv.y)));
  vec3 n=normalize(vec3(-g*relief*soft,1.));
  vec3 r=reflect(vec3(0.,0.,-1.),n);
  float x=.5+.5*sin(bands*(r.x*.78+r.y*.62)+4.*h+T*.07);
  x=pow(x,depth);
  x=clamp(x+film*sin(9.*(1.-n.z)+h*7.+T*.05)*(1.-n.z),0.,1.);
  vec3 col=ramp(x*rampTop);
  col+=C[4]*streakGain*smoothstep(.015,.11,1.-n.z)*pow(.5+.5*sin(bands*2.3*(r.x*.78+r.y*.62)+6.*h+1.),streakSharpness);
  vec3 l=normalize(vec3(-.45,.6,.75));
  float nh=max(dot(n,normalize(l+vec3(0.,0.,1.))),0.);
  col+=mix(C[4],vec3(1.),.5)*(pow(nh,90.)*.75+pow(nh,18.)*.12);
  col=mix(col,C[3],pow(1.-n.z,3.)*.28);
  col*=1.-vignette*smoothstep(.35,1.25,length(uv));
  float y=dot(col,vec3(.2126,.7152,.0722));
  col=mix(col,C[2],smoothstep(ceiling,ceiling+.3,y)*.7);
  col+=(hash(gl_FragCoord.xy+fract(T))-.5)/160.;
  gl_FragColor=vec4(col,1.);
}`;

const FRAME_MS = 32;
const SLOW_FRAME_MS = 48;
const MAX_CANVAS_SIZE = 1400;

function compile(gl: WebGLRenderingContext): WebGLProgram {
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type);
    if (!s) throw new Error("Could not create shader");
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) ?? "Shader failed to compile");
    }
    return s;
  };
  const program = gl.createProgram();
  if (!program) throw new Error("Could not create program");
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.bindAttribLocation(program, 0, "a");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Shader failed to link");
  }
  return program;
}

// Reads a color token through the browser, so any CSS color format works.
function readColor(el: HTMLElement, token: string): number[] {
  const probe = document.createElement("span");
  probe.style.cssText = `display:none;color:var(${token})`;
  el.appendChild(probe);
  const parts = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ["0", "0", "0"];
  el.removeChild(probe);
  return parts.slice(0, 3).map((v) => Number(v) / 255);
}

/**
 * Adds an animated canvas to `el`. Colors come from the --liquid-1 to --liquid-5 tokens.
 * Returns null when WebGL is unavailable, so the element's CSS background shows instead.
 */
export function mountLiquid(el: HTMLElement, preset: LiquidPreset): LiquidHandle | null {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return null;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let renderScale = 0.6;
  let clock = 0;
  let lastTick = 0;
  let lastDraw = 0;
  let raf = 0;
  let visible = true;
  let contextLost = false;
  let frames = 0;
  let slowFrames = 0;
  let resolution: WebGLUniformLocation | null = null;
  let time: WebGLUniformLocation | null = null;

  const setup = (context: WebGLRenderingContext) => {
    const buffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW);
    context.enableVertexAttribArray(0);
    context.vertexAttribPointer(0, 2, context.FLOAT, false, 0, 0);

    const program = compile(context);
    context.useProgram(program);
    resolution = context.getUniformLocation(program, "R");
    time = context.getUniformLocation(program, "T");

    const colors = [1, 2, 3, 4, 5].flatMap((i) => readColor(el, `--liquid-${i}`));
    context.uniform3fv(context.getUniformLocation(program, "C"), colors);

    // speed and start have no uniform, and WebGL ignores a null location.
    Object.entries(preset).forEach(([name, value]) => {
      context.uniform1f(context.getUniformLocation(program, name), value);
    });
  };

  const draw = () => {
    if (contextLost) return;
    const rect = el.getBoundingClientRect();
    const pixels = Math.min(window.devicePixelRatio || 1, 1.5) * renderScale;
    const fit = Math.min(1, MAX_CANVAS_SIZE / Math.max(rect.width * pixels, rect.height * pixels, 1));
    const width = Math.max(2, Math.round(rect.width * pixels * fit));
    const height = Math.max(2, Math.round(rect.height * pixels * fit));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    gl.uniform2f(resolution, width, height);
    gl.uniform1f(time, preset.start + clock * preset.speed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const tick = (now: number) => {
    raf = 0;
    if (!visible || document.hidden || reducedMotion.matches || contextLost) {
      lastTick = 0;
      return;
    }
    raf = requestAnimationFrame(tick);
    if (now - lastDraw < FRAME_MS) return;

    const elapsed = lastTick ? Math.min(now - lastTick, 100) : 16;
    if (lastTick && elapsed > SLOW_FRAME_MS) slowFrames++;
    frames++;
    if (frames === 45) {
      if (slowFrames > 22 && renderScale > 0.3) renderScale *= 0.72;
      frames = 0;
      slowFrames = 0;
    }
    clock += elapsed / 1000;
    lastTick = now;
    lastDraw = now;
    draw();
  };

  const wake = () => {
    if (!raf && visible && !document.hidden && !reducedMotion.matches && !contextLost) {
      raf = requestAnimationFrame(tick);
    }
  };

  const onMotionChange = () => {
    draw();
    wake();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
  };
  const onContextRestored = () => {
    contextLost = false;
    setup(gl);
    onMotionChange();
  };

  try {
    setup(gl);
  } catch {
    return null;
  }

  el.prepend(canvas);
  draw();
  wake();

  const resizeObserver = new ResizeObserver(draw);
  resizeObserver.observe(el);
  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    wake();
  });
  intersectionObserver.observe(el);
  document.addEventListener("visibilitychange", wake);
  reducedMotion.addEventListener("change", onMotionChange);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", wake);
      reducedMotion.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      canvas.remove();
    },
  };
}
