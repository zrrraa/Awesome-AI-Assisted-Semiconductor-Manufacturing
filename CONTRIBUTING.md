# 🤝 Contributing

Know a useful paper, dataset or implementation? [Open an issue](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose) with its title, source link and manufacturing task. Corrections are welcome too.

## Send a pull request

1. Add the paper to its main task in `papers/`, keeping the list newest first. Copy a neighboring entry’s format.
2. Include the full title, year, authors and venue. Link to the DOI, publisher or author’s preprint, and label preprints clearly.
3. Add its BibTeX entry to `references.bib`, using the same citation key as the paper’s anchor. For a dataset or implementation, update `RESOURCES.md` and link to the original project.

The five scopes and task links are on the [homepage](README.md#papers). Choose the task by the paper’s manufacturing objective or action.

## Entry format

```markdown
- <a id="surname2026keyword"></a>**[Full paper title](https://doi.org/...)**<br>
  2026 · Surname et al. · *Venue* · [Code](https://github.com/owner/project)
```

Code and data links are optional. Prefer original releases and label third-party implementations. Keep reported results with the dataset and evaluation conditions needed to interpret them.

Automated checks verify local links, unique entries and matching bibliography keys. You can also run them locally:

```sh
python .github/scripts/check_catalogue.py
```
