
document.getElementById('v_map3').style.width = `${w}px`;
document.getElementById('v_map3').style.height = `${h}px`;

    var map3 = L.map('v_map3').setView([ 40.730610,-73.955242], 10);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map3);

    var svg1 = d3.select(map3.getPanes().overlayPane).append("svg"),
    g1 = svg1.append("g").attr("class", "leaflet-zoom-hide");

function projectPoint(x, y) {
      var point = map3.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    var projection1 = d3.geoTransform({point: projectPoint});
    

      var path1 = d3.geoPath(projection1);

      k_means_param=2;

d3.json('K_Means/zip_codes.geojson', geodata => {
d3.json('K_Means/kmeans.json', data => {

    var feature=g1.selectAll("path")
       .data(geodata.features)
       .enter()
       .append("path")
       .attr("d", path1);

  feature.attr("d", path1);

    const colors = ['thistle', 'violet', 'fuchsia', 'mediumorchid', 'rebeccapurple','slateblue'];
    const colors_centers = ['MediumOrchid', 'Fuchsia ', 'Purple  ', 'DarkViolet ', 'Indigo','DarkSlateBlue '];



    var circles;
    var centers;  
    var centers1;  
    var svgOverlay = L.SvgScaleOverlay();
    var radius_cir=3;
    var radius_cen=20;

  svgOverlay.onInitData = function () {
  if(!circles && !centers && !centers1)
  {
    var g1 = d3.select(this._g);
    circles=g1.selectAll("circle")
       .data(data.data)
       .enter()
       .append("circle")
       .style("fill", d => colors[d[k_means_param]])
       .style("opacity", 0.4);


       centers=g1.selectAll("circle")
       .data(data.centers[k_means_param - 2], d => d)
       .enter()
       .append("circle")
       .style("fill", (d,i) => colors_centers[i])
       .style("opacity", 0.75)
       .attr('class', 'centers');
  }
    

     circles.each(function (d) {
                    var elem = d3.select(this);
                    var point = map3.project(L.latLng(new L.LatLng(d[0], d[1])))._subtract(map3.getPixelOrigin());
                    //var point = lmap.latLngToLayerPoint(new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
                    elem.attr('cx', point.x)
                    elem.attr('cy', point.y)
                    elem.attr('r', radius_cir)
                })

     centers.each(function (d) {
                    var elem = d3.select(this);
                    var point = map3.project(L.latLng(new L.LatLng(d[0], d[1])))._subtract(map3.getPixelOrigin());
                    //var point = lmap.latLngToLayerPoint(new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
                    elem.attr('cx', point.x)
                    elem.attr('cy', point.y)
                    elem.attr('r', radius_cen)
                });

          const toggle = k => {
          k_means_param = k;
          g1.selectAll("circle")
             .data(data.data)
             .style("fill", d => colors[d[k_means_param]]);

             Array.from(document.querySelectorAll('circle.centers')).forEach(center => {
              center.remove();
            });

           centers=g1.selectAll("circle")
           .data(data.centers[k_means_param - 2], d => d)
           .enter()
           .append("circle")
           .style("fill", (d,i) => colors_centers[i])
           .style("opacity", 0.75)
           .attr('class', 'centers');

           centers.each(function (d) {
                    var elem = d3.select(this);
                    var point = map3.project(L.latLng(new L.LatLng(d[0], d[1])))._subtract(map3.getPixelOrigin());
                    //var point = lmap.latLngToLayerPoint(new L.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
                    elem.attr('cx', point.x)
                    elem.attr('cy', point.y)
                    elem.attr('r', radius_cen)
                });
    }
    Array.from(document.getElementsByTagName('button')).forEach(btn => {
        btn.onclick = () => toggle(btn.dataset.val);
    });

  map3.addLayer(svgOverlay);

 };
     svgOverlay.onScaleChange = function (scaleDiff) {
                if (scaleDiff > 0.5) {
                    var newRadius = radius_cir * 1 / scaleDiff;
                    var currentRadius = d3.select('circle').attr("r");
                    if (currentRadius != newRadius) {
                        d3.selectAll("circle").attr('r', newRadius);
                    }
                }
            }
    

     svgOverlay.onScaleChange = function (scaleDiff) {
                if (scaleDiff > 0.5) {
                    var newRadius = radius_cen * 1 / scaleDiff;
                    var currentRadius = d3.select('circle.centers').attr("r");
                    if (currentRadius != newRadius) {
                        d3.selectAll("circle.centers").attr('r', newRadius);
                    }
                }
            }
            

        map3.addLayer(svgOverlay);



});
});