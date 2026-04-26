import { useState, useEffect } from "react";

const API = "https://venue-ai-933158601741.us-central1.run.app";

/* 🧍 PERSON */
const Person = ({ x, y }) => (
  <div
    className="absolute text-[14px] transition-all duration-[3000ms] ease-linear drop-shadow-[0_0_6px_rgba(0,255,136,0.6)]"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    🚶
  </div>
);

/* 🧠 PEOPLE HOOK */
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
          x: Math.max(2, Math.min(98, p.x + (Math.random() - 0.5) * 6)),
          y: Math.max(2, Math.min(98, p.y + (Math.random() - 0.5) * 6)),
        }))
      );
    }, 3000);

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

    try {
      const res = await fetch(`${API}/decision?intent=${intent}`);
      const data = await res.json();
      setDecision(data);
    } catch {
      setDecision({
        action: "Error",
        reason: "Could not fetch decision",
        wait_time: "-",
        timing: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-green-400 min-h-screen p-6 font-sans relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,136,0.08),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(0,255,136,0.05),transparent_40%)]" />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <h1 className="text-xl tracking-[0.3em] opacity-70">
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

      {/* HOME */}
      {mode === "home" && (
        <div className="relative z-10 flex flex-col items-center text-center">

          <h1 className="text-6xl font-bold mb-12 leading-tight">
            What do you want to do?
          </h1>

          {/* BUTTONS */}
          <div className="flex justify-center gap-8">
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

          {/* LOADING */}
          {loading && (
            <p className="mt-6 animate-pulse">🤖 AI is thinking...</p>
          )}

          {/* RESPONSE */}
          {decision && (
            <div className="mt-16 flex justify-center w-full">
              <div className="p-8 rounded-2xl border border-green-400/20 backdrop-blur-xl bg-green-400/5 shadow-[0_0_50px_rgba(0,255,136,0.2)] max-w-xl text-center animate-fadeIn">

                <h2 className="text-3xl font-semibold mb-2">
                  {decision.action}
                </h2>

                <p className="text-sm opacity-70 mb-2">
                  ⏱ {decision.wait_time} • {decision.timing}
                </p>

                <p className="opacity-70">
                  {decision.reason}
                </p>

              </div>
            </div>
          )}

        </div>
      )}

      {/* CROWD */}
      {mode === "crowd" && (
        <div className="grid grid-cols-3 gap-10 relative z-10">
          {["Food", "Restroom", "Exit"].map((zone, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-full h-[300px] rounded-2xl border border-green-400/20 bg-green-400/5 backdrop-blur-xl overflow-hidden relative">
                {people.slice(i * 30, i * 30 + 30).map((p, idx) => (
                  <Person key={idx} {...p} />
                ))}
              </div>
              <p className="mt-4 text-lg opacity-70">{zone}</p>
            </div>
          ))}
        </div>
      )}

      {/* MAP */}
      {mode === "fullmap" && (
        <div className="relative h-[600px] rounded-3xl border border-green-400/20 bg-black/60 backdrop-blur-xl overflow-hidden">

          <div className="absolute left-[10%] top-[25%]">🍔 Food</div>
          <div className="absolute right-[15%] top-[20%]">🚻 Restroom</div>
          <div className="absolute left-[40%] bottom-[5%]">🚪 Exit</div>

          {people.map((p, i) => (
            <Person key={i} {...p} />
          ))}
        </div>
      )}

      {/* CHAT */}
      {mode === "chat" && (
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="p-6 rounded-2xl border border-green-400/20 backdrop-blur-xl bg-green-400/5">

            <h2 className="text-2xl mb-4">Ask anything</h2>

            <input
              type="text"
              placeholder="Where is least crowded?"
              className="w-full p-3 rounded-lg bg-black border border-green-400/20 mb-4"
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

            {loading && <p>Thinking...</p>}

            {decision && (
              <div className="mt-4">
                <h3>{decision.action}</h3>
                <p>{decision.reason}</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}