"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ===== HELPER: localStorage keys =====
const STORAGE_KEY_DATE = "hadiah_target_date";
const STORAGE_KEY_PHOTO = "hadiah_photo";

// ===== COUNTDOWN LOGIC =====
function getTimeLeft(targetDate: string) {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
}

function formatDateDisplay(dateStr: string) {
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    return d.toLocaleDateString("id-ID", options);
}

// ===== CALENDAR DATA =====
const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

// ===== CUSTOM CALENDAR COMPONENT =====
function CustomCalendar({
    selectedDate,
    onSelect,
}: {
    selectedDate: string;
    onSelect: (dateStr: string) => void;
}) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
        else setViewMonth(viewMonth - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
        else setViewMonth(viewMonth + 1);
    };

    // Build calendar grid
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
        <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1.5px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            padding: "1.5rem",
            animation: "fadeInUp 0.4s ease both",
        }}>
            {/* Month/Year navigation */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "1.2rem",
            }}>
                <button onClick={prevMonth} style={{
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "50%", width: 36, height: 36, display: "flex",
                    alignItems: "center", justifyContent: "center", cursor: "pointer",
                    transition: "all 0.2s ease", color: "rgba(255,255,255,0.7)",
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div style={{
                    fontFamily: "'Playfair Display', serif", fontWeight: 700,
                    fontSize: "1.1rem", color: "#fff", letterSpacing: "1px",
                }}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </div>
                <button onClick={nextMonth} style={{
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "50%", width: 36, height: 36, display: "flex",
                    alignItems: "center", justifyContent: "center", cursor: "pointer",
                    transition: "all 0.2s ease", color: "rgba(255,255,255,0.7)",
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Day headers */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4,
                marginBottom: "0.5rem",
            }}>
                {DAY_NAMES.map((d) => (
                    <div key={d} style={{
                        fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                        fontSize: "0.7rem", color: "rgba(255,255,255,0.35)",
                        textAlign: "center", padding: "0.3rem 0", letterSpacing: "1px",
                        textTransform: "uppercase",
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4,
            }}>
                {cells.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />;
                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === todayStr;

                    return (
                        <button
                            key={dateStr}
                            onClick={() => onSelect(dateStr)}
                            style={{
                                width: "100%",
                                aspectRatio: "1",
                                borderRadius: 12,
                                border: isSelected
                                    ? "1.5px solid rgba(255,255,255,0.6)"
                                    : isToday
                                        ? "1.5px solid rgba(255,255,255,0.25)"
                                        : "1.5px solid transparent",
                                background: isSelected
                                    ? "rgba(255,255,255,0.18)"
                                    : "transparent",
                                color: isSelected
                                    ? "#fff"
                                    : isToday
                                        ? "rgba(255,255,255,0.9)"
                                        : "rgba(255,255,255,0.6)",
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "0.9rem",
                                fontWeight: isSelected || isToday ? 700 : 400,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}
                            onMouseEnter={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                    e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.2)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSelected) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.border = isToday
                                        ? "1.5px solid rgba(255,255,255,0.25)"
                                        : "1.5px solid transparent";
                                }
                            }}
                        >
                            {day}
                            {isToday && !isSelected && (
                                <div style={{
                                    position: "absolute", bottom: 4, left: "50%",
                                    transform: "translateX(-50%)", width: 4, height: 4,
                                    borderRadius: "50%", background: "rgba(255,255,255,0.5)",
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ===== COUNTDOWN CARD =====
function CountdownCard({ label, value }: { label: string; value: number }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
                minWidth: 68,
            }}
        >
            <div
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                    textShadow: "0 4px 30px rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    borderRadius: 18,
                    padding: "1rem 1.2rem 0.8rem",
                    backdropFilter: "blur(20px)",
                    minWidth: 68,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                }}
            >
                {String(value).padStart(2, "0")}
            </div>
            <span
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: "0.7rem",
                    letterSpacing: "2px",
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </span>
        </div>
    );
}

// ===== SUCCESS POPUP =====
function SuccessPopup({ onClose }: { onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 6000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.78)",
                backdropFilter: "blur(12px)",
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
                    background: "linear-gradient(135deg, #0f1b35, #1a1a2e)",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    borderRadius: 28,
                    padding: "3rem 2.5rem",
                    maxWidth: 420,
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,255,255,0.05)",
                    animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    width: 64, height: 64,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem", animation: "wiggle 1s ease-in-out infinite" }}>
                    🎁✨
                </div>
                <p
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.6,
                        marginBottom: "0.8rem",
                        textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                    }}
                >
                    foto berhasil di upload!
                </p>
                <p
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.8,
                        marginBottom: "2rem",
                    }}
                >
                    oke sekarang kamu boleh minta hadiahnya ke pacar kamu 🥰💝
                </p>
                <button
                    onClick={onClose}
                    style={{
                        padding: "0.9rem 2.5rem",
                        background: "#fff",
                        color: "#111",
                        border: "none",
                        borderRadius: 50,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 20px rgba(255,255,255,0.2)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; }}
                >
                    oke siap! 🥳
                </button>
            </div>
        </div>
    );
}

