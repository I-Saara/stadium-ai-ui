import { useState, useEffect } from "react";

const API = "https://venue-ai-933158601741.us-central1.run.app";

/* 🧍 PERSON */
const Person = ({ x, y }) => (
  <div
    className="absolute text-sm transition-all duration-[3000ms] ease-linear"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    🚶
  </div>
);

/* 🧠 PEOPLE */
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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return people;
};

export default function App() {
  const [mode, setMode] = useState("home");
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [target, setTarget] = useState(null);

  const people = usePeople(120);

  /* 📍 GET USER LOCATION */
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          x: (pos.coords.longitude % 1) * 100,
          y: (pos.coords.latitude % 1) * 100,
        });
      },
      () => alert("Please allow location access")
    );
  };

  /* 🎯 HANDLE INTENT */
  const handleIntent = async (intent) => {
    setLoading(true);
    setDecision(null);

    try {
      const res = await fetch(`${API}/decision?intent=${intent}`);
      const data = await res.json();
      setDecision(data);

      if (intent === "food") setTarget({ x: 15, y: 30 });
      if (intent === "washroom") setTarget({ x: 80, y: 25 });
      if (intent === "exit") setTarget({ x: 50, y: 85 });

    } catch {
      setDecision({
        action: "Error",
        reason: "Try again",
        wait_time: "-",
        timing: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-green-400 min-h-screen p-6 font-sans">

      {/* HEADER */}
      <div className="flex justify-between mb-10">
        <h1 className="tracking-widest">STADIUM AI</h1>

        <div className="flex gap-3">
          <button onClick={() => setMode("crowd")} className="btn">Crowd</button>
          <button onClick={() => setMode("fullmap")} className="btn">Map</button>
          <button onClick={() => setMode("chat")} className="btn">Agent</button>
        </div>
      </div>

      {/* HOME */}
      {mode === "home" && (
        <div className="flex flex-col items-center text-center">

          <h1 className="text-5xl mb-10">What do you want?</h1>

          <div className="flex gap-6">
            <button onClick={() => handleIntent("food")} className="card-btn">🍔 Food</button>
            <button onClick={() => handleIntent("washroom")} className="card-btn">🚻 Restroom</button>
            <button onClick={() => handleIntent("exit")} className="card-btn">🚪 Exit</button>
          </div>

          {loading && <p className="mt-6">Thinking...</p>}

          {decision && (
            <div className="mt-12 flex justify-center w-full">
              <div className="glass-card max-w-xl text-center">

                <h2 className="text-2xl mb-2">{decision.action}</h2>
                <p className="text-sm opacity-70 mb-2">
                  ⏱ {decision.wait_time} • {decision.timing}
                </p>
                <p className="mb-6">{decision.reason}</p>

                {/* 🚀 NAV BUTTONS */}
                <div className="flex gap-4 justify-center">

                  {/* INTERNAL NAV */}
                  <button
                    onClick={() => {
                      getLocation();
                      setMode("fullmap");
                    }}
                    className="px-6 py-3 bg-green-400 text-black rounded-lg hover:scale-105 transition"
                  >
                    🚀 Start Navigation
                  </button>

                  {/* GOOGLE MAPS */}
                  <button
                    onClick={() => {
                      if (!target) return;

                      const baseLat = 28.6139;
                      const baseLng = 77.2090;

                      const lat = baseLat + (target.y - 50) * 0.0005;
                      const lng = baseLng + (target.x - 50) * 0.0005;

                      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                      window.open(url, "_blank");
                    }}
                    className="px-6 py-3 border border-green-400 rounded-lg hover:bg-green-400 hover:text-black transition"
                  >
                    🌍 Open Maps
                  </button>

                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* 🗺️ MAP */}
      {mode === "fullmap" && (
        <div className="relative h-[600px] border border-green-400 rounded-xl overflow-hidden">

          {/* zones */}
          <div className="absolute left-[10%] top-[25%]">🍔</div>
          <div className="absolute right-[15%] top-[20%]">🚻</div>
          <div className="absolute left-[40%] bottom-[5%]">🚪</div>

          {/* people */}
          {people.map((p, i) => (
            <Person key={i} {...p} />
          ))}

          {/* USER */}
          {userPos && (
            <div
              className="absolute text-xl"
              style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
            >
              🧍
            </div>
          )}

          {/* TARGET */}
          {target && (
            <div
              className="absolute text-xl"
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
            >
              🎯
            </div>
          )}

          {/* PATH */}
          {userPos && target && (
            <svg className="absolute w-full h-full">
              <line
                x1={`${userPos.x}%`}
                y1={`${userPos.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="#00ff88"
                strokeWidth="3"
                strokeDasharray="8"
              />
            </svg>
          )}
        </div>
      )}

      {/* CROWD */}
      {mode === "crowd" && (
        <div className="grid grid-cols-3 gap-6">
          {["Food", "Restroom", "Exit"].map((z, i) => (
            <div key={i} className="border p-4 h-[200px] relative">
              {people.slice(i * 30, i * 30 + 30).map((p, idx) => (
                <Person key={idx} {...p} />
              ))}
              <p className="mt-2 text-center">{z}</p>
            </div>
          ))}
        </div>
      )}

      {/* CHAT */}
      {mode === "chat" && (
        <div className="max-w-xl mx-auto">
          <input
            className="w-full p-3 bg-black border border-green-400"
            placeholder="Ask something..."
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                const res = await fetch(`${API}/decision?intent=${e.target.value}`);
                const data = await res.json();
                setDecision(data);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}