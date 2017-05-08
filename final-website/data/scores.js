var margin = {top: 10, right: 0, bottom: 30, left: 30};
var width = 700;
var height = 400;

var svg_scores = d3.select("div#v_scores").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    
var g_scores = svg_scores.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


var tooltip = d3.select('div#v_scores').append("div").attr("class","toolTip");


d3.csv("data/scores_8020.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);
  
  x0.domain(data.map(function(d) { return d.method; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, 1]);

  console.log(data);
  console.log(keys);
  
  g_scores.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("class","bar_groups")
      .attr("transform", function(d) { return "translate(" + x0(d.method) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("class", "bar_score")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); })
      .on("mousemove", function(d){ 
            tooltip
                .style("left", d3.event.pageX - 270 + "px")
                .style("top", d3.event.pageY - 550 + "px")
                .style("display", "inline-block")
                .html("Score: " + (d.value));
        })
      .on("mouseout", function(d){
            tooltip.style("display", "none");
        }); 
      

  g_scores.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g_scores.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Score");

  var legend = g_scores.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d;});



  //----------------------------------TRANSITIONS-------------------------------------//
      //On click, update with new data      
      d3.select('#button9010').on("click", function() {

        //Modify buttons
            d3.select('#button9010').style('background-color', '#BDBDBD');
            d3.select('#button8020').style('background-color', '#ffa02b');
            d3.select('#button9505').style('background-color', '#ffa02b');

          d3.csv("data/scores_9010.csv", function(d, i, columns) {
                  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
                  return d;
                }, function(error, data) {
                  if (error) throw error;

                  var keys = data.columns.slice(1);
                  
                  x0.domain(data.map(function(d) { return d.method; }));

                  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
                
                  
                  console.log(data);
                  console.log(keys);
                  

                  
                   g_scores.selectAll("g.bar_groups")
                    .data(data)
                    //.selectAll("g")
                    //.transition().attr("transform", function(d) { return "translate(" + x0(d.method) + ",0)"; })
                    .selectAll("rect")
                    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
                      .transition().duration(1000)
                      //.attr("x", function(d) { return x1(d.key); })
                      .attr("y", function(d) { return y(d.value); })
                      //.attr("width", x1.bandwidth())
                      .attr("height", function(d) { return height - y(d.value); })
                      .attr("fill", function(d) { return z(d.key); });
            });

                    
        });//onClick1 close

      //On click, update with new data      
      d3.select('#button9505').on("click", function() {

        //Modify buttons
            d3.select('#button9505').style('background-color', '#BDBDBD');
            d3.select('#button8020').style('background-color', '#ffa02b');
            d3.select('#button9010').style('background-color', '#ffa02b');
          
          d3.csv("data/scores_9505.csv", function(d, i, columns) {
                  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
                  return d;
                }, function(error, data) {
                  if (error) throw error;

                  var keys = data.columns.slice(1);
                  console.log(data);
                  
                  g_scores.selectAll("g.bar_groups")
                    .data(data)
                    //.selectAll("g")
                   // .attr("transform", function(d) { return "translate(" + x0(d.method) + ",0)"; })
                    .selectAll("rect")
                    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
                      .transition().duration(1000)
                      .attr("x", function(d) { return x1(d.key); })
                      .attr("y", function(d) { return y(d.value); })
                      .attr("width", x1.bandwidth())
                      
                      .attr("height", function(d) { return height - y(d.value); })
                      .attr("fill", function(d) { return z(d.key); });
            });
                    
        });//onClick1 close

      //On click, update with new data      
      d3.select('#button8020').on("click", function() {

        //Modify buttons
            d3.select('#button8020').style('background-color', '#BDBDBD');
            d3.select('#button9505').style('background-color', '#ffa02b');
            d3.select('#button9010').style('background-color', '#ffa02b');
          
          d3.csv("data/scores_8020.csv", function(d, i, columns) {
                  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
                  return d;
                }, function(error, data) {
                  if (error) throw error;

                  var keys = data.columns.slice(1);
                 
                  g_scores.selectAll("g.bar_groups")
                    .data(data)
                    //.selectAll("g")
                   // .attr("transform", function(d) { return "translate(" + x0(d.method) + ",0)"; })
                    .selectAll("rect")
                    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
                      .transition().duration(1000)
                      .attr("x", function(d) { return x1(d.key); })
                      .attr("y", function(d) { return y(d.value); })
                      .attr("width", x1.bandwidth())
                      .attr("height", function(d) { return height - y(d.value); })
                      .attr("fill", function(d) { return z(d.key); });
            });
                    
        });//onClick1 close

});//final close


