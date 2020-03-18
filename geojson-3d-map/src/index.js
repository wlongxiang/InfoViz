import './index.less';

import ThreeMap from './ThreeMap.js';
import { GMap } from './ThreeMap.js';

import { initChart, rightHoverOn, updateRight, rightHoverEnd, loadComparison, updateRightColor, updateMain, back }from './RightChart.js'
// import { CineonToneMapping } from './assets/plugin/threejs/three';
// 打包的时候，此代码不载入
if (process.env.NODE_ENV === 'development') {
  import('./index.html');
}

var canvas = document.getElementById("center");
var colorbar_1 = document.getElementById("colorbar_1");
var colorbar_2 = document.getElementById("colorbar_2");
var colorbar_3 = document.getElementById("colorbar_3");
var colorbar_4 = document.getElementById("colorbar_4");
var colorbar_format = document.getElementById("colorbar_format");
var showgmap;
var showg = false;
var showgemeenten = '';
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
  showg = false;
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
    getSummaryData('gas').then(gas => {

    const init_name = Object.keys(data)[0];
    getSummaryComparison(init_name).then(com => {
      setRight(data, gas, main, com, init_name);
      $.get('/assets/map/Netherlands.json', d => {
        map.setMapData(d);
        map.loadData(data);
        map.loadColorData(data);
        loadColorBar(data, 'electricity');
        canvas.appendChild(map.renderer().domElement);
      })
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

        getDetailData(gemeenten, 'electricity').then(electricity => {
          getDetailData(gemeenten, 'gas').then(gas => {
            $.get('/assets/map/' + gemeenten + '.json', d => {
              updateRight(electricity);
              updateRightColor(gas);
              showg = true;
              showgemeenten = gemeenten;
              var gmap = new GMap()
              gmap.setMapData(d);
              gmap.loadData(data);
              gmap.loadColorData(color);
              showgmap = gmap;
              loadColorBar(data, colorKey);
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
    })
  })
}

// action
$('input').on('ifChecked', function (event) {
  if (event.target.name == 'iCheck') {
    if (showg) {
      getDetailData(showgemeenten, event.target.id).then(data => {
        showgmap.loadData(data);
      })
    }else {
      getSummaryData(event.target.id)
      .then(data => {
        map.loadData(data);
      })
    }
  }else if (event.target.name == 'iCheckColor') {
    if (showg) {
      getDetailData(showgemeenten, event.target.id).then(data => {
        showgmap.loadColorData(data);
        loadColorBar(data, event.target.id);
      })
    }else {
      getSummaryData(event.target.id)
      .then(data => {
        map.loadColorData(data);
        loadColorBar(data, event.target.id);
      })
    }
  }
});

/// right section
function setRight(electricity, gas, main, com, name) {
  initChart(electricity, gas, main, com, name);
}

const format_dict = {'electricity':'KWh', 'gas':'M3', 'housing_price':'Euro' , 'totaalmannenenvrouwen':'', 'transport':''}

function loadColorBar(data, format) {
  console.log(data);
  const values = Object.keys(data).map(function (key) {
    return data[key];
  });
  const k = 1 / (Math.max(...values) - Math.min(...values) + 0.5 * Math.min(...values))
  const min_value = 0.5 * Math.min(...values)
  const max_value = 0.5 * Math.max(...values)
  const interval = (max_value - min_value) / 3
  colorbar_1.innerHTML = nFormatter(Math.min(min_value))
  colorbar_2.innerHTML = nFormatter(Math.min(min_value + interval))
  colorbar_3.innerHTML = nFormatter(Math.min(min_value + 2 * interval))
  colorbar_4.innerHTML = nFormatter(Math.min(max_value))
  colorbar_format.innerHTML = format_dict[format]
}

function nFormatter(num, digits) {
  const si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "K" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
          break;
      }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
