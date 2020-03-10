var center = new Array();
center['Groningen'] = {x: -2.2308402657508846, y: -2.649917304515839, z: 0}
center['Friesland'] = {x: -0.9728308096528048, y: -2.5048851370811462, z: 0}
center['Drenthe'] = {x: -2.103163361549377, y: -2.0826888680458073, z: 0}
center['Noord-Holland'] = {x: 0.22963106632232697, y: -1.3353348970413208, z: 0}
center['Flevoland'] = {x: -0.6127708628773686, y: -1.2500718832015993, z: 0}
center['Overijssel'] = {x: -1.85017853975296, y: -1.112329244613648, z: 0}
center['Zuid-Holland'] = {x: 0.9293583519756794, y: 0.02876299619674703, z: 0}
center['Utrecht'] = {x: -0.15333449840545652, y: -0.18537916243076327, z: 0}
center['Gelderland'] = {x: -1.1356994584202766, y: -0.29426506161689786, z: 0}
center['Noord-Brabant'] = {x: -0.026888310909271476, y: 1.0674385130405426, z: 0}
center['Limburg'] = {x: -1.1119238138198857, y: 1.6482849717140196, z: 0}

import * as d3 from 'd3-geo';
import * as TWEEN from 'tween'
const THREE = window.THREE;
const width = window.innerWidth * 0.5;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, width / height, 1, 1000);
const canvas = document.getElementById('center');
const renderer = new THREE.WebGLRenderer();
const btNetherlands = document.getElementById('toNetherlands');
/**
   * @desc 动画
   */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  TWEEN.update();
}

/**
 * @desc 设置控制器
 */
function setControl() {
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.update();
}

/**
 * @desc 相机
 */
function setCamera(set) {
  const { x, y, z } = set;
  camera.up.x = 0;
  camera.up.y = 0;
  camera.up.z = 1;
  camera.position.set(x, y, z);
  camera.lookAt(0, 0, 0);
}

/**
 * @desc 设置光线
 */
function setLight() {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(directionalLight);
}

/**
 * @desc 设置渲染器
 */
function setRender() {
  renderer.setSize(width, height);
}

/**
 * @desc 设置参考线
 */
function setHelper() {
  const axesHelper = new THREE.AxisHelper(5);
  scene.add(axesHelper);
}

function init() {
  scene.background = new THREE.Color(0xffffff);
  
  setCamera({ x: 0, y: 0, z: 50 });
  setLight();
  setRender();

  setHelper();

  setControl();
  animate();
}

init();


// Init scene
export default class ThreeMap {
  constructor() {
    this.color = '#006de0';
    this.canvas = document.getElementById('center');
  }

  renderer() {
    return renderer;
  }

  setMapData(mapData) {
    this.mapData = mapData;
    this.init();
  }

  /**
   * @desc init scene
   */
  init() {
    this.drawMap();
    btNetherlands.addEventListener("click", this.btnClick.bind(this), false);
    this.canvas.addEventListener('click', this.mouseEvent.bind(this), false);
    this.canvas.addEventListener('mousemove', this.mouseoverEvent.bind(this), false);
    this.isHide = false;
    this.skip = false;
  }

  btnClick(event) {
    this.show();
    this.gmap.remove();
    this.skip = true;
  }

  mouseoverEvent(event) {
    if (!this.isHide) {
      if (!this.raycaster) {
        this.raycaster = new THREE.Raycaster();
      }
      if (!this.mouse) {
        this.mouse = new THREE.Vector2();
      }
      // update the mouse variable
      this.mouse.x = ((event.clientX - window.innerWidth * 0.15) / width) * 2 - 1;
      this.mouse.y = -(event.clientY / height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, camera);
      const intersects = this.raycaster.intersectObjects(this.meshes);
  
      if (intersects.length > 0) {
        this.setAreaColor(intersects[0].object.parent);
        this.hoverFunction(event, intersects[0].object.parent);
      }
    }
  }

  /**
   * @desc handle mouse event
   */
  mouseEvent(event) {
    if (!this.isHide) {
      // 计算物体和射线的焦点
      const intersects = this.raycaster.intersectObjects(this.meshes);
      if (intersects.length > 0) {
        if (this.skip) {
          this.skip = false;
        }else {
          this.clickFunction(event, intersects[0].object.parent);
          console.log(intersects[0].object.name)
          console.log(getCenterPoint(intersects[0].object))

        }
      }
    }
  }

