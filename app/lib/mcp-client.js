// MCP client: connects to the local crisis-resources MCP server over stdio.
// The server is a separate process with its own curated dataset — the agent
// only ever sees what the server's tools choose to return.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const SERVER_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../mcp-server/server.js'
);

let clientPromise = null;

async function getClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      const transport = new StdioClientTransport({
        command: process.execPath,
        args: [SERVER_PATH]
      });
      const client = new Client({ name: 'crisis-companion-agent', version: '1.0.0' });
      await client.connect(transport);
      console.log('[mcp] connected to crisis-resources server');
      return client;
    })().catch((err) => {
      clientPromise = null;
      throw err;
    });
  }
  return clientPromise;
}

async function callTool(name, args) {
  try {
    const client = await getClient();
    const result = await client.callTool({ name, arguments: args });
    const text = result?.content?.find((c) => c.type === 'text')?.text;
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error(`[mcp] ${name} failed:`, err.message);
    return null;
  }
}

/** → [{name, contact, hours}] or null */
export async function findHelplines({ country, crisisType }) {
  const res = await callTool('find_helplines', { country, crisis_type: crisisType });
  return res?.helplines ?? null;
}

/** → {title, steps: []} or null */
export async function getProtocol({ crisisType }) {
  return await callTool('get_protocol', { crisis_type: crisisType });
}

/** → [{type, title, steps: []}] or null */
export async function listProtocols() {
  const res = await callTool('list_protocols', {});
  return res?.protocols ?? null;
}
