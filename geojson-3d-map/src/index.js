import './index.less';

import ThreeMap from './ThreeMap.js';
import { GMap } from './ThreeMap.js';

import { initChart, rightHoverOn, updateRight, rightHoverEnd }from './RightChart.js'
// import { CineonToneMapping } from './assets/plugin/threejs/three';
// 打包的时候，此代码不载入
if (process.env.NODE_ENV === 'development') {
  import('./index.html');
}
var left = document.getElementById("left");
setLeft();
var canvas = document.getElementById("center");
var datalist = document.getElementById('list_color');
var right = document.getElementById("right");

// create map
const map = new ThreeMap();

// network
const getSummaryData = type => {
  return new Promise(function (resolve, reject) {
    $.get('/infoviz/summary/' + type, pro => {
      resolve(pro);
    })
  })
}

const getDetailData = (gemeenten, type) => {
  return new Promise(function (resolve, reject) {
    $.get('/infoviz/gemeenten/' + gemeenten +'/'+ type, pro => {
      resolve(pro);
    })
  })
}

getSummaryData('electricity').then(data => {
  setRight(data);
  $.get('/assets/map/Netherlands.json', d => {
    map.setMapData(d);
    map.on('click', (e, g) => {
      needZoomIn(g.data.properties.locname);
    });
    map.on('mouseover', (e, g) => {
        rightHoverOn(g.data.properties.locname);
    });
    map.hoverEnd(() => {
       rightHoverEnd()
    });
    map.loadData(data);
    map.loadColorData(data);
    canvas.appendChild(map.renderer().domElement);
  })}
)

function needZoomIn(gemeenten) {
  var key = $(".radio_data:checked").attr('id')
  var colorKey = $(".radio_color:checked").attr('id')

  getDetailData(gemeenten, key).then(data => {
    getDetailData(gemeenten, colorKey).then(color => {
        // setRight(data)
        $.get('/assets/map/' + gemeenten + '.json', d => {
          const gmap = new GMap()
          gmap.setMapData(d);
          gmap.loadData(data);
          gmap.loadColorData(color);
          map.addnewmap(gmap, gemeenten)
          gmap.on('mouseover', (e, g) => {
            rightHoverOn(g.data.properties.locname);
          });
          gmap.hoverEnd(() => {
            rightHoverEnd()
          });
        })
    })
  })
}

/// left section
function setLeft() {
  // var slider = createD3RangeSlider(0, 100, "#slider-container");
}

// action
$('input').on('ifChecked', function (event) {
  if (event.target.name == 'iCheck') {
    getSummaryData(event.target.id)
    .then(data => {
      map.loadData(data);
      updateRight(data);
    })
  }else if (event.target.name == 'iCheckColor') {
    getSummaryData(event.target.id)
    .then(data => {
      map.loadColorData(data);
      updateRight(data);
    })
  }
});

/// right section
function setRight(data) {
  initChart(data);
}

