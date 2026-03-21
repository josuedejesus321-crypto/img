// ===== UTILIDADES GLOBALES (PUNTOS, PANTALLAS) =====
function obtenerPuntos() {
  const puntos = localStorage.getItem("puntos");
  return puntos ? parseInt(puntos) : 0;
}

function guardarPuntos(puntos) {
  localStorage.setItem("puntos", puntos);
}

function sumarPuntos(cantidad) {
  let puntos = obtenerPuntos();
  puntos += cantidad;
  guardarPuntos(puntos);
}

const screens = {
  menu: document.getElementById("screen-menu"),
  nivel: document.getElementById("screen-nivel"),
  bonus: document.getElementById("screen-bonus"),
  store: document.getElementById("screen-store"),
};

function mostrarPantalla(nombre) {
  // al cambiar de pantalla, pausamos contadores según corresponda
  if (nombre !== "nivel" && typeof intervaloNivel !== "undefined") {
    clearInterval(intervaloNivel);
  }
  if (nombre !== "bonus" && typeof intervaloBonus !== "undefined") {
    clearInterval(intervaloBonus);
    pausadoBonus = true;
  }

  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[nombre].classList.remove("hidden");
}

// ===== OVERLAY GENÉRICO =====
const Inf = document.getElementById("in");

Inf.addEventListener("click", () => {
  Inf.classList.add("hidden");
});

// ===== MENÚ =====
const BtnPlay = document.getElementById("BtnPlay");
const BtnStore = document.getElementById("BtnStore");
const BtnInfo = document.getElementById("BtnInfo");
const BtnAudio = document.getElementById("BtnAudio");
const musicFrame = document.getElementById("musicFrame");

let mute = true;

BtnPlay.addEventListener("click", () => {
  mostrarPantalla("nivel");
  iniciarNivel();
});

BtnStore.addEventListener("click", () => {
  mostrarPantalla("store");
  iniciarStore();
});

BtnInfo.addEventListener("click", () => {
  Inf.classList.remove("hidden");
  Inf.innerHTML = `<p id="descripcion">Descripción del juego<br><br>
Este juego cuenta la historia de una tortuga marina que intenta migrar a través del océano. Durante su viaje, se encuentra con distintos tipos de basura y contaminación que las personas han arrojado al mar. El jugador debe ayudar a la tortuga a esquivar estos residuos para que pueda continuar su camino de forma segura.
<br><br>
El objetivo del juego es mostrar, de una manera interactiva y divertida, los problemas que la contaminación provoca en los océanos y cómo afecta directamente a los animales marinos. A medida que el jugador avanza, puede ver cómo la basura se convierte en un obstáculo constante para la tortuga.
<br><br>
Problema que busca resolver
<br><br>
Este juego busca crear conciencia en los niños sobre las consecuencias de contaminar el océano. Muchas veces la basura que las personas tiran termina en el mar y afecta la vida de animales como tortugas, peces y otras especies marinas.
<br><br>
`;
});

BtnAudio.addEventListener("click", () => {
  if (mute) {
    musicFrame.src =
      "https://www.youtube.com/embed/mRN_T6JkH-c?autoplay=1&loop=1&playlist=mRN_T6JkH-c";
    BtnAudio.innerHTML = `<img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/Botones/BtnMusic.png">`;
    mute = false;
  } else {
    musicFrame.src =
      "https://www.youtube.com/embed/mRN_T6JkH-c?autoplay=1&mute=1&loop=1&playlist=mRN_T6JkH-c";
    BtnAudio.innerHTML = `<img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/Botones/BntMute.png">`;
    mute = true;
  }
});

// ===== NIVEL (basado en scriptnivel.js) =====
let playerNivel = document.getElementById("playerNivel");
let carriles = document.querySelectorAll("#screen-nivel .C");
let carrilActual = 1;
let xNivel = 50;
const BtnExitNivel = document.getElementById("exitNivel");
let timeNivel = document.getElementById("timeNivel");
let scoreNivelEl = document.getElementById("scoreNivel");
let tiempoNivel = 0;
let intervaloNivel;
let vidas = 3;
let vidasUI = document.querySelectorAll("#lives img");

