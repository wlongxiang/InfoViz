import './index.less';

import ThreeMap from './ThreeMap.js';
import createD3RangeSlider from './d3RangeSlider.js'
import { initChart, hoverOn, update }from './RightChart.js'
// 打包的时候，此代码不载入
if (process.env.NODE_ENV === 'development') {
  import('./index.html');
}
var left = document.getElementById("left");
setLeft();
var canvas = document.getElementById("center");
var right = document.getElementById("right");

// 创建地图
const map = new ThreeMap();

// 网络请求
const getSummaryData = type => {
  return new Promise(function (resolve, reject) {
    $.get('/infoviz/summary/' + type, pro => {
      resolve(pro);
    })
  })
}

getSummaryData('electricity').then(data => {
  setRight(data);
  $.get('/assets/map/Aruba_AL306.json', d => {
    map.setMapData(d);
    map.on('click', (e, g) => {
      console.log(g);
    });
    map.on('mouseover', (e, g) => {
      hoverOn(g.data.properties.locname);
    });
    map.loadData(data);
    canvas.appendChild(map.renderer.domElement);
  })}
)
/// left section
function setLeft() {
  var slider = createD3RangeSlider(0, 100, "#slider-container");
}

// action
$('input').on('ifChecked', function (event) {
  getSummaryData(event.target.id)
    .then(data => {
      map.loadData(data);
      update(data);
    })
});

/// right section
function setRight(data) {
  initChart(data);
}

