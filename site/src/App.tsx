import { useState, useEffect } from 'react';

/* ─── Types ─────────────────────────────────────── */
type PageId =
  | 'home' | 'led' | 'buton' | 'pot' | 'buzzer' | 'rgb' | 'ldr'
  | 'servo' | 'dht' | 'hcsr04' | 'i2clcd' | 'rele' | 'irfz44n'
  | 'l298n' | 'nrf24l01' | 'nodemcu';

/* ─── helpers ────────────────────────────────────── */
function usePage() {
  const [page, setPage] = useState<PageId>('home');
  const show = (p: PageId) => { setPage(p); window.scrollTo(0, 0); };
  return { page, show };
}

/* ─── Shared styles (injected once) ─────────────── */
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@300;400;600;700;800&display=swap');
:root{--neon:#00ffe7;--neon2:#7b2fff;--bg:#0a0e1a;--card:#111827;--border:#1f2d44}
*{box-sizing:border-box}
body{background:var(--bg);font-family:'Inter',sans-serif;color:#e2e8f0;margin:0}
.mono{font-family:'Share Tech Mono',monospace}
.hero-bg{background:linear-gradient(135deg,#0a0e1a 0%,#0d1b2a 50%,#0a0e1a 100%);position:relative;overflow:hidden}
.hero-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(0,255,231,.07) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(123,47,255,.10) 0%,transparent 60%);animation:pulse-bg 6s ease-in-out infinite alternate}
@keyframes pulse-bg{from{opacity:.6}to{opacity:1}}
.neon-text{color:var(--neon);text-shadow:0 0 8px rgba(0,255,231,.6),0 0 20px rgba(0,255,231,.3)}
.badge{background:rgba(0,255,231,.1);border:1px solid rgba(0,255,231,.25);color:var(--neon);border-radius:999px;font-size:.72rem;padding:2px 10px;font-weight:600}
.code-block{background:#070b14;border:1px solid #1e3a5f;border-radius:12px;position:relative;overflow:hidden}
.code-block::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--neon),var(--neon2))}
pre{margin:0;padding:1.5rem;overflow-x:auto;font-size:.82rem;line-height:1.7}
.kw{color:#c792ea}.fn{color:#82aaff}.num{color:#f78c6c}.str{color:#c3e88d}
.cmt{color:#546e7a;font-style:italic}.var{color:#eeffff}.def{color:#ffcb6b}.pin{color:#00ffe7}
.comp-card{background:#111827;border:1px solid var(--border);border-radius:12px;transition:all .25s}
.comp-card:hover{border-color:rgba(0,255,231,.4);box-shadow:0 0 16px rgba(0,255,231,.08);transform:translateY(-2px)}
.copy-btn{position:absolute;top:12px;right:12px;background:rgba(0,255,231,.1);border:1px solid rgba(0,255,231,.3);color:var(--neon);border-radius:6px;padding:4px 12px;font-size:.75rem;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif}
.copy-btn:hover{background:rgba(0,255,231,.2)}
.copy-btn.copied{background:rgba(0,255,231,.3);color:#fff}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:#0a0e1a}
::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:3px}
table{border-collapse:collapse;width:100%}
th{background:rgba(0,255,231,.08);color:var(--neon);font-size:.78rem;text-transform:uppercase;letter-spacing:.08em}
td,th{padding:10px 14px;border:1px solid var(--border);font-size:.88rem}
tr:nth-child(even) td{background:rgba(255,255,255,.02)}
.tip-box{background:rgba(123,47,255,.08);border-left:3px solid var(--neon2);border-radius:0 8px 8px 0;padding:12px 16px}
.warn-box{background:rgba(255,165,0,.07);border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:12px 16px}
.info-box{background:rgba(130,170,255,.07);border-left:3px solid #82aaff;border-radius:0 8px 8px 0;padding:12px 16px}
.danger-box{background:rgba(239,68,68,.07);border-left:3px solid #ef4444;border-radius:0 8px 8px 0;padding:12px 16px}
.section-title{font-size:1.1rem;font-weight:700;color:var(--neon);letter-spacing:.05em;margin-bottom:1rem;display:flex;align-items:center;gap:8px}
.circuit-card{background:#111827;border:1px solid var(--border);border-radius:16px;padding:1.5rem;cursor:pointer;transition:all .3s;position:relative;overflow:hidden}
.circuit-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,255,231,.04),transparent);opacity:0;transition:.3s}
.circuit-card:hover::before{opacity:1}
.circuit-card:hover{border-color:rgba(0,255,231,.5);box-shadow:0 0 24px rgba(0,255,231,.1);transform:translateY(-4px)}
.circuit-card .icon{font-size:2.5rem;margin-bottom:.75rem}
.circuit-card .diff{font-size:.68rem;padding:2px 8px;border-radius:999px;font-weight:700}
.diff-easy{background:rgba(34,197,94,.15);color:#22c55e;border:1px solid rgba(34,197,94,.3)}
.diff-medium{background:rgba(251,191,36,.12);color:#fbbf24;border:1px solid rgba(251,191,36,.3)}
.diff-hard{background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.3)}
.back-btn{display:inline-flex;align-items:center;gap:6px;color:#64748b;font-size:.85rem;cursor:pointer;transition:color .2s;border:none;background:none;padding:0}
.back-btn:hover{color:var(--neon)}
#simSlider{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;background:linear-gradient(90deg,var(--neon) var(--pct,0%),#1e3a5f var(--pct,0%));outline:none;cursor:pointer}
#simSlider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--neon);box-shadow:0 0 8px rgba(0,255,231,.6);cursor:pointer}
`;

/* ─── Sub-components ─────────────────────────────── */
function BackBtn({ show }: { show: () => void }) {
  return (
    <button className="back-btn" onClick={show}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
      Ana Sayfa
    </button>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <div className="h-px flex-1" style={{ background: '#1f2d44' }} />
      <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">{label}</span>
      <div className="h-px flex-1" style={{ background: '#1f2d44' }} />
    </div>
  );
}

function CopyBtn({ targetId }: { targetId: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
      {copied ? '✓ Kopyalandı!' : 'Kopyala'}
    </button>
  );
}

function InfoCards({ items }: { items: { icon: string; title: string; desc: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {items.map((it, i) => (
        <div key={i} className="comp-card p-4">
          <div className="text-xl mb-1">{it.icon}</div>
          <div className="font-bold text-white text-sm">{it.title}</div>
          <div className="text-slate-400 text-xs mt-1">{it.desc}</div>
        </div>
      ))}
    </div>
  );
}

function PageHeader({ show, emoji, label, title, sub, diff }: {
  show: () => void; emoji: string; label: string; title: string; sub: string;
  diff: 'easy' | 'medium' | 'hard';
}) {
  const diffMap = { easy: ['diff-easy', 'Kolay'], medium: ['diff-medium', 'Orta'], hard: ['diff-hard', 'Zor'] };
  const [cls, txt] = diffMap[diff];
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <BackBtn show={show} />
        <span className="text-slate-600">/</span>
        <span className="neon-text text-sm font-semibold">{emoji} {label}</span>
        <span className={`diff ${cls} ml-auto`}>{txt}</span>
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-2">{title}</h1>
      <p className="text-slate-400 mb-8">{sub}</p>
    </>
  );
}

/* ─── Circuit Card ───────────────────────────────── */
function CircuitCard({ icon, title, desc, tags, diff, onClick, featured }: {
  icon: string; title: string; desc: string; tags: string[];
  diff: 'easy' | 'medium' | 'hard'; onClick: () => void; featured?: boolean;
}) {
  const diffMap = { easy: ['diff-easy', 'Kolay'], medium: ['diff-medium', 'Orta'], hard: ['diff-hard', 'Zor'] };
  const [cls, txt] = diffMap[diff];
  return (
    <div
      className="circuit-card"
      onClick={onClick}
      style={featured ? { borderColor: 'rgba(0,255,231,.3)' } : {}}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="icon">{icon}</div>
        <span className={`diff ${cls}`}>{txt}</span>
      </div>
      <h3 className={`font-bold text-lg mb-1 ${featured ? 'neon-text' : 'text-white'}`}>{title}</h3>
      <p className="text-slate-400 text-sm mb-3">{desc}</p>
      <div className="flex gap-2 flex-wrap">
        {tags.map((t, i) => <span key={i} className="badge" style={{ fontSize: '.65rem' }}>{t}</span>)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: HOME
══════════════════════════════════════════════════ */
function HomePage({ show }: { show: (p: PageId) => void }) {
  return (
    <>
      {/* Hero */}
      <div className="hero-bg py-16 px-4 text-center relative">
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="badge mb-4 inline-block">🔧 Başlangıçtan İleriye</span>
          <h1 className="text-4xl font-extrabold text-white mb-3 leading-tight">
            Arduino <span className="neon-text">Devre Rehberi</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Temel devrelerden ileri seviyeye kadar tüm Arduino projelerini Türkçe açıklamalar, gerçek kodlar ve bağlantı şemalarıyla öğren.
          </p>
          <div className="flex justify-center gap-3 mt-5 flex-wrap">
            <span className="badge" style={{ background: 'rgba(34,197,94,.15)', borderColor: 'rgba(34,197,94,.3)', color: '#22c55e' }}>🟢 Kolay</span>
            <span className="badge" style={{ background: 'rgba(251,191,36,.12)', borderColor: 'rgba(251,191,36,.3)', color: '#fbbf24' }}>🟡 Orta</span>
            <span className="badge" style={{ background: 'rgba(239,68,68,.12)', borderColor: 'rgba(239,68,68,.3)', color: '#ef4444' }}>🔴 Zor</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Temel */}
        <SectionDivider label="Temel Devreler" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <CircuitCard icon="💡" title="LED Yakma" desc="Arduino'nun dijital çıkışıyla LED'i yak ve söndür. Her şeyin başlangıcı!" tags={['D13', '220Ω', 'LED']} diff="easy" onClick={() => show('led')} />
          <CircuitCard icon="🔘" title="Buton ile LED" desc="Butona basınca LED yanan basit dijital giriş/çıkış devresi." tags={['D2', '10kΩ pull-up', 'Buton']} diff="easy" onClick={() => show('buton')} />
          <CircuitCard icon="🎚️" title="Potansiyometre Okuma" desc="Analog girişten potansiyometre oku, Seri Monitör'e yazdır." tags={['A0', '10kΩ Pot', 'analogRead']} diff="easy" onClick={() => show('pot')} />
          <CircuitCard icon="🔔" title="Buzzer ile Ses" desc="Pasif buzzer ile melodi çal, farklı tonlar üret." tags={['D8', 'Buzzer', 'tone()']} diff="easy" onClick={() => show('buzzer')} />
          <CircuitCard icon="🌈" title="RGB LED Renk Kontrolü" desc="Üç PWM kanalıyla RGB LED'i her renge boyayabilirsin." tags={['D9/10/11', 'RGB LED', 'PWM']} diff="easy" onClick={() => show('rgb')} />
          <CircuitCard icon="☀️" title="LDR Işık Sensörü" desc="Ortam ışığını ölç, karanlıkta LED'i otomatik yak." tags={['A0', 'LDR', '10kΩ']} diff="easy" onClick={() => show('ldr')} />
        </div>

        {/* Orta */}
        <SectionDivider label="Orta Seviye" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <CircuitCard icon="⚙️" title="Servo Motor Kontrolü" desc="Potansiyometreyle servo motoru 0°–180° arasında kontrol et." tags={['D9', 'Servo', 'map()']} diff="medium" onClick={() => show('servo')} />
          <CircuitCard icon="🌡️" title="DHT11 Sıcaklık & Nem" desc="DHT11 sensörüyle sıcaklık ve nem oku, Seri Monitör'e yazdır." tags={['D4', 'DHT11', '10kΩ']} diff="medium" onClick={() => show('dht')} />
          <CircuitCard icon="📡" title="HC-SR04 Mesafe Sensörü" desc="Ultrasonik sensörle cm cinsinden mesafe ölç." tags={['D9/D10', 'HC-SR04', 'pulseIn']} diff="medium" onClick={() => show('hcsr04')} />
          <CircuitCard icon="⚡" title="IRFZ44N LED/Fan Kontrolü" desc="MOSFET ile PWM fan/LED kontrolü + Sıcaklık koruması. Detaylı rehber!" tags={['D9 PWM', 'IRFZ44N', '⭐ Öne Çıkan']} diff="medium" featured onClick={() => show('irfz44n')} />
          <CircuitCard icon="🖥️" title="I2C LCD Ekran" desc="16x2 LCD ekrana metin yazdır, sadece 2 kablo kullan (I2C)." tags={['SDA/SCL', 'LCD 16x2', 'I2C']} diff="medium" onClick={() => show('i2clcd')} />
          <CircuitCard icon="🔌" title="Röle ile Yük Kontrolü" desc="5V röle modülüyle 220V AC yükü güvenli şekilde kontrol et." tags={['D7', '5V Röle', '⚠️ AC']} diff="medium" onClick={() => show('rele')} />
        </div>

        {/* Zor */}
        <SectionDivider label="İleri Seviye (Zor)" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <CircuitCard icon="🚗" title="L298N Motor Sürücü" desc="DC motorları yön ve hız kontrolüyle çalıştır. H-köprü teorisi ve PWM." tags={['D5/D6', 'L298N', 'H-Bridge']} diff="hard" onClick={() => show('l298n')} />
          <CircuitCard icon="📶" title="NRF24L01 Kablosuz" desc="2.4GHz kablosuz modülle iki Arduino arasında veri gönder/al." tags={['SPI', 'NRF24L01', 'RF24 Lib']} diff="hard" onClick={() => show('nrf24l01')} />
          <CircuitCard icon="🌐" title="NodeMCU ESP8266 WiFi" desc="ESP8266 ile WiFi'ye bağlan, web sunucusu kur, IoT projeler yap." tags={['ESP8266', 'HTTP Server', 'IoT']} diff="hard" onClick={() => show('nodemcu')} />
        </div>

        <div className="tip-box text-sm text-slate-300 mt-4">
          💡 <strong style={{ color: '#c792ea' }}>Nasıl kullanılır?</strong> Herhangi bir karta tıkla → Arduino kodunu, bağlantı tablosunu ve açıklamayı gör. Kodu kopyala, devreyi kur, çalıştır!
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: LED
══════════════════════════════════════════════════ */
function LedPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="💡" label="LED Yakma" title="LED Yakma Devresi" sub="Arduino'nun en temel devresi. Dijital çıkış piniyle bir LED'i yak ve söndür." diff="easy" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, LED, 220Ω direnç, breadboard, kablo' },
        { icon: '📌', title: 'Kullanılan Pin', desc: 'D13 (dahili LED de D13\'e bağlı)' },
        { icon: '⏱️', title: 'Süre', desc: '~5 dakika' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>Bileşen</th><th>Nereden</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>LED Anot (+)</td><td style={{ color: '#f78c6c' }}>220Ω direnç üzerinden</td><td style={{ color: '#82aaff' }}>Arduino D13</td></tr>
            <tr><td>LED Katot (–)</td><td style={{ color: '#00ffe7' }}>Direkt</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-led" />
        <pre className="mono" id="c-led" dangerouslySetInnerHTML={{ __html: `<span class="cmt">// LED Yakma — En Temel Arduino Devresi</span>

<span class="kw">const</span> <span class="kw">int</span> <span class="pin">LED_PIN</span> = <span class="num">13</span>;  <span class="cmt">// Dahili LED de bu pine bağlı</span>

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">pinMode</span>(<span class="pin">LED_PIN</span>, <span class="def">OUTPUT</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">HIGH</span>);  <span class="cmt">// LED'i yak</span>
  <span class="fn">delay</span>(<span class="num">1000</span>);                    <span class="cmt">// 1 saniye bekle</span>
  <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">LOW</span>);   <span class="cmt">// LED'i söndür</span>
  <span class="fn">delay</span>(<span class="num">1000</span>);                    <span class="cmt">// 1 saniye bekle</span>
}` }} />
      </div>
      <div className="info-box text-sm text-slate-300">💡 <strong style={{ color: '#82aaff' }}>İpucu:</strong> Arduino Uno'da D13 pinine zaten dahili bir LED bağlı. Dış LED bağlamadan da test edebilirsin!</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: BUTON
══════════════════════════════════════════════════ */
function ButonPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="🔘" label="Buton ile LED" title="Buton ile LED Kontrolü" sub="Dijital giriş kullanımını öğren. Butona basılı tuttuğunda LED yanar, bırakınca söner." diff="easy" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, buton, LED, 220Ω, 10kΩ direnç' },
        { icon: '📌', title: 'Kullanılan Pinler', desc: 'D2 (buton), D13 (LED)' },
        { icon: '⏱️', title: 'Süre', desc: '~10 dakika' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>Bileşen</th><th>Nereden</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>Buton — 1. bacak</td><td style={{ color: '#f78c6c' }}>5V</td><td>—</td></tr>
            <tr><td>Buton — 2. bacak</td><td style={{ color: '#82aaff' }}>Arduino D2</td><td>—</td></tr>
            <tr><td>10kΩ Pull-down</td><td style={{ color: '#82aaff' }}>D2 ile GND arası</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>LED Anot (+)</td><td style={{ color: '#f78c6c' }}>220Ω üzerinden</td><td style={{ color: '#82aaff' }}>D13</td></tr>
            <tr><td>LED Katot (–)</td><td>—</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-buton" />
        <pre className="mono" id="c-buton" dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Buton ile LED Kontrolü</span>

<span class="kw">const</span> <span class="kw">int</span> <span class="pin">BUTON_PIN</span> = <span class="num">2</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">LED_PIN</span>   = <span class="num">13</span>;

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">pinMode</span>(<span class="pin">BUTON_PIN</span>, <span class="def">INPUT</span>);
  <span class="fn">pinMode</span>(<span class="pin">LED_PIN</span>,   <span class="def">OUTPUT</span>);
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="kw">int</span> <span class="var">butonDurumu</span> = <span class="fn">digitalRead</span>(<span class="pin">BUTON_PIN</span>);
  <span class="kw">if</span> (<span class="var">butonDurumu</span> == <span class="def">HIGH</span>) {
    <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">HIGH</span>);
    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"Buton: BASILI — LED AÇIK"</span>);
  } <span class="kw">else</span> {
    <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">LOW</span>);
    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"Buton: BIRAKILI — LED KAPALI"</span>);
  }
  <span class="fn">delay</span>(<span class="num">50</span>);
}` }} />
      </div>
      <div className="tip-box text-sm text-slate-300">💡 <strong style={{ color: '#c792ea' }}>Dahili Pull-up:</strong> <code className="mono">INPUT_PULLUP</code> kullanırsan harici 10kΩ dirence ihtiyaç duymadan butonu sadece GND ve pin arasına bağlayabilirsin!</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: POT
══════════════════════════════════════════════════ */
function PotPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="🎚️" label="Potansiyometre" title="Potansiyometre Okuma" sub="Analog giriş kullanımını öğren. 0–1023 arası değer oku ve LED parlaklığını kontrol et." diff="easy" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, 10kΩ potansiyometre, LED, 220Ω' },
        { icon: '📌', title: 'Kullanılan Pinler', desc: 'A0 (pot), D9 PWM (LED)' },
        { icon: '⏱️', title: 'Süre', desc: '~10 dakika' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>Bileşen</th><th>Nereden</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>Pot Sol Uç</td><td>—</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>Pot Orta Uç (Wiper)</td><td>—</td><td style={{ color: '#82aaff' }}>A0</td></tr>
            <tr><td>Pot Sağ Uç</td><td>—</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
            <tr><td>LED Anot (+)</td><td style={{ color: '#f78c6c' }}>220Ω üzerinden</td><td style={{ color: '#82aaff' }}>D9 (PWM)</td></tr>
            <tr><td>LED Katot (–)</td><td>—</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-pot" />
        <pre className="mono" id="c-pot" dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Potansiyometre ile LED Parlaklığı Kontrolü</span>

<span class="kw">const</span> <span class="kw">int</span> <span class="pin">POT_PIN</span> = <span class="num">A0</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">LED_PIN</span> = <span class="num">9</span>;

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">pinMode</span>(<span class="pin">LED_PIN</span>, <span class="def">OUTPUT</span>);
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="kw">int</span> <span class="var">potDegeri</span> = <span class="fn">analogRead</span>(<span class="pin">POT_PIN</span>);
  <span class="kw">int</span> <span class="var">pwmDegeri</span> = <span class="fn">map</span>(<span class="var">potDegeri</span>, <span class="num">0</span>, <span class="num">1023</span>, <span class="num">0</span>, <span class="num">255</span>);
  <span class="fn">analogWrite</span>(<span class="pin">LED_PIN</span>, <span class="var">pwmDegeri</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Ham: "</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">potDegeri</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"  PWM: "</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">pwmDegeri</span>);
  <span class="fn">delay</span>(<span class="num">100</span>);
}` }} />
      </div>
      <div className="info-box text-sm text-slate-300">💡 <strong style={{ color: '#82aaff' }}>map() fonksiyonu:</strong> <code className="mono">map(değer, eskiMin, eskiMax, yeniMin, yeniMax)</code> — bir aralığı başka bir aralığa dönüştürür.</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: BUZZER
══════════════════════════════════════════════════ */
function BuzzerPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="🔔" label="Buzzer ile Ses" title="Buzzer ile Ses Çıkarma" sub="Pasif buzzer ile farklı frekanslarda ses üret ve basit bir melodi çal." diff="easy" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, pasif buzzer (ya da aktif)' },
        { icon: '📌', title: 'Kullanılan Pin', desc: 'D8' },
        { icon: '⏱️', title: 'Süre', desc: '~10 dakika' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>Bileşen</th><th>Nereden</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>Buzzer (+)</td><td>—</td><td style={{ color: '#82aaff' }}>D8</td></tr>
            <tr><td>Buzzer (–)</td><td>—</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu — Do Re Mi</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-buzzer" />
        <pre className="mono" id="c-buzzer" dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Buzzer ile Melodi Çalma — Do Re Mi</span>

<span class="kw">const</span> <span class="kw">int</span> <span class="pin">BUZZER_PIN</span> = <span class="num">8</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">DO</span>  = <span class="num">262</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">RE</span>  = <span class="num">294</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">MI</span>  = <span class="num">330</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">FA</span>  = <span class="num">349</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">SOL</span> = <span class="num">392</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">LA</span>  = <span class="num">440</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">SI</span>  = <span class="num">494</span>;

<span class="kw">int</span> <span class="var">melodi</span>[]    = {<span class="def">DO</span>,<span class="def">RE</span>,<span class="def">MI</span>,<span class="def">FA</span>,<span class="def">SOL</span>,<span class="def">LA</span>,<span class="def">SI</span>,<span class="def">DO</span>*<span class="num">2</span>};
<span class="kw">int</span> <span class="var">notaSuresi</span>[] = {<span class="num">300</span>,<span class="num">300</span>,<span class="num">300</span>,<span class="num">300</span>,<span class="num">300</span>,<span class="num">300</span>,<span class="num">300</span>,<span class="num">500</span>};

<span class="kw">void</span> <span class="fn">setup</span>() { <span class="fn">pinMode</span>(<span class="pin">BUZZER_PIN</span>, <span class="def">OUTPUT</span>); }

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="kw">for</span> (<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>; <span class="var">i</span>&lt;<span class="num">8</span>; <span class="var">i</span>++) {
    <span class="fn">tone</span>(<span class="pin">BUZZER_PIN</span>, <span class="var">melodi</span>[<span class="var">i</span>], <span class="var">notaSuresi</span>[<span class="var">i</span>]);
    <span class="fn">delay</span>(<span class="var">notaSuresi</span>[<span class="var">i</span>] + <span class="num">50</span>);
  }
  <span class="fn">noTone</span>(<span class="pin">BUZZER_PIN</span>);
  <span class="fn">delay</span>(<span class="num">1000</span>);
}` }} />
      </div>
      <div className="warn-box text-sm text-slate-300">⚠️ <strong style={{ color: '#f59e0b' }}>Pasif vs Aktif:</strong> Pasif buzzer <code className="mono">tone()</code> ile çalışır. Aktif buzzer sadece HIGH/LOW sinyaliyle sabit ses çıkarır.</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: RGB
