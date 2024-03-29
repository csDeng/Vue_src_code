!function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd)
        define([], e);
    else {
        var t;
        t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this,
        t.snabbdom = e()
    }
}(function() {
    return function e(t, n, r) {
        function o(l, a) {
            if (!n[l]) {
                if (!t[l]) {
                    var d = "function" == typeof require && require;
                    if (!a && d)
                        return d(l, !0);
                    if (i)
                        return i(l, !0);
                    var u = new Error("Cannot find module '" + l + "'");
                    throw u.code = "MODULE_NOT_FOUND",
                    u
                }
                var f = n[l] = {
                    exports: {}
                };
                t[l][0].call(f.exports, function(e) {
                    var n = t[l][1][e];
                    return o(n ? n : e)
                }, f, f.exports, e, t, n, r)
            }
            return n[l].exports
        }
        for (var i = "function" == typeof require && require, l = 0; l < r.length; l++)
            o(r[l]);
        return o
    }({
        1: [function(e, t, n) {
            "use strict";
            function r(e, t, n) {
                if (e.ns = "http://www.w3.org/2000/svg",
                "foreignObject" !== n && void 0 !== t)
                    for (var o = 0; o < t.length; ++o) {
                        var i = t[o].data;
                        void 0 !== i && r(i, t[o].children, t[o].sel)
                    }
            }
            function o(e, t, n) {
                var o, a, d, u = {};
                if (void 0 !== n ? (u = t,
                l.array(n) ? o = n : l.primitive(n) ? a = n : n && n.sel && (o = [n])) : void 0 !== t && (l.array(t) ? o = t : l.primitive(t) ? a = t : t && t.sel ? o = [t] : u = t),
                l.array(o))
                    for (d = 0; d < o.length; ++d)
                        l.primitive(o[d]) && (o[d] = i.vnode(void 0, void 0, void 0, o[d]));
                return "s" !== e[0] || "v" !== e[1] || "g" !== e[2] || 3 !== e.length && "." !== e[3] && "#" !== e[3] || r(u, o, e),
                i.vnode(e, u, o, a, void 0)
            }
            var i = e("./vnode")
              , l = e("./is");
            n.h = o,
            Object.defineProperty(n, "__esModule", {
                value: !0
            }),
            n["default"] = o
        }
        , {
            "./is": 3,
            "./vnode": 6
        }],
        2: [function(e, t, n) {
            "use strict";
            function r(e) {
                return document.createElement(e)
            }
            function o(e, t) {
                return document.createElementNS(e, t)
            }
            function i(e) {
                return document.createTextNode(e)
            }
            function l(e) {
                return document.createComment(e)
            }
            function a(e, t, n) {
                e.insertBefore(t, n)
            }
            function d(e, t) {
                e.removeChild(t)
            }
            function u(e, t) {
                e.appendChild(t)
            }
            function f(e) {
                return e.parentNode
            }
            function c(e) {
                return e.nextSibling
            }
            function s(e) {
                return e.tagName
            }
            function v(e, t) {
                e.textContent = t
            }
            function h(e) {
                return e.textContent
            }
            function m(e) {
                return 1 === e.nodeType
            }
            function p(e) {
                return 3 === e.nodeType
            }
            function g(e) {
                return 8 === e.nodeType
            }
            n.htmlDomApi = {
                createElement: r,
                createElementNS: o,
                createTextNode: i,
                createComment: l,
                insertBefore: a,
                removeChild: d,
                appendChild: u,
                parentNode: f,
                nextSibling: c,
                tagName: s,
                setTextContent: v,
                getTextContent: h,
                isElement: m,
                isText: p,
                isComment: g
            },
            Object.defineProperty(n, "__esModule", {
                value: !0
            }),
            n["default"] = n.htmlDomApi
        }
        , {}],
        3: [function(e, t, n) {
            "use strict";
            function r(e) {
                return "string" == typeof e || "number" == typeof e
            }
            n.array = Array.isArray,
            n.primitive = r
        }
        , {}],
        4: [function(e, t, n) {
            "use strict";
            function r(e) {
                return void 0 === e
            }
            function o(e) {
                return void 0 !== e
            }
            function i(e, t) {
                return e.key === t.key && e.sel === t.sel
            }
            function l(e) {
                return void 0 !== e.sel
            }
            function a(e, t, n) {
                var r, o, i, l = {};
                for (r = t; r <= n; ++r)
                    i = e[r],
                    null != i && (o = i.key,
                    void 0 !== o && (l[o] = r));
                return l
            }
            function d(e, t) {
                function n(e) {
                    var t = e.id ? "#" + e.id : ""
                      , n = e.className ? "." + e.className.split(" ").join(".") : "";
                    return u["default"](b.tagName(e).toLowerCase() + t + n, {}, [], void 0, e)
                }
                function d(e, t) {
                    return function() {
                        if (0 === --t) {
                            var n = b.parentNode(e);
                            b.removeChild(n, e)
                        }
                    }
                }
                function h(e, t) {
                    var n, i = e.data;
                    void 0 !== i && o(n = i.hook) && o(n = n.init) && (n(e),
                    i = e.data);
                    var l = e.children
                      , a = e.sel;
                    if ("!" === a)
                        r(e.text) && (e.text = ""),
                        e.elm = b.createComment(e.text);
                    else if (void 0 !== a) {
                        var d = a.indexOf("#")
                          , u = a.indexOf(".", d)
                          , c = d > 0 ? d : a.length
                          , v = u > 0 ? u : a.length
                          , m = d !== -1 || u !== -1 ? a.slice(0, Math.min(c, v)) : a
                          , p = e.elm = o(i) && o(n = i.ns) ? b.createElementNS(n, m) : b.createElement(m);
                        for (c < v && (p.id = a.slice(c + 1, v)),
                        u > 0 && (p.className = a.slice(v + 1).replace(/\./g, " ")),
                        n = 0; n < N.create.length; ++n)
                            N.create[n](s, e);
                        if (f.array(l))
                            for (n = 0; n < l.length; ++n) {
                                var g = l[n];
                                null != g && b.appendChild(p, h(g, t))
                            }
                        else
                            f.primitive(e.text) && b.appendChild(p, b.createTextNode(e.text));
                        n = e.data.hook,
                        o(n) && (n.create && n.create(s, e),
                        n.insert && t.push(e))
                    } else
                        e.elm = b.createTextNode(e.text);
                    return e.elm
                }
                function m(e, t, n, r, o, i) {
                    for (; r <= o; ++r) {
                        var l = n[r];
                        null != l && b.insertBefore(e, h(l, i), t)
                    }
                }
                function p(e) {
                    var t, n, r = e.data;
                    if (void 0 !== r) {
                        for (o(t = r.hook) && o(t = t.destroy) && t(e),
                        t = 0; t < N.destroy.length; ++t)
                            N.destroy[t](e);
                        if (void 0 !== e.children)
                            for (n = 0; n < e.children.length; ++n)
                                t = e.children[n],
                                null != t && "string" != typeof t && p(t)
                    }
                }
                function g(e, t, n, r) {
                    for (; n <= r; ++n) {
                        var i = void 0
                          , l = void 0
                          , a = void 0
                          , u = t[n];
                        if (null != u)
                            if (o(u.sel)) {
                                for (p(u),
                                l = N.remove.length + 1,
                                a = d(u.elm, l),
                                i = 0; i < N.remove.length; ++i)
                                    N.remove[i](u, a);
                                o(i = u.data) && o(i = i.hook) && o(i = i.remove) ? i(u, a) : a()
                            } else
                                b.removeChild(e, u.elm)
                    }
                }
                function x(e, t, n, o) {
                    for (var l, d, u, f, c = 0, s = 0, v = t.length - 1, p = t[0], x = t[v], k = n.length - 1, C = n[0], N = n[k]; c <= v && s <= k; )
                        null == p ? p = t[++c] : null == x ? x = t[--v] : null == C ? C = n[++s] : null == N ? N = n[--k] : i(p, C) ? (y(p, C, o),
                        p = t[++c],
                        C = n[++s]) : i(x, N) ? (y(x, N, o),
                        x = t[--v],
                        N = n[--k]) : i(p, N) ? (y(p, N, o),
                        b.insertBefore(e, p.elm, b.nextSibling(x.elm)),
                        p = t[++c],
                        N = n[--k]) : i(x, C) ? (y(x, C, o),
                        b.insertBefore(e, x.elm, p.elm),
                        x = t[--v],
                        C = n[++s]) : (void 0 === l && (l = a(t, c, v)),
                        d = l[C.key],
                        r(d) ? (b.insertBefore(e, h(C, o), p.elm),
                        C = n[++s]) : (u = t[d],
                        u.sel !== C.sel ? b.insertBefore(e, h(C, o), p.elm) : (y(u, C, o),
                        t[d] = void 0,
                        b.insertBefore(e, u.elm, p.elm)),
                        C = n[++s]));
                    c > v ? (f = null == n[k + 1] ? null : n[k + 1].elm,
                    m(e, f, n, s, k, o)) : s > k && g(e, t, c, v)
                }
                function y(e, t, n) {
                    var i, l;
                    o(i = t.data) && o(l = i.hook) && o(i = l.prepatch) && i(e, t);
                    var a = t.elm = e.elm
                      , d = e.children
                      , u = t.children;
                    if (e !== t) {
                        if (void 0 !== t.data) {
                            for (i = 0; i < N.update.length; ++i)
                                N.update[i](e, t);
                            i = t.data.hook,
                            o(i) && o(i = i.update) && i(e, t)
                        }
                        r(t.text) ? o(d) && o(u) ? d !== u && x(a, d, u, n) : o(u) ? (o(e.text) && b.setTextContent(a, ""),
                        m(a, null, u, 0, u.length - 1, n)) : o(d) ? g(a, d, 0, d.length - 1) : o(e.text) && b.setTextContent(a, "") : e.text !== t.text && b.setTextContent(a, t.text),
                        o(l) && o(i = l.postpatch) && i(e, t)
                    }
                }
                var k, C, N = {}, b = void 0 !== t ? t : c["default"];
                for (k = 0; k < v.length; ++k)
                    for (N[v[k]] = [],
                    C = 0; C < e.length; ++C) {
                        var T = e[C][v[k]];
                        void 0 !== T && N[v[k]].push(T)
                    }
                return function(e, t) {
                    var r, o, a, d = [];
                    for (r = 0; r < N.pre.length; ++r)
                        N.pre[r]();
                    for (l(e) || (e = n(e)),
                    i(e, t) ? y(e, t, d) : (o = e.elm,
                    a = b.parentNode(o),
                    h(t, d),
                    null !== a && (b.insertBefore(a, t.elm, b.nextSibling(o)),
                    g(a, [e], 0, 0))),
                    r = 0; r < d.length; ++r)
                        d[r].data.hook.insert(d[r]);
                    for (r = 0; r < N.post.length; ++r)
                        N.post[r]();
                    return t
                }
            }
            var u = e("./vnode")
              , f = e("./is")
              , c = e("./htmldomapi")
              , s = u["default"]("", {}, [], void 0, void 0)
              , v = ["create", "update", "remove", "destroy", "pre", "post"]
              , h = e("./h");
            n.h = h.h;
            var m = e("./thunk");
            n.thunk = m.thunk,
            n.init = d
        }
        , {
            "./h": 1,
            "./htmldomapi": 2,
            "./is": 3,
            "./thunk": 5,
            "./vnode": 6
        }],
        5: [function(e, t, n) {
            "use strict";
            function r(e, t) {
                t.elm = e.elm,
                e.data.fn = t.data.fn,
                e.data.args = t.data.args,
                t.data = e.data,
                t.children = e.children,
                t.text = e.text,
                t.elm = e.elm
            }
            function o(e) {
                var t = e.data
                  , n = t.fn.apply(void 0, t.args);
                r(n, e)
            }
            function i(e, t) {
                var n, o = e.data, i = t.data, l = o.args, a = i.args;
                for (o.fn === i.fn && l.length === a.length || r(i.fn.apply(void 0, a), t),
                n = 0; n < a.length; ++n)
                    if (l[n] !== a[n])
                        return void r(i.fn.apply(void 0, a), t);
                r(e, t)
            }
            var l = e("./h");
            n.thunk = function(e, t, n, r) {
                return void 0 === r && (r = n,
                n = t,
                t = void 0),
                l.h(e, {
                    key: t,
                    hook: {
                        init: o,
                        prepatch: i
                    },
                    fn: n,
                    args: r
                })
            }
            ,
            Object.defineProperty(n, "__esModule", {
                value: !0
            }),
            n["default"] = n.thunk
        }
        , {
            "./h": 1
        }],
        6: [function(e, t, n) {
            "use strict";
            function r(e, t, n, r, o) {
                var i = void 0 === t ? void 0 : t.key;
                return {
                    sel: e,
                    data: t,
                    children: n,
                    text: r,
                    elm: o,
                    key: i
                }
            }
            n.vnode = r,
            Object.defineProperty(n, "__esModule", {
                value: !0
            }),
            n["default"] = r
        }
        , {}]
    }, {}, [4])(4)
});
//# sourceMappingURL=snabbdom.min.js.map
