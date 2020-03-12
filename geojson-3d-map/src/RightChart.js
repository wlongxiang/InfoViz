import * as d3 from 'd3';
const width = window.innerWidth * 0.35;
const height = 300;
var svg = d3.select("#right")
    .append("svg").attr("width", width).attr("height", height);

var mapdata = null;
var mapkeys = null;
var highlightid = null;
var bar = null;

var dom = document.getElementById("top_container");
var topChart = echarts.init(dom);

export function initChart(data) {
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
            {
                name: 'Province (Unit:KWh)',
                type: 'pie',
                radius: '90%',
                center: ['50%', '50%'],
                data: convertData(data),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    topChart.resize();
    if (option && typeof option === "object") {
        topChart.setOption(option, true);
    }

}

function convertData(data) {
    var res = Array()
    Object.keys(data).map(function (key) {
      const obj = {name:key, value:data[key]};
      res.push(obj)
    });
    return res
}

export function rightHoverOn(obj) {
    topChart.dispatchAction({
        type: 'highlight',
        name: obj
    })
}

export function rightHoverEnd(obj) {
    topChart.dispatchAction({
        type: 'downplay',
        name: obj
    })
}

export function updateRight(data) {
    topChart.setOption({
        series: [{
            data: convertData(data)
        }]
    });
}