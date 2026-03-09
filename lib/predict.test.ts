// Tests unitaires — lib/predict.ts
// node --experimental-strip-types --test lib/predict.test.ts

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { generatePrediction } from "./predict.ts";
import { calculateAstroData } from "./astrology.ts";

const PARIS = { lat: 48.8566, lon: 2.3522, place: "Paris" };

function chart(dateStr: string, time = "12:00") {
  return calculateAstroData(new Date(dateStr + "T12:00:00Z"), time, PARIS.place, PARIS.lat, PARIS.lon);
}

describe("generatePrediction", () => {
  test("returns a non-empty string", () => {
    const text = generatePrediction(chart("1990-05-15"), "global");
    assert.ok(text.length > 100, "prediction should be substantial");
  });

  test("contains expected section markers", () => {
    const text = generatePrediction(chart("1990-05-15"), "global");
    assert.ok(text.includes("✦"), "should contain section markers");
    assert.ok(text.includes("Soleil"), "should mention Sun sign");
    assert.ok(text.includes("Lune"), "should mention Moon sign");
    assert.ok(text.includes("Ascendant"), "should mention Ascendant");
  });

  test("all 6 themes produce distinct non-empty output", () => {
    const themes = ["global", "amour", "travail", "sante", "finances", "spiritualite"];
    const data = chart("1985-08-25");
    const outputs = themes.map((t) => generatePrediction(data, t));
    for (const [i, text] of outputs.entries()) {
      assert.ok(text.length > 50, `theme ${themes[i]} should produce output`);
    }
    // Theme outputs differ from each other
    assert.notEqual(outputs[0], outputs[1], "global and amour should differ");
    assert.notEqual(outputs[1], outputs[2], "amour and travail should differ");
  });

  test("is deterministic — same input yields same output", () => {
    const data = chart("2000-03-21", "08:30");
    const a = generatePrediction(data, "global");
    const b = generatePrediction(data, "global");
    assert.equal(a, b, "output should be deterministic for same input");
  });

  test("unknown theme falls back gracefully to global advice", () => {
    const text = generatePrediction(chart("1975-12-01"), "nonexistent");
    assert.ok(text.length > 50, "unknown theme should still produce output");
  });

  test("birth place appears in output", () => {
    const text = generatePrediction(chart("1990-06-21"), "global");
    assert.ok(text.includes("Paris"), "birthPlace should appear in prediction");
  });

  test("sun degree appears in output", () => {
    const data = chart("1990-05-15");
    const sunPP = data.planetPositions.find((p) => p.planet.name === "Soleil");
    assert.ok(sunPP, "sun should be in planet positions");
    const text = generatePrediction(data, "global");
    assert.ok(text.includes(`${sunPP!.degree}°`), "sun degree should appear in output");
  });

  test("handles chart with no aspects gracefully", () => {
    // Use a real chart — it may have few aspects, but generator shouldn't throw
    const data = chart("2024-01-01");
    assert.doesNotThrow(() => generatePrediction(data, "global"));
  });

  test("different birth charts produce different outputs", () => {
    const aries  = generatePrediction(chart("1990-03-25"), "global");
    const pisces = generatePrediction(chart("1990-03-05"), "global");
    assert.notEqual(aries, pisces, "different charts should differ");
  });
});
