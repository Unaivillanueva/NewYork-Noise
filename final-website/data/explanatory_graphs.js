const w_graphs = 800,
      h_graphs = 400,
      margin_graphs = {top: 20, right: 20, bottom: 30, left: 200};

const svg_types = d3.select('#v_types_complaints').append('svg')
                    .attr("width", w_graphs - margin_graphs.left - margin_graphs.right)
                    .attr("height", h_graphs - margin_graphs.top - margin_graphs.bottom)
const g_types = svg_types.append('g').attr("transform", `translate(${margin_graphs.left}, ${margin_graphs.top})`);

const x_graphs = d3.scaleLinear().range([0, w_graphs - margin_graphs.left - margin_graphs.right]);
const y_graphs = d3.scaleBand().range([h_graphs - margin_graphs.top - margin_graphs.bottom, 0]);


d3.csv('data/noise_types.csv', type_data => {
    type_data = type_data.map(e => ({type: e.type, number: parseInt(e.number)}));
    type_data.sort((a, b) =>  a.number - b.number);
    console.log(type_data);
    x_graphs.domain([0, d3.max(type_data, d => d.number)]);
    y_graphs.domain(type_data.map(d => d.type)).padding(0.1);

    g_types.append("g")
        .attr("class", "axis")
       	.attr("transform", `translate(0, ${h_graphs - margin_graphs.top - margin_graphs.bottom})`)
      	.call(d3.axisBottom(x_graphs).ticks(5).tickSizeInner([-(h_graphs - margin_graphs.top - margin_graphs.bottom)]));

    g_types.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y_graphs));

    g_types.selectAll('rect')
        .data(type_data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('height', y_graphs.bandwidth())
        .attr('y', d => y_graphs(d.type))
        .attr('width', d => x_graphs(d.number))

})