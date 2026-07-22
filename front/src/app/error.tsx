"use client";

import { RouteError } from "@/components/ui/RouteError";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main>
      <RouteError reset={reset} />
    </main>
  );
}