  /**
   * @desc set region color
   */
  setAreaColor(g, color = '#ff0') {
    // set to default
    g.parent.children.forEach(gs => {
      gs.children.forEach(mesh => {
        mesh.material.color.set(this.color);
      });
    });

    // set color
    g.children.forEach(mesh => {
      mesh.material.color.set(color);
    });
  }

  /**
   * @desc bind event
   */
  on(eventName, func) {
    if (eventName === 'click') {
      this.clickFunction = func;
    } else if (eventName == 'mouseover') {
      this.hoverFunction = func;
    }
  }
  /**
   * @desc creating map
   */
  drawMap() {
    if (!this.mapData) {
      console.error('this.mapData data can not be null');
      return;
    }
    // conver coordinate to x,y,z 
    this.mapData.features.forEach(d => {
      d.vector3 = [];
      d.geometry.coordinates.forEach((coordinates, i) => {
        d.vector3[i] = [];
        coordinates.forEach((c, j) => {
          if (c[0] instanceof Array) {
            d.vector3[i][j] = [];
            c.forEach(cinner => {
              let cp = this.lnglatToMector(cinner);
              d.vector3[i][j].push(cp);
            });
          } else {
            let cp = this.lnglatToMector(c);
            d.vector3[i].push(cp);
          }
        });
      });
    });

    // 绘制地图模型
    const group = new THREE.Group();
    const lineGroup = new THREE.Group();
    this.mapData.features.forEach(d => {
      const g = new THREE.Group(); // 用于存放每个地图模块。||省份
      g.data = d;
      d.vector3.forEach(points => {
        // 多个面
        if (points[0][0] instanceof Array) {
          points.forEach(p => {
            const mesh = this.drawModel(p, d.properties.locname);
            const lineMesh = this.drawLine(p, d.properties.locname);
            lineGroup.add(lineMesh);
            g.add(mesh);
          });
        } else {
          // 单个面
          const mesh = this.drawModel(points, d.properties.locname);
          const lineMesh = this.drawLine(points, d.properties.locname);
          lineGroup.add(lineMesh);
          g.add(mesh);
        }
      });
      group.add(g);
    });
    this.group = group;
    this.lineGroup = lineGroup;
    // 丢到全局去
    if (!this.meshes) {
      this.meshes = [];
      this.group.children.forEach(g => {
        g.children.forEach(mesh => {
          this.meshes.push(mesh);
        });
      });
    }
    if (!this.lineMeshs) {
      this.lineMeshs = [];
      lineGroup.children.forEach(g => {
        // g.children.forEach(mesh => {
        this.lineMeshs.push(g);
        // });
      });
    }
    const lineGroupBottom = lineGroup.clone();
    lineGroupBottom.position.z = 0;

    scene.add(lineGroup);
    scene.add(lineGroupBottom);
    scene.add(group);
    this.lineGroupBottom = lineGroupBottom;
  }

  /**
   * @desc drawLine
   * @param {} points
   */
  drawLine(points, identify) {
    const material = new THREE.LineBasicMaterial({
      color: '#ccc',
      transparent: true,
      opacity: 0.7
    });
    const geometry = new THREE.Geometry();
    points.forEach(d => {
      const [x, y, z] = d;
      geometry.vertices.push(new THREE.Vector3(x, y, z));
    });
    const line = new THREE.Line(geometry, material);
    line.rotation.z -= Math.PI / 2;
    line.name = identify;

    return line;
  }

  /**
   * @desc 绘制地图模型 points 是一个二维数组 [[x,y], [x,y], [x,y]]
   */
  drawModel(points, identify) {
    const shape = new THREE.Shape();
    points.forEach((d, i) => {
      const [x, y] = d;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    });

    const geometry = new THREE.ExtrudeGeometry(shape, {
      amount: 1,
      bevelEnabled: false,
    });
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = identify;
    mesh.rotation.z -= Math.PI / 2;
    return mesh;
  }

  /**
   * @desc 经纬度转换成墨卡托投影
   * @param {array} 传入经纬度
   * @return array [x,y,z]
   */
  lnglatToMector(lnglat) {
    if (!this.projection) {
      this.projection = d3
        .geoMercator()
        .center([5.1, 52])
        .scale(80)
        .translate([0, 0]);
    }
    const [y, x] = this.projection([...lnglat]);
    let z = 0;
    return [x, y, z];
  }

