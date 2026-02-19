"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ===== DATA PERTANYAAN =====
const questions = [
    {
        id: 1,
        nomor: "01",
        pertanyaan: "Tgl jadian kita berapa? format jawabnya gabungin semua angkanya yaw",
        jawaban: "221125",
        type: "exact",
        popupBenar: "widii ingattt 🥰",
        popupSalah: "masa kamu lupa sama tgl jadian kita sih, ckp tw 😤",
    },
    {
        id: 2,
        nomor: "02",
        pertanyaan: "Perut kamu uda berapa cm nambahnya?",
        jawaban: "",
        type: "any",
        popupBenar: "iya bener segitu tu? ndak lebih banyak cm nya tu? xixixixixi 🤭",
        popupSalah: "",
    },
    {
        id: 3,
        nomor: "03",
        pertanyaan: "Kamu sayang ga sama aku?",
        jawaban: "sayang",
        type: "include",
        popupBenar: "aku juga sayanggggg kamu banget! 🥹❤️",
        popupSalah: "coba lagi jawab yang lebih meyakinkan ya 🥺",
    },
];

// ===== POPUP COMPONENT =====
function Popup({
    message,
    isBenar,
    onClose,
}: {
    message: string;
    isBenar: boolean;
    onClose: () => void;
}) {
    useEffect(() => {
        const t = setTimeout(onClose, 4500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 999,
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                animation: "fadeInUp 0.3s ease both",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: isBenar
                        ? "linear-gradient(135deg, #0f1b35, #1a1a2e)"
                        : "linear-gradient(135deg, #1a0a0a, #2e1a1a)",
                    border: isBenar
                        ? "1.5px solid rgba(255,255,255,0.25)"
                        : "1.5px solid rgba(255,80,80,0.4)",
                    borderRadius: 28,
                    padding: "3rem 2.5rem",
                    maxWidth: 400,
                    width: "100%",
                    textAlign: "center",
                    boxShadow: isBenar
                        ? "0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,255,255,0.05)"
                        : "0 30px 80px rgba(0,0,0,0.7)",
                    animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    width: 56, height: 56,
                    borderRadius: "50%",
                    background: isBenar ? "rgba(255,255,255,0.12)" : "rgba(255,80,80,0.15)",
                    border: isBenar ? "1.5px solid rgba(255,255,255,0.25)" : "1.5px solid rgba(255,80,80,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.4rem",
                }}>
                    {isBenar ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,80,80,0.9)" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
                <p
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.6,
                        marginBottom: "1.8rem",
                        textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                    }}
                >
                    {message}
                </p>
                <button
                    onClick={onClose}
                    style={{
                        background: "#fff",
                        color: "#111",
                        border: "none",
                        borderRadius: 50,
                        padding: "0.7rem 2rem",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 20px rgba(255,255,255,0.2)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; }}
                >
                    oke!
                </button>
            </div>
        </div>
    );
}

