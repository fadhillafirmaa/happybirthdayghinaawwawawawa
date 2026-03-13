"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
// IMPORT FIREBASE
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

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
    if (!dateStr) return "";
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
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "1.2rem",
            }}>
                <button onClick={prevMonth} style={{
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "50%", width: 36, height: 36, display: "flex",
                    alignItems: "center", justifyContent: "center", cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                }}>
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
                    color: "rgba(255,255,255,0.7)",
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4,
                marginBottom: "0.5rem",
            }}>
                {DAY_NAMES.map((d) => (
                    <div key={d} style={{
                        fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                        fontSize: "0.7rem", color: "rgba(255,255,255,0.35)",
                        textAlign: "center", padding: "0.3rem 0", textTransform: "uppercase",
                    }}>
                        {d}
                    </div>
                ))}
            </div>

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
                        >
                            {day}
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", minWidth: 68 }}>
            <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                borderRadius: 18,
                padding: "1rem 1.2rem 0.8rem",
                backdropFilter: "blur(20px)",
                minWidth: 68,
                textAlign: "center",
            }}>
                {String(value).padStart(2, "0")}
            </div>
            <span style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "0.7rem",
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
            }}>
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
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem", animation: "fadeInUp 0.3s ease both",
        }} onClick={onClose}>
            <div style={{
                background: "linear-gradient(135deg, #0f1b35, #1a1a2e)", border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: 28, padding: "3rem 2.5rem", maxWidth: 420, width: "100%", textAlign: "center",
                boxShadow: "0 30px 80px rgba(0,0,0,0.7)", animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎁✨</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "0.8rem" }}>foto berhasil di upload!</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", marginBottom: "2rem" }}>oke sekarang kamu boleh minta hadiahnya ke pacar kamu 🥰💝</p>
                <button onClick={onClose} style={{ padding: "0.9rem 2.5rem", background: "#fff", border: "none", borderRadius: 50, fontFamily: "'Playfair Display', serif", fontWeight: 700, cursor: "pointer" }}>oke siap! 🥳</button>
            </div>
        </div>
    );
}

