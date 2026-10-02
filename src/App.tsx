import { useEffect, useMemo, useState } from "react";

type IconName =
  | "accessibility"
  | "arrow"
  | "audio"
  | "braille"
  | "check"
  | "chevron"
  | "clock"
  | "contrast"
  | "cross"
  | "gps"
  | "heart"
  | "map"
  | "menu"
  | "mic"
  | "pin"
  | "route"
  | "shield"
  | "sun"
  | "users"
  | "wifi";

type Role = "patient" | "reception" | "clinical";
type QueuePatient = {
  id: number;
  name: string;
  age: number;
  complaint: string;
  risk: "Emergência" | "Muito urgente" | "Urgente" | "Pouco urgente";
  support: string;
  waiting: number;
  status: "Aguardando" | "Chamado" | "Em atendimento";
};

const paths: Record<IconName, React.ReactNode> = {
  accessibility: <><circle cx="12" cy="4.5" r="2"/><path d="M5 8.5h14M12 7v13M8 11l-2 8M16 11l2 8"/></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
  audio: <><path d="M5 10v4h3l4 3V7L8 10H5Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></>,
  braille: <><circle cx="8" cy="6" r="1.4"/><circle cx="8" cy="12" r="1.4"/><circle cx="8" cy="18" r="1.4"/><circle cx="16" cy="6" r="1.4"/><circle cx="16" cy="12" r="1.4"/><circle cx="16" cy="18" r="1.4"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  chevron: <path d="m9 6 6 6-6 6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  contrast: <><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path fill="currentColor" stroke="none" d="M12 3a9 9 0 0 1 0 18Z"/></>,
  cross: <path d="M12 4v16M4 12h16"/>,
  gps: <><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>,
  heart: <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  route: <><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><path d="m9 12 2 2 4-5"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><circle cx="17" cy="9" r="2"/><path d="M16 14a5 5 0 0 1 5 5v1"/></>,
  wifi: <><path d="M4 9a12 12 0 0 1 16 0M7 13a8 8 0 0 1 10 0M10 17a3 3 0 0 1 4 0"/><circle cx="12" cy="20" r=".6" fill="currentColor"/></>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const units = [
  { id: 1, name: "UPA Brotas", area: "Brotas", wait: 18, distance: "1,8 km", tone: "low", x: 53, y: 35 },
  { id: 2, name: "UPA Barris", area: "Centro", wait: 32, distance: "3,2 km", tone: "medium", x: 28, y: 62 },
  { id: 3, name: "UPA San Martin", area: "Fazenda Grande", wait: 51, distance: "5,7 km", tone: "high", x: 75, y: 68 },
];

const routeSteps = [
  "Siga em frente pela Avenida Dom João VI por 600 metros.",
  "Na rotatória, pegue a segunda saída.",
  "Vire à direita na Rua do Canal. O destino estará à esquerda.",
];

const brailleMap: Record<string, number[]> = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5], f: [1, 2, 4],
  g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5], l: [1, 2, 3],
  o: [1, 3, 5], p: [1, 2, 3, 4], r: [1, 2, 3, 5], s: [2, 3, 4],
  t: [2, 3, 4, 5], u: [1, 3, 6], v: [1, 2, 3, 6], x: [1, 3, 4, 6],
};

function BrailleCells({ text }: { text: string }) {
  return (
    <div className="braille-cells" aria-label={`Representação em Braille: ${text}`}>
      {text.toLowerCase().slice(0, 13).split("").map((char, index) => {
        const active = brailleMap[char] ?? [];
        return (
          <div className="braille-cell" key={`${char}-${index}`}>
            {[1, 4, 2, 5, 3, 6].map((dot) => <i className={active.includes(dot) ? "raised" : ""} key={dot} />)}
          </div>
        );
      })}
    </div>
  );
}