// ===== QUESTION CARD =====
function QuestionCard({
    q,
    index,
    status,
    onAnswer,
}: {
    q: typeof questions[0];
    index: number;
    status: "locked" | "open" | "done";
    onAnswer: (jawaban: string) => void;
}) {
    const [input, setInput] = useState("");
    const [shake, setShake] = useState(false);
    const isDone = status === "done";
    const isLocked = status === "locked";

    const handleSubmit = () => {
        if (!input.trim()) return;
        onAnswer(input.trim());
        setInput("");
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: 520,
                margin: "0 auto",
                background: isDone
                    ? "rgba(255,255,255,0.05)"
                    : isLocked
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(255,255,255,0.07)",
                border: isDone
                    ? "1.5px solid rgba(255,255,255,0.3)"
                    : isLocked
                        ? "1.5px dashed rgba(255,255,255,0.1)"
                        : "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: 24,
                padding: "2rem",
                backdropFilter: "blur(20px)",
                boxShadow: isLocked
                    ? "none"
                    : isDone
                        ? "0 8px 40px rgba(255,255,255,0.05)"
                        : "0 12px 50px rgba(0,0,0,0.4)",
                transition: "all 0.4s ease",
                animation: shake ? "shake 0.4s ease" : "none",
                opacity: isLocked ? 0.45 : 1,
            }}
        >
            {/* Nomor */}
            <div
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: "4rem",
                    color: isDone
                        ? "rgba(255,255,255,0.25)"
                        : isLocked
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(255,255,255,0.15)",
                    lineHeight: 1,
                    marginBottom: "0.3rem",
                    letterSpacing: "-2px",
                    userSelect: "none",
                }}
            >
                {q.nomor}
            </div>

            {/* Status badge */}
            <div style={{ marginBottom: "0.8rem" }}>
                <span
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.65rem",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        color: isDone
                            ? "rgba(255,255,255,0.6)"
                            : isLocked
                                ? "rgba(255,255,255,0.2)"
                                : "rgba(255,255,255,0.5)",
                        fontStyle: "italic",
                    }}
                >
                    {isDone ? "✓ selesai" : isLocked ? "🔒 terkunci" : "pertanyaan"}
                </span>
            </div>

            {/* Pertanyaan */}
            <p
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.05rem, 2.8vw, 1.25rem)",
                    color: isLocked ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.92)",
                    lineHeight: 1.75,
                    marginBottom: "1.5rem",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
            >
                &ldquo;{q.pertanyaan}&rdquo;
            </p>

            {/* Input hanya kalau open */}
            {status === "open" && (
                <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="jawaban kamu..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit();
                        }}
                        style={{
                            flex: 1,
                            minWidth: 160,
                            padding: "0.8rem 1.2rem",
                            borderRadius: 50,
                            border: "1.5px solid rgba(255,255,255,0.25)",
                            background: "rgba(255,255,255,0.07)",
                            color: "#fff",
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                            fontSize: "0.95rem",
                            outline: "none",
                            transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => { e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.55)"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                        onBlur={(e) => { e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.25)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim()}
                        style={{
                            padding: "0.8rem 1.6rem",
                            background: input.trim() ? "#fff" : "rgba(255,255,255,0.15)",
                            color: input.trim() ? "#111" : "rgba(255,255,255,0.3)",
                            border: "none",
                            borderRadius: 50,
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            cursor: input.trim() ? "pointer" : "not-allowed",
                            transition: "all 0.3s ease",
                            whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => { if (input.trim()) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
                    >
                        kirim
                    </button>
                </div>
            )}

            {/* Done checkmark */}
            {isDone && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "rgba(255,255,255,0.55)",
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    sudah dijawab
                </div>
            )}
        </div>
    );
}

