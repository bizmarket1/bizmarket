const listings = [
  {
    id: "preview-eshop",
    title: "Ukázková karta nabídky",
    category: "E-shop",
    location: "Praha",
    price: "Cena po kontaktování",
    status: "Ověřovaná nabídka",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
    description: "Tento prostor je připraven pro první skutečné nabídky. Nezobrazujeme falešná finanční data ani vymyšlené výsledky."
  },
  {
    id: "preview-services",
    title: "Prostor pro skutečnou firmu",
    category: "Služby",
    location: "Česká republika",
    price: "Individuálně",
    status: "Připraveno k ověření",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    description: "Nabídka bude zveřejněna až po kontrole základních údajů a kontaktu s majitelem."
  },
  {
    id: "preview-restaurant",
    title: "Místo pro novou nabídku",
    category: "Restaurace",
    location: "Brno",
    price: "Bude doplněno",
    status: "Nová nabídka",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    description: "BizMarket je připravený pro restaurace, služby, e-shopy i menší lokální firmy."
  }
];

function qs(id){return document.getElementById(id)}
function toast(text){
  const el = qs("toast");
  if(!el){ alert(text); return; }
  el.textContent = text;
  el.style.display = "block";
  setTimeout(()=> el.style.display = "none", 2600);
}
function renderListings(){
  const grid = qs("listingGrid");
  if(!grid) return;
  const q = (qs("search")?.value || "").toLowerCase();
  const cat = qs("category")?.value || "";
  const loc = qs("location")?.value || "";
  const filtered = listings.filter(item =>
    (!q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) &&
    (!cat || item.category === cat) &&
    (!loc || item.location === loc || item.location === "Česká republika")
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
        <a class="btn btn-primary btn-full" href="detail.html">Zobrazit detail</a>
      </div>
    </article>
  `).join("") || `<div class="panel"><h3>Nic nenalezeno</h3><p class="muted">Zkuste změnit filtry.</p></div>`;
}
function saveLead(formId){
  const form = qs(formId);
  if(!form) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const leads = JSON.parse(localStorage.getItem("bizmarket_leads") || "[]");
  leads.push({...data, createdAt:new Date().toISOString()});
  localStorage.setItem("bizmarket_leads", JSON.stringify(leads));
  form.reset();
  toast("Uloženo lokálně. V další fázi napojíme databázi a e-mail.");
}
document.addEventListener("DOMContentLoaded",()=>{
  renderListings();
  ["search","category","location"].forEach(id=>{
    const el = qs(id);
    if(el) el.addEventListener("input", renderListings);
    if(el) el.addEventListener("change", renderListings);
  });
  const inquiry = qs("inquiryForm");
  if(inquiry) inquiry.addEventListener("submit", e=>{e.preventDefault(); saveLead("inquiryForm")});
  const add = qs("addListingForm");
  if(add) add.addEventListener("submit", e=>{e.preventDefault(); saveLead("addListingForm")});
});
