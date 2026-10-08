# Datasets & code

[← Home](README.md) · [Paper collection](README.md#browse-by-manufacturing-task) · [Reading guide](docs/getting-started.md)

Public datasets, benchmarks and implementations for hands-on work. Each entry links to its project or dataset paper.

[Wafer patterns](#wafer-patterns) &nbsp; / &nbsp; [Image defects](#image-defects) &nbsp; / &nbsp; [Lithography](#lithography) &nbsp; / &nbsp; [Quality prediction](#quality-prediction) &nbsp; / &nbsp; [Scheduling](#scheduling)

## Wafer patterns

<a id="wm811k"></a>

### [WM-811K (dataset paper)](https://doi.org/10.1109/TSM.2014.2364237)

Wafer-map pattern recognition. The dataset paper introduces a large collection of wafer maps and the pattern-recognition problem.

[A1 · Wafer spatial-pattern analysis](papers/artifacts.md#a1)

<a id="mixedwm38"></a>

### [MixedWM38](https://github.com/Junliangwangdhu/WaferMap)

Wafer maps with single and mixed defect patterns, download links and baseline code. The release includes generated maps used to balance patterns.

[A1 · Wafer spatial-pattern analysis](papers/artifacts.md#a1)

## Image defects

<a id="miic"></a>

### [MIIC](https://github.com/wenbihan/MIIC-IAD)

SEM images of integrated circuits for anomaly detection and localization, with bounding boxes and pixel masks. The project specifies non-commercial research use.

[A2 · Local defect detection and localization](papers/artifacts.md#a2)

## Lithography

<a id="lithobench"></a>

### [LithoBench](https://github.com/shelljane/lithobench)

Circuit-layout datasets and a learning framework for lithography simulation and mask optimization, with baseline models.

[A3 · Computational lithography](papers/artifacts.md#a3)

<a id="openilt"></a>

### [OpenILT](https://github.com/OpenOPC/OpenILT)

An implementation platform for inverse lithography, including lithography models, mask optimizers and benchmark examples.

[A3 · Computational lithography](papers/artifacts.md#a3)

## Quality prediction

<a id="secom"></a>

### [SECOM](https://archive.ics.uci.edu/dataset/179/secom)

Process measurements and pass/fail outcomes for feature selection and quality classification: 1,567 examples, 591 features and missing values.

[A4 · Product quality and yield inference](papers/artifacts.md#a4)

## Scheduling

<a id="pyscfabsim"></a>

### [PySCFabSim](https://github.com/prosysscience/PySCFabSim-release)

A semiconductor fab simulator with dispatching experiments and reinforcement-learning interfaces. Its documentation links to the SMT2020 testbed.

[R2 · Scheduling and dispatching](papers/production.md#r2)


## Choosing an evaluation

Match the evaluation to the decision you want to support. For wafer maps, record which patterns and label definitions are used. For lithography, report the layout set, lithography model and optimization objective. For scheduling, specify the factory configuration, product mix and dispatching rules. These choices determine what a result means.

Resource descriptions were checked against their project or publisher pages on 2026-10-08. New resources and corrected links are welcome through [an issue](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose) or a pull request.
