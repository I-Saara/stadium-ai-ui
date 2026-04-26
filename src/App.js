import { useState, useEffect } from "react";

const API = "https://venue-ai-933158601741.us-central1.run.app";

export default function App() {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("home");
  const [people, setPeople] = useState([]);

  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const avatars = ["🚶", "🧍", "🏃"];

  // 🟢 Initialize people
  useEffect(() => {
    const initial = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      group: Math.floor(Math.random() * 3),
    }));
    setPeople(initial);
  }, []);

  // 🔥 Movement logic (towards zones)
  useEffect(() => {
    const interval = setInterval(() => {
      setPeople((prev) =>
        prev.map((p) => {
          const targets = [
            { x: 20, y: 40 }, // Food
            { x: 50, y: 80 }, // Washroom
            { x: 85, y: 50 }, // Exit
          ];

          const target = targets[p.group];

          const dx = (target.x - p.x) * 0.02;
          const dy = (target.y - p.y) * 0.02;

          let newX = p.x + dx + (Math.random() - 0.5) * 0.3;
          let newY = p.y + dy + (Math.random() - 0.5) * 0.3;

          if (
            Math.abs(newX - target.x) < 2 &&
            Math.abs(newY - target.y) < 2
          ) {
            return {
              ...p,
              x: Math.random() * 100,
              y: Math.random() * 100,
            };
          }

          return { ...p, x: newX, y: newY };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 🎯 Intent button → API
  const handleIntent = async (intent) => {
    setLoading(true);
    setDecision(null);

    try {
      const res = await fetch(`${API}/decision?intent=${intent}`);
      const data = await res.json();
      setDecision(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // 🤖 Chat → API
  const handleChat = async () => {
    if (!message) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");

    try {
      let intent = "food";
      if (message.toLowerCase().includes("exit")) intent = "exit";
      if (message.toLowerCase().includes("wash")) intent = "washroom";

      const res = await fetch(`${API}/decision?intent=${intent}`);
      const data = await res.json();

      const aiMsg = {
        role: "ai",
        text: `${data.action}. ${data.reason}`,
      };

      setChat((prev) => [...prev, aiMsg]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong." },
      ]);
    }
  };

  return (
    <div className="bg-black text-green-400 min-h-screen p-6 font-sans overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl opacity-70 tracking-widest">
          STADIUM AI • LIVE
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setMode("crowd")}
            className="border border-green-400 px-3 py-1 rounded hover:bg-green-400 hover:text-black transition"
          >
            Crowd Map 📊
          </button>

          <button
            onClick={() => setMode("chat")}
            className="border border-green-400 px-3 py-1 rounded hover:bg-green-400 hover:text-black transition"
          >
            Ask Agent 🤖
          </button>
        </div>
      </div>

      {/* HOME */}
      {mode === "home" && (
        <>
          <h1 className="text-5xl mb-6 font-semibold">
            What do you want to do?
          </h1>

          <div className="flex gap-4 mb-8">
            {["food", "washroom", "exit"].map((intent) => (
              <button
                key={intent}
                onClick={() => handleIntent(intent)}
                className="border border-green-400 px-6 py-3 rounded-xl hover:bg-green-400 hover:text-black transition hover:scale-105"
              >
                {intent === "food" && "🍔 Food"}
                {intent === "washroom" && "🚻 Restroom"}
                {intent === "exit" && "🚪 Exit"}
              </button>
            ))}
          </div>

          {loading && (
            <p className="animate-pulse text-lg">🤖 AI is thinking...</p>
          )}

          {decision && (
            <div className="border border-green-400 p-6 rounded-xl shadow-lg shadow-green-400/20 max-w-xl animate-fadeIn">
              <p className="text-sm opacity-70 mb-2">AI DECISION ENGINE</p>

              <h2 className="text-3xl mb-2 font-semibold">
                {decision.action}
              </h2>

              <div className="flex gap-4 text-sm">
                <p>⏱ {decision.wait_time}</p>
                <p>{decision.timing}</p>
              </div>

              <p className="opacity-70 mt-2">{decision.reason}</p>

              <button
                onClick={() => setMode("map")}
                className="mt-4 bg-green-400 text-black px-4 py-2 rounded hover:scale-105 transition"
              >
                Start Navigation →
              </button>
            </div>
          )}
        </>
      )}

      {/* MAP */}
      {mode === "map" && (
        <div className="relative h-[400px] border border-green-400 rounded-xl overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,136,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />

          <div className="absolute top-1/2 left-10 right-10 h-1 bg-green-400 animate-pulse" />

          <div className="absolute top-1/2 left-8 text-xl">🟢</div>
          <div className="absolute top-1/2 right-8 text-xl">🎯</div>

          <p className="absolute bottom-3 left-3 text-sm">
            Navigating via least crowded route
          </p>

          <button
            onClick={() => setMode("home")}
            className="absolute top-3 right-3 border px-2 py-1 rounded"
          >
            Back
          </button>
        </div>
      )}

      {/* CROWD MAP */}
      {mode === "crowd" && (
        <>
          <h2 className="text-2xl mb-6">Live Crowd Zones</h2>

          <div className="grid grid-cols-3 gap-6 mb-6">
            {["Food", "Washroom", "Exit"].map((zone, index) => (
              <div
                key={zone}
                className="relative h-64 border border-gray-300 rounded-xl overflow-hidden"
              >
                <p className="absolute top-2 left-3 text-sm">{zone}</p>

                {people
                  .filter((_, i) => i % 3 === index)
                  .map((p, i) => (
                    <div
                      key={i}
                      className="absolute text-xs"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        transform: "translate(-50%, -50%)",
                        transition: "linear 0.05s",
                      }}
                    >
                      {avatars[i % avatars.length]}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <button
            onClick={() => setMode("home")}
            className="border border-green-400 px-6 py-2 rounded w-full"
          >
            Back
          </button>
        </>
      )}

      {/* CHAT */}
      {mode === "chat" && (
        <div className="max-w-xl mx-auto">

          <h2 className="text-2xl mb-4">Ask AI Agent 🤖</h2>

          <div className="border border-green-400/30 p-4 rounded h-72 overflow-y-auto mb-3 bg-black/50">

            {chat.length === 0 && (
              <p className="opacity-50">
                Ask things like “Should I go now?” or “Where is less crowded?”
              </p>
            )}

            {chat.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-green-400 text-black"
                      : "border border-green-400"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 p-2 bg-black border border-green-400/30 rounded"
            />
            <button
              onClick={handleChat}
              className="bg-green-400 text-black px-4 rounded"
            >
              Send
            </button>
          </div>

          <button
            onClick={() => setMode("home")}
            className="mt-4 border px-3 py-1 rounded"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}