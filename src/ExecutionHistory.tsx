import { useCallback, useEffect, useState } from "react";
import { Activity, CheckCircle2, Clock3, RefreshCw, XCircle, ChevronRight, LoaderCircle } from "lucide-react";
import { supabase } from "./lib/supabase";

type Run = {
 id: string;
 workflow_id: string;
 user_id: string;
 status: "pending" | "running" | "success" | "failed" | "cancelled";
 summary: string | null;
 started_at: string | null;
 finished_at: string | null;
 created_at: string;
};
type RunStep = {
 id: string;
 node_id: string;
 node_name: string;
 node_type: string;
 position: number;
 status: string;
 input: unknown;
 output: unknown;
 error: string | null;
 started_at: string | null;
 finished_at: string | null;
};
type WorkflowName = { id: string; name: string };

function formatDate(value: string | null) {
 if (!value) return "—";
 return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
function StatusPill({ status }: { status: string }) {
 const style = status === "success" ? "bg-teal-300/10 text-teal-300" : status === "failed" ? "bg-rose-300/10 text-rose-300" : status === "running" ? "bg-sky-300/10 text-sky-300" : status === "cancelled" ? "bg-slate-500/15 text-slate-400" : "bg-amber-300/10 text-amber-300";
 return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${style}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/>{status}</span>;
}

export default function ExecutionHistory({ userId }: { userId: string }) {
 const [runs, setRuns] = useState<Run[]>([]);
 const [workflowNames, setWorkflowNames] = useState<Record<string, string>>({});
 const [selectedRun, setSelectedRun] = useState<Run | null>(null);
 const [steps, setSteps] = useState<RunStep[]>([]);
 const [loading, setLoading] = useState(true);
 const [detailLoading, setDetailLoading] = useState(false);
 const [error, setError] = useState("");
 const [filter, setFilter] = useState("all");

 const loadRuns = useCallback(async () => {
  if (!supabase) { setError("Supabase is not configured."); setLoading(false); return; }
  setLoading(true); setError("");
  const { data, error: runError } = await supabase.from("workflow_runs").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
  if (runError) { setError(runError.message); setRuns([]); setLoading(false); return; }
  const rows = (data ?? []) as Run[];
  setRuns(rows);
  const ids = [...new Set(rows.map(run => run.workflow_id))];
  if (ids.length) {
   const { data: workflows } = await supabase.from("workflows").select("id,name").in("id", ids);
   setWorkflowNames(Object.fromEntries(((workflows ?? []) as WorkflowName[]).map(workflow => [workflow.id, workflow.name])));
  } else setWorkflowNames({});
  setLoading(false);
 }, [userId]);

 useEffect(() => { void loadRuns(); }, [loadRuns]);

 const openRun = async (run: Run) => {
  if (!supabase) return;
  setSelectedRun(run); setSteps([]); setDetailLoading(true);
  const { data, error: stepError } = await supabase.from("workflow_run_steps").select("*").eq("run_id", run.id).eq("user_id", userId).order("position", { ascending: true });
  if (stepError) setError(stepError.message);
  else setSteps((data ?? []) as RunStep[]);
  setDetailLoading(false);
 };

 const visibleRuns = filter === "all" ? runs : runs.filter(run => run.status === filter);
 const successful = runs.filter(run => run.status === "success").length;
 const failed = runs.filter(run => run.status === "failed").length;

 return <div className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
   <div><p className="text-xs font-medium text-teal-300">WORKSPACE ACTIVITY</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Execution history</h1><p className="mt-2 text-sm text-slate-500">Track workflow runs and inspect every recorded step.</p></div>
   <button onClick={() => void loadRuns()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[.04] disabled:opacity-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""}/> Refresh</button>
  </div>
  <div className="mt-7 grid gap-4 sm:grid-cols-3">
   <div className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5"><div className="flex items-center justify-between text-xs text-slate-500">Total executions <Activity size={16} className="text-teal-300"/></div><div className="mt-3 text-2xl font-semibold tabular-nums">{runs.length}</div><p className="mt-1 text-[10px] text-slate-600">Latest 100 recorded runs</p></div>
   <div className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5"><div className="flex items-center justify-between text-xs text-slate-500">Successful <CheckCircle2 size={16} className="text-teal-300"/></div><div className="mt-3 text-2xl font-semibold tabular-nums">{successful}</div><p className="mt-1 text-[10px] text-slate-600">Completed successfully</p></div>
   <div className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5"><div className="flex items-center justify-between text-xs text-slate-500">Failed <XCircle size={16} className="text-rose-300"/></div><div className="mt-3 text-2xl font-semibold tabular-nums">{failed}</div><p className="mt-1 text-[10px] text-slate-600">Runs requiring attention</p></div>
  </div>
  {error && <div className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/[.06] px-4 py-3 text-xs text-rose-200">Could not load execution data: {error}</div>}
  <div className="mt-7 overflow-hidden rounded-2xl border border-white/[.07] bg-[#0d1422]">
   <div className="flex flex-col gap-3 border-b border-white/[.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="text-sm font-semibold">Recent runs</h2><p className="mt-1 text-[11px] text-slate-500">Select a run to inspect its step-by-step results.</p></div><select value={filter} onChange={event => setFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#090f1b] px-3 py-2 text-xs text-slate-300 outline-none"><option value="all">All statuses</option><option value="success">Success</option><option value="failed">Failed</option><option value="running">Running</option><option value="cancelled">Cancelled</option><option value="pending">Pending</option></select></div>
   {loading ? <div className="flex items-center justify-center gap-2 px-6 py-16 text-xs text-slate-500"><LoaderCircle size={16} className="animate-spin"/> Loading execution history…</div> : visibleRuns.length === 0 ? <div className="px-6 py-16 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/[.04] text-slate-500"><Clock3 size={21}/></span><p className="mt-4 text-sm font-medium text-slate-300">No executions found</p><p className="mt-1 text-xs text-slate-500">{filter === "all" ? "Run a workflow test to create your first history record." : "No runs match this status filter."}</p></div> :
    <div className="divide-y divide-white/[.05]">{visibleRuns.map(run => <button key={run.id} onClick={() => void openRun(run)} className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-left transition hover:bg-white/[.025] sm:grid-cols-[minmax(0,1.4fr)_120px_170px_20px] sm:px-6 ${selectedRun?.id === run.id ? "bg-teal-300/[.045]" : ""}`}><span className="min-w-0"><span className="block truncate text-xs font-semibold text-slate-200">{workflowNames[run.workflow_id] ?? "Workflow"}</span><span className="mt-1 block truncate font-mono text-[10px] text-slate-600">{run.id}</span></span><span className="justify-self-start"><StatusPill status={run.status}/></span><span className="col-span-2 flex items-center gap-1.5 text-[10px] text-slate-500 sm:col-span-1"><Clock3 size={12}/>{formatDate(run.created_at)}</span><ChevronRight size={15} className="hidden text-slate-600 sm:block"/></button>)}</div>}
   <div className="border-t border-white/[.06] px-6 py-3 text-[10px] text-slate-600">Showing {visibleRuns.length} of {runs.length} loaded executions</div>
  </div>
  {selectedRun && <section className="mt-6 overflow-hidden rounded-2xl border border-teal-300/15 bg-[#0d1422]">
   <div className="flex flex-col justify-between gap-3 border-b border-white/[.06] p-5 sm:flex-row sm:items-center sm:px-6"><div><p className="text-[10px] font-bold tracking-[.16em] text-teal-300">EXECUTION DETAILS</p><h2 className="mt-2 text-sm font-semibold">{workflowNames[selectedRun.workflow_id] ?? "Workflow"}</h2><p className="mt-1 font-mono text-[10px] text-slate-600">{selectedRun.id}</p></div><div className="flex items-center gap-3"><StatusPill status={selectedRun.status}/><button onClick={() => { setSelectedRun(null); setSteps([]); }} className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white" aria-label="Close details">×</button></div></div>
   <div className="grid gap-4 border-b border-white/[.06] p-5 sm:grid-cols-2 sm:px-6"><div><p className="text-[10px] text-slate-500">Started</p><p className="mt-1 text-xs text-slate-300">{formatDate(selectedRun.started_at)}</p></div><div><p className="text-[10px] text-slate-500">Finished</p><p className="mt-1 text-xs text-slate-300">{formatDate(selectedRun.finished_at)}</p></div><div className="sm:col-span-2"><p className="text-[10px] text-slate-500">Summary</p><p className="mt-1 text-xs leading-5 text-slate-300">{selectedRun.summary || "No summary recorded."}</p></div></div>
   <div className="p-5 sm:px-6"><h3 className="text-xs font-semibold text-slate-200">Step results</h3>{detailLoading ? <div className="flex items-center gap-2 py-8 text-xs text-slate-500"><LoaderCircle size={15} className="animate-spin"/> Loading step details…</div> : steps.length === 0 ? <p className="py-8 text-xs text-slate-500">No step records were found for this execution.</p> : <ol className="mt-4 space-y-3">{steps.map(step => <li key={step.id} className="flex gap-3 rounded-xl border border-white/[.06] bg-[#090f1b] p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.05] text-[11px] font-semibold text-slate-400">{step.position}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-slate-200">{step.node_name}</span><StatusPill status={step.status}/></div><p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">{step.node_type}</p>{step.error && <p className="mt-2 text-[11px] text-rose-300">{step.error}</p>}{step.input !== null && step.input !== undefined && <div className="mt-3"><p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-600">Input</p><pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-white/[.025] p-2 text-[10px] leading-5 text-slate-400">{typeof step.input === "string" ? step.input : JSON.stringify(step.input, null, 2)}</pre></div>}{step.output !== null && step.output !== undefined && <div className="mt-2"><p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-teal-300/70">Output</p><pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-white/[.025] p-2 text-[10px] leading-5 text-slate-400">{typeof step.output === "string" ? step.output : JSON.stringify(step.output, null, 2)}</pre></div>}</div></li>)}</ol>}</div>
  </section>}
 </div>;
}
