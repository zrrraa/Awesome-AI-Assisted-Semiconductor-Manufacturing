<h1 align="center">From Perception to Autonomy</h1>

<h3 align="center">A Survey on AI-Assisted Semiconductor Manufacturing</h3>

<p align="center">
  Rui Zhong · Zhikun Huang · Xue Zhang · Qian Jin · Yu Li<br>
  Qi Sun · Dawei Gao · Yi Song · Hanming Wu · Cheng Zhuo
</p>

<p align="center"><sub>Zhejiang University &nbsp; · &nbsp; Zhejiang ICsprout Semiconductor Co., Ltd.</sub></p>

<!-- BEGIN COUNTS -->
<p align="center">
  <a href="#browse-by-manufacturing-task"><img src="https://img.shields.io/badge/Papers-475-355C7D?style=flat-square" alt="475 papers"></a>
  <a href="#browse-by-manufacturing-task"><img src="https://img.shields.io/badge/Manufacturing_scopes-5-557B83?style=flat-square" alt="5 manufacturing scopes"></a>
  <a href="#browse-by-manufacturing-task"><img src="https://img.shields.io/badge/Tasks-19-6C5B7B?style=flat-square" alt="19 tasks"></a>
</p>
<!-- END COUNTS -->

<p align="center">
  <a href="#browse-by-manufacturing-task"><b>Paper collection</b></a> &nbsp; / &nbsp;
  <a href="RESOURCES.md"><b>Datasets &amp; code</b></a> &nbsp; / &nbsp;
  <a href="docs/getting-started.md"><b>Reading guide</b></a> &nbsp; / &nbsp;
  <a href="docs/citation.md"><b>Citation</b></a>
</p>

<p align="center">
  <img src="assets/overview.jpg" width="900" alt="Survey overview: AI for artifacts, processes, equipment, production and fabs, spanning Perception, Prediction, Reasoning, Planning and Autonomy.">
</p>

<p align="center"><sub>Five manufacturing scopes. Nineteen tasks. From interpreting observations to acting and learning through feedback.</sub></p>

AI can help find defects, predict process results, diagnose tool faults and coordinate a factory. This collection organizes the literature around **what needs to be understood, predicted or changed in manufacturing**, connecting AI methods to the decisions they support.

The repository accompanies our survey and welcomes new papers, datasets and implementations. The preprint link will be added when it is available.

## Browse by manufacturing task

Choose a scope below to explore its tasks and papers. Each list is ordered newest first, with links to the original publications and available resources.

