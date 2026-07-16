import { Zap, Building2, Sun } from "lucide-react";
import { usePage } from "@inertiajs/react";

/**
 * Projects are DB-driven and shared globally via Inertia (see
 * HandleInertiaRequests). This module maps the raw shared data into the exact
 * object shape the existing UI components already expect — including resolving
 * tag icon names back into lucide-react components — so no visual component
 * needs to change.
 */

const iconMap = {
  zap: Zap,
  building: Building2,
  sun: Sun,
};

function mapProject(raw) {
  return {
    ...raw,
    tags: (raw.tags ?? []).map((tag) => ({
      icon: iconMap[tag.icon] ?? Zap,
      text: tag.text,
    })),
  };
}

/** Hook: all published projects in the frontend shape. */
export function useProjects() {
  const { projects = [] } = usePage().props;
  return projects.map(mapProject);
}

export function getProjectBySlug(projects, slug) {
  return projects.find((p) => p.slug === slug);
}

export function getOtherProjects(projects, currentSlug) {
  return projects.filter((p) => p.slug !== currentSlug);
}
