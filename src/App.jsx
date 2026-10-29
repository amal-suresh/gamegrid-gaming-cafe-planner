
import { useMemo, useState } from "react";
import "./App.css";

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const money = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num(v));

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const maintenanceOptions = [
  { value: "none", label: "No maintenance" },
  { value: "monthly", label: "Monthly" },
  { value: "3", label: "Every 3 months" },
  { value: "6", label: "Every 6 months" },
  { value: "12", label: "Yearly" },
];

const defaultForm = {
  stations: "4",
  weekdayRate: "120",
  weekendRate: "180",
  weekdayOpenHours: "8",
  weekendOpenHours: "12",
  weekdayBookedHours: "3",
  weekendBookedHours: "8",
  weekdaysPerMonth: "22",
  weekendsPerMonth: "8",
  ownerWithdrawal: "15000",
  replacementCost: "380000",
  lifespanYears: "5",
};

const defaultExpenses = [
  { id: "rent", name: "Shop rent", amount: "25000" },
  { id: "staff", name: "Staff salary", amount: "15000" },
  { id: "electricity", name: "Electricity & AC", amount: "12000" },
  { id: "internet", name: "Internet", amount: "1500" },
  { id: "repairs", name: "General repairs", amount: "2000" },
  { id: "marketing", name: "Marketing", amount: "3000" },
  { id: "games", name: "Games & subscriptions", amount: "4000" },
  { id: "other", name: "Other monthly costs", amount: "3000" },
];

const defaultStartup = [
  { id: "ps5", name: "PS5 consoles", amount: "220000" },
  { id: "tv", name: "TVs / monitors", amount: "120000" },
  { id: "controllers", name: "Extra controllers", amount: "40000" },
  { id: "furniture", name: "Furniture & seating", amount: "40000" },
  { id: "interior", name: "Interior & branding", amount: "60000" },
  { id: "wiring", name: "Electrical & wiring", amount: "20000" },
  { id: "ac", name: "AC / ventilation", amount: "20000" },
  { id: "deposit", name: "Rental deposit", amount: "125000" },
  { id: "licence", name: "Licences / registration", amount: "10000" },
  { id: "other", name: "Other setup costs", amount: "30000" },
];

function makeAddon(name, icon, type, values = {}) {
  return {
    id: makeId(),
    name,
    icon,
    type,
    investment: "0",
    weekdayRate: "50",
    weekendRate: "80",
    weekdayOpenHours: "8",
    weekendOpenHours: "12",
    weekdayBookedHours: "2",
    weekendBookedHours: "4",
    salesIncome: "18000",
    stockCost: "11000",
    otherMonthlyCost: "0",
    maintenanceAmount: "0",
    maintenanceFrequency: "monthly",
    ...values,
  };
}

const defaultAddons = [
  makeAddon("Snacks & drinks", "🥤", "sales", {
    investment: "15000",
    salesIncome: "18000",
    stockCost: "11000",
    otherMonthlyCost: "500",
    maintenanceAmount: "300",
    maintenanceFrequency: "monthly",
  }),
  makeAddon("Carrom board", "🎯", "rental", {
    investment: "8000",
    weekdayRate: "50",
    weekendRate: "80",
    weekdayOpenHours: "8",
    weekendOpenHours: "12",
    weekdayBookedHours: "2",
    weekendBookedHours: "4",
    maintenanceAmount: "600",
    maintenanceFrequency: "3",
  }),
  makeAddon("Pool table", "🎱", "rental", {
    investment: "50000",
    weekdayRate: "100",
    weekendRate: "150",
    weekdayOpenHours: "8",
    weekendOpenHours: "12",
    weekdayBookedHours: "3",
    weekendBookedHours: "6",
    maintenanceAmount: "1500",
    maintenanceFrequency: "3",
  }),
  makeAddon("RC cars", "🏎️", "rental", {
    investment: "20000",
    weekdayRate: "100",
    weekendRate: "150",
    weekdayOpenHours: "8",
    weekendOpenHours: "12",
    weekdayBookedHours: "2",
    weekendBookedHours: "4",
    maintenanceAmount: "1000",
    maintenanceFrequency: "3",
  }),
];

