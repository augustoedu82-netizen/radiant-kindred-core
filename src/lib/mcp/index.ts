import { defineMcp } from "@lovable.dev/mcp-js";
import estimateLlcCostTool from "./tools/estimate-llc-cost";
import getServiceOverviewTool from "./tools/get-service-overview";
import listStatesTool from "./tools/list-states";
import searchFaqTool from "./tools/search-faq";

export default defineMcp({
  name: "destrava-usos",
  title: "Destrava Usos",
  version: "0.1.0",
  instructions:
    "Ferramentas públicas da DestravaUSA (abertura de LLC nos EUA para brasileiros). Use `get_service_overview` para a oferta completa, `list_states` para estados e taxas, `estimate_llc_cost` para o custo total em um estado e `search_faq` para dúvidas frequentes. Todos os valores são em dólares e aproximados.",
  tools: [getServiceOverviewTool, listStatesTool, estimateLlcCostTool, searchFaqTool],
});
