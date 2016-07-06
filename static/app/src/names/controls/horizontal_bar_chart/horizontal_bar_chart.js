/**
 * Created by mw on 03.07.16.
 */




(function () {
    angular.module('names').directive('horizontalBarChart', function ($parse, $log) {
        var directiveDefinitionObject = {
            restrict: 'E',
            replace: false,
            scope: {data : '=', navigateTo : '&'},
            link: function (scope, element, attrs) {
                scope.$watch("data", function (chartData) {

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

                    // hack
                    d3.select(element[0]).selectAll("svg").remove();

                    var data = chartData;

                    /* Initialize tooltip */
                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .direction('e')
                        .offset([42, 80])
                        .html(function(d) {
                            return "<table class='info_table'>"
                                + "<tr><td>&auml;ltester Jahrgang:</td><td>" + d.first + "</td></tr>"
                                +  "<tr><td>j&uuml;ngster Jahrgang:</td><td>"        + d.last + "</td></tr>"
                                +  "<tr><td>Durchschnitt:</td><td>"                  + d.avg_anz + "</td></tr>"
                                +  "<tr><td>Minimum:</td><td>"                       + d.min_anz + "</td></tr>"
                                +  "<tr><td>Maximum:</td><td>"                       + d.max_anz + "</td></tr>"
                                +  "</table>";
                        });

                    var width = 800, // nur bar
                        width_total = 900, // bar inkl namen
                        barHeight = 20;

                    var x = d3.scale.linear()
                        .domain([0, d3.max(data, function(d) { return d.value; })])
                        .range([0, width]);

                    var chart = d3.select(element[0]).append("svg")
                        .attr("width", width_total)
                        .attr("height", barHeight * data.length);

                    chart.call(tip);

                    var bar = chart.selectAll("g")
                        .data(data);

                    bar.enter().append("g")
                        .attr("class", "bar_chart")
                        .attr("class", function (d,i) {
                            return (d.geschlecht == 'w') ? "bar_chart female" : "bar_chart male";
                        })
                        .attr("transform", function(d, i) {
                            return "translate(0," + i * barHeight + ")";
                        });

                    bar.append("rect")
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .on("click", function(d){
                            scope.navigateTo({ "name" : d.name });
                        })
                        .attr("width", 0)
                        .transition()
                        .delay(function (d, i) { return i*100; })
                        .attr("width", function(d) { return x(d.value); })
                        .attr("height", barHeight - 1);

                    bar.append("text")
                        .attr("class", "value_text")
                        .attr("x", 0)
                        .transition()
                        .delay(function (d, i) { return i*100; })
                        .attr("x", function(d) { return x(d.value) - 3; })
                        .attr("y", barHeight / 2)
                        .attr("dy", ".35em")
                        .text(function(d) { return d.value; });

                    bar.append("text")
                        .attr("class", "name_text")
                        .attr("x", 0)
                        .transition()
                        .delay(function (d, i) { return i*100; })
                        .attr("x", function(d) { return x(d.value) + 3; })
                        .attr("y", barHeight / 2)
                        .attr("dy", ".35em")
                        .text(function(d) { return d.name; });


                    bar.append("text")
                        .attr("class", "position_text")
                        .attr("x", 0)
                        .transition()
                        .delay(function (d, i) { return i*100; })
                        .attr("x", 3 )
                        .attr("y", barHeight / 2)
                        .attr("dy", ".35em")
                        .text(function(d, i) { return i+1; });
                });
            }
        };
        return directiveDefinitionObject;
    });
})();