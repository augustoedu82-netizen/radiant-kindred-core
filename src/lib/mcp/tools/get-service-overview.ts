import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { FAQ, INCLUDED, PROCESS_STEPS, SERVICE_FEE_USD, STATES } from "../data";

export default defineTool({
  name: "get_service_overview",
  title: "Visão geral do serviço",
  description:
    "Retorna a oferta da DestravaUSA: preço fixo do serviço, o que está incluído, etapas do processo e prazo estimado.",
  inputSchema: {},
  outputSchema: {
    brand: z.string(),
    summary: z.string(),
    serviceFeeUsd: z.number(),
    pricingModel: z.string(),
    timeline: z.string(),
    included: z.array(z.string()),
    steps: z.array(z.string()),
    states: z.array(z.string()),
    faqCount: z.number(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const overview = {
      brand: "DestravaUSA",
      summary:
        "Abertura de LLC nos EUA para brasileiros, 100% remota, sem visto, com EIN e apoio bancário.",
      serviceFeeUsd: SERVICE_FEE_USD,
      pricingModel: "Serviço fixo de US$ 280 + taxa estadual variável paga diretamente ao estado.",
      timeline: "Até 6 dias úteis, dependendo do estado e da fila do IRS.",
      included: INCLUDED,
      steps: PROCESS_STEPS,
      states: STATES.map((s) => s.name),
      faqCount: FAQ.length,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(overview, null, 2) }],
      structuredContent: overview,
    };
  },
});
