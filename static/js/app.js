// Get the samples endpoint
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
const samples = d3.json(url);
const defaultIndex = 1;

// Store all subject IDs in dropdown list, then update all plots on dropdown list value change
// https://www.quora.com/How-do-you-create-a-drop-down-list-in-JavaScript-using-an-array-as-the-data-source
samples.then(function(data) {

    // store all subject IDs into a variable to fill dropdown menu
    let subjectNameID = data.names;
    console.log(subjectNameID);

    var select = document.getElementById("selDataset")

    for (var i =0; i < subjectNameID.length; i++) {
        var option = document.createElement("option");
        option.value = subjectNameID[i];
        option.text = subjectNameID[i];
        select.appendChild(option);
    };

    // Set default dropdown option
    // https://www.flowradar.com/answer/webflow-setting-default-option-select-dropdown-button-using-basic-javascript#:~:text=options%5B0%5D%60%20selects%20the,selection%20when%20the%20page%20loads
    var defaultOption = select.options[defaultIndex];

    defaultOption.selected = true;

    // On change to the DOM, call getData()
    d3.selectAll("#selDataset").on("change", getData);

    // Function called by DOM changes
    function getData() {

        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select(this);

        // Assign the value of the dropdown menu option to a variable, store the index value of that option in a variable
        let dropDownChoice = dropdownMenu.property("value");
        console.log(`Subject ID: ${dropDownChoice}`);
        let index = subjectNameID.indexOf(`${dropDownChoice}`);
        console.log(`Index in array: ${index}`);

        // =================================================================================================================
        // bar chart
        // set empty arrays
        let labels = [];
        let x = [];
        let y = [];

        // top 10 sample IDs only
        for (let j = 0; j < 10; j++) {

            // Get y axis (sample IDs) and save to array only if value exists in array index
            // https://www.geeksforgeeks.org/how-to-check-a-value-exist-at-certain-array-index-in-javascript/
            let otuID = data.samples[index]['otu_ids'][j];
            if (typeof data.samples[index]['otu_ids'][j] !== "undefined") {
                y.push(`OTU ${otuID}`);
            }

            // Get x axis (sample values) and save to array
            let values = data.samples[index]['sample_values'][j];
            if (typeof data.samples[index]['sample_values'][j] !== "undefined") {
                x.push(values);
            }

            // Get otu labels and save to array for hover
            let otu_labels = data.samples[index]['otu_labels'][j];
            if (typeof data.samples[index]['otu_labels'][j] !== "undefined") {
                labels.push(otu_labels);
            }
        };

        // print arrays to console
        console.log(`y axis array: ${y}`);
        console.log(`x axis array: ${x}`);
        console.log(`labels for hover array: ${labels}`);

        // Call function to update bar chart
        updatePlotlyBar(x.reverse(), y.reverse(), labels);

        // =================================================================================================================
        // bubble chart

        // set empty arrays
        let labelsBubble = [];
        let xBubble = [];
        let yBubble = [];

        for (let k = 0; k < data.samples[index]['otu_ids'].length; k++) {

            // Get y axis (sample IDs) and save to array only if value exists in array index
            let otuID = data.samples[index]['otu_ids'][k];
                if (typeof data.samples[index]['otu_ids'][k] !== "undefined") {
                    xBubble.push(otuID);
                }

            // Get x axis (sample values) and save to array
            let values = data.samples[index]['sample_values'][k];
            if (typeof data.samples[index]['sample_values'][k] !== "undefined") {
                yBubble.push(values);
            }

            // Get otu labels and save to array for hover
            let otu_labels = data.samples[index]['otu_labels'][k];
            if (typeof data.samples[index]['otu_labels'][k] !== "undefined") {
                labelsBubble.push(otu_labels);
            }
        };

        // print arrays to console
        console.log(`y axis array: ${yBubble}`);
        console.log(`x axis array: ${xBubble}`);
        console.log(`labels for hover array: ${labelsBubble}`);

        // Call function to update the bubble chart
        updatePlotlyBubble(xBubble, yBubble, labelsBubble);


        // Add demographic info - replace paragraph text
        var paragraphs = document.getElementById("sample-metadata").getElementsByTagName("p");
        var keys = Object.keys(data.metadata[index]);
        var values = Object.values(data.metadata[index]);

        console.log(keys);
        console.log(values);
        console.log(paragraphs);
        console.log(index);

        for (var i = 0; i < paragraphs.length; i++) {
            paragraphs[i].textContent = keys[i] + ": " + values[i];
        }

    };

    // Update the bar chart with selected ID's values
    function updatePlotlyBar(x,y,labels) {
        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("bar", "text", [labels]);
      
    };

    // Update the bubble chart with selected ID's values
    function updatePlotlyBubble(xBubble,yBubble,labelsBubble) {
        Plotly.restyle("bubble", "x", [xBubble]);
        Plotly.restyle("bubble", "y", [yBubble]);
        Plotly.restyle("bubble", "text", [labelsBubble]);
        Plotly.restyle("bubble", "marker.size", [yBubble]);
        Plotly.restyle("bubble", "marker.color", [xBubble]);      
    };

    // =================================================================================================================
    // reset arrays
    labels = [];
    x = [];
    y = [];

});



