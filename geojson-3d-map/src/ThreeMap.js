import * as d3 from 'd3-geo';

const THREE = window.THREE;
const width = window.innerWidth * 0.5;
const height = window.innerHeight;
// Init scene
export default class ThreeMap {
  constructor() {
    this.color = '#006de0';
    this.canvas = document.getElementById('center');
  }

  setMapData(mapData) {
    this.mapData = mapData;
    this.init();
  }

  /**
   * @desc init scene
   */
  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );
    this.camera = new THREE.PerspectiveCamera(10, width / height, 1, 1000);

    this.setCamera({ x: 0, y: 0, z: 50 });
    this.setLight();
    this.setRender();

    this.setHelper();

    this.drawMap();
    this.setControl();
    this.animate();
    this.canvas.addEventListener('click', this.mouseEvent.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseoverEvent.bind(this), false );
  }

mouseoverEvent( event ) 
{
	if (!this.raycaster) {
    this.raycaster = new THREE.Raycaster();
  }
  if (!this.mouse) {
    this.mouse = new THREE.Vector2();
  }
  if (!this.meshes) {
    this.meshes = [];
    this.group.children.forEach(g => {
      g.children.forEach(mesh => {
        this.meshes.push(mesh);
      });
    });
  }
	// update the mouse variable
  this.mouse.x = ((event.clientX-window.innerWidth * 0.15) / width) * 2 - 1;
  this.mouse.y = -(event.clientY / height) * 2 + 1;
  this.raycaster.setFromCamera(this.mouse, this.camera);
  const intersects = this.raycaster.intersectObjects(this.meshes);

  if (intersects.length > 0) {
    this.setAreaColor(intersects[0].object.parent);
    this.hoverFunction(event, intersects[0].object.parent);
  }
}

  /**
   * @desc handle mouse event
   */
  mouseEvent(event) {
    // 计算物体和射线的焦点
    const intersects = this.raycaster.intersectObjects(this.meshes);
    if (intersects.length > 0) {
      this.clickFunction(event, intersects[0].object.parent);
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
    }else if (eventName == 'mouseover') {
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
            const lineMesh = this.drawLine(p);
            lineGroup.add(lineMesh);
            g.add(mesh);
          });
        } else {
          // 单个面
          const mesh = this.drawModel(points, d.properties.locname);
          const lineMesh = this.drawLine(points);
          lineGroup.add(lineMesh);
          g.add(mesh);
        }
      });
      group.add(g);
    });
    this.group = group; // 丢到全局去
    if (!this.meshes) {
      this.meshes = [];
      this.group.children.forEach(g => {
        g.children.forEach(mesh => {
          this.meshes.push(mesh);
        });
      });
    }
    const lineGroupBottom = lineGroup.clone();
    lineGroupBottom.position.z = 0;
    this.scene.add(lineGroup);
    this.scene.add(lineGroupBottom);
    this.scene.add(group);
  }

  /**
   * @desc drawLine
   * @param {} points
   */
  drawLine(points) {
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
    // mesh.rotate( Math.PI / 2);
    mesh.rotation.z -= Math.PI / 2;
    // mesh.rotation.y += Math.PI / 4;
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

  /**
   * @desc 动画
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // required if controls.enableDamping or controls.autoRotate are set to true
    this.controls.update();

    this.renderer.render(this.scene, this.camera);

    this.doAnimate && this.doAnimate.bind(this)();
  }

  /**
   * @desc 设置控制器
   */
  setControl() {
    this.controls = new THREE.OrbitControls(this.camera, this.canvas);
    this.controls.update();
  }

  /**
   * @desc 相机
   */
  setCamera(set) {
    const { x, y, z } = set;
    this.camera.up.x = 0;
    this.camera.up.y = 0;
    this.camera.up.z = 1;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * @desc 设置光线
   */
  setLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.scene.add(directionalLight);
  }

  /**
   * @desc 设置渲染器
   */
  setRender() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    // document.body.appendChild(this.renderer.domElement);
  }

  /**
   * @desc 设置参考线
   */
  setHelper() {
    const axesHelper = new THREE.AxisHelper(5);
    this.scene.add(axesHelper);
  }

  loadData(data) {
    this.depth = data;
    const values = Object.keys(data).map(function(key){
      return data[key];
    });
    const k = 1 /(Math.max(...values)-Math.min(...values))
    const min_value = Math.min(...values)
    this.meshes.forEach(mesh => {
      const name = mesh.name
      const value = k * (data[name]-min_value) + 0.5
      mesh.scale.z = value;
    })
    
  }
}
