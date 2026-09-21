// Regresión — parser/normalizador de la planilla WEB: filas válidas, visible_web,
// campos vacíos, filas malformadas (no pueden tumbar todo el dataset), muestras.
import test from "node:test";
import assert from "node:assert/strict";
import { csvToActivities } from "../src/data/normalize.ts";

const HEADER = "id,dia,inicio,fin,actividad,lugar,areaId,nivel,curso,categoria,descripcion_publica,visible_web";

test("fila válida se parsea y normaliza (categoría/nivel/hora)", () => {
  const csv = HEADER + "\n" + `a1,2026-09-30,9:00,,Show de Quimica,Hölters Arena,gimnasio,Secundario,3° año,Ciencia,Experimentos,TRUE`;
  const acts = csvToActivities(csv);
  assert.equal(acts.length, 1);
  assert.equal(acts[0].start, "09:00");      // zero-pad
  assert.equal(acts[0].category, "ciencia");  // lower/sin acento
  assert.equal(acts[0].level, "secundaria");
  assert.equal(acts[0].lugar, "Hölters Arena");
});

test("visible_web: FALSE oculta; vacío o TRUE muestra", () => {
  const csv = [HEADER,
    `v1,2026-09-30,10:00,,Visible TRUE,X,gim,,,,,TRUE`,
    `v2,2026-09-30,10:00,,Visible vacío,X,gim,,,,,`,
    `v3,2026-09-30,10:00,,Oculta,X,gim,,,,,FALSE`,
  ].join("\n");
  const ids = csvToActivities(csv).map(a => a.id);
  assert.deepEqual(ids.sort(), ["v1", "v2"]);
});

test("fila malformada (pocas columnas / basura) se saltea, el resto sobrevive", () => {
  const csv = [HEADER,
    `ok1,2026-09-30,09:00,,Buena 1,X,gim,,,,,TRUE`,
    `,,,,,`,                                   // fila casi vacía
    `basura sin comas ni estructura`,          // fila rota
    `,2026-09-30,09:00,,Sin id,X,gim,,,,,TRUE`,// sin id → se saltea
    `ok2,2026-09-30,25:99,,Buena 2 hora rara,X,gim,,,raro,,TRUE`, // hora inválida → start undefined, no rompe
  ].join("\n");
  const acts = csvToActivities(csv);
  const ids = acts.map(a => a.id).sort();
  assert.deepEqual(ids, ["ok1", "ok2"]);
  assert.equal(acts.find(a => a.id === "ok2")!.start, undefined); // hora inválida no explota
});

test("campo opcional vacío no rompe", () => {
  const csv = HEADER + "\n" + `c1,2026-09-30,09:00,,Sin curso ni desc,X,gim,,,Teatro,,TRUE`;
  const a = csvToActivities(csv)[0];
  assert.equal(a.curso, undefined);
  assert.equal(a.description, undefined);
  assert.equal(a.category, "teatro");
});

test("día no-fecha (vacío / 'Toda la semana') → muestra allWeek", () => {
  const csv = [HEADER,
    `m1,Toda la semana,,,Muestra permanente,Patio,sec,,,Arte,,TRUE`,
    `m2,,,,Otra muestra,Patio,sec,,,Arte,,TRUE`,
  ].join("\n");
  const acts = csvToActivities(csv);
  assert.equal(acts.length, 2);
  assert.ok(acts.every(a => a.allWeek === true && a.day === ""));
});

test("columna de fin acepta 'endTime' además de 'fin'", () => {
  const csv = "id,dia,inicio,endTime,actividad,areaId,visible_web\n" +
    `e1,2026-09-30,14:00,16:00,Con endTime,arena,TRUE`;
  const a = csvToActivities(csv)[0];
  assert.equal(a.end, "16:00");
});
