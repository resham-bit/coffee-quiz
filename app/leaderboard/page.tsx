"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Personality = "Sweet Enthusiast" | "Zen Minimalist" | "Health Nut" | "Indulgent Treat";

interface Result {
  id: string;
  name: string;
  personality: Personality;
  created_at: string;
}

const coffeeMap: Record<Personality, { drink: string; emoji: string; color: string }> = {
  "Sweet Enthusiast": { drink: "Caramel Latte", emoji: "🍮", color: "#f5a623" },
  "Zen Minimalist": { drink: "Black Coffee", emoji: "⬛", color: "#4a3728" },
  "Health Nut": { drink: "Oat Milk Americano", emoji: "🌿", color: "#5a8a5a" },
  "Indulgent Treat": { drink: "Mocha with Whip", emoji: "🍫", color: "#8b4513" },
};

const personalityOrder: Personality[] = ["Sweet Enthusiast", "Zen Minimalist", "Health Nut", "Indulgent Treat"];

const accent = "#c4845a";

function LeaderboardContent() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const myPersonality = searchParams.get("personality") as Personality | null;

  useEffect(() => {
    const fetchResults = async () => {
      const { data } = await supabase
        .from("results")
        .select("*")
        .order("created_at", { ascending: false });
      setResults(data || []);
      setLoading(false);
    };
    fetchResults();
  }, []);

  const counts = personalityOrder.map((p) => ({
    personality: p,
    count: results.filter((r) => r.personality === p).length,
  }));
  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "14px", color: accent, letterSpacing: "1px", fontWeight: 600, textTransform: "uppercase", marginBottom: "12px" }}>
            ☕ Basecamp Coffee
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#4a3728", marginBottom: "8px" }}>
            Coffee Personality Leaderboard
          </h1>
          <p style={{ color: "#7a5c44", fontSize: "16px" }}>
            {results.length} {results.length === 1 ? "person has" : "people have"} taken the quiz
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#7a5c44" }}>Loading...</p>
        ) : (
          <>
            {/* Personality bars */}
            <div style={{ background: "#fffaf5", borderRadius: "20px", boxShadow: "0 8px 40px rgba(122,92,68,0.15)", padding: "32px", marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#4a3728", marginBottom: "24px" }}>
                Personality Breakdown
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {counts
                  .sort((a, b) => b.count - a.count)
                  .map(({ personality, count }, index) => {
                    const coffee = coffeeMap[personality];
                    const pct = Math.round((count / results.length) * 100) || 0;
                    const isHighlighted = myPersonality ? personality === myPersonality : index === 0 && count > 0;
                    return (
                      <div key={personality}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "20px" }}>{coffee.emoji}</span>
                            <span style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#4a3728", fontWeight: isHighlighted ? 600 : 400 }}>
                              {personality}
                            </span>
                            {isHighlighted && count > 0 && (
                              <span style={{ fontSize: "12px", background: accent, color: "white", padding: "2px 8px", borderRadius: "20px" }}>
                                {myPersonality ? "Your Result" : "#1"}
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "60%" }}>
                            {results
                              .filter((r) => r.personality === personality)
                              .map((r) => (
                                <div
                                  key={r.id}
                                  title={r.name}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: isHighlighted ? `linear-gradient(135deg, ${accent}, #b07d5a)` : "#e8d5c4",
                                    color: isHighlighted ? "white" : "#7a5c44",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  {r.name.charAt(0).toUpperCase()}
                                </div>
                              ))}
                          </div>
                        </div>
                        <div style={{ height: "8px", background: "#f0e4d8", borderRadius: "8px" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${(count / maxCount) * 100}%`,
                              background: isHighlighted ? `linear-gradient(90deg, ${accent}, #b07d5a)` : "#e8d5c4",
                              borderRadius: "8px",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: "13px", color: "#c4a882", marginTop: "4px" }}>
                          {coffee.drink} · {pct}% of players
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Recent results */}
            {results.length > 0 && (
              <div style={{ background: "#fffaf5", borderRadius: "20px", boxShadow: "0 8px 40px rgba(122,92,68,0.15)", padding: "32px", marginBottom: "32px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#4a3728", marginBottom: "24px" }}>
                  Recent Players
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {results.slice(0, 20).map((r) => {
                    const coffee = coffeeMap[r.personality as Personality] || { emoji: "☕", drink: r.personality };
                    return (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          background: "white",
                          borderRadius: "12px",
                          border: "1.5px solid #f0e4d8",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "18px" }}>{coffee.emoji}</span>
                          <span style={{ color: "#4a3728", fontWeight: 500 }}>{r.name}</span>
                        </div>
                        <span style={{ color: "#7a5c44", fontSize: "14px" }}>{r.personality}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Back to quiz */}
        <div style={{ textAlign: "center" }}>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              background: `linear-gradient(135deg, ${accent}, #b07d5a)`,
              color: "white",
              borderRadius: "12px",
              fontSize: "16px",
              textDecoration: "none",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Take the Quiz →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  return (
    <Suspense>
      <LeaderboardContent />
    </Suspense>
  );
}