══════════════════════════════════════════════════ */
function RgbPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="🌈" label="RGB LED" title="RGB LED Renk Kontrolü" sub="Üç PWM piniyle milyonlarca renk üret. Otomatik gökkuşağı geçişi!" diff="easy" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, RGB LED (ortak katot), 3x 220Ω' },
        { icon: '📌', title: 'Kullanılan Pinler', desc: 'D9(R), D10(G), D11(B) — hepsi PWM' },
        { icon: '⏱️', title: 'Süre', desc: '~15 dakika' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>RGB LED Bacağı</th><th>Bağlantı</th></tr></thead>
          <tbody>
            <tr><td>R (Kırmızı)</td><td style={{ color: '#f78c6c' }}>220Ω → D9</td></tr>
            <tr><td>GND (en uzun)</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>G (Yeşil)</td><td style={{ color: '#22c55e' }}>220Ω → D10</td></tr>
            <tr><td>B (Mavi)</td><td style={{ color: '#82aaff' }}>220Ω → D11</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu — Gökkuşağı Geçişi</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-rgb" />
        <pre className="mono" id="c-rgb" dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> <span class="kw">int</span> <span class="pin">PIN_R</span>=<span class="num">9</span>, <span class="pin">PIN_G</span>=<span class="num">10</span>, <span class="pin">PIN_B</span>=<span class="num">11</span>;

<span class="kw">void</span> <span class="fn">renk</span>(<span class="kw">int</span> <span class="var">r</span>,<span class="kw">int</span> <span class="var">g</span>,<span class="kw">int</span> <span class="var">b</span>){
  <span class="fn">analogWrite</span>(<span class="pin">PIN_R</span>,<span class="var">r</span>); <span class="fn">analogWrite</span>(<span class="pin">PIN_G</span>,<span class="var">g</span>); <span class="fn">analogWrite</span>(<span class="pin">PIN_B</span>,<span class="var">b</span>);
}

<span class="kw">void</span> <span class="fn">setup</span>(){
  <span class="fn">pinMode</span>(<span class="pin">PIN_R</span>,<span class="def">OUTPUT</span>); <span class="fn">pinMode</span>(<span class="pin">PIN_G</span>,<span class="def">OUTPUT</span>); <span class="fn">pinMode</span>(<span class="pin">PIN_B</span>,<span class="def">OUTPUT</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>(){
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>;<span class="var">i</span>&lt;<span class="num">256</span>;<span class="var">i</span>++){<span class="fn">renk</span>(<span class="num">255</span>,<span class="var">i</span>,<span class="num">0</span>);     <span class="fn">delay</span>(<span class="num">5</span>);}
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>;<span class="var">i</span>&lt;<span class="num">256</span>;<span class="var">i</span>++){<span class="fn">renk</span>(<span class="num">255</span>-<span class="var">i</span>,<span class="num">255</span>,<span class="num">0</span>);<span class="fn">delay</span>(<span class="num">5</span>);}
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>;<span class="var">i</span>&lt;<span class="num">256</span>;<span class="var">i</span>++){<span class="fn">renk</span>(<span class="num">0</span>,<span class="num">255</span>,<span class="var">i</span>);     <span class="fn">delay</span>(<span class="num">5</span>);}
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>;<span class="var">i</span>&lt;<span class="num">256</span>;<span class="var">i</span>++){<span class="fn">renk</span>(<span class="num">0</span>,<span class="num">255</span>-<span class="var">i</span>,<span class="num">255</span>);<span class="fn">delay</span>(<span class="num">5</span>);}
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>;<span class="var">i</span>&lt;<span class="num">256</span>;<span class="var">i</span>++){<span class="fn">renk</span>(<span class="var">i</span>,<span class="num">0</span>,<span class="num">255</span>);     <span class="fn">delay</span>(<span class="num">5</span>);}
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>;<span class="var">i</span>&lt;<span class="num">256</span>;<span class="var">i</span>++){<span class="fn">renk</span>(<span class="num">255</span>,<span class="num">0</span>,<span class="num">255</span>-<span class="var">i</span>);<span class="fn">delay</span>(<span class="num">5</span>);}
}` }} />
      </div>
      <div className="tip-box text-sm text-slate-300">💡 <strong style={{ color: '#c792ea' }}>Ortak Anot:</strong> Ortak anot LED'lerde 255 = söndürülmüş, 0 = tam parlak. Kodda <code className="mono">255 - değer</code> kullanman gerekir.</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: LDR
══════════════════════════════════════════════════ */
function LdrPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="☀️" label="LDR Sensörü" title="LDR Işık Sensörü" sub="Ortam ışığını ölç, karanlıkta otomatik LED yak. Gece lambası projesi!" diff="easy" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, LDR, 10kΩ direnç, LED, 220Ω' },
        { icon: '📌', title: 'Kullanılan Pinler', desc: 'A0 (LDR), D13 (LED)' },
        { icon: '⏱️', title: 'Süre', desc: '~15 dakika' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>Bileşen</th><th>Nereden</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>LDR — 1. bacak</td><td>—</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
            <tr><td>LDR — 2. bacak</td><td>—</td><td style={{ color: '#82aaff' }}>A0 & 10kΩ</td></tr>
            <tr><td>10kΩ Direnç</td><td style={{ color: '#82aaff' }}>A0 ile GND arası</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>LED Anot (+)</td><td style={{ color: '#f78c6c' }}>220Ω üzerinden</td><td style={{ color: '#82aaff' }}>D13</td></tr>
            <tr><td>LED Katot (–)</td><td>—</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-ldr" />
        <pre className="mono" id="c-ldr" dangerouslySetInnerHTML={{ __html: `<span class="cmt">// LDR Işık Sensörü — Otomatik Gece Lambası</span>

