"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

type Personality = "Sweet Enthusiast" | "Zen Minimalist" | "Health Nut" | "Indulgent Treat";

interface Option {
  emoji: string;
  label: string;
  personality: Personality;
}

interface Question {
  question: string;
  options: Option[];
}

const questions: Question[] = [
  {
    question: "It's Saturday morning. What are you doing?",
    options: [
      { emoji: "🧘", label: "Quiet meditation and journaling", personality: "Zen Minimalist" },
      { emoji: "🏃", label: "Early morning run or workout", personality: "Health Nut" },
      { emoji: "🛋️", label: "Cozy Netflix binge", personality: "Sweet Enthusiast" },
      { emoji: "🎉", label: "Brunch with all my friends", personality: "Indulgent Treat" },
    ],
  },
  {
    question: "Pick a Hogwarts house:",
    options: [
      { emoji: "🦅", label: "Ravenclaw (wisdom, logic)", personality: "Zen Minimalist" },
      { emoji: "🦁", label: "Gryffindor (bold, adventurous)", personality: "Health Nut" },
      { emoji: "🦡", label: "Hufflepuff (loyal, warm)", personality: "Sweet Enthusiast" },
      { emoji: "🐍", label: "Slytherin (ambitious, indulgent)", personality: "Indulgent Treat" },
    ],
  },
  {
    question: "Your ideal vacation is:",
    options: [
      { emoji: "🏔️", label: "Solo hiking in the mountains", personality: "Zen Minimalist" },
      { emoji: "🚴", label: "Active trip — cycling, surfing, exploring", personality: "Health Nut" },
      { emoji: "🏖️", label: "Beach resort, cocktails, do nothing", personality: "Sweet Enthusiast" },
      { emoji: "🍽️", label: "Food tour of a new city", personality: "Indulgent Treat" },
    ],
  },
  {
    question: "You find $100 you forgot about. You:",
    options: [
      { emoji: "📚", label: "Save it or invest it", personality: "Zen Minimalist" },
      { emoji: "🥗", label: "Stock up on healthy groceries", personality: "Health Nut" },
      { emoji: "🛍️", label: "Treat yourself to something cute", personality: "Sweet Enthusiast" },
      { emoji: "🍕", label: "Book a fancy dinner immediately", personality: "Indulgent Treat" },
    ],
  },
  {
    question: "Choose a Netflix genre:",
    options: [
      { emoji: "🎬", label: "Documentaries or slow-burn dramas", personality: "Zen Minimalist" },
      { emoji: "💪", label: "True crime or survival shows", personality: "Health Nut" },
      { emoji: "💕", label: "Rom-coms or feel-good series", personality: "Sweet Enthusiast" },
      { emoji: "🍿", label: "Reality TV or food shows", personality: "Indulgent Treat" },
    ],
  },
];

const coffeeMap: Record<Personality, { drink: string; tagline: string; emoji: string }> = {
  "Sweet Enthusiast": { drink: "Caramel Latte", tagline: "Life's too short for bitter", emoji: "🍮" },
  "Zen Minimalist": { drink: "Black Coffee, Single Origin", tagline: "Simple. Clean. Perfect.", emoji: "⬛" },
  "Health Nut": { drink: "Oat Milk Americano", tagline: "Wellness in every sip", emoji: "🌿" },
  "Indulgent Treat": { drink: "Mocha with Whip", tagline: "Coffee is dessert", emoji: "🍫" },
};

