# AI stages in the reading collection

Each paper’s AI-stage labels describe the roles investigated in its methods and evaluation. A paper can have several labels, recorded in [`data/ai-stages.json`](../data/ai-stages.json).

| Stage | What the paper studies |
| --- | --- |
| L1 · Perception | Recognizing patterns, defects or operating states from observations. Representation learning and data augmentation belong here when they support that task. |
| L2 · Prediction | Estimating an unmeasured property or future outcome, including printability before fabrication. |
| L3 · Reasoning | Investigating causes or producing an explicit diagnostic or explanatory analysis. A saliency plot alone does not establish this role. |
| L4 · Planning | Choosing manufacturing actions, designs, settings, measurements or resource plans. Model hyperparameter tuning alone is not a manufacturing plan. |
| L5 · Autonomy | Studying a recurring action–response–decision loop in a simulated or operating environment. |

Code what a study investigates, using its methods and evaluation. Do not infer stages from a model name or automatically add every earlier stage when assigning L5. Research testbeds are labelled **Research testbed**, with an empty stage list.

The **task** identifies the manufacturing objective or action. The **manufacturing scope** identifies the objects and scale studied: products and structures, processes, equipment, production or fab facilities. They need not coincide: a maintenance decision concerns equipment, but a study may examine its effects across production. Assign both from the research question and evaluation.

The library lists related conference and journal papers separately, each with its own labels. Relationship links describe publication history. Statistical grouping is maintained separately in [`data/research-groups.json`](../data/research-groups.json): entries marked **Trends: Counted with …** share their representative’s count, while related papers with distinct contributions count separately. See the [contribution guide](../CONTRIBUTING.md#conference-and-journal-versions).

The yearly chart has three views. **Studies** counts each study once by its representative’s publication year. **M1–M5** splits that count by manufacturing scope. **L1–L5** counts stage assignments: a study contributes to every stage its representative addresses, so the stack can exceed the number of studies in that year. Testbeds without stage labels contribute to scope totals but not stage counts. The scope × stage chart uses the same records.
