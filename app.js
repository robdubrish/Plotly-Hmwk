function buildMetadata(sample) {
    var metadata = String.raw`/metadata/${sample}`;
    d3.json(metadata).then(function(sample) {
        var sample_data = d3.select("#sample-metadata");
        sample_data.html("");
        Object.entries(sample).forEach(function([k, v]) {
            var pair = sample_data.append("p");
            pair.text(String.raw`${k}: ${v}`);
        });
    });
}

function buildCharts(sample) {
    var data = String.raw`/samples/${sample}`;
    d3.json(data).then(function(d) {
        var pieChart = [{
            values: d.sample_values.slice(0,10),
            labels: d.otu_ids.slice(0,10),
            hovertext: d.otu_labels.slice(0,10),
            type: "pie"
        }];
        var layout = {title: "Pie Chart for Top 10 Samples", height: 500, width: 500};
        Plotly.newPlot("pie", pieChart, layout);
    });
    
    d3.json(data).then(function(d) {
        var bubbleChart = [{
            x: d.otu_ids,
            y: d.sample_values,
            text: d.otu_labels,
            mode: "markers",
            marker: {size: d.sample_values, color: d.otu_ids}
        }];
        var layout = {title: "Belly Button Biodiversity", xaxis: {titel: "OTU ID"}};
        Plotly.newPlot("bubble", bubbleChart, layout);
    });   
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    
        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
