import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { FAQ } from "../data";

export default defineTool({
  name: "search_faq",
  title: "Buscar no FAQ",
  description:
    "Busca nas perguntas frequentes da DestravaUSA (taxas, visto, impostos, prazos, conta bancária). Sem termo de busca, retorna todo o FAQ.",
  inputSchema: {
    query: z.string().optional().describe("Termo de busca em português, por exemplo 'imposto' ou 'prazo'."),
  },
  outputSchema: {
    query: z.string().nullable(),
    count: z.number(),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const term = query?.trim().toLowerCase();
    const items = term
      ? FAQ.filter(
          (item) =>
            item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term),
        )
      : FAQ;
    const payload = { query: term ?? null, count: items.length, items };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
