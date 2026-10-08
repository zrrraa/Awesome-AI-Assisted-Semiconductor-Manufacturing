# Catalogue data

[Home](../README.md) · [Contributing](../CONTRIBUTING.md)

| File | Contents |
|---|---|
| `papers.json` | Editable paper records: identity, authors, publication information, primary task and citation fields |
| `taxonomy.json` | Five manufacturing scopes and nineteen tasks, with a plain-language question for each task |
| `resources.json` | Public dataset, benchmark and implementation links, descriptions and associated papers |
| `survey.json` | Survey information, catalogue update date and IDs in the original survey collection |
| `papers.csv` | Generated spreadsheet-friendly paper index |

The collection grows from the manufacturing studies analyzed in the companion survey. Each paper has one primary task for navigation. General background references are outside this task catalogue.

The public catalogue contains bibliographic information and links. Full texts remain with the publishers, authors or repositories linked from each record.

Run `python scripts/build_catalogue.py` from the repository root after editing the JSON records. Bibliographic details such as volume, issue, pages and publication notes are stored under `bibtex_extra` and preserved in the generated `references.bib`.
