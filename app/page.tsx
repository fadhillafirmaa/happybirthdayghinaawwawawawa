"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// All photos for carousel
const photos = [
  "/photos/landing opage.jpg",
  "/photos/IMG-20251124-WA0021.jpg",
  "/photos/1770574576825.png",
  "/photos/IMG-20251124-WA0044.jpg",
  "/photos/031c8492-b57a-4343-9d97-772b8a9d0930.png",
  "/photos/18d245f9-d65f-4b5f-ade9-cc97eb68e274.png",
  "/photos/33bfbcc7-974e-4c73-a87d-7b7ffcdc30f3.png",
  "/photos/71d13802-5252-4f41-9f15-9878e16ad948.png",
  "/photos/89417f72-d86d-4805-b495-9945d7b5d138.png",
  "/photos/IMG-20251127-WA0041.jpg",
  "/photos/IMG_20251124_014430_841.webp",
  "/photos/a9c49dcd-860a-4ad7-82e3-dac1f8e15613.png",
  "/photos/media__1771436535067.jpg",
  "/photos/media__1771436535070.jpg",
  "/photos/media__1771436535074.jpg",
  "/photos/IMG_20260218_224926_268.webp",
  "/photos/monobox.png",
];

function makeRow(offset: number, reverse: boolean) {
  const shifted = [...photos.slice(offset), ...photos.slice(0, offset)];
  const base = reverse ? [...shifted].reverse() : shifted;
  return [...base, ...base];
}

const rows = [
  { data: makeRow(0, false), dir: "left", speed: 55 },
  { data: makeRow(3, true), dir: "right", speed: 48 },
  { data: makeRow(6, false), dir: "left", speed: 62 },
  { data: makeRow(9, true), dir: "right", speed: 44 },
  { data: makeRow(12, false), dir: "left", speed: 58 },
  { data: makeRow(2, true), dir: "right", speed: 50 },
  { data: makeRow(7, false), dir: "left", speed: 66 },
];

