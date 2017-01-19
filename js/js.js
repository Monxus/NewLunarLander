var fuelInicial = 100;
var fuel = fuelInicial;

var velocidadImpacto = 5;

var alturaInicio = 17;
var y = alturaInicio;
var recorrido = 60;
var puntoAterrizaje = alturaInicio + recorrido;

var v = 0;
var g = 1.622;
var a = g;
var dt = 0.016683;
var timer = null;
var timerFuel = null;


var hayFuel = true;
var pausaVisible = false;
var instruccionesVisibles = false;
var opcionesVisibles = false;
var aboutVisible = false;
var finJuego = false;
var hayPausa = true;

var naveImg = "nave";

//al cargar por completo la página...
window.onload = function(){
	mensajeBienvenida();

	//definición de eventos
	//mostrar menú móvil
    	document.getElementById("showm").onclick = function () {
		document.getElementsByClassName("c")[0].style.display = "block";
		stop();

	}
	//ocultar menú móvil
	document.getElementById("hidem").onclick = function () {
		document.getElementsByClassName("c")[0].style.display = "none";
		start();
	}
	//encender/apagar el motor al hacer click en la pantalla
	
	document.ontouchstart = function () {
  		motorOn();
 	  }

	document.ontouchend = function () {
  		motorOff();
 	  }

	//encender/apagar al apretar/soltar una tecla
	document.onkeydown = function keyCode(event) {
    var x = event.keyCode;
    if (x == 32) {
		motorOn();
    }
	}
	document.onkeyup = function keyCode(event) {
    var x = event.keyCode;
    if (x == 32) {
		motorOff();
    }
	}
	
	//Empezar a JUGAR
	document.getElementById("bienvenidaJugar").onclick = function(){
		ocultar();
	}

	//Mostrar Pausa
	document.getElementById("play").onclick = function(){
		if(pausaVisible==false){
			mostrarPausa();
		}else {
			ocultar();
		}
	}

	document.onkeypress = function keyCode(event) {
    var x = event.keyCode;
	if ((x == 112 || x == 80) && pausaVisible==false) {
		mostrarPausa();
    }else if((x == 112 || x == 80) && pausaVisible==true){
		ocultar();
	}
	}

	//Mostrar Instrucciones
	document.getElementById("instruction").onclick = function(){
		if(instruccionesVisibles==false){
			mostrarInstrucciones();
		}else{
			ocultar();
		}
	}

	//Mostrar Opciones
	document.getElementById("option").onclick = function(){
		if(opcionesVisibles==false){
			mostrarOpciones();
		}else{
			ocultar();
		}
	}

	//Mostrar About
	document.getElementById("about").onclick = function(){
		if(aboutVisible==false){
			mostrarAbout();
		}else{
			ocultar();
		}
	}

	//Salir de los menus en el movil
	var element=document.getElementsByClassName("volverMovil");
	var i;

	for(i=0;i<element.length;i++){
		element[i].onclick = function(){
		ocultarTodo();
		}
	}

	//Restart menu movil

	document.getElementById("restartMovil").onclick = function () {
		document.getElementsByClassName("c")[0].style.display = "none";
		restart();
		start();
		motorOff();
	}

	//Seleccion Menu Pausa

	document.getElementById("reiniciarPausa").onclick = function(){
		restart();
		ocultar();
	}

	document.getElementById("continuarPausa").onclick = function(){
		ocultar();
	}


	//Seleccion de nivel
	document.getElementById("facilNivel").onclick = function(){
		seleccionarFacil();
	}
	document.getElementById("medioNivel").onclick = function(){
		seleccionarMedio();
	}
	document.getElementById("dificilNivel").onclick = function(){
		seleccionarDificil();
	}

	//Seleccion nave
	document.getElementById("naveOpcion").onclick = function(){
		seleccionarNave();
	}
	document.getElementById("ovniOpcion").onclick = function(){
		seleccionarOvni();
	}

	//Seleccion de fondo
	document.getElementById("lunaOpcion").onclick = function(){
		seleccionarLuna();
	}
	document.getElementById("marteOpcion").onclick = function(){
		seleccionarMarte();
	}

	//Restart fin Juego
	document.getElementById("rejugar").onclick = function(){
		restart();
		start();
		motorOff();
	}
	
}