<!-- BEGIN TASKS -->
<table>
<tr>
<td width="50%" valign="top">
<h3><a href="papers/artifacts.md">A · Artifacts</a></h3>
<p><b>223 papers</b> · 6 tasks</p>
<p>Products and their structures, from wafer patterns and local defects to masks, quality and yield.</p>
<ul>
<li><a href="papers/artifacts.md#a1">A1 · Wafer spatial-pattern analysis</a> <sub>(43)</sub></li>
<li><a href="papers/artifacts.md#a2">A2 · Local defect detection and localization</a> <sub>(44)</sub></li>
<li><a href="papers/artifacts.md#a3">A3 · Computational lithography</a> <sub>(67)</sub></li>
<li><a href="papers/artifacts.md#a4">A4 · Product quality and yield inference</a> <sub>(23)</sub></li>
<li><a href="papers/artifacts.md#a5">A5 · Yield-loss diagnosis and root-cause analysis</a> <sub>(30)</sub></li>
<li><a href="papers/artifacts.md#a6">A6 · Adaptive testing and inspection</a> <sub>(16)</sub></li>
</ul>
</td>
<td width="50%" valign="top">
<h3><a href="papers/processes.md">P · Processes</a></h3>
<p><b>116 papers</b> · 4 tasks</p>
<p>Manufacturing operations: monitoring their progress, estimating results and choosing or adjusting settings.</p>
<ul>
<li><a href="papers/processes.md#p1">P1 · Process monitoring and endpoint detection</a> <sub>(41)</sub></li>
<li><a href="papers/processes.md#p2">P2 · Virtual metrology</a> <sub>(36)</sub></li>
<li><a href="papers/processes.md#p3">P3 · Process development and recipe optimization</a> <sub>(19)</sub></li>
<li><a href="papers/processes.md#p4">P4 · Run-to-run and feedback control</a> <sub>(20)</sub></li>
</ul>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3><a href="papers/equipment.md">E · Equipment</a></h3>
<p><b>50 papers</b> · 3 tasks</p>
<p>The tools and chambers that carry out operations, including their health, maintenance and readiness.</p>
<ul>
<li><a href="papers/equipment.md#e1">E1 · Fault detection and diagnosis</a> <sub>(25)</sub></li>
<li><a href="papers/equipment.md#e2">E2 · Prognostics and maintenance</a> <sub>(22)</sub></li>
<li><a href="papers/equipment.md#e3">E3 · Calibration, matching and qualification</a> <sub>(3)</sub></li>
</ul>
</td>
<td width="50%" valign="top">
<h3><a href="papers/production.md">R · Production</a></h3>
<p><b>55 papers</b> · 4 tasks</p>
<p>The movement and processing of lots through shared machines, queues and transport systems.</p>
<ul>
<li><a href="papers/production.md#r1">R1 · Cycle-time and delivery prediction</a> <sub>(6)</sub></li>
<li><a href="papers/production.md#r2">R2 · Scheduling and dispatching</a> <sub>(30)</sub></li>
<li><a href="papers/production.md#r3">R3 · Material handling</a> <sub>(7)</sub></li>
<li><a href="papers/production.md#r4">R4 · Bottleneck and production-state analysis</a> <sub>(12)</sub></li>
</ul>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3><a href="papers/fabs.md">F · Fabs</a></h3>
<p><b>31 papers</b> · 2 tasks</p>
<p>Factory utilities and longer-term capacity decisions that support production.</p>
<ul>
<li><a href="papers/fabs.md#f1">F1 · Utility and resource operation</a> <sub>(18)</sub></li>
<li><a href="papers/fabs.md#f2">F2 · Capacity planning</a> <sub>(13)</sub></li>
</ul>
</td>
<td width="50%" valign="top">
<h3>New to the field?</h3>
<p>Start with the manufacturing problem, then follow the data, model and decision.</p>
<ul>
<li><a href="docs/getting-started.md">A chip’s path through a factory</a></li>
<li><a href="docs/getting-started.md#choose-a-reading-path">Reading paths for AI researchers</a></li>
<li><a href="docs/getting-started.md#terms-you-will-meet">Manufacturing glossary</a></li>
<li><a href="RESOURCES.md">Datasets and implementations</a></li>
</ul>
</td>
</tr>
</table>
<!-- END TASKS -->

## Start exploring

| Find papers | Try an implementation | Work with the catalogue |
| :--- | :--- | :--- |
| [Wafer patterns](papers/artifacts.md#a1) · [Defect detection](papers/artifacts.md#a2)<br>[Virtual metrology](papers/processes.md#p2) · [Scheduling](papers/production.md#r2) | [MixedWM38](RESOURCES.md#mixedwm38) · [LithoBench](RESOURCES.md#lithobench)<br>[SECOM](RESOURCES.md#secom) · [PySCFabSim](RESOURCES.md#pyscfabsim) | [BibTeX](references.bib) · [CSV](data/papers.csv) · [JSON](data/papers.json)<br>[Data format](data/README.md) · [Citation](docs/citation.md) |

New to the field? The [reading guide](docs/getting-started.md) introduces manufacturing terms, explains the five AI stages and suggests paths from familiar AI problems to factory decisions.

## Contribute

Help the collection grow: [suggest a paper or resource](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose), report a correction, or submit a pull request. See the [contribution guide](CONTRIBUTING.md) for the format and scope.

If you use this collection, please [cite the survey](docs/citation.md) and the original papers or resources that inform your work.

## Updates

- **2026-10-08** — Initial release: 475 manufacturing studies across 19 tasks, with public resources and a reading guide.
