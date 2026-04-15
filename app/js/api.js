"use strict";
/* Fetch wrappers — all return Promises */

var SUPPA = window.SUPPA || {};

SUPPA.api = {
  _base: function () { return (window.SUPPA && SUPPA.API_BASE) || "http://localhost:8787/api"; },

  _fetch: function (method, path, body) {
    var opts = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) opts.body = JSON.stringify(body);
    return fetch(SUPPA.api._base() + path, opts).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (j) { throw new Error(j.error || "API " + res.status); });
      }
      return res.json();
    });
  },

  get: function (entity, id) {
    return SUPPA.api._fetch("GET", id ? "/" + entity + "/" + id : "/" + entity);
  },

  getFiltered: function (entity, params) {
    var qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return SUPPA.api._fetch("GET", "/" + entity + qs);
  },

  post: function (entity, payload) {
    return SUPPA.api._fetch("POST", "/" + entity, payload);
  },

  put: function (entity, id, payload) {
    return SUPPA.api._fetch("PUT", "/" + entity + "/" + id, payload);
  },

  del: function (entity, id) {
    return SUPPA.api._fetch("DELETE", "/" + entity + "/" + id);
  },

  reset: function () {
    return SUPPA.api._fetch("POST", "/reset");
  },
};

window.SUPPA = SUPPA;