BtnExitNivel.addEventListener("click", () => {
  // Mismo menú de confirmación que en BONUS, pero aplicado al NIVEL
  clearInterval(intervaloNivel);
  Inf.classList.remove("hidden");
  Inf.innerHTML = `<p>Realmente quieres salir?</p>
    <div class="BtnsIn">
      <button id="BtnSiExit"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/Botones/BtnSi.png"></button>
      <button id="BtnNo"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/Botones/BtnNo.png"></button>
    </div>`;

  // Si confirma, vuelve al menú principal
  document.getElementById("BtnSiExit").addEventListener("click", () => {
    Inf.classList.add("hidden");
    mostrarPantalla("menu");
  });

  // Si no, cerramos el menú Inf y reanudamos el contador del nivel
  document.getElementById("BtnNo").addEventListener("click", () => {
    Inf.classList.add("hidden");
    iniciarCuentaNivel(tiempoNivel);
  });
});

function iniciarNivel() {
  scoreNivelEl.textContent = "$" + obtenerPuntos();
  iniciarCuentaNivel(60);
  moverPlayerNivel();
  // generar al menos una basura inicial en cada carril
  carriles.forEach((carril) => {
    crearBasura(carril);
  });
}

function iniciarCuentaNivel(T) {
  clearInterval(intervaloNivel);
  tiempoNivel = T;
  timeNivel.textContent = "0:" + tiempoNivel;

  intervaloNivel = setInterval(() => {
    timeNivel.textContent = "0:" + tiempoNivel;
    if (tiempoNivel === 0) {
      clearInterval(intervaloNivel);
      mostrarPantalla("bonus");
      iniciarBonus();
    }
    tiempoNivel--;
  }, 1000);
}

function perderVida() {
  if (vidas <= 0) return;
  vidas--;
  vidasUI[vidas].style.opacity = "0.2";
  if (vidas === 0) {
    GameOver();
  }
}

function GameOver() {
  clearInterval(intervaloNivel);
  const go = document.getElementById("Gameover");
  go.classList.add("show");
  setTimeout(() => {
    go.classList.remove("show");
    Inf.classList.remove("hidden");
    Inf.innerHTML = `<p id="tiempo">Quieres Continuar?</p>
      <div class="BtnsInf">
        <button id="BtnReload" class="BtnsIn"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/ui/BtnReintentar.png"></button>
        <button id="BtnMenu" class="BtnsIn"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/ui/BtnMenu.png"></button>
      </div>`;
    document.getElementById("BtnReload").addEventListener("click", () => {
      vidas = 3;
      vidasUI.forEach((v) => (v.style.opacity = "1"));
      Inf.classList.add("hidden");
      iniciarNivel();
    });
    document.getElementById("BtnMenu").addEventListener("click", () => {
      vidas = 3;
      vidasUI.forEach((v) => (v.style.opacity = "1"));
      mostrarPantalla("menu");
    });
  }, 2000);
}

function detectarColisionesNivel() {
  const basuras = document.querySelectorAll(".basura");
  basuras.forEach((basura) => {
    const p = playerNivel.getBoundingClientRect();
    const b = basura.getBoundingClientRect();
    if (
      p.left < b.right &&
      p.right > b.left &&
      p.top < b.bottom &&
      p.bottom > b.top
    ) {
      perderVida();
      basura.remove();
    }
  });
}

setInterval(detectarColisionesNivel, 100);

function moverPlayerNivel() {
  const carril = carriles[carrilActual];
  const top =
    carril.offsetTop + carril.offsetHeight / 2 - playerNivel.offsetHeight / 2;
  playerNivel.style.top = top + "px";
  playerNivel.style.left = xNivel + "px";
}

