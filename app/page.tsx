"use client";

import { useEffect, useRef, useState } from "react";

const games = [
  { id:"echoes", number:"01", title:"ECHOES OF DAWN", kicker:"THE LAST LIGHT", description:"Пробудись на краю известной галактики и верни свет миру, который уже перестал надеяться.", image:"/games/echoes-of-dawn.png", genre:"ACTION RPG", players:"SOLO", accent:"#57c9ff", rgb:"87, 201, 255" },
  { id:"shadow", number:"02", title:"SHADOW PROTOCOL", kicker:"TRUST NO SIGNAL", description:"Каждый приказ оставляет след. Раскрой протокол, прежде чем город поглотит красная тьма.", image:"/games/shadow-protocol.png", genre:"DARK ACTION", players:"1–2 PLAYERS", accent:"#ff5362", rgb:"255, 83, 98" },
  { id:"vanguard", number:"03", title:"VOID VANGUARD", kicker:"COMMAND THE UNKNOWN", description:"Собери флот, удержи рубеж и возглавь последнюю армаду в войне за безмолвные звёзды.", image:"/games/void-vanguard.png", genre:"SPACE STRATEGY", players:"MULTIPLAYER", accent:"#b77aff", rgb:"183, 122, 255" },
];
type Game = (typeof games)[number];

const verbPairs = [
  ["build", "built"], ["break", "broke"], ["draw", "drew"],
  ["fall", "fell"], ["find", "found"], ["keep", "kept"], ["meet", "met"],
] as const;

type MemoryCard = { id: string; pair: string; word: string; form: "INFINITIVE" | "PAST SIMPLE" };

function createDeck(): MemoryCard[] {
  return verbPairs
    .flatMap(([infinitive, past]) => [
      { id: `${infinitive}-inf`, pair: infinitive, word: infinitive, form: "INFINITIVE" as const },
      { id: `${infinitive}-past`, pair: infinitive, word: past, form: "PAST SIMPLE" as const },
    ])
    .sort(() => Math.random() - 0.5);
}

function MemoryGame({ onBack }: { onBack: () => void }) {
  const [deck, setDeck] = useState<MemoryCard[]>(createDeck);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const locked = open.length === 2;

  useEffect(() => {
    if (open.length !== 2) return;
    const [first, second] = open.map((id) => deck.find((card) => card.id === id)!);
    if (first.pair === second.pair) {
      setMatched((current) => [...current, first.pair]);
      setOpen([]);
      return;
    }
    const timeout = window.setTimeout(() => setOpen([]), 850);
    return () => window.clearTimeout(timeout);
  }, [open, deck]);

  const choose = (card: MemoryCard) => {
    if (locked || open.includes(card.id) || matched.includes(card.pair)) return;
    setOpen((current) => [...current, card.id]);
    if (open.length === 1) setMoves((current) => current + 1);
  };

  const restart = () => {
    setDeck(createDeck());
    setOpen([]);
    setMatched([]);
    setMoves(0);
  };

  return <div className="memory-view" role="dialog" aria-modal="true" aria-label="Irregular Verbs Memory Game">
    <div className="memory-stars" />
    <button className="memory-back" onClick={onBack}>← &nbsp; BACK TO ARCHIVE</button>
    <header className="memory-header">
      <div><span>TRAINING MODULE / 01</span><h2>VERB <i>MEMORY</i></h2><p>Match the infinitive with its Past Simple form.</p></div>
      <div className="memory-stats"><span>MOVES <b>{String(moves).padStart(2, "0")}</b></span><span>PAIRS <b>{matched.length} / 7</b></span><button onClick={restart}>↻ &nbsp; SHUFFLE</button></div>
    </header>
    <div className="memory-rule"><span style={{ width: `${(matched.length / 7) * 100}%` }} /></div>
    <section className="memory-grid" aria-label="14 игровых карточек">
      {deck.map((card, index) => {
        const visible = open.includes(card.id) || matched.includes(card.pair);
        const isMatched = matched.includes(card.pair);
        return <button key={card.id} className={`memory-card ${visible ? "is-open" : ""} ${isMatched ? "is-matched" : ""}`} onClick={() => choose(card)} aria-label={visible ? `${card.word}, ${card.form}` : `Закрытая карточка ${index + 1}`} aria-pressed={visible}>
          <span className="memory-card-inner">
            <span className="memory-back-face"><i>✦</i><b>{String(index + 1).padStart(2, "0")}</b><em>ASTRA // VERB DATA</em></span>
            <span className="memory-front-face"><small>{card.form}</small><strong>{card.word}</strong><i>{isMatched ? "PAIR LINKED" : "SIGNAL FOUND"}</i></span>
          </span>
        </button>;
      })}
    </section>
    {matched.length === 7 && <div className="memory-win"><span>✦ MISSION COMPLETE ✦</span><h3>ALL PAIRS LINKED</h3><p>You matched all irregular verbs in {moves} moves.</p><button onClick={restart}>PLAY AGAIN</button></div>}
    <div className="memory-signal"><span /> LEARNING SIGNAL STABLE <b>98.7%</b></div>
  </div>;
}

