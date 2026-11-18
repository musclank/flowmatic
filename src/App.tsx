import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import AuthScreen from "./AuthScreen";
import ExecutionHistory from "./ExecutionHistory";
import { supabase } from "./lib/supabase";
import { addEdge, Background, Controls, Handle, MiniMap, Position, ReactFlow, useEdgesState, useNodesState, type Connection, type Edge, type Node, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Activity, ArrowLeft, ArrowUpRight, Bell, Blocks, CheckCircle2, ChevronDown, CircleHelp, Command, Filter, GitBranch, LayoutDashboard, Mail, Menu, MoreHorizontal, Plus, Play, Search, Settings2, Workflow, Zap, X, Webhook, MessageSquare, Save, Trash2 } from "lucide-react";

type Flow = { id: number; name: string; description: string; status: "Active" | "Draft" | "Paused"; runs: string; updated: string; icon: "webhook" | "mail" | "message" };
type StepKind = "trigger" | "action" | "condition";
type StepData = { label: string; subtitle: string; kind: StepKind; config: string };
type FlowNode = Node<StepData>;

const initialNodes: FlowNode[] = [
 { id: "trigger-1", type: "flowStep", position: { x: 90, y: 70 }, data: { label: "Webhook trigger", subtitle: "Receive an incoming event", kind: "trigger", config: "Listen for an incoming HTTP request. Configure the webhook URL when the trigger service is connected." } },
 { id: "condition-1", type: "flowStep", position: { x: 90, y: 250 }, data: { label: "Check customer type", subtitle: "Route with IF / ELSE logic", kind: "condition", config: "Condition: customer.type equals new. Matching items follow the Yes path." } },
 { id: "action-1", type: "flowStep", position: { x: 90, y: 450 }, data: { label: "Send welcome email", subtitle: "Email action · Gmail", kind: "action", config: "To: {{customer.email}}. Subject: Welcome aboard! Connect an email integration to execute this step." } },
];
const initialEdges: Edge[] = [
 {id:"e-trigger-condition",source:"trigger-1",target:"condition-1",animated:true,style:{stroke:"#64748b",strokeWidth:2}},
 {id:"e-condition-action",source:"condition-1",sourceHandle:"yes",target:"action-1",animated:true,label:"YES",labelStyle:{fill:"#5eead4",fontSize:10},style:{stroke:"#5eead4",strokeWidth:2}},
];
const nodeTypes = { flowStep: FlowStepNode };
function FlowStepNode({ data, selected }: NodeProps<FlowNode>) {
 const theme = data.kind === "trigger" ? { border:"border-sky-300/40", bg:"bg-sky-300/[.07]", icon:"text-sky-300", chip:"TRIGGER", Icon:Webhook } : data.kind === "condition" ? { border:"border-violet-300/40", bg:"bg-violet-300/[.07]", icon:"text-violet-300", chip:"CONDITION", Icon:GitBranch } : { border:"border-teal-300/40", bg:"bg-teal-300/[.07]", icon:"text-teal-300", chip:"ACTION", Icon:Zap };
 const Icon = theme.Icon;
 return <div className={`w-[250px] rounded-xl border ${theme.border} ${theme.bg} bg-[#101a2a] shadow-xl shadow-black/30 ${selected ? "ring-2 ring-teal-300/50" : ""}`}>
  {data.kind !== "trigger" && <Handle type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border-2 !border-[#0b1220] !bg-slate-400"/>}
  <div className="flex items-center gap-3 p-3.5"><span className={`grid h-9 w-9 place-items-center rounded-lg bg-white/[.05] ${theme.icon}`}><Icon size={18}/></span><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-slate-100">{data.label}</div><div className="mt-1 truncate text-[10px] text-slate-500">{data.subtitle}</div></div><span className={`text-[8px] font-bold tracking-wider ${theme.icon}`}>{theme.chip}</span></div>
  <div className="border-t border-white/[.07] px-3.5 py-2 text-[9px] text-slate-500">Click to configure</div>
  {data.kind === "condition" ? <><Handle id="yes" type="source" position={Position.Bottom} style={{left:"32%"}} className="!h-2.5 !w-2.5 !border-2 !border-[#0b1220] !bg-teal-300"/><Handle id="no" type="source" position={Position.Bottom} style={{left:"68%"}} className="!h-2.5 !w-2.5 !border-2 !border-[#0b1220] !bg-amber-300"/></> : <Handle type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border-2 !border-[#0b1220] !bg-teal-300"/>}
 </div>;
}
const navGroups = [
 { label:"WORKSPACE", items:[{label:"Overview",icon:LayoutDashboard},{label:"Workflows",icon:Workflow},{label:"Executions",icon:Activity},{label:"Integrations",icon:Blocks}] },
 { label:"PREFERENCES", items:[{label:"Settings",icon:Settings2},{label:"Help center",icon:CircleHelp}] },
];
function FlowIcon({type}:{type:Flow["icon"]}) { const Icon=type==="mail"?Mail:type==="message"?MessageSquare:Webhook; return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-teal-300/15 bg-teal-300/[.08] text-teal-300"><Icon size={18}/></span>; }


function LandingPage() {
 return <div className="min-h-screen overflow-hidden bg-[#080d17] text-slate-100">
  <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
   <a href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-300"><Workflow size={21}/></span><span className="text-sm font-bold tracking-[.2em]">FLOWMATIC</span></a>
   <nav className="hidden items-center gap-8 text-xs text-slate-400 md:flex"><a href="#features" className="hover:text-white">Features</a><a href="#how-it-works" className="hover:text-white">How it works</a><a href="#integrations" className="hover:text-white">Integrations</a></nav>
   <div className="flex items-center gap-3"><a href="/dashboard" className="hidden text-xs text-slate-300 hover:text-white sm:inline">Open dashboard</a><a href="/dashboard" className="rounded-lg bg-teal-300 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-200">Start building free <ArrowUpRight className="ml-1 inline" size={13}/></a></div>
  </header>
  <main>
   <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:pb-32">
    <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-teal-400/[.08] blur-3xl"/>
    <div className="relative"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/[.06] px-3 py-1.5 text-[10px] font-semibold tracking-[.16em] text-teal-200"><span className="h-1.5 w-1.5 rounded-full bg-teal-300"/> AUTOMATION, WITHOUT THE COMPLEXITY</div>
     <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-[68px]">Make work flow.<br/><span className="text-teal-300">Automatically.</span></h1>
     <p className="mt-6 max-w-xl text-base leading-7 text-slate-400">Connect your tools, build visual workflows, and automate repetitive tasks — without the complexity.</p>
     <div className="mt-9 flex flex-wrap gap-3"><a href="/dashboard" className="rounded-xl bg-teal-300 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-teal-200">Start building free <ArrowUpRight className="ml-2 inline" size={15}/></a><a href="#how-it-works" className="rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/[.04]">Explore how it works</a></div>
     <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[11px] text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-teal-300"/> No-code visual builder</span><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-teal-300"/> Start with free tools</span></div>
    </div>
    <div className="relative mx-auto w-full max-w-xl"><div className="absolute -inset-5 rounded-[2rem] bg-teal-300/[.06] blur-2xl"/><div className="relative rounded-2xl border border-white/10 bg-[#0d1625] p-4 shadow-2xl shadow-black/40 sm:p-6"><div className="flex items-center justify-between border-b border-white/[.07] pb-4"><div><div className="text-xs font-semibold">Customer welcome flow</div><div className="mt-1 text-[10px] text-slate-500">Visual workflow preview</div></div><span className="rounded-full bg-teal-300/10 px-2.5 py-1 text-[9px] font-semibold text-teal-300">DRAFT</span></div><div className="mx-auto flex max-w-xs flex-col items-center py-5">
      <div className="flex w-full items-center gap-3 rounded-xl border border-sky-300/25 bg-sky-300/[.06] p-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-300/10 text-sky-300"><Webhook size={18}/></span><span><span className="block text-xs font-semibold">Webhook trigger</span><span className="mt-1 block text-[10px] text-slate-500">New customer event</span></span></div><div className="h-8 w-px bg-slate-600"/><div className="flex w-full items-center gap-3 rounded-xl border border-violet-300/25 bg-violet-300/[.06] p-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-300/10 text-violet-300"><GitBranch size={18}/></span><span><span className="block text-xs font-semibold">Check customer type</span><span className="mt-1 block text-[10px] text-slate-500">IF / ELSE condition</span></span></div><div className="flex h-8 w-full items-center justify-around"><span className="h-full w-px bg-teal-300/60"/><span className="h-full w-px bg-amber-300/50"/></div><div className="grid w-full grid-cols-2 gap-3"><div className="rounded-xl border border-teal-300/25 bg-teal-300/[.05] p-3"><span className="text-[9px] font-bold text-teal-300">YES</span><div className="mt-2 flex items-center gap-2"><Mail size={15} className="text-teal-300"/><span className="text-[10px] font-semibold">Send email</span></div></div><div className="rounded-xl border border-amber-300/20 bg-amber-300/[.04] p-3"><span className="text-[9px] font-bold text-amber-300">NO</span><div className="mt-2 flex items-center gap-2"><MessageSquare size={15} className="text-amber-300"/><span className="text-[10px] font-semibold">Notify team</span></div></div></div>
     </div></div></div>
   </section>
   <section id="features" className="border-y border-white/[.06] bg-[#0b1220] px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="text-[10px] font-bold tracking-[.2em] text-teal-300">BUILT FOR YOUR WORKFLOW</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Automation that works the way you do.</h2><p className="mt-4 text-sm leading-6 text-slate-400">Everything you need to turn repetitive work into reliable workflows.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[{icon:Workflow,title:"Visual workflow builder",desc:"Build automations by connecting steps on an intuitive canvas."},{icon:GitBranch,title:"Flexible logic",desc:"Add conditions and branching paths to handle real-world processes."},{icon:Activity,title:"Reliable execution",desc:"Understand what happened with execution history and step-level logs."},{icon:Blocks,title:"Connected tools",desc:"Bring your favorite services together as integrations become available."}].map(item=><article key={item.title} className="rounded-2xl border border-white/[.07] bg-[#0e1726] p-5"><item.icon size={21} className="text-teal-300"/><h3 className="mt-5 text-sm font-semibold">{item.title}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{item.desc}</p></article>)}</div></div></section>
   <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-[10px] font-bold tracking-[.2em] text-teal-300">HOW IT WORKS</p><h2 className="mt-3 text-3xl font-semibold">From manual tasks to automated flows.</h2><p className="mt-4 text-sm leading-6 text-slate-400">Start small. Connect the steps. Let your workflow handle the routine.</p></div><div className="grid gap-5 sm:grid-cols-3">{[{n:"01",t:"Choose a trigger",d:"Decide what starts your workflow."},{n:"02",t:"Connect actions",d:"Add the tasks you want to automate."},{n:"03",t:"Add your logic",d:"Route tasks with conditions and branches."}].map(s=><div key={s.n} className="border-l border-teal-300/30 pl-5"><span className="text-xs font-bold text-teal-300">{s.n}</span><h3 className="mt-4 text-sm font-semibold">{s.t}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{s.d}</p></div>)}</div></div></section>
   <section id="integrations" className="border-y border-white/[.06] bg-[#0b1220] px-5 py-16 text-center sm:px-8"><p className="text-[10px] font-bold tracking-[.2em] text-teal-300">INTEGRATIONS</p><h2 className="mt-3 text-2xl font-semibold">Your tools. One connected workflow.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">Our integrations directory is coming soon. Start exploring the visual builder today.</p><a href="/dashboard" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-teal-300/30 px-5 py-3 text-xs font-semibold text-teal-200 hover:bg-teal-300/[.06]">Open the workflow builder <ArrowUpRight size={14}/></a></section>
  </main>
  <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span className="font-bold tracking-[.18em] text-slate-400">FLOWMATIC</span><span>Connect. Automate. Grow.</span><span>© 2026 FLOWMATIC. All rights reserved.</span></footer>
 </div>;
}

export default function App() {
 const [session,setSession]=useState<Session|null>(null);
 const [authReady,setAuthReady]=useState(false);
 useEffect(()=>{
  if(!supabase){setAuthReady(true);return;}
  supabase.auth.getSession().then(({data})=>{setSession(data.session);setAuthReady(true);});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>setSession(nextSession));
  return ()=>subscription.unsubscribe();
 },[]);
 const [flows,setFlows]=useState<Flow[]>([]);
 const [activeNav,setActiveNav]=useState("Overview");
 const [query,setQuery]=useState("");
 const [showCreate,setShowCreate]=useState(false);
 const [newName,setNewName]=useState("");
 const [mobileNav,setMobileNav]=useState(false);
 const [builderFlow,setBuilderFlow]=useState<Flow|null>(null);
 const [nodes,setNodes,onNodesChange]=useNodesState<FlowNode>(initialNodes);
 const [edges,setEdges,onEdgesChange]=useEdgesState<Edge>(initialEdges);
 const [savedWorkflows,setSavedWorkflows]=useState<Record<string,{nodes:FlowNode[];edges:Edge[]}>>({});
 useEffect(()=>{
  if(!session||!supabase)return;
  let cancelled=false;
  (async()=>{
   const {data,error}=await supabase.from("workflows").select("*").order("updated_at",{ascending:false});
   if(cancelled)return;
   if(error){console.error("Could not load workflows",error);return;}
   const rows=data??[];
   setFlows(rows.map(row=>({id:Number(row.id),name:row.name,description:row.description??"",status:row.status,runs:row.runs??"0",updated:new Date(row.updated_at).toLocaleString(),icon:"webhook" as const})));
   setSavedWorkflows(Object.fromEntries(rows.map(row=>[String(row.id),{nodes:(row.nodes??[]) as FlowNode[],edges:(row.edges??[]) as Edge[]}])));
  })();
  return ()=>{cancelled=true;};
 },[session?.user.id]);
 const [selectedNodeId,setSelectedNodeId]=useState<string|null>(null);
 const [savedNotice,setSavedNotice]=useState(false);
 const [testResult,setTestResult]=useState<string[]>([]);
 const [runBusy,setRunBusy]=useState(false);
 const filteredFlows=useMemo(()=>flows.filter(f=>f.name.toLowerCase().includes(query.toLowerCase())),[flows,query]);
 const selectedNode=nodes.find(n=>n.id===selectedNodeId)??null;
 function openBuilder(flow:Flow){const saved=savedWorkflows[String(flow.id)];setBuilderFlow(flow);setNodes(saved?.nodes??initialNodes);setEdges(saved?.edges??initialEdges);setSelectedNodeId(null);setSavedNotice(false);setTestResult([]);}
 async function saveDraft(){
  if(!builderFlow||!session||!supabase)return;
  const payload={id:String(builderFlow.id),user_id:session.user.id,name:builderFlow.name,description:builderFlow.description,status:builderFlow.status,runs:builderFlow.runs,nodes,edges,updated_at:new Date().toISOString()};
  const {error}=await supabase.from("workflows").upsert(payload,{onConflict:"id"});
  if(error){console.error(error);window.alert("Could not save workflow: "+error.message);return;}
  setSavedWorkflows(current=>({...current,[String(builderFlow.id)]:{nodes,edges}}));
  setSavedNotice(true);
 }
 async function createFlow(){
  const name=newName.trim();if(!name||!session||!supabase)return;
  const flow:Flow={id:Date.now(),name,description:"Start building your automation",status:"Draft",runs:"0",updated:"Just now",icon:"webhook"};
  const {error}=await supabase.from("workflows").insert({id:String(flow.id),user_id:session.user.id,name:flow.name,description:flow.description,status:flow.status,runs:flow.runs,nodes:initialNodes,edges:initialEdges});
  if(error){window.alert("Could not create workflow: "+error.message);return;}
  setFlows(current=>[flow,...current]);setSavedWorkflows(current=>({...current,[String(flow.id)]:{nodes:initialNodes,edges:initialEdges}}));setNewName("");setShowCreate(false);setActiveNav("Workflows");openBuilder(flow);
 }
 function addStep(kind:StepKind){const count=nodes.filter(n=>n.data.kind===kind).length+1;const id=`${kind}-${Date.now()}`;const defaults=kind==="trigger"?{label:"Webhook trigger",subtitle:"Receive an incoming event",config:"Listen for an incoming HTTP request."}:kind==="condition"?{label:"Condition",subtitle:"IF / ELSE logic",config:"Set the condition that decides which path to follow."}:{label:"New action",subtitle:"Configure an action",config:"Choose an app and configure the action."};const newNode:FlowNode={id,type:"flowStep",position:{x:430+(count%2)*30,y:100+nodes.length*35},data:{...defaults,kind}};setNodes(current=>[...current,newNode]);setSelectedNodeId(id);}
 function updateSelected(field:"label"|"config",value:string){if(!selectedNodeId)return;setNodes(current=>current.map(n=>n.id===selectedNodeId?{...n,data:{...n.data,[field]:value}}:n));}
 function removeSelected(){if(!selectedNodeId)return;setNodes(current=>current.filter(n=>n.id!==selectedNodeId));setEdges(current=>current.filter(e=>e.source!==selectedNodeId&&e.target!==selectedNodeId));setSelectedNodeId(null);}
 async function runTest(){
  if(runBusy||!builderFlow||!session||!supabase)return;
  setRunBusy(true);setTestResult(["Validating workflow…"]);
  const runId=crypto.randomUUID();
  const incoming=new Set(edges.map(edge=>edge.target));
  const roots=nodes.filter(node=>node.data.kind==="trigger"&&!incoming.has(node.id));
  const invalidEdges=edges.filter(edge=>!nodes.some(n=>n.id===edge.source)||!nodes.some(n=>n.id===edge.target));
  if(nodes.length===0||roots.length!==1||invalidEdges.length){
   setTestResult([nodes.length===0?"Validation failed: add at least one step.":roots.length!==1?"Validation failed: the workflow must have exactly one unconnected trigger.":"Validation failed: a connection points to a missing step.","No execution was started."]);setRunBusy(false);return;
  }
  const visited=new Set<string>();const ordered:FlowNode[]=[];const queue=[roots[0].id];let cycle=false;let branchNote="";
  while(queue.length){
   const id=queue.shift()!;if(visited.has(id)){cycle=true;continue;}
   const node=nodes.find(item=>item.id===id);if(!node)continue;
   visited.add(id);ordered.push(node);
   let next=edges.filter(edge=>edge.source===id);
   if(node.data.kind==="condition"){
    const yes=/equals\s+new|customer\.type.*new/i.test(node.data.config);
    branchNote=`Condition evaluated with demo input (customer.type = new): ${yes?"YES":"NO"}.`;
    next=next.filter(edge=>edge.sourceHandle===(yes?"yes":"no"));
   }
   next.forEach(edge=>{if(visited.has(edge.target))cycle=true;else if(!queue.includes(edge.target))queue.push(edge.target);});
  }
  const disconnected=nodes.filter(node=>!visited.has(node.id));
  if(cycle||disconnected.length){
   setTestResult([cycle?"Validation failed: a cycle was detected.":`Validation failed: ${disconnected.length} step(s) are disconnected from the trigger.`,"Connect all steps to a valid path, then run the test again.","No execution was started."]);setRunBusy(false);return;
  }
  const started=new Date().toISOString();
  const {data:runData,error:runError}=await supabase.from("workflow_runs").insert({id:runId,workflow_id:String(builderFlow.id),user_id:session.user.id,status:"running",started_at:started,trigger_data:{customer:{type:"new",email:"demo@example.com"}},summary:"Safe simulation; no external services called."}).select("id").single();
  if(runError){setTestResult([`Could not save execution: ${runError.message}`,"Run supabase/migrations/20261118_execution_engine_v1.sql in Supabase SQL Editor, then retry."]);setRunBusy(false);return;}
  const lines=[`Execution ${runData.id.slice(0,8)} · RUNNING`];setTestResult(lines);
  let failed=false;
  for(let i=0;i<ordered.length;i++){
   const node=ordered[i],stepId=crypto.randomUUID();
   const {error:insertError}=await supabase.from("workflow_run_steps").insert({id:stepId,run_id:runId,workflow_id:String(builderFlow.id),user_id:session.user.id,node_id:node.id,node_name:node.data.label,node_type:node.data.kind,position:i+1,status:"running",input:{simulation:true},started_at:new Date().toISOString()});
   if(insertError){failed=true;lines.push(`${i+1}. ${node.data.label} — FAILED: ${insertError.message}`);break;}
   const {error:updateError}=await supabase.from("workflow_run_steps").update({status:"success",output:{simulation:true,message:"Step simulated; no external action performed."},finished_at:new Date().toISOString()}).eq("id",stepId);
   if(updateError){failed=true;lines.push(`${i+1}. ${node.data.label} — FAILED: ${updateError.message}`);break;}
   lines.push(`${i+1}. ${node.data.label} — SUCCESS · simulated`);setTestResult([...lines]);
  }
  if(branchNote)lines.push(branchNote);
  await supabase.from("workflow_runs").update({status:failed?"failed":"success",finished_at:new Date().toISOString(),summary:failed?"Execution stopped because a step could not be saved.":"Simulation completed successfully."}).eq("id",runId);
  lines.push(failed?"Execution failed. Check database permissions and run details.":"Execution completed successfully in safe simulation mode.");
  lines.push("No email, webhook, or external service was called.");setTestResult(lines);setRunBusy(false);
 }
 const sidebar=<aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/[.07] bg-[#0a101d]">
  <a href="/" className="flex h-[76px] items-center gap-3 border-b border-white/[.07] px-6"><span className="grid h-9 w-9 place-items-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-300"><Workflow size={20}/></span><span className="text-[15px] font-bold tracking-[.17em]">FLOWMATIC</span></a>
  <div className="px-4 py-5"><button className="flex w-full items-center justify-between rounded-xl border border-white/[.08] bg-white/[.035] px-3 py-2.5 text-left"><span className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-400/15 text-xs font-bold text-indigo-200">M</span><span><span className="block text-xs font-semibold">My workspace</span><span className="mt-0.5 block text-[10px] text-slate-500">Free plan</span></span></span><ChevronDown size={15} className="text-slate-500"/></button></div>
  <nav className="flex-1 px-3">{navGroups.map(group=><div className="mb-7" key={group.label}><p className="mb-2 px-3 text-[9px] font-bold tracking-[.18em] text-slate-600">{group.label}</p>{group.items.map(item=><button key={item.label} onClick={()=>{setActiveNav(item.label);setMobileNav(false);setBuilderFlow(null);}} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] ${activeNav===item.label&&!builderFlow?"bg-teal-300/[.11] font-medium text-teal-200":"text-slate-400 hover:bg-white/[.04]"}`}><item.icon size={17}/>{item.label}</button>)}</div>)}</nav>
  <div className="m-3 rounded-xl border border-teal-300/15 bg-teal-300/[.05] p-4"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal-200"><Zap size={14}/> Need more power?</div><p className="text-[11px] leading-5 text-slate-500">Explore higher limits and advanced workflow features.</p><button className="mt-3 text-[11px] font-semibold text-teal-300">Explore plans →</button></div>
  <div className="flex items-center gap-3 border-t border-white/[.07] px-5 py-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-700 text-xs font-semibold">M</span><span className="min-w-0 flex-1"><span className="block text-xs font-medium">My account</span><span className="block text-[10px] text-slate-500">Free workspace</span></span><MoreHorizontal size={17} className="text-slate-500"/></div>
 </aside>;
 if (window.location.pathname !== "/dashboard" && !window.location.pathname.startsWith("/builder/") && window.location.pathname !== "/workflows") return <LandingPage/>;
 if(!authReady)return <div className="flex min-h-screen items-center justify-center bg-[#080d17] text-sm text-slate-400">Loading your workspace...</div>;
 if(!session||!supabase)return <AuthScreen/>;
 return <div className="min-h-screen bg-[#080d17] text-slate-100"><div className="flex min-h-screen">
  <div className="hidden lg:block">{sidebar}</div>{mobileNav&&<div className="fixed inset-0 z-40 flex lg:hidden"><button aria-label="Close navigation" className="absolute inset-0 bg-black/70" onClick={()=>setMobileNav(false)}/><div className="relative z-10">{sidebar}</div></div>}
  <main className="flex min-w-0 flex-1 flex-col">
   <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[.07] px-5 sm:px-8"><div className="flex items-center gap-3"><button onClick={()=>setMobileNav(true)} className="rounded-lg p-2 text-slate-400 lg:hidden" aria-label="Open navigation"><Menu size={20}/></button><div><div className="text-[11px] text-slate-500">Workspace / <span className="text-slate-300">{builderFlow?"Builder":activeNav}</span></div><div className="mt-0.5 text-sm font-semibold">{builderFlow?builderFlow.name:activeNav}</div></div></div><div className="flex items-center gap-2 sm:gap-4"><button className="hidden items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-3 py-2 text-[11px] text-slate-500 sm:flex"><Command size={13}/> Search <kbd className="ml-3 rounded border border-white/10 px-1.5 py-0.5 text-[9px]">⌘ K</kbd></button><button className="relative rounded-lg p-2 text-slate-400" aria-label="Notifications"><Bell size={18}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-teal-300"/></button><button onClick={()=>supabase?.auth.signOut()} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] text-slate-400 hover:text-white">Sign out</button><span className="hidden sm:grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-indigo-400/15 text-xs font-semibold text-indigo-200">{session.user.email?.slice(0,1).toUpperCase()??"U"}</span></div></header>
   {builderFlow?<section className="flex min-h-0 flex-1 flex-col">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.07] px-5 py-3 sm:px-7"><div className="flex items-center gap-3"><button onClick={()=>setBuilderFlow(null)} className="rounded-lg border border-white/10 p-2 text-slate-400" aria-label="Back to workflows"><ArrowLeft size={16}/></button><div><div className="text-xs font-semibold">{builderFlow.name}</div><div className="mt-1 text-[10px] text-slate-500">Visual editor · Draft</div></div></div><div className="flex items-center gap-2"><span className="hidden text-[10px] text-slate-500 sm:block">Cloud sync enabled</span><button onClick={saveDraft} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-slate-300"><Save size={14}/> Save draft</button><button onClick={runTest} disabled={runBusy} className="inline-flex items-center gap-2 rounded-lg bg-teal-300 px-3 py-2 text-[11px] font-bold text-slate-950 disabled:opacity-50"><Play size={13}/> {runBusy?"Running…":"Run test"}</button></div></div>
    {savedNotice&&<div className="border-b border-teal-300/15 bg-teal-300/[.06] px-6 py-2 text-[11px] text-teal-200">Workflow saved to your Supabase cloud workspace.</div>}
    {testResult.length>0&&<div className="border-b border-sky-300/15 bg-sky-300/[.045] px-5 py-3 sm:px-7"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold tracking-[.14em] text-sky-200">TEST PREVIEW</span><button onClick={()=>setTestResult([])} className="text-[10px] text-slate-500 hover:text-white">Clear</button></div><ol className="space-y-1.5">{testResult.map((line,index)=><li key={index} className="text-[10px] leading-5 text-slate-300">{line}</li>)}</ol></div>}
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
     <aside className="order-2 w-full shrink-0 border-t border-white/[.07] bg-[#0a101d] lg:order-1 lg:w-52 lg:border-r lg:border-t-0"><div className="border-b border-white/[.06] px-4 py-4"><div className="text-[10px] font-bold tracking-[.15em] text-slate-400">ADD A STEP</div><p className="mt-1 text-[10px] text-slate-600">Choose a node type</p></div><div className="grid grid-cols-3 gap-2 p-3 lg:grid-cols-1">{([{kind:"trigger",label:"Trigger",desc:"Start your flow",Icon:Webhook},{kind:"action",label:"Action",desc:"Perform a task",Icon:Zap},{kind:"condition",label:"Condition",desc:"Branch your logic",Icon:GitBranch}] as const).map(item=><button key={item.kind} onClick={()=>addStep(item.kind)} className="flex items-center gap-3 rounded-xl border border-white/[.07] p-2.5 text-left hover:border-teal-300/30 hover:bg-white/[.035]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[.05] text-teal-300"><item.Icon size={16}/></span><span><span className="block text-[11px] font-semibold">{item.label}</span><span className="hidden text-[9px] text-slate-500 lg:block">{item.desc}</span></span><Plus size={13} className="ml-auto hidden text-slate-500 lg:block"/></button>)}</div><div className="mt-auto hidden border-t border-white/[.06] p-4 text-[10px] leading-5 text-slate-600 lg:block">Drag nodes to arrange your flow. Connect handles to define execution order.</div></aside>
     <div className="relative order-1 min-h-[420px] flex-1 bg-[#080e19] lg:order-2"><div className="absolute left-4 top-4 z-10 rounded-lg border border-white/[.08] bg-[#101827]/90 px-3 py-2 text-[10px] text-slate-400">CANVAS <span className="ml-2 text-slate-600">{nodes.length} nodes · {edges.length} connections</span></div><ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={(connection:Connection)=>setEdges(current=>addEdge({...connection,animated:true,style:{stroke:"#5eead4",strokeWidth:2}},current))} onNodeClick={(_,node)=>setSelectedNodeId(node.id)} onPaneClick={()=>setSelectedNodeId(null)} nodeTypes={nodeTypes} fitView minZoom={0.25} maxZoom={1.5}><Background color="#243247" gap={22} size={1}/><MiniMap nodeColor={node=>node.data.kind==="trigger"?"#38bdf8":node.data.kind==="condition"?"#a78bfa":"#5eead4"} maskColor="rgba(3,8,18,.7)" className="!border !border-white/10 !bg-[#111a29]"/><Controls className="!overflow-hidden !rounded-lg !border !border-white/10 !bg-[#111a29] [&>button]:!border-white/10 [&>button]:!bg-[#111a29]"/></ReactFlow></div>
     <aside className="order-3 w-full shrink-0 border-t border-white/[.07] bg-[#0a101d] lg:w-64 lg:border-l lg:border-t-0"><div className="border-b border-white/[.06] px-4 py-4"><div className="text-[10px] font-bold tracking-[.15em] text-slate-400">PROPERTIES</div><p className="mt-1 text-[10px] text-slate-600">Configure selected step</p></div>{selectedNode?<div className="space-y-4 p-4"><div className="flex items-center gap-2"><span className="rounded-md bg-teal-300/10 px-2 py-1 text-[9px] font-bold uppercase text-teal-300">{selectedNode.data.kind}</span><span className="text-[10px] text-slate-600">ID: {selectedNode.id.slice(0,12)}</span></div><label className="block text-[10px] font-medium text-slate-400">Node name<input value={selectedNode.data.label} onChange={e=>updateSelected("label",e.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#080e19] px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-teal-300/40"/></label><label className="block text-[10px] font-medium text-slate-400">Configuration<textarea value={selectedNode.data.config} onChange={e=>updateSelected("config",e.target.value)} rows={5} className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-[#080e19] px-3 py-2.5 text-[11px] leading-5 text-slate-300 outline-none focus:border-teal-300/40"/></label><button onClick={removeSelected} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-400/20 px-3 py-2.5 text-[10px] text-rose-300"><Trash2 size={13}/> Delete node</button></div>:<div className="p-5 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white/[.04] text-slate-500"><Settings2 size={18}/></span><p className="mt-3 text-[11px] font-medium text-slate-400">Nothing selected</p><p className="mt-1 text-[10px] leading-5 text-slate-600">Select a node on the canvas to edit its properties.</p></div>}</aside>
    </div>
   </section>:<div className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">
    {activeNav==="Executions"?<ExecutionHistory userId={session.user.id}/>:activeNav==="Overview"||activeNav==="Workflows"?<>
     <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-medium text-teal-300">WEDNESDAY, NOVEMBER 18, 2026</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">{activeNav==="Overview"?"Good to see you again.":"Your workflows"}</h1><p className="mt-2 text-sm text-slate-500">{activeNav==="Overview"?"Here’s what’s happening in your workspace today.":"Create, organize, and manage your automations."}</p></div><button onClick={()=>setShowCreate(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-300 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-200"><Plus size={16}/> Create workflow</button></div>
     {activeNav==="Overview"&&<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{label:"Total workflows",value:String(flows.length),change:"+2 this month",icon:Workflow},{label:"Active workflows",value:String(flows.filter(f=>f.status==="Active").length),change:"Ready to run",icon:Zap},{label:"Total executions",value:"1,712",change:"+12.8% this week",icon:Activity},{label:"Success rate",value:"98.6%",change:"+2.4% this week",icon:CheckCircle2}].map(card=><div key={card.label} className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5"><div className="flex items-center justify-between"><span className="text-xs text-slate-500">{card.label}</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-300/[.08] text-teal-300"><card.icon size={16}/></span></div><div className="mt-4 flex items-end justify-between"><span className="text-2xl font-semibold">{card.value}</span><span className="text-[10px] text-teal-300">{card.change}</span></div></div>)}</div>}
     {activeNav==="Overview"&&<div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5"><h2 className="text-sm font-semibold">Execution activity</h2><p className="mt-1 text-[11px] text-slate-500">Workflow runs over the last 7 days</p><div className="mt-7 flex h-36 items-end gap-3">{[{d:"Thu",h:42},{d:"Fri",h:65},{d:"Sat",h:35},{d:"Sun",h:52},{d:"Mon",h:76},{d:"Tue",h:60},{d:"Wed",h:91}].map(v=><div key={v.d} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="flex h-full items-end rounded-t bg-white/[.025]"><div className="w-full rounded-t bg-teal-300" style={{height:v.h+"%"}}/></div><span className="text-center text-[10px] text-slate-600">{v.d}</span></div>)}</div></section><section className="rounded-2xl border border-white/[.07] bg-[#0d1422] p-5"><h2 className="text-sm font-semibold">Quick start</h2><p className="mt-1 text-[11px] text-slate-500">Get your first automation running</p><button onClick={()=>setShowCreate(true)} className="mt-5 flex w-full items-center gap-3 rounded-xl border border-white/[.07] p-3 text-left hover:border-teal-300/30"><Plus size={17} className="text-teal-300"/><span><span className="block text-xs font-medium">Create a workflow</span><span className="text-[10px] text-slate-500">Start with a blank canvas</span></span></button><button onClick={()=>openBuilder(flows[0])} className="mt-2 flex w-full items-center gap-3 rounded-xl border border-white/[.07] p-3 text-left hover:border-teal-300/30"><GitBranch size={17} className="text-violet-300"/><span><span className="block text-xs font-medium">Explore the visual builder</span><span className="text-[10px] text-slate-500">Open a sample workflow</span></span></button></section></div>}
     <section className="mt-7 rounded-2xl border border-white/[.07] bg-[#0d1422]"><div className="flex flex-col gap-4 border-b border-white/[.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="text-sm font-semibold">{activeNav==="Overview"?"Recent workflows":"All workflows"}</h2><p className="mt-1 text-[11px] text-slate-500">Manage and monitor your automations</p></div><div className="flex gap-2"><div className="relative min-w-0 flex-1 sm:w-52"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search workflows..." className="w-full rounded-lg border border-white/[.08] bg-[#090f1b] py-2 pl-9 pr-3 text-xs outline-none placeholder:text-slate-600 focus:border-teal-300/40"/></div><button className="rounded-lg border border-white/[.08] p-2 text-slate-400" aria-label="Filter workflows"><Filter size={15}/></button></div></div>
      <div className="hidden grid-cols-[minmax(0,1.6fr)_100px_90px_100px_80px] gap-4 px-6 py-3 text-[9px] font-semibold tracking-wider text-slate-600 sm:grid"><span>WORKFLOW</span><span>STATUS</span><span>RUNS</span><span>UPDATED</span><span/></div>
      <div className="divide-y divide-white/[.05]">{filteredFlows.map(flow=><div key={flow.id} className="grid gap-3 px-5 py-4 hover:bg-white/[.02] sm:grid-cols-[minmax(0,1.6fr)_100px_90px_100px_80px] sm:items-center sm:gap-4 sm:px-6"><div className="flex min-w-0 items-center gap-3"><FlowIcon type={flow.icon}/><div className="min-w-0"><div className="truncate text-xs font-medium">{flow.name}</div><div className="mt-1 truncate text-[10px] text-slate-500">{flow.description}</div></div></div><div><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] ${flow.status==="Active"?"bg-teal-300/10 text-teal-300":flow.status==="Paused"?"bg-amber-300/10 text-amber-300":"bg-slate-700/40 text-slate-400"}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/>{flow.status}</span></div><div className="text-[11px] text-slate-300">{flow.runs} <span className="text-[10px] text-slate-600 sm:hidden">runs</span></div><div className="text-[10px] text-slate-500">{flow.updated}</div><button onClick={()=>openBuilder(flow)} className="rounded-lg border border-white/[.08] px-3 py-2 text-[10px] text-teal-300 hover:bg-teal-300/[.06]">Edit <ArrowUpRight size={12} className="ml-1 inline"/></button></div>)}{filteredFlows.length===0&&<div className="px-6 py-12 text-center text-xs text-slate-500">No workflows match “{query}”.</div>}</div><div className="border-t border-white/[.06] px-6 py-3 text-[10px] text-slate-500">Showing {filteredFlows.length} of {flows.length} workflows</div>
     </section>
    </>:<div className="flex min-h-[65vh] flex-col items-center justify-center text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl border border-teal-300/20 bg-teal-300/10 text-teal-300"><Settings2 size={25}/></span><h1 className="mt-5 text-xl font-semibold">{activeNav}</h1><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">This workspace section will be connected in a later development phase.</p><button onClick={()=>setActiveNav("Overview")} className="mt-6 rounded-lg border border-white/10 px-4 py-2 text-xs text-slate-300">Back to overview</button></div>}
   </div>}
  </main>
 </div>
 {showCreate&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCreate(false)}}><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101827] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-base font-semibold">Create a workflow</h2><button onClick={()=>setShowCreate(false)} className="rounded-lg p-2 text-slate-500" aria-label="Close"><X size={17}/></button></div><p className="mt-2 text-xs leading-5 text-slate-500">Name your automation to open a new visual canvas.</p><label className="mt-6 block text-xs font-medium text-slate-300" htmlFor="flow-name">Workflow name</label><input id="flow-name" autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")createFlow()}} placeholder="e.g. New order notification" className="mt-2 w-full rounded-xl border border-white/10 bg-[#090f1b] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-teal-300/50"/><div className="mt-6 flex justify-end gap-2"><button onClick={()=>setShowCreate(false)} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-slate-300">Cancel</button><button onClick={createFlow} disabled={!newName.trim()} className="rounded-lg bg-teal-300 px-4 py-2.5 text-xs font-bold text-slate-950 disabled:opacity-40">Create and build <ArrowUpRight className="ml-1 inline" size={13}/></button></div></div></div>}
 </div>;
}
