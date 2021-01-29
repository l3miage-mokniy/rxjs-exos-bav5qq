import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Subject } from "rxjs/internal/Subject";
import { fromEvent, merge } from "rxjs";
import { map, tap, bufferCount, bufferTime } from "rxjs/operators";

import "./style.css";
import { log } from "./utils";

/*----------------------------------------------------------------------------
 * Exemple 1
 * On montre que Subject et BehaviorSubject ont des comportement un peu différent.
 *   - Subject ne se souvient pas de la dernière valeur émise
 *   - BehaviorSubject s'en souvient et republie cette valeur auprès de chaque nouvel observateur qui s'abonne.
 */
const S = new Subject<number>();
const BS = new BehaviorSubject<number>(2);

log("exo1", "S.next(3)");
S.next(3);
log("exo1", "BS.next(3)");
BS.next(3);

log("exo1", "S subscribe");
S.subscribe(n => log("exo1", " S publie", n));
log("exo1", "BS subscribe");
BS.subscribe(n => log("exo1", "BS publie", n));

log("exo1", "S.next(4)");
S.next(4);
log("exo1", "BS.next(4)");
BS.next(4);

/*----------------------------------------------------------------------------
 * Exemple 2
 * On montre qu'il est possible de dériver des observables à partir
 *   - des événements du DOM
 *   - d'autres observables
 */
const bt1  = document.querySelector(".buttons .simple button") as HTMLButtonElement;
const out1 = document.querySelector(".buttons .simple output") as HTMLOutputElement;
let nb1 = 0;
// On dérive un observable à partir des cliques sur bt1 et on s'y abonne
fromEvent(bt1, "click").subscribe(() => (out1.textContent = `${++nb1}`));

//                      ---------------------------------
const bt2  = document.querySelector(".buttons .clicks3 button") as HTMLButtonElement;
const out2 = document.querySelector(".buttons .clicks3 output") as HTMLOutputElement;
let nb2 = 0;
// On dérive un observable à partir des cliques sur bt2
fromEvent(bt2, "click")
  .pipe(bufferCount(3))
  .subscribe(() => (out2.textContent = `${++nb2}`));

//                      ---------------------------------
const bt3  = document.querySelector(".buttons .nb1s button") as HTMLButtonElement;
const out3 = document.querySelector(".buttons .nb1s output") as HTMLOutputElement;
let nb3 = 0;
fromEvent(bt3, "click")
  .pipe(
    bufferTime(1000),
    map(L => L.length)
  )
  .subscribe(nb => (out3.textContent = `${nb}`));

/*----------------------------------------------------------------------------
 * Exemple 3
 * Un autre exemple avec les évéments pointeurs
 * (souris, touché, stylet)
 */
const divExo3 = document.querySelector(".exo3 > div");
const logExo3 = document.querySelector(".exo3 > pre");

const src = merge(
  fromEvent(divExo3, "pointerdown"),
  fromEvent(divExo3, "pointermove"),
  fromEvent(divExo3, "pointerup")
).pipe(
  map((evt: PointerEvent) => [ // On map chaque événement pointeur en un tableau de nombre
    evt.pointerId,
    evt.x,
    evt.y,
    evt.width,
    evt.height,
    evt.tiltX,
    evt.tiltY,
    100 * evt.pressure
  ]),
  map(L => L.map(Math.round)) // On map chacun de ces nombres pour avoir son arrondi
);

src.subscribe(L => {
  logExo3.textContent = JSON.stringify(L);
});
