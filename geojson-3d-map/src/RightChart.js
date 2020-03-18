import * as d3 from 'd3';
const width = window.innerWidth * 0.35;
const height = 300;
var svg = d3.select("#right")
    .append("svg").attr("width", width).attr("height", height);

var n_main = null;
var n_com = null;
var n_name = null;
var n_elec = null;
var n_gas = null;

var pieLeftChart = echarts.init(document.getElementById("pie_left_container"));
var pieRightChart = echarts.init(document.getElementById("pie_right_container"));

var popChart = echarts.init(document.getElementById("pop_container"));
var scatterChart = echarts.init(document.getElementById("sc_container"));

export function initChart(electricity, gas, main, com, name) {
    ////////////// Left Chart
    n_elec = electricity;
    n_gas = gas;
    var option = {
        title: {
            text: 'Gas Comparision',
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
            name: 'Gas Comparision',
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
            data: convertPieData(electricity)
        }, 
        ]
    };
    pieLeftChart.resize();
    if (option && typeof option === "object") {
        pieLeftChart.setOption(option, true);
    }

    var option = {
        title: {
            text: 'Electricity Comparision',
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
            name: 'Electricity Comparision',
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
            data: convertPieData(gas)
        }, 
        ]
    };
    pieRightChart.resize();
    if (option && typeof option === "object") {
        pieRightChart.setOption(option, true);
    }

//////////////  Comparison
    var option = {
        title: {
                text: "Comparison",
                left: "center"
            },
        grid: {
            radius: '2%',
            left: '3%',
            right: '20%',
            bottom: '3%',
            top:'10%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'value',
                axisTick : {show: false},
                axisLabel: {
                    formatter: function() {
                        return ''
                    },
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
                data : ['Transportation','Housing Price','Population','Electricity','Gas']
            }
        ]
    };

    popChart.resize();
    if (option && typeof option === "object") {
        popChart.setOption(option, true);
        n_name = name;
        n_com = com;
        loadComparison(name, com);
    }

    n_main = convertMainData(main)

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
    {
        name: 'Transportation',
        index: 4,
        text: 'Transportation'
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
            trigger: 'item',
            position: 'bottom',
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var value = obj.value;
                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                    value[4] +
                    '</div>' +
                    schema[0].text + '：' + nFormatter(value[0], 3) + '<br>' +
                    schema[1].text + '：' + nFormatter(value[1], 3) + '<br>' +
                    schema[2].text + '：' + nFormatter(value[2], 3) + '<br>' +
                    schema[3].text + '：' +  nFormatter(value[3], 3) + '<br>';
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
                formatter: nFormatter,
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
                formatter: nFormatter,
                textStyle: {
                    color: '#252525'
                }
            }
        },
        visualMap: [{
            left: '65%',
            top: '35%',
            dimension: 3,
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
                symbolSize: [10, 30]
            },
            outOfRange: {
                symbolSize: [10, 30],
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
            type: 'scatter',
            itemStyle: itemStyle
        },
        ]
    };
    scatterChart.resize();
    if (option && typeof option === "object") {
        scatterChart.setOption(option, true);
        updateMain(main);
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

function convertMainData(main) {
    var main_data = Object.keys(main).map(function (key) {
        return main[key];
    });
    return main_data;
}

function featueMainData(main) {
    var gas = [];
    var electricity = [];
    var population = [];
    var housing = [];
    main.forEach(item => {
        gas.push(item[0]);
        electricity.push(item[1]);
        population.push(item[2]);
        housing.push(item[3]);
    })
    const e_min = Math.min(...electricity) * 0.9;
    const g_min = Math.min(...gas) * 0.9;
    const p_min = Math.min(...population) * 0.9;
    const h_min = Math.min(...housing) * 0.9;
    const e_max = Math.max(...electricity);
    const g_max = Math.max(...gas);
    const p_max = Math.max(...population);
    const h_max = Math.max(...housing);
    const res = [e_max, e_min, g_max, g_min, p_max, p_min, h_max, h_min];
    return res;
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
    scatterChart.dispatchAction({
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
    scatterChart.dispatchAction({
        type: 'downplay',
        name: obj
    })
}

export function updateMain(data) {
    var main_data = convertMainData(data);
    const feature = featueMainData(main_data);
    scatterChart.setOption({
        xAxis: {
            max: feature[2],
        },
        yAxis: {
            max: feature[0],
        },
        visualMap: [{
            min: feature[7],
            max: feature[6],
        },
        {
            min: feature[5],
            max: feature[4],
        }],
        series: [{
            data: main_data
        }]
    });
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

const cDict = {'Transportation': 0,'Housing Price':1,'Population':2,'Electricity':3,'Gas':4};
export function loadComparison(name, data) {
    var pop = [
        {
            name:'min',
            type:'bar',
            stack: '总量',
            label: {
                  show: true,
                  position: 'insideRight',
                  formatter: function(params){
                    return ''
                }
            },
            data:data['min_r']
        },
        {
            name: 'avg',
            type: 'bar',
            stack: '总量',
            label: {
                  show: true,
                  position: 'insideRight',
                  formatter: function(params){
                    const index = cDict[params.name]
                    return nFormatter(data['mean'][index], 2)
                }
            },
            data: data['mean_r']
        },

        {
            name: 'max',
            type: 'bar',
            stack: '总量',
            label: {
                  show: true,
                  position: 'insideRight',
                  formatter: function(params){
                    const index = cDict[params.name]
                    return nFormatter(data['max'][index], 2)
                }
            },
            data: data['max_r']
        },
            {
            name:'Province',
            type:'bar',
            stack: '总量',
            label: {
                show: true,
                formatter: function(params){
                    const index = cDict[params.name]
                    return nFormatter(-data['province'][index])
                }
            },
            data:data['province_r']
        }
    ]
    popChart.setOption({
        legend: {
            data: [name, '1', '2', '3', '4'],
            show: true,
            left: 0,
            orient: 'vertical'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {       
                type : 'shadow'      
            },
            
            formatter: function (params) {
                const index = cDict[params[0].name];
                        return params[0].name + "<br>" + 
                            params[3].marker + name + ":" + nFormatter(-data['province'][index], 2) + "<br>" +
                            params[0].marker + "Min:" + nFormatter(data['min'][index], 2) + "<br>" +
                            params[1].marker + "Avg:" + nFormatter(data['mean'][index], 2) + "<br>" +
                            params[2].marker + "Max:" + nFormatter(data['max'][index], 2);
                    }
        },
        title: {
            text: name + ' VS Rest',
            left: "center"
        },
        series: pop
    });
}

export function back() {
    updateMain(n_main);
    loadComparison(n_name, n_com);
    updateRight(n_elec);
    updateRightColor(n_gas);
}

function nFormatter(num, digits=0) {
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