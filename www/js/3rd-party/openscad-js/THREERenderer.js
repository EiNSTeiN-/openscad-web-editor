// Generated by CoffeeScript 1.3.3
var THREERenderer;

THREERenderer = (function() {

  function THREERenderer(scene, params) {
    var _base, _ref, _ref1;
    this.scene = scene;
    this.params = params;
    if ((_ref = this.params) == null) {
      this.params = {};
    }
    if ((_ref1 = (_base = this.params)['default_color']) == null) {
      _base['default_color'] = new THREE.Color(0xff5566);
    }
    this.debug = true;
    return;
  }

  THREERenderer.prototype.render = function(node) {
    var angle, child, csg, diff, geometry, list, nodetype, obj, points, triangles, union, vector, vertex, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2;
    if (!(node != null)) {
      return;
    }
    nodetype = node.constructor.name;
    switch (nodetype) {
      case 'Echo':
        console.log(node.args.join());
        return;
      case 'Polyhedron':
        geometry = new THREE.Geometry();
        points = node.points.values;
        triangles = node.triangles.values;
        for (_i = 0, _len = points.length; _i < _len; _i++) {
          vector = points[_i];
          vertex = new THREE.Vector3();
          vertex.x = vector.values[0];
          vertex.y = vector.values[1];
          vertex.z = vector.values[2];
          geometry.vertices.push(vertex);
        }
        for (_j = 0, _len1 = triangles.length; _j < _len1; _j++) {
          vector = triangles[_j];
          vertex = new THREE.Face3();
          vertex.a = vector.values[0];
          vertex.b = vector.values[1];
          vertex.c = vector.values[2];
          geometry.faces.push(vertex);
        }
        geometry.computeCentroids();
        geometry.mergeVertices();
        if (this.debug) {
          console.log(['polyhedron', geometry]);
        }
        return geometry;
      case 'Sphere':
        geometry = new THREE.SphereGeometry(node.r);
        if (this.debug) {
          console.log(['sphere', geometry]);
        }
        return geometry;
      case 'Cube':
        geometry = new THREE.CubeGeometry(node.x, node.y, node.z);
        if (!node.center) {
          geometry.applyMatrix(new THREE.Matrix4(1, 0, 0, node.x / 2, 0, 1, 0, node.y / 2, 0, 0, 1, node.z / 2, 0, 0, 0, 1));
        }
        if (this.debug) {
          console.log(['cube', geometry]);
        }
        return geometry;
      case 'Cylinder':
        geometry = new THREE.CylinderGeometry(node.r2, node.r1, node.height);
        angle = 90 * 0.0174532925;
        geometry.applyMatrix(new THREE.Matrix4(1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1));
        if (!node.center) {
          geometry.applyMatrix(new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, node.height / 2, 0, 0, 0, 1));
        }
        if (this.debug) {
          console.log(['cylinder', geometry]);
        }
        return geometry;
      case 'Objects':
        list = (function() {
          var _k, _len2, _ref, _results;
          _ref = node.objects;
          _results = [];
          for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
            obj = _ref[_k];
            _results.push(this.render(obj));
          }
          return _results;
        }).call(this);
        list = list.compact();
        if (this.debug) {
          console.log(['objects', list]);
        }
        if (list.length === 1) {
          return list[0];
        }
        return list;
      case 'Union':
        list = this.render(node.body);
        if (!(list != null)) {
          return;
        }
        if (!(list instanceof Array) || list.length <= 1) {
          return list;
        }
        list = list.compact();
        union = THREE.CSG.toCSG(list[0]);
        _ref = list.slice(1);
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          child = _ref[_k];
          csg = THREE.CSG.toCSG(child);
          union = union.union(csg);
        }
        geometry = THREE.CSG.fromCSG(union);
        if (this.debug) {
          console.log(['union', geometry]);
        }
        return geometry;
      case 'Difference':
        list = this.render(node.body);
        if (!(list != null)) {
          return;
        }
        if (!(list instanceof Array) || list.length <= 1) {
          return list;
        }
        list = list.compact();
        diff = THREE.CSG.toCSG(list[0]);
        _ref1 = list.slice(1);
        for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
          child = _ref1[_l];
          csg = THREE.CSG.toCSG(child);
          diff = diff.subtract(csg);
        }
        geometry = THREE.CSG.fromCSG(diff);
        if (this.debug) {
          console.log(['difference', geometry]);
        }
        return geometry;
      case 'Intersection':
        list = this.render(node.body);
        if (!(list != null)) {
          return;
        }
        if (!(list instanceof Array) || list.length <= 1) {
          return list;
        }
        list = list.compact();
        geometry = THREE.CSG.toCSG(list[0]);
        _ref2 = list.slice(1);
        for (_m = 0, _len4 = _ref2.length; _m < _len4; _m++) {
          child = _ref2[_m];
          csg = THREE.CSG.toCSG(child);
          geometry = geometry.intersect(csg);
        }
        geometry = THREE.CSG.fromCSG(geometry);
        if (this.debug) {
          console.log(['intersection', geometry]);
        }
        return geometry;
      case 'Color':
        list = this.render(node.body);
        if (!(list != null)) {
          return;
        }
        if (!(list instanceof Array)) {
          list = [list];
        }
        list = list.compact();
        if (this.debug) {
          console.log(['color', list]);
        }
        if (list.length === 1) {
          return list[0];
        }
        return list;
      case 'MultMatrix':
        list = this.render(node.body);
        if (!(list != null)) {
          return;
        }
        if (!(list instanceof Array)) {
          list = [list];
        }
        list = list.compact();
        for (_n = 0, _len5 = list.length; _n < _len5; _n++) {
          child = list[_n];
          child.applyMatrix(new THREE.Matrix4(node.n11, node.n12, node.n13, node.n14, node.n21, node.n22, node.n23, node.n24, node.n31, node.n32, node.n33, node.n34, node.n41, node.n42, node.n43, node.n44));
        }
        if (this.debug) {
          console.log(['multmatrix', list]);
        }
        if (list.length === 1) {
          return list[0];
        }
        return list;
      default:
        throw 'Cannot render type "' + nodetype + '"';
    }
  };

  return THREERenderer;

})();
