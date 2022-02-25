document.body.onload = function () {
    var map_init = L.map(document.getElementById('map'), {
        center: [53.1424, -7.6921],
        zoom: 7.5
    });

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map_init);

    // var Basemaps = {
    //     "OSM": osm
    // }

    // L.control.layers(Basemaps).addTo(map_init);

    function PopulateData() {
        $.getJSON(
            'https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=CountyName,Lat,Long,PopulationProportionCovidCases,ConfirmedCovidCases&outSR=4326&f=json',
            function (data) {
                var covidData = [];
                covidData = data['features'];
                for (let index = 0; index < covidData.length; index++) {
                    const county = covidData[index]['attributes'];
                    var marker = new L.marker([county['Lat'], county['Long']]);
                    var textString = "<div style='background:white; padding:1px 3px 1px 3px'><b>" + "<h2>" + county[
                            'CountyName'] + "</h2>" + "Confirmed cases: " +
                        "<strong>" + county['ConfirmedCovidCases'].toString() + "</strong>" + " <br> " + "</div>";
                    marker.bindTooltip(textString, {
                        permanent: false,
                        className: "leaflet-tooltip-own",
                        offset: [0, 0]
                    });
                    marker.addTo(map_init);

                    var high = "rgb(200,0,0)";
                    var medium = "rgb(255,140,0)";
                    var low = "rgb(255,213,128)";

                    if (county['PopulationProportionCovidCases'] > 20000 && county['PopulationProportionCovidCases'] < 26000) {
                        var circle = L.circle([county['Lat'], county['Long']], {
                        color: 'blue',
                        fillColor: low,
                        fillOpacity: 1,
                        radius: county['PopulationProportionCovidCases']/2.2
                    }).addTo(map_init);
                    }else if(county['PopulationProportionCovidCases'] > 26000 && county['PopulationProportionCovidCases'] < 30000){
                        var circle = L.circle([county['Lat'], county['Long']], {
                        color: 'blue',
                        fillColor: medium,
                        fillOpacity: 1,
                        radius: county['PopulationProportionCovidCases']/2.2
                    }).addTo(map_init);
                    }else {
                        var circle = L.circle([county['Lat'], county['Long']], {
                        color: 'blue',
                        fillColor: high,
                        fillOpacity: 1,
                        radius: county['PopulationProportionCovidCases']/2.2
                    }).addTo(map_init);
                    }
                }
            });
    }

    PopulateData();
};