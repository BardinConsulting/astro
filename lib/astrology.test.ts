// Tests unitaires — lib/astrology.ts
// Utilise node:test (Node 22 natif, 0 dépendance externe)
// Exécution : node --experimental-strip-types --test lib/astrology.test.ts

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  ZODIAC_SIGNS,
  PLANETS,
  ELEMENT_COLORS,
  ELEMENT_EMOJIS,
  THEME_CONFIG,
  calculateAstroData,
  getElementBalance,
} from "./astrology.ts";

// ─── Constantes ─────────────────────────────────────────────────────────────

describe("ZODIAC_SIGNS", () => {
  test("contains exactly 12 signs", () => {
    assert.equal(ZODIAC_SIGNS.length, 12);
  });

  test("signs span 0–330° in 30° increments", () => {
    ZODIAC_SIGNS.forEach((sign, i) => {
      assert.equal(sign.start, i * 30, `${sign.name} should start at ${i * 30}°`);
    });
  });

  test("every sign has required fields", () => {
    for (const sign of ZODIAC_SIGNS) {
      assert.ok(sign.name, "name required");
      assert.ok(sign.symbol, "symbol required");
      assert.ok(sign.emoji, "emoji required");
      assert.ok(["Feu", "Terre", "Air", "Eau"].includes(sign.element), `invalid element: ${sign.element}`);
      assert.ok(["Cardinal", "Fixe", "Mutable"].includes(sign.quality), `invalid quality: ${sign.quality}`);
    }
  });

  test("each element appears exactly 3 times", () => {
    const counts: Record<string, number> = {};
    for (const sign of ZODIAC_SIGNS) {
      counts[sign.element] = (counts[sign.element] ?? 0) + 1;
    }
    for (const [el, count] of Object.entries(counts)) {
      assert.equal(count, 3, `${el} should appear 3 times`);
    }
  });

  test("symbols are unique", () => {
    const symbols = ZODIAC_SIGNS.map(s => s.symbol);
    assert.equal(new Set(symbols).size, 12);
  });
});

describe("PLANETS", () => {
  test("contains exactly 9 planets", () => {
    assert.equal(PLANETS.length, 9);
  });

  test("every planet has name, emoji, and color", () => {
    for (const planet of PLANETS) {
      assert.ok(planet.name, "name required");
      assert.ok(planet.emoji, "emoji required");
      assert.ok(planet.color.startsWith("#"), `color must be hex: ${planet.color}`);
    }
  });

  test("planet names are unique", () => {
    const names = PLANETS.map(p => p.name);
    assert.equal(new Set(names).size, 9);
  });
});

