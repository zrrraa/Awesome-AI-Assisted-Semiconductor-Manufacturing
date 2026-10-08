# Awesome AI-Assisted Semiconductor Manufacturing

Papers, datasets and code for applying AI to semiconductor manufacturing: understanding defects, improving processes, maintaining tools and coordinating a fab.

<!-- BEGIN COUNTS -->
**475 papers · 5 manufacturing scopes · 19 tasks**

Catalogue updated: 2026-10-08.
<!-- END COUNTS -->

[Browse papers](#browse-by-manufacturing-task) · [Datasets & code](RESOURCES.md) · [Getting started](docs/getting-started.md) · [BibTeX](references.bib) · [CSV](data/papers.csv) · [Contribute](CONTRIBUTING.md)

## About the survey

This repository accompanies **From Perception to Autonomy: A Survey on AI-Assisted Semiconductor Manufacturing**.

Rui Zhong, Zhikun Huang, Xue Zhang, Qian Jin, Yu Li, Qi Sun, Dawei Gao, Yi Song, Hanming Wu and Cheng Zhuo.

Zhejiang University · Zhejiang ICsprout Semiconductor Co., Ltd.

The survey follows AI from interpreting manufacturing observations to predicting outcomes, explaining problems, planning actions and learning through execution. It connects these stages to the objects and decisions that matter in a factory. The paper link will be added when the preprint is available.

The initial catalogue contains the survey’s 475 manufacturing studies. New papers and resources are welcome as the field develops.

## Where to start

| Your interest | Start here |
|---|---|
| Recognize wafer patterns or locate defects | [Wafer patterns](papers/artifacts.md#a1), [local defects](papers/artifacts.md#a2) |
| Try a public dataset or implementation | [Datasets and code](RESOURCES.md) |
| Predict quality from process measurements | [Virtual metrology](papers/processes.md#p2), [quality and yield](papers/artifacts.md#a4) |
| Optimize mask patterns or process settings | [Computational lithography](papers/artifacts.md#a3), [process development](papers/processes.md#p3) |
| Keep tools healthy and available | [Fault diagnosis](papers/equipment.md#e1), [maintenance](papers/equipment.md#e2) |
| Improve delivery, transport or resource use | [Production](papers/production.md), [fab facilities](papers/fabs.md) |

New to manufacturing? The [getting-started guide](docs/getting-started.md) explains the terminology and connects familiar AI problems to factory decisions.

## Browse by manufacturing task

Papers are grouped by their main manufacturing task and listed newest first. Each title links to its DOI, proceedings page or preprint. Code and data links appear alongside entries where they have been added.

<!-- BEGIN TASKS -->
| Scope | Task | Manufacturing question | Papers |
|---|---|---|---:|
| Artifacts | [A1 · Wafer spatial-pattern analysis](papers/artifacts.md#a1) | What does the spatial pattern of failing dies reveal about a wafer? | 43 |
| Artifacts | [A2 · Local defect detection and localization](papers/artifacts.md#a2) | Where is a defect, and what does it look like? | 44 |
| Artifacts | [A3 · Computational lithography](papers/artifacts.md#a3) | Which mask pattern will print the intended structure on a wafer? | 67 |
| Artifacts | [A4 · Product quality and yield inference](papers/artifacts.md#a4) | Will a product meet its quality requirements? | 23 |
| Artifacts | [A5 · Yield-loss diagnosis and root-cause analysis](papers/artifacts.md#a5) | What caused a loss of yield, and where should engineers investigate? | 30 |
| Artifacts | [A6 · Adaptive testing and inspection](papers/artifacts.md#a6) | Which dies or locations should be tested or inspected next? | 16 |
| Processes | [P1 · Process monitoring and endpoint detection](papers/processes.md#p1) | Is a process running normally, and when should it stop? | 41 |
| Processes | [P2 · Virtual metrology](papers/processes.md#p2) | Can sensor data estimate a measurement that is slow or expensive to obtain? | 36 |
| Processes | [P3 · Process development and recipe optimization](papers/processes.md#p3) | Which process settings or experiments should be tried next? | 19 |
| Processes | [P4 · Run-to-run and feedback control](papers/processes.md#p4) | How should settings change after observing a process result? | 20 |
| Equipment | [E1 · Fault detection and diagnosis](papers/equipment.md#e1) | Is a tool faulty, and which fault explains its signals? | 25 |
| Equipment | [E2 · Prognostics and maintenance](papers/equipment.md#e2) | When is a tool likely to fail, and when should it be maintained? | 22 |
| Equipment | [E3 · Calibration, matching and qualification](papers/equipment.md#e3) | Is a tool or chamber ready for a specified manufacturing operation? | 3 |
| Production | [R1 · Cycle-time and delivery prediction](papers/production.md#r1) | When will a lot finish, and will it be delivered on time? | 6 |
| Production | [R2 · Scheduling and dispatching](papers/production.md#r2) | Which job should each machine process next? | 30 |
| Production | [R3 · Material handling](papers/production.md#r3) | How should wafers move between tools? | 7 |
| Production | [R4 · Bottleneck and production-state analysis](papers/production.md#r4) | Where is production constrained, and what factory state explains the delay? | 12 |
| Fabs | [F1 · Utility and resource operation](papers/fabs.md#f1) | How should cooling, power, air and water systems serve production efficiently? | 18 |
| Fabs | [F2 · Capacity planning](papers/fabs.md#f2) | What equipment, qualifications or factory space should be added or reassigned? | 13 |
<!-- END TASKS -->

## From Perception to Autonomy

| AI stage | What it adds | Manufacturing example |
|---|---|---|
| Perception | Extract useful information from observations | Locate defects in an inspection image |
| Prediction | Estimate an unknown or future result | Estimate film thickness or a lot’s completion time |
| Reasoning | Explain observations and relate possible causes | Trace a yield loss to process or equipment conditions |
| Planning | Choose actions and their sequence | Select experiments, process settings or dispatching decisions |
| Autonomy | Connect decisions to execution and learn from feedback | Coordinate actions and update decisions as manufacturing results arrive |

These stages describe AI’s growing role in manufacturing. A workflow can span several stages or connect nonadjacent ones; its value depends on the manufacturing decisions and outcomes it improves.

## Use and contribute

- Browse the five topic pages, or download the [CSV](data/papers.csv), [JSON](data/papers.json) and [BibTeX](references.bib) catalogue.
- Suggest a paper, dataset, implementation or correction through [Issues](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose).
- See [CONTRIBUTING.md](CONTRIBUTING.md) to update the catalogue through a pull request.
- For attribution, see [how to cite](docs/citation.md). Please also cite the original papers and resources you use.

## Updates

- **2026-10-08** — Initial release: 475 manufacturing studies organized into 19 tasks, with public resource links and a guide for new readers.