type SentenceSign = "." | "?" | "−";
type PileCard = { verb: string; past: string; complement: string; hint: string; sign: SentenceSign };

const speakingVerbs = [
  { verb: "build", past: "built", complement: "a model" },
  { verb: "break", past: "broke", complement: "a cup" },
  { verb: "draw", past: "drew", complement: "a picture" },
  { verb: "fall", past: "fell", complement: "down" },
  { verb: "find", past: "found", complement: "my phone" },
  { verb: "keep", past: "kept", complement: "a secret" },
  { verb: "meet", past: "met", complement: "my friend" },
] as const;

const speakingHints = ["yesterday", "last weekend", "last night", "at school", "at home", "with my friends", "on Monday", "two days ago", "after school", "during the holidays"];

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function createPile(): PileCard[] {
  const signs = shuffle<SentenceSign>([".", "?", "−", ".", "?", "−", [".", "?", "−"][Math.floor(Math.random() * 3)] as SentenceSign]);
  const hints = shuffle(speakingHints).slice(0, 7);
  return shuffle(speakingVerbs).map((item, index) => ({ ...item, hint: hints[index], sign: signs[index] }));
}

function sentenceExample(card: PileCard): string {
  if (card.sign === "?") return `Did you ${card.verb} ${card.complement} ${card.hint}?`;
  if (card.sign === "−") return `I didn’t ${card.verb} ${card.complement} ${card.hint}.`;
  return `I ${card.past} ${card.complement} ${card.hint}.`;
}

