const mdiIcons = require("./mdiIcons.json");

// names = mdiIcons.map(icon => icon.name);
authors = Array.from(new Set(mdiIcons.map(icon => icon.author)));
const bottom = 0;

names = mdiIcons
  // .filter((icon, i) => i > bottom && i < bottom + 100)
  .map(icon => icon.name);

console.log(JSON.stringify(names));
