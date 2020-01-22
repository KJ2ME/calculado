/*
* Author: KJ
* Web: https://kj2.me
* Licence: GNU GPLv3  (https://www.gnu.org/licenses/gpl-3.0.html)
*
*/

class Calculado{

  /*
  * El contructor se encargará de crear los nodos HTML iniciales
  */
  constructor(){
    this.container           = document.body
    this.container.className = 'game-container'
    this.exerciseType        = 'sum'
    this.mode                = 'normal'
    this.level               = 2
    
    this.execiseContainer = document.createElement('div')
    this.execise          = document.createElement('div')
    this.surviBar         = document.createElement('div')
    this.loadBar          = document.createElement('div')
    this.reply            = document.createElement('div')
    this.stats            = document.createElement('div')
    this.footer           = document.createElement('div')
    
    this.execiseContainer.className = 'exercise-container'
    this.execise.className          = 'exercise'
    this.reply.className            = 'reply'
    this.stats.className            = 'stats'
    this.footer.className           = 'footer'
    this.surviBar.className         = 'progress-bar'
    this.loadBar.className          = 'load-bar'
    this.reply.contentEditable      = true
    
    this.surviBar.appendChild(this.loadBar)
    
        
    this.sounds = {
      backgound: document.createElement('audio'),
      fail: document.createElement('audio'),
      success: document.createElement('audio'),
      gameOver: document.createElement('audio')
    }
    
    this.sounds.backgound.src = 'sounds/backgound.ogg'
    this.sounds.success.src   = 'sounds/success.ogg'
    this.sounds.fail.src      = 'sounds/fail.ogg'
    this.sounds.gameOver.src  = 'sounds/gameOver.ogg'
    
    this.sounds.backgound.loop    = true
    this.sounds.backgound.volume  = 0.5
    this.keyListener()
    this.startMenu()
  }
  
  /*
  * Actualiza las estadísticas del juego
  */
  printStats(){
    this.stats.innerHTML = 'Aciertos:  '+this.hits+'<br>'+
                           'Errores:   '+this.errors
  }
  
  /*
  * Imprime la barra del modo survival
  */
  
  printSurviBar(){
    if (this.mode == 'survival'){
      this.loadBar.remove()
      this.surviBar.appendChild(this.loadBar)
      clearTimeout(this.survivalTime)
      this.survivalTime = setTimeout(function(){
        this.execiseContainer.innerHTML = "GAME OVER"
        this.sounds.gameOver.play()
      }.bind(this), 10000)
    }
  }
  
  /*
  * Imprime el ejercicio y deja el cursor colocado en el campo
  * de respuesta de manera automática.
  */
  
  printExercise(html){
    this.execise.innerHTML = html
    
    let selection = window.getSelection()
    let range = document.createRange();
    this.reply.innerHTML = '\u00a0';
    range.selectNodeContents(this.reply);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('delete', false, null);
  }
  
  /*
  * Inserta el menú de inicio que explica los controles y las opciones de juego
  */
  startMenu(){
    clearTimeout(this.survivalTime)
    this.sounds.backgound.pause()
    this.started                    = false
    this.container.innerHTML        = ''
    this.execiseContainer.innerHTML = ''
    
    let menu              = document.createElement('div')
    let startButton       = document.createElement('div')
    menu.className        = 'start-menu'
    startButton.className = 'start-button'
    
    menu.innerHTML = '<strong>Controles</strong><br>'+
                     '<p>'+
                      '[ENTER] - Comprobar resultado<br>'+
                      '[ESCAPE] - Volver a este menú'+
                     '</p>'+
                     '<strong>Opciones</strong><br>'+
                     '<p>'+
                      'Tipo de ejercicio:<br>'+
                      '<select id="type">'+
                        '<option value="sum">Suma</option>'+
                        '<option value="subtraction">Resta</option>'+
                        '<option value="multiplication">Multiplicación</option>'+
                        '<option value="division">División entera</option>'+
                      '</select>'+
                     '</p>'+
                      'Nivel:<br>'+
                      '<input type="number" min="1" id="level" value="2"/>'+
                     '</p>'+
                     '<p>'+
                      'Modo de juego:<br>'+
                      '<select id="mode">'+
                        '<option value="normal">Normal</option>'+
                        '<option value="survival">Supervivencia</option>'+
                      '</select>'+
                     '</p>' 
                                         
    startButton.innerHTML = ' Comenzar '
    
    this.container.appendChild(menu)
    menu.appendChild(startButton)
    
    startButton.onclick = function(){
      this.exerciseType = document.getElementById('type').value
      this.level        = parseInt(document.getElementById('level').value)
      this.mode         = document.getElementById('mode').value
      this.startGame()
    }.bind(this)
  }
  
