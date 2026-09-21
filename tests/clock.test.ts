// Regresión temporal — reloj del evento, timezone Argentina, límites PRE/DURANTE, mes.
// Correr: npm test   (node:test + type stripping, sin dependencias).
import test from "node:test";
import assert from "node:assert/strict";
import { parseNowParam, toEventWallClock, monthName, isWithinEvent } from "../src/lib/clock.ts";
import { data } from "../src/data/event.ts";

const START = data.event.start; // 2026-09-28
const END = data.event.end;     // 2026-10-02

test("parseNowParam: ISO con offset -03:00 → hora de Argentina", () => {
  const d = parseNowParam("2026-09-30T14:09:00-03:00")!;
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 8); // septiembre
  assert.equal(d.getDate(), 30);
  assert.equal(d.getHours(), 14);
  assert.equal(d.getMinutes(), 9);
});

test("parseNowParam: UTC (Z) se convierte a Argentina (−3h)", () => {
  const d = parseNowParam("2026-09-30T17:09:00Z")!; // 17:09 UTC = 14:09 ART
  assert.equal(d.getHours(), 14);
  assert.equal(d.getDate(), 30);
});

test("parseNowParam: naive (sin offset) = componentes en hora de Argentina", () => {
  const d = parseNowParam("2026-10-01T09:30")!;
  assert.equal(d.getMonth(), 9); // octubre
  assert.equal(d.getDate(), 1);
  assert.equal(d.getHours(), 9);
  assert.equal(d.getMinutes(), 30);
});

test("parseNowParam: sólo fecha e inválidos", () => {
  assert.equal(parseNowParam("2026-09-28")!.getDate(), 28);
  assert.equal(parseNowParam(""), null);
  assert.equal(parseNowParam("no-es-fecha"), null);
});

test("toEventWallClock: mismo instante en distinto huso → misma hora de pared ARG", () => {
  const inst = new Date("2026-09-30T17:09:00Z"); // 14:09 ART
  const w = toEventWallClock(inst);
  assert.equal(w.getHours(), 14);
  assert.equal(w.getDate(), 30);
});

test("monthName: septiembre y octubre", () => {
  assert.equal(monthName(8), "septiembre");
  assert.equal(monthName(9), "octubre");
});

test("Límite PRE/DURANTE contra el rango real del evento", () => {
  // 27/09 23:59 → ANTES
  assert.equal(isWithinEvent(parseNowParam("2026-09-27T23:59")!, START, END), false);
  // 28/09 00:00 → DURANTE
  assert.equal(isWithinEvent(parseNowParam("2026-09-28T00:00")!, START, END), true);
  // 30/09 → DURANTE
  assert.equal(isWithinEvent(parseNowParam("2026-09-30T12:00")!, START, END), true);
  // 01/10 → DURANTE (octubre)
  assert.equal(isWithinEvent(parseNowParam("2026-10-01T10:00")!, START, END), true);
  // 02/10 23:59 → DURANTE
  assert.equal(isWithinEvent(parseNowParam("2026-10-02T23:59")!, START, END), true);
  // 03/10 00:00 → sale de DURANTE (ANTES/POST)
  assert.equal(isWithinEvent(parseNowParam("2026-10-03T00:00")!, START, END), false);
});
