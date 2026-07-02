import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Rattache l'origine d'inscription (posée en cookie par /login) aux comptes
      // créés via OAuth, qui ne passent pas par signUp() et donc pas par ses options.data.
      const cookieStore = await cookies();
      const signupSource = cookieStore.get("stora_signup_source")?.value;
      if (signupSource) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && !user.user_metadata?.signup_source) {
          await supabase.auth.updateUser({ data: { signup_source: signupSource } });
        }
      }
      return NextResponse.redirect(`${origin}/onboarding`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
