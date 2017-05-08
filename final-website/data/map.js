const w = 1300,
      h = 700;
const legendWidth = w * 0.6,
      legendHeight = 50;
const n_buckets = 5;
const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

document.getElementById('v_map').style.width = `${w}px`;
document.getElementById('v_map').style.height = `${h}px`;

const map = new L.Map("v_map", {center: [40.730610, -73.955242], zoom: 10})
               .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

const svg = d3.select(map.getPanes().overlayPane).append("svg")
                .attr("width", w)
                .attr("height", h);

const svg_legend = d3.select('#v_map').append('svg').attr('class', 'legend').attr('width', legendWidth).attr('height', legendHeight);

const g = svg.append("g").attr("class", "leaflet-zoom-hide");
/*const projection = d3.geoMercator()
                .center([-73.955242, 40.730610])
                .scale(80000)
                .translate([w / 2, h / 2 - 50]);*/

const projection = d3.geoTransform({
    point: function (x, y) {
                let point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
});

const geoPath = d3.geoPath(projection);
const tip = d3.tip().attr('class', 'd3-tip').html(d => `Zip code ${d.zip}<br>Number of incidents: ${d.data}`);

let currentMonth = 1;
let currentNoise = 'Noise: Alarms (NR3)';
let geomap_zip_data;
let data_per_zip_data;
let featureElement;

d3.json('data/zip_codes.geojson', geomap_zip => {
d3.json('data/incidents_per_zip.json', data_per_zip => {
    geomap_zip_data = geomap_zip.features;
    data_per_zip_data = data_per_zip;

    // Setup list of choices for noise types
    let list_of_choices = new Set([].concat.apply([], Object.values(data_per_zip_data).map(e => Object.keys(e))));
    const data_types_dom = document.querySelector('select#dataSelector');

    list_of_choices.forEach(choice => {
        let opt = document.createElement('option');
        opt.innerHTML = choice;
        opt.value = choice;
        data_types_dom.appendChild(opt);
    });

    data_types_dom.value = currentNoise;

    // Setup map
    g.selectAll("path")
       .data(geomap_zip_data)
       .enter()
       .append("path")
       .attr("d", geoPath);
    // Setup legend
    let legendsvg = svg_legend.append("g").attr("class", "legendWrapper");
    

    const legendScale = (scale) => {
        svg_legend.select('g.legendLinear').remove();
        legendsvg.append("g").attr("class", "legendLinear").attr("transform", `scale(1.3)`);
        let legendLinear = d3.legendColor().shapeWidth(50).orient('horizontal').scale(scale);
        svg_legend.select("g.legendLinear").call(legendLinear);
    }

    const show_map = (selected_month, selected_noise) => {
        let counts = data_per_zip_data[selected_month][selected_noise];
        if (typeof counts === 'undefined') counts = {0: 0};
        let max_counts = Math.max.apply(undefined, Object.values(counts)); let min_counts = 0;

        let scale = d3.scaleSqrt().domain([min_counts, max_counts]).range(['rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 1)']);
        let scaleHover = d3.scaleSqrt().domain([min_counts, max_counts]).range(['rgba(255, 100, 100, 0.2)', 'rgba(255, 100, 100, 1)']);
        featureElement = g.selectAll("path")
           .data(geomap_zip_data)
           .attr('fill', d => scale(counts[d.properties.postalCode] || 0))
           .attr('style', 'pointer-events: visible')
           .on('mouseover', function(d, i) {
               console.log(d);
               d3.select(this).attr('fill', d => scaleHover(counts[d.properties.postalCode] || 0));
               
               tip.show({
                   zip: d.properties.postalCode,
                   data: counts[d.properties.postalCode] || 0
               }, i);
           })
           .on('mouseout', function(d, i) {
               d3.select(this).attr('fill', d => scale(counts[d.properties.postalCode] || 0));
               tip.hide(d, i);
           });
        legendScale(scale);
    };

    document.querySelector('input#monthofYear').oninput = e => {
        currentMonth = e.target.value;
        updateMap();
    };
    document.querySelector('select#dataSelector').oninput = e => {
        currentNoise = e.target.value;
        updateMap();
    };   

    const updateMap = () => {
        document.getElementById('monthName').innerHTML = months[currentMonth];
        show_map(currentMonth, currentNoise);
    }
    const update = () => {
        var bounds = geoPath.bounds(geomap_zip),
        topLeft = bounds[0],
        bottomRight = bounds[1];

        svg .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
        featureElement.attr("d", geoPath);
    } 

    map.on("moveend", update);

    updateMap();
    update();
    g.call(tip);
});
});