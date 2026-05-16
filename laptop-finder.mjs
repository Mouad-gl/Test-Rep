/**
 * Apify-powered laptop finder
 * Searches Google Shopping across Morocco, Indonesia, and China
 * for RTX 4060+ laptops within a 9,000–10,000 MAD budget.
 *
 * Run:  APIFY_API_TOKEN=<your_token> node laptop-finder.mjs
 */

import ApifyClient from "apify-client";

// ── Budget & currency conversion (9,000–10,000 MAD) ────────────────────────
const BUDGET_MAD = { min: 9_000, max: 10_000 };

// Approximate exchange rates (MAD → local currency)
const CURRENCY = {
  MAD: { symbol: "MAD", rate: 1,        name: "Moroccan Dirham" },
  IDR: { symbol: "IDR", rate: 1_620,    name: "Indonesian Rupiah" },
  CNY: { symbol: "CNY", rate: 0.72,     name: "Chinese Yuan"      },
};

function madToLocal(mad, currency) {
  return Math.round(mad * CURRENCY[currency].rate);
}

// ── Search targets ──────────────────────────────────────────────────────────
const SEARCHES = [
  {
    location: "Casablanca, Morocco",
    country:  "MA",
    language: "fr",
    currency: "MAD",
    gl: "ma",
    hl: "fr",
    queries: [
      "laptop RTX 4060 16GB 1TB maroc prix",
      "ordinateur portable RTX 4060 32GB 1TB maroc",
      "gaming laptop RTX 4060 1TB RAM 16GB Casablanca",
    ],
  },
  {
    location: "Jakarta, Indonesia",
    country:  "ID",
    language: "id",
    currency: "IDR",
    gl: "id",
    hl: "id",
    queries: [
      "laptop RTX 4060 16GB 1TB jakarta",
      "laptop gaming RTX 4060 32GB 1TB murah jakarta",
      "laptop desain RTX 4060 16GB SSD 1TB indonesia",
    ],
  },
  {
    location: "Shanghai, China",
    country:  "CN",
    language: "zh",
    currency: "CNY",
    gl: "cn",
    hl: "zh",
    queries: [
      "笔记本电脑 RTX4060 16GB 1TB",
      "游戏本 RTX 4060 32GB 1TB 上海",
      "创意设计本 RTX4060 16GB 1TB",
    ],
  },
];

// ── Spec filter ─────────────────────────────────────────────────────────────
const REQUIRED = {
  gpu:     /rtx\s*(?:4060|4070|4080|4090)/i,
  storage: /1\s*tb|1000\s*gb/i,
  ram:     /(?:16|32)\s*gb/i,
};

function meetsSpecs(title = "", description = "") {
  const text = `${title} ${description}`;
  return (
    REQUIRED.gpu.test(text) &&
    REQUIRED.storage.test(text) &&
    REQUIRED.ram.test(text)
  );
}

// ── Scoring (higher = better value) ─────────────────────────────────────────
const BONUS = {
  rtx4070:   15,
  rtx4080:   25,
  rtx4090:   35,
  ram32:     10,
  oled:       8,
  i9_r9:      8,
  i7_r7:      5,
  thunderbolt: 3,
};

