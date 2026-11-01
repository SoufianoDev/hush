# Hush

Hush is one cross-agent plugin project. The original `SKILL.md` remains the source of truth; each host receives the native package or plugin entrypoint it expects.

Hush teaches coding agents to avoid comments that merely restate code, preserve comments that carry real information or tooling directives, limit cleanup to code changed in the current task, and use the project's existing formatter.

## Platform support

| Host | Native integration | Install surface |
|---|---|---|
| Claude Code | Claude Code plugin with `skills/hush/SKILL.md` | Plugin marketplace / `/plugin` |
| Codex | Portable Agent Plugin with the Hush skill | Codex plugin browser / local Git marketplace |
| OpenCode V1 | V1 plugin hook that adds Hush guidance to the system prompt | Project shim or npm package in `plugin` config |
| OpenCode V2 | V2 plugin hook in the same TypeScript entrypoint | `opencode plugin add` or `plugins` config |
| Antigravity | Native `.antigravity-plugin/plugin.json` bundle with Hush skill | `agy plugin install` / Customizations |
| MiMo Code | Host-compatible V1 plugin hook | Project shim or npm package in `plugin` config |
| Claude Web | Claude plugin marketplace / custom plugin upload | Customize → Plugins |
| ChatGPT Web | Portable Plugin package | Public Plugins Directory after OpenAI review and publication |

These are native host integrations where the host offers them. Claude Web now supports adding a Git repository marketplace or uploading a custom plugin ZIP; the same `.claude-plugin` package works in Claude Web and Claude Code. ChatGPT Web's public plugin path is not an immediate GitHub import: it requires a verified publisher, a package upload, automated checks, review, and publication.

## Build the distribution files

Requirements: Node.js 20+ and the `zip` utility.

```bash
npm run validate
npm run build
```

The build creates two upload archives from this one source tree: `dist/hush-claude-plugin.zip` for Claude Web's custom-plugin upload fallback, and `dist/hush-openai-plugin.zip` for ChatGPT's public Plugins submission. Claude Web can instead install directly from the Git repository marketplace. Claude Code, Codex, OpenCode, Antigravity, and MiMo Code use their native application installation paths; they do not need separate downloadable project ZIPs. Both archives are generated from the same canonical `skills/hush/SKILL.md`; do not edit generated copies.

## Install

Replace `OWNER/REPOSITORY` with the public GitHub repository containing this project. Open the matching application and use its install flow.

### Claude Code

```text
/plugin marketplace add OWNER/REPOSITORY
/plugin install hush@hush
```

Or from the terminal:

```bash
claude plugin marketplace add OWNER/REPOSITORY
claude plugin install hush@hush
```

Use `/plugin` to manage the installation and choose user, project, or local scope.

### Codex

Add the repository marketplace:

```bash
codex plugin marketplace add OWNER/REPOSITORY
```

Then open Codex's plugin browser with `/plugins`, find Hush under the added marketplace, and install it. The repo marketplace descriptor is `.agents/plugins/marketplace.json`.

Codex CLI and the ChatGPT desktop app support plugin installation. The ChatGPT web directory uses the public plugin submission and publication flow described below.

### OpenCode V1

