import { useState, useEffect } from "react";

const API = "https://venue-ai-933158601741.us-central1.run.app";

export default function App() {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("home");

  // 🧍 create people
  const createPeople = (count, speed = 0.12) =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() - 0.5) * speed,
      dy: (Math.random() - 0.5) * speed,
    }));

  const [zones, setZones] = useState({
    food: createPeople(70, 0.12),
    washroom: createPeople(40, 0.13),
    exit: createPeople(90, 0.14),
  });

  // 🧠 movement loop
  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) => {
        const move = (people) =>
          people.map((p) => {
            let nx = p.x + p.dx;
            let ny = p.y + p.dy;

            if (nx < 0 || nx > 100) p.dx *= -1;
            if (ny < 0 || ny > 100) p.dy *= -1;

            return {
              ...p,
              x: Math.max(0, Math.min(100, nx)),
              y: Math.max(0, Math.min(100, ny)),
            };
          });

        return {
          food: move(prev.food),
          washroom: move(prev.washroom),
          exit: move(prev.exit),
        };
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleIntent = async (intent) => {
    setLoading(true);
    setDecision(null);

    const res = await fetch(`${API}/decision?intent=${intent}`);
    const data = await res.json();

    setDecision(data);
    setLoading(false);
  };

  return (
    <div className="bg-black text-green-400 min-h-screen p-6 relative overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="tracking-widest opacity-70">
          STADIUM AI • LIVE
        </h1>

        <div className="flex gap-3">
          <button onClick={() => setMode("venue")} className="border px-3 py-1 rounded">Full Map 🗺️</button>
          <button onClick={() => setMode("crowd")} className="border px-3 py-1 rounded">Crowd 📊</button>
          <button onClick={() => setMode("chat")} className="border px-3 py-1 rounded">Agent 🤖</button>
        </div>
      </div>

      {/* HOME */}
      {mode === "home" && (
        <>
          <h1 className="text-5xl mb-6">What do you want to do?</h1>

          <div className="flex gap-4 mb-10">
            {["food", "washroom", "exit"].map((intent) => (
              <button
                key={intent}
                onClick={() => handleIntent(intent)}
                className="border px-6 py-3 rounded-xl hover:bg-green-400 hover:text-black transition"
              >
                {intent}
              </button>
            ))}
          </div>

          {loading && <p className="animate-pulse">AI thinking...</p>}

          {decision && (
            <div className="border p-6 rounded-xl max-w-xl">
              <h2 className="text-2xl">{decision.action}</h2>
              <p>{decision.wait_time}</p>
              <p>{decision.reason}</p>

              <button
                onClick={() => setMode("map")}
                className="mt-4 bg-green-400 text-black px-4 py-2 rounded"
              >
                Start Navigation →
              </button>
            </div>
          )}
        </>
      )}

      {/* 🧭 MAP */}
      {mode === "map" && (
        <div className="relative h-[400px] border rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,136,0.2)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="absolute top-1/2 left-10 right-10 h-1 bg-green-400 animate-pulse" />
          <div className="absolute left-8 top-1/2">🟢</div>
          <div className="absolute right-8 top-1/2">🎯</div>

          <button onClick={() => setMode("home")} className="absolute top-3 right-3 border px-2 py-1">
            Back
          </button>
        </div>
      )}

      {/* 📊 CROWD */}
      {mode === "crowd" && (
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: "Food", key: "food" },
            { name: "Restroom", key: "washroom" },
            { name: "Exit", key: "exit" },
          ].map((zone) => (
            <div key={zone.key} className="relative h-[300px] border rounded-xl overflow-hidden">
              <p className="absolute top-2 left-2 text-sm">{zone.name}</p>

              {zones[zone.key].map((p, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* trail */}
                  <div
                    className="absolute w-3 h-3 bg-green-400 opacity-20 blur-md rounded-full"
                    style={{
                      transform: `translate(${-p.dx * 300}%, ${-p.dy * 300}%)`,
                    }}
                  />

                  {/* person */}
                  <div className="text-[14px] drop-shadow-[0_0_6px_rgba(0,255,136,0.7)]">
                    🚶
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 🗺️ FULL VENUE */}
      {mode === "venue" && (
        <div className="relative h-[500px] border rounded-xl overflow-hidden">

          {/* zones layout */}
          <div className="absolute top-10 left-10 w-[30%] h-[40%] border rounded">
            <p className="text-xs">Food</p>
            {zones.food.map((p, i) => (
              <div key={i} className="absolute text-xs" style={{ left: `${p.x}%`, top: `${p.y}%` }}>🚶</div>
            ))}
          </div>

          <div className="absolute top-10 right-10 w-[25%] h-[40%] border rounded">
            <p className="text-xs">Restroom</p>
            {zones.washroom.map((p, i) => (
              <div key={i} className="absolute text-xs" style={{ left: `${p.x}%`, top: `${p.y}%` }}>🚶</div>
            ))}
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[40%] h-[35%] border rounded">
            <p className="text-xs">Exit</p>
            {zones.exit.map((p, i) => (
              <div key={i} className="absolute text-xs" style={{ left: `${p.x}%`, top: `${p.y}%` }}>🚶</div>
            ))}
          </div>

          <button onClick={() => setMode("home")} className="absolute top-3 right-3 border px-2 py-1">
            Back
          </button>
        </div>
      )}

      {/* 🤖 CHAT */}
      {mode === "chat" && (
        <div>
          <p>Ask AI</p>
          <button onClick={() => handleIntent("food")}>Test</button>
          {decision && <p>{decision.action}</p>}
        </div>
      )}
    </div>
  );
}