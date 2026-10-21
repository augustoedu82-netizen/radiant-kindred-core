import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalRoot, RequireRole } from "@/components/portal/shell";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: () => (
    <PortalRoot>
      <RequireRole role="admin">
        <Outlet />
      </RequireRole>
    </PortalRoot>
  ),
  head: () => ({
    meta: [{ title: "Painel — DestravaUSA" }, { name: "robots", content: "noindex" }],
  }),
});