document.addEventListener("keydown", (event) => {
  if (!screens.nivel || screens.nivel.classList.contains("hidden")) return;

  playerNivel.classList.remove("up", "down", "left", "right");

  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      if (carrilActual > 0) {
        carrilActual--;
      }
      playerNivel.classList.add("up");
      break;
    case "ArrowDown":
    case "s":
    case "S":
      if (carrilActual < carriles.length - 1) {
        carrilActual++;
      }
      playerNivel.classList.add("down");
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      if (xNivel - 100 >= 0) {
        xNivel -= 100;
      }
      break;
    case "ArrowRight":
    case "d":
    case "D":
      if (xNivel + playerNivel.offsetWidth + 100 <= window.innerWidth) {
        xNivel += 100;
      }
      playerNivel.classList.add("right");
      break;
  }

  moverPlayerNivel();
});


// Basura / obstáculos del nivel (en los carriles)

let imagenes = [
    "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/basuras/BasuraGuineo.png",
  "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/basuras/BasuraBotella.png",
    "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/basuras/BasuraManzana.png",
    "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/basuras/BasuraCarne.png",
    "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/basuras/BasuraFunda.png",
    "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/basuras/BasuraFunda2.png",
    "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/basuras/BasuraFunda3.png",
    "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/basuras/BasuraLata.png"
];

function crearBasura(carril){

    if(carril.querySelector(".basura")) return;

    let basura = document.createElement("div");
    basura.classList.add("basura");

    let random = Math.floor(Math.random() * imagenes.length);
    basura.style.backgroundImage = `url(${imagenes[random]})`;

    carril.appendChild(basura);

    setTimeout(()=>{
        basura.remove();
    },4000);
}

// basura en cada carril
carriles.forEach(carril => {

    setInterval(()=>{
        crearBasura(carril);
    },2000 + Math.random()*2000);

});

// ===== BONUS (mismo movimiento que nivel: carriles + misma lógica y CS) =====
const playerBonus = document.getElementById("playerBonus");
const enemi = document.getElementById("coin");
const carrilesBonus = document.querySelectorAll("#screen-bonus .C");
let carrilActualBonus = 1;
let xBonus = 50;
const BtnExitBonus = document.getElementById("exitBonus");
const timeBonus = document.getElementById("timeBonus");
const scoreBonusEl = document.getElementById("scoreBonus");
let Xe = 100;
let Ye = 100;
let tiempoBonus = 0;
let intervaloBonus;
let pausadoBonus = false;
let scoresBonus = 0;
const bonusScreen = document.getElementById("bonusScreen");

BtnExitBonus.addEventListener("click", () => {
  pausarCuentaBonus();
  Inf.classList.remove("hidden");
  Inf.innerHTML = `<p>Realmente quieres salir?</p>
    <div class="BtnsIn">
      <button id="BtnSiExit"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/Botones/BtnSi.png"></button>
      <button id="BtnNo"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/Botones/BtnNo.png"></button>
    </div>`;
  document.getElementById("BtnSiExit").addEventListener("click", () => {
    Inf.classList.add("hidden");
    mostrarPantalla("menu");
  });
  document.getElementById("BtnNo").addEventListener("click", () => {
    reanudarCuentaBonus();
    Inf.classList.add("hidden");
  });
});

function moverPlayerBonus() {
  if (!carrilesBonus.length) return;
  const carril = carrilesBonus[carrilActualBonus];
  const top =
    carril.offsetTop + carril.offsetHeight / 2 - playerBonus.offsetHeight / 2;
  playerBonus.style.top = top + "px";
  playerBonus.style.left = xBonus + "px";
}

function iniciarBonus() {
  scoresBonus = obtenerPuntos();
  scoreBonusEl.textContent = scoresBonus;
  mostrarBonusTexto();
  iniciarCuentaBonus(30);
  carrilActualBonus = 1;
  xBonus = 50;
  moverPlayerBonus();
  Xe = Math.random() * (window.innerWidth - 100);
  Ye = Math.random() * (window.innerHeight - 100);
  updatePosition(enemi, Xe, Ye);
}

function mostrarBonusTexto() {
  bonusScreen.classList.add("show");
  setTimeout(() => {
    bonusScreen.classList.remove("show");
  }, 2000);
}

