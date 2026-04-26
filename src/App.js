import { useState, useEffect } from "react";

const API = "https://venue-ai-933158601741.us-central1.run.app";

/* 🧍 PERSON WITH TRAIL */
const Person = ({ x, y }) => (
  <div
    className="absolute transition-all duration-[2800ms] ease-[cubic-bezier(.22,1,.36,1)]"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <div className="relative">
      {/* glow trail */}
      <div className="absolute w-6 h-6 bg-green-400/20 blur-xl rounded-full animate-pulse" />
      <div className="text-sm drop-shadow-[0_0_8px_rgba(0,255,136,0.9)] animate-float">
        🚶
      </div>
    </div>
  </div>
);

/* 🧠 SMART CROWD */
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
        prev.map((p) => {
          // attraction zones
          const targets = [
            { x: 15, y: 30 }, // food
            { x: 80, y: 25 }, // restroom
            { x: 50, y: 85 }, // exit
          ];
          const target = targets[Math.floor(Math.random() * targets.length)];

          return {
            x: Math.max(
              2,
              Math.min(98, p.x + (target.x - p.x) * 0.08 + (Math.random() - 0.5) * 2)
            ),
            y: Math.max(
              2,
              Math.min(98, p.y + (target.y - p.y) * 0.08 + (Math.random() - 0.5) * 2)
            ),
          };
        })
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
  const [cursor, setCursor] = useState({ x: 50, y: 50 });

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
    <div
      onMouseMove={(e) => {
        setCursor({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }}
      className="bg-black text-green-400 min-h-screen p-6 font-sans relative overflow-hidden"
    >
      {/* 🌌 REACTIVE BACKGROUND */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: `
            radial-gradient(circle at ${cursor.x}% ${cursor.y}%, rgba(0,255,136,0.15), transparent 40%),
            radial-gradient(circle at 80% 60%, rgba(0,255,136,0.05), transparent 40%)
          `,
        }}
      />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-12 relative z-10">
        <h1 className="text-xl tracking-[0.3em] opacity-70 animate-glow">
          STADIUM AI • LIVE
        </h1>

        <div className="flex gap-3">
          {mode !== "home" && (
            <button
              onClick={() => setMode("home")}
              className="btn"
            >
              Back
            </button>
          )}

          <button onClick={() => setMode("crowd")} className="btn">
            Crowd 📊
          </button>
          <button onClick={() => setMode("fullmap")} className="btn">
            Map 🗺️
          </button>
          <button onClick={() => setMode("chat")} className="btn">
            Agent 🤖
          </button>
        </div>
      </div>

      {/* 🏠 HOME */}
      {mode === "home" && (
        <div className="relative z-10 animate-fadeIn">
          <h1 className="text-6xl font-bold mb-12 leading-tight">
            What do you want to do?
          </h1>

          <div className="flex gap-8">
            {[
              { key: "food", label: "🍔 Food" },
              { key: "washroom", label: "🚻 Restroom" },
              { key: "exit", label: "🚪 Exit" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleIntent(item.key)}
                className="card-btn"
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading && <p className="mt-6 animate-pulse">🤖 Thinking...</p>}

          {decision && (
            <div className="glass-card mt-10 max-w-xl">
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

      {/* 📊 CROWD */}
      {mode === "crowd" && (
        <div className="grid grid-cols-3 gap-10 relative z-10 animate-fadeIn">
          {["Food", "Restroom", "Exit"].map((zone, i) => (
            <div key={i} className="flex flex-col items-center">

              <div className="map-card">
                {people.slice(i * 40, i * 40 + 40).map((p, idx) => (
                  <Person key={idx} {...p} />
                ))}
              </div>

              <p className="mt-4 text-lg opacity-70">{zone}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🗺️ FULL MAP */}
      {mode === "fullmap" && (
        <div className="map-big animate-fadeIn">

          <div className="zone left-[10%] top-[30%]" />
          <div className="zone right-[15%] top-[25%]" />
          <div className="zone left-[35%] bottom-[10%]" />

          <div className="absolute left-[10%] top-[25%]">🍔 Food</div>
          <div className="absolute right-[15%] top-[20%]">🚻 Restroom</div>
          <div className="absolute left-[40%] bottom-[5%]">🚪 Exit</div>

          {people.map((p, i) => (
            <Person key={i} {...p} />
          ))}
        </div>
      )}

      {/* 🤖 CHAT */}
      {mode === "chat" && (
        <div className="max-w-2xl mx-auto relative z-10 animate-fadeIn">
          <div className="glass-card">

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

                  try {
                    const res = await fetch(`${API}/decision?intent=${query}`);
                    const data = await res.json();
                    setDecision(data);
                  } catch {
                    setDecision({ action: "Error", reason: "Try again" });
                  }

                  setLoading(false);
                }
              }}
            />

            {loading && <p>🤖 Thinking...</p>}

            {decision && (
              <div className="mt-4">
                <h3>{decision.action}</h3>
                <p className="opacity-70">{decision.reason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}