function scoreResult(title = "") {
  const t = title.toLowerCase();
  let score = 0;
  if (/rtx\s*4090/i.test(t)) score += BONUS.rtx4090;
  else if (/rtx\s*4080/i.test(t)) score += BONUS.rtx4080;
  else if (/rtx\s*4070/i.test(t)) score += BONUS.rtx4070;
  if (/32\s*gb/i.test(t)) score += BONUS.ram32;
  if (/oled/i.test(t)) score += BONUS.oled;
  if (/i9|ryzen\s*9/i.test(t)) score += BONUS.i9_r9;
  else if (/i7|ryzen\s*7/i.test(t)) score += BONUS.i7_r7;
  if (/thunderbolt/i.test(t)) score += BONUS.thunderbolt;
  return score;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    console.error("❌  Set APIFY_API_TOKEN before running this script.");
    process.exit(1);
  }

  const client = new ApifyClient({ token });
  const allResults = [];

  console.log("\n🔍  Laptop Finder — RTX 4060+ | 1TB | 16/32GB RAM");
  console.log(`📦  Budget: ${BUDGET_MAD.min.toLocaleString()}–${BUDGET_MAD.max.toLocaleString()} MAD`);
  console.log("🌍  Markets: Casablanca 🇲🇦  |  Jakarta 🇮🇩  |  Shanghai 🇨🇳\n");
  console.log("─".repeat(60));

  for (const target of SEARCHES) {
    const localMin = madToLocal(BUDGET_MAD.min, target.currency);
    const localMax = madToLocal(BUDGET_MAD.max, target.currency);

    console.log(`\n📍  ${target.location}`);
    console.log(
      `    Budget: ${localMin.toLocaleString()}–${localMax.toLocaleString()} ${target.currency}`
    );

    for (const query of target.queries) {
      console.log(`    🔎  Searching: "${query}"`);

      try {
        const run = await client.actor("apify/google-shopping-scraper").call({
          queries:        query,
          countryCode:    target.country,
          languageCode:   target.language,
          currency:       target.currency,
          maxPagesPerQuery: 3,
          isAdvancedResults: true,
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        for (const item of items) {
          const title       = item.title || item.name || "";
          const description = item.description || item.snippet || "";
          const priceRaw    = item.price || item.currentPrice || 0;
          const priceNum    = typeof priceRaw === "string"
            ? parseFloat(priceRaw.replace(/[^0-9.]/g, ""))
            : Number(priceRaw);

          // Convert local price back to MAD for budget check
          const priceMad = priceNum / CURRENCY[target.currency].rate;

          if (
            priceNum > 0 &&
            priceMad >= BUDGET_MAD.min &&
            priceMad <= BUDGET_MAD.max &&
            meetsSpecs(title, description)
          ) {
            allResults.push({
              location:    target.location,
              currency:    target.currency,
              title,
              priceLocal:  priceNum,
              priceMad:    Math.round(priceMad),
              url:         item.url || item.productUrl || item.link || "N/A",
              seller:      item.seller || item.merchant || item.storeName || "Unknown",
              rating:      item.rating || item.stars || null,
              score:       scoreResult(title),
            });
          }
        }
      } catch (err) {
        console.warn(`    ⚠️   Query failed: ${err.message}`);
      }
    }
  }

  // ── Deduplicate by title ──────────────────────────────────────────────────
  const seen = new Set();
  const unique = allResults.filter((r) => {
    const key = `${r.title.toLowerCase().slice(0, 60)}|${r.location}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // ── Sort: score DESC, then price ASC ─────────────────────────────────────
  unique.sort((a, b) => b.score - a.score || a.priceMad - b.priceMad);

  // ── Print results ─────────────────────────────────────────────────────────
  console.log("\n\n" + "═".repeat(60));
  console.log("🏆  TOP LAPTOPS IN YOUR BUDGET");
  console.log("═".repeat(60));

  if (unique.length === 0) {
    console.log(
      "\n😔  No exact matches found. Try expanding budget or relaxing specs."
    );
    console.log(
      "💡  Tip: run with broader queries or check sites like:\n" +
      "    • 🇲🇦  jumia.ma / electroplanet.ma / bestmark.ma\n" +
      "    • 🇮🇩  tokopedia.com / shopee.co.id / blibli.com\n" +
      "    • 🇨🇳  jd.com / tmall.com / taobao.com"
    );
  } else {
    unique.slice(0, 15).forEach((laptop, i) => {
      const stars  = laptop.rating ? ` ⭐ ${laptop.rating}` : "";
      const medal  = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
      console.log(`
${medal}  ${laptop.title}
    📍 ${laptop.location}
    💰 ${laptop.priceLocal.toLocaleString()} ${laptop.currency}  (~${laptop.priceMad.toLocaleString()} MAD)
    🏪 ${laptop.seller}${stars}
    🔗 ${laptop.url}
    📊 Value score: ${laptop.score}`);
    });
  }

  console.log("\n" + "─".repeat(60));
  console.log(`✅  Scan complete. ${unique.length} matching laptop(s) found.\n`);

  // ── Save JSON for further analysis ───────────────────────────────────────
  if (unique.length > 0) {
    const { writeFileSync } = await import("fs");
    const outPath = new URL("./laptop-results.json", import.meta.url).pathname;
    writeFileSync(outPath, JSON.stringify(unique, null, 2));
    console.log(`💾  Full results saved to laptop-results.json\n`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
