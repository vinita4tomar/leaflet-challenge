let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a new map instance
let map = L.map('map');

// Set the center coordinates and zoom level // 37.09, -95.71   5  USA // 15.5994, -28.6731  3 World
map.setView([0, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);
 
//let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//});
    
d3.json(url).then(function(data) {
    console.log(data);
    function getMarkerColor(depth) {
        if (depth > 100) {
            return "#e03734";
        } else if (depth > 80) {
            return "#e64cb2";
        } else if (depth > 60) {
            return "#ae83f2";
        } else if (depth > 40) {
            return "#6f7de3";
        } else if (depth > 20) {
            return "#41def0";
        } else {
            return "#75e08a"; 
        }
    }

    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getMarkerColor(feature.geometry.coordinates[2]),
          color: "black",
          radius: feature.properties.mag * 3,
          stroke: true,
          weight: 0.5
        };
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
          },

        // Set the style for each circleMarker using styleInfo function.
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
              "Magnitude: "
              + feature.properties.mag
              + "<br>Depth: "
              + feature.geometry.coordinates[2]
              + "<br>Location: "
              + feature.properties.place
            );
        }
    }).addTo(map);

    //Create Legend
    let legend = L.control({
        position: "bottomright"
    });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [0, 20, 40, 60, 80, 100];
    let colors = [
      "#75e08a",
      "#41def0",
      "#6f7de3",
      "#ae83f2",
      "#e64cb2",
      "#e03734"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);
});


  