document.addEventListener("keydown", (event) => {
  if (!screens.bonus || screens.bonus.classList.contains("hidden")) return;

  playerBonus.classList.remove("up", "down", "left", "right");

  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      if (carrilActualBonus > 0) {
        carrilActualBonus--;
      }
      playerBonus.classList.add("up");
      break;
    case "ArrowDown":
    case "s":
    case "S":
      if (carrilActualBonus < carrilesBonus.length - 1) {
        carrilActualBonus++;
      }
      playerBonus.classList.add("down");
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      if (xBonus - 100 >= 0) {
        xBonus -= 100;
      }
      break;
    case "ArrowRight":
    case "d":
    case "D":
      if (xBonus + playerBonus.offsetWidth + 100 <= window.innerWidth) {
        xBonus += 100;
      }
      playerBonus.classList.add("right");
      break;
  }

  moverPlayerBonus();

  if (colition(playerBonus, enemi)) {
    Xe = Math.random() * (window.innerWidth - 100);
    Ye = Math.random() * (window.innerHeight - 100);
    updatePosition(enemi, Xe, Ye);
    scoresBonus += 10;
    updateScoreBonus();
    sumarPuntos(10);
  }
});

function colition(a, b) {
  const rectA = a.getBoundingClientRect();
  const rectB = b.getBoundingClientRect();
  return !(
    rectA.top > rectB.bottom ||
    rectA.bottom < rectB.top ||
    rectA.left > rectB.right ||
    rectA.right < rectB.left
  );
}

function updatePosition(q, x, y) {
  q.style.left = x + "px";
  q.style.top = y + "px";
}

function updateScoreBonus() {
  scoreBonusEl.textContent = scoresBonus;
}

function iniciarCuentaBonus(T) {
  clearInterval(intervaloBonus);
  tiempoBonus = T;
  timeBonus.textContent = "0:" + tiempoBonus;

  intervaloBonus = setInterval(() => {
    if (!pausadoBonus) {
      timeBonus.textContent = "0:" + tiempoBonus;
      if (tiempoBonus === 0) {
        clearInterval(intervaloBonus);
        enemi.style.display = "none";
        Inf.classList.remove("hidden");
        Inf.innerHTML = `<p id="tiempo">¡Tiempo!</p>
          <div class="btnsInf">
            <button id="BtnNivel" class="BtnsIn"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/ui/BtnSiguiente.png"></button>
            <button id="BtnStore" class="BtnsIn"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/ui/BtnTienda.png"></button>
            <button id="BtnMenu" class="BtnsIn"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/ui/BtnMenu.png></button>
          </div>`;
        document.getElementById("BtnNivel").addEventListener("click", () => {
          Inf.classList.add("hidden");
          mostrarPantalla("nivel");
          iniciarNivel();
        });
        document.getElementById("BtnStore").addEventListener("click", () => {
          Inf.classList.add("hidden");
          mostrarPantalla("store");
          iniciarStore();
        });
        document.getElementById("BtnMenu").addEventListener("click", () => {
          Inf.classList.add("hidden");
          mostrarPantalla("menu");
        });
      }
      tiempoBonus--;
    }
  }, 1000);
}

function pausarCuentaBonus() {
  pausadoBonus = true;
}

function reanudarCuentaBonus() {
  pausadoBonus = false;
}

// ===== STORE (basado en store.js) =====
const scoreStoreEl = document.getElementById("scoreStore");
const BtnCerrarStore = document.getElementById("BtnCerrarStore");
const BtnComprar = document.querySelector(".btn-comprar");

let productoSeleccionado = null;

// Helpers para skins guardadas
function obtenerSkinsCompradas() {
  const data = localStorage.getItem("skinsCompradas");
  return data ? JSON.parse(data) : [];
}

function guardarSkinsCompradas(lista) {
  localStorage.setItem("skinsCompradas", JSON.stringify(lista));
}

function skinEstaComprada(id) {
  return obtenerSkinsCompradas().includes(id);
}

