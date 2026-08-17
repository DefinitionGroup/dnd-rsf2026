import { permanentRedirect } from "next/navigation";
import { DEFAULT_LOCALE_PATH } from "@/lib/site";

export default function RootPage() {
  permanentRedirect(DEFAULT_LOCALE_PATH);
}