  loadData(data) {
    this.depth = data;
    const values = Object.keys(data).map(function (key) {
      return data[key];
    });
    const k = 1 / (Math.max(...values) - Math.min(...values))
    const min_value = Math.min(...values)
    this.meshes.forEach(mesh => {
      const name = mesh.name
      const value = k * (data[name] - min_value) + 0.5
      mesh.scale.z = value;
    })
    this.lineMeshs.forEach(line => {
      const name = line.name
      const value = k * (data[name] - min_value) + 0.5
      line.position.z = value;
    })
  }

  addnewmap(gmap, name) {
    this.gmap = gmap;
    this.hide();
    this.gmap.moveToCenter(name, 0, 500);
  }

  hide() {
    this.group.visible = false;
    this.lineGroup.visible = false;
    this.lineGroupBottom.visible = false;
    this.isHide = true;
    btNetherlands.hidden = false;
  }

  show() {
    this.group.visible = true;
    this.lineGroup.visible = true;
    this.lineGroupBottom.visible = true;
    this.isHide = false;
    btNetherlands.hidden = true;
  }
}

// Init scene
export class GMap {
  constructor() {
    this.color = '#006de0';
    this.canvas = document.getElementById('center');
  }

  renderer() {
    return renderer;
  }

  setMapData(mapData) {
    this.mapData = mapData;
    this.init();
  }

  /**
   * @desc init scene
   */
  init() {
    this.drawMap();
    this.canvas.addEventListener('click', this.mouseEvent.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseoverEvent.bind(this), false);
  }

  mouseoverEvent(event) {
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster();
    }
    if (!this.mouse) {
      this.mouse = new THREE.Vector2();
    }
    // update the mouse variable
    this.mouse.x = ((event.clientX - window.innerWidth * 0.15) / width) * 2 - 1;
    this.mouse.y = -(event.clientY / height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObjects(this.meshes);

    if (intersects.length > 0) {
      this.setAreaColor(intersects[0].object.parent);
    }
  }

