<h1 align="center">Awesome AI-Assisted Semiconductor Manufacturing</h1>
<p align="center"><b>From Perception to Autonomy: A Survey on AI-Assisted Semiconductor Manufacturing</b></p>

<p align="center">
  <a href="https://awesome.re"><img src="https://awesome.re/badge-flat2.svg" alt="Awesome"></a>
  <a href="https://zrrraa.github.io/Awesome-AI-Assisted-Semiconductor-Manufacturing/"><img src="https://img.shields.io/badge/Project-Explore_the_survey-526DAB?style=flat-square" alt="Project page"></a>
  <a href="#citation"><img src="https://img.shields.io/badge/Cite-BibTeX-7956AE?style=flat-square" alt="Citation"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-36875B?style=flat-square" alt="Pull requests welcome"></a>
</p>

<p align="center"><span><a href="mailto:rzhong@zju.edu.cn">Rui Zhong</a><sup>1</sup></span> · <span>Zhikun Huang<sup>1</sup></span> · <span>Xue Zhang<sup>1</sup></span> · <span>Qian Jin<sup>1</sup></span> · <span><a href="mailto:li.yu@zju.edu.cn">Yu Li</a><sup>1</sup></span><br>
<span>Qi Sun<sup>1</sup></span> · <span>Dawei Gao<sup>2,1</sup></span> · <span>Yi Song<sup>1</sup></span> · <span>Hanming Wu<sup>1,*</sup></span> · <span><a href="mailto:czhuo@zju.edu.cn">Cheng Zhuo</a><sup>1,*</sup></span></p>
<p align="center"><sub><span><sup>1</sup> College of Integrated Circuits, Zhejiang University</span> &nbsp; <span><sup>2</sup> Zhejiang ICsprout Semiconductor Co., Ltd.</span><br>* Corresponding authors.</sub></p>

<p align="center"><img src="docs/assets/overview.jpg" width="1000" alt="Fig. 1. Five manufacturing scopes and nineteen tasks, connected with five AI stages from Perception to Autonomy."></p>

<p align="center">
  <a href="https://zrrraa.github.io/Awesome-AI-Assisted-Semiconductor-Manufacturing/">🌐 <b>Project page</b></a> &nbsp; · &nbsp;
  <a href="#news">🔥 <b>News</b></a> &nbsp; · &nbsp;
  <a href="#citation">📝 <b>Citation</b></a> &nbsp; · &nbsp;
  <a href="#papers">📚 <b>Papers</b></a> &nbsp; · &nbsp;
  <a href="docs/getting-started.md">🧭 <b>Reading guide</b></a>
</p>

<a id="news"></a>

## 🔥 News

