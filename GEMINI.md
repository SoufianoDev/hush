# Hush instructions for Gemini Code Assist

When you edit or review code in this repository, read `skills/hush/SKILL.md`
before changing code. Apply its comment rules while writing, not as a
post-processing step. Keep comments only when they explain information the
code cannot express, preserve directives and meaningful invariants, limit
cleanup to files changed in the current task, and use the project's formatter.

This file is a project-context bridge for Gemini Code Assist agent mode and
Google Cloud Code integrations. It is not a Gemini CLI extension and does not
replace native Agent Skills discovery. Gemini CLI can load the Hush skill from
`.agents/skills/hush/SKILL.md`.
