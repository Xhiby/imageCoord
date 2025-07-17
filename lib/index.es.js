import { reactive as D, toRefs as F, ref as L, onMounted as G, createElementBlock as J, openBlock as K, createElementVNode as H, unref as Q } from "vue";
const Z = (g, x) => {
  const w = g.__vccOpts || g;
  for (const [b, n] of x)
    w[b] = n;
  return w;
}, tt = { class: "wrap" }, et = ["src"], ot = {
  __name: "imageCoord",
  props: {
    config: {
      type: Object,
      default: () => ({
        imgUrl: "",
        originX: 0,
        originY: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        showBoundary: !0,
        showAxis: !0
      })
    }
  },
  setup(g, { expose: x }) {
    const w = g, b = D({
      originX: [
        {
          type: "number",
          min: 0,
          max: 100,
          message: "原点X轴位置必须在0%到100%之间",
          trigger: "blur"
        }
      ],
      originY: [
        {
          type: "number",
          min: 0,
          max: 100,
          message: "原点Y轴位置必须在0%到100%之间",
          trigger: "blur"
        }
      ],
      x: [
        {
          type: "number",
          trigger: "blur"
        }
      ],
      y: [
        {
          type: "number",
          trigger: "blur"
        }
      ]
    }), { config: n } = F(w), f = L(null), B = L(null);
    let R = {}, m = { x: 0, y: 0 };
    const v = {
      width: 30,
      height: 30,
      color: "red"
    };
    G(() => {
    });
    const W = () => {
      I(), z(f.value, R), N(f.value);
    }, q = () => {
      const e = n.value, t = [];
      for (const o in b) {
        const i = b[o], c = parseFloat(e[o]);
        for (const l of i)
          if (c < l.min || c > l.max) {
            t.push(l.message);
            break;
          }
      }
      if (t.length > 0)
        throw console.error("参数校验失败：", t), new Error(t);
      return !0;
    }, I = () => {
      O(), m = A(n.value.x, n.value.y);
    }, A = (e, t) => M(e, t, R, B.value, n.value.width, n.value.height), M = (e, t, o, i, c, l) => {
      const { left: a, right: d, top: h, bottom: s } = o, u = d - a, r = s - h, p = e / (c / 2) * (u / 2), y = t / l * r, _ = n.value.originX / 100, E = n.value.originY / 100, $ = (a + d) * _ + p, k = (h + s) * E + y, Y = i.getBoundingClientRect(), j = Y.width / i.naturalWidth, U = Y.height / i.naturalHeight;
      return {
        x: $ * j,
        y: k * U
      };
    }, P = () => {
      if (q()) {
        V(), m = A(n.value.x, n.value.y);
        const t = f.value, o = document.createElement("div");
        o.className = "moving-dot", o.style.position = "absolute", o.style.borderRadius = "50%", o.style.width = `${v.width}px`, o.style.height = `${v.height}px`, o.style.backgroundColor = v.color, o.style.pointerEvents = "none", o.style.zIndex = 10, o.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.4)", o.style.left = `${m.x - v.width / 2}px`, o.style.top = `${m.y - v.height / 2}px`, t.appendChild(o);
      }
    }, V = () => {
      const e = f.value, t = e.querySelector(".moving-dot");
      t && e.removeChild(t);
    }, C = (e) => {
      const t = document.createElement("div");
      return t.className = "showBoundary-line", Object.assign(t.style, {
        position: "absolute",
        backgroundColor: "red",
        zIndex: 80,
        pointerEvents: "none",
        ...e
      }), n.value.showBoundary === !1 && (t.style.opacity = 0), t;
    }, X = (e) => {
      const t = document.createElement("div");
      return t.className = "showAxis-line", Object.assign(t.style, {
        position: "absolute",
        backgroundColor: "Green",
        zIndex: 80,
        pointerEvents: "none",
        ...e
      }), n.value.showAxis === !1 && (t.style.opacity = 0), t;
    }, z = (e, t) => {
      e.querySelectorAll(".showBoundary-line").forEach((y) => {
        y && y.remove();
      });
      const { left: o, right: i, top: c, bottom: l } = t, a = e.querySelector("img").getBoundingClientRect(), d = a.width / e.querySelector("img").naturalWidth, h = a.height / e.querySelector("img").naturalHeight, s = o * d, u = i * d, r = c * h, p = l * h;
      e.appendChild(
        C({
          left: `${s}px`,
          top: `${r}px`,
          width: "4px",
          height: `${p - r}px`
        })
      ), e.appendChild(
        C({
          left: `${u}px`,
          top: `${r}px`,
          width: "4px",
          height: `${p - r}px`
        })
      ), e.appendChild(
        C({
          left: `${s}px`,
          top: `${r}px`,
          width: `${u - s}px`,
          height: "4px"
        })
      ), e.appendChild(
        C({
          left: `${s}px`,
          top: `${p}px`,
          width: `${u - s}px`,
          height: "4px"
        })
      );
    }, N = (e) => {
      e.querySelectorAll(".showAxis-line").forEach((t) => {
        t && t.remove();
      }), e.appendChild(
        X({
          left: "0px",
          top: `${m.y}px`,
          width: "100%",
          height: "2px"
        })
      ), e.appendChild(
        X({
          left: `${m.x}px`,
          top: "0px",
          width: "2px",
          height: "100%"
        })
      );
    }, O = () => {
      R = T(f.value, B.value);
    }, T = (e, t) => {
      if (!e || !t) return null;
      const o = e.getBoundingClientRect(), i = t.getBoundingClientRect(), c = t.naturalWidth, l = t.naturalHeight, a = i.width, d = i.height, h = o.width, s = o.height, u = c / a, r = l / d, p = (h - a) / 2, y = (s - d) / 2, _ = Math.round(p * u), E = Math.round(h * u - _), $ = Math.round(y * r), k = Math.round(s * r - $);
      return { left: _, right: E, top: $, bottom: k };
    };
    return x({
      drawDot: P
    }), (e, t) => (K(), J("div", tt, [
      H("div", {
        class: "container",
        ref_key: "imgContainer",
        ref: f
      }, [
        H("img", {
          class: "wrap-img",
          ref_key: "imgRef",
          ref: B,
          src: Q(n).imgUrl,
          onLoad: W
        }, null, 40, et)
      ], 512)
    ]));
  }
}, nt = /* @__PURE__ */ Z(ot, [["__scopeId", "data-v-b2b3e6e3"]]), st = [nt], S = function(g) {
  st.forEach((x) => {
    g.component(x.name, x);
  });
};
typeof window < "u" && window.Vue && S(window.Vue);
const rt = {
  install: S
};
export {
  rt as default
};