function PileOfCards({ onBack }: { onBack: () => void }) {
  const [deck, setDeck] = useState<PileCard[]>(createPile);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [exampleVisible, setExampleVisible] = useState(false);
  const card = deck[current];

  const next = () => {
    if (current >= deck.length - 1) return;
    setFlipped(false);
    setExampleVisible(false);
    window.setTimeout(() => setCurrent((value) => value + 1), 230);
  };

  const newDeck = () => {
    setDeck(createPile());
    setCurrent(0);
    setFlipped(false);
    setExampleVisible(false);
  };

  return <div className="pile-view" role="dialog" aria-modal="true" aria-label="Past Simple Pile of Cards">
    <div className="pile-space" />
    <button className="pile-back" onClick={onBack}>← &nbsp; BACK TO ARCHIVE</button>
    <header className="pile-header">
      <div><span>SPEAKING MODULE / 02</span><h2>PILE OF <i>CARDS</i></h2><p>Flip the card. Make a Past Simple sentence aloud.</p></div>
      <div className="pile-counter"><small>CARD</small><strong>{current + 1} <i>/</i> 7</strong><span><b style={{ width: `${((current + 1) / 7) * 100}%` }} /></span></div>
    </header>

    <section className="pile-stage">
      <div className="stack-card stack-third" /><div className="stack-card stack-second" />
      <button className={`prompt-card ${flipped ? "is-flipped" : ""}`} onClick={() => !flipped && setFlipped(true)} aria-label={flipped ? `${card.verb}, Past Simple, ${card.sign}, ${card.hint}` : `Перевернуть карточку ${current + 1}`}>
        <span className="prompt-inner">
          <span className="prompt-cover"><small>CLASSIFIED PROMPT</small><strong>{String(current + 1).padStart(2, "0")}</strong><i>TOUCH TO REVEAL</i><em>◆</em></span>
          <span className="prompt-face">
            <span className="prompt-task">{card.verb}</span>
            <span className="prompt-sign">{card.sign === "−" ? "✕" : card.sign}</span>
            <span className="prompt-context">{card.hint}</span>
          </span>
        </span>
      </button>
      <p className="flip-hint">{flipped ? "SAY YOUR SENTENCE ALOUD" : "CLICK THE CARD TO FLIP"}</p>
    </section>

    <div className={`example-panel ${exampleVisible ? "is-visible" : ""}`} aria-live="polite">
      <span>EXAMPLE TRANSMISSION</span><p>{exampleVisible ? sentenceExample(card) : "Example hidden — let the student answer first."}</p>
    </div>

    <div className="pile-actions">
      <button className="deck-button" onClick={newDeck}>↻ &nbsp; NEW DECK</button>
      <button className="example-button" disabled={!flipped} onClick={() => setExampleVisible((value) => !value)}>◎ &nbsp; {exampleVisible ? "HIDE EXAMPLE" : "SHOW EXAMPLE"}</button>
      <button className="next-button" disabled={!flipped || current === deck.length - 1} onClick={next}>{current === deck.length - 1 ? "DECK COMPLETE" : "NEXT CARD"} &nbsp; →</button>
    </div>
    <div className="pile-status"><span /> VOICE CHANNEL OPEN <b>A1+ / A2</b></div>
  </div>;
}

type SaberPrompt = { verb: string; past: string; before: string; after: string; left: string; missing: string; right: string };

const saberPrompts: SaberPrompt[] = [
  { verb:"build", past:"built", before:"We", after:"a snowman yesterday.", left:"b", missing:"ui", right:"lt" },
  { verb:"break", past:"broke", before:"I", after:"my pencil at school.", left:"br", missing:"o", right:"ke" },
  { verb:"draw", past:"drew", before:"She", after:"a funny picture yesterday.", left:"dr", missing:"e", right:"w" },
  { verb:"fall", past:"fell", before:"He", after:"off his bike.", left:"f", missing:"e", right:"ll" },
  { verb:"find", past:"found", before:"I", after:"my phone under the bed.", left:"f", missing:"o", right:"und" },
  { verb:"keep", past:"kept", before:"She", after:"the ticket.", left:"k", missing:"e", right:"pt" },
  { verb:"meet", past:"met", before:"We", after:"our friends after school.", left:"m", missing:"e", right:"t" },
];

