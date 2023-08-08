let selected;

function getselectvalue() {
  const selectedvalue = document.getElementById("list").value;
  selected = data[selectedvalue];
  document.getElementById("test").innerHTML = selected.name;
}

function zfm() { // change name of function
  // ZFM: MASS / CG + Limitation
  const bem = selected.bem; 
  const bemcg = selected.bemcg;
  const bemmo = bem * bemcg; 
  const crew = parseFloat(document.getElementById("crew").value);
  const crewcg = selected.crewcg; 
  const crewmo = crew * crewcg; 
  const pax = parseFloat(document.getElementById("pax").value);
  const paxcg = selected.paxcg; 
  const paxmo = pax * paxcg; 
  const bag = parseFloat(document.getElementById("baggage").value);
  if (bag > selected.maxbag){
    alert("Check baggage compartment mass limitation!"); 
    document.getElementById("baggage").style.color = "red";
  }
  const bagcg = selected.bagcg; 
  const bagmo = bag * bagcg; 
  const zfm = bem + crew + pax + bag;
  const zfmmo = bemmo + crewmo + paxmo + bagmo; 
  const zfmcg = zfmmo / zfm;
  const zfmlbs = zfm * 2.205;
  const zfmcgin = zfmcg * 39.37; 
  document.getElementById("zfm").innerHTML = "Zero Fuel Mass: " + zfm.toFixed(2) + " kg" + " (" + zfmlbs.toFixed(2) + " lbs) | C.G.: " + zfmcg.toFixed(2) + " m (" + zfmcgin.toFixed(2) + " in)";
  // RAMP: MASS / CG + Limitation
  const fuel = parseFloat(document.getElementById("fuel").value);
  const fuelcg = selected.fuelcg;
  const fuelmo = fuel * fuelcg; 
  const ramp = zfm + fuel; 
  const rampmo = zfmmo + fuelmo; 
  const rampcg = rampmo / ramp; 
  if (ramp > selected.maxramp) {
    alert("Check Ramp Mass limitation!"); 
    document.getElementById("ramp").style.color = "red";
  }
  if (fuel > selected.maxfuel){
    alert("Check Fuel Capacity Limitation!")
    document.getElementById("ramp").style.color = "red";
  }
  const ramplbs = ramp * 2.205;
  const rampcgin = rampcg * 39.37; 
  document.getElementById("ramp").innerHTML = "Ramp Mass: " + ramp.toFixed(2) + " kg" + " (" + ramplbs.toFixed(2) + " lbs) | C.G.: " + rampcg.toFixed(2) + " m (" + rampcgin.toFixed(2) + " in)";
  // TOM: MASS / CG 
  const taxi = parseFloat(document.getElementById("taxi").value); 
  const taxicg = selected.fuelcg; 
  const taximo = taxi * taxicg; 
  const tom = ramp - taxi; 
  const tommo = rampmo - taximo; 
  const tomcg = tommo / tom; 
  if (tom > selected.maxtom) {
    alert("Check Ramp Mass Limitation!"); 
    document.getElementById("tom").style.color = "red";
  }
  const tomlbs = tom * 2.205;
  const tomcgin = tomcg * 39.37; 
  document.getElementById("tom").innerHTML = "Take-off Mass: " + tom.toFixed(2) + " kg" + " (" + tomlbs.toFixed(2) + " lbs) | C.G.: " + tomcg.toFixed(2) + " m (" + tomcgin.toFixed(2) + " in)";
  // LM: MASS / CG 
  const trip = parseFloat(document.getElementById("trip").value);
  const tripcg = selected.fuelcg; 
  const tripmo = trip * tripcg; 
  const lm = tom - trip; 
  const lmmo = tommo - tripmo; 
  const lmcg = lmmo / lm; 
  if (lm > selected.maxlm) {
    alert("Check Landing Mass Limitation!"); 
    document.getElementById("lm").style.color = "red";
  }
  const lmlbs = lm * 2.205;
  const lmcgin = lmcg * 39.37; 
  document.getElementById("lm").innerHTML = "Landing Mass: " + lm.toFixed(2) + " kg" + " (" + lmlbs.toFixed(2) + " lbs) | C.G.: " + lmcg.toFixed(2) + " m (" + lmcgin.toFixed(2) + " in)";
  // Useful Load: RampW - BemW
  const remUsefulL = selected.maxramp - ramp;
  const remUsefukLlbs = remUsefulL * 2.205;  
  document.getElementById("remUsefukL").innerHTML = "Remaining Useful Load: " + remUsefulL.toFixed(2) + " kg" + " (" + remUsefukLlbs.toFixed(2) + " lbs)" + "(Re-check C.G.!)"; 

  // CG graph 

  var envelope = [
    {x:selected.maxfwdcgL, y: selected.minmL},
    {x:selected.maxfwdcgL, y:selected.minmLH},
    {x:selected.maxfwdcgH, y:selected.minmHH},
    {x:selected.maxfwdcgHH, y:selected.minmHHH},
    {x:selected.maxaftcg, y:selected.minmHHH},
    {x:selected.maxaftcg, y:selected.minmL},
    {x:selected.maxfwdcgL, y:selected.minmL}
  ];

  var utility = [
    {x:selected.maxfwdcgUL , y:selected.minUL},
    {x:selected.maxfwdcgUL, y:selected.minUH},
    {x:selected.maxfwdcgUH, y:selected.minUHH},
    {x:selected.maxaftcgU, y: selected.minUHH},
    {x:selected.maxaftcgU, y: selected.minUL},
  ];
  
  var mb = [
    {x:rampcgin , y:ramplbs},
    {x:tomcgin, y: tomlbs},
    {x:lmcgin, y: lmlbs}, 
    {x:zfmcgin, y: zfmlbs}
  ]
  
  new Chart("myChart", {
    type: "scatter",
    data: {
      datasets: [{
        label: selected.name,
        pointRadius: 4,
        pointBackgroundColor: "rgb(0,0,255)",
        data: envelope,
        showLine: true,
        fill: true
      },
      {
        label: "Utility",
        pointRadius: 4,
        pointBackgroundColor: "rgb(255, 36, 0,)",
        data: utility,
        showLine: true,
        fill: true
      },
      {
        label: "Data",
        pointRadius: 4,
        pointBackgroundColor: "rgb(0,0,255)",
        data: mb,
        showLine: true,
      }
    ]
    },
    options: {
      legend: {display: true},
      scales: {
        xAxes: [{ticks: {min: 80, max:90}}],
        yAxes: [{ticks: {min: 1000, max:2500}}],
      }
    }
  });
}

getselectvalue();

const calc = document.querySelector("#calc");
const planes = document.querySelector("#list");

calc.addEventListener("click",zfm);
planes.addEventListener("change",getselectvalue);