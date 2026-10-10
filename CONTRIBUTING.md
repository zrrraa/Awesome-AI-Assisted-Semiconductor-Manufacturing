# 🤝 Contributing

Know a useful paper, dataset or implementation? [Open an issue](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose) with its title, source link and manufacturing task. Corrections are welcome too.

## Send a pull request

1. Add the paper to its main task in `papers/`, keeping the list newest first. Copy a neighboring entry’s format.
2. Add its full BibTeX entry to `references.bib`, using the same citation key as the paper’s anchor. Include every author, publication year, venue and a DOI, publisher or arXiv URL.
3. Add additional paper versions and author-released code, project pages, models or datasets to `data/paper-resources.json`. Include the original paper page or official project URL that confirms the connection. Verified venue updates go in that file’s `venues` object; venue badges use the publication record.
4. Add the paper’s reviewed AI-stage labels and catalogue scope to `data/ai-stages.json`, following the [stage guide](docs/ai-stages.md).
5. Run `python scripts/build_catalogue.py`. Commit the regenerated `papers/*.md`, `docs/assets/catalogue.js`, `docs/assets/coverage.csv` and `docs/assets/timeline.csv`. Authors, venue badges, resource chips and category labels are generated together for the repository and project page.

The five scopes and task links are on the [homepage](README.md#papers). Choose the task by the paper’s manufacturing objective or action.

## Entry format

```markdown
- <a id="surname2026keyword"></a>**Full paper title**<br>
```

The build command fills the remaining lines from the bibliography and reviewed metadata. It preserves the title and task placement. Long author lists use an expandable section.

Resource links are optional. Link to the paper’s own releases; dependencies and baseline implementations belong in the resource guide. Keep reported results with the dataset and evaluation conditions needed to interpret them.

Automated checks verify local links, unique entries and matching bibliography keys. You can also run them locally:

```sh
python .github/scripts/check_catalogue.py
python scripts/build_catalogue.py --check
```
