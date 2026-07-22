import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig, isDevelopmentDemoMode } from "@/lib/supabase/config";

export default async function OnboardingPage() {
  if (!hasSupabaseConfig()) {
    redirect(isDevelopmentDemoMode() ? "/dashboard" : "/login?error=configuration");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: alreadyDone } = await supabase.rpc("has_completed_onboarding");
  if (alreadyDone) {
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-base px-4 py-10">
      <OnboardingForm />
    </div>
  );
}
