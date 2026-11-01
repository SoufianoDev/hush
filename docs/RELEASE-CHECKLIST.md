# Release checklist

Before publishing a GitHub repository or package:

- Keep one canonical source tree. Claude Web and ChatGPT Web have optional ZIP upload artifacts; Claude Web can also install directly from the repository marketplace. Coding applications should use their native plugin installation flows.

1. Replace `OWNER/REPOSITORY` in the website and `.agents/plugins/marketplace.json`.
2. Confirm the npm package name `hush-agent-plugin` is available, or change it consistently in `package.json`, the MiMo config example, and OpenCode V1 documentation.
3. Publish the npm package if using package-based OpenCode V1 or MiMo Code installation.
4. Test `.opencode/plugins/hush.ts` in OpenCode V1.18.29+ and OpenCode V2 separately; verify the project-local V1 skill path and the native V2 `@hush` skill registry after a global Git plugin install.
5. Test `.mimocode/plugin/hush.ts` in the current MiMo Code release. Confirm the host loads the `server()` member from the default export. For global use, test the npm package only after it is published.
6. Test Claude Code plugin loading and Hush skill discovery; separately test Claude Web repository-marketplace installation and custom-plugin ZIP upload.
7. Test the Codex plugin from a repository marketplace, then separately test the public OpenAI package in the submission portal.
8. Test `agy plugin validate --strict` and the Antigravity GitHub install; confirm the skill appears in Customizations.
9. Test the MiMo project shim and the npm package path separately. MiMo's desktop UX does not currently provide a public plugin install panel, so do not promise a one-click desktop install.
10. Deploy `website/` and verify the privacy page at its final public URL.
11. For OpenAI public submission, set `developerName`, `websiteURL`, and `privacyPolicyURL` in `plugin.json` to real verified/public values before rebuilding. Enter the verified publisher identity and support contact in the portal. Skills-only packages do not need MCP test cases, but they still go through automated checks and review.
12. For Google's public Antigravity Marketplace, follow its separate partner submission process. GitHub installation is already documented and does not imply public marketplace listing.

Do not describe marketplace publication as complete until the host has approved and published the listing.