- **2026-10-10** — The [interactive atlas and paper library](https://zrrraa.github.io/Awesome-AI-Assisted-Semiconductor-Manufacturing/) are live: explore manufacturing tasks, follow the wafer-to-chip process, and browse research directly on the project page.
- **2026-10-08** — Task-based reading lists and the survey companion are online.

<a id="citation"></a>

## 📝 Citation

If you find the survey useful, please cite it:

<details>
<summary><b>Copy BibTeX</b></summary>

```bibtex
@unpublished{zhong2026perception,
  title = {From Perception to Autonomy: A Survey on {AI}-Assisted Semiconductor Manufacturing},
  author = {Zhong, Rui and Huang, Zhikun and Zhang, Xue and Jin, Qian and Li, Yu and Sun, Qi and Gao, Dawei and Song, Yi and Wu, Hanming and Zhuo, Cheng},
  year = {2026},
  note = {Manuscript}
}
```

</details>

<a id="papers"></a>
<a id="browse-by-manufacturing-task"></a>

## 🧭 Explore by manufacturing task

Choose a manufacturing question and follow its research. Each task links to a reading list in this repository.

<table>
<tr>
<td valign="top" width="33%"><img src="docs/assets/icons/artifact_wide.png" height="66" alt=""><h3><a href="papers/artifacts.md">Artifacts</a></h3><p><sub>Products, patterns &amp; quality</sub></p><p><a href="papers/artifacts.md#a1"><b>A1</b> · Wafer spatial-pattern analysis</a><br><br><a href="papers/artifacts.md#a2"><b>A2</b> · Local defect detection and localization</a><br><br><a href="papers/artifacts.md#a3"><b>A3</b> · Computational lithography</a><br><br><a href="papers/artifacts.md#a4"><b>A4</b> · Product quality and yield inference</a><br><br><a href="papers/artifacts.md#a5"><b>A5</b> · Yield-loss diagnosis and root-cause analysis</a><br><br><a href="papers/artifacts.md#a6"><b>A6</b> · Adaptive testing and inspection</a></p></td>
<td valign="top" width="33%"><img src="docs/assets/icons/process.png" height="66" alt=""><h3><a href="papers/processes.md">Processes</a></h3><p><sub>Measurements, recipes &amp; control</sub></p><p><a href="papers/processes.md#p1"><b>P1</b> · Process monitoring and endpoint detection</a><br><br><a href="papers/processes.md#p2"><b>P2</b> · Virtual metrology</a><br><br><a href="papers/processes.md#p3"><b>P3</b> · Process development and recipe optimization</a><br><br><a href="papers/processes.md#p4"><b>P4</b> · Run-to-run and feedback control</a></p></td>
<td valign="top" width="33%"><img src="docs/assets/icons/equipment.png" height="66" alt=""><h3><a href="papers/equipment.md">Equipment</a></h3><p><sub>Health, maintenance &amp; readiness</sub></p><p><a href="papers/equipment.md#e1"><b>E1</b> · Fault detection and diagnosis</a><br><br><a href="papers/equipment.md#e2"><b>E2</b> · Prognostics and maintenance</a><br><br><a href="papers/equipment.md#e3"><b>E3</b> · Calibration, matching and qualification</a></p></td>
</tr><tr>
<td valign="top" width="33%"><img src="docs/assets/icons/production.png" height="66" alt=""><h3><a href="papers/production.md">Production</a></h3><p><sub>Lots, schedules &amp; material flow</sub></p><p><a href="papers/production.md#r1"><b>R1</b> · Cycle-time and delivery prediction</a><br><br><a href="papers/production.md#r2"><b>R2</b> · Scheduling and dispatching</a><br><br><a href="papers/production.md#r3"><b>R3</b> · Material handling</a><br><br><a href="papers/production.md#r4"><b>R4</b> · Bottleneck and production-state analysis</a></p></td>
<td valign="top" width="33%"><img src="docs/assets/icons/fab_vertical.png" height="66" alt=""><h3><a href="papers/fabs.md">Fabs</a></h3><p><sub>Utilities, resources &amp; capacity</sub></p><p><a href="papers/fabs.md#f1"><b>F1</b> · Utility and resource operation</a><br><br><a href="papers/fabs.md#f2"><b>F2</b> · Capacity planning</a></p></td>
<td valign="top"><img src="docs/assets/icons/wafer.png" height="66" alt=""><h3>Choose a reading path</h3><p>New to the field?<br>Start with the <a href="docs/getting-started.md">reading guide</a>.</p><p>Search by title, author or year in the <a href="https://zrrraa.github.io/Awesome-AI-Assisted-Semiconductor-Manufacturing/explore.html">interactive paper library ↗</a>.</p></td></tr>
</table>

[📖 Full bibliography](references.bib) · [🧰 Datasets & code](RESOURCES.md)

## 💡 From manufacturing data to manufacturing decisions

Making a chip means coordinating processes, tools and factory resources. AI helps interpret observations, estimate unmeasured properties and choose what to measure or change next.

Our survey connects **five manufacturing scopes** and **nineteen tasks** with five stages: **Perception → Prediction → Reasoning → Planning → Autonomy**.

<p align="center"><img src="docs/assets/wafer-to-chip.jpg" width="1000" alt="From a bare wafer through repeated fabrication, testing and packaging to finished chips."></p>

<table>
<tr>
<td width="33%" valign="top"><b>🔎 Preserve the context</b><br>Spatial patterns and process histories reveal differences hidden by averages.</td>
<td width="33%" valign="top"><b>🎯 Connect prediction to action</b><br>A useful model helps choose a measurement, correction or manufacturing decision.</td>
<td width="33%" valign="top"><b>🔄 Learn from outcomes</b><br>Actions change the factory and the observations that guide later decisions.</td>
</tr>
</table>

These connections motivate an **AI-native autonomous virtual fab**: models, agents and physical systems supporting factory decisions and improving through operating experience.

[🤝 Contribute a paper](CONTRIBUTING.md)
