# Playwright MCP Setup Guide

To set up Playwright MCP for use with Claude Desktop, follow these steps:

## 1. Install Playwright MCP Server

First, install the Playwright MCP server globally:

```bash
npm install -g @modelcontextprotocol/server-playwright
```

If that doesn't work, try installing from the GitHub repository:

```bash
git clone https://github.com/modelcontextprotocol/servers.git
cd servers/src/playwright
npm install
npm run build
```

## 2. Configure Claude Desktop

Open your Claude Desktop configuration file:
- On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- On Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- On Linux: `~/.config/Claude/claude_desktop_config.json`

Add the Playwright MCP server configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"],
      "env": {}
    }
  }
}
```

Or if you installed it from source:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["/path/to/servers/src/playwright/dist/index.js"],
      "env": {}
    }
  }
}
```

## 3. Restart Claude Desktop

After adding the configuration, restart Claude Desktop for the changes to take effect.

## 4. Verify Installation

Once configured, I should be able to use Playwright commands to:
- Navigate to web pages
- Take screenshots
- Interact with page elements
- Perform automated testing

## Alternative: Using npx directly

If you're having trouble with the global installation, you can also run Playwright MCP directly:

```bash
npx @modelcontextprotocol/server-playwright
```

This will start the MCP server that Claude can connect to.

## Troubleshooting

If you're encountering npm registry issues, try:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Reset npm registry to default:
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

3. Check if you're behind a corporate proxy and configure npm accordingly.