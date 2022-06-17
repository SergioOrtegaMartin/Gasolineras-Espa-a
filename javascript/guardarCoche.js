function guardarCoche() {

    var modelo = document.getElementById("modelo").value;
    var imagen = document.getElementById("imagen").value;
    var combustible = document.getElementById("combustible").value;
    var consumo = document.getElementById("consumo").value;
    var propietario = localStorage.getItem("userMail");


    fs.collection("coches").add({
        modelo: modelo,
        combustible: combustible,
        consumo: consumo,
        imagen: imagen,
        propietario: propietario
        
    }).then((docRef) => {
        console.log('Registrado con exito')
        console.log(docRef.id);

        fs.collection("coches").doc(docRef.id).update({
            id: docRef.id
        })
        window.location.href = "https://pimikelsergio.s3.amazonaws.com/PI/html/MisCoches.html"
    })
        .catch((error) => {
            console.log('Error al registrar' + error)
        });
 
}

function editarCoche(){

    var modelo = document.getElementById("modelo").value;
    var imagen = document.getElementById("imagen").value;
    var combustible = document.getElementById("combustible").value;
    var consumo = document.getElementById("consumo").value;
    var propietario = localStorage.getItem("userMail");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const cocheID = urlParams.get('cocheSelec')
    console.log(cocheID);
    fs.collection("coches").doc(cocheID).update({
        modelo: modelo,
        combustible: combustible,
        consumo: consumo,
        imagen: imagen,
        propietario: propietario
    })
    .then(() => {
        console.log("Editado con exito");
        window.location.href = "https://pimikelsergio.s3.amazonaws.com/PI/html/MisCoches.html"
    })
    .catch((error) => {
        console.error("Error al editar", error);
    });
}


function borrarCoche(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const cocheID = urlParams.get('cocheSelec')
    fs.collection("coches").doc(cocheID).delete()
    .then(() => {
        console.log("Borrado con exito");
        window.location.href = "https://pimikelsergio.s3.amazonaws.com/PI/html/MisCoches.html"
    })
    .catch((error) => {
        console.error("Error al borrar", error);
    });
}