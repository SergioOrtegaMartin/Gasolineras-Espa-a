//funcion recorrer coleccion coches
const mostrar_opcion_coches = data =>{
  var propietario = localStorage.getItem("userMail");
  if(data.length){
      
      data.forEach(doc => {
          const coche = doc.data()
          if(coche.propietario == propietario){
              $('#seleccionar_coche')
              .append($("<option></option>")
              .attr("value",coche.modelo)
              .text(coche.modelo)); 

              $('#seleccionar_combustible').on('change', function() {
                  if(this.value == "diesel"){
                    document.getElementById('precio').value = gasolinerasGlobal['Precio Gasoleo A'];
                    if(gasolinerasGlobal['Precio Gasoleo A'] == ''){
                      document.getElementById('precio').value = 'No disponible';
                    }
                  }else if(this.value == "dieselplus"){
                    document.getElementById('precio').value = gasolinerasGlobal['Precio Gasoleo Premium'];
                    if(gasolinerasGlobal['Precio Gasoleo Premium'] == ''){
                      document.getElementById('precio').value = 'No disponible';
                    }
                  }else if(this.value == "gasolina95"){
                    document.getElementById('precio').value = gasolinerasGlobal['Precio Gasolina 95 E5'];
                    if(gasolinerasGlobal['Precio Gasolina 95 E5'] == ''){
                      document.getElementById('precio').value = 'No disponible';
                    }
                  }else if(this.value == "gasolina95plus"){
                    document.getElementById('precio').value = gasolinerasGlobal['Precio Gasolina 95 E5 Premium'];
                    if(gasolinerasGlobal['Precio Gasolina 95 E5 Premium'] == ''){
                      document.getElementById('precio').value = 'No disponible';
                    }
                  }else if(this.value == "gasolina98"){
                    document.getElementById('precio').value = gasolinerasGlobal['Precio Gasolina 98 E5'] ;
                    if(gasolinerasGlobal['Precio Gasolina 98 E5'] == ''){
                      document.getElementById('precio').value = 'No disponible';
                    }
                  }         
              });
              $('#seleccionar_coche').on('change', function() {
                data.forEach(doc => {
                  const coche2 = doc.data()
                  if(this.value == coche2.modelo)
                    document.getElementById('consumo').value = coche2.consumo;
                }
              )});               
          }
      });

  } else{
    
      $('#seleccionar_coche')
              .append($("<option></option>")
              .attr("value",coche.modelo)
              .text('No tienes coches guardados')); 
  }
}

//comprobar usuario actual
firebase.auth().onAuthStateChanged((user) => {
if (user) {
  window.email = user.email;
}
});

//peticion ajax y cogemos los datos de las gasolineras del usuario 
function mostrar_opcion_gasolineras(){
  const url = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'
  const http = new XMLHttpRequest()  
  http.open("GET", url)
  http.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
          var resultado = JSON.parse(this.responseText)
          resultado['ListaEESSPrecio'].forEach(gasolinera => {  
              gasolinerasFavoritas.forEach(gasolineraFav => {                   
                  gasolineraFav = gasolineraFav.data()
                  if (gasolineraFav.propietario == email && gasolineraFav.direccion == gasolinera['Dirección']) {
                      $('#seleccionar_gasolinera')
                      .append($("<option></option>")
                      .attr("value",gasolinera['Dirección'])
                      .text(gasolinera['Rótulo'] + " -- " + gasolinera['Localidad'] + " -- " + gasolinera['Dirección'])) 
                      .on('change', function() {
                          if (gasolinera['Dirección'] == document.getElementById('seleccionar_gasolinera').value.split('--').pop().trim()){
                            window.gasolinerasGlobal = gasolinera; 
                            console.log(gasolinerasGlobal)
                          }
                      })
                    }
              });
          })  
      };
  }
  http.send()
}  


//para que un usuario en especifico vea el contenido que queremos
auth.onAuthStateChanged(user =>{
  if(user){
      //tomamos las colecciones y las mostramos
      fs.collection('coches')
          .get()
          .then((snapshot) => {
              mostrar_opcion_coches(snapshot.docs)
              loginCheck(user)
          })

      fs.collection('gasolinerasFavoritas')
          .get()
          .then((snapshot) => {
              window.gasolinerasFavoritas = snapshot.docs
              })

      mostrar_opcion_gasolineras()
  }

  else{
      mostrar_opcion_coches([])
      loginCheck(user)
  }
})

function calcular(){
  var checkBox = document.getElementById("checkboxcamion");
  if (checkBox.checked == true){
    geocode(platform,"truck")
    console.log("Calculando ruta camion")
  }else{
    geocode(platform,"car") 
    console.log("Calculando ruta coche")
  }
  }

  function validarBoton(){
    direccion1= document.getElementById("direccion1").value
    direccion2= document.getElementById("direccion2").value
    precio =document.getElementById("precio").value 
    consumo= document.getElementById("consumo").value
    boton= document.getElementById("enviar_calc_viaje")

    if (direccion1 && direccion2 && precio && consumo){
      boton.disabled = false
    }else{
      boton.disabled = true
    }
}







//////////////////////////////////////////////////////////////////////////////////////
////                                                                              ////
////                             JAVASCRIPT MAPAS                                 ////
////                                                                              ////
//////////////////////////////////////////////////////////////////////////////////////