const personalityOrder: Personality[] = ["Sweet Enthusiast", "Zen Minimalist", "Health Nut", "Indulgent Treat"];

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "quiz" | "results">("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Personality[]>([]);
  const [selected, setSelected] = useState<Personality | null>(null);

  const handleStart = () => setScreen("quiz");

  const handleSelect = (personality: Personality) => setSelected(personality);

  useEffect(() => {
    if (screen === "results") {
      const end = Date.now() + 1800;
      const colors = ["#c4845a", "#f5e6d3", "#b07d5a", "#e8d5c4", "#fff5ee"];
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [screen]);

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQuestion + 1 >= questions.length) {
      setScreen("results");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleRetake = () => {
    setScreen("welcome");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelected(null);
  };

  const getResults = () => {
    const counts: Record<Personality, number> = {
      "Sweet Enthusiast": 0,
      "Zen Minimalist": 0,
      "Health Nut": 0,
      "Indulgent Treat": 0,
    };
    answers.forEach((a) => counts[a]++);
    return personalityOrder
      .map((p) => ({ personality: p, count: counts[p], pct: Math.round((counts[p] / answers.length) * 100) }))
      .sort((a, b) => b.count - a.count);
  };

  const accent = "#c4845a";
  const cardStyle = {
    background: "#fffaf5",
    borderRadius: "20px",
    boxShadow: "0 8px 40px rgba(122,92,68,0.15)",
    padding: "40px",
    maxWidth: "520px",
    width: "100%",
  };
  const headerStyle = {
    fontSize: "14px",
    color: accent,
    letterSpacing: "1px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    marginBottom: "28px",
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      {screen === "welcome" && (
        <div style={cardStyle}>
          <div style={headerStyle}>☕ Basecamp Coffee</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: "#4a3728", marginBottom: "16px", lineHeight: 1.4 }}>
            What&apos;s Your Coffee Personality?
          </h1>
          <p style={{ color: "#7a5c44", fontSize: "16px", marginBottom: "32px", lineHeight: 1.6 }}>
            Answer 5 quick questions and we&apos;ll find your perfect Basecamp Coffee match.
          </p>
          <button
            onClick={handleStart}
            style={{
              width: "100%", padding: "16px",
              background: `linear-gradient(135deg, ${accent}, #b07d5a)`,
              color: "white", border: "none", borderRadius: "12px",
              fontSize: "16px", cursor: "pointer", fontFamily: "Arial, sans-serif",
            }}
          >
            Start the Quiz →
          </button>
        </div>
      )}

      {screen === "quiz" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={headerStyle}>☕ Basecamp Coffee</div>
            <div style={{ fontSize: "13px", color: "#c4a882", fontFamily: "Arial, sans-serif" }}>
              {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: "4px", background: "#f0e4d8", borderRadius: "4px", marginBottom: "32px" }}>
            <div
              style={{
                height: "100%",
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                background: `linear-gradient(90deg, ${accent}, #b07d5a)`,
                borderRadius: "4px",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#4a3728", marginBottom: "24px", lineHeight: 1.5 }}>
            {questions[currentQuestion].question}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {questions[currentQuestion].options.map((opt) => {
              const isSelected = selected === opt.personality;
              return (
                <button
                  key={opt.personality}
                  onClick={() => handleSelect(opt.personality)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: isSelected ? `1.5px solid ${accent}` : "1.5px solid #e8d5c4",
                    background: isSelected ? "#fff5ee" : "white",
                    color: isSelected ? "#4a3728" : "#6b4c38",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textAlign: "left",
                    fontWeight: isSelected ? 500 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{opt.emoji}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!selected}
            style={{
              marginTop: "24px",
              width: "100%",
              padding: "16px",
              background: selected ? `linear-gradient(135deg, ${accent}, #b07d5a)` : "#e8d5c4",
              color: selected ? "white" : "#c4a882",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              cursor: selected ? "pointer" : "not-allowed",
              fontFamily: "Arial, sans-serif",
              transition: "all 0.2s",
            }}
          >
            {currentQuestion + 1 === questions.length ? "See My Results →" : "Next Question →"}
          </button>
        </div>
      )}

      {screen === "results" && (
        <div style={{ ...cardStyle, maxWidth: "560px" }}>
          <div style={headerStyle}>☕ Basecamp Coffee</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: "#4a3728", marginBottom: "8px" }}>
            Your Coffee Personality
          </h2>
          <p style={{ color: "#7a5c44", fontSize: "15px", marginBottom: "28px", fontFamily: "Arial, sans-serif" }}>
            Here&apos;s how your answers broke down:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
            {getResults().map(({ personality, pct }, index) => {
              const coffee = coffeeMap[personality];
              const isTop = index === 0;
              return (
                <div
                  key={personality}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: isTop ? `1.5px solid ${accent}` : "1.5px solid #e8d5c4",
                    background: isTop ? "#fff5ee" : "white",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "18px", marginRight: "8px" }}>{coffee.emoji}</span>
                      <span style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#4a3728", fontWeight: isTop ? 600 : 400 }}>
                        {personality}
                      </span>
                      {isTop && (
                        <span style={{ marginLeft: "8px", fontSize: "12px", background: accent, color: "white", padding: "2px 8px", borderRadius: "20px", fontFamily: "Arial, sans-serif" }}>
                          Your Match
                        </span>
                      )}
                    </div>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: accent, fontWeight: 600 }}>{pct}%</span>
                  </div>

                  {/* Bar */}
                  <div style={{ height: "4px", background: "#f0e4d8", borderRadius: "4px", marginBottom: "8px" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: isTop ? `linear-gradient(90deg, ${accent}, #b07d5a)` : "#e8d5c4", borderRadius: "4px", transition: "width 0.5s ease" }} />
                  </div>

                  <p style={{ fontSize: "14px", color: "#7a5c44", fontFamily: "Arial, sans-serif", margin: 0 }}>
                    <strong>{coffee.drink}</strong> — {coffee.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRetake}
            style={{
              width: "100%",
              padding: "16px",
              background: `linear-gradient(135deg, ${accent}, #b07d5a)`,
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