function LightsaberSpelling({ onBack }: { onBack: () => void }) {
  const [prompts, setPrompts] = useState<SaberPrompt[]>(() => shuffle(saberPrompts));
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [hint, setHint] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const prompt = prompts[current];
  const complete = solved && current === prompts.length - 1;

  useEffect(() => { if (!solved) inputRef.current?.focus(); }, [current, solved]);

  const check = () => {
    if (solved || !answer) return;
    if (answer.trim().toLowerCase() === prompt.missing) {
      setSolved(true);
      setWrong(false);
      setHint("");
      return;
    }
    setWrong(true);
    setAnswer("");
    window.setTimeout(() => { setWrong(false); inputRef.current?.focus(); }, 430);
  };

  const next = () => {
    if (!solved || current >= prompts.length - 1) return;
    setCurrent((value) => value + 1);
    setAnswer(""); setSolved(false); setWrong(false); setHint("");
  };

  const newGame = () => {
    setPrompts(shuffle(saberPrompts)); setCurrent(0); setAnswer(""); setSolved(false); setWrong(false); setHint("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const showHint = () => {
    if (solved) return;
    setHint(prompt.missing[0]);
    window.setTimeout(() => setHint(""), 1600);
    inputRef.current?.focus();
  };

  return <div className={`saber-view ${wrong ? "is-wrong" : ""} ${solved ? "is-solved" : ""} ${complete ? "is-complete" : ""}`} role="dialog" aria-modal="true" aria-label="Lightsaber Spelling">
    <div className="saber-stars" />
    <button className="saber-back" onClick={onBack}>← &nbsp; BACK TO ARCHIVE</button>
    <div className="saber-progress">{current + 1} <span>/</span> 7</div>

    <section className="saber-stage">
      <div className="saber-hilt"><i /><b /><em /></div>
      <div className="saber-blade">
        <div className="saber-core" />
        <div className="saber-sentence">
          <span>{prompt.before}</span>{" "}
          <strong className="saber-word">
            {solved ? prompt.past : <>{prompt.left}<input ref={inputRef} style={{ "--letters": prompt.missing.length } as React.CSSProperties} value={answer} maxLength={prompt.missing.length} placeholder={hint || "_".repeat(prompt.missing.length)} onChange={(event) => setAnswer(event.target.value.replace(/[^a-zA-Z]/g, "").toLowerCase())} onKeyDown={(event) => event.key === "Enter" && check()} aria-label={`Введите ${prompt.missing.length} пропущенные буквы`} />{prompt.right}</>}
          </strong>{" "}<span>{prompt.after}</span>
        </div>
      </div>
    </section>

    <div className="saber-actions">
      <button onClick={newGame}>↻ &nbsp; NEW GAME</button>
      {!solved && <button onClick={showHint}>HINT</button>}
      {!solved && <button className="saber-check" onClick={check}>CHECK</button>}
      {solved && !complete && <button className="saber-next" onClick={next}>NEXT &nbsp; →</button>}
    </div>

    {complete && <div className="saber-finale"><h2>MISSION COMPLETE</h2><p>7 / 7</p><button onClick={newGame}>NEW GAME</button></div>}
  </div>;
}

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
        </nav>
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
        <div className="library-status"><span />3 MISSIONS AVAILABLE</div>
      </section>
      {active?.id === "echoes" && <MemoryGame onBack={() => setActive(null)} />}
      {active?.id === "shadow" && <PileOfCards onBack={() => setActive(null)} />}
      {active?.id === "vanguard" && <LightsaberSpelling onBack={() => setActive(null)} />}
      {active && active.id !== "echoes" && active.id !== "shadow" && active.id !== "vanguard" && <div className="game-view" style={{ "--accent":active.accent, "--rgb":active.rgb, "--art":`url(${active.image})` } as React.CSSProperties} role="dialog" aria-modal="true" aria-label={active.title}>
        <div className="game-bg" /><div className="game-vignette" /><button className="back" onClick={() => setActive(null)}>← &nbsp; BACK TO ARCHIVE</button>
        <div className="game-detail"><span className="game-index">WORLD / {active.number}</span><p>{active.kicker}</p><h2>{active.title}</h2><div className="detail-rule" /><blockquote>{active.description}</blockquote><div className="detail-meta"><span>{active.genre}</span><span>{active.players}</span><span>4K WORLD</span></div><button className="play" onClick={() => alert(`Подключение к миру «${active.title}» установлено`)}><i>▶</i><span>START GAME<small>INITIALIZE CONNECTION</small></span></button></div>
        <div className="signal"><span /><b>SIGNAL STABLE</b><em>98.7%</em></div>
      </div>}
    </main>
  );
}
