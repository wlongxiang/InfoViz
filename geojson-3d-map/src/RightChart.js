import * as d3 from 'd3';
const width = window.innerWidth * 0.35;
const height = 300;
var svg = d3.select("#right")
    .append("svg").attr("width", width).attr("height", height);

var mapdata = null;
var mapkeys = null;
var highlightid = null;
var bar = null;

var pieLeftChart = echarts.init(document.getElementById("pie_left_container"));
var pieRightChart = echarts.init(document.getElementById("pie_right_container"));

var popChart = echarts.init(document.getElementById("pop_container"));
var scatterChart = echarts.init(document.getElementById("sc_container"));

export function initChart(data, main) {
    var option = {
        title: {
            text: 'Energy Comparision',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable: true,
        polar: {
            center: ['50%', '50%'],
            radius: '70%'
        },
        radiusAxis: {
            // 极坐标半径刻度
            min: 0,
            max: 100,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#737373'
                }
            }
        },
        angleAxis: {
            type: 'category',
            clockwise: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    width: 1,
                    type: 'dashed',
                    color: '#737373'
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#737373'
                }
            },
        },
        series: [{
            name: '半径模式',
            type: 'pie',
            clockwise: false,
            radius: ['15.6%', '70%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            hoverOffset: 0,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            lableLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data: convertPieData(data)
        }, 
        ]
    };
    pieLeftChart.resize();
    if (option && typeof option === "object") {
        pieLeftChart.setOption(option, true);
    }

    var option = {
        title: {
            text: 'Energy Comparision',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable: true,
        polar: {
            center: ['50%', '50%'],
            radius: '70%'
        },
        radiusAxis: {
            // 极坐标半径刻度
            min: 0,
            max: 100,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#737373'
                }
            }
        },
        angleAxis: {
            type: 'category',
            clockwise: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    width: 1,
                    type: 'dashed',
                    color: '#737373'
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#737373'
                }
            },
        },
        series: [{
            name: '半径模式',
            type: 'pie',
            clockwise: false,
            radius: ['15.6%', '70%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            hoverOffset: 0,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            lableLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data: convertPieData(data)
        }, 
        ]
    };
    pieRightChart.resize();
    if (option && typeof option === "object") {
        pieRightChart.setOption(option, true);
    }

    var option = {
        title: {
                text: "Comparison",
                left: "center"
            },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
       //     formatter: function(params){return Math.max(params.value,-params.value)}
            
            formatter: function (params) {
                        return params[0].name +
                            "<br>Province: " + -params[3].value + 
                            "<br>Min:" + params[0].value +
                            "<br>Avg:" + params[1].value +
                            "<br>Max:" + params[2].value;
                    }
        },
        grid: {
            radius: '2%',
            left: '3%',
            right: '20%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'value',
                axisLabel: {
                    formatter: function(value){return value/1000000 + 'M'},
                    textStyle: {
                        color: '#252525'
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'category',
                axisTick : {show: false},
                data : ['Polulation','Gas','Electricity','Hoursing Price','Transportation']
            }
        ],
        series : [
            {
                name:'min',
                type:'bar',
                stack: '总量',
                label: {
                      show: true,
                      position: 'insideRight'
                },
                data:[1703778, 5615641.12,1553846.1, 350000, 350297]
            },
            {
                name: 'avg',
                type: 'bar',
                stack: '总量',
                label: {
                      show: true,
                      position: 'insideRight'
                },
                data: [1803778, 1803778, 1803778, 1803778, 1803778, 1803778, 1803778]
            },
    
            {
                name: 'max',
                type: 'bar',
                stack: '总量',
                label: {
                      show: true,
                      position: 'insideRight'
                },
                data: [1803778, 1803778, 1803778, 1803778, 1803778, 1803778, 1803778]
            },
                {
                name:'Province',
                type:'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        formatter: function(params){return -params.value}
                    }
                },
                data:[-498130, -178731.16,-517703.35, -230000, -125035]
            }
        ]
    };

    popChart.resize();
    if (option && typeof option === "object") {
        popChart.setOption(option, true);
    }

    var main_data = Object.keys(main).map(function (key) {
        return main[key];
    });

    console.log(main_data)


    var schema = [{
        name: 'Gas',
        index: 0,
        text: 'Gas Consumption(M3)'
    },
    {
        name: 'Electricity',
        index: 1,
        text: 'Electricity Consumption(KWh)'
    },
    {
        name: 'Population',
        index: 2,
        text: 'Population Number'
    },
    {
        name: 'Houring Price',
        index: 3,
        text: 'Houring Price (Euro)'
    },
    ];


    var itemStyle = {
        normal: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
    };

    var option = {
        color: [
            '#dd4444', '#fec42c', '#80F1BE'
        ],
        grid: {
            x: '10%',
            x2: 150,
            y: '18%',
            y2: '10%'
        },
        tooltip: {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var value = obj.value;
                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                    obj.seriesName +
                    value[4] +
                    '</div>' +
                    schema[0].text + '：' + value[0] + '<br>' +
                    schema[1].text + '：' + value[1] + '<br>' +
                    schema[2].text + '：' + value[2] + '<br>' +
                    schema[3].text + '：' + value[3] + '<br>';
            }
        },
        xAxis: {
            type: 'value',
            name: 'Gas',
            nameGap: 16,
            nameTextStyle: {
                color: '#252525',
                fontSize: 14
            },
            max: 97000000,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#252525'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#252525'
                }
            },
            axisLabel: {
                formatter: function(value){return value/1000000 + 'M'},
                textStyle: {
                    color: '#252525'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: 'Electricity',
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
                color: '#252525',
                fontSize: 16
            },
            max: 262000000,
            axisLine: {
                lineStyle: {
                    color: '#252525'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#252525'
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                formatter: function(value){return value/1000000 + 'M'},
                textStyle: {
                    color: '#252525'
                }
            }
        },
        visualMap: [{
            left: '65%',
            top: '35%',
            dimension: 3,
            min: 1000,
            max: 22000,
            itemWidth: 30,
            itemHeight: 80,
            calculable: true,
            precision: 0.1,
            text: [''],
            textGap: 20,
            textStyle: {
                color: '#252525'
            },
            inRange: {
                symbolSize: [10, 70]
            },
            outOfRange: {
                symbolSize: [10, 70],
                color: ['rgba(255,255,255,.2)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#444']
                }
            }
        },
        {
            left: '75%',
            bottom: '15%',
            dimension: 2,
            min: 200000,
            max: 3500000,
            itemHeight: 80,
            calculable: true,
            precision: 0.1,
            text: [''],
            textGap: 20,
            textStyle: {
                color: '#252525'
            },
            inRange: {
                colorLightness: [0.8, 0.5]
            },
            outOfRange: {
                color: ['rgba(255,255,255,.2)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#444']
                }
            }
        }
        ],
        series: [{
            name: '',
            type: 'scatter',
            itemStyle: itemStyle,
            data: main_data
        },
        ]
    };
    scatterChart.resize();
    if (option && typeof option === "object") {
        scatterChart.setOption(option, true);
    }

}

