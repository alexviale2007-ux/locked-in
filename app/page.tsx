"use client";
import {useEffect,useState} from "react";
import {Check,ChevronRight,Dumbbell,BookOpen,Flame,Home,Plus,Target,Trash2,Trophy} from "lucide-react";
type Task={id:number;text:string;done:boolean;area:string};
const seed:Task[]=[{id:1,text:"Entrenamiento / fútbol",done:false,area:"Físico"},{id:2,text:"Estudiar 45 minutos",done:false,area:"Estudio"},{id:3,text:"Ducha fría",done:false,area:"Disciplina"},{id:4,text:"Leer 10 páginas",done:false,area:"Lectura"}];
export default function App(){
 const [tab,setTab]=useState("Hoy"); const [tasks,setTasks]=useState<Task[]>(seed); const [ready,setReady]=useState(false); const [input,setInput]=useState("");
 useEffect(()=>{const s=localStorage.getItem("locked.tasks");if(s)setTasks(JSON.parse(s));setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem("locked.tasks",JSON.stringify(tasks))},[tasks,ready]);
 const done=tasks.filter(t=>t.done).length, pct=tasks.length?Math.round(done/tasks.length*100):0;
 const add=()=>{if(!input.trim())return;setTasks([...tasks,{id:Date.now(),text:input.trim(),done:false,area:"Personal"}]);setInput("")};
 const toggle=(id:number)=>setTasks(tasks.map(t=>t.id===id?{...t,done:!t.done}:t));
 return <main className="shell">
  <header><div><p className="eyebrow">LOCKED IN</p><h1>{tab==="Hoy"?"Buenos días, Alex.":tab}</h1><p className="muted">{tab==="Hoy"?"Haz que hoy cuente.":sub(tab)}</p></div><div className="streak"><Flame size={17}/> 1</div></header>
  {tab==="Hoy"&&<><section className="hero"><div><span>PROGRESO DE HOY</span><strong>{pct}%</strong><small>{done} de {tasks.length} completadas</small></div><div className="ring" style={{"--p":pct} as React.CSSProperties}><b>{pct}</b></div></section>
   <div className="sectionTitle"><h2>Misiones de hoy</h2><span>{done}/{tasks.length}</span></div>
   <section className="list">{tasks.map(t=><article className={"task "+(t.done?"done":"")} key={t.id} onClick={()=>toggle(t.id)}><button className="check">{t.done&&<Check size={15}/>}</button><div><b>{t.text}</b><small>{t.area}</small></div><ChevronRight size={17}/></article>)}</section>
   <div className="add"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Añadir misión..."/><button onClick={add}><Plus/></button></div>
   <div className="grid"><Card icon={<Dumbbell/>} title="Gym" text="Entrenamiento y progreso"/><Card icon={<BookOpen/>} title="Estudio" text="Sesiones y objetivos"/><Card icon={<Target/>} title="Disciplina" text="Hábitos y constancia"/><Card icon={<Trophy/>} title="Progreso" text={pct+"% completado hoy"}/></div>
  </>}
  {tab==="Hábitos"&&<><div className="sectionTitle"><h2>Hábitos y tareas</h2><span>{done}/{tasks.length}</span></div><section className="list">{tasks.map(t=><article className={"task "+(t.done?"done":"")} key={t.id}><button className="check" onClick={()=>toggle(t.id)}>{t.done&&<Check size={15}/>}</button><div onClick={()=>toggle(t.id)}><b>{t.text}</b><small>{t.area}</small></div><button className="delete" onClick={()=>setTasks(tasks.filter(x=>x.id!==t.id))}><Trash2 size={17}/></button></article>)}</section><div className="add"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Nuevo hábito o tarea"/><button onClick={add}><Plus/></button></div></>}
  {tab==="Gym"&&<Empty icon={<Dumbbell/>} title="Tu entrenamiento" text="Aquí tendrás la rutina del día, registro de pesos, repeticiones y evolución física." action="Preparado para conectar el coach IA"/>}
  {tab==="Estudio"&&<Empty icon={<BookOpen/>} title="Modo estudio" text="Organiza Universae, sesiones de estudio, apuntes y objetivos desde un solo sitio." action="Google Drive será la siguiente conexión"/>}
  {tab==="Progreso"&&<><section className="hero"><div><span>NIVEL DE DISCIPLINA</span><strong>{pct}%</strong><small>Basado en tus misiones actuales</small></div><Trophy size={54}/></section><Empty icon={<Flame/>} title="Racha" text="Completa tus misiones cada día. Aquí aparecerán tus rachas, estadísticas semanales y récords." action="Día 1 — empieza hoy"/></>}
  <nav>{[["Hoy",Home],["Hábitos",Target],["Gym",Dumbbell],["Estudio",BookOpen],["Progreso",Trophy]].map(([n,I]:any)=><button className={tab===n?"active":""} onClick={()=>setTab(n)} key={n}><I size={21}/><span>{n}</span></button>)}</nav>
 </main>
}
function Card({icon,title,text}:any){return <article className="card"><i>{icon}</i><b>{title}</b><small>{text}</small></article>}
function Empty({icon,title,text,action}:any){return <section className="empty"><i>{icon}</i><h2>{title}</h2><p>{text}</p><span>{action}</span></section>}
function sub(t:string){return ({Hábitos:"Tu sistema diario de constancia.",Gym:"Hazte más fuerte cada semana.",Estudio:"Concéntrate. Aprende. Avanza.",Progreso:"Los números no mienten."} as any)[t]||""}