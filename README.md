# n8n-nodes-google-scholar-case-law-api

An [n8n](https://n8n.io/) community node that searches US state and federal case law on Google Scholar and pulls full case details. It is backed by the [Google Scholar Case Law API](https://apify.com/johnvc/google-scholar-case-law?fpr=9n7kx3) on [Apify](https://apify.com?fpr=9n7kx3) and bills per result, so there are no subscriptions and no minimums.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Output](#output) · [Example workflows](#example-workflows) · [Pricing](#pricing) · [Resources](#resources)

## What it does

Give the node a search query and it returns one item per case-law result with the case title, name, court, snippet, and a direct Google Scholar link. You can restrict the search by court, decision year, and language, and optionally fetch full case details (parties, dates, citations, cited cases) for every result or for known case IDs. It also works as an **AI Agent tool**, so an agent can do legal research on demand. This is great for **legal research**, citation tracking, and docket monitoring.

- Search US state and federal case law by query
- Filter by court code, decision year range, and language
- Pull full case detail by case ID, or for every search result
- Choose how much data to return per result: Simplified, Raw, or Selected Fields

## Installation

Follow the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-google-scholar-case-law-api` as the npm package name.
4. Agree to the risks of using community nodes, then select **Install**.

After it installs, the **Google Scholar Case Law** node appears in the nodes panel.

> n8n Cloud only allows verified community nodes. Until this node is verified, install it on a self-hosted n8n instance.

## Credentials

You need a free [Apify account](https://apify.com?fpr=9n7kx3) and an API token.

1. Sign in to the [Apify Console](https://console.apify.com?fpr=9n7kx3).
2. Open **Settings > Integrations** and copy your **Personal API token**.
3. In n8n, create a new **Apify API** credential and paste the token.
4. Use the credential's **Test** button to confirm it works.

The node also supports **Apify OAuth2** if you prefer to connect that way.

## Operations

**Case > Search** returns case-law results for a query and/or case IDs.

| Parameter | Description |
| --- | --- |
| Search Query | The case-law query, for example `patent infringement`. Provide a query, Case IDs, or both. |
| Case IDs | Comma-separated Google Scholar case IDs to pull full detail for. |
| Max Results | Maximum number of search results (up to 100). |
| Court Codes | Comma-separated Google Scholar court codes (e.g. `158` for the Supreme Court). |
| Year From / Year To | Restrict the decision year range. |
| Language Code | Two-letter interface language code. |
| Sort by Date / Exclude Citations | Sort newest-first; drop bare citation entries. |
| Fetch Details for Search Results | Pull full case detail for every result. |
| Output | How much data to return: Simplified, Raw, or Selected Fields. |

## Output

Each result is returned as its own n8n item. The **Output** parameter lets you choose how much to return:

- **Simplified** (default): a compact object with `title`, `name`, `court`, `snippet`, `link`, `caseId`, `resultId`, `resultType`, and `position`. This mode is also used automatically when the node runs as an AI Agent tool, to keep responses small.
- **Raw**: every field the API returns for each result, using the original field names below.
- **Selected Fields**: pick exactly which fields to include.

### Fields (Raw and Selected Fields)

| Field | Type | Description |
| --- | --- | --- |
| `result_type` | string | `search_result`, `case_detail`, or `error` |
| `result_id` | string | Opaque search-result identifier, useful for de-duping |
| `position` | integer | 1-indexed position within the search page |
| `title` | string | Case title, including reporter citation when available |
| `name` | string | Short party names, for example `Brown v. Board of Education` |
| `court_name` | string | Court that decided the case |
| `snippet` | string | Short text preview from the search result |
| `link` | string | Direct Google Scholar URL for the opinion |
| `case_id` | string | Google Scholar case identifier, used to fetch detail |
| `publication_info` | object | Author, source, and date metadata |
| `dates` | array | Decision-related dates with type labels |
| `short_citations` | array | Short case reference strings |
| `case_numbers` | array | Docket numbers |
| `cited_cases` | array | Cases referenced by this opinion |
| `fetched_at` | string | ISO 8601 timestamp of when the row was produced |

## Example workflows

### 1. Track new opinions on a topic

1. **Schedule Trigger** (weekly).
2. **Google Scholar Case Law**: Search Query `data privacy`, Sort by Date on.
3. **Filter**: keep results newer than your last run, then notify by email.

### 2. Pull full detail for known cases

1. **Set**: a list of `case_id` values.
2. **Google Scholar Case Law**: paste them into Case IDs.
3. **Postgres**: store `name`, `court_name`, and `dates` per case.

### 3. Let an AI Agent do legal research

1. **AI Agent** node.
2. Attach **Google Scholar Case Law** as a tool.
3. Ask "Find recent Supreme Court cases on qualified immunity." The agent calls the node (in Simplified mode) and returns matching cases.

## Pricing

This node calls the [Google Scholar Case Law API](https://apify.com/johnvc/google-scholar-case-law?fpr=9n7kx3) on Apify, which is billed **pay-per-result**, with no subscription and no minimums. Apify also includes a free monthly usage tier that covers typical volumes. See the [Actor page](https://apify.com/johnvc/google-scholar-case-law?fpr=9n7kx3) for current rates.

## Resources

- [Google Scholar Case Law API on Apify](https://apify.com/johnvc/google-scholar-case-law?fpr=9n7kx3)
- [npm package](https://www.npmjs.com/package/n8n-nodes-google-scholar-case-law-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify n8n integration guide](https://docs.apify.com/platform/integrations/n8n)

## License

[MIT](LICENSE.md)
