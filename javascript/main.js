var googleButton
var formularioRegistro
var formularioEntrar
var salir
var noLogeado
var logeado
var postList

formularioRegistro = document.querySelector('#formularioRegistro')
formularioEntrar = document.querySelector('#formularioEntrar')
googleButton = document.querySelector('#googleentrar')
salir = document.querySelector('#salir')
noLogeado = document.querySelectorAll('.noLogeado')
logeado = document.querySelectorAll('.logeado')
postList = document.querySelector('.posts')  

//Registro 

formularioRegistro.addEventListener('submit', (e) =>{
    e.preventDefault()
    const email = document.querySelector('#registroEmail').value
    const contraseña = document.querySelector('#registroContraseña').value

    auth.createUserWithEmailAndPassword(email,contraseña)
    .then(credenciales =>{
        console.log('registrado')
        formularioRegistro.reset()
        $('#registro').modal('hide')
    })
    .catch(err => {
        alert(err)
    })
})

//Entrar
formularioEntrar.addEventListener('submit', (e) =>{
    e.preventDefault()
    const email = document.querySelector('#entrarEmail').value
    const contraseña = document.querySelector('#entrarContraseña').value

    auth.signInWithEmailAndPassword(email,contraseña)
    .then(credenciales =>{
        console.log('entra')
        formularioEntrar.reset()
        $('#entrar').modal('hide')
        window.location.href = "https://pimikelsergio.s3.amazonaws.com/PI/html/main.html"
    })
    .catch(err => {
        alert(err)
    })
})

//Entrar con google
googleButton.addEventListener('click', e => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
        .then(result =>{
            console.log('entra con google')
            formularioEntrar.reset()
            $('#entrar').modal('hide')
            window.location.href = "https://pimikelsergio.s3.amazonaws.com/PI/html/main.html"
        })
        .catch(err => {
            alert(err)
        })
})

//Salir
salir.addEventListener('click', (e) =>{
    console.log('sale')
    e.preventDefault()
    auth.signOut().then(() =>{
        window.location.href = "https://pimikelsergio.s3.amazonaws.com/PI/html/main.html"
    })
})


//funcion para que cambie el menu si estas logeado
const loginCheck = user =>{
    if(user){
        console.log('Hay un usuario logeado')
        logeado.forEach(link => link.style.display = 'flex')
        noLogeado.forEach(link => link.style.display = 'none')
    }
    else{
        console.log('No hay un usuario logeado')
        logeado.forEach(link => link.style.display = 'none')
        noLogeado.forEach(link => link.style.display = 'flex')
    }
}

//comprobar usuario actual
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      window.email = user.email;
      console.log('usuario actual: '+ email)
      localStorage.setItem('userMail', email);
    }
  });


  //Para que cuando tengamos abierta una "burbuja" con la información de una gasolinera se nos cierre al pulsar otra
function borraelemento(){
    if (document.getElementsByClassName("H_ib_body").length >1){
        document.getElementsByClassName("H_ib_body")[0].remove()}
}