function marcarSkinComoComprada(id) {
  const actuales = obtenerSkinsCompradas();
  if (!actuales.includes(id)) {
    actuales.push(id);
    guardarSkinsCompradas(actuales);
  }
}

function guardarSkinActual(id, imagenUrl) {
  localStorage.setItem("skinActualId", id);
  localStorage.setItem("skinActualImg", imagenUrl);
}

function aplicarSkinActual() {
  const img = localStorage.getItem("skinActualImg");
  const skinId = localStorage.getItem("skinActualId");

  if (!img) return;

  const cuerpoNivel = document.querySelector("#playerNivel .cuerpo");
  const cuerpoBonus = document.querySelector("#playerBonus .cuerpo");

  if (cuerpoNivel) cuerpoNivel.src = img;
  if (cuerpoBonus) cuerpoBonus.src = img;

  
//aqui se obtienen las patas
  // Obtener patas del nivel
const patasNivelDel = document.querySelectorAll("#playerNivel .pata-delantera");
const patasNivelTras = document.querySelectorAll("#playerNivel .pata-trasera");

// Obtener patas del bonus
const patasBonusDel = document.querySelectorAll("#playerBonus .pata-delantera");
const patasBonusTras = document.querySelectorAll("#playerBonus .pata-trasera");

// Si existe configuración para esa skin
if (patasPorSkin[skinId]) {
  const patas = patasPorSkin[skinId];

  patasNivelDel.forEach(p => p.src = patas.delantera);
  patasNivelTras.forEach(p => p.src = patas.trasera);

  patasBonusDel.forEach(p => p.src = patas.delantera);
  patasBonusTras.forEach(p => p.src = patas.trasera);
}

  
 // Ajustamos la posición de las patas predeterminada si es la skin "Tortuga Marina" 
  if (skinId === "Tortuga Marina") {
    patasNivelDel.forEach(p => p.style.top = "92px");
    patasNivelTras.forEach(p => p.style.top = "80px");

    patasBonusDel.forEach(p => p.style.top = "92px");
    patasBonusTras.forEach(p => p.style.top = "80px");

    return;
  }

  // Para otras skins, modificamos la posicion de las patas
  patasNivelDel.forEach(p => p.style.top = "140px");
  patasNivelTras.forEach(p => p.style.top = "140px");

  patasBonusDel.forEach(p => p.style.top = "140px");
  patasBonusTras.forEach(p => p.style.top = "140px");
}



//aqui se colocan las patas correspondientes
const patasPorSkin = {
  "Tortuga Marina": {
    delantera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/Pata%20Delantera.png",
    trasera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/Pata%20trasera.png"
  },
  "Tortuga Adivina": {
    delantera: "hhttps://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/Pata%20DelanteraAdivina.png",
    trasera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/PataTraseraAdivina.png"
  },
  "Tortuga de Hielo": {
    delantera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/PataDelanteraHielo.png",
    trasera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/PataTraseraHielo.png"
  },
  "Tortuga de Dulce": {
    delantera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/PataDelanteraDulce.png",
    trasera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/PataTraseraDulce.png"
  },
  "Tortuga de Joyas": {
    delantera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/PataDelanteraDulce.png",
    trasera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/PataTraseraDulce.png"
  },
  "Tortuga Galaxia": {
    delantera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/Pata%20DelanteraAdivina.png",
    trasera: "https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/skins/PataTraseraAdivina.png"
  }

  
};


function actualizarTextoBotonCompra() {
  if (!BtnComprar || !productoSeleccionado) return;
  if (skinEstaComprada(productoSeleccionado.id)) {
    BtnComprar.textContent = "Equipar tortuga";
  } else {
    BtnComprar.textContent = "Comprar Articulo";
  }
}

function iniciarStore() {
  scoreStoreEl.textContent = obtenerPuntos();
}

BtnCerrarStore.addEventListener("click", () => {
  mostrarPantalla("menu");
});

