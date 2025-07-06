import { redirect } from "next/navigation";

export default function RootPage() {
  // This will be handled by the middleware, but we provide a fallback
  redirect("/en");
}
