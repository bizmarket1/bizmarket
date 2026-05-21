const storageKey = "bizmarket_pro_v3";

const initialListings = [
  {
    id:"slot-1",
    title:"Pozice pro ověřenou firmu",
    category:"E-shop",
    location:"Praha",
    price:"Cena po kontaktování",
    status:"Ověřovaná nabídka",
    image:"https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
    description:"Tento prostor je připraven pro první skutečné firmy. Nezobrazujeme falešná finanční data ani vymyšlené výsledky."
  },
  {
    id:"slot-2",
    title:"Prostor pro skutečnou nabídku",
    category:"Služby",
    location:"Česká republika",
    price:"Individuálně",
    status:"Připraveno k ověření",
    image:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    description:"Nabídka bude zveřejněna až po kontrole základních údajů a kontaktu s majitelem."
  },
  {
    id:"slot-3",
    title:"Místo pro novou firmu",
    category:"Restaurace",
    location:"Brno",
    price:"Bude doplněno",
    status:"Nová nabídka",
    image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    description:"BizMarket je připravený pro restaurace, služby, e-shopy i lokální firmy."
  }
];

let state = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify({
  listings: initialListings,
  leads: [],
  alerts: [],
  user:null
}));

function save(){ localStorage.setItem(storageKey, JSON.stringify(state)); }
function qs(id){ return document.getElementById(id); }
function toast(text){
  const el = qs("toast");
  if(!el){ alert(text); return; }
  el.textContent=text; el.style.display="block";
  setTimeout(()=>el.style.display="none",2600);
}
function renderListings(){
  const grid=qs("listingGrid");
  if(!grid) return;
  const q=(qs("search")?.value||"").toLowerCase();
  const cat=qs("category")?.value||"";
  const loc=qs("location")?.value||"";
  const filtered = state.listings.filter(item =>
    (!q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) &&
    (!cat || item.category===cat) &&
    (!loc || item.location===loc || item.location==="Česká republika")
  );
  grid.innerHTML = filtered.map(item => `
    <article class="card company-card">
      <img class="company-img" src="${item.image}" alt="${item.title}">
      <div class="company-body">
        <div class="meta">
          <span class="tag tag-verified">${item.status}</span>
          <span class="tag tag-new">${item.category}</span>
        </div>
        <h3>${item.title}</h3>
        <div class="price">${item.price}</div>
        <p class="muted">${item.location} · bez fake finančních údajů</p>
        <p class="muted">${item.description}</p>
        <a class="btn btn-primary btn-full" href="detail.html?id=${item.id}">Zobrazit detail</a>
      </div>
    </article>
  `).join("") || `<div class="panel"><h3>Nic nenalezeno</h3><p class="muted">Zkuste změnit filtry.</p></div>`;
}
function submitLead(formId, type){
  const form=qs(formId);
  if(!form) return;
  const data=Object.fromEntries(new FormData(form).entries());
  state.leads.push({...data,type,createdAt:new Date().toISOString()});
  save(); form.reset();
  toast("Uloženo. V další fázi napojíme databázi a e-mail.");
}
function addListing(formId){
  const form=qs(formId);
  if(!form) return;
  const data=Object.fromEntries(new FormData(form).entries());
  const item={
    id:"listing-"+Date.now(),
    title:data.title || "Nová firma",
    category:data.category || "Jiné",
    location:data.location || "Česká republika",
    price:data.price || "Cena po kontaktování",
    status:"Čeká na kontrolu",
    image:"https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
    description:data.description || "Nabídka čeká na doplnění."
  };
  state.listings.unshift(item);
  save();
  form.reset();
  toast("Nabídka byla uložena lokálně a čeká na kontrolu.");
}
function renderDashboard(){
  const box=qs("dashboardContent");
  if(!box) return;
  const leads = state.leads.length;
  box.innerHTML = `
    <div class="grid-4">
      <div class="panel"><span class="badge">Nabídky</span><h2>${state.listings.length}</h2><p class="muted">v lokálním MVP</p></div>
      <div class="panel"><span class="badge">Kontakty</span><h2>${leads}</h2><p class="muted">uložené poptávky</p></div>
      <div class="panel"><span class="badge">Ověření</span><h2>Manual</h2><p class="muted">schvalování ručně</p></div>
      <div class="panel"><span class="badge">Stav</span><h2>MVP</h2><p class="muted">před databází</p></div>
    </div>
    <div style="margin-top:24px">
      ${state.listings.map(l=>`
        <div class="dashboard-row">
          <div>
            <h3>${l.title}</h3>
            <p class="muted">${l.category} · ${l.location} · ${l.price}</p>
            <span class="tag tag-waiting">${l.status}</span>
          </div>
          <button class="btn btn-secondary" onclick="toast('Editace přijde v další fázi')">Spravovat</button>
        </div>
      `).join("")}
    </div>
  `;
}
document.addEventListener("DOMContentLoaded",()=>{
  renderListings();
  renderDashboard();
  ["search","category","location"].forEach(id=>{
    const el=qs(id);
    if(el){ el.addEventListener("input",renderListings); el.addEventListener("change",renderListings); }
  });
  const inquiry=qs("inquiryForm");
  if(inquiry) inquiry.addEventListener("submit", e=>{e.preventDefault();submitLead("inquiryForm","inquiry")});
  const add=qs("addListingForm");
  if(add) add.addEventListener("submit", e=>{e.preventDefault();addListing("addListingForm")});
  const alert=qs("alertForm");
  if(alert) alert.addEventListener("submit", e=>{e.preventDefault();submitLead("alertForm","alert")});
});