function verDetalles(nombre, descripcion, precio, imagenUrl) {
  document.getElementById("contenido-vacio").style.display = "none";
  document.getElementById("detalles-producto").style.display = "block";

  document.getElementById("titulo").innerText = nombre;
  document.getElementById("descripcion").innerText = descripcion;
  document.getElementById("precio").innerText = "Costo: " + precio;
  document.getElementById("foto-sidebar").src = imagenUrl;

  // Guardamos la info del producto seleccionado para usarla al comprar
  const costoNumerico = parseInt(precio);
  productoSeleccionado = {
    id: nombre,
    nombre,
    descripcion,
    precioTexto: precio,
    imagenUrl,
    costo: isNaN(costoNumerico) ? null : costoNumerico,
  };

  actualizarTextoBotonCompra();
}

document.querySelectorAll(".tarjeta-objeto").forEach((card) => {
  card.addEventListener("click", () => {
    verDetalles(
      card.dataset.nombre,
      card.dataset.desc,
      card.dataset.precio,
      card.dataset.img
    );
  });
});

// Lógica de compra en la tienda
if (BtnComprar) {
  BtnComprar.addEventListener("click", () => {
    if (!productoSeleccionado) {
      Inf.classList.remove("hidden");
      Inf.innerHTML = `<p>Primero selecciona una tortuga de la tienda.</p>`;
      return;
    }

    if (productoSeleccionado.costo === null) {
      Inf.classList.remove("hidden");
      Inf.innerHTML = `<p>No se pudo leer el precio de este artículo. Intenta con otro.</p>`;
      return;
    }

    // Si ya está comprada, este botón solo equipa la tortuga
    if (skinEstaComprada(productoSeleccionado.id)) {
      guardarSkinActual(productoSeleccionado.id, productoSeleccionado.imagenUrl);
      aplicarSkinActual();
      Inf.classList.remove("hidden");
      Inf.innerHTML = `<p>Has equipado la tortuga <strong>${productoSeleccionado.nombre}</strong>.</p>`;
      return;
    }

    const puntosActuales = obtenerPuntos();
    const costo = productoSeleccionado.costo;

    if (puntosActuales >= costo) {
      const nuevosPuntos = puntosActuales - costo;
      guardarPuntos(nuevosPuntos);
      scoreStoreEl.textContent = nuevosPuntos;

      marcarSkinComoComprada(productoSeleccionado.id);
      actualizarTextoBotonCompra();

      Inf.classList.remove("hidden");
      Inf.innerHTML = `<p>Compra realizada correctamente.<br><br>Has comprado: <strong>${productoSeleccionado.nombre}</strong>.<br>Monedas restantes: ${nuevosPuntos}.<br><br>¿Quieres equiparla ahora?</p>
        <div class="BtnsIn">
          <button id="BtnEquiparAhora"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/BtnEquipar.png"></button>
          <button id="BtnMasTarde"><img src="https://raw.githubusercontent.com/josuedejesus321-crypto/img/refs/heads/main/BtnGuardar.png"></button>
        </div>`;

      const btnEquiparAhora = document.getElementById("BtnEquiparAhora");
      const btnMasTarde = document.getElementById("BtnMasTarde");
      if (btnEquiparAhora) {
        btnEquiparAhora.addEventListener("click", (e) => {
          e.stopPropagation();
          guardarSkinActual(productoSeleccionado.id, productoSeleccionado.imagenUrl);
          aplicarSkinActual();
          Inf.classList.add("hidden");
        });
      }
      if (btnMasTarde) {
        btnMasTarde.addEventListener("click", (e) => {
          e.stopPropagation();
          Inf.classList.add("hidden");
        });
      }
    } else {
      const faltan = costo - puntosActuales;
      Inf.classList.remove("hidden");
      Inf.innerHTML = `<p>No se pudo realizar la compra.<br><br>Motivo: no tienes suficiente dinero.<br>Precio: ${costo} monedas.<br>Tienes: ${puntosActuales} monedas.<br>Te faltan: ${faltan} monedas.</p>`;
    }
  });
}

// ===== INICIO =====
document.addEventListener("DOMContentLoaded", () => {
  mostrarPantalla("menu");
  aplicarSkinActual();
});