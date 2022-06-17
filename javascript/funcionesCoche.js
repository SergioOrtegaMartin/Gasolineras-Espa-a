//funcion recorrer coleccion coches
const setupCoches = data =>{
    if(data.length){
        
        data.forEach(doc => {
            const coche = doc.data()
            if(coche.propietario == email){
                const tr = document.createElement('tr')
                tr.className="posts"
                tr.innerHTML = 
                `<td id='coches'>${coche.modelo}</td>
                <td id='coches'>${coche.combustible}</td>
                <td id='coches'>${coche.consumo}</td>
                <td><img src="${coche.imagen}" width="300" height="200"></td>
                <td><a id='coches2' href="editarCoche.html?cocheSelec=${(coche.id).replace(" ","")}&Modelo=${coche.modelo}&Combustible=${coche.combustible}&Consumo=${coche.consumo}&Imagen=${coche.imagen}"><button>Editar coche</button></a>
                    <a id='coches2' href="borrarCoche.html?cocheSelec=${(coche.id).replace(" ","")}"><button>Borrar coche</button></a>
                </td>`
            
                postList.append(tr)
            }
        });
    } else{
        postList.innerHTML = '<p class="text-center">No hay ningun coche registrado</p>'
    }
}


//para que un usuario en especifico vea el contenido que queremos
auth.onAuthStateChanged(user =>{
    if(user){
        //tomamos la coleccion de coches y la mostramos
        fs.collection('coches')
            .get()
            .then((snapshot) => {
                setupCoches(snapshot.docs)
                loginCheck(user)
            })
    }
    else{
        setupCoches([])
        loginCheck(user)
    }
})

