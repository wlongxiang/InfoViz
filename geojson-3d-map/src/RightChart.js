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
    pieLeftChart.resize();
    if (option && typeof option === "object") {
        pieLeftChart.setOption(option, true);
    }

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
    pieRightChart.resize();
    if (option && typeof option === "object") {
        pieRightChart.setOption(option, true);
    }

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            //     formatter: function(params){return Math.max(params.value,-params.value)}

            formatter: function (params) {
                return params[0].name +
                    "<br>Total: " + params[0].value +
                    "<br>Province:" + -params[1].value;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value'
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: { show: false },
                data: ['Polulation', 'Gas', 'Electricity', 'Hoursing Price', 'Transportation']
            }
        ],
        series: [

            {
                name: 'Province',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true
                    }
                },
                data: [1703778, 5615641.12, 1553846.1, 350000, 350297]
            },
            {
                name: 'Total',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        formatter: function (params) { return -params.value }
                    }
                },
                data: [-498130, -178731.16, -517703.35, -230000, -125035]
            }
        ]
    };

    popChart.resize();
    if (option && typeof option === "object") {
        popChart.setOption(option, true);
    }

    var data = [
        [17873140.16, 51770327.35, 498130, 250000, "Drenthe"],
        [8952013, 38240724, 411665, 210000, "Flevoland"],
        [28252051.98, 68009281.39, 672890, 250952, "Friesland"],
        [79044282.81, 215323726.5, 2116595, 234516, "Gelderland"],
        [27654950.4, 56091044.76, 588370, 136712, "Groningen"],
        [46366091.45, 111304381.7, 1122505, 254318, "Limburg"],
        [96883902.48, 261214934.1, 2653230, 310998, "Noord-Brabant"],
        [92043387, 246645516, 2906285, 291845, "Noord-Holland"],
        [29513475.84, 108346037.3, 1097400, 147621, "Overijssel"],
        [41422905, 119615584, 1358525, 324567, "Utrecht"],
        [93557965, 277284783, 3612300, 278901, "Zuid-Holland"]
    ];


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
                color: '#fff',
                fontSize: 14
            },
            max: 97000000,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#777'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#777'
                }
            },
            axisLabel: {
                formatter: '{value}',
                textStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: 'Electricity',
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
                color: '#fff',
                fontSize: 16
            },
            max: 262000000,
            axisLine: {
                lineStyle: {
                    color: '#777'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#777'
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            }
        },
        visualMap: [{
            left: 'right',
            top: '30%',
            dimension: 3,
            min: 130000,
            max: 320000,
            itemWidth: 30,
            itemHeight: 120,
            calculable: true,
            precision: 0.1,
            text: ['Luminance: Price'],
            textGap: 20,
            textStyle: {
                color: '#fff'
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
            left: 'right',
            bottom: '20%',
            dimension: 2,
            min: 411665,
            max: 3612300,
            itemHeight: 120,
            calculable: true,
            precision: 0.1,
            text: ['Size: Population'],
            textGap: 20,
            textStyle: {
                color: '#fff'
            },
            inRange: {
                colorLightness: [1, 0.5]
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
            data: data
        },
        ]
    };
    scatterChart.resize();
    if (option && typeof option === "object") {
        scatterChart.setOption(option, true);
    }

}

function convertData(data) {
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
            data: convertData(data)
        }]
    });
}