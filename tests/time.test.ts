// Regresión — estados de actividad: fin real (endTime), fin inferido por próxima en la
// misma ubicación (tope 60min), relevo, ubicación distinta, simultáneas, sin hora.
import test from "node:test";
import assert from "node:assert/strict";
import { activityStatus, estimatedEnd } from "../src/lib/time.ts";

const day = "2026-09-30";
const N = (h: number, m: number) => new Date(2026, 8, 30, h, m, 0);
const A = (o: any) => ({ id: o.id, name: o.id, day, category: "encuentro", areaId: "", ...o });

test("ejemplo del pedido @14:09 (mismo lugar gimnasio)", () => {
  const all = [A({ id: "13", start: "13:00", areaId: "gim" }), A({ id: "14", start: "14:00", areaId: "gim" }), A({ id: "15", start: "15:00", areaId: "gim" })];
  assert.equal(activityStatus(all[1], N(14, 9), all), "ahora");
  assert.equal(activityStatus(all[2], N(14, 9), all), "proxima");
  assert.equal(activityStatus(all[0], N(14, 9), all), "finalizada"); // fin inferido 14:00
});

test("relevo misma ubicación: fin = inicio de la próxima (no 60min)", () => {
  const all = [A({ id: "a", start: "14:00", areaId: "sum" }), A({ id: "b", start: "14:30", areaId: "sum" })];
  assert.equal(estimatedEnd(all[0], all).getHours() * 60 + estimatedEnd(all[0], all).getMinutes(), 14 * 60 + 30);
  assert.equal(activityStatus(all[0], N(14, 35), all), "finalizada");
  assert.equal(activityStatus(all[1], N(14, 35), all), "ahora");
});

test("endTime real posterior manda sobre la inferencia", () => {
  const all = [A({ id: "c", start: "13:00", end: "16:00", areaId: "arena" })];
  assert.equal(activityStatus(all[0], N(14, 9), all), "ahora");
});

test("sin próxima en la ubicación → tope 60min", () => {
  const all = [A({ id: "d", start: "16:00", areaId: "solo" })];
  assert.equal(activityStatus(all[0], N(16, 30), all), "ahora");
  assert.equal(activityStatus(all[0], N(17, 5), all), "finalizada");
});

test("una futura en OTRA ubicación no corta la actividad", () => {
  const all = [A({ id: "e", start: "14:00", areaId: "gim" }), A({ id: "f", start: "14:20", areaId: "cieda" })];
  assert.equal(activityStatus(all[0], N(14, 40), all), "ahora");
});

test("'lugar' exacto tiene prioridad sobre areaId", () => {
  const all = [A({ id: "g", start: "14:00", areaId: "prim", lugar: "SUM Primaria" }), A({ id: "h", start: "14:30", areaId: "prim", lugar: "CIEDA Primaria" })];
  assert.equal(activityStatus(all[0], N(14, 45), all), "ahora"); // 14:30 es otro lugar, no la corta
});

test("actividades simultáneas no se cortan entre sí", () => {
  const all = [A({ id: "i", start: "14:00", areaId: "gim" }), A({ id: "j", start: "14:00", areaId: "gim" })];
  assert.equal(activityStatus(all[0], N(14, 30), all), "ahora");
  assert.equal(activityStatus(all[1], N(14, 30), all), "ahora");
});

test("borde exclusivo: en el instante del fin ya es finalizada", () => {
  const all = [A({ id: "k", start: "13:00", areaId: "gim" }), A({ id: "l", start: "14:00", areaId: "gim" })];
  // fin inferido de k = 14:00; a las 14:00 exactas → finalizada (no ahora)
  assert.equal(activityStatus(all[0], N(14, 0), all), "finalizada");
  assert.equal(activityStatus(all[1], N(14, 0), all), "ahora"); // inicio <= now
});

test("minuto anterior al inicio → proxima; minuto exacto → ahora", () => {
  const all = [A({ id: "m", start: "15:00", areaId: "gim" })];
  assert.equal(activityStatus(all[0], N(14, 59), all), "proxima");
  assert.equal(activityStatus(all[0], N(15, 0), all), "ahora");
});

test("actividad sin hora (muestra libre) → libre", () => {
  const all = [A({ id: "n", areaId: "sec", allWeek: true })];
  assert.equal(activityStatus(all[0], N(14, 0), all), "libre");
});
