# Datasets, benchmarks and code

[Home](README.md) · [Browse papers](README.md#browse-by-manufacturing-task)

Starting points for hands-on work. Follow each project’s documentation for data access, installation and terms of use.

| Resource | Tasks | What you can use it for |
|---|---|---|
| [WM-811K (dataset paper)](https://doi.org/10.1109/TSM.2014.2364237) | [A1](papers/artifacts.md#a1) | Wafer-map pattern recognition. The dataset paper introduces a large collection of wafer maps and the pattern-recognition problem. |
| [MixedWM38](https://github.com/Junliangwangdhu/WaferMap) | [A1](papers/artifacts.md#a1) | Wafer maps with single and mixed defect patterns, download links and baseline code. The release includes generated maps used to balance patterns. |
| [MIIC](https://github.com/wenbihan/MIIC-IAD) | [A2](papers/artifacts.md#a2) | SEM images of integrated circuits for anomaly detection and localization, with bounding boxes and pixel masks. The project specifies non-commercial research use. |
| [LithoBench](https://github.com/shelljane/lithobench) | [A3](papers/artifacts.md#a3) | Circuit-layout datasets and a learning framework for lithography simulation and mask optimization, with baseline models. |
| [OpenILT](https://github.com/OpenOPC/OpenILT) | [A3](papers/artifacts.md#a3) | An implementation platform for inverse lithography, including lithography models, mask optimizers and benchmark examples. |
| [SECOM](https://archive.ics.uci.edu/dataset/179/secom) | [A4](papers/artifacts.md#a4) | Process measurements and pass/fail outcomes for feature selection and quality classification: 1,567 examples, 591 features and missing values. |
| [PySCFabSim](https://github.com/prosysscience/PySCFabSim-release) | [R2](papers/production.md#r2) | A semiconductor fab simulator with dispatching experiments and reinforcement-learning interfaces. Its documentation links to the SMT2020 testbed. |

## Choosing an evaluation

Match the evaluation to the decision you want to support. For wafer maps, record which patterns and label definitions are used. For lithography, report the layout set, lithography model and optimization objective. For scheduling, specify the factory configuration, product mix and dispatching rules. These choices determine what a result means.

Resource descriptions were checked against their project or publisher pages on 2026-10-08. New resources and corrected links are welcome through [an issue](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose) or a pull request.