The repository includes `.opencode/plugins/hush.ts`, which re-exports the one TypeScript implementation. When you work from a clone of this repository, OpenCode V1 discovers that local plugin automatically. For a global installation across other projects, OpenCode V1 uses the singular `plugin` config key. Add the published npm package to the config file used by OpenCode:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["hush-agent-plugin"]
}
```

For global scope, edit `~/.config/opencode/opencode.json`. For project scope, put the entry in `opencode.json` at the project root. V1 package auto-install is handled by OpenCode at startup.

The dual V1/V2 package entrypoint requires OpenCode V1.18.29 or later. Older V1 releases need a V1-only function-export build and are not claimed as supported by this package.

### OpenCode V2

The same `.opencode/plugins/hush.ts` shim is discovered automatically when this repository is the current project. For a global installation from another project, use the V2 terminal plugin manager:

```bash
opencode plugin add github:OWNER/REPOSITORY
```

V2 uses the plural `plugins` setting internally. The same published package exports the V2 `setup()` implementation as well as the V1 `server()` implementation. V1 and V2 plugin APIs are different; this is not a V1 plugin merely renamed for V2.

### Antigravity

From Antigravity CLI:

```bash
agy plugin install https://github.com/OWNER/REPOSITORY
agy plugin list
```

In Antigravity, open **Customizations → Plugins** to inspect installed plugins and enable or disable them. The official marketplace listing is a separate Google partner submission; GitHub installation does not publish Hush to Google's public catalog.

For manual project installation, place this repository's plugin directory under `.agents/plugins/hush/` in the workspace. For a global installation, use `~/.gemini/config/plugins/hush/`.

### MiMo Code

MiMo Code uses its own `.mimocode` plugin directories and the V1 server plugin contract. It does not scan OpenCode's `.opencode/plugins/` directories. This repository includes `.mimocode/plugin/hush.ts`, which re-exports the canonical TypeScript entrypoint; opening a clone as the current project makes MiMo Code discover that project plugin.

For a global installation across other projects, publish the npm package first, then add it to `.mimocode/mimocode.json` for a project or `~/.config/mimocode/mimocode.jsonc` for the user:

```json
{
  "$schema": "https://mimo.xiaomi.com/mimocode/config.json",
  "plugin": ["hush-agent-plugin"]
}
```

The package route must first be published to npm; this source archive does not publish it or claim that a registry package already exists. MiMo Code's documented config supports npm plugin specifiers but does not expose the same documented `plugin add` flow as OpenCode V2. The project-local shim is the direct no-registry route; the config entry is for a global package installation.

### Claude Web

Claude Web supports the same Hush plugin through a repository marketplace or a custom plugin ZIP. The repository route is the direct installation path and keeps the project as the single source of truth:

1. Open **Claude → Customize → Plugins**.
2. Select **Add → Add marketplace → Add from a repository**.
3. Enter the public GitHub repository as `OWNER/REPOSITORY` (or its repository URL).
4. Open **Discover**, find Hush in the newly added marketplace, and click **Add**.

Alternatively, build the project with `npm run build`, then use Claude's custom-plugin upload flow and select `dist/hush-claude-plugin.zip`. Plugins added in Claude Web are saved to the account and follow the user across Chat, Cowork, and Claude Code. Organization policies may restrict adding external marketplaces or plugins.

### ChatGPT Web

Hush is packaged as a skills-only portable Agent Plugin. To make it installable from ChatGPT Web's universal Plugins Directory:

1. Publish this repository and a public website containing `website/privacy.html`.
2. Set the real website and privacy-policy URLs in the plugin listing metadata, and provide a verified publisher identity and support contact.
3. Run `npm run build`, then upload `dist/hush-openai-plugin.zip` from the OpenAI Plugins submission portal.
4. Resolve automated findings, submit for review, wait for approval, and publish the approved version.
5. Users can then find and install Hush from **ChatGPT → Plugins**.

The web directory is shared with supported Codex surfaces. A local Codex marketplace is not, by itself, an install source for ChatGPT Web. For a skills-only package, OpenAI does not require MCP review test cases or MCP server configuration; it still requires the public listing information, verified publisher, automated checks, and review flow.

## Website

Deploy the `website/` folder to any static host. Set the public repository in `website/config.js` before publishing. The page renders the native install instructions and download links from that configuration.

## Package validation

```bash
npm run validate
```

The validator checks JSON manifests, the Agent Skills frontmatter, the Antigravity manifest schema identifier, expected plugin entrypoints, and the platform-specific package layout. Build archives and inspect them with `unzip -l dist/<archive>.zip`. Before release, also run `agy plugin validate --strict` against the Antigravity plugin directory and test each integration in the actual host. A passing local validation is not a substitute for those host tests or approval by a public marketplace.
