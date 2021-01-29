export type EXO = "exo1";
export function log(exo: EXO, ...L: (string | number)[]): void {
  const ol = document.querySelector(`ol.${exo}`);
  console.log(...L);
  if (ol) {
    const li = document.createElement("li");
    li.innerText = L.join(" ");
    ol.appendChild(li);
  }
}