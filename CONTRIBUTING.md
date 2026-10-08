# Contributing

Suggestions for papers, datasets, implementations and corrections are welcome. You can [open an issue](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose) without editing any files.

## Suggest a paper or resource

Include its title, year, DOI or project URL, the manufacturing task it addresses, and a sentence explaining what readers can learn or use. For code and data, link to the author’s or project’s release when available. Label a third-party implementation as such.

The catalogue covers semiconductor manufacturing: products and their structures, manufacturing processes, equipment, production and fab facilities. Assign a paper to the task defined by its main manufacturing objective or action. The same study may inform other tasks; its primary entry is counted once.

## Make a pull request

1. Add or correct the record in `data/papers.json`. Keep an existing paper’s `id` when updating its metadata. Use a DOI link when one exists; otherwise use a publisher, proceedings or preprint page.
2. For a dataset or implementation, edit `data/resources.json`. Set `paper_ids` to any associated catalogue entries and use task IDs from `data/taxonomy.json`.
3. Update `data/survey.json`’s `updated` date and add a short entry to the README’s Updates section when adding resources or papers.
4. Regenerate and check the reading lists with Python 3.10 or newer:

```sh
python scripts/build_catalogue.py
python scripts/build_catalogue.py --check
```

5. Include the source record and generated files in your pull request. Explain the change and link to its source.

The script builds the five topic pages, resource page, CSV, BibTeX and README navigation and counts from the JSON files. It checks duplicate identifiers, task assignments, required metadata, local links and image paths. GitHub Actions runs the same check on pull requests.

## Editorial conventions

- Preserve complete paper titles and distinguish preprints from journal or conference publications.
- Describe a method’s manufacturing purpose in plain language. Keep factual descriptions tied to the linked source.
- Keep reported metrics with the dataset, split and operating conditions needed to interpret them. Different evaluation setups belong in contextual comparisons rather than a shared ranking.
- Link to papers and dataset releases; keep source PDFs and dataset archives at their original locations.

The initial survey collection is recorded by `survey_baseline_ids` in `data/survey.json`. Add new papers to the live catalogue without changing that historical set. If a baseline record is found to duplicate another, explain the correction and update both together.