  /*
  * Inserta los elementos del juego y comenzar los contadores
  */
  startGame(){
    this.hits                = 0
    this.errors              = 0
    this.container.innerHTML = ''
    this.footer.innerHTML    = 'Game by <a href="https://kj2.me">KJ</a>'
    
    this.container.appendChild(this.stats)
    this.container.appendChild(this.execiseContainer)
    this.container.appendChild(this.footer)
    this.execiseContainer.appendChild(this.execise)
    this.execiseContainer.appendChild(this.reply)
    
    this.started = true
    this.sounds.backgound.play()
    this[this.exerciseType]()
    this.printStats()
    
    if (this.mode=='survival'){
      this.container.appendChild(this.surviBar)
      this.printSurviBar()
    }
  }
  
  /*
  * Detectamos cuando presionen Enter
  */
  
  keyListener(){
    document.onkeydown = function (event) {
      if (event.which == 13) {
        event.preventDefault()
        if (this.started) this.check()
      }
      
      if (event.which == 27) {
        event.preventDefault()
        if (this.started) this.startMenu()
      }
    }.bind(this)
  }
  
  /*
  * Verificamos la respuesta y si es correcta, generamos otro ejercicio,
  * si es incorrecta se borra el resultado y se genera una animación.
  */
  
  check(){
    if (this.reply.innerHTML == '<br>') return
    
    if (parseFloat(this.reply.innerHTML) == this.result){
      this.execiseContainer.className = 'exercise-container greenflash'
      this.printSurviBar()
      this.sounds.success.play()
      this[this.exerciseType]()
      this.hits++
    } else {
      this.errors++
      this.execiseContainer.className = 'exercise-container redflash'
      this.sounds.fail.play()
      
      let selection        = window.getSelection()
      let range            = document.createRange();
      this.reply.innerHTML = '\u00a0';
      range.selectNodeContents(this.reply);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('delete', false, null);
    }
    
    this.printStats()
    
    setTimeout(function(){
        this.execiseContainer.className = 'exercise-container'
    }.bind(this), 1000)
  }
  
  /*
  * Generar A y B
  */
  
  generateAB(limitB){
    let a = Math.round(Math.random()*Math.pow(10, this.level))
    let b = 0
    if (limitB){
      b = Math.round(Math.random()*Math.pow(10, (this.level % 3))) + 1
    } else {
      b = Math.round(Math.random()*Math.pow(10, this.level))
    }
    
    return {
      'a': a,
      'b': b
    }
  }
  
  /*
  * Generar un ejercicio de suma
  */
  sum(){
    let elems = this.generateAB()
    this.result = elems.a + elems.b
    this.printExercise(elems.a+' + '+elems.b+' = ')
  }
  
  /*
  * Generar un ejercicio de resta
  */
  subtraction(){
    let elems = this.generateAB()
    this.result = elems.a - elems.b
    this.printExercise(elems.a+' - '+elems.b+' = ')
  }
  
  /*
  * Generar un ejercicio de multiplicación
  */
  multiplication(){
    let elems = this.generateAB(true)
    this.result = elems.a * elems.b
    this.printExercise(elems.a+' * '+elems.b+' = ')
  
  }
  
  /*
  * Generar un ejercicio de division con un resultado
  * de un decimal máximo
  */
  division(){
    let elems = this.generateAB(true)
    this.result = Math.floor(elems.a / elems.b)
    this.printExercise(elems.a+' / '+elems.b+' = ')
  }
}


/*
* Esta función espera a la carga del DOM Html para ejecutar una función
*/

function documentReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : 
  document.readyState !== "loading"){
    fn()
  } else {
    window.addEventListener('load', fn)
  }
}

// Init
documentReady(()=>{
  new Calculado()
  document.title = "Calculado"
})
