// Best-effort, dependency-free roster parser for the concierge upload preview.
//
// Parses CSV/TSV/TXT (delimited) and modern Excel (.xlsx/.xlsm — which are a
// ZIP of OOXML) entirely in the BROWSER using native DecompressionStream +
// DOMParser. Two wins: no PHI ever leaves the user's device just to show a
// preview, and we don't pull in a heavy/flagged spreadsheet dependency.
// Anything we can't parse here (legacy .xls, .pdf, .docx) throws so the UI
// falls back gracefully to "we'll map it on our end."
//
// CLIENT-ONLY: every function touches browser APIs and is called from event
// handlers in the wizard — never during SSR. The module has no top-level
// browser-API access, so importing it is server-safe.

const MAX_ROWS = 5000; // a generous cap so a giant file can't hang the tab

/** Parse a roster file into a 2-D array of cell strings. Throws if unsupported. */
export async function parseSpreadsheet(file: File): Promise<string[][]> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".csv") || lower.endsWith(".tsv") || lower.endsWith(".txt")) {
    const text = await file.text();
    return parseDelimited(text, lower.endsWith(".tsv") ? "\t" : ",");
  }
  if (lower.endsWith(".xlsx") || lower.endsWith(".xlsm")) {
    return parseXlsx(file);
  }
  throw new Error("unsupported-format");
}

/** Tolerant delimited-text parser (quoted cells, escaped "", CRLF). */
export function parseDelimited(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch === "\r") {
      /* swallow — paired with \n */
    } else {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

/* ----------------------------- XLSX (ZIP + OOXML) ----------------------------- */

async function parseXlsx(file: File): Promise<string[][]> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const entries = unzip(buf);

  // First worksheet — sheet1.xml is the overwhelmingly common case.
  let sheetName = "";
  for (const name of entries.keys()) {
    if (/^xl\/worksheets\/sheet\d+\.xml$/i.test(name)) {
      sheetName = name;
      break;
    }
  }
  if (!sheetName) throw new Error("no-worksheet");

  const getSheet = entries.get(sheetName);
  if (!getSheet) throw new Error("no-worksheet");
  const sheetXml = decodeUtf8(await getSheet());

  const getShared = entries.get("xl/sharedStrings.xml");
  const shared = getShared ? parseSharedStrings(decodeUtf8(await getShared())) : [];

  return parseSheetXml(sheetXml, shared);
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder("utf-8").decode(bytes);
}

type ZipEntries = Map<string, () => Promise<Uint8Array>>;

/** Minimal ZIP reader — central-directory driven, lazy per-entry inflate. */
function unzip(buf: Uint8Array): ZipEntries {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const entries: ZipEntries = new Map();

  // Locate End Of Central Directory (sig 0x06054b50), scanning from the end.
  let eocd = -1;
  const minStart = Math.max(0, buf.length - 22 - 65535);
  for (let i = buf.length - 22; i >= minStart; i--) {
    if (dv.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("bad-zip");

  const cdCount = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true); // central directory offset

  for (let n = 0; n < cdCount; n++) {
    if (p + 46 > buf.length || dv.getUint32(p, true) !== 0x02014b50) break;
    const method = dv.getUint16(p + 10, true);
    const compSize = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOff = dv.getUint32(p + 42, true);
    const name = decodeUtf8(buf.subarray(p + 46, p + 46 + nameLen));

    entries.set(name, async () => {
      // Local header: name len @ +26, extra len @ +28; data follows.
      const lNameLen = dv.getUint16(localOff + 26, true);
      const lExtraLen = dv.getUint16(localOff + 28, true);
      const dataStart = localOff + 30 + lNameLen + lExtraLen;
      const comp = buf.subarray(dataStart, dataStart + compSize);
      if (method === 0) return comp.slice(); // stored
      if (method === 8) return inflateRaw(comp); // deflate
      throw new Error("unsupported-zip-method");
    });

    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("deflate-raw");
  // Copy into a fresh ArrayBuffer-backed view so Blob's typing is satisfied
  // (a subarray is typed Uint8Array<ArrayBufferLike>, which Blob rejects).
  const part = new Uint8Array(bytes);
  const stream = new Blob([part]).stream().pipeThrough(ds);
  const ab = await new Response(stream).arrayBuffer();
  return new Uint8Array(ab);
}

function parseSheetXml(xml: string, shared: string[]): string[][] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const rowEls = Array.from(doc.getElementsByTagName("row")).slice(0, MAX_ROWS);
  const out: string[][] = [];
  for (const rowEl of rowEls) {
    const cells = rowEl.getElementsByTagName("c");
    const row: string[] = [];
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      const colIdx = colToIndex(c.getAttribute("r") || "");
      const t = c.getAttribute("t");
      let val = "";
      if (t === "s") {
        const idx = Number(c.getElementsByTagName("v")[0]?.textContent || "");
        val = shared[idx] ?? "";
      } else if (t === "inlineStr") {
        val = textOfT(c);
      } else {
        val = c.getElementsByTagName("v")[0]?.textContent || textOfT(c) || "";
      }
      if (colIdx >= 0) row[colIdx] = val;
      else row.push(val);
    }
    for (let i = 0; i < row.length; i++) if (row[i] == null) row[i] = "";
    out.push(row);
  }
  return out;
}

function parseSharedStrings(xml: string): string[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const sis = doc.getElementsByTagName("si");
  const out: string[] = [];
  for (let i = 0; i < sis.length; i++) out.push(textOfT(sis[i]));
  return out;
}

/** Concatenate all <t> descendants (handles rich-text runs). */
function textOfT(el: Element): string {
  const ts = el.getElementsByTagName("t");
  let s = "";
  for (let i = 0; i < ts.length; i++) s += ts[i].textContent || "";
  return s;
}

/** Spreadsheet column ref ("A1", "BC12") → zero-based column index. */
function colToIndex(ref: string): number {
  const m = ref.match(/^([A-Za-z]+)/);
  if (!m) return -1;
  const letters = m[1].toUpperCase();
  let n = 0;
  for (let i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
  return n - 1;
}
