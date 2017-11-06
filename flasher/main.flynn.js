const menu = require("graphical_menu");
Badge.URL = "https://youtu.be/dQw4w9WgXcQ";
// Get it all back to normal-ish
Badge.reset = () => {
 clearInterval();
 clearWatch();
 Bluetooth.removeAllListeners();
 LoopbackB.removeAllListeners();
 g.setRotation(0, 1);
 g.clear();
 g.flip();
};
Badge.drawCenter = s => {
  g.clear();
  s.split("\n").forEach((s, i) => g.drawString(s, (128-g.stringWidth(s))/2, i*6));
  g.flip();
};
// User-defined apps
Badge.apps = {};
// Main menu
Badge.menu = () => {
 function wait(cb) { m = { move: cb, select: cb }; }
 var mainmenu = {
  "": { "title": "-- DO IT --" },
  "Advertise": () => {
   Badge.drawCenter(`-- Advertising --`);
   g.drawString("Name: Badge " + NRF.getAddress().substr(-5).replace(":", ""), 0, 44);
   g.drawString("MAC: " + NRF.getAddress(), 0, 50);
   g.flip();
   wait(() => { NRF.sleep(); Badge.menu(); });
   NRF.wake();
  },
 };
 for (var i in Badge.apps) mainmenu[i]=Badge.apps[i];
 Badge.reset();

 var m = menu.list(g, mainmenu);
 setWatch(e => m.move(-1), BTNU, { repeat: 1, debounce: 50, edge: "rising" });
 setWatch(e => m.move(1), BTND, { repeat: 1, debounce: 50, edge: "rising" });
 setWatch(e => m.select(), BTNA, { repeat: 1, debounce: 50, edge: "rising" });
};

function onInit() {
  NRF.setAdvertising({},{name:"FlynnBadge"});
  NRF.nfcURL(Badge.URL);
  NRF.sleep();
  Badge.menu();
}
