//funcion para actualizar la vista de la página
auth.onAuthStateChanged(user =>{
    if(user){
        loginCheck(user)
    }
    else{
        loginCheck(user)
    }
})