export default function Home() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <main className="lp-main">

      {/* ===== SECTION 1: HERO ===== */}
      <section className="lp-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/landing opage.jpg" alt="Ghina Birthday" className="lp-hero-bg" />
        <div className="lp-hero-overlay" />
        <div className="lp-hero-content">
          <div className="lp-date-top">March 17, 2026</div>
          <h1 className="lp-title">HAPPY<br />BIRTHDAY!</h1>
          <div className="lp-22nd">22nd</div>
          <button
            className="lp-scroll-btn"
            onClick={() => document.getElementById("section-two")?.scrollIntoView({ behavior: "smooth" })}
          >
            scroll down ↓
          </button>
        </div>
      </section>

      {/* ===== SECTION 2: DIAGONAL CAROUSEL ===== */}
      <section id="section-two" className="lp-carousel-section">
        <div className="lp-carousel-overlay" />
        <div className="lp-carousel-wrapper">
          {rows.map((row, i) => (
            <div className="lp-row" key={i}>
              <div
                className="lp-track"
                style={{
                  animationName: row.dir === "left" ? "scrollLeft" : "scrollRight",
                  animationDuration: `${row.speed}s`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                }}
              >
                {row.data.map((src, j) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={j} src={src} alt="" className="lp-photo-card" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="lp-carousel-text">
          <h2 className="lp-carousel-title">Happy Birthday sayangggg!!!</h2>
          <p className="lp-carousel-msg">
            selamat ulang tahun ya sayang, ini ulang tahun kamu yang pertama yang kita rayain bareng xixixi,
            i hope you doing good in the futures, lebih sehat, bangunnya jadi cepat,
            makannya semoga bisa dihabiskan (ga maksa, :p).
            apapun itu yang terbaik buat kamu sayang&nbsp;🤍 i love you so much
          </p>
        </div>
      </section>

      {/* ===== SECTION 3: 5 THINGS INTRO ===== */}
      <section className="lp-things-intro">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/031c8492-b57a-4343-9d97-772b8a9d0930.png" alt="5 things" className="lp-full-bg" />
        <div className="lp-dark-overlay" />
        <div className="lp-things-intro-content">
          <p className="lp-things-label">a letter for you ✦</p>
          <h2 className="lp-things-heading">5 things<br />i love<br />about you</h2>
        </div>
      </section>

      {/* ===== SECTION 4: #1 Excited ===== */}
      <section className="lp-love-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/excited.jpeg" alt="Excited" className="lp-full-bg lp-bg-dim" />
        <div className="lp-love-content lp-content-left">
          <span className="lp-num-tag">01</span>
          <h3 className="lp-love-title">Anaknya Excited Banget</h3>
          <p className="lp-love-text">
            pas kamu nyeritain sesuatu atau aku nyeritain sesuatu reaksi nya excited bangettt,
            responnya juga lucuwuwuw jadi aku merasa di hargai banget setiap aku cerita.
            apalagi kalau kamu minta tilipun itu aku seneng bangettt nyehehehe
          </p>
        </div>
      </section>

      {/* ===== SECTION 5: #2 Gemas ===== */}
      <section className="lp-love-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/gemas.jpg" alt="Gemas" className="lp-full-bg lp-bg-dim" />
        <div className="lp-dark-overlay lp-overlay-heavy" />
        <div className="lp-love-content lp-content-right">
          <span className="lp-num-tag">02</span>
          <h3 className="lp-love-title">gemas bangetttttttzz</h3>
          <p className="lp-love-text">
            Beneran deh, kamu tuh emang aslinya lucu banget. dari cara kamu ngomong, bercanda,
            dan kalau lagi ngambek dikit pun malah makin gemas, pas awawawawawawa lucu juga
            MENG GE MAS KAN BA NGET AWAWAWAWAWAW hiiiih gemas aku tau ndak (.\_/.)
          </p>
        </div>
      </section>

      {/* ===== SECTION 6: #3 Parfum ===== */}
      <section className="lp-love-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/18d245f9-d65f-4b5f-ade9-cc97eb68e274.png" alt="Wangi" className="lp-full-bg lp-bg-dim" />
        <div className="lp-dark-overlay lp-overlay-heavy" />
        <div className="lp-love-content lp-content-left">
          <span className="lp-num-tag">03</span>
          <h3 className="lp-love-title">Parfumnya Wangi</h3>
          <p className="lp-love-text">
            aku suka banget sama wanginya plis tolong help, wangi alchemist powder powder apa itu namanya aku lupa hehe
            bawaannya pengen aku pelukkkkkk. kalau ada aku ke ohsome aku pasti cari parfum itu pas magang kemarinnn
            karena aku kangenzzzz
          </p>
        </div>
      </section>

      {/* ===== SECTION 7: #4 Tulus ===== */}
      <section className="lp-love-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/tulus.jpg" alt="Tulus" className="lp-full-bg lp-bg-dim" />
        <div className="lp-dark-overlay lp-overlay-heavy" />
        <div className="lp-love-content lp-content-center">
          <span className="lp-num-tag">04</span>
          <h3 className="lp-love-title">Tulus</h3>
          <p className="lp-love-text">
            dimataku kamu tulus bangettt,kayak peduli bgttt sama aku,
            inget aku paskita tilipun dulu tbtb kamu nangis karena kamu make sure aku sayang ga sama kamu
            jelas la sayang, masa aku nda sayang siii, pas itu aku ngerasa di hargain bgttt itu aku gabakal lupa tu
            masi ada poto pas kamu abis nangis tu sama aku nyeheheheh
          </p>
        </div>
      </section>

      {/* ===== SECTION 8: #5 Cantik ===== */}
      <section className="lp-love-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/cantik.jpg" alt="Cantik" className="lp-full-bg lp-bg-dim" />
        <div className="lp-dark-overlay lp-overlay-heavy" />
        <div className="lp-love-content lp-content-left">
          <span className="lp-num-tag">05</span>
          <h3 className="lp-love-title">Cantik Banget</h3>
          <p className="lp-love-text">
            ti dak per lu di ta nya la gi, cantikna keterlaluann tapi cantiknya
            nda dari luar aja, tapi dari dalam juga (anzayyyy). setiap pegi sama mu,
            bawaannya senangggg aja terusss xixixixi love you sayanggggggg.
          </p>
        </div>
      </section>

      {/* ===== SECTION 9: GAME PROMPT ===== */}
      <section className="lp-game-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/71d13802-5252-4f41-9f15-9878e16ad948.png"
          alt="game bg"
          className="lp-full-bg lp-bg-dim"
        />
        <div className="lp-dark-overlay lp-overlay-heavy" />

        <div className="lp-game-content">
          <p className="lp-game-label">psst, ada sesuatu buat kamu ✨</p>
          <h2 className="lp-game-title">mau main<br /><em>game</em> ga?</h2>
          <div className="lp-game-btns">
            <button className="lp-btn-yes" onClick={() => router.push("/game")}>
              mauu
            </button>
            <button className="lp-btn-no" onClick={() => setShowPopup(true)}>
              ngga mau
            </button>
          </div>
        </div>

        {/* POPUP */}
        {showPopup && (
          <div className="lp-popup-overlay" onClick={() => setShowPopup(false)}>
            <div className="lp-popup-box" onClick={e => e.stopPropagation()}>
              <div className="lp-popup-emoji">🥺</div>
              <p className="lp-popup-text">mau dong plissss</p>
              <div className="lp-popup-btns">
                <button className="lp-btn-yes" onClick={() => router.push("/game")}>
                  oke deh mauu
                </button>
                <button className="lp-btn-no-sm" onClick={() => setShowPopup(false)}>
                  nanti aja
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #000; overflow-x: hidden; scroll-behavior: smooth; }
        .lp-main { font-family: 'Playfair Display', 'Georgia', serif; background: #000; }

        /* ===== HERO ===== */
        .lp-hero {
          position: relative; width: 100%; height: 100vh;
          overflow: hidden; display: flex; align-items: center;
        }
        .lp-hero-bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center center;
          filter: brightness(0.72); z-index: 0;
        }
        .lp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(105deg,
            rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0.04) 100%);
          z-index: 1;
        }
        .lp-hero-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          align-items: flex-start; justify-content: center;
          padding: 0 6vw; height: 100%; gap: 0.4rem;
        }
        .lp-date-top {
          font-size: clamp(0.7rem, 1.4vw, 0.95rem);
          color: rgba(255,255,255,0.72); letter-spacing: 3px;
          text-transform: uppercase; margin-bottom: 0.8rem;
          animation: fadeInUp 1s ease 0.2s both;
        }
        .lp-title {
          font-family: 'Playfair Display', serif; font-weight: 900;
          font-size: clamp(3.5rem, 8.5vw, 8rem); line-height: 0.92;
          color: #fff; letter-spacing: 3px; text-transform: uppercase;
          text-shadow: 0 6px 40px rgba(0,0,0,0.6);
          animation: fadeInUp 1s ease 0.4s both;
        }
        .lp-22nd {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(3rem, 7vw, 6.5rem);
          color: rgba(255,255,255,0.88);
          text-shadow: 0 4px 30px rgba(0,0,0,0.5);
          margin-top: 0.4rem; animation: fadeInUp 1s ease 0.6s both;
        }
        .lp-scroll-btn {
          margin-top: 2.5rem; background: none; border: none;
          color: rgba(255,255,255,0.55); font-size: 0.8rem;
          letter-spacing: 3px; text-transform: uppercase;
          cursor: pointer; font-family: 'Playfair Display', serif;
          animation: fadeInUp 1s ease 0.9s both; transition: color 0.3s;
        }
        .lp-scroll-btn:hover { color: #fff; }

        /* ===== CAROUSEL SECTION ===== */
        .lp-carousel-section {
          position: relative; width: 100%; height: 100vh;
          overflow: hidden; display: flex;
          align-items: center; justify-content: center; background: #080808;
        }
        .lp-carousel-wrapper {
          position: absolute; top: 50%; left: 50%;
          width: 170%; height: 170%;
          transform: translate(-50%, -50%) rotate(-12deg);
          display: flex; flex-direction: column;
          justify-content: space-evenly; gap: 14px; padding: 8px 0;
        }
        .lp-row { overflow: visible; width: 100%; flex-shrink: 0; }
        .lp-track { display: flex; gap: 14px; width: max-content; will-change: transform; }
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .lp-photo-card {
          width: 280px; height: 190px; object-fit: cover; border-radius: 12px;
          flex-shrink: 0; filter: brightness(0.58) saturate(0.68);
          border: 2px solid rgba(255,255,255,0.06); transition: filter 0.4s ease;
        }
        .lp-photo-card:hover { filter: brightness(0.88) saturate(1.05); }
        .lp-carousel-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.50); z-index: 5; pointer-events: none;
        }
        .lp-carousel-text {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; gap: 1.2rem;
          padding: 2.5rem 2rem; max-width: 680px;
        }
        .lp-carousel-title {
          font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700;
          font-size: clamp(2.4rem, 5.5vw, 5rem); color: #fff; line-height: 1.1;
          text-shadow: 0 4px 50px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7); letter-spacing: 1px;
        }
        .lp-carousel-msg {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(0.9rem, 1.6vw, 1.15rem); color: rgba(255,255,255,0.88);
          line-height: 1.9; text-shadow: 0 2px 20px rgba(0,0,0,0.9); max-width: 560px;
        }

        /* ===== SHARED HELPERS ===== */
        .lp-full-bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center; z-index: 0;
        }
        .lp-bg-dim { filter: brightness(0.82) saturate(0.9); }
        .lp-dark-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.25); z-index: 1;
        }
        .lp-overlay-heavy { background: rgba(0,0,0,0.42); }

        /* ===== SECTION 3: 5 THINGS INTRO ===== */
        .lp-things-intro {
          position: relative; width: 100%; height: 100vh;
          overflow: hidden; display: flex; align-items: center;
        }
        .lp-things-intro-content {
          position: relative; z-index: 10; padding: 0 7vw;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .lp-things-label {
          font-size: clamp(0.75rem, 1.4vw, 0.95rem);
          color: rgba(255,255,255,0.65); letter-spacing: 4px;
          text-transform: uppercase; font-style: italic;
          animation: fadeInUp 1s ease 0.2s both;
        }
        .lp-things-heading {
          font-family: 'Playfair Display', serif; font-weight: 900; font-style: italic;
          font-size: clamp(4rem, 11vw, 10rem); line-height: 0.9; color: #fff;
          text-transform: lowercase; text-shadow: 0 6px 50px rgba(0,0,0,0.7);
          letter-spacing: -1px; animation: fadeInUp 1s ease 0.4s both;
        }

        /* ===== SECTIONS 4–8: LOVE ITEMS ===== */
        .lp-love-section {
          position: relative; width: 100%; height: 100vh;
          overflow: hidden; display: flex; align-items: center;
        }
        .lp-love-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .lp-content-left {
          align-items: flex-start; text-align: left;
          padding: 0 7vw; max-width: 55vw;
        }
        .lp-content-right {
          align-items: flex-end; text-align: right;
          margin-left: auto; padding: 0 7vw; max-width: 55vw;
        }
        .lp-content-center {
          align-items: center; text-align: center;
          margin: 0 auto; padding: 0 5vw; max-width: 60vw;
        }
        .lp-num-tag {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(4rem, 9vw, 8rem);
          color: rgba(255,255,255,0.18); line-height: 1;
          letter-spacing: -2px; user-select: none;
          animation: fadeInUp 1s ease 0.1s both;
        }
        .lp-love-title {
          font-family: 'Playfair Display', serif; font-weight: 700;
          font-size: clamp(2.2rem, 5vw, 4.5rem); color: #fff; line-height: 1.05;
          text-shadow: 0 4px 40px rgba(0,0,0,0.8); animation: fadeInUp 1s ease 0.25s both;
        }
        .lp-love-text {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(0.95rem, 1.6vw, 1.18rem); color: rgba(255,255,255,0.85);
          line-height: 1.9; text-shadow: 0 2px 20px rgba(0,0,0,0.9); max-width: 540px;
          animation: fadeInUp 1s ease 0.4s both;
        }

        /* ===== SECTION 9: GAME PROMPT ===== */
        .lp-game-section {
          position: relative; width: 100%; height: 100vh;
          overflow: hidden; display: flex;
          align-items: center; justify-content: center;
        }
        .lp-game-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; text-align: center; gap: 1.5rem; padding: 2rem;
        }
        .lp-game-label {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(0.8rem, 1.5vw, 1rem);
          color: rgba(255,255,255,0.65); letter-spacing: 3px;
          text-transform: uppercase;
        }
        .lp-game-title {
          font-family: 'Playfair Display', serif; font-weight: 900;
          font-size: clamp(3rem, 8vw, 7rem); line-height: 1; color: #fff;
          text-shadow: 0 6px 40px rgba(0,0,0,0.7);
        }
        .lp-game-title em { font-style: italic; }
        .lp-game-btns {
          display: flex; gap: 1.2rem; flex-wrap: wrap;
          justify-content: center; margin-top: 1rem;
        }

        /* YES button */
        .lp-btn-yes {
          padding: 1rem 2.8rem;
          background: #fff; color: #111;
          border: none; border-radius: 50px;
          font-size: 1.05rem; font-weight: 700;
          font-family: 'Playfair Display', serif;
          cursor: pointer; transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(255,255,255,0.25);
        }
        .lp-btn-yes:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 40px rgba(255,255,255,0.35);
        }

        /* NO button */
        .lp-btn-no {
          padding: 1rem 2.8rem;
          background: transparent; color: rgba(255,255,255,0.7);
          border: 2px solid rgba(255,255,255,0.35); border-radius: 50px;
          font-size: 1.05rem; font-weight: 600;
          font-family: 'Playfair Display', serif;
          cursor: pointer; transition: all 0.3s ease;
        }
        .lp-btn-no:hover { color: #fff; border-color: rgba(255,255,255,0.7); }

        /* ===== POPUP ===== */
        .lp-popup-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeInUp 0.3s ease both;
        }
        .lp-popup-box {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 24px; padding: 3rem 2.5rem;
          max-width: 420px; width: 90%;
          display: flex; flex-direction: column;
          align-items: center; gap: 1.2rem; text-align: center;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .lp-popup-emoji { font-size: 4rem; animation: wiggle 1s ease-in-out infinite; }
        @keyframes wiggle {
          0%,100% { transform: rotate(-8deg); }
          50%      { transform: rotate(8deg); }
        }
        .lp-popup-text {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 700;
          color: #fff; text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }
        .lp-popup-btns {
          display: flex; flex-direction: column; gap: 0.8rem;
          width: 100%; margin-top: 0.5rem;
        }
        .lp-btn-no-sm {
          background: transparent; color: rgba(255,255,255,0.5); border: none;
          font-size: 0.85rem; cursor: pointer; font-style: italic;
          font-family: 'Playfair Display', serif; transition: color 0.3s;
        }
        .lp-btn-no-sm:hover { color: rgba(255,255,255,0.8); }

        /* ===== ANIMATIONS ===== */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .lp-title  { font-size: clamp(2.8rem, 11vw, 5rem); }
          .lp-22nd   { font-size: clamp(2.2rem, 8vw, 4rem); }
          .lp-photo-card { width: 180px; height: 120px; }
          .lp-carousel-wrapper { width: 230%; height: 230%; gap: 10px; }
          .lp-love-content { max-width: 90vw; padding: 0 1.5rem; }
          .lp-love-title { font-size: clamp(2rem, 8vw, 3.5rem); }
          .lp-love-text  { font-size: 0.95rem; }
          .lp-things-heading { font-size: clamp(3.5rem, 14vw, 7rem); }
          .lp-game-title { font-size: clamp(2.5rem, 10vw, 5rem); }
        }
      `}</style>
    </main>
  );
}
