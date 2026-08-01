import { defineTool } from "@lovable.dev/mcp-js";
import { ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SERVICE_FEE_USD, STATES, findState } from "../data";

export default defineTool({
  name: "estimate_llc_cost",
  title: "Estimar custo da LLC",
  description:
    "Calcula o custo estimado de abrir uma LLC em um estado específico: serviço fixo da DestravaUSA mais a taxa oficial do estado.",
  inputSchema: {
    state: z.string().describe("Nome ou slug do estado: Wyoming, Novo México, Flórida ou Delaware."),
  },
  outputSchema: {
    state: z.string(),
    serviceFeeUsd: z.number(),
    stateFeeUsd: z.number(),
    totalUsd: z.number(),
    note: z.string(),
    disclaimer: z.string(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ state }) => {
    const match = findState(state);
    if (!match) {
      throw new ToolError(
        `Estado não atendido: "${state}". Estados disponíveis: ${STATES.map((s) => s.name).join(", ")}.`,
      );
    }
    const payload = {
      state: match.name,
      serviceFeeUsd: SERVICE_FEE_USD,
      stateFeeUsd: match.stateFeeUsd,
      totalUsd: SERVICE_FEE_USD + match.stateFeeUsd,
      note: match.note,
      disclaimer:
        "A taxa do estado é paga diretamente ao estado e pode mudar. Valores aproximados em dólares.",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
