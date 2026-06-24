// Reliability suite for CredTek's deterministic credentialing logic.
// Zero dependencies — runs on Node's built-in test runner:
//   npm test       (node --test --experimental-strip-types tests/)
//
// These functions decide whether a real provider's NPI is valid, what
// credential we map them to, and how we parse an uploaded roster. A bug
// here writes wrong data on a real customer's file, so they're tested.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isValidNpi,
  npiCheckDigit,
  mapNppesCredential,
  mapRosterColumns,
} from "../app/_components/intakeData.ts";
import { parseDelimited } from "../app/_components/parseRoster.ts";

/* ---------------- NPI Luhn validation ---------------- */

test("npiCheckDigit computes the CMS check digit", () => {
  assert.equal(npiCheckDigit("123456789"), 3); // → 1234567893
  assert.equal(npiCheckDigit("199273933"), 8); // → 1992739338
});

test("isValidNpi accepts well-formed NPIs", () => {
  assert.equal(isValidNpi("1234567893"), true);
  assert.equal(isValidNpi("1992739338"), true);
  assert.equal(isValidNpi("123-456-7893"), true); // strips formatting
});

test("isValidNpi rejects bad NPIs", () => {
  assert.equal(isValidNpi("1234567890"), false); // wrong check digit
  assert.equal(isValidNpi("123"), false); // too short
  assert.equal(isValidNpi("12345678901"), false); // too long
  assert.equal(isValidNpi("abcd567893"), false); // non-numeric
  assert.equal(isValidNpi(""), false);
});

/* ---------------- NPPES credential mapping ---------------- */

test("mapNppesCredential normalizes common credential strings", () => {
  assert.equal(mapNppesCredential("M.D."), "MD");
  assert.equal(mapNppesCredential("MD"), "MD");
  assert.equal(mapNppesCredential("MBBS"), "MD");
  assert.equal(mapNppesCredential("DO"), "DO");
  assert.equal(mapNppesCredential("CRNA"), "CRNA");
  assert.equal(mapNppesCredential("PharmD"), "PharmD");
});

test("mapNppesCredential maps APRN/NP variants to NP", () => {
  assert.equal(mapNppesCredential("FNP-BC"), "NP");
  assert.equal(mapNppesCredential("APRN"), "NP");
  assert.equal(mapNppesCredential("PMHNP-BC"), "NP");
});

test("mapNppesCredential maps PA and therapy/behavioral credentials", () => {
  assert.equal(mapNppesCredential("PA-C"), "PA");
  assert.equal(mapNppesCredential("Psy.D."), "PsyD");
  assert.equal(mapNppesCredential("LCSW"), "LCSW");
  assert.equal(mapNppesCredential("LICSW"), "LCSW");
  assert.equal(mapNppesCredential("DPT"), "PT");
});

test("mapNppesCredential handles the ambiguous PhD via taxonomy", () => {
  assert.equal(mapNppesCredential("Ph.D.", "Clinical Psychologist"), "PhD");
  assert.equal(mapNppesCredential("Ph.D.", "Physics Researcher"), "");
});

test("mapNppesCredential falls back to taxonomy when credential is blank", () => {
  assert.equal(mapNppesCredential("", "Social Worker"), "LCSW");
  assert.equal(mapNppesCredential("", "Marriage & Family Therapist"), "LMFT");
});

test("mapNppesCredential returns empty for the unknown rather than guessing", () => {
  assert.equal(mapNppesCredential("ZZZ"), "");
  assert.equal(mapNppesCredential(null), "");
  assert.equal(mapNppesCredential(undefined), "");
});

/* ---------------- Roster column auto-mapping ---------------- */

test("mapRosterColumns recognizes standard + messy headers", () => {
  const m = mapRosterColumns([
    "First Name",
    "Last Name",
    "NPI #",
    "License State",
    "Random Notes",
  ]);
  assert.deepEqual(
    m.map((c) => c.key),
    ["first_name", "last_name", "npi", "primary_state", null],
  );
});

test("mapRosterColumns is case- and separator-insensitive", () => {
  const m = mapRosterColumns(["caqh id", "DEA Number", "e-mail"]);
  assert.deepEqual(
    m.map((c) => c.key),
    ["caqh_id", "dea", "email"],
  );
});

/* ---------------- Delimited (CSV/TSV) parsing ---------------- */

test("parseDelimited handles basic rows", () => {
  assert.deepEqual(parseDelimited("a,b,c\n1,2,3", ","), [
    ["a", "b", "c"],
    ["1", "2", "3"],
  ]);
});

test("parseDelimited respects quotes, escaped quotes, and CRLF", () => {
  assert.deepEqual(parseDelimited('"x,y",z', ","), [["x,y", "z"]]);
  assert.deepEqual(parseDelimited('"a""b",c', ","), [['a"b', "c"]]);
  assert.deepEqual(parseDelimited("a,b\r\nc,d", ","), [
    ["a", "b"],
    ["c", "d"],
  ]);
});
