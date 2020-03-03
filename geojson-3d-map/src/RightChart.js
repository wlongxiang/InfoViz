import * as d3 from 'd3';
const width = window.innerWidth * 0.35;
const height = 300;
var svg = d3.select("#right")
.append("svg").attr("width",width).attr("height",height);

var mapdata = null;
var mapkeys = null;
var highlightid = null;
var bar = null;

export function initChart(data) {

    mapdata = data;
    mapkeys = Object.keys(data);
    var values = mapkeys.map(function(key){
      return data[key];
    });
    var bar_width = width / (values.length + 2);
    var bar_padding = width / (values.length + 2) * 2 / values.length;
    
    var scale = d3.scaleLinear()
    .domain([0,d3.max(values)])
    .range([height,0]);
        
    bar = svg.selectAll("g").data(values).enter().append("g").attr("transform",function(d,i){
      return "translate("+i*(bar_width+bar_padding)+",0)";
    })
    
    bar.append("rect").attr("y",function(d){return scale(d);})
    .attr("width",bar_width)
    .attr("height",function(d){return (height - scale(d))})
    .attr("fill","#006de0")

}

export function hoverOn(obj) {
    if (highlightid != obj) {
        highlightid = obj
        var index = mapkeys.indexOf(highlightid)
        bar.select("rect").attr("fill", function(d,i) {
            if (i === index) {
                return "#ff0"
            }else {
                return "steelblue"
            }
        })
    }
}