import { useState } from "react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import { Workflow, ArrowUpRight, LockKeyhole, Mail } from "lucide-react";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(""); setMessage("");
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw authError;
        if (!data.session) setMessage("Account created. Check your email to confirm your address, then sign in.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Authentication failed. Please try again."); }
    finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#080d17] px-5 py-10 text-slate-100">
    <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1625] p-7 shadow-2xl shadow-black/30 sm:p-9">
      <a href="/" className="mb-8 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-300"><Workflow size={21}/></span><span className="text-sm font-bold tracking-[.2em]">FLOWMATIC</span></a>
      {!isSupabaseConfigured ? <><h1 className="text-xl font-semibold">Connect your Supabase project</h1><p className="mt-3 text-sm leading-6 text-slate-400">Authentication is ready in the app. Add these two environment variables in Cloudflare Pages to activate sign in and cloud storage:</p><div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-[#080e19] p-4 font-mono text-xs"><p>VITE_SUPABASE_URL</p><p>VITE_SUPABASE_ANON_KEY</p></div><p className="mt-4 text-xs leading-5 text-slate-500">Use your Supabase Project URL and publishable/anon key. Never put a service-role key in frontend settings.</p></> : <>
        <p className="text-[10px] font-bold tracking-[.18em] text-teal-300">YOUR WORKSPACE STARTS HERE</p><h1 className="mt-3 text-2xl font-semibold">{mode === "login" ? "Welcome back." : "Create your account."}</h1><p className="mt-2 text-sm text-slate-400">{mode === "login" ? "Sign in to access your cloud workflows." : "Create an account to save workflows across devices."}</p>
        <form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-xs text-slate-300">Email address<span className="relative mt-2 block"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/><input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-[#080e19] py-3 pl-10 pr-3 text-sm outline-none focus:border-teal-300/50"/></span></label><label className="block text-xs text-slate-300">Password<span className="relative mt-2 block"><LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/><input type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-white/10 bg-[#080e19] py-3 pl-10 pr-3 text-sm outline-none focus:border-teal-300/50"/></span></label>
          {error && <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/[.06] p-3 text-xs text-rose-300">{error}</p>}{message && <p role="status" className="rounded-lg border border-teal-300/20 bg-teal-300/[.06] p-3 text-xs text-teal-200">{message}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-300 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-50">{busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"} <ArrowUpRight size={15}/></button>
        </form><p className="mt-6 text-center text-xs text-slate-500">{mode === "login" ? "New to FLOWMATIC?" : "Already have an account?"} <button onClick={()=>{setMode(mode === "login" ? "signup" : "login");setError("");setMessage("");}} className="font-semibold text-teal-300">{mode === "login" ? "Create account" : "Sign in"}</button></p>
      </>}
    </section>
  </main>;
}
