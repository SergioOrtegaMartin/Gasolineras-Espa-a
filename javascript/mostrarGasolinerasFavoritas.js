
//https://www.google.com/maps/dir//37.188524,-3.723921
function setupGasolineras(gasolineraFav) {
    document.getElementById("gif").style.display = "block";
    const url = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'
    const http = new XMLHttpRequest()  
    http.open("GET", url)
    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var resultado = JSON.parse(this.responseText)

            resultado['ListaEESSPrecio'].forEach(gasolinera => {
                if(gasolineraFav.direccion == gasolinera['Dirección']){
                    window.id = gasolineraFav.id
                    const tr = document.createElement('tr')
                    tr.className = "posts"
                    tr.innerHTML =
                        `
                            <td>${gasolinera['Rótulo']}</td>
                            <td>${gasolinera['Localidad']}</td>
                            <td>${gasolinera['Dirección']}</td>
                            <td>${gasolinera['Precio Gasolina 95 E5']}</td>
                            <td>${gasolinera['Precio Gasolina 95 E5 Premium']}</td>
                            <td>${gasolinera['Precio Gasolina 98 E5']}</td>
                            <td>${gasolinera['Precio Gasoleo A']}</td>
                            <td>${gasolinera['Precio Gasoleo Premium']}</td>
                            <td>${gasolinera['Horario']}</td>
                            <td> <a href="https://www.google.com/maps/dir//${gasolinera['Latitud'].replace(",",".")},${gasolinera['Longitud (WGS84)'].replace(",",".")}" target="_blank"><img src="../img/gps.png"  width="30" height="30"></a> </td>
                            <td><button onclick="borrarGasolinera()">Borrar de mi lista</button></td>
                        `
    
                    postList.append(tr)
                }
                document.getElementById('gif').style.display = "none";
            });                        
        }
    }

    http.send()
}

function borrarGasolinera(){
    fs.collection("gasolinerasFavoritas").doc(id).delete()
    .then(() => {
        console.log("Borrado con exito");
        window.location.href = "https://pimikelsergio.s3.amazonaws.com/PI/html/MisGasolineras.html"
    })
    .catch((error) => {
        console.error("Error al borrar", error);
        alert('Gasolinera borrada con éxito')
    });
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


//para que un usuario en especifico vea el contenido que queremos
auth.onAuthStateChanged(user => {
    if (user) {
        fs.collection('gasolinerasFavoritas')
            .get()
            .then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    const gasolineraFav = doc.data()
                    if (gasolineraFav.propietario == email) {
                        setupGasolineras(gasolineraFav)
                    }
                });
                loginCheck(user)
            })
    }
    else {
        setupGasolineras([])
        loginCheck(user)
    }
})