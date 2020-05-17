function init() {
  d3.json("samples.json").then((sampleData) => {
    //console log the data for accuracy
    console.log("total data", sampleData);
    var samples = sampleData.samples;
    console.log("samples", samples);
    //Adding all the values to the dropdown menu
    samples.forEach((sample) => {
      d3.selectAll("#selDataset")
      .append("option")
      .text(sample.id)
    });

    //first plot id 940
    var sample_values = samples[0].sample_values.slice(0,10);
    var otu_ids = samples[0].otu_ids.map(String);
    
    console.log(otu_ids);
    var hBarData = [{
      type: "bar",
      x: sample_values,
      y: ["OTU #"+ otu_ids[0], "OTU #"+ otu_ids[1], "OTU #"+ otu_ids[2], "OTU #"+ otu_ids[3],
      "OTU #"+ otu_ids[4], "OTU #"+ otu_ids[5], "OTU #"+ otu_ids[6], "OTU #"+ otu_ids[7],
      "OTU #"+ otu_ids[8], "OTU #"+ otu_ids[9]],
      orientation: "h",
      text: samples[0].otu_labels
    }];

    

    var layout = {
      // title: "Id #"+ samples[0].id,
      xaxis: {title: "Sample Values"}
    }

    Plotly.newPlot("bar",hBarData, layout);

    var bubData = [{
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      },
      text: samples[0].otu_labels
    }]

    
    Plotly.newPlot("bubble", bubData)

    var metaData = sampleData.metadata
    console.log("MetaData",metaData)

    var demographics = d3.selectAll("#sample-metadata")

    // appending the metadata as key value paids into the demographics info

    Object.entries(metaData[0]).forEach(([key, value]) => {
      demographics.append("p").text(`${key}: ${value}`);
    });

    // Call updatePage() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePage);

    function updatePage() {
      dropdownMenu = d3.select("#selDataset");
      var id = dropdownMenu.property("value");
      console.log(id);
      
      var x = [];
      var y = [];
      labels = []

      
      samples.forEach((sample) => {
        if (sample.id === id){
          x = sample.sample_values.slice(0,10);
          y = ["OTU #"+ sample.otu_ids[0], "OTU #"+ sample.otu_ids[1], "OTU #"+ sample.otu_ids[2], "OTU #"+ sample.otu_ids[3],
          "OTU #"+ sample.otu_ids[4], "OTU #"+ sample.otu_ids[5], "OTU #"+ sample.otu_ids[6], "OTU #"+ sample.otu_ids[7],
          "OTU #"+ sample.otu_ids[8], "OTU #"+ sample.otu_ids[9]];
          xBub = sample.otu_ids
          labels = sample.otu_labels
        }
        // console.log(x)
        // console.log(y)
      });

      var barUpdate = {text: labels}

      Plotly.restyle("bar", "x", [x])
      Plotly.restyle("bar", "y", [y])
      Plotly.restyle("bar", barUpdate)
      

      var update = {
        marker: {
          color: xBub,
          size: x
        },
        text: labels
      }

      Plotly.restyle("bubble", "x", [xBub])
      Plotly.restyle("bubble","y", [x])
      Plotly.restyle("bubble", update)

      demographics.html("")

      metaData.forEach((meta) => {
        if (meta.id == id) {

          demographics = d3.selectAll("#sample-metadata")

          Object.entries(meta).forEach(([key, value]) => {
            demographics.append("p").text(`${key}: ${value}`);
          });          
        }
      })  

    };
      
  });

}


init();




