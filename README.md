# 🏟️ Stadium AI

### Real-Time Crowd Intelligence for Physical Spaces

---

## 🚀 Why this exists

Every large event has the same problem:

You decide to grab food →
You walk there →
You realize the line is insane →
Now you’ve wasted 15 minutes.

There is **no system today that helps people make smarter decisions inside crowded venues**.

---

## 💡 What this project does

Stadium AI is a **decision + navigation system** that helps users choose *where to go* based on **live crowd conditions**, not guesswork.

Instead of just showing directions, it answers:

* *“Where should I go right now?”*
* *“Which option will save me time?”*
* *“What’s the fastest way out?”*

---

## ⚙️ How it works

```text
User intent → Decision API → Best option (with reasoning)
                                ↓
                        Navigation layer
                                ↓
                   Optional → Google Maps routing
```

---

## 🔑 Core Features

### 🧠 Intelligent Decision Layer

* Takes user intent (food, restroom, exit)
* Returns:

  * Optimal choice
  * Estimated wait time
  * Context-aware reasoning

---

### 🚶 Dynamic Crowd Simulation

* Moving agents represent crowd flow
* Helps visualize congestion in real time
* Makes the system feel *alive*, not static

---

### 🗺️ Navigation System

* Shows:

  * User position (via GPS)
  * Target destination
  * Path between them

---

### 🌍 Real-World Integration

* One-click → open in Google Maps
* Connects prototype to real usability

---

## 🎯 What makes this different

Most projects:

* Show maps
* Show data

This project:

* **Helps you decide**
* Then **guides you there**

👉 It combines:

* Decision-making
* Visualization
* Navigation

in one flow.

---

## 🧪 Demo Flow (30 seconds)

1. Select “Food”
2. System suggests the least crowded option
3. Click **Start Navigation**
4. View path on stadium map
5. Open in **Google Maps**

---

## 🛠️ Tech Stack

* React + Tailwind (Frontend)
* FastAPI (Backend decision engine)
* Google Cloud Run (Deployment)
* Browser Geolocation API

---

## 📈 Why this matters

This idea can scale to:

* Stadiums
* Airports
* Malls
* Festivals

Anywhere crowd decisions matter.

---

##  Future Scope

* Real sensor-based crowd data
* Heatmaps + predictive congestion
* Indoor positioning
* Multi-user coordination

---

##  Built By

Saara

---

## 🏁 Vision

This isn’t just navigation.

It’s a **decision layer for real-world environments** —
helping people move smarter, not just faster.