<span class="kw">const</span> <span class="kw">int</span> <span class="pin">LDR_PIN</span>     = <span class="num">A0</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">LED_PIN</span>     = <span class="num">13</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">ESIK_DEGERI</span> = <span class="num">400</span>;

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">pinMode</span>(<span class="pin">LED_PIN</span>, <span class="def">OUTPUT</span>);
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="kw">int</span> <span class="var">isikSeviyesi</span> = <span class="fn">analogRead</span>(<span class="pin">LDR_PIN</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Işık: "</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">isikSeviyesi</span>);
  <span class="kw">if</span> (<span class="var">isikSeviyesi</span> &lt; <span class="def">ESIK_DEGERI</span>) {
    <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">HIGH</span>);
    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"  → KARANLIK — LED AÇIK"</span>);
  } <span class="kw">else</span> {
    <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">LOW</span>);
    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"  → AYDINLIK — LED KAPALI"</span>);
  }
  <span class="fn">delay</span>(<span class="num">200</span>);
}` }} />
      </div>
      <div className="info-box text-sm text-slate-300">💡 <strong style={{ color: '#82aaff' }}>Eşik Ayarı:</strong> Seri Monitör'ü aç, LDR'ye el tut ve değerlere bak. Karanlık/aydınlık değerlerinin ortasını <code className="mono">ESIK_DEGERI</code> olarak ayarla.</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: SERVO
══════════════════════════════════════════════════ */
function ServoPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="⚙️" label="Servo Motor" title="Servo Motor Kontrolü" sub="Potansiyometre ile servo motoru 0°–180° arasında hassas şekilde kontrol et." diff="medium" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, SG90 Servo, 10kΩ Pot' },
        { icon: '📌', title: 'Kullanılan Pinler', desc: 'D9 (servo sinyal), A0 (pot)' },
        { icon: '⏱️', title: 'Süre', desc: '~20 dakika' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>Bileşen</th><th>Renk</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>Servo — Sinyal</td><td style={{ color: '#f59e0b' }}>Sarı/Turuncu</td><td style={{ color: '#82aaff' }}>D9</td></tr>
            <tr><td>Servo — VCC</td><td style={{ color: '#f78c6c' }}>Kırmızı</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
            <tr><td>Servo — GND</td><td style={{ color: '#94a3b8' }}>Kahve/Siyah</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>Pot Sol</td><td>—</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>Pot Orta</td><td>—</td><td style={{ color: '#82aaff' }}>A0</td></tr>
            <tr><td>Pot Sağ</td><td>—</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-servo" />
        <pre className="mono" id="c-servo" dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Servo Motor — Potansiyometre ile Kontrol</span>
<span class="kw">#include</span> <span class="str">&lt;Servo.h&gt;</span>

<span class="kw">const</span> <span class="kw">int</span> <span class="pin">SERVO_PIN</span> = <span class="num">9</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">POT_PIN</span>   = <span class="num">A0</span>;
<span class="def">Servo</span> <span class="var">servoMotor</span>;

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="var">servoMotor</span>.<span class="fn">attach</span>(<span class="pin">SERVO_PIN</span>);
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="kw">int</span> <span class="var">potDegeri</span> = <span class="fn">analogRead</span>(<span class="pin">POT_PIN</span>);
  <span class="kw">int</span> <span class="var">aci</span> = <span class="fn">map</span>(<span class="var">potDegeri</span>, <span class="num">0</span>, <span class="num">1023</span>, <span class="num">0</span>, <span class="num">180</span>);
  <span class="var">servoMotor</span>.<span class="fn">write</span>(<span class="var">aci</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Açı: "</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">aci</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"°"</span>);
  <span class="fn">delay</span>(<span class="num">15</span>);
}` }} />
      </div>
      <div className="warn-box text-sm text-slate-300">⚠️ <strong style={{ color: '#f59e0b' }}>Güç Uyarısı:</strong> Birden fazla veya büyük servo için harici güç kaynağı kullan. Arduino'nun 5V pini max ~500mA verebilir.</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: DHT11
══════════════════════════════════════════════════ */
function DhtPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="🌡️" label="DHT11" title="DHT11 Sıcaklık & Nem Sensörü" sub="Ortam sıcaklığını ve nemini ölç. İklim istasyonu projesinin temeli!" diff="medium" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, DHT11, 10kΩ pull-up direnç' },
        { icon: '📌', title: 'Kullanılan Pin', desc: 'D4 (tek hat iletişim)' },
        { icon: '⏱️', title: 'Süre', desc: '~20 dakika' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>DHT11 Pin</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>1 — VCC</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
            <tr><td>2 — DATA</td><td style={{ color: '#82aaff' }}>D4 (+ 10kΩ 5V'a pull-up)</td></tr>
            <tr><td>3 — Kullanılmaz</td><td style={{ color: '#546e7a' }}>—</td></tr>
            <tr><td>4 — GND</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
          </tbody>
        </table>
      </div>
      <div className="tip-box text-sm text-slate-300 mb-6">💡 <strong style={{ color: '#c792ea' }}>Kütüphane:</strong> Araçlar → Kütüphane Yöneticisi → <strong>"DHT sensor library" by Adafruit</strong> yükle.</div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-dht" />
        <pre className="mono" id="c-dht" dangerouslySetInnerHTML={{ __html: `<span class="kw">#include</span> <span class="str">"DHT.h"</span>
<span class="kw">#define</span> <span class="pin">DHT_PIN</span> <span class="num">4</span>
<span class="kw">#define</span> <span class="def">DHT_TIP</span> <span class="def">DHT11</span>
<span class="def">DHT</span> <span class="var">dht</span>(<span class="pin">DHT_PIN</span>, <span class="def">DHT_TIP</span>);

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
  <span class="var">dht</span>.<span class="fn">begin</span>();
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="fn">delay</span>(<span class="num">2000</span>);
  <span class="kw">float</span> <span class="var">nem</span>  = <span class="var">dht</span>.<span class="fn">readHumidity</span>();
  <span class="kw">float</span> <span class="var">sicC</span> = <span class="var">dht</span>.<span class="fn">readTemperature</span>();
  <span class="kw">if</span> (<span class="fn">isnan</span>(<span class="var">nem</span>) || <span class="fn">isnan</span>(<span class="var">sicC</span>)) {
    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"HATA: DHT11 okunamıyor!"</span>); <span class="kw">return</span>;
  }
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Sıcaklık: "</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">sicC</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"°C  Nem: "</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">nem</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"%"</span>);
}` }} />
      </div>
      <div className="info-box text-sm text-slate-300">💡 <strong style={{ color: '#82aaff' }}>DHT11 vs DHT22:</strong> DHT22 daha hassas (±0.5°C). Kod aynı, sadece <code className="mono">DHT11</code> yerine <code className="mono">DHT22</code> yaz.</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: HCSR04
══════════════════════════════════════════════════ */
function Hcsr04Page({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="📡" label="HC-SR04" title="HC-SR04 Ultrasonik Mesafe Sensörü" sub="Ses dalgasıyla cm cinsinden mesafe ölç. Robot engellerden kaçınma projesinin temeli!" diff="medium" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, HC-SR04 sensör, kablo' },
        { icon: '📌', title: 'Kullanılan Pinler', desc: 'D9 (Trig), D10 (Echo)' },
        { icon: '📏', title: 'Ölçüm Aralığı', desc: '2 cm – 400 cm' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>HC-SR04 Pin</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>VCC</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
            <tr><td>GND</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>Trig</td><td style={{ color: '#82aaff' }}>D9</td></tr>
            <tr><td>Echo</td><td style={{ color: '#c792ea' }}>D10</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-hcsr04" />
        <pre className="mono" id="c-hcsr04" dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> <span class="kw">int</span> <span class="pin">TRIG_PIN</span>=<span class="num">9</span>, <span class="pin">ECHO_PIN</span>=<span class="num">10</span>;

<span class="kw">void</span> <span class="fn">setup</span>(){
  <span class="fn">pinMode</span>(<span class="pin">TRIG_PIN</span>,<span class="def">OUTPUT</span>); <span class="fn">pinMode</span>(<span class="pin">ECHO_PIN</span>,<span class="def">INPUT</span>);
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
}

<span class="kw">long</span> <span class="fn">mesafeOku</span>(){
  <span class="fn">digitalWrite</span>(<span class="pin">TRIG_PIN</span>,<span class="def">LOW</span>);  <span class="fn">delayMicroseconds</span>(<span class="num">2</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">TRIG_PIN</span>,<span class="def">HIGH</span>); <span class="fn">delayMicroseconds</span>(<span class="num">10</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">TRIG_PIN</span>,<span class="def">LOW</span>);
  <span class="kw">long</span> <span class="var">sure</span> = <span class="fn">pulseIn</span>(<span class="pin">ECHO_PIN</span>,<span class="def">HIGH</span>);
  <span class="kw">return</span> <span class="var">sure</span> * <span class="num">0.0343</span> / <span class="num">2</span>;
}

<span class="kw">void</span> <span class="fn">loop</span>(){
  <span class="kw">long</span> <span class="var">mesafe</span> = <span class="fn">mesafeOku</span>();
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Mesafe: "</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">mesafe</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">" cm"</span>);
  <span class="kw">if</span>(<span class="var">mesafe</span>&lt;<span class="num">10</span>)      <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"  ⚠ ÇOK YAKIN!"</span>);
  <span class="kw">else</span> <span class="kw">if</span>(<span class="var">mesafe</span>&lt;<span class="num">30</span>) <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"  → Yakın"</span>);
  <span class="kw">else</span>               <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"  → Uzak"</span>);
  <span class="fn">delay</span>(<span class="num">200</span>);
}` }} />
      </div>
      <div className="tip-box text-sm text-slate-300">💡 <strong style={{ color: '#c792ea' }}>Robot Projesi:</strong> HC-SR04 + Servo Motor kombinasyonuyla engel algılayan dönen radar sistemi yapabilirsin!</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: I2C LCD
══════════════════════════════════════════════════ */
function I2cLcdPage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="🖥️" label="I2C LCD" title="I2C LCD 16x2 Ekran" sub="Sadece 2 kablo ile 16x2 LCD ekrana metin yazdır. I2C protokolü sayesinde çok kolay!" diff="medium" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, I2C LCD 16x2 (PCF8574 modüllü)' },
        { icon: '📌', title: 'Kullanılan Pinler', desc: 'A4 (SDA), A5 (SCL) — sadece 2!' },
        { icon: '🔤', title: 'Ekran', desc: '16 sütun × 2 satır karakter' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>LCD I2C Pin</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>VCC</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
            <tr><td>GND</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>SDA</td><td style={{ color: '#82aaff' }}>A4 (Uno)</td></tr>
            <tr><td>SCL</td><td style={{ color: '#c792ea' }}>A5 (Uno)</td></tr>
          </tbody>
        </table>
      </div>
      <div className="tip-box text-sm text-slate-300 mb-6">💡 <strong style={{ color: '#c792ea' }}>Kütüphane:</strong> <strong>"LiquidCrystal I2C" by Frank de Brabander</strong> — Kütüphane Yöneticisi'nden yükle. Adres genellikle <code className="mono">0x27</code> veya <code className="mono">0x3F</code>.</div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-lcd" />
        <pre className="mono" id="c-lcd" dangerouslySetInnerHTML={{ __html: `<span class="kw">#include</span> <span class="str">&lt;Wire.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;LiquidCrystal_I2C.h&gt;</span>
<span class="def">LiquidCrystal_I2C</span> <span class="var">lcd</span>(<span class="num">0x27</span>, <span class="num">16</span>, <span class="num">2</span>);
<span class="kw">int</span> <span class="var">sayac</span> = <span class="num">0</span>;

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="var">lcd</span>.<span class="fn">init</span>(); <span class="var">lcd</span>.<span class="fn">backlight</span>();
  <span class="var">lcd</span>.<span class="fn">setCursor</span>(<span class="num">0</span>,<span class="num">0</span>); <span class="var">lcd</span>.<span class="fn">print</span>(<span class="str">"Merhaba Dunya!"</span>);
  <span class="var">lcd</span>.<span class="fn">setCursor</span>(<span class="num">0</span>,<span class="num">1</span>); <span class="var">lcd</span>.<span class="fn">print</span>(<span class="str">"Arduino :)"</span>);
  <span class="fn">delay</span>(<span class="num">2000</span>); <span class="var">lcd</span>.<span class="fn">clear</span>();
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="var">lcd</span>.<span class="fn">setCursor</span>(<span class="num">0</span>,<span class="num">0</span>);
  <span class="var">lcd</span>.<span class="fn">print</span>(<span class="str">"Sayac: "</span>); <span class="var">lcd</span>.<span class="fn">print</span>(<span class="var">sayac</span>); <span class="var">lcd</span>.<span class="fn">print</span>(<span class="str">"    "</span>);
  <span class="var">lcd</span>.<span class="fn">setCursor</span>(<span class="num">0</span>,<span class="num">1</span>); <span class="var">lcd</span>.<span class="fn">print</span>(<span class="str">"Arduino I2C LCD"</span>);
  <span class="var">sayac</span>++; <span class="fn">delay</span>(<span class="num">500</span>);
}` }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: RÖLE
══════════════════════════════════════════════════ */
function RelePage({ show }: { show: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader show={show} emoji="🔌" label="Röle Kontrolü" title="Röle ile Yük Kontrolü" sub="5V röle modülüyle yüksek gerilimli yükleri güvenli şekilde kontrol et." diff="medium" />
      <InfoCards items={[
        { icon: '📦', title: 'Malzemeler', desc: 'Arduino, 5V Röle Modülü, buton' },
        { icon: '📌', title: 'Kullanılan Pinler', desc: 'D7 (röle), D2 (buton)' },
        { icon: '⚠️', title: 'Dikkat', desc: 'AC yükler tehlikelidir! İlk testleri DC yükle yap.' },
      ]} />
      <div className="section-title">🔌 Bağlantı Tablosu</div>
      <div className="rounded-lg overflow-hidden border mb-8" style={{ borderColor: '#1f2d44' }}>
        <table><thead><tr><th>Bileşen</th><th>Nereye</th></tr></thead>
          <tbody>
            <tr><td>Röle VCC</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
            <tr><td>Röle GND</td><td style={{ color: '#00ffe7' }}>GND</td></tr>
            <tr><td>Röle IN</td><td style={{ color: '#82aaff' }}>D7</td></tr>
            <tr><td>Röle COM</td><td>Yük kablosu</td></tr>
            <tr><td>Röle NO</td><td>Güç kaynağı (+)</td></tr>
            <tr><td>Buton</td><td style={{ color: '#82aaff' }}>D2 + 10kΩ pull-down</td></tr>
          </tbody>
        </table>
      </div>
      <div className="section-title">💾 Arduino Kodu</div>
      <div className="code-block mb-6">
        <CopyBtn targetId="c-rele" />
        <pre className="mono" id="c-rele" dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> <span class="kw">int</span> <span class="pin">RELE_PIN</span>=<span class="num">7</span>, <span class="pin">BUTON_PIN</span>=<span class="num">2</span>;
<span class="kw">bool</span> <span class="var">releDurumu</span>=<span class="kw">false</span>, <span class="var">oncekiButon</span>=<span class="kw">false</span>;

<span class="kw">void</span> <span class="fn">setup</span>(){
  <span class="fn">pinMode</span>(<span class="pin">RELE_PIN</span>,<span class="def">OUTPUT</span>); <span class="fn">pinMode</span>(<span class="pin">BUTON_PIN</span>,<span class="def">INPUT</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">RELE_PIN</span>,<span class="def">HIGH</span>); <span class="cmt">// Ters mantık!</span>
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>(){
  <span class="kw">bool</span> <span class="var">buton</span>=<span class="fn">digitalRead</span>(<span class="pin">BUTON_PIN</span>);
  <span class="kw">if</span>(<span class="var">buton</span>==<span class="kw">true</span> && <span class="var">oncekiButon</span>==<span class="kw">false</span>){
    <span class="var">releDurumu</span>=!<span class="var">releDurumu</span>;
    <span class="fn">digitalWrite</span>(<span class="pin">RELE_PIN</span>, <span class="var">releDurumu</span>?<span class="def">LOW</span>:<span class="def">HIGH</span>);
    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">releDurumu</span>?<span class="str">"RÖLE AÇIK"</span>:<span class="str">"RÖLE KAPALI"</span>);
  }
  <span class="var">oncekiButon</span>=<span class="var">buton</span>; <span class="fn">delay</span>(<span class="num">50</span>);
}` }} />
      </div>
      <div className="warn-box text-sm text-slate-300">⚠️ <strong style={{ color: '#f59e0b' }}>GÜVENLİK:</strong> 220V AC ile çalışıyorsan devre enerjili iken kabloları kesinlikle elleme!</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: IRFZ44N (simplified for React)
