import { useState } from "react";

const API = "https://venue-ai-933158601741.us-central1.run.app";

export default function App() {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("home");

  const handleIntent = async (intent) => {
    setLoading(true);
    setDecision(null);

    const res = await fetch(`${API}/decision?intent=${intent}`);
    const data = await res.json();

    setDecision(data);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* 🌌 BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,150,0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(0,255,150,0.1),transparent_40%)] animate-pulse" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <h1 className="text-sm tracking-[0.3em] text-green-400 opacity-80">
          STADIUM AI • LIVE
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setMode("crowd")}
            className="px-4 py-2 rounded-xl border border-green-400/40 hover:bg-green-400/10 transition backdrop-blur-md"
          >
            Crowd Map 📊
          </button>

          <button
            onClick={() => setMode("chat")}
            className="px-4 py-2 rounded-xl border border-green-400/40 hover:bg-green-400/10 transition backdrop-blur-md"
          >
            Ask Agent 🤖
          </button>
        </div>
      </div>

      {/* HOME */}
      {mode === "home" && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-16">

          <h1 className="text-6xl font-semibold leading-tight mb-6 bg-gradient-to-r from-green-300 to-green-500 text-transparent bg-clip-text">
            What do you want to do?
          </h1>

          {/* BUTTONS */}
          <div className="flex gap-6 mb-12">
            {[
              { key: "food", label: "🍔 Food" },
              { key: "washroom", label: "🚻 Restroom" },
              { key: "exit", label: "🚪 Exit" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleIntent(item.key)}
                className="relative group px-8 py-4 rounded-2xl border border-green-400/30 backdrop-blur-xl 
                hover:scale-110 transition duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-green-400/10 opacity-0 group-hover:opacity-100 transition" />
                <span className="relative text-lg">{item.label}</span>
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading && (
            <p className="animate-pulse text-green-400">
              🤖 AI is analyzing crowd patterns...
            </p>
          )}

          {/* DECISION CARD */}
          {decision && (
            <div className="relative w-[500px] p-[1px] rounded-3xl bg-gradient-to-r from-green-400/40 to-transparent animate-fadeIn">

              <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-8 border border-green-400/20 shadow-[0_0_60px_rgba(0,255,136,0.2)]">

                <p className="text-xs tracking-widest opacity-50 mb-2">
                  AI DECISION ENGINE
                </p>

                <h2 className="text-4xl font-bold text-green-300 mb-3">
                  {decision.action}
                </h2>

                <div className="flex justify-center gap-6 text-sm opacity-80 mb-3">
                  <span>⏱ {decision.wait_time}</span>
                  <span className="text-green-400">{decision.timing}</span>
                </div>

                <p className="opacity-60 mb-6">
                  {decision.reason}
                </p>

                <button
                  onClick={() => setMode("map")}
                  className="bg-gradient-to-r from-green-400 to-green-300 text-black px-6 py-3 rounded-xl font-semibold 
                  hover:scale-105 transition shadow-[0_0_25px_rgba(0,255,136,0.4)]"
                >
                  Start Navigation →
                </button>

              </div>
            </div>
          )}
        </div>
      )}

      {/* 🧭 MAP */}
      {mode === "map" && (
        <div className="relative z-10 flex flex-col items-center mt-16">

          <div className="relative w-[600px] h-[400px] rounded-2xl border border-green-400/30 overflow-hidden backdrop-blur-xl">

            {/* GRID */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,136,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* PATH */}
            <div className="absolute top-1/2 left-10 right-10 h-1 bg-green-400 animate-pulse" />

            <div className="absolute left-8 top-1/2 text-xl">🟢</div>
            <div className="absolute right-8 top-1/2 text-xl">🎯</div>

            <p className="absolute bottom-3 left-3 text-sm opacity-70">
              Navigating via optimal route
            </p>
          </div>

          <button
            onClick={() => setMode("home")}
            className="mt-6 px-6 py-2 border rounded-xl hover:bg-green-400/10 transition"
          >
            Back
          </button>
        </div>
      )}

      {/* 📊 CROWD */}
      {mode === "crowd" && (
        <div className="relative z-10 flex flex-col items-center mt-10">

          <h2 className="text-3xl mb-6 text-green-300">
            Live Crowd Zones
          </h2>

          <div className="flex gap-6">
            {["Food Court", "Restrooms", "Exit"].map((zone) => (
              <div key={zone}
                className="w-64 h-64 border border-green-400/30 rounded-2xl relative overflow-hidden backdrop-blur-xl"
              >
                <p className="absolute top-2 left-3 text-sm opacity-70">
                  {zone}
                </p>

                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-xs animate-pulse"
                    style={{
                      left: Math.random() * 220,
                      top: Math.random() * 220,
                    }}
                  >
                    🚶
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={() => setMode("home")}
            className="mt-6 px-6 py-2 border rounded-xl hover:bg-green-400/10 transition"
          >
            Back
          </button>
        </div>
      )}

      {/* 🤖 CHAT */}
      {mode === "chat" && (
        <div className="relative z-10 flex justify-center mt-16">

          <div className="w-[500px] p-[1px] rounded-3xl bg-gradient-to-r from-green-400/40 to-transparent">

            <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-6 border border-green-400/20">

              <p className="text-sm opacity-70 mb-3">
                Ask anything about navigation
              </p>

              <input
                placeholder="Where should I go right now?"
                className="w-full p-3 rounded-xl bg-black border border-green-400/30 mb-4 outline-none"
              />

              <button
                onClick={() => handleIntent("food")}
                className="w-full bg-green-400 text-black py-2 rounded-xl font-semibold hover:scale-105 transition"
              >
                Ask AI →
              </button>

              {decision && (
                <p className="mt-4 text-green-300">
                  {decision.action}
                </p>
              )}

              <button
                onClick={() => setMode("home")}
                className="mt-4 text-sm opacity-60 hover:opacity-100"
              >
                ← Back
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}