// ===== MAIN PAGE =====
export default function HadiahPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [targetDate, setTargetDate] = useState<string>("");
    const [tempDate, setTempDate] = useState<string>("");
    const [photo, setPhoto] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // 1. LISTEN FIREBASE SECARA REAL-TIME
    useEffect(() => {
        const docRef = doc(db, "settings", "hadiah");
        const unsub = onSnapshot(docRef, (docSnap) => {
            console.log("Firebase snapshot:", docSnap.exists(), docSnap.data());
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTargetDate(data.tanggal || "");
                setTempDate(data.tanggal || "");
                setPhoto(data.photoUrl || "");
            }
        }, (error) => {
            console.error("Firebase error:", error);
        });
        return () => unsub();
    }, []);

    // 2. COUNTDOWN TIMER
    useEffect(() => {
        if (!targetDate) return;
        const update = () => setTimeLeft(getTimeLeft(targetDate));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    // 3. SIMPAN TANGGAL KE FIREBASE
    const handleSaveDate = useCallback(async () => {
        if (!tempDate) return;
        try {
            await setDoc(doc(db, "settings", "hadiah"), { tanggal: tempDate }, { merge: true });
            setIsEditing(false);
        } catch (err) { console.error(err); }
    }, [tempDate]);

    const handleEdit = () => { setIsEditing(true); };

    // RESET TANGGAL (hapus dari Firestore)
    const handleResetDate = async () => {
        if (!confirm("Reset tanggal? Kalender akan muncul lagi.")) return;
        await setDoc(doc(db, "settings", "hadiah"), { tanggal: "" }, { merge: true });
        setTargetDate("");
        setTempDate("");
    };

    // 4. COMPRESS & UPLOAD FOTO KE FIRESTORE (base64)
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Resize & compress image to keep under Firestore 1MB limit
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const MAX = 1200;
                        let w = img.width, h = img.height;
                        if (w > MAX || h > MAX) {
                            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                            else { w = Math.round(w * MAX / h); h = MAX; }
                        }
                        canvas.width = w;
                        canvas.height = h;
                        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
                        resolve(canvas.toDataURL("image/jpeg", 0.85));
                    };
                    img.onerror = reject;
                    img.src = ev.target?.result as string;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Simpan base64 ke Firestore
            await setDoc(doc(db, "settings", "hadiah"), { photoUrl: base64 }, { merge: true });

            setShowPhotoModal(false);
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("Gagal upload:", error);
            alert("Gagal upload foto.");
        } finally {
            setIsUploading(false);
        }
    };

    // 5. HAPUS FOTO DARI FIREBASE
    const handleDeletePhoto = async () => {
        if (!confirm("Hapus foto untuk semua device?")) return;
        await setDoc(doc(db, "settings", "hadiah"), { photoUrl: "" }, { merge: true });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const hasDate = !!targetDate && !isEditing;
    const hasPhoto = !!photo;

    return (
        <div style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem 1.5rem", position: "relative", overflow: "hidden" }}>
            {/* Grain & Glow Overlay */}
            <div style={{ position: "fixed", inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents: "none" }} />
            <div style={{ position: "fixed", top: "-20vh", left: "-20vw", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Back Button */}
            <div style={{ width: "100%", maxWidth: 520, marginBottom: "2rem", position: "relative", zIndex: 10 }}>
                <button onClick={() => router.push("/")} style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 50, padding: "0.5rem 1.4rem", cursor: "pointer", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>kembali</button>
            </div>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem", position: "relative", zIndex: 10 }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "3rem", color: "#fff", lineHeight: 1 }}>Pengambilan</h1>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.8rem", color: "rgba(255,255,255,0.65)" }}>Hadiah</h2>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1rem", color: "rgba(255,255,255,0.45)", marginTop: "0.8rem", letterSpacing: "1px" }}>ayo kapan kita ketemuuu, tentukannnn</p>
            </div>

            {/* Date / Countdown Section */}
            <div style={{ width: "100%", maxWidth: 520, zIndex: 10 }}>
                {(!hasDate || isEditing) ? (
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 24, padding: "2rem", backdropFilter: "blur(20px)" }}>
                        <CustomCalendar selectedDate={tempDate} onSelect={(d) => setTempDate(d)} />
                        {tempDate && <div style={{ textAlign: "center", marginTop: "1rem", color: "#fff", fontWeight: 700 }}>{formatDateDisplay(tempDate)}</div>}
                        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.2rem" }}>
                            <button onClick={handleSaveDate} style={{ flex: 1, padding: "0.9rem", background: "#fff", borderRadius: 50, fontWeight: 700, cursor: "pointer" }}>simpan ✓</button>
                            {isEditing && <button onClick={() => setIsEditing(false)} style={{ padding: "0.9rem 1.6rem", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 50, cursor: "pointer" }}>batal</button>}
                        </div>
                    </div>
                ) : (
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 24, padding: "2rem", backdropFilter: "blur(20px)" }}>
                        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: "0.5rem" }}>{timeLeft.expired ? " waktunya ambil hadiah!" : "⏳ countdown"}</p>
                        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#fff", fontStyle: "italic", marginBottom: "1.5rem" }}>{formatDateDisplay(targetDate)}</p>
                        {!timeLeft.expired && (
                            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                                <CountdownCard label="hari" value={timeLeft.days} />
                                <CountdownCard label="jam" value={timeLeft.hours} />
                                <CountdownCard label="menit" value={timeLeft.minutes} />
                                <CountdownCard label="detik" value={timeLeft.seconds} />
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem" }}>
                            <button onClick={handleEdit} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", borderRadius: 50, padding: "0.6rem", cursor: "pointer" }}>edit tanggal</button>
                            <button onClick={handleResetDate} style={{ flex: 1, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", color: "#ff8080", borderRadius: 50, padding: "0.6rem", cursor: "pointer" }}>reset tanggal</button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ width: 1, height: 40, background: "linear-gradient(transparent, rgba(255,255,255,0.15), transparent)", margin: "1.5rem 0", zIndex: 10 }} />

            {/* Photo Section */}
            <div style={{ width: "100%", maxWidth: 520, zIndex: 10 }}>
                {!hasPhoto ? (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginBottom: "1rem" }}>udah ketemu belum sama pacarmu? kalau udah foto dulu terus buktikanzz</p>
                        <button onClick={() => setShowPhotoModal(true)} style={{ padding: "1rem 2.8rem", background: "#fff", borderRadius: 50, fontWeight: 700, cursor: "pointer" }}>udah ketemu!</button>
                    </div>
                ) : (
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 24, padding: "2rem", backdropFilter: "blur(20px)" }}>
                        <img src={photo} alt="Hadiah" style={{ width: "100%", borderRadius: 16, marginBottom: "1.2rem", maxHeight: 400, objectFit: "cover" }} />
                        <div style={{ textAlign: "center" }}>
                            <p style={{ color: "#fff", marginBottom: "1.2rem", fontStyle: "italic" }}>yeayyy finally ketemuu sayanggg akuuuu! 🎉🥳</p>
                            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
                                <button onClick={() => setShowPhotoModal(true)} style={{ padding: "0.7rem 1.8rem", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 50, cursor: "pointer" }}>foto ulang</button>
                                <button onClick={handleDeletePhoto} style={{ padding: "0.7rem 1.8rem", background: "rgba(255,80,80,0.1)", color: "#ff8080", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 50, cursor: "pointer" }}>hapus foto</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden Input File */}
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handlePhotoUpload} />

            {/* Photo Modal */}
            {showPhotoModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#1a1a2e", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 28, padding: "3rem", textAlign: "center", maxWidth: 400, width: "90%" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
                        <h3 style={{ color: "#fff", marginBottom: "0.5rem", fontFamily: "'Playfair Display', serif" }}>upload foto kita bareng bukti ketemu ya!</h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>maksimal 1mb</p>
                        <button
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            style={{ padding: "1rem 2.5rem", background: "#fff", borderRadius: 50, fontWeight: 700, cursor: isUploading ? "not-allowed" : "pointer", width: "100%" }}
                        >
                            {isUploading ? "Sedang Mengirim..." : "📁 pilih foto"}
                        </button>
                        <br /><br />
                        {!isUploading && <button onClick={() => setShowPhotoModal(false)} style={{ color: "rgba(255,255,255,0.5)", background: "transparent", border: "none", cursor: "pointer" }}>nanti aja</button>}
                    </div>
                </div>
            )}

            {showSuccessPopup && <SuccessPopup onClose={() => setShowSuccessPopup(false)} />}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}