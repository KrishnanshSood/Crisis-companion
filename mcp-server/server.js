// Crisis-resources MCP server (stdio). Exposes a curated, vetted dataset via
// two tools. Runs as its own process: the agent can only reach this data
// through the MCP protocol, never by importing it directly.
//
// NOTE: stdio transport — never write to stdout; use console.error for logs.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const DATA = JSON.parse(
  readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'data/resources.json'), 'utf8')
);

const server = new McpServer({ name: 'crisis-resources', version: '1.0.0' });

function json(payload) {
  return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
}

server.tool(
  'find_helplines',
  'Find crisis helplines for a country (ISO code) and crisis type from a curated, vetted database. Falls back to international directories for unknown countries.',
  {
    country: z.string().describe('ISO country code, e.g. IN, US, GB'),
    crisis_type: z.string().describe('Crisis type, e.g. suicidal_ideation, domestic_violence')
  },
  async ({ country, crisis_type }) => {
    const cc = (country ?? '').toUpperCase();
    const byCountry = DATA.helplines[cc] ?? DATA.helplines.INTL;
    const specialised = byCountry[crisis_type] ?? [];
    const general = byCountry.any ?? [];
    // Specialised lines first, then general, then international fallback.
    const helplines = [...specialised, ...general];
    if (helplines.length === 0) helplines.push(...DATA.helplines.INTL.any);
    return json({ country: cc, crisis_type, helplines, notice: DATA.notice });
  }
);

server.tool(
  'get_protocol',
  'Get the step-by-step response protocol for a crisis type.',
  {
    crisis_type: z.string().describe('Crisis type, e.g. panic_anxiety, grief_loss')
  },
  async ({ crisis_type }) => {
    const protocol = DATA.protocols[crisis_type] ?? DATA.protocols.general_distress;
    return json(protocol);
  }
);

server.tool(
  'list_protocols',
  'List all available crisis response protocols with their titles and steps.',
  {},
  async () => {
    const protocols = Object.entries(DATA.protocols).map(([type, p]) => ({ type, title: p.title, steps: p.steps }));
    return json({ protocols });
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[crisis-resources] MCP server ready (stdio)');
