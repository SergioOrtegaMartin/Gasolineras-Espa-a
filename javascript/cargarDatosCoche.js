function inicia(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const modelo = urlParams.get('Modelo')
    const combustible = urlParams.get('Combustible')
    const consumo = urlParams.get('Consumo')
    const imagen = urlParams.get('Imagen')

    document.getElementById("modelo").value = modelo
    document.getElementById("combustible").value = combustible
    document.getElementById("consumo").value = consumo
    document.getElementById("imagen").value = imagen
}
  
window.addEventListener('load',inicia)