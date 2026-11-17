import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Blocks, CalendarClock,
  CheckCircle2, ChevronDown, CircleHelp, Clock3, Command, Filter,
  LayoutDashboard, Menu, MoreHorizontal, Plus, Search, Settings2,
  Workflow, Zap, X, Play, Pause, GitBranch, Webhook, Mail, MessageSquare,
} from "lucide-react";

type Flow = { id: number; name: string; description: string; status: "Active" | "Draft" | "Paused"; runs: string; updated: string; icon: "webhook" | "mail" | "message" };

const initialFlows: Flow[] = [
  { id: 1, name: "New customer welcome", description: "Webhook → Condition → Send email", status: "Active", runs: "1,284", updated: "2 min ago", icon: "webhook" },
  { id: 2, name: "Daily sales report", description: "Schedule → Fetch data → Send report", status: "Active", runs: "342", updated: "18 min ago", icon: "mail" },
  { id: 3, name: "Telegram order alerts", description: "Webhook → Format message → Telegram", status: "Paused", runs: "86", updated: "Yesterday", icon: "message" },
  { id: 4, name: "Lead qualification", description: "Form submit → IF / ELSE → Assign lead", status: "Draft", runs: "0", updated: "3 days ago", icon: "webhook" },
];

const navGroups = [
  { label: "WORKSPACE", items: [{ label: "Overview", icon: LayoutDashboard }, { label: "Workflows", icon: Workflow }, { label: "Executions", icon: Activity }, { label: "Integrations", icon: Blocks }] },
  { label: "PREFERENCES", items: [{ label: "Settings", icon: Settings2 }, { label: "Help center", icon: CircleHelp }] },
];

function FlowIcon({ type }: { type: Flow["icon"] }) {
  const Icon = type === "mail" ? Mail : type === "message" ? MessageSquare : Webhook;
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-teal-300/15 bg-teal-300/[.08] text-teal-300"><Icon size={18} /></span>;
}

