/**
 * LexAnchor static smoke verification.
 * Runs in Node. Confirms every layer of the analysis flow is wired correctly.
 *
 *   ANTHROPIC_API_KEY=… node --import tsx scripts/smoke-lexanchor.ts
 */

import { promises as fs } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "..");
const failures: string[] = [];
const okMarks: string[] = [];

async function exists(rel: string): Promise<boolean> {
  try {
    await fs.access(resolve(root, rel));
    return true;
  } catch {
    return false;
  }
}

async function read(rel: string): Promise<string> {
  return fs.readFile(resolve(root, rel), "utf-8");
}

function check(label: string, condition: boolean, detail = "") {
  if (condition) okMarks.push(`✓ ${label}`);
  else failures.push(`✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

async function main(): Promise<void> {
  // 1) Presence
  check("analyze engine present", await exists("lib/analyze-engine.ts"));
  check("analyze API route", await exists("app/api/analyze/route.ts"));
  check("analyze result page", await exists("app/analyze/[id]/page.tsx"));
  check("save clause API", await exists("app/api/saved-clauses/route.ts"));
  check("export PDF API", await exists("app/api/export-pdf/route.ts"));
  check("follow-up API", await exists("app/api/follow-up/route.ts"));
  check("save-clause-button component", await exists("app/analyze/[id]/save-clause-button.tsx"));
  check("analyses migration", await exists("schema/analyses.sql"));
  check("saved_clauses migration", await exists("schema/saved_clauses.sql"));

  // 2) Surface area
  if (await exists("lib/analyze-engine.ts")) {
    const eng = await read("lib/analyze-engine.ts");
    check("analyze engine has runAnalysis", /export\s+async\s+function\s+runAnalysis/.test(eng));
    check("analyze engine has UPL_DIRECTIVE", /UPL_DIRECTIVE/.test(eng));
    check("analyze engine extracts JSON", /extractJSON|findBalancedJSON|tryParse/.test(eng));
  }
  if (await exists("app/api/saved-clauses/route.ts")) {
    const sc = await read("app/api/saved-clauses/route.ts");
    check("saved-clauses GET", /export\s+async\s+function\s+GET/.test(sc));
    check("saved-clauses POST", /export\s+async\s+function\s+POST/.test(sc));
    check("saved-clauses DELETE", /export\s+async\s+function\s+DELETE/.test(sc));
    check("saved-clauses auth-walled", /\.auth\.getUser/.test(sc));
  }
  if (await exists("app/api/export-pdf/route.ts")) {
    const pdf = await read("app/api/export-pdf/route.ts");
    check("export-pdf uses @react-pdf", /@react-pdf\/renderer/.test(pdf));
    check("export-pdf returns application/pdf", /application\/pdf/.test(pdf));
  }
  if (await exists("app/analyze/[id]/page.tsx")) {
    const page = await read("app/analyze/[id]/page.tsx");
    check("analyze page imports SaveClauseButton", /SaveClauseButton/.test(page));
    check("analyze page has Download PDF link", /export-pdf/.test(page));
  }

  // 3) Migration content
  if (await exists("schema/saved_clauses.sql")) {
    const sql = await read("schema/saved_clauses.sql");
    check("saved_clauses has user_id FK", /user_id\s+UUID.*REFERENCES\s+auth\.users/i.test(sql));
    check("saved_clauses RLS enabled", /ENABLE\s+ROW\s+LEVEL\s+SECURITY/i.test(sql));
  }

  // 4) Live engine round-trip
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { runAnalysis } = await import("../lib/analyze-engine.js");
      const sample = "This is a sample non-disclosure clause: 'Recipient agrees to maintain confidentiality for a period of 5 years from disclosure.'";
      const result = await runAnalysis({ documentText: sample, filename: "smoke-test.txt", documentType: "NDA" } as never);
      check("engine returns object", typeof result === "object" && result !== null);
    } catch (err) {
      failures.push(`✗ engine round-trip threw: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    okMarks.push("⊙ engine round-trip skipped (no ANTHROPIC_API_KEY)");
  }

  // Report
  console.log("");
  console.log("LexAnchor smoke results");
  console.log("───────────────────────");
  for (const o of okMarks) console.log(o);
  if (failures.length > 0) {
    console.log("");
    console.log("Failures:");
    for (const f of failures) console.log(f);
    process.exit(1);
  }
  console.log("");
  console.log(`${okMarks.length} checks passed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
