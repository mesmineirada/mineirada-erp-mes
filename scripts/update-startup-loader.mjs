import fs from "node:fs";

const assets = fs.readFileSync("client/src/brandAssets.ts", "utf8");
const logo = assets.match(/export const EMBEDDED_LOGO = "([^"]+)";/)?.[1];
if (!logo) throw new Error("Logo embutida não encontrada");
let html = fs.readFileSync("client/index.html", "utf8");
html = html.replace(
  '<div class="startup-loader-mark">M</div>',
  `<div class="startup-loader-mark"><img src="${logo}" alt="Mineirada" /></div>`,
);
html = html.replace(
  '<span>Iniciando o sistema...</span><i',
  '<span>Iniciando o sistema...</span><small>Dica: use a busca lateral para encontrar rapidamente qualquer tela.</small><i',
);
fs.writeFileSync("client/index.html", html);