══════════════════════════════════════════════════ */
function Irfz44nPage({ show }: { show: () => void }) {
  const [activeTab, setActiveTab] = useState<'code' | 'wiring' | 'info'>('code');
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BackBtn show={show} />
        <span className="text-slate-600">/</span>
        <span className="neon-text text-sm font-semibold">⚡ IRFZ44N</span>
        <span className="diff diff-medium ml-auto">Orta</span>
      </div>
      <div className="hero-bg rounded-2xl py-8 px-6 text-center mb-8 relative">
        <div className="relative z-10">
          <span className="badge mb-3 inline-block">MOSFET PWM Kontrolü</span>
          <h1 className="text-3xl font-extrabold text-white mb-2">Arduino + <span className="neon-text">IRFZ44N</span><br />LED / Fan Hız Kontrol Devresi</h1>
          <p className="text-slate-400 text-sm">Potansiyometre ile PWM fan/LED kontrolü + NTC Termistör Sıcaklık Koruması</p>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-6 border-b mb-8 overflow-x-auto" style={{ borderColor: '#1f2d44' }}>
        {[['code', '💾 Arduino Kodu'], ['wiring', '🔌 Bağlantı'], ['info', '📘 Nasıl Çalışır?']] .map(([k, lbl]) => (
          <button key={k} onClick={() => setActiveTab(k as 'code' | 'wiring' | 'info')}
            className={`pb-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-all ${activeTab === k ? 'border-[#00ffe7] text-[#00ffe7]' : 'border-transparent text-slate-400'}`}>
            {lbl}
          </button>
        ))}
      </div>
      {activeTab === 'code' && (
        <div>
          <div className="section-title">💾 Temel Kod</div>
          <div className="code-block mb-6">
            <CopyBtn targetId="c-irfz" />
            <pre className="mono" id="c-irfz" dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> <span class="kw">int</span> <span class="pin">POT_PIN</span>=<span class="num">A0</span>, <span class="pin">MOSFET_PIN</span>=<span class="num">9</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">N</span>=<span class="num">10</span>; <span class="kw">int</span> <span class="var">buf</span>[<span class="num">10</span>]; <span class="kw">long</span> <span class="var">top</span>=<span class="num">0</span>; <span class="kw">int</span> <span class="var">idx</span>=<span class="num">0</span>;

<span class="kw">void</span> <span class="fn">setup</span>(){
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>); <span class="fn">pinMode</span>(<span class="pin">MOSFET_PIN</span>,<span class="def">OUTPUT</span>);
  <span class="fn">analogWrite</span>(<span class="pin">MOSFET_PIN</span>,<span class="num">0</span>);
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>;<span class="var">i</span>&lt;<span class="def">N</span>;<span class="var">i</span>++) <span class="var">buf</span>[<span class="var">i</span>]=<span class="num">0</span>;
}

<span class="kw">void</span> <span class="fn">loop</span>(){
  <span class="var">top</span> -= <span class="var">buf</span>[<span class="var">idx</span>]; <span class="var">buf</span>[<span class="var">idx</span>]=<span class="fn">analogRead</span>(<span class="pin">POT_PIN</span>); <span class="var">top</span>+=<span class="var">buf</span>[<span class="var">idx</span>]; <span class="var">idx</span>=(<span class="var">idx</span>+<span class="num">1</span>)%<span class="def">N</span>;
  <span class="kw">int</span> <span class="var">pot</span>=<span class="var">top</span>/<span class="def">N</span>; <span class="kw">int</span> <span class="var">pwm</span>=<span class="fn">map</span>(<span class="var">pot</span>,<span class="num">0</span>,<span class="num">1023</span>,<span class="num">0</span>,<span class="num">255</span>);
  <span class="fn">analogWrite</span>(<span class="pin">MOSFET_PIN</span>,<span class="var">pwm</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"POT:"</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">pot</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">" PWM:"</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">pwm</span>);
  <span class="fn">delay</span>(<span class="num">100</span>);
}` }} />
          </div>
          <div className="warn-box text-sm text-slate-300">⚠️ Gate–Source arası 10kΩ pull-down, Gate serisine 100Ω direnç ekle. Fan için 1N4007 flyback diyot şart!</div>
        </div>
      )}
      {activeTab === 'wiring' && (
        <div>
          <div className="section-title">📋 Bağlantı Tablosu</div>
          <div className="rounded-lg overflow-hidden border mb-6" style={{ borderColor: '#1f2d44' }}>
            <table><thead><tr><th>Bileşen</th><th>Bacak</th><th>Bağlantı</th></tr></thead>
              <tbody>
                <tr><td>Pot Sol (CCW)</td><td>—</td><td className="neon-text">GND</td></tr>
                <tr><td>Pot Orta (Wiper)</td><td>—</td><td style={{ color: '#82aaff' }}>A0</td></tr>
                <tr><td>Pot Sağ (CW)</td><td>—</td><td style={{ color: '#f78c6c' }}>5V</td></tr>
                <tr><td>IRFZ44N</td><td>Gate (sol)</td><td style={{ color: '#82aaff' }}>100Ω → D9</td></tr>
                <tr><td>IRFZ44N</td><td>Drain (orta)</td><td style={{ color: '#f78c6c' }}>Yük (–)</td></tr>
                <tr><td>IRFZ44N</td><td>Source (sağ)</td><td className="neon-text">GND</td></tr>
                <tr><td>1N4007 (fan)</td><td>Katot (çizgi)</td><td style={{ color: '#f78c6c' }}>Yük (+)</td></tr>
                <tr><td>1N4007 (fan)</td><td>Anot</td><td className="neon-text">Yük (–) / Drain</td></tr>
              </tbody>
            </table>
          </div>
          <div className="tip-box text-sm text-slate-300">💡 Gate–Source arasına 10kΩ direnç bağlamayı unutma, aksi hâlde MOSFET parazitlerden açılabilir.</div>
        </div>
      )}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="comp-card p-5">
            <div className="section-title">⚡ IRFZ44N Özellikleri</div>
            <div className="space-y-2 text-sm">
              {[['Tür', 'N-Kanal MOSFET', '#fff'], ['Maks V_DS', '55V', '#f78c6c'], ['Maks I_D', '49A', '#f78c6c'], ['R_DS(on) @ 5V', '~0.035Ω', '#00ffe7'], ['Paket', 'TO-220', '#fff']].map(([k, v, c]) => (
                <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: '#1f2d44' }}>
                  <span className="text-slate-400">{k}</span><span style={{ color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="comp-card p-5">
            <div className="section-title">🧰 Malzeme Listesi</div>
            <div className="space-y-2 text-sm">
              {[['MOSFET', 'IRFZ44N', '#00ffe7'], ['Potansiyometre', '10kΩ', '#fff'], ['Gate Direnci', '100Ω', '#c792ea'], ['Pull-Down', '10kΩ', '#546e7a'], ['Flyback Diyot', '1N4007', '#ffcb6b']].map(([k, v, c]) => (
                <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: '#1f2d44' }}>
                  <span className="text-slate-400">{k}</span><span style={{ color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: L298N — ZOR
══════════════════════════════════════════════════ */
function L298nPage({ show }: { show: () => void }) {
  const [activeTab, setActiveTab] = useState<'code' | 'wiring' | 'info'>('code');
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BackBtn show={show} />
        <span className="text-slate-600">/</span>
        <span className="neon-text text-sm font-semibold">🚗 L298N Motor Sürücü</span>
        <span className="diff diff-hard ml-auto">Zor</span>
      </div>
      {/* Hero */}
      <div className="hero-bg rounded-2xl py-8 px-6 text-center mb-8 relative" style={{ background: 'linear-gradient(135deg,#0a0e1a,#1a0a0a,#0a0e1a)' }}>
        <div className="relative z-10">
          <span className="badge mb-3 inline-block" style={{ background: 'rgba(239,68,68,.15)', borderColor: 'rgba(239,68,68,.3)', color: '#ef4444' }}>H-Bridge DC Motor Kontrolü</span>
          <h1 className="text-3xl font-extrabold text-white mb-2">Arduino + <span style={{ color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,.5)' }}>L298N</span><br />DC Motor Yön & Hız Kontrolü</h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">H-Köprü devresi ile 2 DC motoru bağımsız yön ve PWM hız kontrolüyle sürdür. Robot araba projesi!</p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="badge" style={{ background: 'rgba(239,68,68,.12)', borderColor: 'rgba(239,68,68,.3)', color: '#ef4444' }}>🚗 L298N H-Bridge</span>
            <span className="badge" style={{ background: 'rgba(247,140,108,.10)', borderColor: 'rgba(247,140,108,.3)', color: '#f78c6c' }}>⚡ 2A / Motor</span>
            <span className="badge" style={{ background: 'rgba(255,203,107,.10)', borderColor: 'rgba(255,203,107,.3)', color: '#ffcb6b' }}>🔄 Yön Kontrolü</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-8 overflow-x-auto" style={{ borderColor: '#1f2d44' }}>
        {[['code', '💾 Arduino Kodu'], ['wiring', '🔌 Bağlantı'], ['info', '📘 Nasıl Çalışır?']].map(([k, lbl]) => (
          <button key={k} onClick={() => setActiveTab(k as 'code' | 'wiring' | 'info')}
            className={`pb-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-all ${activeTab === k ? 'border-[#ef4444] text-[#ef4444]' : 'border-transparent text-slate-400'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {activeTab === 'code' && (
        <div>
          <InfoCards items={[
            { icon: '🎚️', title: 'Hız Kontrolü', desc: 'PWM pinleri (ENA/ENB) ile 0–255 hız ayarı' },
            { icon: '🔄', title: 'Yön Kontrolü', desc: 'IN1/IN2 pinleriyle ileri-geri-frenleme' },
            { icon: '🤖', title: 'Robot Araba', desc: '2 motor bağımsız kontrolü ile diferansiyel sürüş' },
          ]} />
          <div className="section-title">💾 Temel Kod — Motor İleri/Geri/Dur</div>
          <div className="code-block mb-6">
            <CopyBtn targetId="c-l298n-basic" />
            <pre className="mono" id="c-l298n-basic" dangerouslySetInnerHTML={{ __html: `<span class="cmt">/*  L298N Motor Sürücü — Tek Motor İleri/Geri/Dur  */</span>

<span class="cmt">// Motor A pinleri</span>
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">ENA</span> = <span class="num">5</span>;   <span class="cmt">// PWM hız pini (Enable A)</span>
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">IN1</span> = <span class="num">6</span>;   <span class="cmt">// Yön pini 1</span>
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">IN2</span> = <span class="num">7</span>;   <span class="cmt">// Yön pini 2</span>

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">pinMode</span>(<span class="pin">ENA</span>, <span class="def">OUTPUT</span>);
  <span class="fn">pinMode</span>(<span class="pin">IN1</span>, <span class="def">OUTPUT</span>);
  <span class="fn">pinMode</span>(<span class="pin">IN2</span>, <span class="def">OUTPUT</span>);
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"=== L298N Motor Kontrolcü ==="</span>);
}

<span class="kw">void</span> <span class="fn">motorIleri</span>(<span class="kw">int</span> <span class="var">hiz</span>) {   <span class="cmt">// hiz: 0–255</span>
  <span class="fn">digitalWrite</span>(<span class="pin">IN1</span>, <span class="def">HIGH</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">IN2</span>, <span class="def">LOW</span>);
  <span class="fn">analogWrite</span>(<span class="pin">ENA</span>, <span class="var">hiz</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"İLERİ — Hız: "</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">hiz</span>);
}

<span class="kw">void</span> <span class="fn">motorGeri</span>(<span class="kw">int</span> <span class="var">hiz</span>) {
  <span class="fn">digitalWrite</span>(<span class="pin">IN1</span>, <span class="def">LOW</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">IN2</span>, <span class="def">HIGH</span>);
  <span class="fn">analogWrite</span>(<span class="pin">ENA</span>, <span class="var">hiz</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"GERİ  — Hız: "</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">hiz</span>);
}

<span class="kw">void</span> <span class="fn">motorDur</span>() {
  <span class="fn">digitalWrite</span>(<span class="pin">IN1</span>, <span class="def">LOW</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">IN2</span>, <span class="def">LOW</span>);
  <span class="fn">analogWrite</span>(<span class="pin">ENA</span>, <span class="num">0</span>);
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"DUR"</span>);
}

<span class="kw">void</span> <span class="fn">motorFren</span>() {   <span class="cmt">// Elektriksel frenleme</span>
  <span class="fn">digitalWrite</span>(<span class="pin">IN1</span>, <span class="def">HIGH</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">IN2</span>, <span class="def">HIGH</span>);
  <span class="fn">analogWrite</span>(<span class="pin">ENA</span>, <span class="num">255</span>);
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"FREN!"</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="fn">motorIleri</span>(<span class="num">200</span>);  <span class="fn">delay</span>(<span class="num">2000</span>);  <span class="cmt">// 2sn ileri</span>
  <span class="fn">motorDur</span>();       <span class="fn">delay</span>(<span class="num">500</span>);   <span class="cmt">// 0.5sn dur</span>
  <span class="fn">motorGeri</span>(<span class="num">180</span>);  <span class="fn">delay</span>(<span class="num">2000</span>);  <span class="cmt">// 2sn geri</span>
  <span class="fn">motorFren</span>();      <span class="fn">delay</span>(<span class="num">500</span>);   <span class="cmt">// Frenleme</span>
}` }} />
          </div>

          <div className="section-title" style={{ color: '#ef4444' }}>🤖 Bonus — 2 Motorlu Robot Araba</div>
          <div className="tip-box text-sm text-slate-300 mb-4">💡 <strong style={{ color: '#c792ea' }}>Robot Araba:</strong> Sol ve sağ motoru bağımsız kontrol ederek döndürme yapılır.</div>
          <div className="code-block mb-6">
            <CopyBtn targetId="c-l298n-robot" />
            <pre className="mono" id="c-l298n-robot" dangerouslySetInnerHTML={{ __html: `<span class="cmt">/*  L298N — 2 Motorlu Robot Araba  */</span>

<span class="cmt">// SOL Motor</span>
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">ENA</span>=<span class="num">5</span>, <span class="pin">IN1</span>=<span class="num">6</span>, <span class="pin">IN2</span>=<span class="num">7</span>;
<span class="cmt">// SAĞ Motor</span>
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">ENB</span>=<span class="num">10</span>, <span class="pin">IN3</span>=<span class="num">8</span>, <span class="pin">IN4</span>=<span class="num">9</span>;
<span class="kw">const</span> <span class="kw">int</span> <span class="def">HIZ</span> = <span class="num">200</span>;

<span class="kw">void</span> <span class="fn">setup</span>(){
  <span class="kw">int</span> <span class="var">pinler</span>[]={<span class="pin">ENA</span>,<span class="pin">IN1</span>,<span class="pin">IN2</span>,<span class="pin">ENB</span>,<span class="pin">IN3</span>,<span class="pin">IN4</span>};
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>;<span class="var">i</span>&lt;<span class="num">6</span>;<span class="var">i</span>++) <span class="fn">pinMode</span>(<span class="var">pinler</span>[<span class="var">i</span>],<span class="def">OUTPUT</span>);
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
}

<span class="kw">void</span> <span class="fn">ileri</span>(){
  <span class="fn">digitalWrite</span>(<span class="pin">IN1</span>,<span class="def">HIGH</span>); <span class="fn">digitalWrite</span>(<span class="pin">IN2</span>,<span class="def">LOW</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">IN3</span>,<span class="def">HIGH</span>); <span class="fn">digitalWrite</span>(<span class="pin">IN4</span>,<span class="def">LOW</span>);
  <span class="fn">analogWrite</span>(<span class="pin">ENA</span>,<span class="def">HIZ</span>); <span class="fn">analogWrite</span>(<span class="pin">ENB</span>,<span class="def">HIZ</span>);
}

<span class="kw">void</span> <span class="fn">solaDon</span>(){
  <span class="fn">digitalWrite</span>(<span class="pin">IN1</span>,<span class="def">LOW</span>);  <span class="fn">digitalWrite</span>(<span class="pin">IN2</span>,<span class="def">HIGH</span>); <span class="cmt">// Sol motor geri</span>
  <span class="fn">digitalWrite</span>(<span class="pin">IN3</span>,<span class="def">HIGH</span>); <span class="fn">digitalWrite</span>(<span class="pin">IN4</span>,<span class="def">LOW</span>);  <span class="cmt">// Sağ motor ileri</span>
  <span class="fn">analogWrite</span>(<span class="pin">ENA</span>,<span class="def">HIZ</span>); <span class="fn">analogWrite</span>(<span class="pin">ENB</span>,<span class="def">HIZ</span>);
}

<span class="kw">void</span> <span class="fn">sagaDon</span>(){
  <span class="fn">digitalWrite</span>(<span class="pin">IN1</span>,<span class="def">HIGH</span>); <span class="fn">digitalWrite</span>(<span class="pin">IN2</span>,<span class="def">LOW</span>);  <span class="cmt">// Sol motor ileri</span>
  <span class="fn">digitalWrite</span>(<span class="pin">IN3</span>,<span class="def">LOW</span>);  <span class="fn">digitalWrite</span>(<span class="pin">IN4</span>,<span class="def">HIGH</span>); <span class="cmt">// Sağ motor geri</span>
  <span class="fn">analogWrite</span>(<span class="pin">ENA</span>,<span class="def">HIZ</span>); <span class="fn">analogWrite</span>(<span class="pin">ENB</span>,<span class="def">HIZ</span>);
}

<span class="kw">void</span> <span class="fn">dur</span>(){
  <span class="fn">analogWrite</span>(<span class="pin">ENA</span>,<span class="num">0</span>); <span class="fn">analogWrite</span>(<span class="pin">ENB</span>,<span class="num">0</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>(){
  <span class="fn">ileri</span>();    <span class="fn">delay</span>(<span class="num">2000</span>);  <span class="cmt">// 2sn ileri git</span>
  <span class="fn">solaDon</span>(); <span class="fn">delay</span>(<span class="num">600</span>);   <span class="cmt">// 90° sola dön</span>
  <span class="fn">ileri</span>();    <span class="fn">delay</span>(<span class="num">2000</span>);
  <span class="fn">sagaDon</span>(); <span class="fn">delay</span>(<span class="num">600</span>);
  <span class="fn">dur</span>();      <span class="fn">delay</span>(<span class="num">1000</span>);
}` }} />
          </div>
          <div className="danger-box text-sm text-slate-300">🔴 <strong style={{ color: '#ef4444' }}>Motor Gücü:</strong> Motor akımı fazlaysa L298N ısınır — soğutucu tak! Motorları Arduino'nun 5V'undan ASLA besleme, harici güç kaynağı kullan.</div>
        </div>
      )}

      {activeTab === 'wiring' && (
        <div>
          <div className="section-title">📋 L298N Bağlantı Tablosu</div>
          <div className="rounded-lg overflow-hidden border mb-6" style={{ borderColor: '#1f2d44' }}>
            <table><thead><tr><th>L298N Pin</th><th>Arduino Pini</th><th>Açıklama</th></tr></thead>
              <tbody>
                <tr><td>ENA</td><td style={{ color: '#82aaff' }}>D5 (PWM)</td><td className="text-slate-400">Motor A hız kontrolü</td></tr>
                <tr><td>IN1</td><td style={{ color: '#82aaff' }}>D6</td><td className="text-slate-400">Motor A yön 1</td></tr>
                <tr><td>IN2</td><td style={{ color: '#82aaff' }}>D7</td><td className="text-slate-400">Motor A yön 2</td></tr>
                <tr><td>IN3</td><td style={{ color: '#82aaff' }}>D8</td><td className="text-slate-400">Motor B yön 1</td></tr>
                <tr><td>IN4</td><td style={{ color: '#82aaff' }}>D9</td><td className="text-slate-400">Motor B yön 2</td></tr>
                <tr><td>ENB</td><td style={{ color: '#82aaff' }}>D10 (PWM)</td><td className="text-slate-400">Motor B hız kontrolü</td></tr>
                <tr><td>VCC (motor)</td><td style={{ color: '#f78c6c' }}>6–12V harici</td><td className="text-slate-400">Motor besleme gerilimi</td></tr>
                <tr><td>5V (logic)</td><td style={{ color: '#f78c6c' }}>Arduino 5V</td><td className="text-slate-400">Mantık devresi beslemesi</td></tr>
                <tr><td>GND</td><td style={{ color: '#00ffe7' }}>GND (ortak)</td><td className="text-slate-400">Negatif ortak hattı</td></tr>
                <tr><td>OUT1 & OUT2</td><td>—</td><td className="text-slate-400">Motor A uçları</td></tr>
                <tr><td>OUT3 & OUT4</td><td>—</td><td className="text-slate-400">Motor B uçları</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="warn-box text-sm text-slate-300">⚠️ <strong style={{ color: '#f59e0b' }}>12V jumper:</strong> Modül üzerindeki 5V-Enable jumper'ı çıkarırsan harici 5V bağlaman gerekir, takılıyken dahili regülatör kullanır.</div>
            <div className="info-box text-sm text-slate-300">💡 <strong style={{ color: '#82aaff' }}>Mantık tablosu:</strong> IN1=H, IN2=L → İleri | IN1=L, IN2=H → Geri | IN1=L, IN2=L → Serbest | IN1=H, IN2=H → Fren</div>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="comp-card p-5">
              <div className="section-title" style={{ color: '#ef4444' }}>⚡ L298N Özellikleri</div>
              <div className="space-y-2 text-sm">
                {[['Motor Besleme', '5–35V', '#f78c6c'], ['Maks Akım / Kanal', '2A (tepe 3A)', '#f78c6c'], ['Mantık Gerilimi', '5V (3.3V uyumlu)', '#fff'], ['Motor Kanal Sayısı', '2 (bağımsız)', '#00ffe7'], ['PWM Frekansı', 'Max 40kHz', '#ffcb6b'], ['Dahili Diyot', 'Var (flyback)', '#22c55e']].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: '#1f2d44' }}>
                    <span className="text-slate-400">{k}</span><span style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="comp-card p-5">
              <div className="section-title">🧰 Malzeme Listesi</div>
              <div className="space-y-2 text-sm">
                {[['L298N Modül', '1 adet', '#ef4444'], ['DC Motor', '1–2 adet', '#fff'], ['Harici Güç', '7.4V–12V LiPo/Adaptör', '#f78c6c'], ['Arduino Uno/Nano', '1 adet', '#82aaff'], ['HC-SR04 (opsiyonel)', 'Engel algılama', '#c792ea']].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: '#1f2d44' }}>
                    <span className="text-slate-400">{k}</span><span style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="comp-card p-5 mb-4">
            <div className="section-title">🔄 H-Bridge Nasıl Çalışır?</div>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">L298N, 4 transistörden oluşan bir H-Köprü devresidir. Motorun iki ucuna sırayla + ve – voltaj uygulayarak yön değiştirir.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[['IN1=H, IN2=L', 'İLERİ ▶', '#22c55e'], ['IN1=L, IN2=H', 'GERİ ◀', '#f78c6c'], ['IN1=L, IN2=L', 'SERBEST ○', '#64748b'], ['IN1=H, IN2=H', 'FREN ■', '#ef4444']].map(([cond, state, color]) => (
                <div key={state} className="rounded-lg p-3 text-center" style={{ background: '#0a0e1a', border: `1px solid ${color}30` }}>
                  <div className="mono text-xs mb-1" style={{ color: '#546e7a' }}>{cond}</div>
                  <div className="font-bold text-sm" style={{ color }}>{state}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="danger-box text-sm text-slate-300">🔴 <strong style={{ color: '#ef4444' }}>Isınma Uyarısı:</strong> L298N yüksek akımda ısınır. 1A üzeri için soğutucu heatsink tak. Sürekli tam güç için çift L298N veya daha verimli MOSFET sürücü (DRV8833) kullan.</div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: NRF24L01 — ZOR
══════════════════════════════════════════════════ */
function Nrf24l01Page({ show }: { show: () => void }) {
  const [activeTab, setActiveTab] = useState<'tx' | 'rx' | 'wiring' | 'info'>('tx');
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BackBtn show={show} />
        <span className="text-slate-600">/</span>
        <span className="neon-text text-sm font-semibold">📶 NRF24L01</span>
        <span className="diff diff-hard ml-auto">Zor</span>
      </div>
      <div className="hero-bg rounded-2xl py-8 px-6 text-center mb-8 relative" style={{ background: 'linear-gradient(135deg,#0a0e1a,#0a1a0a,#0a0e1a)' }}>
        <div className="relative z-10">
          <span className="badge mb-3 inline-block" style={{ background: 'rgba(34,197,94,.15)', borderColor: 'rgba(34,197,94,.3)', color: '#22c55e' }}>2.4GHz Kablosuz İletişim</span>
          <h1 className="text-3xl font-extrabold text-white mb-2">Arduino + <span style={{ color: '#22c55e', textShadow: '0 0 10px rgba(34,197,94,.5)' }}>NRF24L01</span><br />Kablosuz Veri Transferi</h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">2.4GHz ISM bandında 2 Arduino arasında çift yönlü kablosuz haberleşme. RF24 kütüphanesi ile kolay kurulum.</p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="badge" style={{ background: 'rgba(34,197,94,.12)', borderColor: 'rgba(34,197,94,.3)', color: '#22c55e' }}>📡 2.4GHz RF</span>
            <span className="badge" style={{ background: 'rgba(130,170,255,.1)', borderColor: 'rgba(130,170,255,.3)', color: '#82aaff' }}>🔗 SPI Protokolü</span>
            <span className="badge" style={{ background: 'rgba(255,203,107,.10)', borderColor: 'rgba(255,203,107,.3)', color: '#ffcb6b' }}>📦 32 Byte/Paket</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b mb-8 overflow-x-auto" style={{ borderColor: '#1f2d44' }}>
        {[['tx', '📤 Verici Kodu (TX)'], ['rx', '📥 Alıcı Kodu (RX)'], ['wiring', '🔌 Bağlantı'], ['info', '📘 Bilgi']].map(([k, lbl]) => (
          <button key={k} onClick={() => setActiveTab(k as 'tx' | 'rx' | 'wiring' | 'info')}
            className={`pb-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-all ${activeTab === k ? 'border-[#22c55e] text-[#22c55e]' : 'border-transparent text-slate-400'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {activeTab === 'tx' && (
        <div>
          <div className="info-box text-sm text-slate-300 mb-6">💡 <strong style={{ color: '#82aaff' }}>Kütüphane:</strong> Kütüphane Yöneticisi'nde <strong>"RF24" by TMRh20</strong> kütüphanesini yükle.</div>
          <InfoCards items={[
            { icon: '📤', title: 'TX (Verici)', desc: 'Bu kodu ilk Arduino\'ya yükle. Joystick veya sensör verisi gönderir.' },
            { icon: '📥', title: 'RX (Alıcı)', desc: 'Bir sonraki sekmedeki kodu ikinci Arduino\'ya yükle.' },
            { icon: '🔋', title: '3.3V Besleme', desc: 'NRF24L01 3.3V ile çalışır! 5V bağlarsan modül yanar.' },
          ]} />
          <div className="section-title">💾 Verici (TX) Arduino Kodu</div>
          <div className="code-block mb-6">
            <CopyBtn targetId="c-nrf-tx" />
            <pre className="mono" id="c-nrf-tx" dangerouslySetInnerHTML={{ __html: `<span class="cmt">/*  NRF24L01 — VERİCİ (TX) Arduino  */</span>
<span class="cmt">// Kütüphane: RF24 by TMRh20 — Kütüphane Yöneticisi'nden yükle</span>

<span class="kw">#include</span> <span class="str">&lt;SPI.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;nRF24L01.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;RF24.h&gt;</span>

<span class="cmt">// CE=D9, CSN=D10</span>
<span class="def">RF24</span> <span class="var">radio</span>(<span class="num">9</span>, <span class="num">10</span>);

<span class="cmt">// İletişim adresi (5 bayt) — her iki tarafta aynı olmalı</span>
<span class="kw">const</span> <span class="kw">byte</span> <span class="var">adres</span>[<span class="num">6</span>] = <span class="str">"00001"</span>;

<span class="kw">struct</span> <span class="def">VeriPaketi</span> {
  <span class="kw">int</span>   <span class="var">joyX</span>;      <span class="cmt">// Joystick X ekseni</span>
  <span class="kw">int</span>   <span class="var">joyY</span>;      <span class="cmt">// Joystick Y ekseni</span>
  <span class="kw">bool</span>  <span class="var">buton</span>;     <span class="cmt">// Buton durumu</span>
  <span class="kw">float</span> <span class="var">sicaklik</span>; <span class="cmt">// Sıcaklık (opsiyonel)</span>
};

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
  <span class="var">radio</span>.<span class="fn">begin</span>();
  <span class="var">radio</span>.<span class="fn">openWritingPipe</span>(<span class="var">adres</span>);      <span class="cmt">// Gönderme adresi</span>
  <span class="var">radio</span>.<span class="fn">setPALevel</span>(<span class="def">RF24_PA_LOW</span>);    <span class="cmt">// Güç seviyesi (LOW/MIN/HIGH/MAX)</span>
  <span class="var">radio</span>.<span class="fn">setDataRate</span>(<span class="def">RF24_250KBPS</span>);  <span class="cmt">// Veri hızı — menzil artar</span>
  <span class="var">radio</span>.<span class="fn">stopListening</span>();             <span class="cmt">// TX modu</span>
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"=== NRF24L01 VERİCİ Hazır ==="</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="def">VeriPaketi</span> <span class="var">veri</span>;
  <span class="var">veri</span>.<span class="var">joyX</span>     = <span class="fn">analogRead</span>(<span class="num">A0</span>);        <span class="cmt">// 0–1023</span>
  <span class="var">veri</span>.<span class="var">joyY</span>     = <span class="fn">analogRead</span>(<span class="num">A1</span>);
  <span class="var">veri</span>.<span class="var">buton</span>    = <span class="fn">digitalRead</span>(<span class="num">4</span>);
  <span class="var">veri</span>.<span class="var">sicaklik</span> = <span class="num">25.5</span>;               <span class="cmt">// Gerçek sensörden oku</span>

  <span class="kw">bool</span> <span class="var">basari</span> = <span class="var">radio</span>.<span class="fn">write</span>(&amp;<span class="var">veri</span>, <span class="kw">sizeof</span>(<span class="var">veri</span>));

  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Gönderme: "</span>);
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">basari</span> ? <span class="str">"BAŞARILI ✓"</span> : <span class="str">"BAŞARISIZ ✗"</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"  X="</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">veri</span>.<span class="var">joyX</span>);
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">" Y="</span>);  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">veri</span>.<span class="var">joyY</span>);

  <span class="fn">delay</span>(<span class="num">50</span>);  <span class="cmt">// 20Hz gönderim hızı</span>
}` }} />
          </div>
          <div className="warn-box text-sm text-slate-300">⚠️ <strong style={{ color: '#f59e0b' }}>3.3V ZORUNLU:</strong> NRF24L01 VCC pinine 3.3V bağla! 5V bağlarsan modülü kalıcı olarak bozarsın. 100µF kondansatör VCC-GND arası eklersen kararlılık artar.</div>
        </div>
      )}

      {activeTab === 'rx' && (
        <div>
          <div className="section-title">💾 Alıcı (RX) Arduino Kodu</div>
          <div className="code-block mb-6">
            <CopyBtn targetId="c-nrf-rx" />
            <pre className="mono" id="c-nrf-rx" dangerouslySetInnerHTML={{ __html: `<span class="cmt">/*  NRF24L01 — ALICI (RX) Arduino  */</span>

<span class="kw">#include</span> <span class="str">&lt;SPI.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;nRF24L01.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;RF24.h&gt;</span>

<span class="def">RF24</span> <span class="var">radio</span>(<span class="num">9</span>, <span class="num">10</span>);  <span class="cmt">// CE=9, CSN=10</span>
<span class="kw">const</span> <span class="kw">byte</span> <span class="var">adres</span>[<span class="num">6</span>] = <span class="str">"00001"</span>;  <span class="cmt">// TX ile aynı adres!</span>

<span class="kw">struct</span> <span class="def">VeriPaketi</span> {
  <span class="kw">int</span>   <span class="var">joyX</span>;
  <span class="kw">int</span>   <span class="var">joyY</span>;
  <span class="kw">bool</span>  <span class="var">buton</span>;
  <span class="kw">float</span> <span class="var">sicaklik</span>;
};

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">9600</span>);
  <span class="var">radio</span>.<span class="fn">begin</span>();
  <span class="var">radio</span>.<span class="fn">openReadingPipe</span>(<span class="num">0</span>, <span class="var">adres</span>);   <span class="cmt">// Okuma kanalı</span>
  <span class="var">radio</span>.<span class="fn">setPALevel</span>(<span class="def">RF24_PA_LOW</span>);
  <span class="var">radio</span>.<span class="fn">setDataRate</span>(<span class="def">RF24_250KBPS</span>);
  <span class="var">radio</span>.<span class="fn">startListening</span>();            <span class="cmt">// RX modu</span>
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"=== NRF24L01 ALICI Dinliyor ==="</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="kw">if</span> (<span class="var">radio</span>.<span class="fn">available</span>()) {
    <span class="def">VeriPaketi</span> <span class="var">veri</span>;
    <span class="var">radio</span>.<span class="fn">read</span>(&amp;<span class="var">veri</span>, <span class="kw">sizeof</span>(<span class="var">veri</span>));

    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"--- Paket Alındı ---"</span>);
    <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"JoyX: "</span>);    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">veri</span>.<span class="var">joyX</span>);
    <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"JoyY: "</span>);    <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">veri</span>.<span class="var">joyY</span>);
    <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Buton: "</span>);   <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">veri</span>.<span class="var">buton</span> ? <span class="str">"BASILI"</span> : <span class="str">"SERBEST"</span>);
    <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Sıcaklık: "</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">veri</span>.<span class="var">sicaklik</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"°C"</span>);

    <span class="cmt">// Joystick verisine göre motor veya servo kontrolü</span>
    <span class="kw">int</span> <span class="var">servoAci</span> = <span class="fn">map</span>(<span class="var">veri</span>.<span class="var">joyX</span>, <span class="num">0</span>, <span class="num">1023</span>, <span class="num">0</span>, <span class="num">180</span>);
    <span class="cmt">// servoMotor.write(servoAci);</span>
  }
}` }} />
          </div>
          <div className="info-box text-sm text-slate-300">💡 <strong style={{ color: '#82aaff' }}>Yapı (struct) kullanımı:</strong> Birden fazla farklı veriyi tek pakette göndermenin en temiz yolu struct kullanmaktır. Verici ve alıcıda struct tanımı <strong>birebir aynı</strong> olmalıdır!</div>
        </div>
      )}

      {activeTab === 'wiring' && (
        <div>
          <div className="section-title">📋 NRF24L01 Pin Bağlantıları (Her iki Arduino aynı)</div>
          <div className="rounded-lg overflow-hidden border mb-6" style={{ borderColor: '#1f2d44' }}>
            <table><thead><tr><th>NRF24L01 Pin</th><th>Arduino Uno Pin</th><th>Açıklama</th></tr></thead>
              <tbody>
                <tr><td>VCC</td><td style={{ color: '#fbbf24' }}>3.3V (⚠️ 5V değil!)</td><td className="text-slate-400">Besleme — sadece 3.3V</td></tr>
                <tr><td>GND</td><td style={{ color: '#00ffe7' }}>GND</td><td className="text-slate-400">Negatif</td></tr>
                <tr><td>CE</td><td style={{ color: '#82aaff' }}>D9</td><td className="text-slate-400">Chip Enable (TX/RX mod geçişi)</td></tr>
                <tr><td>CSN</td><td style={{ color: '#82aaff' }}>D10</td><td className="text-slate-400">Chip Select (SPI)</td></tr>
                <tr><td>SCK</td><td style={{ color: '#c792ea' }}>D13</td><td className="text-slate-400">SPI Clock</td></tr>
                <tr><td>MOSI</td><td style={{ color: '#c792ea' }}>D11</td><td className="text-slate-400">SPI Master Out</td></tr>
                <tr><td>MISO</td><td style={{ color: '#c792ea' }}>D12</td><td className="text-slate-400">SPI Master In</td></tr>
                <tr><td>IRQ</td><td style={{ color: '#546e7a' }}>— (opsiyonel)</td><td className="text-slate-400">Interrupt (kullanılmayabilir)</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="danger-box text-sm text-slate-300">🔴 <strong style={{ color: '#ef4444' }}>3.3V ZORUNLU:</strong> VCC pinine kesinlikle 3.3V bağla. 5V bağlarsan modülü kalıcı olarak yakarsin!</div>
            <div className="tip-box text-sm text-slate-300">💡 <strong style={{ color: '#c792ea' }}>Kararlılık İpucu:</strong> VCC-GND arasına 10µF + 100nF kondansatör bağla. Modül voltaj dalgalanmalarına duyarlıdır.</div>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="comp-card p-5">
              <div className="section-title" style={{ color: '#22c55e' }}>📡 NRF24L01 Özellikleri</div>
              <div className="space-y-2 text-sm">
                {[['Frekans', '2.4GHz ISM Bandı', '#22c55e'], ['Menzil (PA+LNA)', '1000m+ (açık alan)', '#22c55e'], ['Menzil (normal)', '100m (açık alan)', '#fff'], ['Veri Hızı', '250kbps / 1Mbps / 2Mbps', '#82aaff'], ['Besleme', '1.9–3.6V', '#fbbf24'], ['Protokol', 'Enhanced ShockBurst™', '#c792ea'], ['Adres Genişliği', '3–5 Bayt', '#fff'], ['Paket Boyutu', 'Max 32 Byte', '#fff']].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: '#1f2d44' }}>
                    <span className="text-slate-400">{k}</span><span style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="comp-card p-5">
              <div className="section-title">🧰 Proje Fikirleri</div>
              <div className="space-y-3">
                {[['🕹️ RC Araba', 'Joystick TX → L298N RX', '#82aaff'], ['🌡️ Kablosuz İstasyon', 'DHT11 TX → LCD RX', '#00ffe7'], ['🚪 Kapı Kilidi', 'RFID + NRF24L01', '#c792ea'], ['🤖 Robot Kontrolü', 'IMU sensor → Robot RX', '#22c55e']].map(([title, desc, color]) => (
                  <div key={title} className="flex gap-3 p-3 rounded-lg" style={{ background: '#0a0e1a' }}>
                    <div className="font-semibold text-sm" style={{ color }}>{title}</div>
                    <div className="text-slate-500 text-xs">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="warn-box text-sm text-slate-300">⚠️ <strong style={{ color: '#f59e0b' }}>Sorun Giderme:</strong> Bağlantı kuramıyorsan: 1) Adreslerin aynı olduğunu kontrol et 2) 3.3V beslemeyi doğrula 3) Kondansatör ekle 4) PA Level'ı LOW'a al 5) Veri hızını 250KBPS yap</div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE: NodeMCU ESP8266 — ZOR
══════════════════════════════════════════════════ */
function NodeMcuPage({ show }: { show: () => void }) {
  const [activeTab, setActiveTab] = useState<'webserver' | 'iot' | 'wiring' | 'info'>('webserver');
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BackBtn show={show} />
        <span className="text-slate-600">/</span>
        <span className="neon-text text-sm font-semibold">🌐 NodeMCU ESP8266</span>
        <span className="diff diff-hard ml-auto">Zor</span>
      </div>
      <div className="hero-bg rounded-2xl py-8 px-6 text-center mb-8 relative" style={{ background: 'linear-gradient(135deg,#0a0e1a,#0a0a1a,#0a0e1a)' }}>
        <div className="relative z-10">
          <span className="badge mb-3 inline-block" style={{ background: 'rgba(130,170,255,.15)', borderColor: 'rgba(130,170,255,.3)', color: '#82aaff' }}>IoT & WiFi Projeler</span>
          <h1 className="text-3xl font-extrabold text-white mb-2">NodeMCU <span style={{ color: '#82aaff', textShadow: '0 0 10px rgba(130,170,255,.5)' }}>ESP8266</span><br />WiFi Web Sunucusu & IoT</h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">WiFi üzerinden web sunucusu kur, cihazları tarayıcıdan kontrol et. MQTT ile IoT platformlarına veri gönder.</p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="badge" style={{ background: 'rgba(130,170,255,.12)', borderColor: 'rgba(130,170,255,.3)', color: '#82aaff' }}>📡 WiFi 802.11 b/g/n</span>
            <span className="badge" style={{ background: 'rgba(0,255,231,.1)', borderColor: 'rgba(0,255,231,.25)', color: '#00ffe7' }}>🌐 HTTP Server</span>
            <span className="badge" style={{ background: 'rgba(199,146,234,.1)', borderColor: 'rgba(199,146,234,.3)', color: '#c792ea' }}>📊 MQTT / IoT</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b mb-8 overflow-x-auto" style={{ borderColor: '#1f2d44' }}>
        {[['webserver', '🌐 Web Sunucu'], ['iot', '📊 MQTT / IoT'], ['wiring', '🔌 Kurulum'], ['info', '📘 Bilgi']].map(([k, lbl]) => (
          <button key={k} onClick={() => setActiveTab(k as 'webserver' | 'iot' | 'wiring' | 'info')}
            className={`pb-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-all ${activeTab === k ? 'border-[#82aaff] text-[#82aaff]' : 'border-transparent text-slate-400'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {activeTab === 'webserver' && (
        <div>
          <div className="info-box text-sm text-slate-300 mb-6">💡 <strong style={{ color: '#82aaff' }}>Arduino IDE Kurulum:</strong> Dosya → Tercihler → Ek Kart URL: <code className="mono text-xs">http://arduino.esp8266.com/stable/package_esp8266com_index.json</code> → Kart Yöneticisi → "esp8266" yükle.</div>
          <InfoCards items={[
            { icon: '🌐', title: 'Web Arayüzü', desc: 'Tarayıcıdan LED\'i açıp kapatabilirsin. Responsive HTML sayfası.' },
            { icon: '📱', title: 'Mobil Uyumlu', desc: 'Telefon tarayıcısından da kontrol edilebilir.' },
            { icon: '🔒', title: 'LAN Erişimi', desc: 'Aynı WiFi ağındaki tüm cihazlardan erişilebilir.' },
          ]} />
          <div className="section-title">💾 WiFi Web Sunucu — LED Kontrolü</div>
          <div className="code-block mb-6">
            <CopyBtn targetId="c-nodemcu-web" />
            <pre className="mono" id="c-nodemcu-web" dangerouslySetInnerHTML={{ __html: `<span class="cmt">/*  NodeMCU ESP8266 — WiFi Web Sunucu ile LED Kontrolü  */</span>
<span class="cmt">// Kart: NodeMCU 1.0 (ESP-12E Module)</span>

<span class="kw">#include</span> <span class="str">&lt;ESP8266WiFi.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;ESP8266WebServer.h&gt;</span>

<span class="cmt">// WiFi bilgileri — kendi ağın ile değiştir!</span>
<span class="kw">const</span> <span class="kw">char</span>* <span class="var">ssid</span>     = <span class="str">"WIFI_ADI"</span>;
<span class="kw">const</span> <span class="kw">char</span>* <span class="var">sifre</span>    = <span class="str">"WIFI_SIFRESI"</span>;

<span class="def">ESP8266WebServer</span> <span class="var">sunucu</span>(<span class="num">80</span>);
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">LED_PIN</span> = <span class="num">2</span>;   <span class="cmt">// D4 = GPIO2 (NodeMCU)</span>
<span class="kw">bool</span> <span class="var">ledDurumu</span> = <span class="kw">false</span>;

<span class="cmt">// HTML arayüzü</span>
<span class="def">String</span> <span class="fn">htmlSayfa</span>() {
  <span class="def">String</span> <span class="var">html</span> = <span class="str">"&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;meta charset='UTF-8'&gt;&lt;meta name='viewport' content='width=device-width,initial-scale=1'&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;title&gt;Arduino IoT&lt;/title&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;style&gt;body{background:#111;color:#fff;font-family:sans-serif;text-align:center;padding:40px}"</span>;
  <span class="var">html</span> += <span class="str">"button{padding:15px 40px;font-size:1.2rem;border:none;border-radius:10px;cursor:pointer;margin:10px}"</span>;
  <span class="var">html</span> += <span class="str">".ac{background:#00ffe7;color:#000}.kapat{background:#333;color:#fff}&lt;/style&gt;&lt;/head&gt;&lt;body&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;h1&gt;🌐 NodeMCU LED Kontrol&lt;/h1&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;p&gt;LED Durumu: &lt;strong&gt;"</span> + <span class="def">String</span>(<span class="var">ledDurumu</span> ? <span class="str">"AÇIK 💡"</span> : <span class="str">"KAPALI"</span>) + <span class="str">"&lt;/strong&gt;&lt;/p&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;a href='/ac'&gt;&lt;button class='ac'&gt;LED AC&lt;/button&gt;&lt;/a&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;a href='/kapat'&gt;&lt;button class='kapat'&gt;LED KAPAT&lt;/button&gt;&lt;/a&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;p style='color:#666;font-size:.8rem'&gt;IP: "</span> + <span class="fn">WiFi</span>.<span class="fn">localIP</span>().<span class="fn">toString</span>() + <span class="str">"&lt;/p&gt;"</span>;
  <span class="var">html</span> += <span class="str">"&lt;/body&gt;&lt;/html&gt;"</span>;
  <span class="kw">return</span> <span class="var">html</span>;
}

<span class="kw">void</span> <span class="fn">setup</span>() {
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">115200</span>);
  <span class="fn">pinMode</span>(<span class="pin">LED_PIN</span>, <span class="def">OUTPUT</span>);
  <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">HIGH</span>);  <span class="cmt">// NodeMCU LED ters mantık</span>

  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"WiFi bağlanıyor: "</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">ssid</span>);
  <span class="fn">WiFi</span>.<span class="fn">begin</span>(<span class="var">ssid</span>, <span class="var">sifre</span>);
  <span class="kw">while</span> (<span class="fn">WiFi</span>.<span class="fn">status</span>() != <span class="def">WL_CONNECTED</span>) { <span class="fn">delay</span>(<span class="num">500</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"."</span>); }

  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"\nBağlandı! IP: "</span>);
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="fn">WiFi</span>.<span class="fn">localIP</span>());

  <span class="var">sunucu</span>.<span class="fn">on</span>(<span class="str">"/"</span>, []() { <span class="var">sunucu</span>.<span class="fn">send</span>(<span class="num">200</span>, <span class="str">"text/html"</span>, <span class="fn">htmlSayfa</span>()); });
  <span class="var">sunucu</span>.<span class="fn">on</span>(<span class="str">"/ac"</span>, []() {
    <span class="var">ledDurumu</span> = <span class="kw">true</span>;
    <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">LOW</span>);  <span class="cmt">// Ters mantık</span>
    <span class="var">sunucu</span>.<span class="fn">sendHeader</span>(<span class="str">"Location"</span>, <span class="str">"/"</span>); <span class="var">sunucu</span>.<span class="fn">send</span>(<span class="num">302</span>);
  });
  <span class="var">sunucu</span>.<span class="fn">on</span>(<span class="str">"/kapat"</span>, []() {
    <span class="var">ledDurumu</span> = <span class="kw">false</span>;
    <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>, <span class="def">HIGH</span>);
    <span class="var">sunucu</span>.<span class="fn">sendHeader</span>(<span class="str">"Location"</span>, <span class="str">"/"</span>); <span class="var">sunucu</span>.<span class="fn">send</span>(<span class="num">302</span>);
  });
  <span class="var">sunucu</span>.<span class="fn">begin</span>();
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"HTTP Sunucu başladı!"</span>);
}

<span class="kw">void</span> <span class="fn">loop</span>() {
  <span class="var">sunucu</span>.<span class="fn">handleClient</span>();  <span class="cmt">// Gelen istekleri işle</span>
}` }} />
          </div>
          <div className="tip-box text-sm text-slate-300">💡 <strong style={{ color: '#c792ea' }}>IP Bulma:</strong> Kod yüklendikten sonra Seri Monitör'ü aç (115200 baud). NodeMCU'nun IP adresini göreceksin. Telefon veya bilgisayarının tarayıcısına o IP'yi yaz!</div>
        </div>
      )}

      {activeTab === 'iot' && (
        <div>
          <div className="section-title">📊 MQTT ile IoT — ThingSpeak / MQTT Broker</div>
          <div className="info-box text-sm text-slate-300 mb-6">💡 <strong style={{ color: '#82aaff' }}>MQTT Kütüphanesi:</strong> Kütüphane Yöneticisi → <strong>"PubSubClient" by Nick O'Leary</strong> yükle. MQTT Broker olarak <strong>broker.hivemq.com</strong> (ücretsiz) kullanılabilir.</div>
          <div className="code-block mb-6">
            <CopyBtn targetId="c-nodemcu-mqtt" />
            <pre className="mono" id="c-nodemcu-mqtt" dangerouslySetInnerHTML={{ __html: `<span class="cmt">/*  NodeMCU ESP8266 — MQTT ile Sıcaklık Gönderme  */</span>
<span class="cmt">// Kütüphane: PubSubClient (Nick O'Leary), DHT sensor (Adafruit)</span>

<span class="kw">#include</span> <span class="str">&lt;ESP8266WiFi.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;PubSubClient.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;DHT.h&gt;</span>

<span class="kw">const</span> <span class="kw">char</span>* <span class="var">ssid</span>        = <span class="str">"WIFI_ADI"</span>;
<span class="kw">const</span> <span class="kw">char</span>* <span class="var">sifre</span>       = <span class="str">"WIFI_SIFRESI"</span>;
<span class="kw">const</span> <span class="kw">char</span>* <span class="var">mqttSunucu</span>  = <span class="str">"broker.hivemq.com"</span>;
<span class="kw">const</span> <span class="kw">int</span>  <span class="var">mqttPort</span>     = <span class="num">1883</span>;

<span class="kw">const</span> <span class="kw">char</span>* <span class="var">topicSicak</span>  = <span class="str">"arduino/sicaklik"</span>;
<span class="kw">const</span> <span class="kw">char</span>* <span class="var">topicNem</span>    = <span class="str">"arduino/nem"</span>;
<span class="kw">const</span> <span class="kw">char</span>* <span class="var">topicKomut</span>  = <span class="str">"arduino/komut"</span>;  <span class="cmt">// Komut alma</span>

<span class="def">DHT</span> <span class="var">dht</span>(<span class="num">4</span>, <span class="def">DHT11</span>);   <span class="cmt">// D2 = GPIO4</span>
<span class="def">WiFiClient</span> <span class="var">espClient</span>;
<span class="def">PubSubClient</span> <span class="var">mqtt</span>(<span class="var">espClient</span>);
<span class="kw">const</span> <span class="kw">int</span> <span class="pin">LED_PIN</span> = <span class="num">2</span>;

<span class="cmt">// MQTT'den gelen mesajları işle</span>
<span class="kw">void</span> <span class="fn">mqttCallback</span>(<span class="kw">char</span>* <span class="var">topic</span>, <span class="kw">byte</span>* <span class="var">payload</span>, <span class="kw">unsigned int</span> <span class="var">length</span>) {
  <span class="def">String</span> <span class="var">mesaj</span>;
  <span class="kw">for</span>(<span class="kw">int</span> <span class="var">i</span>=<span class="num">0</span>; <span class="var">i</span>&lt;(<span class="kw">int</span>)<span class="var">length</span>; <span class="var">i</span>++) <span class="var">mesaj</span>+=(<span class="kw">char</span>)<span class="var">payload</span>[<span class="var">i</span>];
  <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"Komut: "</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="var">mesaj</span>);
  <span class="kw">if</span>(<span class="var">mesaj</span>==<span class="str">"AC"</span>)    <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>,<span class="def">LOW</span>);
  <span class="kw">if</span>(<span class="var">mesaj</span>==<span class="str">"KAPAT"</span>) <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>,<span class="def">HIGH</span>);
}

<span class="kw">void</span> <span class="fn">wifiBaglan</span>(){
  <span class="fn">WiFi</span>.<span class="fn">begin</span>(<span class="var">ssid</span>,<span class="var">sifre</span>);
  <span class="kw">while</span>(<span class="fn">WiFi</span>.<span class="fn">status</span>()!=<span class="def">WL_CONNECTED</span>){ <span class="fn">delay</span>(<span class="num">500</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"."</span>); }
  <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"WiFi OK"</span>);
}

<span class="kw">void</span> <span class="fn">mqttBaglan</span>(){
  <span class="kw">while</span>(!<span class="var">mqtt</span>.<span class="fn">connected</span>()){
    <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"MQTT bağlanıyor..."</span>);
    <span class="kw">if</span>(<span class="var">mqtt</span>.<span class="fn">connect</span>(<span class="str">"ArduinoClient_001"</span>)){
      <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"bağlandı!"</span>);
      <span class="var">mqtt</span>.<span class="fn">subscribe</span>(<span class="var">topicKomut</span>);  <span class="cmt">// Komut kanalına abone ol</span>
    } <span class="kw">else</span> { <span class="fn">delay</span>(<span class="num">5000</span>); }
  }
}

<span class="kw">void</span> <span class="fn">setup</span>(){
  <span class="fn">Serial</span>.<span class="fn">begin</span>(<span class="num">115200</span>);
  <span class="fn">pinMode</span>(<span class="pin">LED_PIN</span>,<span class="def">OUTPUT</span>); <span class="fn">digitalWrite</span>(<span class="pin">LED_PIN</span>,<span class="def">HIGH</span>);
  <span class="var">dht</span>.<span class="fn">begin</span>();
  <span class="fn">wifiBaglan</span>();
  <span class="var">mqtt</span>.<span class="fn">setServer</span>(<span class="var">mqttSunucu</span>,<span class="var">mqttPort</span>);
  <span class="var">mqtt</span>.<span class="fn">setCallback</span>(<span class="fn">mqttCallback</span>);
}

<span class="kw">unsigned long</span> <span class="var">sonGonderme</span> = <span class="num">0</span>;
<span class="kw">void</span> <span class="fn">loop</span>(){
  <span class="kw">if</span>(!<span class="var">mqtt</span>.<span class="fn">connected</span>()) <span class="fn">mqttBaglan</span>();
  <span class="var">mqtt</span>.<span class="fn">loop</span>();

  <span class="cmt">// Her 10 saniyede bir veri gönder</span>
  <span class="kw">if</span>(<span class="fn">millis</span>()-<span class="var">sonGonderme</span> > <span class="num">10000</span>){
    <span class="var">sonGonderme</span>=<span class="fn">millis</span>();
    <span class="kw">float</span> <span class="var">sic</span>=<span class="var">dht</span>.<span class="fn">readTemperature</span>(), <span class="var">nem</span>=<span class="var">dht</span>.<span class="fn">readHumidity</span>();
    <span class="kw">if</span>(!<span class="fn">isnan</span>(<span class="var">sic</span>)){
      <span class="kw">char</span> <span class="var">buf</span>[<span class="num">10</span>];
      <span class="fn">dtostrf</span>(<span class="var">sic</span>,<span class="num">4</span>,<span class="num">1</span>,<span class="var">buf</span>); <span class="var">mqtt</span>.<span class="fn">publish</span>(<span class="var">topicSicak</span>,<span class="var">buf</span>);
      <span class="fn">dtostrf</span>(<span class="var">nem</span>,<span class="num">4</span>,<span class="num">1</span>,<span class="var">buf</span>); <span class="var">mqtt</span>.<span class="fn">publish</span>(<span class="var">topicNem</span>,<span class="var">buf</span>);
      <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="str">"MQTT Gönderildi: "</span>); <span class="fn">Serial</span>.<span class="fn">print</span>(<span class="var">sic</span>); <span class="fn">Serial</span>.<span class="fn">println</span>(<span class="str">"°C"</span>);
    }
  }
}` }} />
          </div>
          <div className="tip-box text-sm text-slate-300">💡 <strong style={{ color: '#c792ea' }}>MQTT Test:</strong> MQTT Explorer veya MQTT Dash uygulamasıyla <code className="mono">broker.hivemq.com</code>'a bağlanıp <code className="mono">arduino/sicaklik</code> kanalını takip edebilirsin!</div>
        </div>
      )}

      {activeTab === 'wiring' && (
        <div>
          <div className="section-title">📋 NodeMCU GPIO Haritası</div>
          <div className="rounded-lg overflow-hidden border mb-6" style={{ borderColor: '#1f2d44' }}>
            <table><thead><tr><th>NodeMCU Pin</th><th>GPIO Numarası</th><th>Özellik</th><th>Kullanım</th></tr></thead>
              <tbody>
                <tr><td>D0</td><td style={{ color: '#82aaff' }}>GPIO16</td><td className="text-slate-400">Dijital G/Ç</td><td className="text-slate-400">DeepSleep Wake</td></tr>
                <tr><td>D1</td><td style={{ color: '#82aaff' }}>GPIO5</td><td className="text-slate-400">I2C SCL</td><td className="text-slate-400">LCD, Sensörler</td></tr>
                <tr><td>D2</td><td style={{ color: '#82aaff' }}>GPIO4</td><td className="text-slate-400">I2C SDA / DHT</td><td className="text-slate-400">DHT11, LCD</td></tr>
                <tr><td>D3</td><td style={{ color: '#82aaff' }}>GPIO0</td><td style={{ color: '#f59e0b' }}>Flash Button</td><td className="text-slate-400">Dikkatli kullan</td></tr>
                <tr><td>D4</td><td style={{ color: '#82aaff' }}>GPIO2</td><td style={{ color: '#00ffe7' }}>Dahili LED (ters)</td><td className="text-slate-400">Test LED</td></tr>
                <tr><td>D5</td><td style={{ color: '#82aaff' }}>GPIO14</td><td className="text-slate-400">SPI SCK</td><td className="text-slate-400">NRF24L01, SD</td></tr>
                <tr><td>D6</td><td style={{ color: '#82aaff' }}>GPIO12</td><td className="text-slate-400">SPI MISO</td><td className="text-slate-400">NRF24L01, SD</td></tr>
                <tr><td>D7</td><td style={{ color: '#82aaff' }}>GPIO13</td><td className="text-slate-400">SPI MOSI</td><td className="text-slate-400">NRF24L01, SD</td></tr>
                <tr><td>D8</td><td style={{ color: '#82aaff' }}>GPIO15</td><td style={{ color: '#f59e0b' }}>Pull-down (boot)</td><td className="text-slate-400">Dikkatli kullan</td></tr>
                <tr><td>A0</td><td style={{ color: '#f78c6c' }}>ADC0</td><td className="text-slate-400">Analog Giriş (0–1V!)</td><td className="text-slate-400">Voltaj bölücü gerekli</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="warn-box text-sm text-slate-300">⚠️ <strong style={{ color: '#f59e0b' }}>A0 Uyarısı:</strong> NodeMCU'nun A0 pini maksimum 1.0V kabul eder. Arduino'nun 5V analog çıkışı için voltaj bölücü kullanmalısın (3.3kΩ + 1kΩ).</div>
            <div className="info-box text-sm text-slate-300">💡 <strong style={{ color: '#82aaff' }}>Baud Rate:</strong> Seri Monitör'ü 115200 baud'a ayarla. Arduino'nun 9600'ü ile karıştırma!</div>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="comp-card p-5">
              <div className="section-title" style={{ color: '#82aaff' }}>📡 ESP8266 Özellikleri</div>
              <div className="space-y-2 text-sm">
                {[['İşlemci', 'Tensilica L106 @ 80/160MHz', '#fff'], ['RAM', '96KB (IRAM + DRAM)', '#82aaff'], ['Flash', '4MB (NodeMCU)', '#82aaff'], ['WiFi', '802.11 b/g/n 2.4GHz', '#22c55e'], ['Güç', '3.3V (USB: 5V)', '#fbbf24'], ['ADC', '10-bit (0–1V)', '#f78c6c'], ['GPIO', '17 adet (NodeMCU)', '#fff'], ['Protokoller', 'I2C, SPI, UART, I2S', '#c792ea']].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between py-1 border-b" style={{ borderColor: '#1f2d44' }}>
                    <span className="text-slate-400">{k}</span><span style={{ color: c, fontSize: '.8rem' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="comp-card p-5">
              <div className="section-title">🚀 Proje Fikirleri</div>
              <div className="space-y-3">
                {[['🌡️ IoT İklim İstasyonu', 'DHT11 → MQTT → Dashboard', '#00ffe7'],
                  ['💡 Akıllı Ev Kontrolü', 'Web sunucu → Röle → Lamba', '#82aaff'],
                  ['📊 Veri Kaydedici', 'Sensör → ThingSpeak', '#c792ea'],
                  ['🔔 Telegram Bot', 'Hareket algıla → Bildirim', '#22c55e'],
                  ['⏰ NTP Saati', 'WiFi ile otomatik saat', '#fbbf24']].map(([t, d, c]) => (
                  <div key={t} className="flex gap-3 p-3 rounded-lg" style={{ background: '#0a0e1a' }}>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: c }}>{t}</div>
                      <div className="text-slate-500 text-xs">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="comp-card p-5 mb-4">
            <div className="section-title">🆚 Arduino Uno vs NodeMCU ESP8266</div>
            <div className="overflow-x-auto">
              <table>
                <thead><tr><th>Özellik</th><th style={{ color: '#82aaff' }}>Arduino Uno</th><th style={{ color: '#00ffe7' }}>NodeMCU ESP8266</th></tr></thead>
                <tbody>
                  {[['İşlemci', 'ATmega328P 16MHz', 'ESP8266 80MHz'], ['RAM', '2KB', '96KB'], ['WiFi', '❌ Yok', '✅ Dahili'], ['Fiyat', '~₺80', '~₺60'], ['GPIO Volt', '5V toleranslı', '3.3V (dikkat!'], ['Analog Giriş', '10-bit 0–5V', '10-bit 0–1V'], ['OTA Update', '❌', '✅ WiFi ile'], ['Gerçek zamanlı', 'Mükemmel', 'WiFi öncelikli']].map(([k, a, e]) => (
                    <tr key={k}><td className="text-slate-400">{k}</td><td style={{ color: '#82aaff' }}>{a}</td><td style={{ color: '#00ffe7' }}>{e}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="danger-box text-sm text-slate-300">🔴 <strong style={{ color: '#ef4444' }}>3.3V GPIO:</strong> NodeMCU'nun tüm GPIO'ları 3.3V'tur. 5V sinyalini direkt bağlarsan GPIO veya ESP çipi zarar görebilir. Voltaj bölücü veya 3.3V uyumlu sensör kullan!</div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════ */
function Nav({ page, show }: { page: PageId; show: (p: PageId) => void }) {
  const names: Partial<Record<PageId, string>> = {
    led: 'LED Yakma', buton: 'Buton ile LED', pot: 'Potansiyometre',
    buzzer: 'Buzzer Ses', rgb: 'RGB LED', ldr: 'LDR Sensör',
    servo: 'Servo Motor', dht: 'DHT11 Sensör', hcsr04: 'HC-SR04 Mesafe',
    i2clcd: 'I2C LCD', rele: 'Röle Kontrolü', irfz44n: 'IRFZ44N',
    l298n: 'L298N Motor', nrf24l01: 'NRF24L01 Kablosuz', nodemcu: 'NodeMCU ESP8266',
  };
  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(10,14,26,0.92)', borderColor: '#1f2d44', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => show('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00ffe7,#7b2fff)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
          </div>
          <span className="font-bold text-white text-sm">Arduino <span className="neon-text">Devre Rehberi</span></span>
        </button>
        <div className="flex items-center gap-3">
          <span className="badge hidden sm:inline">🇹🇷 Türkçe</span>
          {page !== 'home' && <span className="text-slate-500 text-xs hidden sm:inline">/ {names[page]}</span>}
        </div>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════ */
export default function App() {
  const { page, show } = usePage();

  // inject global CSS once
  useEffect(() => {
    const id = 'arduino-global-css';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = globalCSS;
      document.head.appendChild(el);
    }
  }, []);

  const goHome = () => show('home');

  return (
    <div style={{ background: '#0a0e1a', minHeight: '100vh' }}>
      <Nav page={page} show={show} />

      {page === 'home'     && <HomePage show={show} />}
      {page === 'led'      && <LedPage show={goHome} />}
      {page === 'buton'    && <ButonPage show={goHome} />}
      {page === 'pot'      && <PotPage show={goHome} />}
      {page === 'buzzer'   && <BuzzerPage show={goHome} />}
      {page === 'rgb'      && <RgbPage show={goHome} />}
      {page === 'ldr'      && <LdrPage show={goHome} />}
      {page === 'servo'    && <ServoPage show={goHome} />}
      {page === 'dht'      && <DhtPage show={goHome} />}
      {page === 'hcsr04'   && <Hcsr04Page show={goHome} />}
      {page === 'i2clcd'   && <I2cLcdPage show={goHome} />}
      {page === 'rele'     && <RelePage show={goHome} />}
      {page === 'irfz44n'  && <Irfz44nPage show={goHome} />}
      {page === 'l298n'    && <L298nPage show={goHome} />}
      {page === 'nrf24l01' && <Nrf24l01Page show={goHome} />}
      {page === 'nodemcu'  && <NodeMcuPage show={goHome} />}

      <footer className="mt-12 py-8 text-center border-t" style={{ borderColor: '#1f2d44', color: '#475569', fontSize: '.75rem' }}>
        <p>Arduino Devre Rehberi • Türkçe Elektronik Eğitimi</p>
        <p className="mt-1" style={{ color: '#1f2d44' }}>Maker'lar ve elektronik meraklıları için hazırlandı 🇹🇷</p>
      </footer>
    </div>
  );
}
