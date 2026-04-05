import { useState, useMemo, useEffect } from "react";

// â”€â”€ MOCK DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2026-03-01", desc: "Salary",           category: "Income",       amount:  85000, type: "income"  },
  { id: 2,  date: "2026-03-02", desc: "Rent",             category: "Housing",      amount: -22000, type: "expense" },
  { id: 3,  date: "2026-03-04", desc: "Grocery Store",    category: "Food",         amount:  -3200, type: "expense" },
  { id: 4,  date: "2026-03-06", desc: "Netflix",          category: "Leisure",      amount:   -649, type: "expense" },
  { id: 5,  date: "2026-03-07", desc: "Freelance Work",   category: "Income",       amount:  18000, type: "income"  },
  { id: 6,  date: "2026-03-09", desc: "Electricity Bill", category: "Utilities",    amount:  -1800, type: "expense" },
  { id: 7,  date: "2026-03-11", desc: "Zomato",           category: "Food",         amount:   -870, type: "expense" },
  { id: 8,  date: "2026-03-13", desc: "Gym Membership",   category: "Health",       amount:  -1200, type: "expense" },
  { id: 9,  date: "2026-03-15", desc: "Amazon Shopping",  category: "Shopping",     amount:  -4500, type: "expense" },
  { id: 10, date: "2026-03-17", desc: "Dividend",         category: "Income",       amount:   3200, type: "income"  },
  { id: 11, date: "2026-03-19", desc: "Petrol",           category: "Transport",    amount:  -1500, type: "expense" },
  { id: 12, date: "2026-03-20", desc: "Movie Tickets",    category: "Leisure",      amount:   -800, type: "expense" },
  { id: 13, date: "2026-03-22", desc: "Medical",          category: "Health",       amount:  -2600, type: "expense" },
  { id: 14, date: "2026-03-24", desc: "Water Bill",       category: "Utilities",    amount:   -400, type: "expense" },
  { id: 15, date: "2026-03-27", desc: "Dinner Out",       category: "Food",         amount:  -1100, type: "expense" },
  { id: 16, date: "2026-03-29", desc: "Interest Income",  category: "Income",       amount:   1800, type: "income"  },
  { id: 17, date: "2026-02-01", desc: "Salary",           category: "Income",       amount:  85000, type: "income"  },
  { id: 18, date: "2026-02-03", desc: "Rent",             category: "Housing",      amount: -22000, type: "expense" },
  { id: 19, date: "2026-02-06", desc: "Grocery Store",    category: "Food",         amount:  -2800, type: "expense" },
  { id: 20, date: "2026-02-10", desc: "Freelance Work",   category: "Income",       amount:  12000, type: "income"  },
  { id: 21, date: "2026-02-14", desc: "Valentine Dinner", category: "Food",         amount:  -2200, type: "expense" },
  { id: 22, date: "2026-02-18", desc: "Electricity Bill", category: "Utilities",    amount:  -1600, type: "expense" },
  { id: 23, date: "2026-02-22", desc: "Petrol",           category: "Transport",    amount:  -1300, type: "expense" },
  { id: 24, date: "2026-02-26", desc: "Dividend",         category: "Income",       amount:   3200, type: "income"  },
  { id: 25, date: "2026-01-01", desc: "Salary",           category: "Income",       amount:  80000, type: "income"  },
  { id: 26, date: "2026-01-02", desc: "Rent",             category: "Housing",      amount: -22000, type: "expense" },
  { id: 27, date: "2026-01-08", desc: "New Year Party",   category: "Leisure",      amount:  -3500, type: "expense" },
  { id: 28, date: "2026-01-12", desc: "Grocery Store",    category: "Food",         amount:  -3100, type: "expense" },
  { id: 29, date: "2026-01-20", desc: "Freelance Work",   category: "Income",       amount:   8000, type: "income"  },
  { id: 30, date: "2026-01-28", desc: "Dividend",         category: "Income",       amount:   3200, type: "income"  },
];

const CATEGORIES = ["All", "Income", "Housing", "Food", "Utilities", "Leisure", "Health", "Shopping", "Transport"];
const CATEGORY_COLORS = {
  Income: "#4ade80", Housing: "#f87171", Food: "#fb923c",
  Utilities: "#60a5fa", Leisure: "#c084fc", Health: "#34d399",
  Shopping: "#fbbf24", Transport: "#a78bfa",
};
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmt(n) {
  const abs = Math.abs(n);
  if (abs >= 100000) return `â‚¹${(abs/100000).toFixed(1)}L`;
  if (abs >= 1000) return `â‚¹${(abs/1000).toFixed(1)}K`;
  return `â‚¹${abs}`;
}
function fmtFull(n) {
  return `â‚¹${Math.abs(n).toLocaleString("en-IN")}`;
}

