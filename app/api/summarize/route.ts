import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

export const runtime="nodejs";

export async function POST(req:NextRequest){
  try{
    const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
    if(!token)return NextResponse.json({error:"Inicia sesión primero."},{status:401});
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if(!url||!key)return NextResponse.json({error:"Falta configurar Supabase en el servidor."},{status:503});
    const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:{user},error}=await supabase.auth.getUser(token);
    if(error||!user)return NextResponse.json({error:"Sesión no válida. Vuelve a iniciar sesión."},{status:401});
    const body=await req.json();
    const material=String(body.material??"").trim().slice(0,18000);
    if(material.length<30)return NextResponse.json({error:"Pega al menos unas líneas de apuntes para resumir."},{status:400});
    const apiKey=process.env.OPENAI_API_KEY;
    if(!apiKey)return NextResponse.json({error:"El resumidor necesita OPENAI_API_KEY configurada en las variables de entorno de producción de Netlify."},{status:503});
    const response=await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL||"gpt-4.1-mini",
        max_tokens:1800,
        messages:[
          {role:"system",content:"Eres el tutor de estudio de LOCKED IN. Responde en español y usa exclusivamente el material proporcionado; si falta información, dilo. Crea: 1) resumen por apartados, 2) conceptos y definiciones clave, 3) 5 preguntas de repaso con respuestas al final, 4) mini plan de memorización. Formato Markdown claro y útil para estudiar. No inventes datos."},
          {role:"user",content:"Resume estos apuntes de estudio:\n\n"+material}
        ]
      })
    });
    const data=await response.json().catch(()=>null);
    if(!response.ok){
      const status=response.status===401?401:response.status===429?429:502;
      return NextResponse.json({error:status===401?"La clave de OpenAI no es válida.":status===429?"La cuenta de OpenAI no tiene cuota disponible o está limitada.":"El proveedor de IA devolvió un error. Revisa la configuración."},{status});
    }
    return NextResponse.json({summary:data?.choices?.[0]?.message?.content??"No se pudo generar el resumen."});
  }catch{
    return NextResponse.json({error:"No se pudo procesar el material."},{status:500});
  }
}