export default function App() {
  const [flows, setFlows] = useState(initialFlows);
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const filteredFlows = useMemo(() => flows.filter(f => f.name.toLowerCase().includes(query.toLowerCase())), [flows, query]);

  function createFlow() {
    const name = newName.trim();
    if (!name) return;
    setFlows(current => [{ id: Date.now(), name, description: "Start building your automation", status: "Draft", runs: "0", updated: "Just now", icon: "webhook" }, ...current]);
    setNewName("");
    setShowCreate(false);
    setActiveNav("Workflows");
  }

  const sidebar = <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/[.07] bg-[#0a101d]">
    <a href="/" className="flex h-[76px] items-center gap-3 border-b border-white/[.07] px-6">
      <span className="grid h-9 w-9 place-items-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-300"><Workflow size={20}/></span>
      <span className="text-[15px] font-bold tracking-[.17em]">FLOWMATIC</span>
    </a>
    <div className="px-4 py-5">
      <button className="flex w-full items-center justify-between rounded-xl border border-white/[.08] bg-white/[.035] px-3 py-2.5 text-left hover:bg-white/[.06]">
        <span className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-400/15 text-xs font-bold text-indigo-200">M</span><span><span className="block text-xs font-semibold">My workspace</span><span className="mt-0.5 block text-[10px] text-slate-500">Free plan</span></span></span><ChevronDown size={15} className="text-slate-500"/>
      </button>
    </div>
    <nav className="flex-1 px-3">
      {navGroups.map(group => <div className="mb-7" key={group.label}><p className="mb-2 px-3 text-[9px] font-bold tracking-[.18em] text-slate-600">{group.label}</p>{group.items.map(item => <button key={item.label} onClick={() => { setActiveNav(item.label); setMobileNav(false); }} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${activeNav === item.label ? "bg-teal-300/[.11] font-medium text-teal-200" : "text-slate-400 hover:bg-white/[.04] hover:text-slate-200"}`}><item.icon size={17}/>{item.label}{item.label === "Executions" && <span className="ml-auto rounded-md bg-white/[.06] px-1.5 py-0.5 text-[10px] text-slate-500">12</span>}</button>)}</div>)}
    </nav>
    <div className="m-3 rounded-xl border border-teal-300/15 bg-gradient-to-br from-teal-300/[.09] to-transparent p-4"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal-200"><Zap size={14}/> Need more power?</div><p className="text-[11px] leading-5 text-slate-500">Explore higher limits and advanced workflow features.</p><button className="mt-3 text-[11px] font-semibold text-teal-300 hover:text-teal-200">Explore plans <span aria-hidden>→</span></button></div>
    <div className="flex items-center gap-3 border-t border-white/[.07] px-5 py-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-700 text-xs font-semibold">M</span><span className="min-w-0 flex-1"><span className="block text-xs font-medium">My account</span><span className="block text-[10px] text-slate-500">Free workspace</span></span><MoreHorizontal size={17} className="text-slate-500"/></div>
  </aside>;

  return <div className="min-h-screen bg-[#080d17] text-slate-100">
    <div className="flex min-h-screen">
      <div className="hidden lg:block">{sidebar}</div>
      {mobileNav && <div className="fixed inset-0 z-40 flex lg:hidden"><button aria-label="Close navigation" className="absolute inset-0 bg-black/70" onClick={() => setMobileNav(false)}/><div className="relative z-10">{sidebar}</div></div>}
      <main className="min-w-0 flex-1">
        <header className="flex h-[76px] items-center justify-between border-b border-white/[.07] px-5 sm:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-lg p-2 text-slate-400 hover:bg-white/[.06] lg:hidden" aria-label="Open navigation"><Menu size={20}/></button><div><div className="text-[11px] text-slate-500">Workspace / <span className="text-slate-300">{activeNav}</span></div><div className="mt-0.5 text-sm font-semibold">{activeNav}</div></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><button className="hidden items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-3 py-2 text-[11px] text-slate-500 sm:flex"><Command size={13}/> <span>Search</span><kbd className="ml-3 rounded border border-white/10 px-1.5 py-0.5 text-[9px]">⌘ K</kbd></button><button className="relative rounded-lg p-2 text-slate-400 hover:bg-white/[.06]" aria-label="Notifications"><Bell size={18}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-teal-300"/></button><span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-indigo-400/15 text-xs font-semibold text-indigo-200">M</span></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">
          {activeNav === "Overview" || activeNav === "Workflows" ? <>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-medium text-teal-300">WEDNESDAY, NOVEMBER 18, 2026</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">{activeNav === "Overview" ? "Good to see you again." : "Your workflows"}</h1><p className="mt-2 text-sm text-slate-500">{activeNav === "Overview" ? "Here’s what’s happening in your workspace today." : "Create, organize, and manage your automations."}</p></div><button onClick={() => setShowCreate(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-300 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-950/20 transition hover:bg-teal-200"><Plus size={16}/> Create workflow</button></div>
            {activeNav === "Overview" && <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[{label:"Total workflows",value:String(flows.length),change:"+2 this month",icon:Workflow,trend:"up"},{label:"Active workflows",value:String(flows.filter(f=>f.status==="Active").length),change:"Ready to run",icon:Zap,trend:"up"},{label:"Total executions",value:"1,712",change:"+12.8% this week",icon:Activity,trend:"up"},{label:"Success rate",value:"98.6%",change:"+2.4% this week",icon:CheckCircle2,trend:"up"}].map(card=><div key={card.label} className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5"><div className="flex items-center justify-between"><span className="text-xs text-slate-500">{card.label}</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-300/[.08] text-teal-300"><card.icon size={16}/></span></div><div className="mt-4 flex items-end justify-between"><span className="text-2xl font-semibold tracking-tight">{card.value}</span><span className="mb-1 flex items-center gap-1 text-[10px] text-teal-300"><ArrowUpRight size={13}/>{card.change}</span></div></div>)}
            </div>}
            {activeNav === "Overview" && <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
              <section className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Execution activity</h2><p className="mt-1 text-[11px] text-slate-500">Workflow runs over the last 7 days</p></div><button className="flex items-center gap-2 rounded-lg border border-white/[.08] px-3 py-2 text-[10px] text-slate-400">Last 7 days <ChevronDown size={13}/></button></div><div className="mt-7 flex h-36 items-end gap-2 sm:gap-4">{[{d:"Thu",h:42},{d:"Fri",h:65},{d:"Sat",h:35},{d:"Sun",h:52},{d:"Mon",h:76},{d:"Tue",h:60},{d:"Wed",h:91}].map((v,i)=><div key={v.d} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex h-full w-full items-end rounded-t-md bg-white/[.025]"><div className="w-full rounded-t-md bg-gradient-to-t from-teal-500/60 to-teal-300" style={{height:v.h+"%"}}/></div><span className="text-[10px] text-slate-600">{v.d}</span></div>)}</div><div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500"><span className="h-2 w-2 rounded-sm bg-teal-300"/> Executions <span className="ml-auto">1,712 total</span></div></section>
              <section className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Quick start</h2><p className="mt-1 text-[11px] text-slate-500">Get your first automation running</p></div><Zap size={17} className="text-teal-300"/></div><div className="mt-5 space-y-3">{[{icon:Plus,title:"Create a workflow",desc:"Start with a blank canvas",done:false},{icon:GitBranch,title:"Add your first steps",desc:"Connect triggers and actions",done:false},{icon:Play,title:"Run your automation",desc:"Test and activate your flow",done:false}].map((item,i)=><button onClick={() => setShowCreate(true)} key={item.title} className="flex w-full items-center gap-3 rounded-xl border border-white/[.06] p-3 text-left transition hover:border-teal-300/20 hover:bg-white/[.025]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[.05] text-slate-400"><item.icon size={15}/></span><span className="min-w-0 flex-1"><span className="block text-xs font-medium">{item.title}</span><span className="mt-1 block text-[10px] text-slate-500">{item.desc}</span></span><span className="h-4 w-4 rounded-full border border-slate-700"/></button>)}</div></section>
            </div>}
            <section className="mt-7 rounded-2xl border border-white/[.07] bg-[#0d1422]">
              <div className="flex flex-col gap-4 border-b border-white/[.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="text-sm font-semibold">{activeNav === "Overview" ? "Recent workflows" : "All workflows"}</h2><p className="mt-1 text-[11px] text-slate-500">Manage and monitor your automations</p></div><div className="flex gap-2"><div className="relative min-w-0 flex-1 sm:w-52"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search workflows..." className="w-full rounded-lg border border-white/[.08] bg-[#090f1b] py-2 pl-9 pr-3 text-xs outline-none placeholder:text-slate-600 focus:border-teal-300/40"/></div><button className="rounded-lg border border-white/[.08] p-2 text-slate-400 hover:bg-white/[.05]" aria-label="Filter workflows"><Filter size={15}/></button></div></div>
              <div className="hidden grid-cols-[minmax(0,1.6fr)_110px_100px_110px_32px] gap-4 px-6 py-3 text-[9px] font-semibold tracking-[.12em] text-slate-600 sm:grid"><span>WORKFLOW</span><span>STATUS</span><span>EXECUTIONS</span><span>LAST UPDATED</span><span/></div>
              <div className="divide-y divide-white/[.05]">{filteredFlows.map(flow=><div key={flow.id} className="grid gap-3 px-5 py-4 transition hover:bg-white/[.02] sm:grid-cols-[minmax(0,1.6fr)_110px_100px_110px_32px] sm:items-center sm:gap-4 sm:px-6"><div className="flex min-w-0 items-center gap-3"><FlowIcon type={flow.icon}/><div className="min-w-0"><div className="truncate text-xs font-medium">{flow.name}</div><div className="mt-1 truncate text-[10px] text-slate-500">{flow.description}</div></div></div><div><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-medium ${flow.status==="Active"?"bg-teal-300/10 text-teal-300":flow.status==="Paused"?"bg-amber-300/10 text-amber-300":"bg-slate-700/40 text-slate-400"}`}><span className={`h-1.5 w-1.5 rounded-full ${flow.status==="Active"?"bg-teal-300":flow.status==="Paused"?"bg-amber-300":"bg-slate-500"}`}/>{flow.status}</span></div><div className="flex items-center gap-2 text-[11px] text-slate-300 sm:block">{flow.runs}<span className="ml-1 text-[10px] text-slate-600 sm:hidden">runs</span></div><div className="text-[10px] text-slate-500">{flow.updated}</div><button className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-white/[.06] hover:text-white sm:block" aria-label={`More options for ${flow.name}`}><MoreHorizontal size={17}/></button></div>)}
              {filteredFlows.length===0 && <div className="px-6 py-12 text-center text-xs text-slate-500">No workflows match “{query}”.</div>}
              </div>
              <div className="border-t border-white/[.06] px-6 py-3 text-[10px] text-slate-500">Showing {filteredFlows.length} of {flows.length} workflows</div>
            </section>
            <div className="mt-6 flex flex-col justify-between gap-2 text-[10px] text-slate-600 sm:flex-row"><span>FLOWMATIC · Connect. Automate. Grow.</span><span className="flex items-center gap-3"><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-teal-300"/> All systems operational</span><span>v0.2.0</span></span></div>
          </> : <div className="flex min-h-[65vh] flex-col items-center justify-center text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl border border-teal-300/20 bg-teal-300/10 text-teal-300"><Settings2 size={25}/></span><h1 className="mt-5 text-xl font-semibold">{activeNav}</h1><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">This section is part of the FLOWMATIC workspace. We’ll connect its functionality in the next development phase.</p><button onClick={() => setActiveNav("Overview")} className="mt-6 rounded-lg border border-white/10 px-4 py-2 text-xs text-slate-300 hover:bg-white/[.05]">Back to overview</button></div>}
        </div>
      </main>
    </div>
    {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCreate(false)}}><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101827] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-base font-semibold">Create a workflow</h2><button onClick={() => setShowCreate(false)} className="rounded-lg p-2 text-slate-500 hover:bg-white/[.06]" aria-label="Close"><X size={17}/></button></div><p className="mt-2 text-xs leading-5 text-slate-500">Give your automation a name. You can add triggers and actions in the builder next.</p><label className="mt-6 block text-xs font-medium text-slate-300" htmlFor="flow-name">Workflow name</label><input id="flow-name" autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")createFlow()}} placeholder="e.g. New order notification" className="mt-2 w-full rounded-xl border border-white/10 bg-[#090f1b] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-teal-300/50"/><div className="mt-6 flex justify-end gap-2"><button onClick={() => setShowCreate(false)} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[.05]">Cancel</button><button onClick={createFlow} disabled={!newName.trim()} className="rounded-lg bg-teal-300 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-40">Create workflow <ArrowUpRight className="ml-1 inline" size={13}/></button></div></div></div>}
  </div>;
}
