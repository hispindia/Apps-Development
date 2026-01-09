const jsonfile = require("jsonfile");
const manifest = require("./manifest.webapp.json");

// FOR WEBAPP DHIS2
manifest.icons = {
  16: "fav.png",
  48: "fav.png",
  128: "fav.png",
  144: "fav.png",
};

jsonfile.writeFileSync("./dist/manifest.webapp", manifest);