// â”€â”€ MINI CHART: Sparkline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Sparkline({ data, color, width=120, height=40 }) {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(" ").at(-1).split(",")[0]} cy={pts.split(" ").at(-1).split(",")[1]}
        r="3" fill={color} />
    </svg>
  );
}

// â”€â”€ DONUT CHART â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let angle = -90;
  const slices = data.map(d => {
    const pct = d.value / total;
    const deg = pct * 360;
    const r = 70, cx = 90, cy = 90;
    const start = (angle * Math.PI) / 180;
    const end = ((angle + deg) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const large = deg > 180 ? 1 : 0;
    const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
    angle += deg;
    return { ...d, path, pct };
  });
  return (
    <div style={{display:"flex",gap:"1.5rem",alignItems:"center",flexWrap:"wrap"}}>
      <svg width="180" height="180" style={{flexShrink:0}}>
        {slices.map((s,i) => <path key={i} d={s.path} fill={s.color} opacity="0.9" />)}
        <circle cx="90" cy="90" r="40" fill="#0f172a" />
        <text x="90" y="86" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="'DM Mono',monospace">Total</text>
        <text x="90" y="102" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily="'DM Mono',monospace">{fmt(total)}</text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",flex:1,minWidth:130}}>
        {slices.map((s,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.78rem"}}>
            <span style={{width:10,height:10,borderRadius:2,background:s.color,flexShrink:0}}></span>
            <span style={{color:"#94a3b8",flex:1}}>{s.label}</span>
            <span style={{color:"#e2e8f0",fontFamily:"'DM Mono',monospace"}}>{(s.pct*100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// â”€â”€ BAR CHART â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BarChart({ monthlyData }) {
  const maxVal = Math.max(...monthlyData.flatMap(m => [m.income, m.expense]));
  const H = 140;
  return (
    <div style={{overflowX:"auto"}}>
      <svg width={Math.max(monthlyData.length*70, 300)} height={H+40} style={{fontFamily:"'DM Mono',monospace"}}>
        {monthlyData.map((m, i) => {
          const x = i * 70 + 10;
          const incH = (m.income / maxVal) * H;
          const expH = (m.expense / maxVal) * H;
          return (
            <g key={i}>
              <rect x={x} y={H - incH} width={22} height={incH} fill="#4ade80" rx="3" opacity="0.85" />
              <rect x={x+24} y={H - expH} width={22} height={expH} fill="#f87171" rx="3" opacity="0.85" />
              <text x={x+23} y={H+14} textAnchor="middle" fill="#64748b" fontSize="10">{m.month}</text>
              <text x={x+11} y={H-incH-4} textAnchor="middle" fill="#4ade80" fontSize="8">{fmt(m.income)}</text>
              <text x={x+35} y={H-expH-4} textAnchor="middle" fill="#f87171" fontSize="8">{fmt(m.expense)}</text>
            </g>
          );
        })}
        <line x1="0" y1={H} x2={monthlyData.length*70+10} y2={H} stroke="#334155" strokeWidth="1"/>
      </svg>
      <div style={{display:"flex",gap:"1.2rem",marginTop:"0.5rem",fontSize:"0.78rem"}}>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:2,background:"#4ade80",display:"inline-block"}}></span><span style={{color:"#94a3b8"}}>Income</span></span>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:2,background:"#f87171",display:"inline-block"}}></span><span style={{color:"#94a3b8"}}>Expenses</span></span>
      </div>
    </div>
  );
}

// â”€â”€ MODAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Modal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { date: new Date().toISOString().slice(0,10), desc: "", category: "Food", amount: "", type: "expense" });
  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:16,padding:"2rem",width:"100%",maxWidth:420,boxShadow:"0 25px 60px rgba(0,0,0,0.5)"}}>
        <h3 style={{color:"#f8fafc",fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",margin:"0 0 1.5rem"}}>
          {initial ? "Edit Transaction" : "Add Transaction"}
        </h3>
        {[
          { label:"Description", key:"desc", type:"text" },
          { label:"Date", key:"date", type:"date" },
          { label:"Amount (â‚¹)", key:"amount", type:"number" },
        ].map(f => (
          <div key={f.key} style={{marginBottom:"1rem"}}>
            <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:4}}>{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
              style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:8,padding:"0.6rem 0.8rem",color:"#f8fafc",fontSize:"0.9rem",outline:"none",boxSizing:"border-box"}} />
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"}}>
          <div>
            <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:4}}>Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:8,padding:"0.6rem 0.8rem",color:"#f8fafc",fontSize:"0.9rem",outline:"none"}}>
              {CATEGORIES.filter(c=>c!=="All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{color:"#94a3b8",fontSize:"0.8rem",display:"block",marginBottom:4}}>Type</label>
            <select value={form.type} onChange={e => set("type", e.target.value)}
              style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:8,padding:"0.6rem 0.8rem",color:"#f8fafc",fontSize:"0.9rem",outline:"none"}}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        <div style={{display:"flex",gap:"0.75rem"}}>
          <button onClick={onClose} style={{flex:1,padding:"0.7rem",background:"#334155",color:"#94a3b8",border:"none",borderRadius:8,cursor:"pointer",fontSize:"0.9rem"}}>Cancel</button>
          <button onClick={() => {
            if(!form.desc || !form.amount || !form.date) return;
            const amt = parseFloat(form.amount);
            onSave({...form, amount: form.type==="expense" ? -Math.abs(amt) : Math.abs(amt)});
          }} style={{flex:1,padding:"0.7rem",background:"linear-gradient(135deg,#4ade80,#22c55e)",color:"#0f172a",border:"none",borderRadius:8,cursor:"pointer",fontSize:"0.9rem",fontWeight:700}}>
            {initial ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€ MAIN APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function App() {
  const [role, setRole] = useState("viewer");
  const [tab, setTab] = useState("dashboard");
  const [txns, setTxns] = useState(() => {
    try { const s = localStorage.getItem("fin_txns"); return s ? JSON.parse(s) : INITIAL_TRANSACTIONS; }
    catch { return INITIAL_TRANSACTIONS; }
  });
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState(-1);
  const [modal, setModal] = useState(null); // null | "add" | {txn}
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => { localStorage.setItem("fin_txns", JSON.stringify(txns)); }, [txns]);

  // â”€â”€ Derived â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const totalIncome = useMemo(() => txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0), [txns]);
  const totalExpense = useMemo(() => txns.filter(t=>t.type==="expense").reduce((s,t)=>s+Math.abs(t.amount),0), [txns]);
  const balance = totalIncome - totalExpense;

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    const map = {};
    txns.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) map[key] = { month: MONTHS[d.getMonth()], income: 0, expense: 0 };
      if (t.type === "income") map[key].income += t.amount;
      else map[key].expense += Math.abs(t.amount);
    });
    return Object.values(map).slice(-6);
  }, [txns]);

  // Spending by category for donut
  const categoryData = useMemo(() => {
    const map = {};
    txns.filter(t=>t.type==="expense").forEach(t => {
      map[t.category] = (map[t.category]||0) + Math.abs(t.amount);
    });
    return Object.entries(map).map(([k,v]) => ({label:k, value:v, color:CATEGORY_COLORS[k]||"#94a3b8"})).sort((a,b)=>b.value-a.value);
  }, [txns]);

  const topCategory = categoryData[0]?.label || "â€”";

  // Balance trend sparkline
  const balanceTrend = useMemo(() => {
    const sorted = [...txns].sort((a,b)=>new Date(a.date)-new Date(b.date));
    let running = 0;
    return sorted.map(t => { running += t.amount; return running; });
  }, [txns]);

  // Filtered & sorted transactions
  const filteredTxns = useMemo(() => {
    let list = txns.filter(t => {
      const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "All" || t.category === catFilter;
      const matchType = typeFilter === "All" || t.type === typeFilter;
      return matchSearch && matchCat && matchType;
    });
    list.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "amount") { va = a.amount; vb = b.amount; }
      if (sortKey === "date") { va = new Date(a.date); vb = new Date(b.date); }
      return va < vb ? -sortDir : va > vb ? sortDir : 0;
    });
    return list;
  }, [txns, search, catFilter, typeFilter, sortKey, sortDir]);

  // Insights
  const prevMonthExpense = useMemo(() => {
    const now = new Date("2026-03-31");
    const prevMonth = new Date("2026-02-28");
    return txns.filter(t => {
      const d = new Date(t.date);
      return t.type === "expense" && d.getMonth() === prevMonth.getMonth() && d.getFullYear() === prevMonth.getFullYear();
    }).reduce((s,t)=>s+Math.abs(t.amount),0);
  }, [txns]);
  const currMonthExpense = useMemo(() => {
    return txns.filter(t => {
      const d = new Date(t.date);
      return t.type === "expense" && d.getMonth() === 2 && d.getFullYear() === 2026;
    }).reduce((s,t)=>s+Math.abs(t.amount),0);
  }, [txns]);
  const expenseDelta = currMonthExpense - prevMonthExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const bg = darkMode ? "#0a0f1e" : "#f1f5f9";
  const card = darkMode ? "#1e293b" : "#ffffff";
  const border = darkMode ? "#1e3a5f" : "#e2e8f0";
  const textPrimary = darkMode ? "#f8fafc" : "#0f172a";
  const textSecondary = darkMode ? "#94a3b8" : "#475569";

  const S = {
    app: { minHeight:"100vh", background: darkMode ? "radial-gradient(ellipse at 20% 0%, #0f2040 0%, #0a0f1e 50%)" : "#f1f5f9", color:textPrimary, fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem" },
    header: { background: darkMode ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.9)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${border}`, padding:"0 1.5rem", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
    nav: { display:"flex", gap:"0.25rem" },
    navBtn: (active) => ({ padding:"0.4rem 1rem", borderRadius:8, border:"none", cursor:"pointer", fontSize:"0.82rem", fontWeight:600, fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s", background: active ? "#3b82f6" : "transparent", color: active ? "#fff" : textSecondary }),
    main: { maxWidth:1200, margin:"0 auto", padding:"2rem 1.5rem" },
    card: { background:card, border:`1px solid ${border}`, borderRadius:16, padding:"1.5rem", boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" },
    grid2: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem", marginBottom:"1.5rem" },
    grid12: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"1.5rem" },
    statCard: (color) => ({ background: darkMode ? `linear-gradient(135deg, rgba(${color},0.15), rgba(${color},0.05))` : `rgba(${color},0.07)`, border:`1px solid rgba(${color},0.3)`, borderRadius:16, padding:"1.25rem 1.5rem" }),
    badge: (type) => ({ display:"inline-block", padding:"0.15rem 0.6rem", borderRadius:99, fontSize:"0.72rem", fontWeight:600, fontFamily:"'DM Mono',monospace", background: type==="income" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color: type==="income" ? "#4ade80" : "#f87171" }),
    tag: (cat) => ({ display:"inline-block", padding:"0.15rem 0.5rem", borderRadius:6, fontSize:"0.72rem", background:`${CATEGORY_COLORS[cat] || "#64748b"}22`, color: CATEGORY_COLORS[cat] || "#64748b" }),
    btn: (variant="primary") => ({ padding:"0.55rem 1.2rem", borderRadius:10, border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.85rem", transition:"all 0.2s",
      background: variant==="primary" ? "linear-gradient(135deg,#3b82f6,#6366f1)" : variant==="green" ? "linear-gradient(135deg,#4ade80,#22c55e)" : variant==="danger" ? "rgba(248,113,113,0.15)" : "rgba(148,163,184,0.15)",
      color: variant==="danger" ? "#f87171" : variant==="green" ? "#0f172a" : "#fff" }),
    input: { background: darkMode ? "#0f172a" : "#f8fafc", border:`1px solid ${border}`, borderRadius:10, padding:"0.55rem 1rem", color:textPrimary, fontSize:"0.85rem", outline:"none", fontFamily:"'DM Sans',sans-serif" },
    select: { background: darkMode ? "#0f172a" : "#f8fafc", border:`1px solid ${border}`, borderRadius:10, padding:"0.55rem 0.8rem", color:textPrimary, fontSize:"0.85rem", outline:"none", cursor:"pointer" },
    th: { textAlign:"left", padding:"0.75rem 1rem", color:textSecondary, fontSize:"0.78rem", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", borderBottom:`1px solid ${border}` },
    td: { padding:"0.85rem 1rem", borderBottom:`1px solid ${border}`, verticalAlign:"middle" },
    sectionTitle: { fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", fontWeight:700, color:textPrimary, margin:"0 0 1.25rem" },
    insightCard: (color) => ({ background: darkMode ? "rgba(30,41,59,0.8)" : "#fff", border:`1px solid rgba(${color},0.3)`, borderRadius:14, padding:"1.25rem", borderLeft:`4px solid rgba(${color},0.8)` }),
  };

  const sortToggle = (key) => { if(sortKey===key) setSortDir(d=>-d); else { setSortKey(key); setSortDir(-1); } };
  const sortArrow = (key) => sortKey === key ? (sortDir === 1 ? " â†‘" : " â†“") : "";

  // â”€â”€ ADD/EDIT handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSave = (form) => {
    if (typeof modal === "object" && modal.id) {
      setTxns(ts => ts.map(t => t.id === modal.id ? {...t, ...form, amount: parseFloat(form.amount)} : t));
    } else {
      setTxns(ts => [...ts, {...form, id: Date.now(), amount: parseFloat(form.amount)}]);
    }
    setModal(null);
  };
  const handleDelete = (id) => setTxns(ts => ts.filter(t => t.id !== id));

  const exportCSV = () => {
    const rows = [["Date","Description","Category","Type","Amount"], ...txns.map(t => [t.date, t.desc, t.category, t.type, t.amount])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "transactions.csv"; a.click();
  };

  // â”€â”€ RENDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div style={S.app}>
      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",fontWeight:700,color:"#3b82f6",letterSpacing:"-0.02em"}}>
            FinFlow
          </div>
          <nav style={S.nav}>
            {["dashboard","transactions","insights"].map(t => (
              <button key={t} style={S.navBtn(tab===t)} onClick={()=>setTab(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8rem"}}>
            <span style={{color:textSecondary}}>Role:</span>
            <select value={role} onChange={e=>setRole(e.target.value)} style={{...S.select,padding:"0.3rem 0.6rem",fontSize:"0.8rem",borderRadius:8}}>
              <option value="viewer">ðŸ‘ Viewer</option>
              <option value="admin">ðŸ”‘ Admin</option>
            </select>
          </div>
          <button onClick={()=>setDarkMode(d=>!d)} style={{...S.btn("ghost"),padding:"0.4rem 0.8rem",background:darkMode?"#1e293b":"#e2e8f0",color:textSecondary,fontSize:"1rem"}}>
            {darkMode ? "â˜€ï¸" : "ðŸŒ™"}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={S.main}>

        {/* ROLE BANNER */}
        {role === "admin" && (
          <div style={{background:"linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.1))",border:"1px solid rgba(59,130,246,0.3)",borderRadius:12,padding:"0.75rem 1.25rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"0.75rem",fontSize:"0.85rem"}}>
            <span style={{fontSize:"1.1rem"}}>ðŸ”‘</span>
            <span style={{color:"#93c5fd",fontWeight:600}}>Admin Mode</span>
            <span style={{color:textSecondary}}>â€” You can add, edit, and delete transactions.</span>
          </div>
        )}

        {/* â”€â”€ DASHBOARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {tab === "dashboard" && (
          <>
            <h2 style={S.sectionTitle}>Overview</h2>

            {/* Summary Cards */}
            <div style={S.grid2}>
              {[
                { label:"Total Balance", value: balance, color:"59,130,246", icon:"ðŸ’°", trend: balanceTrend },
                { label:"Total Income", value: totalIncome, color:"74,222,128", icon:"ðŸ“ˆ" },
                { label:"Total Expenses", value: totalExpense, color:"248,113,113", icon:"ðŸ“‰" },
                { label:"Savings Rate", value: null, color:"192,132,252", icon:"ðŸŽ¯", raw:`${savingsRate}%` },
              ].map((c, i) => (
                <div key={i} style={S.statCard(c.color)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{color:textSecondary,fontSize:"0.78rem",marginBottom:4}}>{c.icon} {c.label}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:"1.5rem",fontWeight:700,color:textPrimary}}>
                        {c.raw || (c.value >= 0 ? "" : "-")}{c.value !== null ? fmt(Math.abs(c.value)) : ""}
                      </div>
                    </div>
                    {c.trend && <Sparkline data={c.trend.slice(-10)} color={`rgb(${c.color})`} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{...S.grid12, gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
              <div style={S.card}>
                <div style={{fontWeight:700,marginBottom:"1rem",color:textPrimary,fontSize:"0.95rem"}}>Monthly Income vs Expenses</div>
                <BarChart monthlyData={monthlyData} />
              </div>
              <div style={S.card}>
                <div style={{fontWeight:700,marginBottom:"1rem",color:textPrimary,fontSize:"0.95rem"}}>Spending Breakdown</div>
                {categoryData.length ? <DonutChart data={categoryData} /> : <div style={{color:textSecondary,textAlign:"center",padding:"2rem 0"}}>No expense data</div>}
              </div>
            </div>

            {/* Recent Transactions */}
            <div style={S.card}>
              <div style={{fontWeight:700,marginBottom:"1rem",color:textPrimary,fontSize:"0.95rem"}}>Recent Transactions</div>
              {txns.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5).map(t => (
                <div key={t.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 0",borderBottom:`1px solid ${border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                    <div style={{width:36,height:36,borderRadius:10,background:`${CATEGORY_COLORS[t.category]||"#64748b"}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0}}>
                      {t.type==="income"?"ðŸ’š":"ðŸ”´"}
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:"0.88rem",color:textPrimary}}>{t.desc}</div>
                      <div style={{fontSize:"0.75rem",color:textSecondary}}>{t.date} Â· <span style={{...S.tag(t.category)}}>{t.category}</span></div>
                    </div>
                  </div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:t.type==="income"?"#4ade80":"#f87171",fontSize:"0.95rem"}}>
                    {t.type==="income"?"+":"-"}{fmtFull(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* â”€â”€ TRANSACTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {tab === "transactions" && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem",flexWrap:"wrap",gap:"0.75rem"}}>
              <h2 style={{...S.sectionTitle,margin:0}}>Transactions</h2>
              <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
                {role === "admin" && (
                  <button style={S.btn("green")} onClick={()=>setModal("add")}>+ Add</button>
                )}
                <button style={S.btn("ghost")} onClick={exportCSV}>â¬‡ Export CSV</button>
              </div>
            </div>

            {/* Filters */}
            <div style={{...S.card,marginBottom:"1rem",padding:"1rem 1.25rem"}}>
              <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",alignItems:"center"}}>
                <input placeholder="ðŸ” Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{...S.input,flex:"1 1 200px"}} />
                <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={S.select}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
                <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={S.select}>
                  {["All","income","expense"].map(c=><option key={c} value={c}>{c==="All"?"All Types":c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
                {(search||catFilter!=="All"||typeFilter!=="All") && (
                  <button style={S.btn("ghost")} onClick={()=>{setSearch("");setCatFilter("All");setTypeFilter("All");}}>âœ• Clear</button>
                )}
              </div>
            </div>

            {/* Table */}
            <div style={{...S.card,padding:0,overflowX:"auto"}}>
              {filteredTxns.length === 0 ? (
                <div style={{padding:"3rem",textAlign:"center",color:textSecondary}}>
                  <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>ðŸ”</div>
                  <div>No transactions found.</div>
                </div>
              ) : (
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr>
                      {[["date","Date"],["desc","Description"],["category","Category"],["type","Type"],["amount","Amount"]].map(([k,l]) => (
                        <th key={k} style={{...S.th,cursor:"pointer",userSelect:"none"}} onClick={()=>sortToggle(k)}>{l}{sortArrow(k)}</th>
                      ))}
                      {role==="admin" && <th style={S.th}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.map(t => (
                      <tr key={t.id} style={{transition:"background 0.15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=darkMode?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{...S.td,fontFamily:"'DM Mono',monospace",fontSize:"0.8rem",color:textSecondary}}>{t.date}</td>
                        <td style={{...S.td,fontWeight:500}}>{t.desc}</td>
                        <td style={S.td}><span style={S.tag(t.category)}>{t.category}</span></td>
                        <td style={S.td}><span style={S.badge(t.type)}>{t.type}</span></td>
                        <td style={{...S.td,fontFamily:"'DM Mono',monospace",fontWeight:700,color:t.type==="income"?"#4ade80":"#f87171"}}>
                          {t.type==="income"?"+":"-"}{fmtFull(t.amount)}
                        </td>
                        {role === "admin" && (
                          <td style={S.td}>
                            <div style={{display:"flex",gap:"0.4rem"}}>
                              <button style={{...S.btn("ghost"),padding:"0.3rem 0.6rem",fontSize:"0.8rem"}} onClick={()=>setModal(t)}>âœï¸</button>
                              <button style={{...S.btn("danger"),padding:"0.3rem 0.6rem",fontSize:"0.8rem"}} onClick={()=>handleDelete(t.id)}>ðŸ—‘</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{marginTop:"0.75rem",color:textSecondary,fontSize:"0.8rem"}}>
              Showing {filteredTxns.length} of {txns.length} transactions
            </div>
          </>
        )}

        {/* â”€â”€ INSIGHTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {tab === "insights" && (
          <>
            <h2 style={S.sectionTitle}>Insights</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
              {[
                { color:"74,222,128", icon:"ðŸ†", title:"Top Spending Category", body: topCategory, sub: `â‚¹${categoryData[0]?.value?.toLocaleString("en-IN")||0} total` },
                { color:"248,113,113", icon:"ðŸ“Š", title:"Monthly Expense Change", body: expenseDelta >= 0 ? `+${fmtFull(expenseDelta)}` : `-${fmtFull(expenseDelta)}`, sub: expenseDelta>=0?"Higher than last month":"Lower than last month", subColor: expenseDelta>=0?"#f87171":"#4ade80" },
                { color:"192,132,252", icon:"ðŸ’°", title:"Savings Rate", body:`${savingsRate}%`, sub: savingsRate >= 20 ? "Great savings habit!" : "Try to save more" },
                { color:"96,165,250", icon:"ðŸ“ˆ", title:"Net Balance", body: fmt(balance), sub: balance >= 0 ? "Positive cashflow" : "Negative cashflow", subColor: balance>=0?"#4ade80":"#f87171" },
              ].map((c,i) => (
                <div key={i} style={S.insightCard(c.color)}>
                  <div style={{fontSize:"1.5rem",marginBottom:"0.5rem"}}>{c.icon}</div>
                  <div style={{color:textSecondary,fontSize:"0.78rem",marginBottom:"0.25rem"}}>{c.title}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:"1.5rem",fontWeight:700,color:textPrimary,marginBottom:"0.25rem"}}>{c.body}</div>
                  <div style={{fontSize:"0.8rem",color:c.subColor||textSecondary}}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Category Breakdown Table */}
            <div style={S.card}>
              <div style={{fontWeight:700,marginBottom:"1rem",fontSize:"0.95rem",color:textPrimary}}>Spending by Category</div>
              {categoryData.map((c, i) => (
                <div key={i} style={{marginBottom:"0.85rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:"0.85rem",fontWeight:500}}>{c.label}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.82rem",color:textSecondary}}>{fmtFull(c.value)}</span>
                  </div>
                  <div style={{height:6,background:darkMode?"#1e3a5f":"#e2e8f0",borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(c.value/categoryData[0].value*100).toFixed(0)}%`,background:c.color,borderRadius:99,transition:"width 0.5s ease"}} />
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Income vs Expense for last 3 months */}
            <div style={{...S.card,marginTop:"1.5rem"}}>
              <div style={{fontWeight:700,marginBottom:"1rem",fontSize:"0.95rem",color:textPrimary}}>Income vs Expense â€” Monthly</div>
              {monthlyData.slice(-3).map((m,i) => (
                <div key={i} style={{marginBottom:"1rem",padding:"0.85rem",background:darkMode?"rgba(15,23,42,0.4)":"rgba(0,0,0,0.02)",borderRadius:10}}>
                  <div style={{fontWeight:600,marginBottom:"0.5rem",color:textPrimary}}>{m.month} 2026</div>
                  <div style={{display:"flex",gap:"2rem",flexWrap:"wrap"}}>
                    <div><span style={{color:"#94a3b8",fontSize:"0.78rem"}}>Income </span><span style={{color:"#4ade80",fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtFull(m.income)}</span></div>
                    <div><span style={{color:"#94a3b8",fontSize:"0.78rem"}}>Expenses </span><span style={{color:"#f87171",fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtFull(m.expense)}</span></div>
                    <div><span style={{color:"#94a3b8",fontSize:"0.78rem"}}>Saved </span><span style={{color:m.income-m.expense>=0?"#4ade80":"#f87171",fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmtFull(m.income-m.expense)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {modal && (
        <Modal
          onClose={()=>setModal(null)}
          onSave={handleSave}
          initial={typeof modal === "object" ? modal : null}
        />
      )}
    </div>
  );
}