const initialQueue: QueuePatient[] = [
  { id: 104, name: "Marina Oliveira", age: 68, complaint: "Falta de ar e dor no peito", risk: "Muito urgente", support: "Mobilidade reduzida", waiting: 8, status: "Aguardando" },
  { id: 105, name: "Lucas Santos", age: 31, complaint: "Febre alta há dois dias", risk: "Urgente", support: "Intérprete de Libras", waiting: 21, status: "Aguardando" },
  { id: 106, name: "Rosa Lima", age: 52, complaint: "Dor no tornozelo", risk: "Pouco urgente", support: "Nenhum", waiting: 34, status: "Aguardando" },
];

function StaffWorkspace({
  role,
  queue,
  setQueue,
  speak,
}: {
  role: Exclude<Role, "patient">;
  queue: QueuePatient[];
  setQueue: React.Dispatch<React.SetStateAction<QueuePatient[]>>;
  speak: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [support, setSupport] = useState("Nenhum");
  const [selected, setSelected] = useState<number | null>(queue[0]?.id ?? null);
  const activePatient = queue.find((patient) => patient.id === selected);

  function addPatient(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !complaint.trim()) return;
    const patient: QueuePatient = {
      id: Math.max(100, ...queue.map((item) => item.id)) + 1,
      name: name.trim(),
      age: 38,
      complaint: complaint.trim(),
      risk: "Urgente",
      support,
      waiting: 0,
      status: "Aguardando",
    };
    setQueue((current) => [...current, patient]);
    setName("");
    setComplaint("");
    speak(`${patient.name} foi adicionado à fila com classificação urgente.`);
  }

  function setStatus(id: number, status: QueuePatient["status"]) {
    setQueue((current) => current.map((patient) => patient.id === id ? { ...patient, status } : patient));
    const patient = queue.find((item) => item.id === id);
    if (patient) speak(status === "Chamado" ? `${patient.name}, dirija-se à recepção.` : `Atendimento de ${patient.name} iniciado.`);
  }

  return (
    <section className="staff-page">
      <div className="staff-hero">
        <div>
          <span className="kicker">{role === "reception" ? "Operação da unidade" : "Área assistencial"}</span>
          <h1>{role === "reception" ? "Recepção · UPA Brotas" : "Equipe clínica · UPA Brotas"}</h1>
          <p>{role === "reception" ? "Cadastre pacientes, organize prioridades e acompanhe cada chamada." : "Visualize a classificação, consulte o histórico e conduza o atendimento."}</p>
        </div>
        <div className="shift-card"><span><i /> Plantão ativo</span><strong>13h — 19h</strong><small>4 médicos · 6 enfermeiros</small></div>
      </div>

      <div className="staff-stats">
        <article><Icon name="users" /><span>Na fila</span><strong>{queue.filter((item) => item.status === "Aguardando").length}</strong><small>pacientes aguardando</small></article>
        <article><Icon name="clock" /><span>Espera média</span><strong>18<small> min</small></strong><small>−6 min na última hora</small></article>
        <article><Icon name="cross" /><span>Em atendimento</span><strong>{queue.filter((item) => item.status === "Em atendimento").length + 3}</strong><small>salas ocupadas</small></article>
      </div>

      {role === "reception" ? (
        <div className="staff-grid">
          <form className="patient-form" onSubmit={addPatient}>
            <span className="panel-number">01</span>
            <h2>Novo paciente</h2>
            <p>Registro rápido para entrada na fila.</p>
            <label>Nome completo<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite o nome" required /></label>
            <label>Queixa principal<textarea value={complaint} onChange={(event) => setComplaint(event.target.value)} placeholder="Descreva os sintomas" required /></label>
            <label>Apoio de acessibilidade
              <select value={support} onChange={(event) => setSupport(event.target.value)}>
                <option>Nenhum</option><option>Intérprete de Libras</option><option>Mobilidade reduzida</option><option>Deficiência visual</option><option>Não consegue falar</option>
              </select>
            </label>
            <button className="button primary full" type="submit"><Icon name="users" /> Adicionar à fila</button>
          </form>
          <div className="queue-panel">
            <div className="panel-title"><div><span className="panel-number">02</span><h2>Fila em tempo real</h2></div><span className="updated"><i /> Sincronizada</span></div>
            <div className="queue-list">
              {queue.map((patient) => (
                <article className={`queue-item risk-${patient.risk.toLowerCase().replaceAll(" ", "-")}`} key={patient.id}>
                  <span className="queue-order">#{patient.id}</span>
                  <div><strong>{patient.name}</strong><p>{patient.complaint}</p><small>{patient.support !== "Nenhum" && `Apoio: ${patient.support}`}</small></div>
                  <span className="risk-chip">{patient.risk}</span>
                  <div className="queue-time"><strong>{patient.waiting}</strong><small>min</small></div>
                  <button onClick={() => setStatus(patient.id, "Chamado")} disabled={patient.status === "Chamado"}>{patient.status === "Chamado" ? "Chamado" : "Chamar"}</button>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="clinical-grid">
          <div className="clinical-queue">
            <div className="panel-title"><div><span className="panel-number">01</span><h2>Próximos atendimentos</h2></div></div>
            {queue.map((patient) => (
              <button className={selected === patient.id ? "clinical-patient active" : "clinical-patient"} onClick={() => setSelected(patient.id)} key={patient.id}>
                <span className={`priority priority-${patient.risk.toLowerCase().replaceAll(" ", "-")}`} />
                <div><strong>{patient.name}</strong><small>{patient.complaint}</small></div>
                <span>{patient.waiting} min</span><Icon name="chevron" />
              </button>
            ))}
          </div>
          <div className="patient-record">
            {activePatient && <>
              <div className="record-head"><div><span>Prontuário #{activePatient.id}</span><h2>{activePatient.name}</h2><p>{activePatient.age} anos · CNS 702 •••• •••• 1842</p></div><span className="risk-chip">{activePatient.risk}</span></div>
              <div className="record-alert"><Icon name="accessibility" /><div><strong>Necessidade de apoio</strong><p>{activePatient.support}</p></div></div>
              <div className="record-section"><span>Queixa principal</span><p>{activePatient.complaint}</p></div>
              <div className="record-section"><span>Histórico e laudos</span><article><b>Hipertensão arterial</b><small>Registrado em 12/03/2024</small></article><article><b>Sem alergias medicamentosas conhecidas</b><small>Confirmado pela paciente</small></article></div>
              <div className="record-actions">
                <button className="button ghost" onClick={() => speak(`Resumo do prontuário. ${activePatient.name}, ${activePatient.age} anos. Queixa principal: ${activePatient.complaint}.`)}><Icon name="audio" /> Ouvir resumo</button>
                <button className="button primary" onClick={() => setStatus(activePatient.id, "Em atendimento")}><Icon name="cross" /> Iniciar atendimento</button>
              </div>
            </>}
          </div>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("patient");
  const [queue, setQueue] = useState<QueuePatient[]>(initialQueue);
  const [selectedUnit, setSelectedUnit] = useState(units[0]);
  const [locating, setLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "ok" | "error">("idle");
  const [voiceActive, setVoiceActive] = useState(false);
  const [step, setStep] = useState(0);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [vision, setVision] = useState("normal");
  const [fontScale, setFontScale] = useState(100);
  const [brailleStatus, setBrailleStatus] = useState<"idle" | "connecting" | "connected" | "unavailable">("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [focusVoice, setFocusVoice] = useState(false);
  const [communicationOpen, setCommunicationOpen] = useState(false);
  const [travelMode, setTravelMode] = useState<"car" | "walk">("car");
  const [mapZoom, setMapZoom] = useState(1);

  useEffect(() => {
    document.documentElement.dataset.vision = vision;
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    document.documentElement.dataset.contrast = highContrast ? "high" : "normal";
    document.documentElement.dataset.simple = simpleMode ? "true" : "false";
    document.documentElement.style.setProperty("--font-scale", `${fontScale / 100}`);
  }, [vision, fontScale, darkMode, highContrast, simpleMode]);

  useEffect(() => {
    if (!focusVoice) return;
    const readFocused = (event: FocusEvent) => {
      const element = event.target as HTMLElement;
      const readable = element.closest("button, a, input, select, textarea, [role='button']") as HTMLElement | null;
      if (readable) speak(readable.getAttribute("aria-label") || readable.innerText || readable.getAttribute("placeholder") || "Controle");
    };
    document.addEventListener("focusin", readFocused);
    return () => document.removeEventListener("focusin", readFocused);
  }, [focusVoice]);

  const eta = useMemo(() => selectedUnit.id === 1 ? "7 min" : selectedUnit.id === 2 ? "12 min" : "19 min", [selectedUnit]);

  function speak(message: string) {
    if (!("speechSynthesis" in window)) {
      setSupportMessage("A síntese de voz não é compatível com este navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "pt-BR";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  function locateUser() {
    setLocating(true);
    setSupportMessage("");
    if (!navigator.geolocation) {
      setGpsStatus("error");
      setLocating(false);
      setSupportMessage("GPS indisponível. Usando localização aproximada no centro de Salvador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setGpsStatus("ok");
        setLocating(false);
        setSupportMessage("Localização atualizada com precisão.");
        speak("Localização encontrada. A UPA Brotas está a um quilômetro e oitocentos metros.");
      },
      () => {
        setGpsStatus("error");
        setLocating(false);
        setSupportMessage("Não foi possível acessar o GPS. Ative a localização ou continue com a rota demonstrativa.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  }

  function startGuidance() {
    setVoiceActive(true);
    setStep(0);
    speak(`Rota iniciada para ${selectedUnit.name}. ${routeSteps[0]}`);
  }

  function nextStep() {
    const next = (step + 1) % routeSteps.length;
    setStep(next);
    speak(routeSteps[next]);
  }

  async function connectBraille() {
    setBrailleStatus("connecting");
    const nav = navigator as Navigator & {
      bluetooth?: { requestDevice: (options: { acceptAllDevices: boolean; optionalServices: string[] }) => Promise<unknown> };
    };
    if (!nav.bluetooth) {
      setBrailleStatus("unavailable");
      speak("Bluetooth não está disponível neste navegador. No celular, conecte sua linha Braille nas configurações de acessibilidade do sistema.");
      return;
    }
    try {
      await nav.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: ["battery_service"] });
      setBrailleStatus("connected");
      speak("Dispositivo Braille selecionado. O conteúdo também permanece disponível para o TalkBack e VoiceOver.");
    } catch {
      setBrailleStatus("idle");
    }
  }

  function selectUnit(unit: typeof units[number]) {
    setSelectedUnit(unit);
    setVoiceActive(false);
    document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Acolhe SUS, início">
          <span className="brand-mark"><Icon name="heart" size={24} /><i><Icon name="cross" size={14} /></i></span>
          <span>Acolhe<strong>SUS</strong><small>Cuidado acessível</small></span>
        </a>
        <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Navegação principal">
          <div className="mobile-profiles" aria-label="Selecionar perfil">
            <button className={role === "patient" ? "active" : ""} onClick={() => { setRole("patient"); setMenuOpen(false); }}>Paciente</button>
            <button className={role === "reception" ? "active" : ""} onClick={() => { setRole("reception"); setMenuOpen(false); }}>Recepção</button>
            <button className={role === "clinical" ? "active" : ""} onClick={() => { setRole("clinical"); setMenuOpen(false); }}>Clínico</button>
          </div>
          {role === "patient" ? <>
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
            <a href="#mapa" onClick={() => setMenuOpen(false)}>Mapa de cuidado</a>
            <a href="#acessibilidade" onClick={() => setMenuOpen(false)}>Acessibilidade</a>
          </> : <>
            <a href="#operacao" onClick={() => setMenuOpen(false)}>Visão geral</a>
            <a href="#operacao" onClick={() => setMenuOpen(false)}>Fila</a>
            <a href="#operacao" onClick={() => setMenuOpen(false)}>Equipe</a>
          </>}
        </nav>
        <div className="header-actions">
          <div className="profile-switch" aria-label="Selecionar perfil">
            <button className={role === "patient" ? "active" : ""} onClick={() => setRole("patient")}>Paciente</button>
            <button className={role === "reception" ? "active" : ""} onClick={() => setRole("reception")}>Recepção</button>
            <button className={role === "clinical" ? "active" : ""} onClick={() => setRole("clinical")}>Clínico</button>
          </div>
          <span className="live-pill"><i /> Dados demonstrativos</span>
          <button className="icon-button" onClick={() => setA11yOpen(true)} aria-label="Abrir recursos de acessibilidade"><Icon name="accessibility" /></button>
          <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu"><Icon name="menu" /></button>
        </div>
      </header>

      <main id="conteudo">
        {role === "patient" ? <>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <div className="eyebrow"><span>Acolhimento em tempo real</span><span>Salvador, BA</span></div>
            <h1>O cuidado começa <em>antes</em> de chegar.</h1>
            <p>Encontre a unidade certa, compare o tempo de espera e receba orientação acessível durante todo o caminho.</p>
            <div className="hero-actions">
              <a className="button primary" href="#mapa"><Icon name="route" /> Encontrar atendimento <Icon name="arrow" /></a>
              <button className="button ghost" onClick={() => speak("Bem-vindo ao Acolhe SUS. A UPA mais próxima é UPA Brotas, a um quilômetro e oitocentos metros, com espera estimada de dezoito minutos.")}><Icon name="audio" /> Ouvir esta página</button>
            </div>
            <div className="trust-row">
              <span><Icon name="shield" /> Privacidade desde a origem</span>
              <span><Icon name="wifi" /> Funciona com conexão instável</span>
            </div>
          </div>

          <aside className="care-card" aria-label="Unidade recomendada">
            <div className="care-card-top">
              <span className="recommended"><Icon name="check" size={15} /> Melhor opção agora</span>
              <span className="distance">{selectedUnit.distance}</span>
            </div>
            <div className="care-title">
              <span className="hospital-symbol"><Icon name="cross" size={24} /></span>
              <div><h2>{selectedUnit.name}</h2><p><Icon name="pin" size={15} /> {selectedUnit.area}, Salvador</p></div>
            </div>
            <div className="wait-grid">
              <div><span>Espera estimada</span><strong>{selectedUnit.wait}<small> min</small></strong></div>
              <div><span>Chegada de carro</span><strong>{eta}</strong></div>
            </div>
            <div className="capacity">
              <div><span>Fluxo na unidade</span><b className={`status-${selectedUnit.tone}`}>{selectedUnit.tone === "low" ? "Tranquilo" : selectedUnit.tone === "medium" ? "Moderado" : "Intenso"}</b></div>
              <div className="capacity-track"><i style={{ width: `${Math.min(selectedUnit.wait + 23, 88)}%` }} /></div>
            </div>
            <a href="#mapa" className="card-route">Ver rota no mapa <Icon name="arrow" /></a>
          </aside>
        </section>

        <section className="map-section section-wrap" id="mapa">
          <div className="section-heading">
            <div><span className="kicker">Navegação integrada</span><h2>Seu caminho até o cuidado</h2><p>Sem depender de aplicativo externo. Localização, rota e voz funcionam dentro do AcolheSUS.</p></div>
            <button className={`location-button ${gpsStatus}`} onClick={locateUser} disabled={locating}><Icon name="gps" /> {locating ? "Buscando sinal..." : gpsStatus === "ok" ? "Localização precisa" : "Usar minha localização"}</button>
          </div>
          {supportMessage && <div className={`system-message ${gpsStatus === "error" ? "warning" : ""}`} role="status"><Icon name={gpsStatus === "error" ? "gps" : "check"} /> {supportMessage}</div>}

          <div className="map-layout">
            <div className="map-canvas" aria-label="Mapa esquemático de Salvador com três unidades de pronto atendimento">
              <div className="map-toolbar">
                <span><Icon name="map" size={17} /> Mapa Acolhe</span>
                <div><button aria-label="Aumentar mapa" onClick={() => setMapZoom((value) => Math.min(1.2, value + .1))}>+</button><button aria-label="Diminuir mapa" onClick={() => setMapZoom((value) => Math.max(.9, value - .1))}>−</button></div>
              </div>
              <div className="map-layer" style={{ transform: `scale(${mapZoom})` }}>
                <div className="water-shape" />
                <span className="neighborhood n1">Brotas</span><span className="neighborhood n2">Barris</span><span className="neighborhood n3">Cabula</span><span className="neighborhood n4">Federação</span>
                <i className="road r1" /><i className="road r2" /><i className="road r3" /><i className="road r4" /><i className="route-line" />
                <div className={`user-marker ${gpsStatus === "ok" ? "located" : ""}`}><span /><small>{gpsStatus === "ok" ? "Você está aqui" : "Ponto de partida"}</small></div>
                {units.map((unit) => (
                  <button
                    key={unit.id}
                    className={`map-pin ${unit.id === selectedUnit.id ? "active" : ""}`}
                    style={{ left: `${unit.x}%`, top: `${unit.y}%` }}
                    onClick={() => setSelectedUnit(unit)}
                    aria-label={`${unit.name}, espera de ${unit.wait} minutos`}
                  >
                    <span><Icon name="cross" size={17} /></span>
                    {unit.id === selectedUnit.id && <b>{unit.wait} min</b>}
                  </button>
                ))}
              </div>
              <div className="map-legend"><i /> Rota mais rápida <span>Atualizado agora</span></div>
            </div>

            <aside className="route-panel">
              <div className="route-panel-head"><span>Rota selecionada</span><b>{eta}</b></div>
              <h3>{selectedUnit.name}</h3>
              <p className="address">R. do Canal, {selectedUnit.area} · {selectedUnit.distance}</p>
              <div className="route-modes"><button className={travelMode === "car" ? "active" : ""} onClick={() => setTravelMode("car")}>Carro <b>{eta}</b></button><button className={travelMode === "walk" ? "active" : ""} onClick={() => setTravelMode("walk")}>A pé <b>{selectedUnit.id === 1 ? "24 min" : "38 min"}</b></button></div>
              <div className="route-step">
                <span className="turn-icon">↱</span>
                <div><small>{voiceActive ? `Passo ${step + 1} de ${routeSteps.length}` : "Primeira orientação"}</small><strong>{voiceActive ? routeSteps[step] : routeSteps[0]}</strong></div>
              </div>
              {!voiceActive ? (
                <button className="button primary full" onClick={startGuidance}><Icon name="audio" /> Iniciar guia por voz</button>
              ) : (
                <div className="guidance-actions">
                  <button className="button primary" onClick={() => speak(routeSteps[step])}><Icon name="audio" /> Repetir</button>
                  <button className="button dark" onClick={nextStep}>Próximo <Icon name="chevron" /></button>
                </div>
              )}
              <p className="voice-note"><Icon name="mic" size={15} /> Orientações em português, compatíveis com leitor de tela.</p>
            </aside>
          </div>
        </section>

        <section className="units-section section-wrap">
          <div className="section-heading compact"><div><span className="kicker">Rede próxima</span><h2>Compare antes de sair</h2></div><span className="updated"><i /> Atualizado há 1 min</span></div>
          <div className="unit-list">
            {units.map((unit, index) => (
              <article className={selectedUnit.id === unit.id ? "unit-row selected" : "unit-row"} key={unit.id}>
                <span className="unit-number">0{index + 1}</span>
                <div className="unit-main"><h3>{unit.name}</h3><p>{unit.area} · {unit.distance}</p></div>
                <div className="unit-wait"><span>Espera</span><strong>{unit.wait}<small> min</small></strong></div>
                <span className={`flow flow-${unit.tone}`}><i /> {unit.tone === "low" ? "Tranquilo" : unit.tone === "medium" ? "Moderado" : "Intenso"}</span>
                <button onClick={() => selectUnit(unit)} aria-label={`Traçar rota para ${unit.name}`}>Traçar rota <Icon name="arrow" /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="access-section" id="acessibilidade">
          <div className="section-wrap">
            <div className="access-intro">
              <span className="kicker light">Acesso é parte do cuidado</span>
              <h2>Uma experiência que se adapta a você.</h2>
              <p>Recursos reais para navegar, compreender e se comunicar com autonomia.</p>
            </div>
            <div className="access-grid">
              <article className="access-card featured">
                <div className="access-icon"><Icon name="braille" size={28} /></div>
                <span className="card-label">Canal tátil</span>
                <h3>Linha Braille</h3>
                <p>Conteúdo preparado para VoiceOver e TalkBack, com conexão ao dispositivo tátil pelo sistema.</p>
                <BrailleCells text="acolhe sus" />
                <button onClick={connectBraille} disabled={brailleStatus === "connecting"}>
                  {brailleStatus === "connecting" ? "Buscando dispositivo..." : brailleStatus === "connected" ? "Dispositivo selecionado" : "Conectar linha Braille"} <Icon name={brailleStatus === "connected" ? "check" : "arrow"} />
                </button>
                {brailleStatus === "unavailable" && <small className="braille-help">Conecte pelo menu Bluetooth/Acessibilidade do Android ou iPhone. O leitor de tela enviará o conteúdo à linha Braille.</small>}
              </article>
              <article className="access-card">
                <div className="access-icon"><Icon name="audio" size={28} /></div>
                <span className="card-label">Navegação falada</span>
                <h3>Guia por voz</h3>
                <p>Leia páginas e escute cada mudança de direção sem sair do app.</p>
                <button onClick={() => speak("Guia de voz ativado. Todos os comandos de rota serão falados em voz alta.")}>Testar agora <Icon name="arrow" /></button>
              </article>
              <article className="access-card">
                <div className="access-icon"><Icon name="contrast" size={28} /></div>
                <span className="card-label">Percepção de cor</span>
                <h3>Cores para todos</h3>
                <p>Perfis que transformam toda a interface, com padrões e texto para não depender só da cor.</p>
                <button onClick={() => setA11yOpen(true)}>Ajustar cores <Icon name="arrow" /></button>
              </article>
            </div>
          </div>
        </section>

        <section className="emergency section-wrap">
          <div><span className="emergency-icon"><Icon name="cross" /></span><div><strong>É uma emergência?</strong><p>Dificuldade para respirar, dor intensa no peito, desmaio ou sangramento grave.</p></div></div>
          <a href="tel:192"><span>Ligar gratuitamente</span><strong>192 · SAMU</strong><Icon name="arrow" /></a>
        </section>
        </> : <div id="operacao"><StaffWorkspace role={role} queue={queue} setQueue={setQueue} speak={speak} /></div>}
      </main>

      <footer>
        <div className="footer-brand"><span className="brand-mark"><Icon name="heart" size={21} /></span><strong>AcolheSUS</strong></div>
        <p>Protótipo demonstrativo para apresentação. Tempos e unidades são dados simulados.</p>
        <span>Construído com cuidado em Salvador.</span>
      </footer>

      <button className="floating-a11y" onClick={() => setA11yOpen(true)} aria-label="Personalizar acessibilidade"><Icon name="accessibility" /><span>Acessibilidade</span></button>

      {a11yOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setA11yOpen(false)}>
          <aside className="a11y-panel" role="dialog" aria-modal="true" aria-labelledby="a11y-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="a11y-head"><div><span>Preferências visuais</span><h2 id="a11y-title">Acessibilidade</h2></div><button onClick={() => setA11yOpen(false)} aria-label="Fechar">×</button></div>
            <div className="setting-group">
              <label>Perfil de percepção de cores</label>
              <p>O perfil altera todas as cores funcionais da interface.</p>
              <div className="vision-options">
                {[
                  ["normal", "Padrão"], ["protanopia", "Protanopia"], ["deuteranopia", "Deuteranopia"], ["tritanopia", "Tritanopia"], ["mono", "Monocromático"],
                ].map(([value, label]) => (
                  <button key={value} className={vision === value ? "active" : ""} onClick={() => setVision(value)}><i className={`swatch ${value}`} /><span>{label}</span>{vision === value && <Icon name="check" size={17} />}</button>
                ))}
              </div>
            </div>
            <div className="setting-group">
              <label htmlFor="font-size">Tamanho do texto <b>{fontScale}%</b></label>
              <input id="font-size" type="range" min="90" max="125" step="5" value={fontScale} onChange={(event) => setFontScale(Number(event.target.value))} />
              <div className="range-labels"><span>A</span><strong>A</strong></div>
            </div>
            <div className="setting-group">
              <label>Leitura e contraste</label>
              <p>Os ajustes ficam ativos em todos os três perfis.</p>
              <div className="access-toggles">
                <button className={darkMode ? "active" : ""} onClick={() => setDarkMode(!darkMode)}><Icon name="sun" /><span>Modo escuro</span><b>{darkMode ? "Ativo" : "Inativo"}</b></button>
                <button className={highContrast ? "active" : ""} onClick={() => setHighContrast(!highContrast)}><Icon name="contrast" /><span>Alto contraste</span><b>{highContrast ? "Ativo" : "Inativo"}</b></button>
                <button className={simpleMode ? "active" : ""} onClick={() => setSimpleMode(!simpleMode)}><Icon name="menu" /><span>Modo simplificado</span><b>{simpleMode ? "Ativo" : "Inativo"}</b></button>
              </div>
            </div>
            <div className="setting-group">
              <label>Voz e comunicação</label>
              <p>Ouça a tela, receba descrição dos controles ou use frases rápidas.</p>
              <div className="panel-actions">
                <button onClick={() => speak(document.querySelector("main")?.textContent?.replace(/\s+/g, " ").slice(0, 1200) || "Conteúdo indisponível")}><Icon name="audio" /> Ler esta tela</button>
                <button onClick={() => window.speechSynthesis?.cancel()}><Icon name="mic" /> Parar voz</button>
                <button className={focusVoice ? "active" : ""} onClick={() => setFocusVoice(!focusVoice)}><Icon name="accessibility" /> Leitor ao focar</button>
                <button onClick={() => setCommunicationOpen(true)}><Icon name="users" /> Cartões de comunicação</button>
              </div>
            </div>
            <button className="button dark full" onClick={() => setA11yOpen(false)}>Salvar preferências</button>
          </aside>
        </div>
      )}
      {communicationOpen && (
        <div className="modal-backdrop centered" role="presentation" onMouseDown={() => setCommunicationOpen(false)}>
          <section className="communication-modal" role="dialog" aria-modal="true" aria-labelledby="communication-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="a11y-head"><div><span>Comunicação assistiva</span><h2 id="communication-title">Mostre esta mensagem</h2></div><button onClick={() => setCommunicationOpen(false)} aria-label="Fechar">×</button></div>
            <div className="communication-grid">
              {["Preciso de atendimento", "Estou sentindo dor", "Não consigo falar. Por favor, escreva", "Sou surdo(a). Preciso de Libras", "Não enxergo. Preciso de um guia", "Preciso de ajuda para me locomover"].map((message) => (
                <button key={message} onClick={() => speak(message)}><Icon name="audio" /><span>{message}</span></button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