// ===== MAIN GAME PAGE =====
export default function GamePage() {
    const router = useRouter();
    const [doneIds, setDoneIds] = useState<number[]>([]);
    const [popup, setPopup] = useState<{ message: string; isBenar: boolean } | null>(null);
    const [pendingDone, setPendingDone] = useState<number | null>(null);
    const [showFinal, setShowFinal] = useState(false);

    // After popup closes, mark question as done
    const handlePopupClose = () => {
        if (pendingDone !== null) {
            const newDone = [...doneIds, pendingDone];
            setDoneIds(newDone);
            setPendingDone(null);
            if (newDone.length === questions.length) {
                setTimeout(() => setShowFinal(true), 600);
            }
        }
        setPopup(null);
    };

    const handleAnswer = (q: typeof questions[0], jawaban: string) => {
        let isBenar = false;

        if (q.type === "exact") {
            isBenar = jawaban.replace(/\s/g, "").toLowerCase() === q.jawaban.toLowerCase();
        } else if (q.type === "include") {
            isBenar = jawaban.toLowerCase().includes(q.jawaban.toLowerCase());
        } else if (q.type === "any") {
            isBenar = true;
        }

        if (isBenar) {
            setPendingDone(q.id);
            setPopup({ message: q.popupBenar, isBenar: true });
        } else {
            setPopup({ message: q.popupSalah, isBenar: false });
        }
    };

    const getStatus = (q: typeof questions[0], index: number): "locked" | "open" | "done" => {
        if (doneIds.includes(q.id)) return "done";
        if (index === 0 || doneIds.includes(questions[index - 1].id)) return "open";
        return "locked";
    };

    if (showFinal) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#080808",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem 1rem",
                    fontFamily: "'Playfair Display', serif",
                }}
            >
                <div
                    style={{
                        maxWidth: 460,
                        width: "100%",
                        textAlign: "center",
                        animation: "fadeInUp 0.8s ease both",
                    }}
                >
                    <div style={{
                        width: 64, height: 64,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        border: "1.5px solid rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 1.5rem",
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p style={{ fontSize: "0.7rem", letterSpacing: "4px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: "1rem", fontStyle: "italic" }}>
                        semua pertanyaan selesai
                    </p>
                    <h1
                        style={{
                            fontSize: "clamp(2.8rem, 8vw, 5rem)",
                            fontWeight: 900,
                            color: "#fff",
                            lineHeight: 0.95,
                            marginBottom: "0.5rem",
                            textShadow: "0 6px 40px rgba(255,255,255,0.15)",
                            letterSpacing: "-1px",
                        }}
                    >
                        Happy
                    </h1>
                    <h1
                        style={{
                            fontStyle: "italic",
                            fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
                            fontWeight: 900,
                            color: "rgba(255,255,255,0.88)",
                            lineHeight: 1.1,
                            marginBottom: "2rem",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Birthday, Ghina Sayang!
                    </h1>

                    <div
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            borderRadius: 20,
                            padding: "1.8rem 1.5rem",
                            marginBottom: "2rem",
                            textAlign: "left",
                        }}
                    >
                        <p
                            style={{
                                fontStyle: "italic",
                                fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
                                color: "rgba(255,255,255,0.78)",
                                lineHeight: 2,
                                margin: 0,
                            }}
                        >
                            Happy birthday to the special person in my life! Thank you for being a part of my life, thank you for your hard work, thank you for growing well, thank you for always being the source of my happiness, thank you for always making me laugh, and thank you for everything.
                            I hope that on this special day you are surrounded by happiness, filled with joy, and blessed with love. I will always be here for you. You will never lose my love because you are the best boy. You are amazing and worth a lot on this earth. Please stay healthy and always happy, because I love you more than yesterday and will always love you until tomorrow.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/")}
                        style={{
                            padding: "1rem 2.8rem",
                            background: "#fff",
                            color: "#111",
                            border: "none",
                            borderRadius: 50,
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 8px 30px rgba(255,255,255,0.15)",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.04)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; }}
                    >
                        kembali ke halaman utama
                    </button>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(40px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes wiggle {
                        0%,100% { transform: rotate(-8deg); }
                        50%      { transform: rotate(8deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#080808",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "3rem 1.5rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle grain overlay */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Soft glow circles */}
            <div style={{ position: "fixed", top: "-20vh", left: "-20vw", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "-15vh", right: "-15vw", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            {/* Back button */}
            <div style={{ width: "100%", maxWidth: 520, marginBottom: "2rem", position: "relative", zIndex: 10 }}>
                <button
                    onClick={() => router.push("/")}
                    style={{
                        background: "transparent",
                        border: "1.5px solid rgba(255,255,255,0.2)",
                        borderRadius: 50,
                        padding: "0.5rem 1.4rem",
                        cursor: "pointer",
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.6)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.5)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    kembali
                </button>
            </div>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative", zIndex: 10, width: "100%", maxWidth: 520 }}>
                <p style={{ fontSize: "0.65rem", letterSpacing: "4px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginBottom: "1rem", animation: "fadeInUp 0.8s ease 0.1s both" }}>

                </p>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 900,
                        fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                        color: "#fff",
                        lineHeight: 0.95,
                        letterSpacing: "-1px",
                        marginBottom: "0.5rem",
                        textShadow: "0 6px 40px rgba(255,255,255,0.1)",
                        animation: "fadeInUp 0.8s ease 0.25s both",
                    }}
                >
                    Quiz
                </h1>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontWeight: 700,
                        fontSize: "clamp(1.3rem, 3.5vw, 2rem)",
                        color: "rgba(255,255,255,0.65)",
                        marginBottom: "1.8rem",
                        animation: "fadeInUp 0.8s ease 0.4s both",
                    }}
                >
                    buat pacar gue
                </h2>

                {/* Progress dots */}
                <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", animation: "fadeInUp 0.8s ease 0.55s both" }}>
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            style={{
                                width: doneIds.includes(q.id) ? 28 : 10,
                                height: 10,
                                borderRadius: 99,
                                background: doneIds.includes(q.id)
                                    ? "#fff"
                                    : "rgba(255,255,255,0.2)",
                                transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Questions */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    position: "relative",
                    zIndex: 10,
                    animation: "fadeInUp 0.8s ease 0.65s both",
                }}
            >
                {questions.map((q, index) => {
                    const status = getStatus(q, index);
                    return (
                        <QuestionCard
                            key={q.id}
                            q={q}
                            index={index}
                            status={status}
                            onAnswer={(jawaban) => handleAnswer(q, jawaban)}
                        />
                    );
                })}
            </div>

            {/* Popup */}
            {popup && (
                <Popup
                    message={popup.message}
                    isBenar={popup.isBenar}
                    onClose={handlePopupClose}
                />
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }
                html, body { background: #080808; }

                ::placeholder {
                    color: rgba(255,255,255,0.3);
                    font-style: italic;
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    from { transform: scale(0.7); opacity: 0; }
                    to   { transform: scale(1);   opacity: 1; }
                }

                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    20%     { transform: translateX(-8px); }
                    40%     { transform: translateX(8px); }
                    60%     { transform: translateX(-5px); }
                    80%     { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
}