function utilisation(bookedHours, openHours) {
  const open = Math.max(0, num(openHours));
  if (open <= 0) return 0;

  return Math.min(
    100,
    Math.max(0, (Math.max(0, num(bookedHours)) / open) * 100)
  );
}

function monthlyMaintenance(item) {
  const amount = Math.max(0, num(item.maintenanceAmount));

  if (item.maintenanceFrequency === "monthly") return amount;
  if (item.maintenanceFrequency === "3") return amount / 3;
  if (item.maintenanceFrequency === "6") return amount / 6;
  if (item.maintenanceFrequency === "12") return amount / 12;

  return 0;
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  step = "1",
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        {prefix && <span className="affix">{prefix}</span>}
        <input
          type="number"
          min={min}
          step={step}
          value={value ?? ""}
          onChange={(event) => {
            const raw = event.target.value;
            onChange(raw === "" ? "" : raw);
          }}
        />
        {suffix && <span className="affix suffix">{suffix}</span>}
      </div>
    </label>
  );
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Metric({ icon, label, value, note, color = "blue" }) {
  return (
    <article className={`metric metric-${color}`}>
      <div className="metric-head">
        <span className="metric-icon">{icon}</span>
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function UtilisationBar({ label, booked, open }) {
  const percentage = utilisation(booked, open);

  return (
    <div className="utilisation-row">
      <div className="utilisation-label">
        <span>{label}</span>
        <strong>{percentage.toFixed(1)}%</strong>
      </div>
      <div className="utilisation-track">
        <div
          className="utilisation-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <small>
        {num(booked)} booked hours out of {num(open)} available hours per day
      </small>
    </div>
  );
}

function App() {
  const [form, setForm] = useState(defaultForm);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [addons, setAddons] = useState(defaultAddons);
  const [startup, setStartup] = useState(defaultStartup);
  const [tab, setTab] = useState("overview");

  const updateForm = (key, value) => {
    setForm((old) => ({ ...old, [key]: value }));
  };

  const updateRow = (setter, rowId, key, value) => {
    setter((rows) =>
      rows.map((row) =>
        row.id === rowId ? { ...row, [key]: value } : row
      )
    );
  };

  const removeRow = (setter, rowId) => {
    setter((rows) => rows.filter((row) => row.id !== rowId));
  };

  const addExpense = () => {
    setExpenses((rows) => [
      ...rows,
      { id: makeId(), name: "New expense", amount: "" },
    ]);
  };

  const addStartup = () => {
    setStartup((rows) => [
      ...rows,
      { id: makeId(), name: "New setup item", amount: "" },
    ]);
  };

  const addAddon = (type) => {
    setAddons((rows) => [
      ...rows,
      makeAddon(
        type === "sales" ? "New sales item" : "New rental activity",
        type === "sales" ? "🛍️" : "🎮",
        type,
        {
          investment: "",
          salesIncome: "",
          stockCost: "",
          maintenanceAmount: "",
          otherMonthlyCost: "",
        }
      ),
    ]);
  };

  const results = useMemo(() => {
    const stations = Math.max(0, num(form.stations));
    const weekdays = Math.max(0, num(form.weekdaysPerMonth));
    const weekends = Math.max(0, num(form.weekendsPerMonth));

    const weekdayRate = Math.max(0, num(form.weekdayRate));
    const weekendRate = Math.max(0, num(form.weekendRate));
    const weekdayOpen = Math.max(0, num(form.weekdayOpenHours));
    const weekendOpen = Math.max(0, num(form.weekendOpenHours));

    const weekdayBooked = Math.min(
      weekdayOpen,
      Math.max(0, num(form.weekdayBookedHours))
    );
    const weekendBooked = Math.min(
      weekendOpen,
      Math.max(0, num(form.weekendBookedHours))
    );

    const ps5Weekday =
      stations * weekdayRate * weekdayBooked * weekdays;
    const ps5Weekend =
      stations * weekendRate * weekendBooked * weekends;
    const ps5Revenue = ps5Weekday + ps5Weekend;

    const addonResults = addons.map((item) => {
      const investment = Math.max(0, num(item.investment));
      const maintenance = monthlyMaintenance(item);
      const otherCost = Math.max(0, num(item.otherMonthlyCost));

      let weekdayRevenue = 0;
      let weekendRevenue = 0;
      let revenue = 0;
      let directCosts = 0;
      let weekdayUtil = 0;
      let weekendUtil = 0;

      if (item.type === "rental") {
        const weekdayOpenHours = Math.max(0, num(item.weekdayOpenHours));
        const weekendOpenHours = Math.max(0, num(item.weekendOpenHours));

        const weekdayBookedHours = Math.min(
          weekdayOpenHours,
          Math.max(0, num(item.weekdayBookedHours))
        );
        const weekendBookedHours = Math.min(
          weekendOpenHours,
          Math.max(0, num(item.weekendBookedHours))
        );

        weekdayUtil = utilisation(weekdayBookedHours, weekdayOpenHours);
        weekendUtil = utilisation(weekendBookedHours, weekendOpenHours);

        weekdayRevenue =
          Math.max(0, num(item.weekdayRate)) *
          weekdayBookedHours *
          weekdays;

        weekendRevenue =
          Math.max(0, num(item.weekendRate)) *
          weekendBookedHours *
          weekends;

        revenue = weekdayRevenue + weekendRevenue;
      } else {
        revenue = Math.max(0, num(item.salesIncome));
        directCosts = Math.max(0, num(item.stockCost));
      }

      const totalCosts = directCosts + otherCost + maintenance;
      const profit = revenue - totalCosts;

      return {
        ...item,
        investment,
        maintenance,
        otherCost,
        weekdayRevenue,
        weekendRevenue,
        revenue,
        directCosts,
        totalCosts,
        profit,
        weekdayUtil,
        weekendUtil,
        paybackMonths: profit > 0 ? investment / profit : null,
      };
    });

    const addonRevenue = addonResults.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    const addonCosts = addonResults.reduce(
      (sum, item) => sum + item.totalCosts,
      0
    );

    const addonInvestment = addonResults.reduce(
      (sum, item) => sum + item.investment,
      0
    );

    const fixedExpenses = expenses.reduce(
      (sum, item) => sum + Math.max(0, num(item.amount)),
      0
    );

    const coreStartup = startup.reduce(
      (sum, item) => sum + Math.max(0, num(item.amount)),
      0
    );

    const startupInvestment = coreStartup + addonInvestment;
    const totalRevenue = ps5Revenue + addonRevenue;
    const totalExpenses = fixedExpenses + addonCosts;
    const operatingProfit = totalRevenue - totalExpenses;
    const withdrawal = Math.max(0, num(form.ownerWithdrawal));

    const lifespanMonths = Math.max(
      1,
      Math.max(0, num(form.lifespanYears)) * 12
    );

    const replacementReserve =
      Math.max(0, num(form.replacementCost)) / lifespanMonths;

    const monthlyCash = operatingProfit - withdrawal - replacementReserve;
    const paybackMonths =
      monthlyCash > 0 ? startupInvestment / monthlyCash : null;

    const totalMaintenance = addonResults.reduce(
      (sum, item) => sum + item.maintenance,
      0
    );

    return {
      weekdays,
      weekends,
      weekdayOpen,
      weekendOpen,
      weekdayBooked,
      weekendBooked,
      weekdayUtil: utilisation(weekdayBooked, weekdayOpen),
      weekendUtil: utilisation(weekendBooked, weekendOpen),
      ps5Weekday,
      ps5Weekend,
      ps5Revenue,
      addonResults,
      addonRevenue,
      addonCosts,
      addonInvestment,
      fixedExpenses,
      coreStartup,
      startupInvestment,
      totalRevenue,
      totalExpenses,
      operatingProfit,
      withdrawal,
      replacementReserve,
      monthlyCash,
      paybackMonths,
      totalMaintenance,
      margin: totalRevenue > 0 ? (operatingProfit / totalRevenue) * 100 : 0,
    };
  }, [form, expenses, addons, startup]);

  const reset = () => {
    setForm(defaultForm);
    setExpenses(defaultExpenses);
    setAddons(defaultAddons);
    setStartup(defaultStartup);
    setTab("overview");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">GG</div>
          <div>
            <strong>GAME<span>GRID</span></strong>
            <small>CAFE PLANNER</small>
          </div>
        </div>

        <p className="side-label">WORKSPACE</p>
        <nav className="side-nav">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>▦ &nbsp; Overview</button>
          <button className={tab === "addons" ? "active" : ""} onClick={() => setTab("addons")}>↗ &nbsp; Add-on planner</button>
          <button className={tab === "expenses" ? "active" : ""} onClick={() => setTab("expenses")}>▤ &nbsp; Monthly expenses</button>
          <button className={tab === "startup" ? "active" : ""} onClick={() => setTab("startup")}>⌂ &nbsp; Initial investment</button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-promo">
            <span>🎮</span>
            <h3>Play smart. Plan smarter.</h3>
            <p>Model your café before investing real money.</p>
          </div>
          <small className="sidebar-foot">GAMEGRID FINANCIAL PLANNER</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Business simulator</p>
            <h1>Gaming Café Planner <i className="live-dot" /></h1>
          </div>
          <button className="reset-btn" onClick={reset}>↺ Reset planner</button>
        </header>

        <section className="hero-banner">
          <div className="hero-copy">
            <div className="hero-tag"><i /> YOUR BUSINESS SIMULATOR</div>
            <h2>Build your café.<br />Make your <span>next move.</span></h2>
            <p>Plan your setup, estimate gaming income, track add-on activities, and calculate maintenance and monthly cash flow.</p>
            <div className="hero-pills">
              <span>🎮 PS5 gaming</span>
              <span>🎱 Pool & carrom</span>
              <span>🥤 Snacks & drinks</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="controller">
              <div className="dpad" />
              <div className="stick stick-a" />
              <div className="stick stick-b" />
              <div className="buttons"><i>△</i><i>○</i><i>×</i><i>□</i></div>
            </div>
            <span className="float-chip float-a">LEVEL UP ↗</span>
            <span className="float-chip float-b">+ PROFIT</span>
          </div>
        </section>

        <div className="mobile-tabs">
          {[
            ["overview", "Overview"],
            ["addons", "Add-ons"],
            ["expenses", "Expenses"],
            ["startup", "Investment"],
          ].map(([value, label]) => (
            <button key={value} className={tab === value ? "active" : ""} onClick={() => setTab(value)}>{label}</button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <SectionTitle
              eyebrow="LIVE MONTHLY ESTIMATES"
              title="Your café at a glance"
              description="Booked hours calculate utilisation automatically. Adjust your assumptions to update the estimates."
            />

            <div className="metrics-grid">
              <Metric icon="↗" label="Monthly revenue" value={money(results.totalRevenue)} note="PS5 + all add-ons" color="blue" />
              <Metric icon="◈" label="Operating profit" value={money(results.operatingProfit)} note={`${results.margin.toFixed(1)}% operating margin`} color="purple" />
              <Metric icon="₹" label="Cash after reserves" value={money(results.monthlyCash)} note="After owner draw and replacement reserve" color={results.monthlyCash >= 0 ? "green" : "red"} />
              <Metric icon="⌂" label="Total initial investment" value={money(results.startupInvestment)} note="Core setup + add-on equipment" color="orange" />
            </div>

            <div className="dashboard-grid">
              <section className="panel">
                <SectionTitle
                  eyebrow="MAIN GAMING REVENUE"
                  title="PS5 pricing & booked hours"
                  description="Enter expected booked hours per station per day."
                />
                <div className="fields-grid">
                  <Field label="Number of PS5 stations" value={form.stations} onChange={(v) => updateForm("stations", v)} />
                  <Field label="Weekday rate / hour" prefix="₹" value={form.weekdayRate} onChange={(v) => updateForm("weekdayRate", v)} />
                  <Field label="Weekend rate / hour" prefix="₹" value={form.weekendRate} onChange={(v) => updateForm("weekendRate", v)} />
                  <Field label="Weekday opening hours" suffix="hrs/day" value={form.weekdayOpenHours} onChange={(v) => updateForm("weekdayOpenHours", v)} />
                  <Field label="Weekend opening hours" suffix="hrs/day" value={form.weekendOpenHours} onChange={(v) => updateForm("weekendOpenHours", v)} />
                  <Field label="Weekday booked hours / station" suffix="hrs/day" value={form.weekdayBookedHours} onChange={(v) => updateForm("weekdayBookedHours", v)} />
                  <Field label="Weekend booked hours / station" suffix="hrs/day" value={form.weekendBookedHours} onChange={(v) => updateForm("weekendBookedHours", v)} />
                  <Field label="Weekdays per month" value={form.weekdaysPerMonth} onChange={(v) => updateForm("weekdaysPerMonth", v)} />
                  <Field label="Weekend days per month" value={form.weekendsPerMonth} onChange={(v) => updateForm("weekendsPerMonth", v)} />
                </div>

                <div className="utilisation-box">
                  <h3>Automatically calculated utilisation</h3>
                  <UtilisationBar label="Weekday utilisation" booked={results.weekdayBooked} open={results.weekdayOpen} />
                  <UtilisationBar label="Weekend utilisation" booked={results.weekendBooked} open={results.weekendOpen} />
                  <p>Utilisation = booked hours ÷ opening hours × 100. Booked hours are capped at the available opening hours.</p>
                </div>
              </section>

              <section className="panel">
                <SectionTitle eyebrow="REVENUE MIX" title="Where your money comes from" description="Monthly estimates by business activity." />
                <div className="revenue-total"><span>Total monthly revenue</span><strong>{money(results.totalRevenue)}</strong></div>

                <div className="bar-list">
                  <div>
                    <div className="bar-label"><span>🎮 PS5 gaming</span><strong>{money(results.ps5Revenue)}</strong></div>
                    <div className="bar-track"><div className="bar-fill bar-blue" style={{ width: `${results.totalRevenue > 0 ? Math.min(100, results.ps5Revenue / results.totalRevenue * 100) : 0}%` }} /></div>
                  </div>
                  <div>
                    <div className="bar-label"><span>✨ Add-on activities</span><strong>{money(results.addonRevenue)}</strong></div>
                    <div className="bar-track"><div className="bar-fill bar-purple" style={{ width: `${results.totalRevenue > 0 ? Math.min(100, results.addonRevenue / results.totalRevenue * 100) : 0}%` }} /></div>
                  </div>
                </div>

                <div className="mini-stats">
                  <div><span>Weekday PS5 income</span><strong>{money(results.ps5Weekday)}</strong></div>
                  <div><span>Weekend PS5 income</span><strong>{money(results.ps5Weekend)}</strong></div>
                  <div><span>Monthly add-on maintenance</span><strong>{money(results.totalMaintenance)}</strong></div>
                  <div><span>Fixed monthly expenses</span><strong>{money(results.fixedExpenses)}</strong></div>
                </div>

                <div className="profit-summary"><span>Operating profit / month</span><strong className={results.operatingProfit >= 0 ? "text-green" : "text-red"}>{money(results.operatingProfit)}</strong></div>
              </section>
            </div>

            <section className="panel">
              <SectionTitle eyebrow="MONTHLY CASH FLOW" title="What could you keep?" description="Operating profit minus owner withdrawal and equipment replacement savings." />
              <div className="forecast-grid">
                <div className="forecast-box"><span>Operating profit</span><strong>{money(results.operatingProfit)}</strong><small>Revenue less monthly expenses</small></div>
                <div className="forecast-box"><span>Owner withdrawal</span><strong>{money(results.withdrawal)}</strong><small>Your monthly draw</small></div>
                <div className="forecast-box"><span>Replacement reserve</span><strong>{money(results.replacementReserve)}</strong><small>Monthly equipment savings</small></div>
                <div className={`forecast-box final-box ${results.monthlyCash >= 0 ? "positive" : "negative"}`}><span>Estimated cash left</span><strong>{money(results.monthlyCash)}</strong><small>{results.monthlyCash >= 0 ? "Positive monthly cash flow" : "Review prices, bookings or expenses"}</small></div>
              </div>

              <div className="fields-grid reserve-fields">
                <Field label="Owner withdrawal / month" prefix="₹" value={form.ownerWithdrawal} onChange={(v) => updateForm("ownerWithdrawal", v)} />
                <Field label="Equipment replacement budget" prefix="₹" value={form.replacementCost} onChange={(v) => updateForm("replacementCost", v)} />
                <Field label="Equipment lifespan" suffix="years" value={form.lifespanYears} onChange={(v) => updateForm("lifespanYears", v)} />
              </div>

              <div className="payback-strip">
                <span>⏱</span>
                <div>
                  <strong>{results.paybackMonths !== null ? `Estimated investment payback: ${results.paybackMonths.toFixed(1)} months` : "Investment payback is not currently reached"}</strong>
                  <p>This estimate assumes current monthly cash flow continues. Actual demand and costs may vary.</p>
                </div>
              </div>
            </section>
          </>
        )}

        {tab === "addons" && (
          <>
            <SectionTitle
              eyebrow="ADDITIONAL BUSINESS ACTIVITIES"
              title="Add-on investment planner"
              description="Enter initial cost, hourly pricing, expected booked hours, maintenance and monthly costs for each add-on."
              action={<button className="primary-btn" onClick={() => addAddon("rental")}>+ Add rental item</button>}
            />

            <div className="addon-help">
              <div><span>🎱</span><div><strong>Rental activities</strong><p>Pool, carrom and RC cars use hourly rates and booked hours.</p></div></div>
              <div><span>🥤</span><div><strong>Sales activities</strong><p>Snacks and drinks use monthly sales minus stock costs.</p></div></div>
            </div>

            <div className="addon-actions"><button className="secondary-btn" onClick={() => addAddon("sales")}>+ Add sales item</button></div>

            <div className="addon-list">
              {results.addonResults.map((item) => (
                <section className="panel addon-panel" key={item.id}>
                  <div className="addon-title-row">
                    <div className="addon-title-icon">{item.icon}</div>
                    <div className="addon-title-text">
                      <input className="name-edit" aria-label="Add-on name" value={item.name} onChange={(e) => updateRow(setAddons, item.id, "name", e.target.value)} />
                      <span className={`type-badge ${item.type}`}>{item.type === "rental" ? "HOURLY RENTAL" : "MONTHLY SALES"}</span>
                    </div>
                    <button className="delete-btn" onClick={() => removeRow(setAddons, item.id)} aria-label={`Delete ${item.name}`}>×</button>
                  </div>

                  <div className="fields-grid addon-main-fields">
                    <Field label="Initial investment" prefix="₹" value={item.investment} onChange={(v) => updateRow(setAddons, item.id, "investment", v)} />
                    <label className="field">
                      <span>Income model</span>
                      <select value={item.type} onChange={(e) => updateRow(setAddons, item.id, "type", e.target.value)}>
                        <option value="rental">Hourly rental</option>
                        <option value="sales">Monthly sales</option>
                      </select>
                    </label>
                  </div>

                  {item.type === "rental" ? (
                    <>
                      <h3 className="subheading">Pricing, opening hours & bookings</h3>
                      <div className="fields-grid">
                        <Field label="Weekday rate / hour" prefix="₹" value={item.weekdayRate} onChange={(v) => updateRow(setAddons, item.id, "weekdayRate", v)} />
                        <Field label="Weekend rate / hour" prefix="₹" value={item.weekendRate} onChange={(v) => updateRow(setAddons, item.id, "weekendRate", v)} />
                        <Field label="Weekday opening hours" suffix="hrs/day" value={item.weekdayOpenHours} onChange={(v) => updateRow(setAddons, item.id, "weekdayOpenHours", v)} />
                        <Field label="Weekend opening hours" suffix="hrs/day" value={item.weekendOpenHours} onChange={(v) => updateRow(setAddons, item.id, "weekendOpenHours", v)} />
                        <Field label="Weekday booked hours / item" suffix="hrs/day" value={item.weekdayBookedHours} onChange={(v) => updateRow(setAddons, item.id, "weekdayBookedHours", v)} />
                        <Field label="Weekend booked hours / item" suffix="hrs/day" value={item.weekendBookedHours} onChange={(v) => updateRow(setAddons, item.id, "weekendBookedHours", v)} />
                      </div>

                      <div className="utilisation-box compact-utilisation">
                        <h3>Automatic utilisation</h3>
                        <UtilisationBar label="Weekday utilisation" booked={item.weekdayBookedHours} open={item.weekdayOpenHours} />
                        <UtilisationBar label="Weekend utilisation" booked={item.weekendBookedHours} open={item.weekendOpenHours} />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="subheading">Monthly sales & stock costs</h3>
                      <div className="fields-grid">
                        <Field label="Monthly sales revenue" prefix="₹" value={item.salesIncome} onChange={(v) => updateRow(setAddons, item.id, "salesIncome", v)} />
                        <Field label="Monthly stock / purchase cost" prefix="₹" value={item.stockCost} onChange={(v) => updateRow(setAddons, item.id, "stockCost", v)} />
                      </div>
                    </>
                  )}

                  <h3 className="subheading">Maintenance & running costs</h3>
                  <div className="fields-grid">
                    <Field label="Maintenance amount per service" prefix="₹" value={item.maintenanceAmount} onChange={(v) => updateRow(setAddons, item.id, "maintenanceAmount", v)} />
                    <label className="field">
                      <span>Maintenance frequency</span>
                      <select value={item.maintenanceFrequency} onChange={(e) => updateRow(setAddons, item.id, "maintenanceFrequency", e.target.value)}>
                        {maintenanceOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                    <Field label="Other monthly running costs" prefix="₹" value={item.otherMonthlyCost} onChange={(v) => updateRow(setAddons, item.id, "otherMonthlyCost", v)} />
                  </div>

                  <div className="maintenance-note">
                    <span>🔧</span>
                    <span>Equivalent monthly maintenance reserve: <strong>{money(item.maintenance)}</strong></span>
                  </div>

                  <div className="addon-results-grid">
                    <div><span>Weekday revenue / month</span><strong>{money(item.weekdayRevenue)}</strong></div>
                    <div><span>Weekend revenue / month</span><strong>{money(item.weekendRevenue)}</strong></div>
                    <div><span>Total revenue / month</span><strong>{money(item.revenue)}</strong></div>
                    <div><span>Total costs / month</span><strong>{money(item.totalCosts)}</strong></div>
                    <div className="net-result"><span>Net profit / month</span><strong className={item.profit >= 0 ? "text-green" : "text-red"}>{money(item.profit)}</strong></div>
                    <div className="payback-result"><span>Investment recovery</span><strong>{item.paybackMonths !== null ? `${item.paybackMonths.toFixed(1)} months` : "Not reached"}</strong></div>
                  </div>
                </section>
              ))}
            </div>

            <section className="panel">
              <SectionTitle eyebrow="ALL ADD-ONS COMBINED" title="Side business summary" />
              <div className="summary-grid">
                <div><span>Initial add-on investment</span><strong>{money(results.addonInvestment)}</strong></div>
                <div><span>Monthly add-on revenue</span><strong>{money(results.addonRevenue)}</strong></div>
                <div><span>Monthly add-on costs</span><strong>{money(results.addonCosts)}</strong></div>
                <div><span>Net monthly contribution</span><strong className={results.addonRevenue - results.addonCosts >= 0 ? "text-green" : "text-red"}>{money(results.addonRevenue - results.addonCosts)}</strong></div>
              </div>
            </section>
          </>
        )}

        {tab === "expenses" && (
          <>
            <SectionTitle
              eyebrow="RECURRING BUSINESS COSTS"
              title="Monthly operating expenses"
              description="Add or remove monthly expenses. They feed into the overall profit calculation."
              action={<button className="primary-btn" onClick={addExpense}>+ Add expense</button>}
            />
            <section className="panel">
              <div className="editable-head"><span>Expense name</span><span>Monthly amount</span><span /></div>
              {expenses.map((item) => (
                <div className="editable-row" key={item.id}>
                  <input value={item.name} aria-label="Expense name" onChange={(e) => updateRow(setExpenses, item.id, "name", e.target.value)} />
                  <div className="amount-input"><span>₹</span><input type="number" min="0" value={item.amount} aria-label={`${item.name} amount`} onChange={(e) => updateRow(setExpenses, item.id, "amount", e.target.value === "" ? "" : e.target.value)} /></div>
                  <button className="delete-btn" onClick={() => removeRow(setExpenses, item.id)} aria-label={`Remove ${item.name}`}>×</button>
                </div>
              ))}
              <div className="expense-total"><span>Total fixed monthly expenses</span><strong>{money(results.fixedExpenses)}</strong></div>
            </section>
            <section className="panel">
              <SectionTitle eyebrow="PROFIT SUMMARY" title="Income versus expenses" />
              <div className="summary-grid">
                <div><span>Total revenue</span><strong>{money(results.totalRevenue)}</strong></div>
                <div><span>All monthly expenses</span><strong>{money(results.totalExpenses)}</strong></div>
                <div><span>Operating profit</span><strong className={results.operatingProfit >= 0 ? "text-green" : "text-red"}>{money(results.operatingProfit)}</strong></div>
                <div><span>Cash after reserves</span><strong className={results.monthlyCash >= 0 ? "text-green" : "text-red"}>{money(results.monthlyCash)}</strong></div>
              </div>
            </section>
          </>
        )}

        {tab === "startup" && (
          <>
            <SectionTitle
              eyebrow="ONE-TIME SETUP COSTS"
              title="Initial investment planner"
              description="Edit your core setup costs. Add-on equipment investment is included automatically."
              action={<button className="primary-btn" onClick={addStartup}>+ Add setup item</button>}
            />
            <section className="panel">
              <div className="startup-total">
                <div><span>Core café setup</span><strong>{money(results.coreStartup)}</strong></div>
                <div><span>Add-on equipment</span><strong>{money(results.addonInvestment)}</strong></div>
                <div className="startup-grand"><span>Total initial investment</span><strong>{money(results.startupInvestment)}</strong></div>
              </div>
              <div className="editable-head"><span>Setup item</span><span>Estimated cost</span><span /></div>
              {startup.map((item) => (
                <div className="editable-row" key={item.id}>
                  <input value={item.name} aria-label="Setup item" onChange={(e) => updateRow(setStartup, item.id, "name", e.target.value)} />
                  <div className="amount-input"><span>₹</span><input type="number" min="0" value={item.amount} aria-label={`${item.name} cost`} onChange={(e) => updateRow(setStartup, item.id, "amount", e.target.value === "" ? "" : e.target.value)} /></div>
                  <button className="delete-btn" onClick={() => removeRow(setStartup, item.id)} aria-label={`Remove ${item.name}`}>×</button>
                </div>
              ))}
            </section>

            <section className="panel">
              <SectionTitle eyebrow="MAINTENANCE PLANNING" title="How the reserve is calculated" description="Each add-on has one selected maintenance schedule." />
              <div className="maintenance-examples">
                <div><span>Monthly service</span><strong>Amount ÷ 1</strong></div>
                <div><span>Every 3 months</span><strong>Amount ÷ 3</strong></div>
                <div><span>Every 6 months</span><strong>Amount ÷ 6</strong></div>
                <div><span>Yearly service</span><strong>Amount ÷ 12</strong></div>
              </div>
              <p className="small-note">The planner converts each selected maintenance cost into an equivalent monthly reserve. Select only one frequency per item to avoid double-counting.</p>
            </section>
          </>
        )}

        <footer className="app-footer">
          <span>GAMEGRID · GAMING CAFÉ PLANNER</span>
          <span>Planning estimates only — validate local prices and demand.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
