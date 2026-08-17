import type { ResolvedVideo } from "@/blocks/types";

export function resolveVideoUrl(source?: ResolvedVideo | null) {
  return source?.asset?.url ?? undefined;
}