  /**
   * @desc handle mouse event
   */
  mouseEvent(event) {
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster();
    }
    if (!this.mouse) {
      this.mouse = new THREE.Vector2();
    }
    // 计算物体和射线的焦点
    const intersects = this.raycaster.intersectObjects(this.meshes);
    if (intersects.length > 0) {
    }

  }

  /**
   * @desc set region color
   */
  setAreaColor(g, color = '#ff0') {
    // set to default
    g.parent.children.forEach(gs => {
      gs.children.forEach(mesh => {
        mesh.material.color.set(this.color);
      });
    });

    // set color
    g.children.forEach(mesh => {
      mesh.material.color.set(color);
    });
  }
  /**
   * @desc creating map
   */
  drawMap() {
    if (!this.mapData) {
      console.error('this.mapData data can not be null');
      return;
    }
    // conver coordinate to x,y,z 
    this.mapData.features.forEach(d => {
      d.vector3 = [];
      d.geometry.coordinates.forEach((coordinates, i) => {
        d.vector3[i] = [];
        coordinates.forEach((c, j) => {
          if (c[0] instanceof Array) {
            d.vector3[i][j] = [];
            c.forEach(cinner => {
              let cp = this.lnglatToMector(cinner);
              d.vector3[i][j].push(cp);
            });
          } else {
            let cp = this.lnglatToMector(c);
            d.vector3[i].push(cp);
          }
        });
      });
    });

    // 绘制地图模型
    const group = new THREE.Group();
    const lineGroup = new THREE.Group();
    this.mapData.features.forEach(d => {
      const g = new THREE.Group(); // 用于存放每个地图模块。||省份
      g.data = d;
      d.vector3.forEach(points => {
        // 多个面
        if (points[0][0] instanceof Array) {
          points.forEach(p => {
            const mesh = this.drawModel(p, d.properties.Gemeentena);
            const lineMesh = this.drawLine(p, d.properties.Gemeentena);
            lineGroup.add(lineMesh);
            g.add(mesh);
          });
        } else {
          // 单个面
          const mesh = this.drawModel(points, d.properties.Gemeentena);
          const lineMesh = this.drawLine(points, d.properties.Gemeentena);
          lineGroup.add(lineMesh);
          g.add(mesh);
        }
      });
      group.add(g);
    });
    // 丢到全局去
    this.group = group;
    this.lineGroup = lineGroup;
    if (!this.meshes) {
      this.meshes = [];
      this.group.children.forEach(g => {
        g.children.forEach(mesh => {
          this.meshes.push(mesh);
        });
      });
    }
    if (!this.lineMeshs) {
      this.lineMeshs = [];
      lineGroup.children.forEach(g => {
        this.lineMeshs.push(g);
      });
    }

    this.lineGroupBottom = lineGroup.clone();
    this.lineGroupBottom.position.z = 0;
    scene.add(lineGroup);
    scene.add(this.lineGroupBottom);
    scene.add(group);
  }

  /**
   * @desc drawLine
   * @param {} points
   */
  drawLine(points, identify) {
    const material = new THREE.LineBasicMaterial({
      color: '#ccc',
      transparent: true,
      opacity: 0.7
    });
    const geometry = new THREE.Geometry();
    points.forEach(d => {
      const [x, y, z] = d;
      geometry.vertices.push(new THREE.Vector3(x, y, z));
    });
    const line = new THREE.Line(geometry, material);
    line.rotation.z -= Math.PI / 2;
    line.name = identify;

    return line;
  }

  /**
   * @desc 绘制地图模型 points 是一个二维数组 [[x,y], [x,y], [x,y]]
   */
  drawModel(points, identify) {
    const shape = new THREE.Shape();
    points.forEach((d, i) => {
      const [x, y] = d;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    });

    const geometry = new THREE.ExtrudeGeometry(shape, {
      amount: 1,
      bevelEnabled: false,
    });
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = identify;
    mesh.rotation.z -= Math.PI / 2;
    return mesh;
  }

  /**
   * @desc 经纬度转换成墨卡托投影
   * @param {array} 传入经纬度
   * @return array [x,y,z]
   */
  lnglatToMector(lnglat) {
    if (!this.projection) {
      this.projection = d3
        .geoMercator()
        .center([5.1, 52])
        .scale(80)
        .translate([0, 0]);
    }
    const [y, x] = this.projection([...lnglat]);
    let z = 0;
    return [x, y, z];
  }

  loadData(data) {
    this.depth = data;
    const values = Object.keys(data).map(function (key) {
      const value = data[key];
      if (typeof (value) == 'string') {
        return value.replace(',', '') - 0;
      } else {
        return 20;
      }
    });
    const k = 1 / (Math.max(...values) - Math.min(...values))
    const min_value = Math.min(...values)
    this.meshes.forEach(mesh => {
      const name = mesh.name;
      const value = data[name];
      var res = 20;
      if (typeof (value) == 'string') {
        res = k * (value.replace(',', '') - min_value) + 0.5;
      }
      mesh.scale.z = res;
    })
    this.lineMeshs.forEach(line => {
      const name = line.name;
      const value = data[name];
      var res = 20;
      if (typeof (value) == 'string') {
        res = k * (value.replace(',', '') - min_value) + 0.5;
      }
      line.position.z = res;
    })
  }



  moveToCenter(name, wait, time) {
    console.log(center)
    console.log(name)
    const coordinate = center[name]
    new TWEEN.Tween(this.group.position)
      .delay(wait)
      .to(coordinate, time)
      .easing(TWEEN.Easing.Back.Out)
      .start();
    new TWEEN.Tween(this.lineGroup.position)
      .delay(wait)
      .to(coordinate, time)
      .easing(TWEEN.Easing.Back.Out)
      .start();
    new TWEEN.Tween(this.lineGroupBottom.position)
      .delay(wait)
      .to(coordinate, time)
      .easing(TWEEN.Easing.Back.Out)
      .start();
  }

  remove() {
    scene.remove(this.group)
    scene.remove(this.lineGroup)
    scene.remove(this.lineGroupBottom)
  }

}


function getCenterPoint(mesh) {
  var middle = new THREE.Vector3();
  var geometry = mesh.geometry;

  geometry.computeBoundingBox();

  middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
  middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
  middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

  mesh.localToWorld(middle);
  return middle;
}
