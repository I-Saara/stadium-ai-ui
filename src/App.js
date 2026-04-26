import { useState, useEffect } from "react";

const API = "https://venue-ai-933158601741.us-central1.run.app";

/* 🧍 PERSON WITH MICRO ANIMATION */
const Person = ({ x, y }) => (
  <div
    className="absolute text-[14px] transition-all duration-[2800ms] ease-linear animate-pulse"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      filter: "drop-shadow(0 0 6px rgba(0,255,136,0.6))",
    }}
  >
    🚶
  </div>
);

/* 🌌 FLOATING BACKGROUND PARTICLES */
const Particles = () => {
  const dots = Array.from({ length: 25 });

  return dots.map((_, i) => (
    <div
      key={i}
      className="absolute w-1 h-1 bg-green-400/40 rounded-full animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${10 + Math.random() * 10}s`,
      }}
    />
  ));
};

/* 🧠 PEOPLE ENGINE */
const usePeople = (count = 120) => {
  const [people, setPeople] = useState(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPeople((prev) =>
        prev.map((p) => ({
          x: Math.max(2, Math.min(98, p.x + (Math.random() - 0.5) * 5)),
          y: Math.max(2, Math.min(98, p.y + (Math.random() - 0.5) * 5)),
        }))
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return people;
};

export default function App() {
  const [mode, setMode] = useState("home");
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);

  const people = usePeople(120);

  const handleIntent = async (intent) => {
    setLoading(true);
    setDecision(null);

    const res = await fetch(`${API}/decision?intent=${intent}`);
    const data = await res.json();

    setDecision(data);
    setLoading(false);
  };

  return (
    <div className="bg-black text-green-400 min-h-screen p-6 font-sans relative overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <Particles />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,136,0.1),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(0,255,136,0.06),transparent_40%)] animate-pulse" />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12 relative z-10">

        <h1 className="text-xl tracking-[0.35em] opacity-70 hover:opacity-100 transition">
          STADIUM AI • LIVE
        </h1>

        <div className="flex gap-4">

          {mode !== "home" && (
            <button onClick={() => setMode("home")} className="btn">
              Back
            </button>
          )}

          <button onClick={() => setMode("crowd")} className="btn">Crowd 📊</button>
          <button onClick={() => setMode("fullmap")} className="btn">Map 🗺️</button>
          <button onClick={() => setMode("chat")} className="btn">Agent 🤖</button>

        </div>
      </div>

      {/* HOME */}
      {mode === "home" && (
        <div className="relative z-10 animate-fadeIn">
          <h1 className="text-6xl font-bold mb-10 leading-tight">
            What do you want to do?
          </h1>

          <div className="flex gap-6">
            {[
              { key: "food", label: "🍔 Food" },
              { key: "washroom", label: "🚻 Restroom" },
              { key: "exit", label: "🚪 Exit" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleIntent(item.key)}
                className="btn-big"
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading && (
            <p className="mt-6 animate-pulse">🤖 AI is thinking...</p>
          )}

          {decision && (
            <div className="mt-10 p-8 rounded-2xl border border-green-400/20 bg-green-400/5 shadow-[0_0_60px_rgba(0,255,136,0.2)] animate-fadeIn">
              <h2 className="text-3xl font-semibold mb-2">
                {decision.action}
              </h2>
              <p className="text-sm opacity-70 mb-2">
                ⏱ {decision.wait_time} • {decision.timing}
              </p>
              <p className="opacity-70">{decision.reason}</p>
            </div>
          )}
        </div>
      )}

      {/* CROWD */}
      {mode === "crowd" && (
        <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto animate-fadeIn">

          {["Food", "Restroom", "Exit"].map((zone, i) => (
            <div key={i} className="flex flex-col items-center">

              <div className="card">
                {people.slice(i * 40, i * 40 + 40).map((p, idx) => (
                  <Person key={idx} {...p} />
                ))}
              </div>

              <p className="mt-5 text-lg text-green-300">
                {zone}
              </p>

            </div>
          ))}
        </div>
      )}

      {/* MAP */}
      {mode === "fullmap" && (
        <div className="max-w-6xl mx-auto animate-fadeIn">

          <h2 className="text-3xl mb-6 text-center text-green-300">
            Live Stadium Map
          </h2>

          <div className="map">

            <div className="zone left-[12%] top-[30%]" />
            <div className="zone right-[12%] top-[25%]" />
            <div className="zone left-[40%] bottom-[8%]" />

            <div className="label left-[12%] top-[25%]">🍔 Food</div>
            <div className="label right-[12%] top-[20%]">🚻 Restroom</div>
            <div className="label left-[40%] bottom-[5%]">🚪 Exit</div>

            {people.map((p, i) => (
              <Person key={i} {...p} />
            ))}

          </div>
        </div>
      )}

      {/* CHAT */}
      {mode === "chat" && (
        <div className="max-w-2xl mx-auto animate-fadeIn">

          <div className="card p-8">

            <p className="text-xs opacity-50 mb-2">AI ENGINE</p>
            <h2 className="text-2xl mb-4">Ask anything</h2>

            <input
              type="text"
              placeholder="Where is least crowded?"
              className="input"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const query = e.target.value;
                  e.target.value = "";

                  setLoading(true);

                  const res = await fetch(`${API}/decision?intent=${query}`);
                  const data = await res.json();

                  setDecision(data);
                  setLoading(false);
                }
              }}
            />

            {loading && <p className="animate-pulse mt-4">🤖 Thinking...</p>}

            {decision && (
              <div className="mt-6 p-5 rounded-xl bg-green-400/10 border border-green-400/20">
                <h3 className="text-xl">{decision.action}</h3>
                <p className="text-sm opacity-70">
                  ⏱ {decision.wait_time} • {decision.timing}
                </p>
                <p className="opacity-70">{decision.reason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}