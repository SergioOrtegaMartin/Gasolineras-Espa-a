//cargar gasolinera de la api
function cargaGasolinera(){
    document.getElementById("gif").style.display = "block";


    localidad = document.getElementById('localidad').value.toUpperCase()

    const url = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'
    const http = new XMLHttpRequest()

    http.open("GET", url)
    http.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200){
            var resultado = JSON.parse(this.responseText)
            $('.cabeza').remove()
            resultados = 0
            resultado['ListaEESSPrecio'].forEach(gasolinera => {
                if(gasolinera.Localidad == localidad){
                    resultados += 1
                    maquetaTabla(gasolinera,resultado['ListaEESSPrecio'])
                    document.getElementById('precio95').addEventListener('click', () =>{
                        ordenarPrecios(3)
                    })
                
                    document.getElementById('precio95plus').addEventListener('click',() =>{
                        ordenarPrecios(4)
                    })
                
                    document.getElementById('precio98').addEventListener('click',() =>{
                        ordenarPrecios(5)
                    })
                
                    document.getElementById('precioDiesel').addEventListener('click',() =>{
                        ordenarPrecios(6)
                    })
                
                    document.getElementById('precioDieselPlus').addEventListener('click',() =>{
                        ordenarPrecios(7)
                    })
                }
                document.getElementById('gif').style.display = "none";
                
            });
            console.log(resultados);
            if(resultados == 0){
                alert('No se ha encontrado la direccion')
            }
            
        }
    }
    http.send()
}
let i = 0;
function maquetaTabla(gasolinera){
    $('#tablaGasolineras')
        .append($(`<tr id=${i} class="cabeza"><td>${gasolinera["Rótulo"]}</td>
        <td>${gasolinera["Localidad"]}</td>
        <td>${gasolinera["Dirección"]}</td>
        <td>${gasolinera["Precio Gasolina 95 E5"]}</td>
        <td>${gasolinera["Precio Gasolina 95 E5 Premium"]}</td>
        <td>${gasolinera["Precio Gasolina 98 E5"]}</td>
        <td>${gasolinera["Precio Gasoleo A"]}</td>
        <td>${gasolinera["Precio Gasoleo Premium"]}</td>
        <td>${gasolinera["Horario"]}</td>
        <td><button onclick="guardarGasolinera('${gasolinera["Dirección"]}')">Añadir a mis gasolineras favoritas</button></td>
        <td> <a href="https://www.google.com/maps/dir//${gasolinera['Latitud'].replace(",",".")},${gasolinera['Longitud (WGS84)'].replace(",",".")}" target="_blank"><img src="../img/gps.png"  width="30" height="30"></a> </td>

        </tr>`));
    i++
}

function ordenarPrecios(num){

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("tablaGasolineras");
    switching = true;

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[num];
        y = rows[i + 1].getElementsByTagName("td")[num];

        if (x.innerHTML > y.innerHTML) {
            shouldSwitch = true;
            break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}

function guardarGasolinera(direccion) {

    var direccion = direccion
    var propietario = localStorage.getItem("userMail")

    fs.collection("gasolinerasFavoritas").add({
        direccion: direccion,
        propietario : propietario
        
    }).then((docRef) => {
        fs.collection("gasolinerasFavoritas").doc(docRef.id).update({
            id: docRef.id
        })
        console.log('Guardado con exito')
        alert('Se ha añadido a tus gasolineras favoritas')
    })
        .catch((error) => {
            console.log('Error al registrar' + error)
        });
 
}

function validar(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13) cargaGasolinera();
  }