import './index.less';

import ThreeMap from './ThreeMap.js';
import { GMap } from './ThreeMap.js';

import { initChart, rightHoverOn, updateRight, rightHoverEnd, loadComparison, updateRightColor, updateMain, back }from './RightChart.js'
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

map.on('click', (e, g) => {
  const name = g.data.properties.locname;
  needZoomIn(name);
  getProvinceMain(name).then(main => {
    updateMain(main);
  })
});
map.on('mouseover', (e, g) => {
  const name = g.data.properties.locname;
    rightHoverOn(name);
    getSummaryComparison(name).then(pop => {
      loadComparison(name, pop)
    })
});
map.hoverEnd(() => {
   rightHoverEnd()
});
map.onBtnClick(() => {
  back();
})

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

const getSummaryMain = () => {
  return new Promise(function (resolve, reject) {
    $.get('/infoviz/summary_main/1', pro => {
      resolve(pro);
    })
  })
}

const getProvinceMain = (province) => {
  return new Promise(function (resolve, reject) {
    $.get('/infoviz/province_main/' + province, pro => {
      resolve(pro);
    })
  })
}

const getSummaryComparison = (province) => {
  return new Promise(function (resolve, reject) {
    $.get('/infoviz/summary_pop/' + province , pro => {
      resolve(pro);
    })
  })
}

const getProvinceComparison = (province, gemeenten) => {
  return new Promise(function (resolve, reject) {
    $.get('/infoviz/province_pop/' + province + '/' + gemeenten , pro => {
      resolve(pro);
    })
  })
}

getSummaryData('electricity').then(data => {
  getSummaryMain().then(main => {
    const init_name = Object.keys(data)[0];
    getSummaryComparison(init_name).then(com => {
      setRight(data, main, com, init_name);
      $.get('/assets/map/Netherlands.json', d => {
        map.setMapData(d);
        map.loadData(data);
        map.loadColorData(data);
        canvas.appendChild(map.renderer().domElement);
      })
    })
  })
})

function needZoomIn(gemeenten) {
  var key = $(".radio_data:checked").attr('id')
  var colorKey = $(".radio_color:checked").attr('id')

  getDetailData(gemeenten, key).then(data => {
    getDetailData(gemeenten, colorKey).then(color => {
      const init_name = Object.keys(data)[0];
      getProvinceComparison(gemeenten, init_name).then(pop => {
        $.get('/assets/map/' + gemeenten + '.json', d => {
          var gmap = new GMap()
          gmap.setMapData(d);
          gmap.loadData(data);
          gmap.loadColorData(color);
          loadComparison(init_name, pop)

          map.addnewmap(gmap, gemeenten)
          gmap.on('mouseover', (e, g) => {
            const name = g.data.properties.Gemeentena;
            rightHoverOn(name);
            getProvinceComparison(gemeenten, name).then(pop => {
              loadComparison(name, pop)
            })
          });
          gmap.hoverEnd(() => {
            rightHoverEnd()
          });
        })
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
      updateRightColor(data);
    })
  }
});

/// right section
function setRight(data, main, com, name) {
  initChart(data, main, com, name);
}


