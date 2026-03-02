"use client";

import { useParams, useRouter } from "next/navigation";
import { Package } from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLicense } from "@/lib/license-context";
import { AppSwitcher } from "./app-switcher";
import { NavMain } from "./nav-main";
import { NavFooter } from "./nav-footer";

function ProBanner() {
  const router = useRouter();
  const { isPro, loading } = useLicense();
  const { open } = useSidebar();

  if (loading || isPro) return null;

  return (
    <div
      onClick={() => router.push("/settings/license")}
      className="cursor-pointer rounded-lg bg-blue-500/10 px-3 py-2.5 transition-colors hover:bg-blue-500/15"
    >
      {open ? (
        <div className="flex items-center gap-2.5">
          <Package size={16} weight="duotone" className="shrink-0 text-blue-500" />
          <div className="grid leading-tight">
            <span className="truncate text-xs font-medium text-blue-600 dark:text-blue-400">Get Pro</span>
            <span className="truncate text-[11px] text-blue-500/70">
              Unlimited apps &amp; teams
            </span>
          </div>
        </div>
      ) : (
        <Package size={16} weight="duotone" className="mx-auto text-blue-500" />
      )}
    </div>
  );
}

export function AppSidebar() {
  const { appId } = useParams<{ appId?: string }>();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="drag pt-8">
        <div className="no-drag">
          <AppSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {appId && <NavMain appId={appId} />}
      </SidebarContent>
      <div className="no-drag px-2 pb-2">
        <ProBanner />
      </div>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
