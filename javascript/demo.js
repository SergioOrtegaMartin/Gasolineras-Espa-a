// apikey: "3TsUFtiiYdj5GhSzdIfkZFeK5qDMd5qvEj8eKTQ0WZw"

/**
 * Creates a new marker and adds it to a group
 * @param {H.map.Group} group       The group holding the new marker
 * @param {H.geo.Point} coordinate  The location of the marker
 * @param {String} html             Data associated with the marker
 */
 function addMarkerToGroup(group, coordinate, html) {
  var marker = new H.map.Marker(coordinate);
  // add custom data to the marker
  marker.setData(html);
  group.addObject(marker);
}


/**
 * Add two markers showing the position of Liverpool and Manchester City football clubs.
 * Clicking on a marker opens an infobubble which holds HTML content related to the marker.
 * @param {H.Map} map A HERE Map instance within the application
 */
function addInfoBubble(map) {
  var group = new H.map.Group();

  map.addObject(group);

  // add 'tap' event listener, that opens info bubble, to the group
  group.addEventListener('tap', function (evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains
    var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
      // read custom data
      content: evt.target.getData()
    });
    // show info bubble
    ui.addBubble(bubble);
  }, false);

  const url = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'
  const http = new XMLHttpRequest()

  http.open("GET", url)
  http.onreadystatechange = function(){

    if(this.readyState == 4 && this.status == 200){
      var resultado = JSON.parse(this.responseText)
//style="display:none"
      resultado['ListaEESSPrecio'].forEach(gasolinera => {
          //PrecioDiesel
          if(gasolinera["Precio Gasoleo A"]){
            diesel=`<br>-Diesel : ${gasolinera["Precio Gasoleo A"]}€ / litro`
          }else{
            diesel=""
          }

          //Precio95
          if(gasolinera["Precio Gasolina 95 E5"]){
            gasolina95=`<br>-Gasolina 95 : ${gasolinera["Precio Gasolina 95 E5"]}€ / litro`
          }else{
            gasolina95=""
          }
          
          //Precio98
          if(gasolinera["Precio Gasolina 98 E5"]){
            gasolina98=`<br>-Gasolina 98 : ${gasolinera["Precio Gasolina 98 E5"]}€ / litro`
          }else{
            gasolina98=""
          }

          //PrecioDiesel+
          if(gasolinera["Precio Gasoleo Premium"]){
            dieselplus=`<br>-Diesel+ : ${gasolinera["Precio Gasoleo Premium"]}€ / litro`
          }else{
            dieselplus=""
          }

          //Precio95+
          if(gasolinera["Precio Gasolina 95 E5 Premium"]){
            gasolina95plus=`<br>-Gasolina 95+ : ${gasolinera["Precio Gasolina 95 E5 Premium"]}€ / litro`
          }else{
            gasolina95plus=""
          }

        addMarkerToGroup(group, {lat: gasolinera.Latitud.replace(',','.'), lng: gasolinera["Longitud (WGS84)"].replace(',','.')},
        `<h5>${gasolinera.Rótulo}</h5>
        Horario: ${gasolinera.Horario}
        ${diesel}
        ${gasolina95}
        ${gasolina98}
        ${dieselplus}
        ${gasolina95plus}
        
        `);   
            
      });  
      document.getElementById('gif').style.display = "none";                    
    }
  }
  
  http.send() 

}

// initialize communication with the platform
var platform = new H.service.Platform({
  apikey: "3TsUFtiiYdj5GhSzdIfkZFeK5qDMd5qvEj8eKTQ0WZw"
});
var defaultLayers = platform.createDefaultLayers();

//Obtener ubicacion actual del usuario
// iniciamos el mapa, si el usuario acepta dar su ubicacion saldra en su ubicacion, si no ponemos por defecto Granada

/*
var map
const onUbicacionConcedida = ubicacion => {
    window.ubicacion
		console.log("Tengo la ubicación: ", ubicacion);
    console.log(ubicacion.coords['latitude'],ubicacion.coords['longitude']);
    console.log('entra mapa personalizado');
    map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
    center: {lat: ubicacion.coords['latitude'], lng: ubicacion.coords['longitude']},
    zoom: 14,
    pixelRatio: window.devicePixelRatio || 1
    });
}
  
const onErrorDeUbicacion = err => {
		console.log("Error obteniendo ubicación: ", err);
    console.log('entra mapa predefinido');
    map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
    center: {lat: 37.188524, lng: -3.623921},
    zoom: 14,
    pixelRatio: window.devicePixelRatio || 1
    })
}

const opcionesDeSolicitud = {
		enableHighAccuracy: true, // Alta precisión
		maximumAge: 0, // No queremos caché
		timeout: 5000 // Esperar solo 5 segundos
};

// Solicitar
navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud);*/


map = new H.Map(document.getElementById('map'),
defaultLayers.vector.normal.map, {
center: {lat: 37.188524, lng: -3.623921},
zoom: 14,
pixelRatio: window.devicePixelRatio || 1})


// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// create default UI with layers provided by the platform
var ui = H.ui.UI.createDefault(map, defaultLayers);

//funcion para cambiar la zona del mapa
function geocode(platform) {
  direccion = document.getElementById("buscadorCiudad").value + ", España"
  var geocoder = platform.getSearchService(),
      geocodingParameters = {
        q: direccion
      };

  geocoder.geocode(geocodingParameters,onSuccess,onError);
}

function onSuccess(result) {
  try{
  var locations = result.items;
  //console.log(locations[0].position.lat)
  //console.log(locations[0].position.lng)
  map.setCenter({lat:locations[0].position.lat, lng:locations[0].position.lng});
  map.setZoom(14);
  }
  catch (error) {
    alert('La direccion no es válida');
  }
}

function onError(error) {
  alert('Ha ocurrido un error');
}

function validar(e) {
  tecla = (document.all) ? e.keyCode : e.which;
  if (tecla==13) geocode(platform);
}

// Now use the map as required...
addInfoBubble(map);