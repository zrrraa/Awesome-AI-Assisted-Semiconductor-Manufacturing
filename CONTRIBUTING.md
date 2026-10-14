# 🤝 Contributing

Know a useful paper, dataset or implementation? [Open an issue](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose) with its title, source link and manufacturing task. Corrections are welcome too.

## Send a pull request

1. Add the paper to its main task in `papers/`, keeping the list newest first. Copy a neighboring entry’s format.
2. Add its full BibTeX entry to `references.bib`, using the same citation key as the paper’s anchor. Include every author, publication year, venue and a DOI, publisher or arXiv URL.
3. Add author-released code, project pages, models, datasets and arXiv links to `data/paper-resources.json`. Include the original paper page or official project URL that confirms the connection. Verified venue updates go in that file’s `venues` object. Conference badges use the conference year; journal and book badges use the publication year. When a conference year is missing from the venue name, add a verified `conference_year` with its source. Keep each version's own bibliography year; it drives entry sorting.
4. Read the paper and add its AI-stage labels and catalogue scope to `data/ai-stages.json`, following the [stage guide](docs/ai-stages.md).
5. Register a new study’s citation key in `data/research-groups.json` → `researchKeys`. For another version of an existing study, follow the version-linking instructions below. Set `updated` to the date of the collection’s data update (`YYYY-MM-DD`); the page displays this date automatically.
6. Run `python scripts/build_catalogue.py`. Commit the source changes and regenerated `papers/*.md`, `docs/assets/catalogue.js`, `docs/assets/coverage.csv` and `docs/assets/timeline.csv`. Authors, venue badges, resource links and category labels are generated together for the repository and project page. The reading lists use standard Shields.io `flat` badges; `scripts/reading_badges.py` builds their URLs. The README layout is maintained separately.

The five scopes and task links are on the [homepage](README.md#papers). Choose the task by the paper’s manufacturing objective or action.

## Entry format

```markdown
- <a id="surname2026keyword"></a>***Full paper title***<br>
```

The build command fills the remaining lines from the bibliography and reviewed metadata. It preserves the title and task placement. Long author lists use an expandable section.

## Conference and journal versions

Review a predecessor's full text for its method, evidence and manufacturing relevance before adding it. A journal's extension statement establishes a relationship; each collected version still needs its own quality assessment and stage labels.

Keep collected conference and journal publications as separate entries with their own metadata. In `data/publication-history.json`, record the conference entry’s `key` and the source establishing the relationship under the journal key. The builder generates links in both directions, whether the papers are counted together or separately.

Decide statistical grouping separately by reading the papers’ research questions, methods and evidence. Papers with distinct contributions stay in `data/research-groups.json` → `researchKeys`, even when one explicitly extends the other. For versions counted as one study, choose a representative, normally the fuller journal paper, and map only the other key to it in `countedWith`. That entry receives a **Trends: Counted with …** marker linking to the representative. A relationship link alone never changes the count.

Research trends, the heatmap and CSV downloads use the representatives’ publication years, scopes and stage labels. When replacing a representative, move its old key from `researchKeys` to `countedWith` and point it to the new key; the total stays the same, though its year or classifications may change. Chart links open the records used for the count.

Resource links are optional. Link to the paper’s own releases; dependencies and baseline implementations belong in the resource guide. Keep reported results with the dataset and evaluation conditions needed to interpret them.

Automated checks verify local links, unique entries and matching bibliography keys. You can also run them locally:

```sh
python .github/scripts/check_catalogue.py
python scripts/build_catalogue.py --check
python scripts/test_publication_counting.py
```