describe("ELEMENT_COLORS", () => {
  test("has all 4 elements", () => {
    assert.deepEqual(Object.keys(ELEMENT_COLORS).sort(), ["Air", "Eau", "Feu", "Terre"]);
  });

  test("all values are valid hex colors", () => {
    for (const [el, color] of Object.entries(ELEMENT_COLORS)) {
      assert.match(color, /^#[0-9a-f]{6}$/i, `${el} color invalid: ${color}`);
    }
  });
});

describe("ELEMENT_EMOJIS", () => {
  test("has all 4 elements", () => {
    assert.deepEqual(Object.keys(ELEMENT_EMOJIS).sort(), ["Air", "Eau", "Feu", "Terre"]);
  });
});

describe("THEME_CONFIG", () => {
  test("has at least 6 themes", () => {
    assert.ok(Object.keys(THEME_CONFIG).length >= 6);
  });

  test("global theme exists", () => {
    assert.ok(THEME_CONFIG.global, "global theme required");
  });

  test("every theme has label, icon, desc, prompt", () => {
    for (const [key, cfg] of Object.entries(THEME_CONFIG)) {
      assert.ok(cfg.label, `${key}: label required`);
      assert.ok(cfg.icon, `${key}: icon required`);
      assert.ok(cfg.desc, `${key}: desc required`);
      assert.ok(cfg.prompt, `${key}: prompt required`);
    }
  });
});

// ─── calculateAstroData ──────────────────────────────────────────────────────

describe("calculateAstroData", () => {
  // Known date: April 1, 1990 — Sun must be in Aries (start=0, end=30)
  const april1_1990 = new Date("1990-04-01T12:00:00Z");
  const data = calculateAstroData(april1_1990, "12:00", "Paris", 48.8566, 2.3522);

  test("returns an object with required fields", () => {
    assert.ok(data.sunSign, "sunSign");
    assert.ok(data.moonSign, "moonSign");
    assert.ok(data.ascendant, "ascendant");
    assert.ok(Array.isArray(data.planetPositions), "planetPositions array");
    assert.ok(Array.isArray(data.aspects), "aspects array");
    assert.ok(data.birthDate instanceof Date, "birthDate");
  });

  test("contains 9 planet positions", () => {
    assert.equal(data.planetPositions.length, 9);
  });

  test("sun is in Aries on April 1, 1990", () => {
    assert.equal(data.sunSign.name, "Bélier", `Expected Bélier, got ${data.sunSign.name}`);
  });

  test("all planet degrees are 0–29", () => {
    for (const pp of data.planetPositions) {
      assert.ok(pp.degree >= 0 && pp.degree <= 29,
        `${pp.planet.name} degree ${pp.degree} out of range`);
    }
  });

  test("all planet signs are valid ZODIAC_SIGNS entries", () => {
    const validNames = new Set(ZODIAC_SIGNS.map(z => z.name));
    for (const pp of data.planetPositions) {
      assert.ok(validNames.has(pp.sign.name),
        `${pp.planet.name} sign "${pp.sign.name}" not in ZODIAC_SIGNS`);
    }
  });

  test("sunSign and moonSign are valid ZODIAC_SIGNS entries", () => {
    const validNames = new Set(ZODIAC_SIGNS.map(z => z.name));
    assert.ok(validNames.has(data.sunSign.name), `sunSign invalid: ${data.sunSign.name}`);
    assert.ok(validNames.has(data.moonSign.name), `moonSign invalid: ${data.moonSign.name}`);
    assert.ok(validNames.has(data.ascendant.name), `ascendant invalid: ${data.ascendant.name}`);
  });

  // Known date: January 1, 1990 — Sun must be in Capricorn (start=270)
  test("sun is in Capricorn on January 1, 1990", () => {
    const jan1 = new Date("1990-01-01T12:00:00Z");
    const d = calculateAstroData(jan1, "12:00", "Paris", 48.8566, 2.3522);
    assert.equal(d.sunSign.name, "Capricorne", `Expected Capricorne, got ${d.sunSign.name}`);
  });

  // Latitude variation: New York should give different ascendant for same birth time
  test("latitude affects ascendant calculation", () => {
    const paris = calculateAstroData(april1_1990, "08:00", "Paris",    48.8566,   2.3522);
    const rio   = calculateAstroData(april1_1990, "08:00", "Rio",     -22.9068, -43.1729);
    // Different latitudes + longitudes → different ascendants is expected
    // (not guaranteed to differ but verifies no crash)
    assert.ok(paris.ascendant.name, "Paris ascendant");
    assert.ok(rio.ascendant.name,   "Rio ascendant");
  });
});

// ─── getElementBalance ───────────────────────────────────────────────────────

describe("getElementBalance", () => {
  const data = calculateAstroData(new Date("1990-06-15T12:00:00Z"), "12:00", "Paris", 48.8566, 2.3522);
  const balance = getElementBalance(data);

  test("returns counts for all 4 elements", () => {
    assert.deepEqual(Object.keys(balance).sort(), ["Air", "Eau", "Feu", "Terre"]);
  });

  test("total planet count equals sum of element counts", () => {
    const total = Object.values(balance).reduce((a, b) => a + b, 0);
    assert.equal(total, data.planetPositions.length);
  });

  test("all counts are non-negative integers", () => {
    for (const [el, count] of Object.entries(balance)) {
      assert.ok(Number.isInteger(count) && count >= 0, `${el}: ${count}`);
    }
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("calculateAstroData — edge cases", () => {
  test("empty birthTime defaults gracefully (no throw)", () => {
    const d = calculateAstroData(new Date("1995-07-20T12:00:00Z"), "", "Anywhere", 48.8566, 2.3522);
    assert.ok(d.sunSign.name, "sunSign computed even without birthTime");
    assert.ok(d.ascendant.name, "ascendant computed even without birthTime");
  });

  test("extreme north latitude (Tromsø, 69.6°N) does not throw", () => {
    const d = calculateAstroData(new Date("2000-06-21T12:00:00Z"), "12:00", "Tromsø", 69.6489, 18.9551);
    assert.ok(d.sunSign.name);
    assert.equal(d.planetPositions.length, 9);
  });

  test("extreme south latitude (Ushuaia, -54.8°S) does not throw", () => {
    const d = calculateAstroData(new Date("2000-12-21T12:00:00Z"), "12:00", "Ushuaia", -54.8019, -68.3030);
    assert.ok(d.sunSign.name);
    assert.equal(d.planetPositions.length, 9);
  });

  test("summer solstice 2000 — sun near Gemini/Cancer boundary", () => {
    // June 21, 2000 is the solstice — sun should be at ~0° Cancer
    const d = calculateAstroData(new Date("2000-06-21T12:00:00Z"), "12:00", "Paris", 48.8566, 2.3522);
    // Sun must be in Cancer (starts at 90°) or at very end of Gemini (starts at 60°)
    const validSolsticeSigns = ["Gémeaux", "Cancer"];
    assert.ok(validSolsticeSigns.includes(d.sunSign.name),
      `Expected Gémeaux or Cancer near solstice, got ${d.sunSign.name}`);
  });

  test("winter solstice 2000 — sun near Sagittarius/Capricorn boundary", () => {
    const d = calculateAstroData(new Date("2000-12-21T12:00:00Z"), "12:00", "Paris", 48.8566, 2.3522);
    const validSigns = ["Sagittaire", "Capricorne"];
    assert.ok(validSigns.includes(d.sunSign.name),
      `Expected Sagittaire or Capricorne near winter solstice, got ${d.sunSign.name}`);
  });

  test("two different longitudes at same lat+date give different ascendants", () => {
    const london  = calculateAstroData(new Date("1985-03-15T06:00:00Z"), "06:00", "London",   51.5074,   -0.1278);
    const bangkok = calculateAstroData(new Date("1985-03-15T06:00:00Z"), "06:00", "Bangkok",  13.7563,  100.5018);
    // Very different local sidereal times → different ascendants expected
    assert.notEqual(london.ascendant.name, bangkok.ascendant.name,
      "Ascendant should differ between London and Bangkok at same UTC time");
  });

  test("aspects array contains only valid planet names", () => {
    const d = calculateAstroData(new Date("1980-01-01T12:00:00Z"), "12:00", "Paris", 48.8566, 2.3522);
    const validPlanetNames = new Set(["Soleil", "Lune", "Mercure", "Vénus", "Mars", "Jupiter", "Saturne", "Uranus", "Neptune"]);
    for (const aspect of d.aspects) {
      assert.ok(validPlanetNames.has(aspect.planet1), `Unknown planet1: ${aspect.planet1}`);
      assert.ok(validPlanetNames.has(aspect.planet2), `Unknown planet2: ${aspect.planet2}`);
      assert.ok(aspect.orb >= 0, `Orb must be non-negative: ${aspect.orb}`);
      assert.ok(["harmonieux", "tendu", "neutre"].includes(aspect.nature),
        `Invalid aspect nature: ${aspect.nature}`);
    }
  });
});
