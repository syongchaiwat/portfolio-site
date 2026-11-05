/* @ds-bundle: {"format":4,"namespace":"LiquidChrome","components":[]} */
(function () {
  var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

  var COMMON = [
    "precision highp float;",
    "uniform vec2 R;uniform float T;uniform vec3 C[5];",
    "uniform float S,W,K,A,B,G,F,D,Q,V,L,N,X,Z;",
    "float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*f*(f*(f*6.-15.)+10.);",
    "  float a=hash(i)*6.2832,b=hash(i+vec2(1,0))*6.2832,c=hash(i+vec2(0,1))*6.2832,d=hash(i+vec2(1,1))*6.2832;",
    "  return mix(mix(dot(vec2(cos(a),sin(a)),f),dot(vec2(cos(b),sin(b)),f-vec2(1,0)),u.x),",
    "             mix(dot(vec2(cos(c),sin(c)),f-vec2(0,1)),dot(vec2(cos(d),sin(d)),f-vec2(1,1)),u.x),u.y);}",
    "const mat2 M=mat2(.8,.6,-.6,.8);",
    "float fbm2(vec2 p){return .62*noise(p)+.26*noise(M*p*2.03+3.1);}",
    "float fbm3(vec2 p){return .6*noise(p)+.26*noise(M*p*2.03+3.1)+.1*noise(M*M*p*4.1+7.7);}",
    "vec3 ramp(float x){x=clamp(x,0.,1.)*4.;float i=floor(min(x,3.999));float f=smoothstep(0.,1.,x-i);",
    "  if(i<1.)return mix(C[0],C[1],f);if(i<2.)return mix(C[1],C[2],f);if(i<3.)return mix(C[2],C[3],f);return mix(C[3],C[4],f);}"
  ].join("\n");

  // Folds: a domain-warped height field shaded as a reflective surface.
  var FOLDS = COMMON + "\n" + [
    "float field(vec2 p){float t=T;",
    "  vec2 q=vec2(fbm2(p+vec2(0.,t*.31)),fbm2(p+vec2(5.2,1.3)-t*.23));",
    "  vec2 r=vec2(fbm2(p+W*q+vec2(1.7,9.2)+t*.17),fbm2(p+W*q+vec2(8.3,2.8)-t*.13));",
    "  float f=fbm3(p+W*r);",
    "  return mix(f,-2.*sqrt(f*f+.0016)+.3,K);}",
    "void main(){",
    "  vec2 uv=(gl_FragCoord.xy-.5*R)/min(R.x,R.y);",
    "  vec2 p=vec2(uv.x*cos(Q)-uv.y*sin(Q),uv.x*sin(Q)+uv.y*cos(Q));",
    "  p=p*vec2(S/A,S);",
    "  float e=.006*S,h=field(p);",
    "  vec2 g=vec2(field(p+vec2(e,0.))-h,field(p+vec2(0.,e))-h)/e;",
    "  float soft=mix(.55,1.,smoothstep(.75,.15,abs(uv.y)));",
    "  vec3 n=normalize(vec3(-g*G*soft,1.));",
    "  vec3 r=reflect(vec3(0.,0.,-1.),n);",
    "  float x=.5+.5*sin(B*(r.x*.78+r.y*.62)+4.*h+T*.07);",
    "  x=pow(x,D);",
    "  x=clamp(x+F*sin(9.*(1.-n.z)+h*7.+T*.05)*(1.-n.z),0.,1.);",
    "  vec3 col=ramp(x*Z);",
    "  col+=C[4]*X*smoothstep(.015,.11,1.-n.z)*pow(.5+.5*sin(B*2.3*(r.x*.78+r.y*.62)+6.*h+1.),N);",
    "  vec3 l=normalize(vec3(-.45,.6,.75));",
    "  float nh=max(dot(n,normalize(l+vec3(0.,0.,1.))),0.);",
    "  col+=mix(C[4],vec3(1.),.5)*(pow(nh,90.)*.75+pow(nh,18.)*.12);",
    "  col=mix(col,C[3],pow(1.-n.z,3.)*.28);",
    "  col*=1.-V*smoothstep(.35,1.25,length(uv));",
    "  float y=dot(col,vec3(.2126,.7152,.0722));col=mix(col,C[2],smoothstep(L,L+.3,y)*.7);",
    "  col+=(hash(gl_FragCoord.xy+fract(T))-.5)/160.;",
    "  gl_FragColor=vec4(col,1.);}"
  ].join("\n");

  // Droplets: metaballs with a thin-film rim over a soft pastel field.
  var DROPS = COMMON + "\n" + [
    "float blobs(vec2 p,float t,float k){float s=0.;",
    "  for(int i=0;i<14;i++){float a=float(i);",
    "    float o=mix(.42,1.,fract(a*.618));vec2 c=vec2(sin(t*(.13+a*.011)+a*1.9)*1.25*o,cos(t*(.11+a*.009)+a*2.7)*.8*o);",
    "    float r=(.05+.12*fract(a*.37))*k;vec2 d=p-c;s+=r*r/(dot(d,d)+.002);}",
    "  return s;}",
    "float film(vec2 p){vec2 w=vec2(noise(p*1.5+T*.09),noise(p*1.5+7.3-T*.07));",
    "  return blobs(p+.34*w,T,1.);}",
    "void main(){",
    "  vec2 uv=(gl_FragCoord.xy-.5*R)/min(R.x,R.y);",
    "  vec2 p=uv*S;",
    "  float n0=fbm2(uv*1.1+vec2(T*.03,-T*.02));",
    "  float dg=clamp(.5+.55*(uv.x-uv.y)+n0*.9,0.,1.);",
    "  vec3 bg=mix(C[0],C[1],smoothstep(.05,.55,dg));",
    "  bg=mix(bg,C[2],smoothstep(.55,1.,dg));",
    "  float back=blobs(p*.62+vec2(.5,.2),T*.7,1.25);",
    "  float sb=smoothstep(.55,1.5,back);",
    "  bg=mix(bg,mix(C[4],C[1],.35+.3*n0),sb*.55);",
    "  float f=film(p),e=.012;",
    "  vec2 g=vec2(film(p+vec2(e,0.))-f,film(p+vec2(0.,e))-f)/e;",
    "  float mask=smoothstep(.92,1.02,f);",
    "  vec2 gh=g/max(f*f,.2);",
    "  vec3 n=normalize(vec3(-gh*G,1.));",
    "  float rim=1.-n.z;",
    "  float hh=1.-1./max(f,1.);",
    "  float x=rim*1.9+B*sin(hh*11.+(p.x-p.y)*3.+noise(p*2.2+T*.05)*7.);",
    "  vec3 ink=mix(mix(C[1],C[0],.72),C[3],smoothstep(.14,.56,x));",
    "  ink=mix(ink,C[2],smoothstep(.0,.55,dot(n.xy,normalize(vec2(.8,-.6))))*smoothstep(.45,.95,x)*F);",
    "  ink=mix(ink,C[4],.14*(1.-smoothstep(0.,.25,x)));",
    "  float nh=max(dot(n,normalize(vec3(-.45,.6,1.4))),0.);",
    "  ink+=vec3(1.)*pow(nh,70.)*.55;",
    "  vec3 col=mix(bg,ink,mask*(.74+.26*rim));",
    "  col+=(hash(gl_FragCoord.xy+fract(T))-.5)/160.;",
    "  gl_FragColor=vec4(col,1.);}"
  ].join("\n");

  // Motion and shape live here. Colour comes only from the liquid-* tokens.
  var PRESETS = {
    molten:  { src: FOLDS, speed: .055, start: 11, S: .8, W: 1.3, K: .14, A: 1.5, B: 3.2, G: .34, F: .14, D: 2.6, Q: .35, V: .38, L: .55, N: 26, X: .62, Z: .74 },
    silk:    { src: FOLDS, speed: .045, start: 31, S: .66, W: 1.2, K: 0, A: 2.4, B: 2.6, G: .3, F: .12, D: 1.85, Q: -.42, V: .26, L: .6, N: 12, X: .5, Z: .68 },
    opaline: { src: DROPS, speed: .07, start: 18, S: 1.25, W: 0, K: 0, A: 1, B: .1, G: .2, F: .9, D: 1, Q: 0, V: 0, L: 1, N: 1, X: 0, Z: 1 },
    prism:   { src: FOLDS, speed: .05, start: 47, S: .85, W: 1.5, K: .36, A: 1.1, B: 3.6, G: .38, F: .2, D: 1.35, Q: .85, V: .3, L: .68, N: 16, X: 1.0, Z: .6 }
  };

  function compile(gl, src) {
    function sh(type, s) {
      var o = gl.createShader(type);
      gl.shaderSource(o, s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) || "shader");
      return o;
    }
    var p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, src));
    gl.bindAttribLocation(p, 0, "a");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link");
    return p;
  }

  function readRgb(el, name) {
    var probe = document.createElement("span");
    probe.style.cssText = "display:none;color:var(" + name + ")";
    el.appendChild(probe);
    var m = getComputedStyle(probe).color.match(/[\d.]+/g) || [0, 0, 0];
    el.removeChild(probe);
    return [+m[0], +m[1], +m[2]];
  }

  function toHex(c) {
    return "#" + c.slice(0, 3).map(function (v) {
      return ("0" + Math.round(v).toString(16)).slice(-2);
    }).join("");
  }

  function presetOf(el, opts) {
    if (opts && opts.preset) return opts.preset;
    var host = el.closest("[data-theme]");
    var id = host && host.getAttribute("data-theme");
    return PRESETS[id] ? id : "molten";
  }

  function mount(el, opts) {
    opts = opts || {};
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "lc-canvas";
    el.insertBefore(canvas, el.firstChild);
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    var noop = { destroy: function () { canvas.remove(); }, seek: function () {}, setSpeed: function () {}, canvas: canvas, gl: null };
    if (!gl) { canvas.remove(); return noop; }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    var scale = opts.quality || .6;
    var speedMul = opts.speed || 1;
    var name, preset, prog, u = {};
    var clock = 0, last = 0, lastDraw = 0, raf = 0, visible = true;
    var slowFrames = 0, frames = 0;

    function load() {
      name = presetOf(el, opts);
      preset = PRESETS[name];
      prog = compile(gl, preset.src);
      gl.useProgram(prog);
      ["R", "T", "S", "W", "K", "A", "B", "G", "F", "D", "Q", "V", "L", "N", "X", "Z"].forEach(function (k) { u[k] = gl.getUniformLocation(prog, k); });
      var flat = [];
      for (var i = 1; i <= 5; i++) {
        var c = readRgb(el, "--liquid-" + i);
        flat.push(c[0] / 255, c[1] / 255, c[2] / 255);
      }
      gl.uniform3fv(gl.getUniformLocation(prog, "C"), flat);
      ["S", "W", "K", "A", "B", "G", "F", "D", "Q", "V", "L", "N", "X", "Z"].forEach(function (k) { gl.uniform1f(u[k], preset[k]); });
    }

    function size() {
      var r = el.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var k = Math.min(1, 1400 / Math.max(r.width * dpr * scale, 1));
      var w = Math.max(2, Math.round(r.width * dpr * scale * k));
      var h = Math.max(2, Math.round(r.height * dpr * scale * k));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    function draw() {
      size();
      gl.uniform2f(u.R, canvas.width, canvas.height);
      gl.uniform1f(u.T, preset.start + clock * preset.speed * speedMul);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function tick(now) {
      raf = 0;
      if (!visible || document.hidden || reduce.matches) { last = 0; return; }
      raf = requestAnimationFrame(tick);
      if (now - lastDraw < 32) return;
      var dt = last ? Math.min(now - last, 100) : 16;
      if (last && dt > 48) slowFrames++;
      frames++;
      if (frames === 45) {
        if (slowFrames > 22 && scale > .3) { scale *= .72; }
        frames = 0;
        slowFrames = 0;
      }
      clock += dt / 1000;
      last = now;
      lastDraw = now;
      draw();
    }

    function wake() {
      if (!raf && visible && !document.hidden && !reduce.matches) raf = requestAnimationFrame(tick);
    }

    load();
    draw();
    wake();

    var ro = new ResizeObserver(function () { draw(); });
    ro.observe(el);
    var io = new IntersectionObserver(function (e) {
      visible = e[e.length - 1].isIntersecting;
      wake();
    });
    io.observe(el);
    var themeHost = el.closest("[data-theme]") || document.documentElement;
    var mo = new MutationObserver(function () {
      load();
      draw();
    });
    mo.observe(themeHost, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", wake);
    reduce.addEventListener("change", function () { draw(); wake(); });

    return {
      canvas: canvas,
      gl: gl,
      seek: function (seconds) { clock = seconds; draw(); },
      setSpeed: function (v) { speedMul = v; },
      destroy: function () {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        mo.disconnect();
        document.removeEventListener("visibilitychange", wake);
        canvas.remove();
      }
    };
  }

  var STOPS = ["liquid-1", "liquid-2", "liquid-3", "liquid-4", "liquid-5"];
  var UI = ["background", "surface-2", "foreground", "muted", "accent", "accent-light"];

  function swatchRow(root, title, names) {
    var row = document.createElement("div");
    row.className = "lc-pal-row";
    var label = document.createElement("div");
    label.className = "lc-pal-title";
    label.textContent = title;
    row.appendChild(label);
    var grid = document.createElement("div");
    grid.className = "lc-pal-grid";
    names.forEach(function (n) {
      var cell = document.createElement("div");
      cell.className = "lc-pal-cell";
      var chip = document.createElement("div");
      chip.className = "lc-pal-chip";
      chip.style.background = "var(--" + n + ")";
      var nm = document.createElement("div");
      nm.className = "lc-pal-name";
      nm.textContent = n;
      var hex = document.createElement("div");
      hex.className = "lc-pal-hex";
      hex.textContent = toHex(readRgb(root, "--" + n));
      cell.appendChild(chip);
      cell.appendChild(nm);
      cell.appendChild(hex);
      grid.appendChild(cell);
    });
    row.appendChild(grid);
    return row;
  }

  function palette(el) {
    el.textContent = "";
    el.appendChild(swatchRow(el, "Liquid stops", STOPS));
    el.appendChild(swatchRow(el, "Interface", UI));
  }

  window.LiquidChrome = { mount: mount, palette: palette, presets: Object.keys(PRESETS) };
})();
