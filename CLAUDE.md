@AGENTS.md
# Dataset Analyzer — Bootcamp Tool

## What this is
A web app for data analysis bootcamp students to upload a dataset and receive a viability score (1–10) for their course project. The score is generated automatically based on weighted criteria evaluated client-side.

## Deploy target
**Vercel** — everything must run on the client. No backend, no API routes, no server-side processing.

## Tech stack
- **Next.js** (App Router)
- **Tailwind CSS**
- **shadcn/ui** — for cards, progress bars, badges, and other UI components
- **PapaParse** — CSV parsing
- **xlsx** — Excel file parsing

---

## Scoring system

The app evaluates uploaded datasets across 12 criteria grouped in 4 dimensions. Final score = weighted average mapped to a 1–10 scale.

### Dimensions and weights

| Dimension | Weight | Criteria (individual weight) |
|---|---|---|
| 📊 Data quality | 30% | Completeness 12%, Consistency 10%, Duplicates 8% |
| 📐 Structure | 25% | Adequate size 10%, Column variety 8%, Clear target column 7% |
| 🔍 Analytical potential | 30% | Answerable questions 12%, Variable relationships 10%, Visualization potential 8% |
| 📁 Practical aspects | 15% | Accessible format 5%, Documentation/context 5%, License & ethics 5% |

### Scoring logic per criterion

**Completeness (12%):** Score based on % of non-null values across all columns.
- ≥95% complete → 10
- 85–94% → 7
- 70–84% → 4
- <70% → 1

**Duplicates (8%):** Based on % of duplicate rows.
- <1% → 10
- 1–5% → 7
- 5–15% → 4
- >15% → 1

**Adequate size (10%):** Based on row count.
- 1,000–100,000 rows → 10
- 500–999 or 100,001–500,000 → 7
- 100–499 → 4
- <100 or >500,000 → 1

**Column variety (8%):** Based on presence of numeric, categorical, and date columns.
- All 3 types present → 10
- 2 types → 6
- 1 type only → 3

**Consistency (10%):** Inferred from column type uniformity (check for mixed types per column).
- All columns consistent → 10
- 1–2 inconsistent columns → 6
- 3+ inconsistent → 2

**Clear target column (7%):** Heuristic — look for columns named label, target, outcome, category, class, score, result, or similar. If found → 9. Otherwise → 5 (neutral, since this is hard to auto-detect reliably).

**Answerable questions (12%):** Based on number of columns and row count diversity.
- ≥8 columns and ≥1,000 rows → 10
- 5–7 columns or 500–999 rows → 7
- 3–4 columns → 4
- <3 columns → 1

**Variable relationships (10%):** Based on presence of at least 2 numeric columns (allows correlation analysis).
- ≥3 numeric columns → 10
- 2 numeric columns → 6
- 1 numeric column → 3
- 0 numeric columns → 1

**Visualization potential (8%):** Based on having at least one categorical + one numeric column, or a date column.
- Date + numeric → 10
- Categorical + numeric → 8
- Only one of either → 4
- Neither → 1

**Accessible format (5%):** Detected from file extension at upload.
- .csv → 10
- .xlsx or .xls → 9
- .json → 7
- Other → 2

**Documentation/context (5%):** Ask the user a simple yes/no question before analysis: "Does your dataset have a data dictionary or description?" Yes → 10, No → 3.

**License & ethics (5%):** Ask the user: "Is this dataset publicly available and free of sensitive personal data (PII)?" Yes → 10, Unsure → 5, No → 1.

---

## Visual identity

### Color palette
Warm and energetic. Use these as the primary accent palette throughout the app:

- **Primary accent:** `#F97316` (orange-500)
- **Secondary accent:** `#EF4444` (red-500)
- **Highlight:** `#FACC15` (yellow-400)
- **Background (dark base):** `#0F0F0F` or `#111111`
- **Surface:** `#1A1A1A` or `#1C1C1C`
- **Border:** `#2A2A2A`
- **Text primary:** `#F5F5F5`
- **Text muted:** `#A1A1A1`

Score bars, badges, and the final score display should use a gradient from yellow → orange → red based on score value.

### Typography
- **Display / score numbers:** monospace font (e.g. `font-mono` in Tailwind) — reinforces the data analysis aesthetic
- **Body:** system sans-serif via Tailwind default

### Professor avatars (pixel art)
Three SVG pixel art avatars of the bootcamp professors will be provided separately. They should be placed in `/public/avatars/` as:
- `profesor1.svg`
- `profesor2.svg`
- `profesor3.svg`

The avatars act as a "jury panel" on the results screen. Each professor reacts to the final score:

| Score range | Reaction label | Suggested expression |
|---|---|---|
| 8–10 | "¡Excelente dataset!" | Happy / thumbs up |
| 5–7 | "Puede mejorar" | Neutral / thinking |
| 1–4 | "Necesita trabajo" | Skeptical / concerned |

Show all 3 avatars on the results screen with their reaction label below. The reaction is the same for all 3 since it's based on the same score — this is a stylistic/fun choice, not a real individual evaluation.

---

## App flow

1. **Landing screen** — App name, short description, professor avatars visible in the header or hero
2. **Upload screen** — Drag & drop or file picker. Accepts `.csv`, `.xlsx`, `.xls`, `.json`
3. **Quick questions** — Two yes/no questions (documentation and license, as described above)
4. **Analysis screen** — Show loading state while parsing and scoring
5. **Results screen** — Display:
   - Final score (large, monospace, color-coded)
   - Score interpretation badge (Excelente / Aceptable / Necesita mejoras / No viable)
   - Breakdown by dimension (4 cards with progress bars)
   - Individual criterion scores (collapsible or in a table)
   - Professor jury panel reacting to the score
   - Recommendations section — short tips for improving the dataset based on lowest-scoring criteria
   - "Analizar otro dataset" button to restart

---

## Score interpretation bands

| Score | Label | Color |
|---|---|---|
| 8.0–10 | Excelente — listo para el proyecto | green |
| 6.0–7.9 | Aceptable — con pequeños ajustes | yellow |
| 4.0–5.9 | Necesita mejoras significativas | orange |
| 1.0–3.9 | No viable para el proyecto | red |

---

## Notes for Claude Code
- All file parsing happens in the browser — do not send files to any server
- The two manual questions (documentation and license) should appear as a simple form step before analysis runs
- Keep the UI responsive — students may use laptops or tablets
- The app should feel fun and slightly gamified (the jury panel helps with this), but remain clear and informative
- Avatars are SVG files — import them as Next.js Image components or inline SVG
- No authentication, no database, no persistence needed