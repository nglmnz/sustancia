/* Sustancia · demos pedagógicas v2.1. Todos los datos son ficticios. */
(function () {
  "use strict";
  function initSplash() {
    var overlay = document.getElementById("intro-splash");
    var video = document.getElementById("intro-video");
    var skip = document.getElementById("btn-saltar-intro");
    if (!overlay || !video || !skip) return;
    var finished = false;
    var fallback;
    function close() {
      if (finished) return;
      finished = true;
      clearTimeout(fallback);
      video.pause();
      overlay.classList.add("s3-splash-out");
      document.body.classList.remove("s3-intro-lock");
      window.setTimeout(function () { overlay.remove(); }, 900);
    }
    skip.addEventListener("click", close);
    video.addEventListener("ended", close);
    video.addEventListener("error", close);
    document.body.classList.add("s3-intro-lock");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      close(); return;
    }
    /* Cierre de seguridad si no carga / queda detenido, nunca corta un video que avanza. */
    var last = -1, stuck = 0;
    function watchdog() {
      if (finished) return;
      if (video.currentTime > last + 0.05) { stuck = 0; last = video.currentTime; }
      else stuck += 1;
      if (stuck >= 12) close();
      else fallback = window.setTimeout(watchdog, 2500);
    }
    fallback = window.setTimeout(watchdog, 2500);
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") attempt.catch(close);
  }

  var DIMENSIONS = {
    conceptos: {title:"Conceptos estadísticos",summary:"¿Qué sabe sobre variables, medidas, distribuciones, muestreo o probabilidad?",example:"Puede interpretar correctamente la media pero confundirla con la mediana ante valores extremos.",evidence:"Respuestas a ejercicios asociados con cada concepto. El perfil no confunde 'no evaluado' con 'bajo dominio'."},
    operaciones: {title:"Operaciones del laboratorio",summary:"¿Qué puede hacer con lo que sabe: reconocer, describir, calcular, comparar, interpretar, contextualizar, criticar o transferir?",example:"Dos personas calculan bien una proporción, pero solo una sabe explicar qué implica en un contexto sanitario.",evidence:"Ejecuciones y justificaciones observadas en tareas de distintos tipos."},
    profundidad: {title:"Profundidad interpretativa N1–N4",summary:"N1: lectura técnica. N2: interpretación estadística. N3: interpretación sustantiva. N4: examen crítico de supuestos y límites.",example:"Una respuesta N1 identifica el porcentaje; una N3 lo vincula con el fenómeno estudiado.",evidence:"Rúbricas vinculadas a cada actividad. Este eje no sustituye las demás dimensiones."},
    errores: {title:"Errores recurrentes",summary:"Patrones observados que orientan nuevas oportunidades de aprender, no etiquetas permanentes.",example:"Confundir una relación estadística con causalidad; comparar frecuencias sin revisar el denominador.",evidence:"Registro de errores concretos con contexto, frecuencia y eventual corrección."},
    requisitos: {title:"Prerrequisitos conceptuales",summary:"Conocimientos necesarios para abordar otros: interpretar porcentajes requiere comprender proporciones y bases de comparación.",example:"Antes de comparar porcentajes entre regiones, comprobar qué representa cada grupo de referencia.",evidence:"Mapa curricular y desempeños previos; el equipo humano valida las relaciones."},
    trayectoria: {title:"Trayectoria y capacidad de revisión",summary:"Observa cambios entre respuestas iniciales, retroalimentaciones y respuestas revisadas.",example:"El estudiante reconoce un supuesto omitido y reformula su argumento sin recibir una respuesta lista.",evidence:"Secuencias de intentos; una revisión aislada no prueba una habilidad estable ni mide resiliencia."}
  };
  function initDimensions() {
    var root = document.querySelector("[data-s3-dimensions]");
    if (!root) return;
    var panel = root.querySelector("[data-s3-dim-panel]");
    var tabs = Array.from(root.querySelectorAll("[data-s3-dim]"));
    if (!panel || !tabs.length) return;
    function choose(k) {
      var item = DIMENSIONS[k]; if (!item) return;
      tabs.forEach(function (b) {
        var active = b.getAttribute("data-s3-dim") === k;
        b.setAttribute("aria-pressed", String(active));
        b.classList.toggle("s3-selected", active);
      });
      panel.replaceChildren();
      var h = document.createElement("h3"); h.textContent = item.title;
      var p = document.createElement("p"); p.textContent = item.summary;
      var strong = document.createElement("strong"); strong.textContent = "Ejemplo";
      var example = document.createElement("p"); example.textContent = item.example;
      var ev = document.createElement("p"); ev.className = "s3-dim-evidence"; ev.textContent = "Evidencia observable: " + item.evidence;
      panel.append(h,p,strong,example,ev);
    }
    tabs.forEach(function (button) { button.addEventListener("click", function () { choose(button.getAttribute("data-s3-dim")); }); });
    choose("conceptos");
  }
  var NAMES = ["Reconocer","Calcular","Comparar","Interpretar","Contextualizar","Criticar","Transferir"];
  var PROFILES = {
    a: {
      name:"Perfil A · cálculo sólido",
      intro:"Destaca en los procedimientos, pero todavía necesita practicar interpretación situada y transferencia.",
      t0:[88,91,67,58,39,33,24],
      t2:[90,91,74,71,64,52,48],
      next:"Probar una actividad que exija contextualizar y transferir; no repetir simplemente otro cálculo."
    },
    b: {
      name:"Perfil B · interpretación sólida",
      intro:"Su razonamiento situado es más fuerte que el cálculo. El próximo desafío podría reforzar procedimientos.",
      t0:[72,43,65,79,82,74,69],
      t2:[78,53,71,81,83,77,72],
      next:"Fortalecer cálculo y comprobación técnica mientras se aprovechan sus habilidades interpretativas."
    }
  };
  function svgNode(tag, attrs, textValue) {
    var el = document.createElementNS("http://www.w3.org/2000/svg",tag);
    Object.keys(attrs||{}).forEach(function(k){ el.setAttribute(k,String(attrs[k])); });
    if (textValue!==undefined) el.textContent = textValue;
    return el;
  }
  function drawRadar(svg,values) {
    svg.replaceChildren();
    var cx=255,cy=199,r=135,n=values.length;
    function point(i,value) {
      var a=-Math.PI/2+2*Math.PI*i/n, rr=r*value/100;
      return [cx+Math.cos(a)*rr,cy+Math.sin(a)*rr];
    }
    [25,50,75,100].forEach(function(level){
      svg.appendChild(svgNode("polygon",{points:values.map(function(_,i){return point(i,level).map(function(v){return v.toFixed(1)}).join(",");}).join(" "),fill:"none",stroke:"#bbc8d5","stroke-width":"1"}));
    });
    values.forEach(function(_,i){
      var end=point(i,100);
      svg.appendChild(svgNode("line",{x1:cx,y1:cy,x2:end[0],y2:end[1],stroke:"#d9dfe8","stroke-width":"1"}));
      var p=point(i,121);
      var a=-Math.PI/2+2*Math.PI*i/n;
      var anchor=Math.cos(a)>.3?"start":Math.cos(a)<-.3?"end":"middle";
      svg.appendChild(svgNode("text",{x:p[0],y:p[1]+4,"text-anchor":anchor,"font-size":"13","font-family":"IBM Plex Sans, sans-serif",fill:"#253452"},NAMES[i]));
    });
    var pts=values.map(function(v,i){return point(i,v).map(function(q){return q.toFixed(1)}).join(",");}).join(" ");
    svg.appendChild(svgNode("polygon",{points:pts,fill:"rgba(45,127,139,.23)",stroke:"#1f7180","stroke-width":"3","stroke-linejoin":"round"}));
    values.forEach(function(v,i){ var p=point(i,v);svg.appendChild(svgNode("circle",{cx:p[0],cy:p[1],r:4.5,fill:"#1f7180",stroke:"#fff","stroke-width":"1.5"}));});
    svg.setAttribute("aria-label",NAMES.map(function(name,i){return name+" "+values[i]+" de 100";}).join(", "));
  }
  function initMastery() {
    var root=document.querySelector("[data-s3-mastery]"); if(!root) return;
    var select=Array.from(root.querySelectorAll("[data-s3-profile]"));
    var moments=Array.from(root.querySelectorAll("[data-s3-moment]"));
    var svg=root.querySelector("[data-s3-radar]");
    var bars=root.querySelector("[data-s3-bars]");
    var title=root.querySelector("[data-s3-profile-title]");
    var desc=root.querySelector("[data-s3-profile-description]");
    var next=root.querySelector("[data-s3-next]");
    if(!svg||!bars||!title||!desc||!next)return;
    var profile="a",moment="t0";
    function render() {
      var data=PROFILES[profile],values=data[moment];
      title.textContent=data.name;
      desc.textContent=data.intro;
      next.textContent=(moment==="t0"?"Siguiente desafío sugerido (hipotético): ":"Trayectoria ilustrativa: ")+data.next;
      drawRadar(svg,values);
      bars.replaceChildren();
      values.forEach(function(value,i){
        var row=document.createElement("div");row.className="s3-minirow";
        var label=document.createElement("span");label.textContent=NAMES[i];
        var track=document.createElement("div");track.className="s3-minitrack";
        var fill=document.createElement("span");fill.style.width=value+"%";track.appendChild(fill);
        var val=document.createElement("b");val.textContent=value+"/100";
        row.append(label,track,val);bars.appendChild(row);
      });
      select.forEach(function(btn){var active=btn.getAttribute("data-s3-profile")===profile;btn.setAttribute("aria-pressed",String(active));btn.classList.toggle("s3-selected",active);});
      moments.forEach(function(btn){var active=btn.getAttribute("data-s3-moment")===moment;btn.setAttribute("aria-pressed",String(active));btn.classList.toggle("s3-selected",active);});
    }
    select.forEach(function(btn){btn.addEventListener("click",function(){profile=btn.getAttribute("data-s3-profile");render();});});
    moments.forEach(function(btn){btn.addEventListener("click",function(){moment=btn.getAttribute("data-s3-moment");render();});});
    render();
  }

  var EXAMPLES = {
    ingresos: {
      category:"Ciencias sociales · tendencia central",name:"Ingresos y valores extremos",
      question:"En una comuna la media de ingresos es muy superior a la mediana. ¿Qué significa?",
      initial:"La mayoría gana el ingreso promedio porque la media indica el sueldo típico de la comuna.",
      feedback:"¿Una media alta implica que la mayoría gana ese monto? ¿Qué ocurriría si pocas personas tuvieran ingresos extraordinariamente altos?",
      revision:"No necesariamente. Unos pocos ingresos extremos pueden elevar la media; la mediana puede describir mejor el ingreso central de la población.",
      evidence:"Interpretación de media/mediana; detección de valores extremos; revisión de una generalización. Próximo desafío posible: trasladar el principio a otra distribución."
    },
    salud: {
      category:"Salud · proporciones",name:"Frecuencia y denominador",
      question:"En el centro A, 20 de 80 pacientes presentan síntomas; en el centro B, 20 de 200. ¿Tienen la misma prevalencia observada?",
      initial:"Sí, ambos centros tienen 20 pacientes con síntomas.",
      feedback:"¿Estás comparando cantidades absolutas o proporciones? ¿Qué parte corresponde al total de cada centro?",
      revision:"No. En A son 20/80 = 25 % y en B son 20/200 = 10 %. La frecuencia absoluta coincide, pero las proporciones difieren.",
      evidence:"Cálculo e interpretación de porcentajes, comparación con denominadores diferentes y capacidad de rectificación."
    },
    encuestas: {
      category:"Metodología · muestras",name:"¿Podemos generalizar?",
      question:"Una encuesta voluntaria aplicada a 120 estudiantes de una universidad concluye que «la juventud chilena opina…». ¿Qué te parece?",
      initial:"Como respondieron 120 personas, la encuesta refleja lo que opina la juventud chilena.",
      feedback:"¿Quiénes tuvieron oportunidad de responder? ¿Hay evidencia de que la muestra represente a toda la juventud del país?",
      revision:"No podemos generalizar sin examinar el diseño de selección. Se trata de respuestas de un grupo particular de estudiantes, con posibles sesgos.",
      evidence:"Reconocimiento de población y muestra; crítica de inferencias; revisión de supuestos de representatividad."
    },
    ingenieria: {
      category:"Ingeniería · dispersión",name:"La media no alcanza",
      question:"Dos líneas producen piezas de longitud media 10 cm. La primera varía entre 9,9 y 10,1 cm; la segunda entre 9 y 11 cm. ¿Son equivalentes?",
      initial:"Sí, tienen el mismo promedio de 10 cm.",
      feedback:"¿Qué diferencia hay en la variabilidad? ¿Alcanza con una medida central para juzgar la consistencia de la producción?",
      revision:"No. Aunque las medias son iguales, la segunda línea presenta mucha mayor dispersión y podría incumplir tolerancias.",
      evidence:"Comparación de distribuciones; interpretación de dispersión; aplicación de un concepto estadístico a control de calidad."
    }
  };
  var STAGES=[
    {key:"question",title:"01 · Desafío",role:"Consigna del juego"},
    {key:"initial",title:"02 · Producción",role:"Respuesta inicial del estudiante"},
    {key:"feedback",title:"03 · Fricción",role:"Pregunta orientadora del sistema"},
    {key:"revision",title:"04 · Revisión",role:"Nueva respuesta del estudiante"},
    {key:"evidence",title:"05 · Evidencia",role:"Qué podría observar el sistema"}
  ];
  function initScenarios() {
    document.querySelectorAll("[data-s3-examples]").forEach(function(root){
      var choices=Array.from(root.querySelectorAll("[data-s3-example]"));
      var steps=Array.from(root.querySelectorAll("[data-s3-stage]"));
      var heading=root.querySelector("[data-s3-example-heading]");
      var role=root.querySelector("[data-s3-example-role]");
      var text=root.querySelector("[data-s3-example-text]");
      var counter=root.querySelector("[data-s3-example-counter]");
      if(!choices.length||!steps.length||!heading||!role||!text)return;
      var scenario="ingresos",stage=0;
      function render(){
        var e=EXAMPLES[scenario],s=STAGES[stage];
        heading.textContent=e.name+" · "+e.category;
        role.textContent=s.role;
        text.textContent=e[s.key];
        if(counter)counter.textContent=(stage+1)+" de "+STAGES.length+" · ejemplo simulado";
        choices.forEach(function(b){var active=b.getAttribute("data-s3-example")===scenario;b.classList.toggle("s3-selected",active);b.setAttribute("aria-pressed",String(active));});
        steps.forEach(function(b){var active=Number(b.getAttribute("data-s3-stage"))===stage;b.classList.toggle("s3-selected",active);b.setAttribute("aria-pressed",String(active));});
      }
      choices.forEach(function(b){b.addEventListener("click",function(){scenario=b.getAttribute("data-s3-example");stage=0;render();});});
      steps.forEach(function(b){b.addEventListener("click",function(){stage=Number(b.getAttribute("data-s3-stage"));render();});});
      var next=root.querySelector("[data-s3-example-next]");
      if(next)next.addEventListener("click",function(){stage=(stage+1)%STAGES.length;render();});
      render();
    });
  }
  function boot() {initSplash();initDimensions();initMastery();initScenarios();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();