// apikey: "3TsUFtiiYdj5GhSzdIfkZFeK5qDMd5qvEj8eKTQ0WZw"


///////////////////////////////////////////////////////////
async function geocode(platform, metodoTransporte) {

  var geocoder = platform.getSearchService(),
      geocodingParameters = {
        q: document.getElementById("direccion1").value + "españa"
      };

    window.d1 = await geocoder.geocode(
    geocodingParameters,
    coordenadasOk,
    onError
  );

  geocodingParameters = {
    q: document.getElementById("direccion2").value + "españa"
  };

  window.d2 = await geocoder.geocode(
  geocodingParameters,
  coordenadasOk,
  onError
  );

  d1= d1.items[0].position.lat +","+d1.items[0].position.lng
  console.log (d1)
  d2 = d2.items[0].position.lat +","+d2.items[0].position.lng
  console.log(d2);
    metodoTransporte = metodoTransporte
  calculateRouteFromAtoB(platform,d1,d2, metodoTransporte)
}


function coordenadasOk(result) {
  var locations = result.items;
  if (!locations[0]){
    alert ("Dirección no encontrada")
    document.getElementById('tabla_viaje').style = "display: none"

  }else{
  return (locations[0].position.lat +" , "+locations[0].position.lng)
  }}

function onError(error) {
alert('Can\'t reach the remote server');
}



///////////////////////////////////////////////////////

function calculateRouteFromAtoB(platform, origen, destino,metodoTransporte) {
var router = platform.getRoutingService(null, 8),
    routeRequestParams = {
      routingMode: 'fast',
      transportMode: metodoTransporte,
      origin: origen, 
      destination: destino,  
      return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
    };

router.calculateRoute(
  routeRequestParams,
  onSuccess,
  onError
);
}

function onSuccess(result) {
var route = result.routes[0];
addRouteShapeToMap(route);
devolverdatos(result);

}




function devolverdatos(result){
var route = result.routes[0];
var checkboxidayvuelta = document.getElementById("checkboxidayvuelta");

if (checkboxidayvuelta.checked == true){
  console.log("ida y vuelta");
  distancia=route.sections[0].travelSummary.length *2
  segundos = route.sections[0].travelSummary.duration *2
}else{
  console.log("Solo ida");
  distancia=route.sections[0].travelSummary.length
  segundos = route.sections[0].travelSummary.duration
}



if (segundos > 3599){
  tiempo=convertir(segundos)
}else{
  tiempo=toMMSS(segundos)
}

console.log(distancia)
console.log(tiempo)

distanciatabla=document.getElementById('distanciaTabla')
distanciatabla.innerHTML=(distancia/1000).toFixed(2) + "Km"
duracionTabla=document.getElementById('duracionTabla')
duracionTabla.innerHTML=tiempo
document.getElementById('tabla_viaje').style = "display: block"


calcularlitros((distancia/1000).toFixed(2),document.getElementById("consumo").value)
calcularprecio((distancia/1000).toFixed(2),document.getElementById("consumo").value,document.getElementById("precio").value.replace("'" ,".").replace(",","."))
return 
}

function onError(error) {
alert('Error al comunicar con el servidor del mapa');
}

var mapContainer = document.getElementById('map'),
routeInstructionsContainer = document.getElementById('panel');

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
apikey: "3TsUFtiiYdj5GhSzdIfkZFeK5qDMd5qvEj8eKTQ0WZw"
});

var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
defaultLayers.vector.normal.map, {
center: {lat: 37.188263, lng:  -3.624024},
//37.188263, -3.624024
zoom: 13,
pixelRatio: window.devicePixelRatio || 1
});

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);


/**
* Creates a H.map.Polyline from the shape of the route and adds it to the map.
* @param {Object} route A route as received from the H.service.RoutingService
*/
function borrar(){
map.removeObjects(map.getObjects ())
}

function addRouteShapeToMap(route) {
borrar()
route.sections.forEach((section) => {
  // decode LineString from the flexible polyline
  let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

  // Create a polyline to display the route:
  let polyline = new H.map.Polyline(linestring, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });

  // Add the polyline to the map
  map.addObject(polyline);
  // map.removeObject(polyline)

  // And zoom to its bounding rectangle
  map.getViewModel().setLookAtData({
    bounds: polyline.getBoundingBox()
  });
});
}

function convertir(segundosP) {
const segundos = (Math.round(segundosP % 0x3C)).toString();
const horas    = (Math.floor(segundosP / 0xE10)).toString();
const minutos  = (Math.floor(segundosP / 0x3C ) % 0x3C).toString();
if (horas < 2){
  return horas + " hora " + minutos + " minutos "
}else{
  return horas + " horas " + minutos + " minutos "
}  
}

function toMMSS(duration) {
return Math.floor(duration / 60) + ' minutos ' + (duration % 60) + ' segundos.';
}

//calculateRouteFromAtoB(platform);

function calcularlitros(distancia, consumo){
litros= (distancia /100) * consumo
console.log(litros.toFixed(2) + " litros")
litrosTabla=document.getElementById('litrosTabla')
litrosTabla.innerHTML=(litros.toFixed(2) + " litros")
}

function calcularprecio(distancia, consumo, precio){
precio= (((consumo * precio)/100) * distancia).toFixed(2)
preciotabla=document.getElementById('precioTabla')
preciotabla.innerHTML=precio + "€"
console.log(precio + "€")
}