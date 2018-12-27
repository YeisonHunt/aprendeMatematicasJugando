//// Dados - prototipo
// MIT License
//Copyright (c) 2019 Juan Carlos Garmendia Serey

(function() {
  "use strict";

  let app = {
    dev: true,
    started: false,
    status: "stop",
    stoped: false, // ;( )
    luck: 0,
    points: 0,
    luckIntervalGain: 1,
    luckClickGain: 1,
    options: false,
    ventanas: [],
    upgrades: {
      0: {
        nombre: "Suertecita",
        cantidad: 1,
        costo: 10,
        suerteMas: 1
      },
      1: {
        nombre: "Chuntería",
        cantidad: 0,
        costo: 200,
        suerteMas: 6
      },
      2: {
        nombre: "Good Cave",
        cantidad: 0,
        costo: 3000,
        suerteMas: 36
      }
    }
  };

  /*****************************************************************************
   *
   * Event listeners
   *
   ****************************************************************************/
  // Dado
  document.getElementById("dice").addEventListener("click", function() {
    app.control();
    app.gainLuck(app.luckClickGain);
    app.touchAnim();
  });

  // Opciones
  document.getElementById("option_0").addEventListener("click", function() {
    app.showVentana(0);
    app.drawAllUpgrades();
  });

  document.getElementById("option_1").addEventListener("click", function() {
    app.showVentana(1);
  });

  document.getElementById("option_2").addEventListener("click", function() {
    app.showVentana(2);
  });

  // Ventanas
  let volverButton = document.getElementsByClassName("volver-btn");
  for (let i = 0; i < volverButton.length; i++) {
    volverButton[i].addEventListener("click", function() {
      app.showVentana(3);
    });
  }

  /*****************************************************************************
   *
   * Methods
   *
   ****************************************************************************/

  app.getMain = function() {
    const MAIN = document.getElementById("main");
    return MAIN;
  };

  app.getPlayer = function() {
    const PLAYER = document.getElementById("player");
    return PLAYER;
  };

  app.getDice = function() {
    const DICE = document.getElementById("dice");
    return DICE;
  };

  app.getContadorLuck = function() {
    const LUCK = document.getElementById("luck");
    return LUCK;
  };

  app.getVentanas = function() {
    const VENTANAS = [];
    let ventana_0 = document.getElementById("upgrades");
    let ventana_1 = document.getElementById("dlc");
    let ventana_2 = document.getElementById("misterio");
    VENTANAS.push(ventana_0);
    VENTANAS.push(ventana_1);
    VENTANAS.push(ventana_2);
    return VENTANAS;
  };

  app.getUpgrades = () => {
    const UPGRADES = document.getElementById("upgrades-container");
    return UPGRADES;
  };

  app.getUpgradeId = upg_id => {
    const UP_ID = app.upgrades[upg_id];
    return UP_ID;
  };

  app.getUpgradeContainer = (upg_id_cont) => {
    const UPCONT = document.getElementById(upg_id_cont);
    return UPCONT;
  };

  app.initVentanas = function() {
    console.log("init ventanas");
    let VENTANAS = app.getVentanas();
    if (VENTANAS) {
      for (let i = 0; i < VENTANAS.length; i++) {
        app.ventanas.push(VENTANAS[i]);
      }
    }
  };

  app.control = function() {
    console.log("click");
    let done = false;
    let plyr = app.getPlayer();
    if (plyr.readyState === 4 && plyr.currentTime === 0) {
      plyr.play();
      app.status = "play";
      if (!app.started) {
        app.initVentanas();
        app.setAllUpgrades();
        app.update(30);
        app.started = true;
      }
      app.playAnim();
      console.log(app.status);
    }

    if (app.status === "play" && !done && !app.stoped) {
      app.stoped = true;
      console.log("trigger de stop");
      setTimeout(stopReset, 21000);
      done = true;
    }

    // handlers
    const pause = () => {
      return plyr.pause();
    };

    function stopReset() {
      pause();
      plyr.currentTime = 0;
      app.status = "stop";
      app.stopAnim();
      app.stoped = false;
      console.log(app.status);
    }
  };

  app.playAnim = function() {
    console.log("animar");
    let dice = app.getDice();
    let dclass = "animated";
    dice.classList.toggle(dclass, app.status === "play");
    if (dice.classList.contains("start")) {
      dice.classList.remove("start");
    }
  };

  app.stopAnim = function() {
    console.log("parar anim");
    let dice = app.getDice();
    let dclass = "paused";
    dice.classList.toggle(dclass, app.status === "stop");
    dice.classList.remove("animated");
  };

  app.touchAnim = function() {
    console.log("touch");
    let dice = app.getDice();
    // cómo tener 2 transforms diferentes (seguir rotando + cambio de escala)!! afffff
    dice.animate([{ transform: "scale(0.85)" }, { transform: "scale(1)" }], {
      duration: 300,
      composite: "add",
      delay: 0
    });
  };

  app.gainLuck = function(i) {
    if (this.luck <= 100000000) {
      this.luck += i;
    } else {
      console.log("mucha luck!!!!");
    }
  };

  app.drawLuck = function() {
    let luck = app.getContadorLuck();
    let luckValue = this.luck;
    let luckStr = `Suerte : ${luckValue}`;
    luck.textContent = luckStr;
  };

  app.drawUpgrade = (upg_id) => {
    let up = app.getUpgradeId(upg_id);
    let name = up.nombre;
    let cant = up.cantidad;
    let cost = up.costo;

    let nameSpan = document.getElementById(`up_nom_${upg_id}`);
    nameSpan.textContent = name;

    let cantSpan = document.getElementById(`up_cant_${upg_id}`);
    cantSpan.textContent = cant;

    let costSpan = document.getElementById(`up_cost_${upg_id}`);
    costSpan.textContent = 'S' + cost;
  };

  app.setUpgrade = (upg_id, upg_id_cont) => {
    console.log("setUpgrade");
    let up_cont = app.getUpgradeContainer(upg_id_cont);
    let up = app.getUpgradeId(upg_id);
    let name = up.nombre;
    let cant = up.cantidad;
    let cost = up.costo;
    let smas = up.suerteMas;
    console.log(name + " " + cant + " " + cost + " " + smas);

    let nameSpan = document.createElement('span');
    nameSpan.id = `up_nom_${upg_id}`;
    nameSpan.textContent = name;

    let cantSpan = document.createElement('span');
    cantSpan.id = `up_cant_${upg_id}`;
    cantSpan.textContent = cant;

    let costSpan = document.createElement('span');
    costSpan.id = `up_cost_${upg_id}`;
    costSpan.textContent = 'S' + cost;

    let smasSpan = document.createElement('span');
    smasSpan.id = `up_smas_${upg_id}`;
    smasSpan.textContent = '+' + smas;

    let btn = document.createElement('button');
    btn.type = 'button';
    btn.id = `up_btn_${upg_id}`;
    btn.classList.add('upg_btn');
    btn.textContent = 'Subir';
    btn.addEventListener("click", function() {
      app.comprarUpgrade(upg_id);
      app.drawAllUpgrades();
    });
  
    up_cont.appendChild(nameSpan);
    up_cont.appendChild(cantSpan);
    up_cont.appendChild(costSpan);
    up_cont.appendChild(smasSpan);
    up_cont.appendChild(btn);
  };

  app.setAllUpgrades = () => {
    console.log("setAllUpgrades");
    const length = Object.keys(app.upgrades).length;
    for (let i = 0; i < length; i++) {
      app.setUpgrade(i, `upgrade_${i}`);
    }
  };

  app.drawAllUpgrades = () => {
    console.log("drawAllUpgrades");
    const length = Object.keys(app.upgrades).length;
    for (let i = 0; i < length; i++) {
      app.drawUpgrade(i);
    }
  };

  app.update = function(fps) {
    // intervalo para dibuajr y ganar luck
    let i = 0;
    let inter = setInterval(() => {
      app.drawLuck();
      i++;
      // gain luck
      if (i >= 10) {
        app.gainLuck(app.luckIntervalGain);
        i = 0;
      } else if (i >= 999999) {
        i = 0;
      }
    }, 1000 / fps);

    // intervalo para ver optiones
    let interForOptions = setInterval(() => {
      if (app.options === true) {
        clearInterval(interForOptions);
      } else {
        app.checkForOptions(30);
      }
    }, 1000 / fps);
  };

  app.showOptions = function() {
    if (app.options === false) {
      console.log("show options");
      let options = document.getElementsByClassName("option");
      for (let i = 0; i < options.length; i++) {
        options[i].removeAttribute("hidden");
      }
      app.options = true;
    }
  };

  app.checkForOptions = function(luckValue) {
    console.log("checkForOptions");
    if (app.luck >= luckValue) {
      app.showOptions();
    }
  };

  app.showVentana = function(v) {
    const VENTANAS = app.ventanas;
    switch (v) {
      case 0:
        VENTANAS[0].style.display = "flex";
        break;
      case 1:
        VENTANAS[1].style.display = "flex";
        break;
      case 2:
        VENTANAS[2].style.display = "flex";
        break;
      case 3:
        // volver a la principal
        for (let i = 0; i < VENTANAS.length; i++) {
          VENTANAS[i].style.display = "none";
        }
        break;
      default:
        // volver a la principal
        for (let i = 0; i < VENTANAS.length; i++) {
          VENTANAS[i].style.display = "none";
        }
    }
  };

  app.activarUpgrade = upg_id => {
    if (upg_id >= 0) {
      let up = app.getUpgradeId(upg_id);
      console.log("activando upgrade: " + up.nombre);
      let sumaSuerte = up.cantidad * up.suerteMas;
      app.luckIntervalGain = sumaSuerte;
      console.log("nuevo luckIntervalGain: " + app.luckIntervalGain);
    }
  };

  app.subirCosto = (upg_id, sumaCosto) => {
    if (upg_id >= 0 && sumaCosto >= 1) {
      let up = app.getUpgradeId(upg_id);
      console.log("subiendo costo: " + up.nombre + " " + up.costo);
      let costoMas = up.costo * sumaCosto;
      up.costo += costoMas;
    }
    console.log("nuevo costo: " + app.upgrades[upg_id].costo);
  };

  app.gastarLuck = c => {
    if (app.luck >= c) {
      console.log("gastando luck: -" + c);
      app.luck -= c;
    }
  };

  app.subirCantidad = (upg_id, cant) => {
    if (upg_id >= 0 && cant >= 1) {
      let up = app.getUpgradeId(upg_id);
      console.log("subiendo cantidad de: " + up.nombre);
      up.cantidad += cant;
    }
    console.log("nueva cantidad: " + app.upgrades[upg_id].cantidad);
  };

  app.comprarUpgrade = upg_id => {
    if (upg_id >= 0) {
      let up = app.getUpgradeId(upg_id);
      if (app.luck >= up.costo) {
        console.log("comprando upgrade: " + up.nombre);
        app.gastarLuck(up.costo);
        app.subirCantidad(upg_id, 1);
        app.subirCosto(upg_id, 2);
        app.activarUpgrade(upg_id);
      } else {
        console.log("luck insuficiente!");
      }
    }
  };

  /// !!! SECCION TEST   
  
  ///

  /*****************************************************************************
   *
   * Service Worker
   *
   ****************************************************************************/
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").then(function() {
      console.log("Service Worker Registered");
    });
  }

  ///
})();


  /*****************************************************************************
   *
   * TODO
   *
   ****************************************************************************/
  // probar -webkit
  // local storage
  // diseño
  // style y recursos
  // refact
  // manifest
  // seo
  // boton malajuzga
  // opciones sonido
  // opciones dev
  // testing jajaajjajh
  // desprototipar
  // reprototipar
  // iterar
  // ;( )