//Definición de funciones
function start(){
	hayPausa=false;
	timer=setInterval(function(){ moverNave(); }, dt*1000);
	document.getElementById("play").innerHTML = "PAUSAR";
	
}

function stop(){
	hayPausa=true;
	clearInterval(timer);
	motorOff();
	
	if(finJuego==true){
		document.getElementById("play").innerHTML = "JUGAR";
	}else{
		document.getElementById("play").innerHTML = "CONTINUAR";
	}
}

function moverNave(){
	v +=a*dt;
	document.getElementById("velocidad").innerHTML=v.toFixed(2);
	if(v<velocidadImpacto){
		document.getElementById("velocidad").style.color="lime";
	}else if(v<(velocidadImpacto*1.5)){
		document.getElementById("velocidad").style.color="orangered";
	}else{
		document.getElementById("velocidad").style.color="red";
	}
	
	y += v*dt;
	document.getElementById("altura").innerHTML=(puntoAterrizaje-y).toFixed(2);
	
	//mover hasta que top sea un 70% de la pantalla
		y += v*dt;
	document.getElementById("altura").innerHTML=(puntoAterrizaje-y).toFixed(2);
	
	if (y<(alturaInicio-30)){ 
		
		finJuego=true;
		hayPausa=true;
		mensajeSobreAltura();
		motorOff();
		stop();
	} else if (y<puntoAterrizaje){
		document.getElementById("nave").style.top = y+"%";
	}else{
		document.getElementById("altura").innerHTML=0; 	
		hayPausa=true;	
		comprobarAterrizaje();
		motorOff(); 
		stop();
	}
}
function motorOn(){
	if(fuel>0 && hayPausa==false && finJuego==false){
	a=-g;
	if (timerFuel==null)
	timerFuel=setInterval(function(){ actualizarFuel(); }, 10);
	document.getElementById("naveimg").src="img/"+naveImg+"p.png";
	}
}
function motorOff(){
	if (finJuego==false){
		a=g;
		clearInterval(timerFuel);
		timerFuel=null;
		document.getElementById("naveimg").src="img/"+naveImg+".png";
	}
	
}
function actualizarFuel(){
	//Aquí hay que cambiar el valor del marcador de Fuel...
	if (hayFuel==true && finJuego==false){
			fuel-=0.1;
			if (fuel<=0){
				hayFuel=false;
				fuel=0;
				motorOff()}
			
			if (fuel<=fuelInicial/5){
				document.getElementById("fuel").style.color="red";						
			}else if (fuel<=fuelInicial/2){
				document.getElementById("fuel").style.color="orangered";	
			}
			document.getElementById("fuel").innerHTML=fuel.toFixed(2);
	}
}

function restart(){
	reiniciarConfiguracion();

	
	hayPausa=false;
	timer=null;
	timerFuel=null;
	document.getElementById("divFinJuego").style.display="none";
}

function reiniciarConfiguracion(){
	y=alturaInicio;
	fuel=fuelInicial;
	v=0;
	hayFuel=true;
	finJuego=false;

	document.getElementById("fuel").style.color="lime";
	document.getElementById("fuel").innerHTML=fuel.toFixed();
	document.getElementById("naveimg").src="img/"+naveImg+".png";
}

//Cuando el cohete aterriza

function comprobarAterrizaje(){
	finJuego=true;
	if(v>velocidadImpacto){
		document.getElementById("naveimg").src="img/explosion.png";
		mensajeFail();
	}else{
		document.getElementById("naveimg").src="img/"+naveImg+".png";
		mensajeWin();
	}
	
}

//Mensaje inicio Juego
function mensajeBienvenida(){
	document.getElementById("divBienvenida").style.display="block";
}

function mensajeWin(){
	document.getElementById("divFinJuego").style.display="block";
	document.getElementById("cabezeraFin").innerHTML="VICTORIA";
	document.getElementById("parrafoFin").innerHTML="¡¡Enhorabuena!! Eres un atronauta genial.";
}

function mensajeFail(){
	document.getElementById("divFinJuego").style.display="block";
	document.getElementById("cabezeraFin").innerHTML="HAS FALLADO";
	document.getElementById("parrafoFin").innerHTML="Otra vez será...";
}

