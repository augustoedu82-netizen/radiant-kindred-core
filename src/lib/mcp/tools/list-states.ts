import { defineTool } from "@lovable.dev/mcp-js";
import { SERVICE_FEE_USD, STATES } from "../data";

export default defineTool({
  name: "list_states",
  title: "Estados disponíveis",
  description:
    "Lista os estados americanos onde a DestravaUSA abre LLC, com a taxa oficial do estado, o total estimado e observações de cada um.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const states = STATES.map((state) => ({
      name: state.name,
      slug: state.slug,
      stateFeeUsd: state.stateFeeUsd,
      totalUsd: SERVICE_FEE_USD + state.stateFeeUsd,
      note: state.note,
    }));
    const payload = { serviceFeeUsd: SERVICE_FEE_USD, states };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