// ===== MAIN PAGE =====
export default function HadiahPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [targetDate, setTargetDate] = useState<string>("");
    const [tempDate, setTempDate] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
    const [photo, setPhoto] = useState<string>("");
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
        const savedPhoto = localStorage.getItem(STORAGE_KEY_PHOTO);
        if (savedDate) {
            setTargetDate(savedDate);
            setTempDate(savedDate);
        }
        if (savedPhoto) {
            setPhoto(savedPhoto);
        }
        setMounted(true);
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!targetDate) return;
        const update = () => setTimeLeft(getTimeLeft(targetDate));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    // Save date
    const handleSaveDate = useCallback(() => {
        if (!tempDate) return;
        setTargetDate(tempDate);
        localStorage.setItem(STORAGE_KEY_DATE, tempDate);
        setIsEditing(false);
    }, [tempDate]);

    // Edit date
    const handleEdit = () => {
        setTempDate(targetDate);
        setIsEditing(true);
    };

    // Handle photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPhoto(base64);
            localStorage.setItem(STORAGE_KEY_PHOTO, base64);
            setShowPhotoModal(false);
            setShowSuccessPopup(true);
        };
        reader.readAsDataURL(file);
    };

    // Delete photo
    const handleDeletePhoto = () => {
        setPhoto("");
        localStorage.removeItem(STORAGE_KEY_PHOTO);
        // Reset file input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Retake photo
    const handleRetakePhoto = () => {
        // Reset file input so a new file can be selected
        if (fileInputRef.current) fileInputRef.current.value = "";
        fileInputRef.current?.click();
    };

    if (!mounted) return null;

    const hasDate = !!targetDate && !isEditing;
    const hasPhoto = !!photo;

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
            <div style={{ textAlign: "center", marginBottom: "2.5rem", position: "relative", zIndex: 10, width: "100%", maxWidth: 520 }}>
                <p style={{
                    fontSize: "0.65rem", letterSpacing: "4px", color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase", fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic", marginBottom: "1rem",
                    animation: "fadeInUp 0.8s ease 0.1s both",
                }}>
                    ✦ spesial buat kamu ✦
                </p>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 900,
                        fontSize: "clamp(2rem, 6vw, 3.5rem)",
                        color: "#fff",
                        lineHeight: 1,
                        letterSpacing: "-1px",
                        marginBottom: "0.5rem",
                        textShadow: "0 6px 40px rgba(255,255,255,0.1)",
                        animation: "fadeInUp 0.8s ease 0.25s both",
                    }}
                >
                    Pengambilan
                </h1>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontWeight: 700,
                        fontSize: "clamp(1.3rem, 3.5vw, 2rem)",
                        color: "rgba(255,255,255,0.65)",
                        marginBottom: "0.5rem",
                        animation: "fadeInUp 0.8s ease 0.4s both",
                    }}
                >
                    Hadiah
                </h2>
                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(0.85rem, 2vw, 1rem)",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.7,
                    maxWidth: 400,
                    margin: "0 auto",
                    animation: "fadeInUp 0.8s ease 0.55s both",
                }}>
                    pilih hari yang kamu mau buat ambil hadiahnyaa
                </p>
            </div>

            {/* ===== DATE SELECTION / COUNTDOWN ===== */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 520,
                    position: "relative",
                    zIndex: 10,
                    animation: "fadeInUp 0.8s ease 0.65s both",
                }}
            >
                {/* SHOW CUSTOM CALENDAR when no date or editing */}
                {(!hasDate || isEditing) && (
                    <div
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1.5px solid rgba(255,255,255,0.15)",
                            borderRadius: 24,
                            padding: "2rem",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 12px 50px rgba(0,0,0,0.4)",
                            animation: "fadeInUp 0.5s ease both",
                        }}
                    >
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                            fontSize: "0.75rem",
                            letterSpacing: "3px",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                            marginBottom: "1rem",
                            textAlign: "center",
                        }}>
                            pilih tanggal pengambilan
                        </p>

                        {/* Custom Calendar */}
                        <CustomCalendar
                            selectedDate={tempDate}
                            onSelect={(d) => setTempDate(d)}
                        />

                        {/* Selected date preview */}
                        {tempDate && (
                            <div style={{
                                textAlign: "center",
                                marginTop: "1rem",
                                padding: "0.8rem",
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.1)",
                            }}>
                                <p style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontStyle: "italic",
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.4)",
                                    marginBottom: "0.3rem",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                }}>
                                    tanggal dipilih
                                </p>
                                <p style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1rem",
                                    color: "#fff",
                                    fontWeight: 700,
                                }}>
                                    {formatDateDisplay(tempDate)}
                                </p>
                            </div>
                        )}

                        {/* Save / Cancel buttons */}
                        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.2rem" }}>
                            <button
                                onClick={handleSaveDate}
                                disabled={!tempDate}
                                style={{
                                    flex: 1,
                                    padding: "0.9rem 2rem",
                                    background: tempDate ? "#fff" : "rgba(255,255,255,0.15)",
                                    color: tempDate ? "#111" : "rgba(255,255,255,0.3)",
                                    border: "none",
                                    borderRadius: 50,
                                    fontFamily: "'Playfair Display', serif",
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    cursor: tempDate ? "pointer" : "not-allowed",
                                    transition: "all 0.3s ease",
                                    boxShadow: tempDate ? "0 4px 20px rgba(255,255,255,0.2)" : "none",
                                }}
                                onMouseEnter={(e) => { if (tempDate) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.03)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; }}
                            >
                                simpan ✓
                            </button>
                            {isEditing && (
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        padding: "0.9rem 1.6rem",
                                        background: "transparent",
                                        color: "rgba(255,255,255,0.6)",
                                        border: "1.5px solid rgba(255,255,255,0.2)",
                                        borderRadius: 50,
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    batal
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* SHOW COUNTDOWN when date is set */}
                {hasDate && !isEditing && (
                    <div
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1.5px solid rgba(255,255,255,0.15)",
                            borderRadius: 24,
                            padding: "2rem",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 12px 50px rgba(0,0,0,0.4)",
                            animation: "fadeInUp 0.5s ease both",
                        }}
                    >
                        {/* Target date label */}
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <p style={{
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: "italic",
                                fontSize: "0.7rem",
                                letterSpacing: "3px",
                                color: "rgba(255,255,255,0.45)",
                                textTransform: "uppercase",
                                marginBottom: "0.5rem",
                            }}>
                                {timeLeft.expired ? "🎉 hari yang ditunggu sudah tiba!" : "⏳ countdown menuju hari H"}
                            </p>
                            <p style={{
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: "italic",
                                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                                color: "rgba(255,255,255,0.8)",
                                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                            }}>
                                {formatDateDisplay(targetDate)}
                            </p>
                        </div>

                        {/* Countdown numbers */}
                        {!timeLeft.expired && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "clamp(0.5rem, 2vw, 1rem)",
                                    marginBottom: "1.5rem",
                                    flexWrap: "wrap",
                                }}
                            >
                                <CountdownCard label="hari" value={timeLeft.days} />
                                <div style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "2rem", color: "rgba(255,255,255,0.3)",
                                    display: "flex", alignItems: "center", paddingBottom: "1.2rem",
                                }}>:</div>
                                <CountdownCard label="jam" value={timeLeft.hours} />
                                <div style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "2rem", color: "rgba(255,255,255,0.3)",
                                    display: "flex", alignItems: "center", paddingBottom: "1.2rem",
                                }}>:</div>
                                <CountdownCard label="menit" value={timeLeft.minutes} />
                                <div style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "2rem", color: "rgba(255,255,255,0.3)",
                                    display: "flex", alignItems: "center", paddingBottom: "1.2rem",
                                }}>:</div>
                                <CountdownCard label="detik" value={timeLeft.seconds} />
                            </div>
                        )}

                        {/* Expired celebration */}
                        {timeLeft.expired && (
                            <div style={{
                                textAlign: "center",
                                marginBottom: "1.5rem",
                                animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                            }}>
                                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉🎁✨</div>
                                <p style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontStyle: "italic",
                                    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                                    fontWeight: 700,
                                    color: "#fff",
                                    textShadow: "0 2px 20px rgba(255,255,255,0.15)",
                                }}>
                                    waktunya ambil hadiah! 🥳
                                </p>
                            </div>
                        )}

                        {/* Edit button */}
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button
                                onClick={handleEdit}
                                style={{
                                    padding: "0.7rem 2rem",
                                    background: "transparent",
                                    color: "rgba(255,255,255,0.55)",
                                    border: "1.5px solid rgba(255,255,255,0.18)",
                                    borderRadius: 50,
                                    fontFamily: "'Playfair Display', serif",
                                    fontStyle: "italic",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.45)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                edit tanggal
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ===== DIVIDER ===== */}
            <div style={{
                width: 1, height: 40,
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)",
                margin: "1.5rem 0",
                position: "relative",
                zIndex: 10,
            }} />

            {/* ===== UDAH KETEMU / PHOTO SECTION ===== */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 520,
                    position: "relative",
                    zIndex: 10,
                    animation: "fadeInUp 0.8s ease 0.8s both",
                }}
            >
                {!hasPhoto ? (
                    /* Button: Udah Ketemu */
                    <div style={{ textAlign: "center" }}>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                            fontSize: "clamp(0.85rem, 2vw, 1rem)",
                            color: "rgba(255,255,255,0.45)",
                            marginBottom: "1rem",
                            lineHeight: 1.7,
                        }}>
                            udah ketemu belum sama pacarmu? kalau udah foto dulu terus buktikanzz
                        </p>
                        <button
                            onClick={() => setShowPhotoModal(true)}
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
                                boxShadow: "0 8px 30px rgba(255,255,255,0.2)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.04)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; }}
                        >
                            udah ketemu!
                        </button>
                    </div>
                ) : (
                    /* Photo display */
                    <div
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1.5px solid rgba(255,255,255,0.15)",
                            borderRadius: 24,
                            padding: "2rem",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 12px 50px rgba(0,0,0,0.4)",
                            animation: "fadeInUp 0.5s ease both",
                        }}
                    >
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                            fontSize: "0.7rem",
                            letterSpacing: "3px",
                            color: "rgba(255,255,255,0.45)",
                            textTransform: "uppercase",
                            marginBottom: "1rem",
                            textAlign: "center",
                        }}>
                            📸 foto hadiahnya
                        </p>

                        {/* Photo */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={photo}
                            alt="Foto hadiah"
                            style={{
                                width: "100%",
                                borderRadius: 16,
                                border: "1.5px solid rgba(255,255,255,0.1)",
                                objectFit: "cover",
                                maxHeight: 400,
                                marginBottom: "1.2rem",
                                boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                            }}
                        />

                        <div style={{ textAlign: "center" }}>
                            <p style={{
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: "italic",
                                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                                color: "rgba(255,255,255,0.75)",
                                marginBottom: "1.2rem",
                            }}>
                                yeayyy udah ketemu hadiahnya! 🎉🥳
                            </p>

                            {/* Action buttons: Foto Ulang & Hapus Foto */}
                            <div style={{
                                display: "flex",
                                gap: "0.8rem",
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}>
                                <button
                                    onClick={handleRetakePhoto}
                                    style={{
                                        padding: "0.7rem 1.8rem",
                                        background: "rgba(255,255,255,0.1)",
                                        color: "rgba(255,255,255,0.8)",
                                        border: "1.5px solid rgba(255,255,255,0.2)",
                                        borderRadius: 50,
                                        fontFamily: "'Playfair Display', serif",
                                        fontStyle: "italic",
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    foto ulang
                                </button>
                                <button
                                    onClick={handleDeletePhoto}
                                    style={{
                                        padding: "0.7rem 1.8rem",
                                        background: "rgba(255,80,80,0.1)",
                                        color: "rgba(255,120,120,0.9)",
                                        border: "1.5px solid rgba(255,80,80,0.25)",
                                        borderRadius: 50,
                                        fontFamily: "'Playfair Display', serif",
                                        fontStyle: "italic",
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,80,80,0.2)"; e.currentTarget.style.borderColor = "rgba(255,80,80,0.45)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,80,80,0.1)"; e.currentTarget.style.borderColor = "rgba(255,80,80,0.25)"; }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    hapus foto
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
            />

            {/* ===== PHOTO UPLOAD MODAL ===== */}
            {showPhotoModal && (
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
                    onClick={() => setShowPhotoModal(false)}
                >
                    <div
                        style={{
                            background: "linear-gradient(135deg, #0f1b35, #1a1a2e)",
                            border: "1.5px solid rgba(255,255,255,0.25)",
                            borderRadius: 28,
                            padding: "3rem 2.5rem",
                            maxWidth: 420,
                            width: "100%",
                            textAlign: "center",
                            boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,255,255,0.05)",
                            animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
                        <p
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: "italic",
                                fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
                                fontWeight: 700,
                                color: "#fff",
                                lineHeight: 1.6,
                                marginBottom: "0.5rem",
                                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                            }}
                        >
                            upload foto hadiahnya ya!
                        </p>
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: "italic",
                            fontSize: "0.9rem",
                            color: "rgba(255,255,255,0.55)",
                            marginBottom: "2rem",
                        }}>
                            biar aku bisa liat 🥰
                        </p>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                padding: "1rem 2.5rem",
                                background: "#fff",
                                color: "#111",
                                border: "none",
                                borderRadius: 50,
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 700,
                                fontSize: "1rem",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 20px rgba(255,255,255,0.2)",
                                marginBottom: "1rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.05)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; }}
                        >
                            📁 pilih foto
                        </button>

                        <br />
                        <button
                            onClick={() => setShowPhotoModal(false)}
                            style={{
                                background: "transparent",
                                color: "rgba(255,255,255,0.5)",
                                border: "none",
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: "italic",
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                transition: "color 0.3s",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"; }}
                        >
                            nanti aja
                        </button>
                    </div>
                </div>
            )}

            {/* ===== SUCCESS POPUP ===== */}
            {showSuccessPopup && (
                <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
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
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.5; }
                }
                @keyframes wiggle {
                    0%,100% { transform: rotate(-8deg); }
                    50%      { transform: rotate(8deg); }
                }
            `}</style>
        </div>
    );
}