function mensajeSobreAltura(){
	document.getElementById("divFinJuego").style.display="block";
	document.getElementById("cabezeraFin").innerHTML="HAS FALLADO";
	document.getElementById("parrafoFin").innerHTML="Recuerda que queremos ATERRIZAR... ¬¬";
}

//Al clicar en "Pausa" nos lleva a un div
function mostrarPausa(){
		stop();
		ocultarTodo();
		document.getElementById("divpausa").style.display="block";
		pausaVisible=true;
}

//Al clicar en "Instrucciones" nos lleva a un div
function mostrarInstrucciones(){
		stop();
		ocultarTodo();
		document.getElementById("divinstrucciones").style.display="block";
		instruccionesVisibles=true;
}

//Al clicar en "Opciones" nos lleva a un div con opciones
function mostrarOpciones(){
		stop();	
		ocultarTodo();
		document.getElementById("divopciones").style.display="block";
		opcionesVisibles=true;
}

//Al clicar en "Acerca de..." nos lleva a un div
function mostrarAbout(){
		stop();	
		ocultarTodo();
		document.getElementById("divabout").style.display="block";
		aboutVisible=true;
}

//Funcion auxiliar para cerrar todos los divs, especialmente para version escritorio

function ocultarTodo(){
	var emergentes=document.getElementsByClassName("divEmergente");
	var i;

	for(i=0;i<emergentes.length;i++){
		emergentes[i].style.display = "none";
	}

	pausaVisible=false;
	instruccionesVisibles=false;
	opcionesVisibles=false;
	aboutVisible=false;
}

function ocultar(){
	ocultarTodo();
	start();
	motorOff();
}

//Funciones de Opciones

//Seleccionar nivel

function seleccionarFacil(){
	fuelInicial=100;
	velocidadImpacto=5;
	document.getElementById("facilNivel").style.textDecoration="underline";
	document.getElementById("medioNivel").style.textDecoration="none";
	document.getElementById("dificilNivel").style.textDecoration="none";
	document.getElementById("parrafoNivel").innerHTML="FÁCIL: Tienes 100 litros de combustible y debes aterrizar a menos de 5 m/s.";
	reiniciarConfiguracion();
}

function seleccionarMedio(){
	fuelInicial=75;
	velocidadImpacto=2.5;
	document.getElementById("facilNivel").style.textDecoration="none";
	document.getElementById("medioNivel").style.textDecoration="underline";
	document.getElementById("dificilNivel").style.textDecoration="none";
	document.getElementById("parrafoNivel").innerHTML="MEDIO: Tienes 75 litros de combustible y debes aterrizar a menos de 2.5 m/s.";
	reiniciarConfiguracion();
}

function seleccionarDificil(){
	fuelInicial=50;
	velocidadImpacto=1;
	document.getElementById("facilNivel").style.textDecoration="none";
	document.getElementById("medioNivel").style.textDecoration="none";
	document.getElementById("dificilNivel").style.textDecoration="underline";
	document.getElementById("parrafoNivel").innerHTML="DIFÍCIL: Tienes 50 litros de combustible y debes aterrizar a menos de 1 m/s.";
	reiniciarConfiguracion();
}

//Seleccionar nave

function seleccionarNave(){
	naveImg="nave";
	document.getElementById("naveOpcion").style.textDecoration="underline";
	document.getElementById("ovniOpcion").style.textDecoration="none";
}

function seleccionarOvni(){
	naveImg="ovni";
	document.getElementById("ovniOpcion").style.textDecoration="underline";
	document.getElementById("naveOpcion").style.textDecoration="none";
}

//Seleccion lugar aterrizaje

function seleccionarLuna(){
	document.getElementsByClassName("d")[0].style.backgroundImage="url('img/LUN001.png')";
	document.getElementsByClassName("d")[0].style.backgroundColor="#787878";
	document.getElementById("lunaOpcion").style.textDecoration="underline";
	document.getElementById("marteOpcion").style.textDecoration="none";
}

function seleccionarMarte(){
	document.getElementsByClassName("d")[0].style.backgroundImage="url('img/MARS001.png')";
	document.getElementsByClassName("d")[0].style.backgroundColor="#DB1616";
	document.getElementById("marteOpcion").style.textDecoration="underline";
	document.getElementById("lunaOpcion").style.textDecoration="none";
}

