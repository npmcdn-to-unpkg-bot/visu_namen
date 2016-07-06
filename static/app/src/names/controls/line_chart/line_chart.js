/**
 * Created by mw on 02.07.16.
 * based on http://bl.ocks.org/mbostock/3884955
 */

(function () {
    angular.module('names').directive('namesLineChart', function ($parse, $log) {
        var directiveDefinitionObject = {
            restrict: 'E',
            replace: false,
            scope: {data : '=' },
            link: function (scope, element, attrs) {
                scope.$watch("data", function (chartData) {
                    // hack
                    d3.select(element[0]).selectAll("svg").remove();

                    if (chartData === undefined) {
                        $log.debug("data undefined");
                        return;
                    }

                    if (chartData.length == 0) {
                        $log.debug("data empty");
                        return;
                    }


                    $log.debug("data ok: length = " + chartData.length);
                    //$log.debug(JSON.stringify(chartData, null, "    "));

                    var margin = {top: 20, right: 20, bottom: 50, left: 50},
                        width = 800 - margin.left - margin.right,
                        height = 440 - margin.top - margin.bottom;


                    var x = d3.time.scale()
                        .range([0, width]);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    var line = d3.svg.line()
                        .x(function (d) { return x(d.jahrgang); })
                        .y(function (d) { return y(d.anzahl); });

                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                    var data = chartData.map(function (d) {
                        return {
                            jahrgang: new Date(d.jahrgang,1,1),
                            anzahl: d.anzahl,
                            vorname: d.vorname
                        };
                    });

                    x.domain(d3.extent(data, function (d) { return d.jahrgang; }));
                    y.domain([0, d3.max(data, function (d) { return d.anzahl; })]);

                    // Nest the entries by vorname
                    var dataNest = d3.nest()
                        .key(function(d) {
                            return d.vorname;
                        }).entries(data);

                    var color = d3.scale.category10();  // set the colour scale
                    // Loop through each vorname / key
                    dataNest.forEach(function(d) {
                        svg.append("path")
                            .attr("class", "line")
                            .style("stroke", function() { // Add dynamically
                                return d.color = color(d.key); })
                            .attr("d", line(d.values));
                    });

                    // line_color_maps = {};
                    // dataNest.forEach(function(d){
                    //     line_color_maps[d.key] = color(d.key);
                    // });
                    // scope.$apply(chart_color_mapping = line_color_maps);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("x", width)
                        .attr("dy", "2.71em")
                        .style("text-anchor", "end")
                        .text("Jahrgang");

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Anzahl Einwohner pro Jahrgang");


                    // legend
                    var legendRectSize = 18;
                    var legendSpacing = 4;
                    var legend = svg.selectAll('.legend')
                      .data(color.domain())
                      .enter()
                      .append('g')
                      .attr('class', 'legend')
                      .attr('transform', function(d, i) {
                        var l_height = legendRectSize + legendSpacing;
                        var l_offset =  l_height * color.domain().length / 2;
                        var l_horz = width - legendRectSize - 100;
                        var l_vert = 0 +  i * l_height + l_offset;
                        return 'translate(' + l_horz + ',' + l_vert + ')';
                      });

                    legend.append('rect')
                      .attr('width', legendRectSize)
                      .attr('height', legendRectSize)
                      .style('fill', color)
                      .style('stroke', color);

                    legend.append('text')
                      .attr('x', legendRectSize + legendSpacing)
                      .attr('y', legendRectSize - legendSpacing)
                      .text(function(d) { return d; });

                });
            }
        };
        return directiveDefinitionObject;
    })
})();


