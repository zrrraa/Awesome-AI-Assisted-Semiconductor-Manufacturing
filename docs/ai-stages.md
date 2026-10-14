# AI stages in the reading collection

The labels in [`data/ai-stages.json`](../data/ai-stages.json) follow the reviewed, per-paper coding used for the survey’s manufacturing-scope × AI-stage coverage figure. A paper can have several labels; each is counted once per paper.

| Stage | What the paper studies |
| --- | --- |
| L1 · Perception | Recognizing patterns, defects or operating states from observations. Representation learning and data augmentation belong here when they support that task. |
| L2 · Prediction | Estimating an unmeasured property or future outcome, including printability before fabrication. |
| L3 · Reasoning | Investigating causes or producing an explicit diagnostic or explanatory analysis. A saliency plot alone does not establish this role. |
| L4 · Planning | Choosing manufacturing actions, designs, settings, measurements or resource plans. Model hyperparameter tuning alone is not a manufacturing plan. |
| L5 · Autonomy | Studying a recurring action–response–decision loop in a simulated or operating environment. |

Code what a study investigates, using its methods and evaluation. Do not infer stages from a model name or automatically add every earlier stage when assigning L5. Research testbeds are labelled **Research testbed**, with an empty stage list.

The coverage chart uses each paper’s **catalogue scope**, while the task lists group papers by their primary manufacturing objective. Those fields are kept separately: maintenance study `geurtsen2022maintenance` belongs to task E2 and catalogue scope Production; `hong2025capacity` belongs to task R4 and catalogue scope Fabs. This preserves the survey’s reviewed scope statistics without changing the task lists.

The build script checks bibliography coverage and generates each entry’s stage labels from the reviewed coding. The library includes linked conference and journal versions. Charts and downloadable CSV files count merged versions once, using the survey's cited representative; each version keeps its own labels in the library.

The timeline has three views. **All papers** counts each study once by its representative's publication year. **M1–M5** splits that count by catalogue scope. **L1–L5** counts stage assignments: a study contributes once to every stage its representative addresses, so the stack can exceed the number of studies in that year. The three testbeds without stage labels do not contribute to the stage view.
