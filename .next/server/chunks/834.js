exports.id=834,exports.ids=[834],exports.modules={923:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>p});var o=t(997);t(5833);var s=t(6689),a=t.n(s);class i extends a().Component{constructor(e){super(e),this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(e){return{hasError:!0}}componentDidCatch(e,r){this.setState({error:e,errorInfo:r}),console.error("=== ERROR BOUNDARY CAUGHT ERROR ==="),console.error("Error:",e),console.error("Error Info:",r),console.error("Error Stack:",e.stack),console.error("Component Stack:",r.componentStack),console.error("====================================")}render(){return this.state.hasError?(0,o.jsxs)("div",{style:{padding:"40px",textAlign:"center",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',backgroundColor:"#f8f9fa",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[o.jsx("h2",{style:{color:"#FF6B35",marginBottom:"20px"},children:"\uD83D\uDEA8 Something went wrong"}),o.jsx("p",{style:{color:"#666",marginBottom:"30px"},children:"We're sorry, but something unexpected happened. Please refresh the page to try again."}),(0,o.jsxs)("div",{style:{marginBottom:"30px"},children:[o.jsx("button",{onClick:()=>window.location.reload(),style:{padding:"12px 24px",backgroundColor:"#667eea",color:"white",border:"none",borderRadius:"8px",fontSize:"16px",cursor:"pointer",marginRight:"10px"},children:"\uD83D\uDD04 Refresh Page"}),o.jsx("button",{onClick:()=>this.setState({hasError:!1,error:null,errorInfo:null}),style:{padding:"12px 24px",backgroundColor:"#1DB954",color:"white",border:"none",borderRadius:"8px",fontSize:"16px",cursor:"pointer"},children:"\uD83D\uDD04 Retry"})]}),(0,o.jsxs)("details",{style:{textAlign:"left",backgroundColor:"#f5f5f5",padding:"20px",borderRadius:"8px",border:"1px solid #ddd",maxWidth:"800px",width:"100%"},children:[o.jsx("summary",{style:{cursor:"pointer",fontWeight:"bold",marginBottom:"10px"},children:"\uD83D\uDC1B Error Details (Click to expand)"}),(0,o.jsxs)("div",{style:{fontSize:"14px",fontFamily:"monospace"},children:[(0,o.jsxs)("div",{style:{marginBottom:"15px"},children:[o.jsx("strong",{children:"Error:"})," ",this.state.error&&this.state.error.toString()]}),this.state.error&&this.state.error.stack&&(0,o.jsxs)("div",{style:{marginBottom:"15px"},children:[o.jsx("strong",{children:"Stack Trace:"}),o.jsx("pre",{style:{whiteSpace:"pre-wrap",margin:"10px 0",padding:"10px",backgroundColor:"#fff",border:"1px solid #ddd",borderRadius:"4px",fontSize:"12px",maxHeight:"200px",overflow:"auto"},children:this.state.error.stack})]}),this.state.errorInfo&&this.state.errorInfo.componentStack&&(0,o.jsxs)("div",{style:{marginBottom:"15px"},children:[o.jsx("strong",{children:"Component Stack:"}),o.jsx("pre",{style:{whiteSpace:"pre-wrap",margin:"10px 0",padding:"10px",backgroundColor:"#fff",border:"1px solid #ddd",borderRadius:"4px",fontSize:"12px",maxHeight:"200px",overflow:"auto"},children:this.state.errorInfo.componentStack})]}),(0,o.jsxs)("div",{style:{marginTop:"15px",padding:"10px",backgroundColor:"#e3f2fd",borderRadius:"4px"},children:[o.jsx("strong",{children:"\uD83D\uDCA1 Debug Info:"}),o.jsx("br",{}),"• Check browser console for more details",o.jsx("br",{}),'• Look for "ERROR BOUNDARY CAUGHT ERROR" in console',o.jsx("br",{}),"• Error also stored in ",o.jsx("code",{children:"window.lastError"})]})]})]})]}):this.props.children}}var l=t(968),n=t.n(l),d=t(3300);let c="pk_test_YOUR_CLERK_KEY_HERE",x=c&&!1,p=function({Component:e,pageProps:r}){return x?(0,o.jsxs)(d.ClerkProvider,{publishableKey:c,children:[o.jsx(n(),{children:o.jsx("style",{children:`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `})}),o.jsx(i,{children:o.jsx(e,{...r})})]}):(0,o.jsxs)(o.Fragment,{children:[o.jsx(n(),{children:o.jsx("style",{children:`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes scaleIn {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `})}),o.jsx(i,{children:o.jsx(e,{...r})})]})}},7384:(e,r,t)=>{"use strict";t.a(e,async(e,o)=>{try{t.d(r,{Z:()=>S});var s=t(997);t(6689);var a=t(2305),i=t(6866),l=t(4206),n=t(2154),d=t(4283),c=t(6531),x=t(5450),p=t(6596),h=t(7136),f=t(5791),y=t(4487),m=t(5043),g=t(3809),u=t(8592),b=t(8206),j=t(8756),k=t(3458),C=t(8729),v=e([a,i,l,n,d,c,x,p,h,f,m,g,u,b,j,k,C]);[a,i,l,n,d,c,x,p,h,f,m,g,u,b,j,k,C]=v.then?(await v)():v;let S=({tasks:e=[],theme:r,showCharts:t,setShowCharts:o})=>{let v=Array.isArray(e)?e:[];v.length>0&&(v.filter(e=>e.completed).length,v.length);let S=[{name:"Work",value:v.filter(e=>"work"===e.category).length,color:"#6366F1"},{name:"Personal",value:v.filter(e=>"personal"===e.category).length,color:"#10B981"},{name:"Shopping",value:v.filter(e=>"shopping"===e.category).length,color:"#F59E0B"}],D=[{name:"High",value:v.filter(e=>"high"===e.priority).length,color:"#EF4444"},{name:"Medium",value:v.filter(e=>"medium"===e.priority).length,color:"#F59E0B"},{name:"Low",value:v.filter(e=>"low"===e.priority).length,color:"#6366F1"}],w=({active:e,payload:t,label:o})=>e&&t&&t.length?(0,s.jsxs)("div",{style:{backgroundColor:r.cardBg,border:`1px solid ${r.border}`,borderRadius:"8px",padding:"12px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",backdropFilter:"blur(10px)"},children:[s.jsx("p",{style:{margin:"0 0 4px 0",fontWeight:"600",color:r.text},children:o}),t.map((e,t)=>(0,s.jsxs)("p",{style:{margin:"2px 0",color:e.color||r.text,fontSize:"14px"},children:[e.name,": ",e.value]},t))]}):null;return s.jsx("div",{children:t?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{style:{marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[s.jsx("h2",{style:{margin:0,fontSize:"1.5rem",fontWeight:"600",color:r.text},children:"\uD83D\uDCCA Analytics Dashboard"}),s.jsx("button",{onClick:()=>o(!1),style:{padding:"8px 16px",backgroundColor:r.hoverBg,border:`1px solid ${r.border}`,borderRadius:"8px",color:r.text,cursor:"pointer",fontSize:"12px",fontWeight:"500"},children:"Hide Charts"})]}),(0,s.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(500px, 1fr))",gap:"25px",marginBottom:"30px"},children:[(0,s.jsxs)("div",{style:{backgroundColor:r.cardBg,borderRadius:"16px",padding:"25px",boxShadow:r.shadow,border:`1px solid ${r.glassBorder}`,backdropFilter:"blur(10px)"},children:[s.jsx("h3",{style:{margin:"0 0 20px 0",color:r.text,fontSize:"1.2rem",fontWeight:"600"},children:"\uD83D\uDCC8 Weekly Activity"}),s.jsx(a.h,{width:"100%",height:300,children:(0,s.jsxs)(i.T,{data:[{day:"Mon",completed:8,total:12,efficiency:67},{day:"Tue",completed:10,total:15,efficiency:67},{day:"Wed",completed:6,total:8,efficiency:75},{day:"Thu",completed:9,total:10,efficiency:90},{day:"Fri",completed:4,total:6,efficiency:67},{day:"Sat",completed:3,total:4,efficiency:75},{day:"Sun",completed:2,total:2,efficiency:100}],children:[(0,s.jsxs)("defs",{children:[(0,s.jsxs)("linearGradient",{id:"colorCompleted",x1:"0",y1:"0",x2:"0",y2:"1",children:[s.jsx("stop",{offset:"5%",stopColor:"#10B981",stopOpacity:.8}),s.jsx("stop",{offset:"95%",stopColor:"#10B981",stopOpacity:.1})]}),(0,s.jsxs)("linearGradient",{id:"colorTotal",x1:"0",y1:"0",x2:"0",y2:"1",children:[s.jsx("stop",{offset:"5%",stopColor:"#6366F1",stopOpacity:.8}),s.jsx("stop",{offset:"95%",stopColor:"#6366F1",stopOpacity:.1})]})]}),s.jsx(l.q,{strokeDasharray:"3 3",stroke:r.chartGrid}),s.jsx(n.K,{dataKey:"day",stroke:r.chartText}),s.jsx(d.B,{stroke:r.chartText}),s.jsx(c.u,{content:s.jsx(w,{})}),s.jsx(x.D,{}),s.jsx(p.uN,{type:"monotone",dataKey:"completed",stroke:"#10B981",fillOpacity:1,fill:"url(#colorCompleted)",strokeWidth:3}),s.jsx(p.uN,{type:"monotone",dataKey:"total",stroke:"#6366F1",fillOpacity:1,fill:"url(#colorTotal)",strokeWidth:3})]})})]}),(0,s.jsxs)("div",{style:{backgroundColor:r.cardBg,borderRadius:"16px",padding:"25px",boxShadow:r.shadow,border:`1px solid ${r.glassBorder}`,backdropFilter:"blur(10px)"},children:[s.jsx("h3",{style:{margin:"0 0 20px 0",color:r.text,fontSize:"1.2rem",fontWeight:"600"},children:"\uD83C\uDFAF Category Distribution"}),S.some(e=>e.value>0)?s.jsx(a.h,{width:"100%",height:300,children:(0,s.jsxs)(h.u,{children:[s.jsx(f.by,{data:S.filter(e=>e.value>0),cx:"50%",cy:"50%",labelLine:!1,label:({name:e,percent:r})=>`${e} ${(100*r).toFixed(0)}%`,outerRadius:100,fill:"#8884d8",dataKey:"value",children:S.filter(e=>e.value>0).map((e,r)=>s.jsx(y.b,{fill:e.color},`cell-${r}`))}),s.jsx(c.u,{content:s.jsx(w,{})})]})}):s.jsx("div",{style:{height:"300px",display:"flex",alignItems:"center",justifyContent:"center",color:r.textSecondary,fontSize:"16px"},children:"No tasks available for category analysis"})]}),(0,s.jsxs)("div",{style:{backgroundColor:r.cardBg,borderRadius:"16px",padding:"25px",boxShadow:r.shadow,border:`1px solid ${r.glassBorder}`,backdropFilter:"blur(10px)"},children:[s.jsx("h3",{style:{margin:"0 0 20px 0",color:r.text,fontSize:"1.2rem",fontWeight:"600"},children:"⚡ Priority Analysis"}),D.some(e=>e.value>0)?s.jsx(a.h,{width:"100%",height:300,children:(0,s.jsxs)(m.v,{data:D.filter(e=>e.value>0),children:[s.jsx(l.q,{strokeDasharray:"3 3",stroke:r.chartGrid}),s.jsx(n.K,{dataKey:"name",stroke:r.chartText}),s.jsx(d.B,{stroke:r.chartText}),s.jsx(c.u,{content:s.jsx(w,{})}),s.jsx(g.$Q,{dataKey:"value",radius:[8,8,0,0],children:D.filter(e=>e.value>0).map((e,r)=>s.jsx(y.b,{fill:e.color},`cell-${r}`))})]})}):s.jsx("div",{style:{height:"300px",display:"flex",alignItems:"center",justifyContent:"center",color:r.textSecondary,fontSize:"16px"},children:"No tasks available for priority analysis"})]}),(0,s.jsxs)("div",{style:{backgroundColor:r.cardBg,borderRadius:"16px",padding:"25px",boxShadow:r.shadow,border:`1px solid ${r.glassBorder}`,backdropFilter:"blur(10px)"},children:[s.jsx("h3",{style:{margin:"0 0 20px 0",color:r.text,fontSize:"1.2rem",fontWeight:"600"},children:"\uD83C\uDFAF Performance Metrics"}),s.jsx(a.h,{width:"100%",height:300,children:(0,s.jsxs)(u.H,{data:[{subject:"Speed",A:85,fullMark:100},{subject:"Quality",A:92,fullMark:100},{subject:"Consistency",A:78,fullMark:100},{subject:"Focus",A:88,fullMark:100},{subject:"Planning",A:95,fullMark:100},{subject:"Execution",A:82,fullMark:100}],children:[s.jsx(b.n,{stroke:r.chartGrid}),s.jsx(j.I,{dataKey:"subject",stroke:r.chartText}),s.jsx(k.S,{stroke:r.chartText}),s.jsx(C.Fk,{name:"Performance",dataKey:"A",stroke:"#6366F1",fill:"#6366F1",fillOpacity:.6,strokeWidth:3}),s.jsx(c.u,{content:s.jsx(w,{})})]})})]})]})]}):s.jsx("div",{style:{marginBottom:"30px"},children:s.jsx("button",{onClick:()=>o(!0),style:{padding:"16px 32px",background:"linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",border:"none",borderRadius:"16px",color:"white",cursor:"pointer",fontSize:"16px",fontWeight:"700",transition:"all 0.3s ease",boxShadow:"0 8px 32px rgba(99, 102, 241, 0.3)"},onMouseOver:e=>{e.target.style.transform="translateY(-2px)",e.target.style.boxShadow="0 12px 40px rgba(99, 102, 241, 0.4)"},onMouseOut:e=>{e.target.style.transform="translateY(0)",e.target.style.boxShadow="0 8px 32px rgba(99, 102, 241, 0.3)"},children:"\uD83D\uDCCA Show Professional Analytics"})})})};o()}catch(e){o(e)}})},5833:()=>{}};