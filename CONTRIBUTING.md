# 🤝 Contributing

Know a useful paper, dataset or implementation? [Open an issue](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose) with its title, source link and manufacturing task. Corrections are welcome too.

## Send a pull request

1. Add the paper to its main task in `papers/`, keeping the list newest first. Copy a neighboring entry’s format.
2. Add its full BibTeX entry to `references.bib`, using the same citation key as the paper’s anchor. Include every author, publication year, venue and a DOI, publisher or arXiv URL.
3. Add author-released code, project pages, models, datasets and arXiv links to `data/paper-resources.json`. Include the original paper page or official project URL that confirms the connection. Verified venue updates go in that file’s `venues` object. Conference badges use the conference year; journal and book badges use the publication year. When a conference year is missing from the venue name, add a verified `conference_year` with its source. Keep each version's own bibliography year; it drives entry sorting.
4. Add the paper’s reviewed AI-stage labels and catalogue scope to `data/ai-stages.json`, following the [stage guide](docs/ai-stages.md).
5. Run `python scripts/build_catalogue.py`. Commit the regenerated `papers/*.md`, `docs/assets/catalogue.js`, `docs/assets/coverage.csv` and `docs/assets/timeline.csv`. Authors, venue badges, resource links and category labels are generated together for the repository and project page. The reading lists use standard Shields.io `flat` badges; `scripts/reading_badges.py` builds their URLs. The README layout is maintained separately.

The five scopes and task links are on the [homepage](README.md#papers). Choose the task by the paper’s manufacturing objective or action.

## Entry format

```markdown
- <a id="surname2026keyword"></a>***Full paper title***<br>
```

The build command fills the remaining lines from the bibliography and reviewed metadata. It preserves the title and task placement. Long author lists use an expandable section.

## Conference and journal versions

Keep collected conference and journal versions as separate entries with their own metadata. When they represent one study in the survey, map the additional version to the cited representative in `data/survey-selection.json` → `relatedVersions`. Add the conference entry's `key` to its verified relationship in `data/publication-history.json`. The builder generates links in both directions.

Research trends use only `researchKeys`, counting a merged study once in the cited version's publication year. The heatmap, all yearly chart modes and CSV downloads share this population; chart links open that same filtered set. A new version must not change these totals. Papers with distinct contributions discussed separately remain separate research records. Each linked version needs its own entry; a link beneath another paper does not replace it.

Resource links are optional. Link to the paper’s own releases; dependencies and baseline implementations belong in the resource guide. Keep reported results with the dataset and evaluation conditions needed to interpret them.

Automated checks verify local links, unique entries and matching bibliography keys. You can also run them locally:

```sh
python .github/scripts/check_catalogue.py
python scripts/build_catalogue.py --check
```