function convertPieData(data) {
    var res = Array()
    Object.keys(data).map(function (key) {
        const obj = { name: key, value: data[key] };
        res.push(obj)
    });
    return res
}

export function rightHoverOn(obj) {
    pieLeftChart.dispatchAction({
        type: 'highlight',
        name: obj
    })
    pieRightChart.dispatchAction({
        type: 'highlight',
        name: obj
    })
}

export function rightHoverEnd(obj) {
    pieLeftChart.dispatchAction({
        type: 'downplay',
        name: obj
    })
    pieRightChart.dispatchAction({
        type: 'downplay',
        name: obj
    })
}

export function updateRight(data) {
    pieLeftChart.setOption({
        series: [{
            data: convertPieData(data)
        }]
    });
}

export function updateRightColor(data) {
    pieRightChart.setOption({
        series: [{
            data: convertPieData(data)
        }]
    });
}

export function loadComparison(data) {
    console.log(data)
    var pop = [
        {
            name:'min',
            type:'bar',
            stack: '总量',
            label: {
                  show: true,
                  position: 'insideRight'
            },
            data:data['min']
        },
        {
            name: 'avg',
            type: 'bar',
            stack: '总量',
            label: {
                  show: true,
                  position: 'insideRight'
            },
            data: data['mean']
        },

        {
            name: 'max',
            type: 'bar',
            stack: '总量',
            label: {
                  show: true,
                  position: 'insideRight'
            },
            data: data['max']
        },
            {
            name:'Province',
            type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    formatter: function(params){return -params.value}
                }
            },
            data:data['province']
        }
    ]
    popChart.setOption({
        series: pop
    });
}