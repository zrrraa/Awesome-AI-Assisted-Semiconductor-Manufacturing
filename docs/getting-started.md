# 🧭 Reading guide

[Home](../README.md) · [Datasets and code](../RESOURCES.md)

## A chip’s path through a factory

A wafer is a thin disc on which many chips are made together. It repeatedly visits tools that deposit, pattern, remove or modify materials. Inspections and electrical tests reveal whether the resulting structures work. Wafers travel in lots, share machines and may visit the same type of tool many times. The fab also needs stable supplies of power, cooling, air and water.

AI can help at each of these scales. A defect detector interprets an image. A process model estimates a result before a slow measurement arrives. A scheduler chooses which lot a machine should process next. The information, actions and useful evaluation measures differ across these tasks.

## Choose a reading path

| If you know… | Try… | Then follow the decision |
|---|---|---|
| Computer vision | [A1: wafer patterns](../papers/artifacts.md#a1) and [A2: local defects](../papers/artifacts.md#a2) | How does the result guide [inspection](../papers/artifacts.md#a6) or [yield diagnosis](../papers/artifacts.md#a5)? |
| Regression or time series | [P2: virtual metrology](../papers/processes.md#p2) and [E2: prognostics](../papers/equipment.md#e2) | Which measurement, correction or maintenance action becomes possible? |
| Optimization or reinforcement learning | [P3: process development](../papers/processes.md#p3) and [R2: scheduling](../papers/production.md#r2) | How do actions affect quality, delivery and later decisions? |
| Factory operations | [R4: bottlenecks](../papers/production.md#r4), [F1: utilities](../papers/fabs.md#f1) and [F2: capacity](../papers/fabs.md#f2) | Which shared resource limits the benefit of a local improvement? |

For a practical starting point, try MixedWM38 for wafer patterns, MIIC for image anomalies, LithoBench for lithography, SECOM for tabular quality prediction or PySCFabSim for dispatching. Their [project pages](../RESOURCES.md) provide the data or implementation instructions.

## From Perception to Autonomy

The survey follows five stages of AI's growing role in manufacturing:

| Stage | What it adds | Manufacturing example |
|---|---|---|
| Perception | Extract useful information from observations | Locate defects in an inspection image |
| Prediction | Estimate an unknown or future result | Estimate film thickness or a lot’s completion time |
| Reasoning | Explain observations and relate possible causes | Trace a yield loss to process or equipment conditions |
| Planning | Choose actions and their sequence | Select experiments, process settings or dispatching decisions |
| Autonomy | Connect decisions to execution and learn from feedback | Coordinate actions and update decisions as manufacturing results arrive |

A workflow can span several stages or connect nonadjacent ones. For example, a virtual-metrology model predicts film thickness; a controller uses that prediction to adjust the next run. The practical question is how these stages work together to improve a manufacturing outcome.

## Terms you will meet

| Term | Plain meaning |
|---|---|
| Die | One chip region on a wafer |
| Wafer map | A spatial record of die locations and their test results |
| Yield | The fraction of products that meet the specified requirements |
| SEM | Scanning electron microscopy, used to image very small structures |
| Lithography | Transferring a pattern onto a wafer using exposure and resist processing |
| Mask | The pattern used to control where exposure occurs |
| OPC / ILT | Optical proximity correction / inverse lithography: methods for finding masks that print the intended pattern |
| Recipe | The settings used for a manufacturing operation |
| Metrology | Measuring properties such as thickness, dimensions or material characteristics |
| Virtual metrology | Estimating such a measurement from other available data |
| Chamber | A processing space within a manufacturing tool |
| Qualification | Establishing that a tool or chamber can perform a specified operation acceptably |
| Lot | A group of wafers managed together in production |
| Dispatching | Selecting the next eligible job for a machine |
| Cycle time | The elapsed time a lot spends completing its manufacturing route |
| AMHS | Automated material handling system: equipment that moves material between locations |
| Run-to-run control | Updating process settings using the results of earlier runs |

## Read a result in context

Start with four questions: What information was available? What did the model produce? Which decision used that output? What improved in manufacturing?

For example, a lower prediction error is useful when it helps choose a better correction or avoid an unnecessary measurement. A shorter average cycle time should also be read alongside the delivery performance of different products. These links make it easier to compare approaches and identify useful research directions.
