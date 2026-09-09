---
name: systematic-foundations-tutorial
description: Rewrite scattered computer science notes into coherent, dependency-aware tutorials with a clear learning path, causal explanations, and grouped headings.
---

# Systematic Foundations Tutorial

Use this skill when creating or rewriting a computer science fundamentals lesson for a beginner who needs a continuous mental model rather than a collection of summaries or interview notes. It applies to data structures, algorithms, computer organization, operating systems, networks, databases, concurrency, and related foundations.

## Required teaching arc

Organize each lesson in this order:

1. **Problem** — begin with a concrete task or failure and explain why the naive approach is insufficient.
2. **Prerequisites and model** — state the concepts the reader needs, then show the objects, layers, states, or memory representation involved.
3. **Invariant or governing rule** — identify what must remain true, what contract a layer provides, or what law explains the behavior.
4. **Main process** — explain the normal path in time order, including participants, state changes, and outputs.
5. **Implementation** — present details, code, protocol fields, or hardware mechanisms only after the model is established.
6. **Trade-offs and boundaries** — compare alternatives by assumptions, complexity, latency, capacity, locality, isolation, reliability, or failure behavior.
7. **Practice** — end with a worked example, misconceptions, observable evidence, understanding checks, and exercises.

## Heading discipline

Use second-level headings for complete learning stages, not isolated vocabulary terms. Merge headings that answer the same question. Keep concepts, implementation, applications, diagnostics, and interview prompts in separate major groups. A reader should be able to read from the first heading to the last without jumping between unrelated modes.

## Explanation rules

- Introduce every unfamiliar abbreviation or English term with its full name, Chinese meaning, and role on first use.
- Explain the invariant, contract, or governing rule before implementation details.
- Use one running example through the lesson and show state changes with a small diagram or table.
- State whether a claim is worst-case, average-case, amortized, approximate, platform-dependent, or output-sensitive, and name the assumption.
- Keep lists for genuinely parallel facts. Convert sequences of causal claims into connected prose.
- Distinguish an abstract interface or layer from one concrete implementation.
- Explain why a mechanism exists before listing its components or parameters.
- Keep summaries short and point back to the explanation instead of repeating it.

## Module-level organization

For an overview page, establish the learning dependency graph first. Group topics by the problem or operation they address, explain prerequisites, show a progression from simple models to composed systems, and provide a decision tree for selecting the next topic. Do not merely reproduce directory order.

## Verification

Before finishing, check that headings form a coherent progression, prerequisites are stated, each lesson has a model diagram or equivalent concrete representation, examples match the stated invariant, edge cases are explicit, internal links resolve, and Markdown tests pass. Do not claim a lesson is rewritten merely because a glossary, summary, or introduction was added; the body must explain the mechanism in continuous prose.
