const w = 1600,
      h = 900;
const legendWidth = w * 0.6,
      legendHeight = 10;
const n_buckets = 5;
const colorBuckets = [...Array(n_buckets).keys()].map(i => `rgba(255, 0, 0, ${(i+1) / n_buckets})`),
      colorBuckets_hover = [...Array(n_buckets).keys()].map(i => `rgba(255, 100, 100, ${(i+1)/ n_buckets})`);
const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const svg = d3.select('#v_map').append("svg")
                .attr("width", w)
                .attr("height", h);
const projection = d3.geoMercator()
                .center([-73.955242, 40.730610])
                .scale(80000)
                .translate([w / 2, h / 2 - 50]);
const geoPath = d3.geoPath(projection);

let currentMonth = 1;
let currentNoise = 'Noise: Alarms (NR3)';
let geomap_zip_data;
let data_per_zip_data;

d3.json('zip_codes.geojson', geomap_zip => {
d3.json('incidents_per_zip.json', data_per_zip => {
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
    svg.selectAll("path")
       .data(geomap_zip_data)
       .enter()
       .append("path")
       .attr("d", geoPath);
    // Setup legend
    let defs = svg.append("defs");
    let linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");
    let legendsvg = svg.append("g").attr("class", "legendWrapper") .attr("transform", "translate(" + (w/2 - 10) + "," + (h-50) + ")");
    linearGradient.attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    linearGradient.append("stop").attr("offset", "0%").attr("stop-color", colorBuckets[0]);
    linearGradient.append("stop").attr("offset", "100%").attr("stop-color", colorBuckets[colorBuckets.length - 1]);
    legendsvg.append("text").attr("class", "legendTitle").attr("x", 0).attr("y", -2).text("Number of incidents");
    legendsvg.append("rect").attr("width", legendWidth).attr("height", legendHeight).style("fill", "url(#linear-gradient)").attr("x", -legendWidth/2).attr("y", 5);

    const legendScale = (min, max) => {
        let xScale = d3.scaleLinear().range([0, legendWidth]).domain([min, max]);
        let xAxis = d3.axisBottom().ticks(5).scale(xScale);
        legendsvg.select('g.axis').remove();
        legendsvg.append("g").attr("class", "axis").attr("transform", "translate(" + (-legendWidth/2) + "," + (10 + legendHeight) + ")").call(xAxis);
    }

    const show_map = (selected_month, selected_noise) => {
        let counts = data_per_zip_data[selected_month][selected_noise];
        if (typeof counts === 'undefined') counts = {0: 0};
        let max_counts = Math.max.apply(undefined, Object.values(counts)); let min_counts = Math.min.apply(undefined, Object.values(counts));

        let scale = d3.scaleOrdinal(colorBuckets); scale.domain([min_counts, max_counts]);
        let scaleHover = d3.scaleOrdinal(colorBuckets_hover); scaleHover.domain([min_counts, max_counts]);
        svg.selectAll("path")
           .data(geomap_zip_data)
           .attr('fill', d => scale(counts[d.properties.postalCode]))
           .on('mouseover', function(d) {
               d3.select(this).attr('fill', d => scaleHover(counts[d.properties.postalCode])) 
           })
           .on('mouseout', function(d) {
               d3.select(this).attr('fill', d => scale(counts[d.properties.postalCode])) 
           });
        legendScale(min_counts, max_counts);
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
        show_map(currentMonth, currentNoise);
    }
    
    updateMap();
});
});