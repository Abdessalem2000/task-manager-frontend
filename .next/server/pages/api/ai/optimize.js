"use strict";(()=>{var e={};e.id=285,e.ids=[285],e.modules={3872:e=>{e.exports=require("@clerk/nextjs/server")},1185:e=>{e.exports=require("mongoose")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2079:e=>{e.exports=import("openai")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,o){return o in t?t[o]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,o)):"function"==typeof t&&"default"===o?t:void 0}}})},7490:(e,t,o)=>{o.a(e,async(e,r)=>{try{o.r(t),o.d(t,{config:()=>u,default:()=>m,routeModule:()=>d});var i=o(1802),s=o(7153),a=o(6249),n=o(5627),p=e([n]);n=(p.then?(await p)():p)[0];let m=(0,a.l)(n,"default"),u=(0,a.l)(n,"config"),d=new i.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/ai/optimize",pathname:"/api/ai/optimize",bundlePath:"",filename:""},userland:n});r()}catch(e){r(e)}})},5627:(e,t,o)=>{o.a(e,async(e,r)=>{try{o.r(t),o.d(t,{default:()=>m});var i=o(1185),s=o.n(i),a=o(3872),n=o(2079),p=e([n]);let u=new(n=(p.then?(await p)():p)[0]).default({apiKey:process.env.OPENAI_API_KEY}),d=async()=>{try{1!==s().connection.readyState&&await s().connect("mongodb+srv://hanouth21_db_user:dNJBNpN3VhskEzLX@cluster0.nncyczb.mongodb.net/taskManager?retryWrites=true&w=majority")}catch(e){throw e}},c=new(s()).Schema({name:{type:String,required:!0},completed:{type:Boolean,default:!1},priority:{type:String,enum:["low","medium","high"],default:"medium"},category:{type:String,enum:["work","personal","shopping"],default:"work"},userId:{type:String,required:!0,index:!0},createdAt:{type:Date,default:Date.now},updatedAt:{type:Date,default:Date.now}}),l=s().models.Task||s().model("Task",c);async function m(e,t){if(t.setHeader("Access-Control-Allow-Origin","*"),t.setHeader("Access-Control-Allow-Methods","POST, OPTIONS"),t.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization"),"OPTIONS"===e.method)return t.status(200).end();if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});let{userId:o}=(0,a.getAuth)(e);if(!o)return t.status(401).json({error:"Unauthorized - Please sign in"});try{let e;if(!process.env.OPENAI_API_KEY||"sk_test_YOUR_OPENAI_KEY_HERE"===process.env.OPENAI_API_KEY)return t.status(200).json({optimizedTasks:[],suggestions:[{type:"priority",message:"\uD83E\uDD16 AI optimization requires OpenAI API key configuration",demo:!0},{type:"next_step",message:"\uD83D\uDCCB Focus on high-priority work tasks first",demo:!0},{type:"efficiency",message:"⚡ Group similar tasks together for better focus",demo:!0}],demo:!0});await d();let r=await l.find({userId:o}).sort({createdAt:-1});if(0===r.length)return t.status(200).json({optimizedTasks:[],suggestions:[{type:"empty",message:"\uD83D\uDCDD Add some tasks to get AI-powered optimization suggestions!",demo:!1}],demo:!1});let i=r.map(e=>({name:e.name,priority:e.priority,category:e.category,completed:e.completed})),s=`As a productivity expert, analyze these tasks and provide optimization:

Tasks:
${i.map((e,t)=>`${t+1}. ${e.name} (Priority: ${e.priority}, Category: ${e.category}, Completed: ${e.completed})`).join("\n")}

Please provide:
1. Reordered tasks by optimal priority
2. Specific next steps for each incomplete task
3. Efficiency suggestions

Format your response as JSON:
{
  "optimizedTasks": [
    {
      "originalIndex": 0,
      "name": "Task name",
      "priority": "high/medium/low",
      "category": "work/personal/shopping",
      "nextStep": "Specific actionable next step",
      "estimatedTime": "Time estimate in minutes"
    }
  ],
  "suggestions": [
    {
      "type": "priority/efficiency/motivation",
      "message": "Specific suggestion"
    }
  ]
}`,a=await u.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"system",content:"You are a productivity expert assistant. Always respond with valid JSON only."},{role:"user",content:s}],max_tokens:1e3,temperature:.7});try{let t=a.choices[0].message.content.match(/\{[\s\S]*\}/);if(t)e=JSON.parse(t[0]);else throw Error("No JSON found in response")}catch(t){console.error("AI Response Parse Error:",t),e={optimizedTasks:i.filter(e=>!e.completed).map((e,t)=>({originalIndex:t,name:e.name,priority:e.priority,category:e.category,nextStep:`Break down "${e.name}" into smaller, manageable steps`,estimatedTime:"30"})),suggestions:[{type:"priority",message:"Focus on high-priority tasks first for maximum impact"}]}}return t.status(200).json({...e,originalTasks:i,demo:!1})}catch(e){return console.error("AI Optimization Error:",e),t.status(200).json({optimizedTasks:[],suggestions:[{type:"error",message:"\uD83E\uDD16 AI optimization temporarily unavailable. Try again later!",demo:!1}],demo:!1,error:e.message})}}r()}catch(e){r(e)}})},7153:(e,t)=>{var o;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return o}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(o||(o={}))},1802:(e,t,o)=>{e.exports=o(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var o=t(t.s=7490);module.exports=o})();