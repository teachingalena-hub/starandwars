"use client";

import { useEffect, useState } from "react";

const games = [
  { id:"echoes", number:"01", title:"ECHOES OF DAWN", kicker:"THE LAST LIGHT", description:"Пробудись на краю известной галактики и верни свет миру, который уже перестал надеяться.", image:"/games/echoes-of-dawn.png", genre:"ACTION RPG", players:"SOLO", accent:"#57c9ff", rgb:"87, 201, 255" },
  { id:"shadow", number:"02", title:"SHADOW PROTOCOL", kicker:"TRUST NO SIGNAL", description:"Каждый приказ оставляет след. Раскрой протокол, прежде чем город поглотит красная тьма.", image:"/games/shadow-protocol.png", genre:"DARK ACTION", players:"1–2 PLAYERS", accent:"#ff5362", rgb:"255, 83, 98" },
  { id:"vanguard", number:"03", title:"VOID VANGUARD", kicker:"COMMAND THE UNKNOWN", description:"Собери флот, удержи рубеж и возглавь последнюю армаду в войне за безмолвные звёзды.", image:"/games/void-vanguard.png", genre:"SPACE STRATEGY", players:"MULTIPLAYER", accent:"#b77aff", rgb:"183, 122, 255" },
];
type Game = (typeof games)[number];

function Icon({ children }: { children: React.ReactNode }) { return <span className="nav-icon" aria-hidden="true">{children}</span>; }

export default function Home() {
  const [active, setActive] = useState<Game | null>(null);
  const [sound, setSound] = useState(true);
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === "Escape" && setActive(null); window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  return (
    <main className="shell">
      <aside className="rail">
        <a className="brand" href="#top" aria-label="Astra home"><span>Λ</span><i /></a>
        <nav aria-label="Основная навигация">
          <a className="nav-link active" href="#games"><Icon>⌂</Icon><b>HOME</b></a>
          <a className="nav-link" href="#games"><Icon>◇</Icon><b>GAMES</b></a>
          <a className="nav-link" href="#mission"><Icon>◎</Icon><b>MISSIONS</b></a>
          <a className="nav-link" href="#profile"><Icon>♙</Icon><b>PROFILE</b></a>
        </nav>
        <div className="profile" id="profile"><div className="avatar">N</div><div><strong>NOVA_7</strong><span>LEVEL 24</span></div></div>
      </aside>
      <section className="content" id="top">
        <header className="topbar">
          <div className="eyebrow"><span className="spark">✦</span> ORBITAL GAME ARCHIVE <i /></div>
          <div className="top-actions"><button className="sound" onClick={() => setSound(!sound)} aria-label="Переключить звук">{sound ? "◖))" : "◖×"}</button><button className="premium">✦&nbsp;&nbsp; GET PREMIUM</button></div>
        </header>
        <div className="hero-copy"><p>SEASON 07&nbsp;&nbsp; / &nbsp;&nbsp;NEW WORLDS ONLINE</p><h1>CHOOSE YOUR<br /><span>DESTINY</span></h1><div className="hero-line"><i /> THREE WORLDS. ONE SIGNAL. <b>YOUR MOVE.</b></div></div>
        <section className="game-grid" id="games" aria-label="Игры">
          {games.map((game) => <button key={game.id} className="game-card" style={{ "--accent":game.accent, "--rgb":game.rgb, "--art":`url(${game.image})` } as React.CSSProperties} onClick={() => setActive(game)} aria-label={`Открыть игру ${game.title}`}>
            <span className="card-art" /><span className="card-shade" /><span className="card-number">{game.number}</span>
            <span className="card-content"><span className="card-kicker">{game.kicker}</span><strong>{game.title}</strong><span className="card-meta"><i>{game.genre}</i><i>{game.players}</i></span></span>
            <span className="launch"><i>▶</i><b>ENTER</b></span>
          </button>)}
        </section>
        <footer id="mission"><div><span>◉</span><b>DAILY MISSION</b><p>Откройте любой мир и проведите в нём 30 минут</p></div><div className="progress"><i><span /></i><b>0 / 30 MIN</b><em>+250 XP</em></div></footer>
      </section>
      {active && <div className="game-view" style={{ "--accent":active.accent, "--rgb":active.rgb, "--art":`url(${active.image})` } as React.CSSProperties} role="dialog" aria-modal="true" aria-label={active.title}>
        <div className="game-bg" /><div className="game-vignette" /><button className="back" onClick={() => setActive(null)}>← &nbsp; BACK TO ARCHIVE</button>
        <div className="game-detail"><span className="game-index">WORLD / {active.number}</span><p>{active.kicker}</p><h2>{active.title}</h2><div className="detail-rule" /><blockquote>{active.description}</blockquote><div className="detail-meta"><span>{active.genre}</span><span>{active.players}</span><span>4K WORLD</span></div><button className="play" onClick={() => alert(`Подключение к миру «${active.title}» установлено`)}><i>▶</i><span>START GAME<small>INITIALIZE CONNECTION</small></span></button></div>
        <div className="signal"><span /><b>SIGNAL STABLE</b><em>98.7%</em></div>
      </div>}
    </main>
  );
}