// Initialises the page with a default plot
function init() {

    // Fetch data asynchronously from an external JSON file using D3.js
    samples.then((data) => {

        // bar chart
        // set empty arrays
        let labelsBar = [];
        let xBar = [];
        let yBar = [];

        // top 10 sample IDs only of 2nd index
        for (let j = 0; j < 10; j++) {
            let otuID = data.samples[defaultIndex]['otu_ids'][j];

            // Get y axis (sample IDs) and save to array only if value exists in array index
            if (typeof data.samples[defaultIndex]['otu_ids'][j] !== "undefined") {
                yBar.push(`OTU ${otuID}`);
            }

            // Get x axis (sample values) and save to array
            let values = data.samples[defaultIndex]['sample_values'][j];
            if (typeof data.samples[defaultIndex]['sample_values'][j] !== "undefined") {
                xBar.push(values);
            }

            // Get otu labels and save to array for hover
            let otu_labels = data.samples[defaultIndex]['otu_labels'][j];
            if (typeof data.samples[defaultIndex]['otu_labels'][j] !== "undefined") {
                labelsBar.push(otu_labels);
            }

        };

        // Check values
        console.log(xBar);
        console.log(yBar);
        console.log(labelsBar);

        // Set bar chart data
        let plotData = [{
            y: yBar.reverse(),
            x: xBar.reverse(),
            type: 'bar',
            orientation: 'h',
            width: 0.8,
            text: labelsBar.reverse(),
            hovermode:'closest',
            sort: false
        }];

        // Set bar chart layout
        let layout = {
            title: {
                text: `Top 10 sample IDs by sample count<br>of selected subject ID`,
                font: {
                    family: 'Arial',
                    size: 18
                },
                xref: 'paper',
                x: 0.05,
                automargin: true
            },
            xaxis: {
                title: {
                    text: 'Count',
                    font: {
                            family: 'Arial',
                            size: 14,
                            color: '#7f7f7f'
                    }
                },
            },
            yaxis: {
                title: {
                    text: 'Sample ID',
                    font: {
                            family: 'Arial',
                            size: 14,
                            color: '#7f7f7f'
                    }
                }
            }
        };
    
        // Plot bar chart
        Plotly.newPlot("bar", plotData, layout);

    
    
        // bubble chart

        // set empty arrays
        let labelsBubble = [];
        let xBubble = [];
        let yBubble = [];

        for (let k = 0; k < data.samples[defaultIndex]['otu_ids'].length; k++) {

            // Get y axis (sample IDs) and save to array only if value exists in array index
            let otuID = data.samples[defaultIndex]['otu_ids'][k];
                if (typeof data.samples[defaultIndex]['otu_ids'][k] !== "undefined") {
                    xBubble.push(otuID);
                }

            // Get x axis (sample values) and save to array
            let values = data.samples[defaultIndex]['sample_values'][k];
            if (typeof data.samples[defaultIndex]['sample_values'][k] !== "undefined") {
                yBubble.push(values);
            }

            // Get otu labels and save to array for hover
            let otu_labels = data.samples[defaultIndex]['otu_labels'][k];
            if (typeof data.samples[defaultIndex]['otu_labels'][k] !== "undefined") {
                labelsBubble.push(otu_labels);
            }
        };

        // print arrays to console
        console.log(`y axis array: ${yBubble}`);
        console.log(`x axis array: ${xBubble}`);
        console.log(`labels for hover array: ${labelsBubble}`);
            
        // Set bubble plot data
        let plotData2 = [{
            y: yBubble,
            x: xBubble,
            type: 'bubble',
            text: labelsBubble,
            hovermode:'closest',
            sort: false,
            mode: 'markers',
            marker: {
                size: yBubble,
                color: xBubble,
                colorscale: 'Portland' //https://plotly.com/javascript/colorscales/
            }
        }];

        // Set bubble plot layout  
        var layout2 = {
            title: 'Total count of samples by sample ID for the selected individual',
            showlegend: false,
            height: 600,
            width: 1200,
            xaxis: {
                title: {
                    text: 'Sample ID',
                    font: {
                            family: 'Arial',
                            size: 14,
                            color: '#7f7f7f'
                    }
                },
            },
            yaxis: {
                title: {
                    text: 'Count',
                    font: {
                            family: 'Arial',
                            size: 14,
                            color: '#7f7f7f'
                    }
                }
            }
        };
         
        //Plot bubble plot
        Plotly.newPlot('bubble', plotData2, layout2);
    
        // Add demographic info card
        // Get the container element where the table will be inserted
        // https://www.linkedin.com/pulse/javascript-create-interactive-elements-within-your-page-svekis-#:~:text=createElement()%20method%20in%20JavaScript,creates%20a%20new%20div%20element
        // https://stackoverflow.com/questions/11279093/how-to-get-a-listing-of-key-value-pairs-in-an-object

        let container = document.getElementById("sample-metadata");

        var keys = Object.keys(data.metadata[defaultIndex]);
        var valuesTbl = Object.values(data.metadata[defaultIndex]);

        console.log(keys);
        console.log(valuesTbl);

        for (var i = 0; i < keys.length; i++) {
            var textToPrint = document.createElement("p");
            textToPrint.innerHTML = keys[i] + ": " + valuesTbl[i];
            container.appendChild(textToPrint);
            textToPrint.style.fontSize = "medium";
        };
    
    })
};

// initialise default bar plot, bubble plot, demographics card
init();
