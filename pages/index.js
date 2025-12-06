// pages/index.js
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* Animations */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

// relationship start date
const START_DATE = new Date("2025-02-16T00:00:00");

const calculateTimeTogether = () => {
  const now = new Date();
  const diffMs = now - START_DATE;

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
};

const WRONG_MESSAGES = [
  "Oops 😜 Ye nahi tha…aap galat ho gaye. 🤭",
  "Almost! 👀 Surprise thoda aur aage chhupa hai. ❤️",
];

const letterText = `My Dearest Person,

I don’t know what I mean to you, but you mean something truly special to me.
In just one year, you’ve filled my life with so much warmth, laughter, and happiness.
After three long years, I found myself trusting someone deeply again—and that someone is you.

I don’t hold expectations, only hope—hope that we continue this journey and choose each other in the years to come.
If I ever make mistakes or say something unintentionally, please forgive me.
And if I ever hurt or disturb you, please talk to me—don’t walk away in silence. I promise I’ll understand.

Thank you for staying.
Thank you for every little moment we share. 💗

Happy One Year of Togetherness ❤️
Always grateful. Always yours.`;

export default function Home() {
  const totalSlides = 7; // 0..6

  const [slide, setSlide] = useState(0);
  const [heartBoom, setHeartBoom] = useState(false);
  const [timeTogether] = useState(calculateTimeTogether());
  const [displayDays, setDisplayDays] = useState(0);

  // game
  const winningIndex = 2;
  const [clickedIndex, setClickedIndex] = useState(null);

  // celebration
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHeartRain, setShowHeartRain] = useState(false);

  // hero loading
  const [isIntroLoading, setIsIntroLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // letter typing
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  const [showReadButton, setShowReadButton] = useState(false);

  // ending slide
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [photoFlipped, setPhotoFlipped] = useState(false);

  const [letterVisible, setLetterVisible] = useState(false); // slide 3 ke liye

  // sounds
  const audioRef = useRef(null); // typing
  const yayAudioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const whooshRef = useRef(null);
  const tickRef = useRef(null);
  const dingRef = useRef(null);
  const wrongRef = useRef(null);
  const correctRef = useRef(null);
  const finishRef = useRef(null);
  const paperRef = useRef(null);
  const popRef = useRef(null);
  const flipRef = useRef(null);
  const bellRef = useRef(null);

  /* helpers */
  const play = (ref) => {
    if (!ref?.current) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  };

  const playClickSound = () => play(clickAudioRef);

  /* HERO LOADING (slide 0) */
  useEffect(() => {
    if (!isIntroLoading) return;

    setLoadingProgress(0);
    const totalDuration = 10000;
    const steps = 200;
    const stepTime = totalDuration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const next = Math.min(100, Math.round((step / steps) * 100));
      setLoadingProgress(next);

      play(tickRef);

      if (next >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsIntroLoading(false);
          setSlide(1);
        }, 400);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isIntroLoading]);

  /* slide 0 whoosh */
  useEffect(() => {
    if (slide === 0) play(whooshRef);
  }, [slide]);

  /* SLIDE 1 COUNTER */
  useEffect(() => {
    if (slide !== 1) return;

    const target = Math.max(0, timeTogether.days || 0);
    setDisplayDays(0);

    let current = 0;
    const duration = 1200;
    const frameTime = 25;
    const totalFrames = Math.max(1, Math.floor(duration / frameTime));
    const increment = Math.max(1, Math.floor(target / totalFrames));

    const id = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(id);
        play(dingRef);
      }
      setDisplayDays(current);
    }, frameTime);

    return () => clearInterval(id);
  }, [slide, timeTogether.days]);

  /* SLIDE 3 yay sound */
  useEffect(() => {
    if (slide === 3) play(yayAudioRef);
  }, [slide]);

  /* SLIDE 3 – delay for "Read My Message" button */
  useEffect(() => {
    if (slide === 3) {
      setShowReadButton(false);
      const t = setTimeout(() => setShowReadButton(true), 2000);
      return () => clearTimeout(t);
    }
  }, [slide]);

  /* SLIDE 5 LETTER TYPEWRITER */
  useEffect(() => {
    if (slide !== 5) {
      setTypedText("");
      setTypingDone(false);
      if (audioRef.current) {
        audioRef.current.loop = false;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const text = letterText;
    let i = 0;

    setTypedText("");
    setTypingDone(false);

    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const interval = setInterval(() => {
      i += 1;
      setTypedText(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(interval);

        if (audioRef.current) {
          audioRef.current.loop = false;
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        setTypingDone(true);
        play(finishRef);
      }
    }, 45);

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.loop = false;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [slide]);

  /* SLIDE 6 sounds */
  useEffect(() => {
    if (envelopeOpened) play(popRef);
  }, [envelopeOpened]);

  useEffect(() => {
    if (photoFlipped) play(bellRef);
  }, [photoFlipped]);

  useEffect(() => {
    if (slide === 6) {
      setEnvelopeOpened(false);
      setPhotoFlipped(false);
    }
  }, [slide]);

  /* handlers */
  const nextWithHeart = () => {
    if (slide >= totalSlides - 1) return;
    setHeartBoom(true);
    setTimeout(() => {
      setHeartBoom(false);
      setSlide((s) => Math.min(s + 1, totalSlides - 1));
    }, 600);
  };

  const handleHeroHeartClick = () => {
    if (slide === 0) {
      if (!isIntroLoading) {
        setIsIntroLoading(true);
        setHeartBoom(false);
      }
    } else {
      nextWithHeart();
    }
  };

  const handleCardClick = (index) => {
    setClickedIndex(index);

    if (index === winningIndex) {
      play(correctRef);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
    } else {
      play(wrongRef);
      setShowCelebration(false);
    }
  };

  const handleSendLove = () => {
    playClickSound();
    setShowHeartRain(true);
    setShowCelebration(true);
    setTimeout(() => {
      setShowHeartRain(false);
      setShowCelebration(false);
      setSlide(6); // last slide
    }, 2500);
  };

  const isWinner = clickedIndex === winningIndex;
  const isFlipped = clickedIndex !== null;

  /* UI */

  return (
    <div className="page">
      <div className="bg-glow" />
      <div className="stars" />

      <main className="main slides">
        <div className="slide-wrapper">

          {/* SLIDE 0 */}
          {slide === 0 && (
            <section
              className="hero"
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: "10px",
                padding: "0 14px",
                overflow: "hidden",
              }}
            >
              <motion.h1
                variants={fadeUp}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                style={{
                  fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                  lineHeight: 1.1,
                  fontWeight: 700,
                  color: "#ff8acb",
                  marginBottom: "4px",
                }}
              >
                Something Sweet Is Loading....
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.4, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{ fontSize: "3rem" }}
              >
                💗
              </motion.div>

              <motion.p
                variants={fadeUp}
                style={{
                  marginTop: "-6px",
                  fontSize: "0.85rem",
                  opacity: 0.9,
                }}
              >
                I made something special for you !!
              </motion.p>

              {isIntroLoading && (
                <div
                  style={{
                    marginTop: "26px",
                    width: "80%",
                    maxWidth: "520px",
                  }}
                >
                  <div className="love-loader-track">
                    <div
                      className="love-loader-fill"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "0.9rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#fecaca",
                    }}
                  >
                    Loading something sweet… {loadingProgress}%
                  </p>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{ marginTop: "24px" }}
              >
                <img
                  src="/intro.gif"
                  alt="Cute intro"
                  style={{
                    width: "170px",
                    height: "170px",
                    objectFit: "contain",
                  }}
                />
              </motion.div>
            </section>
          )}

          {/* SLIDE 1 */}
          {slide === 1 && (
            <section className="section anniv-full">
              <motion.div
                className="anniv-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                <motion.div className="anniv-gif-circle" variants={fadeUp}>
                  <img src="/anniversary.gif" alt="Anniversary cute" />
                </motion.div>

                <motion.p className="anniv-title-main" variants={fadeUp}>
                  Happy One Year Of Togetherness!
                </motion.p>

                <motion.p className="anniv-title-name" variants={fadeUp}>
                  Sir
                </motion.p>

                <motion.p className="anniv-subtext" variants={fadeUp}>
                  We&apos;ve been together for
                </motion.p>

                <motion.div className="anniv-days-wrap" variants={fadeUp}>
                  <span className="anniv-sparkle">✨</span>
                  <span className="anniv-days-number">{displayDays}</span>
                  <span className="anniv-sparkle">✨</span>
                </motion.div>

                <motion.p
                  className="anniv-subtext bottom"
                  variants={fadeUp}
                >
                  days and counting…
                </motion.p>
              </motion.div>
            </section>
          )}

          {/* SLIDE 2 - GAME */}
          {slide === 2 && (
            <section className="section anniv-full">
              <motion.div
                className="anniv-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                <motion.p
                  className="section-label"
                  variants={fadeUp}
                  style={{ marginBottom: "0.6rem" }}
                >
                  A Little Game
                </motion.p>

                <motion.h2
                  variants={fadeUp}
                  style={{
                    marginBottom: "1rem",
                    fontSize: "clamp(2rem, 3.4vw, 2.4rem)",
                    fontWeight: 800,
                    color: "#ff8acb",
                  }}
                >
                  Find the Real Surprise 🎁
                </motion.h2>

                <motion.p
                  className="section-text"
                  variants={fadeUp}
                  style={{ marginBottom: "1.4rem" }}
                >
                  Teen cards, ek hi asli surprise…Let&apos;s see how strong your
                  guess is. 😏💕
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "1rem",
                    marginBottom: "1.8rem",
                  }}
                >
                  {[0, 1, 2].map((i) => {
                    const isThisClicked = clickedIndex === i;
                    const bg = isThisClicked
                      ? "linear-gradient(135deg,#4b5563,#111827)"
                      : "linear-gradient(135deg,#1f2937,#111827)";
                    const shadow = isThisClicked
                      ? "0 0 18px rgba(75,85,99,0.9)"
                      : "0 0 12px rgba(15,23,42,0.9)";
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => {
                          playClickSound();
                          handleCardClick(i);
                        }}
                        style={{
                          border: "none",
                          outline: "none",
                          cursor: "pointer",
                          borderRadius: "22px",
                          padding: "1.1rem 0.8rem",
                          background: bg,
                          boxShadow: shadow,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1.6rem",
                            marginBottom: "0.4rem",
                          }}
                        >
                          💌
                        </span>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          Card {i + 1}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>

                {/* big flip result card */}
                <div
                  style={{
                    marginTop: "0.4rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "520px",
                      perspective: "1400px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "240px",
                        transformStyle: "preserve-3d",
                        transform: isFlipped
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                        transition:
                          "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
                      }}
                    >
                      {/* front */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "26px",
                          background:
                            "linear-gradient(135deg,#020617,#111827)",
                          boxShadow: "0 20px 45px rgba(15,23,42,0.9)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "2.2rem",
                            marginBottom: "0.6rem",
                          }}
                        >
                          💌
                        </span>
                        <span style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                          Kisi bhi card pe click karo…
                        </span>
                      </div>

                      {/* back */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "26px",
                          background: isWinner
                            ? "linear-gradient(135deg,#ec4899,#a855ff)"
                            : "linear-gradient(135deg,#020617,#111827)",
                          boxShadow: isWinner
                            ? "0 24px 60px rgba(236,72,153,0.8)"
                            : "0 18px 40px rgba(15,23,42,0.9)",
                          padding: "1.6rem 1.8rem",
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          color: "#fff",
                        }}
                      >
                        {clickedIndex === null ? (
                          <p style={{ fontSize: "1rem", opacity: 0.9 }}>
                            Pehle upar se koi card choose karo. 💖
                          </p>
                        ) : isWinner ? (
                          <>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                opacity: 0.9,
                                marginBottom: "0.4rem",
                              }}
                            >
                              You found it! 🎉
                            </p>
                            <p
                              style={{
                                fontSize: "1.4rem",
                                fontWeight: 700,
                                marginBottom: "0.6rem",
                              }}
                            >
                              SURPRISE 😘
                            </p>
                            <p
                              style={{
                                fontSize: "1rem",
                                lineHeight: 1.6,
                                marginBottom: "0.6rem",
                              }}
                            >
                              You win:
                              <br />✅ Unlimited kisses today 💋
                              <br />✅ Mood = romance mode ON 🤭
                              <br />✅ Your wish = my command 😉
                            </p>
                            <button
                              onClick={() => {
                                playClickSound();
                                setSlide(3);
                              }}
                              style={{
                                marginTop: "0.2rem",
                                padding: "0.7rem 2.4rem",
                                borderRadius: "999px",
                                border: "none",
                                background:
                                  "linear-gradient(90deg,#a855ff,#ec4899)",
                                color: "#fff",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Claim now 💕
                            </button>
                          </>
                        ) : (
                          <>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                opacity: 0.8,
                                marginBottom: "0.35rem",
                              }}
                            >
                              Not this one… 😉
                            </p>
                            <p
                              style={{
                                fontSize: "1.02rem",
                                lineHeight: 1.6,
                                color: "#e5e7eb",
                              }}
                            >
                              {
                                WRONG_MESSAGES[
                                  clickedIndex % WRONG_MESSAGES.length
                                ]
                              }
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          )}

          {/* SLIDE 3 - cat + Read My Message */}
          {slide === 3 && (
            <section className="section">
              <motion.div
                className="section-inner message-card"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}
              >
                <motion.h2
                  variants={fadeUp}
                  style={{
                    fontSize: "clamp(2rem, 3.6vw, 2.6rem)",
                    fontWeight: 800,
                    marginBottom: "1.4rem",
                    textAlign: "center",
                    color: "#ff8acb",
                  }}
                >
                  You claimed your surprise 🎉
                </motion.h2>

                <motion.div
                  variants={fadeUp}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1.2rem",
                  }}
                >
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "999px",
                      background:
                        "radial-gradient(circle at 50% 30%, #111827, #020617)",
                      boxShadow: "0 0 35px rgba(248,113,113,0.55)",
                      display: "inline-flex",
                    }}
                  >
                    <img
                      src="/cute-cat.gif"
                      alt="Happy cat"
                      style={{
                        width: "190px",
                        height: "190px",
                        borderRadius: "999px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </motion.div>

                {showReadButton && (
                  <motion.div
                    variants={fadeUp}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      marginTop: "1.8rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        playClickSound();
                        setLetterVisible(false);
                        setSlide(4);
                      }}
                      style={{
                        border: "none",
                        outline: "none",
                        padding: "1rem 3.2rem",
                        borderRadius: "999px",
                        background: "#f973b8",
                        boxShadow: "0 18px 40px rgba(236,72,153,0.55)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.6rem",
                      }}
                    >
                      Read My Message{" "}
                      <span style={{ fontSize: "1.3rem" }}>💌</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>

              <div className="fireworks">
                <div className="firework f1" />
                <div className="firework f2" />
                <div className="firework f3" />
                <div className="firework f4" />
              </div>
            </section>
          )}

          {/* SLIDE 4 - For My Man card only */}
          {slide === 4 && (
            <section className="section anniv-full">
              <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ maxWidth: "640px" }}
              >
                <motion.h2
                  variants={fadeUp}
                  style={{
                    fontSize: "clamp(2rem, 3.4vw, 2.6rem)",
                    fontWeight: 800,
                    marginBottom: "1.4rem",
                    textAlign: "center",
                    color: "#a855f7",
                  }}
                >
                  A Special Message For You 📩
                </motion.h2>

                <motion.div
                  variants={fadeUp}
                  onClick={() => {
                    playClickSound();
                    setSlide(5);
                  }}
                  style={{
                    margin: "2rem auto 0",
                    maxWidth: "460px",
                    padding: "1.9rem 2.1rem",
                    borderRadius: "28px",
                    background:
                      "linear-gradient(135deg,#ffe9f4,#fdf2ff,#ffe4e6)",
                    boxShadow: "0 12px 28px rgba(248, 187, 208, 0.35)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <motion.div
                    style={{
                      width: "76px",
                      height: "60px",
                      borderRadius: "22px",
                      background: "linear-gradient(145deg,#ffffff,#ffe4f0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 22px rgba(148,163,184,0.5)",
                      marginBottom: "0.4rem",
                    }}
                    animate={{ scale: [1, 1.12, 1] }} // pulse
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  >
                    <span style={{ fontSize: "3rem" }}>💌</span>
                  </motion.div>

                  <p
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#ec4899",
                    }}
                  >
                    For My Man
                  </p>

                  <p
                    style={{
                      fontSize: "0.98rem",
                      color: "#6b7280",
                      marginTop: "0.2rem",
                    }}
                  >
                    Click to read my message
                  </p>
                </motion.div>
              </motion.div>
            </section>
          )}

          {/* SLIDE 5 – LETTER */}
          {slide === 5 && (
            <section className="section anniv-full">
              <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ maxWidth: "640px" }}
              >
                {/* Title */}
                <motion.h2
                  variants={fadeUp}
                  style={{
                    fontSize: "clamp(2rem, 3.4vw, 2.6rem)",
                    fontWeight: 800,
                    marginBottom: "1.4rem",
                    textAlign: "center",
                    color: "#ff8acb",
                  }}
                >
                  This Is Just For You <span style={{ fontSize: "2rem" }}>💌</span>
                </motion.h2>

                {/* LETTER CARD */}
                <motion.div
                  variants={fadeUp}
                  style={{
                    background: "linear-gradient(135deg,#ffeaf4,#fdf2ff,#ffe4e6)",
                    borderRadius: "28px",
                    boxShadow: "0 14px 38px rgba(248,187,208,0.55)",
                    padding: "1.9rem 2.1rem 2.3rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* soft floating hearts background */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      opacity: 0.22,
                      fontSize: "1.3rem",
                    }}
                  >
                    <span style={{ position: "absolute", top: "12%", left: "10%" }}>
                      💗
                    </span>
                    <span style={{ position: "absolute", top: "18%", right: "14%" }}>
                      💜
                    </span>
                    <span style={{ position: "absolute", bottom: "18%", left: "18%" }}>
                      💖
                    </span>
                    <span style={{ position: "absolute", bottom: "10%", right: "8%" }}>
                      💘
                    </span>
                  </div>

                  {/* MAIN LETTER CONTENT – typed text */}
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <p
                      style={{
                        marginTop: "0.4rem",
                        maxHeight: "260px",       // pehle jaisa scrollbar
                        overflowY: "auto",
                        paddingRight: "0.4rem",
                        fontSize: "1rem",
                        lineHeight: 1.7,
                        color: "#4b5563",
                        textAlign: "center",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {typedText}
                    </p>
                  </div>

                  {/* Signature + heart AFTER typing completes */}
                  {typingDone && (
                    <>
                      <div
                        style={{
                          marginTop: "1.6rem",
                          fontSize: "1.02rem",
                          fontWeight: 600,
                          color: "#ec4899",
                          textAlign: "center",
                        }}
                      >
                        — Tanuja 💌
                      </div>
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "1.8rem",
                          textAlign: "center",
                        }}
                      >
                        💖
                      </div>
                    </>
                  )}
                </motion.div>

                {/* SEND LOVE BUTTON – AB PEHLE JAISE HAMESHA DIKHEGA */}
                <motion.button
                  variants={fadeUp}
                  onClick={() => {
                    playClickSound();
                    handleSendLove();
                  }}
                  style={{
                    marginTop: "2rem",
                    padding: "0.95rem 3.1rem",
                    borderRadius: "999px",
                    border: "none",
                    outline: "none",
                    background: "linear-gradient(90deg,#22c55e,#4ade80,#a855ff)",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 16px 40px rgba(34,197,94,0.58)",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  Send Love ♥
                </motion.button>
              </motion.div>
            </section>
          )}


          {/* SLIDE 6 - ENDING ENVELOPE + PHOTO */}
          {slide === 6 && (
            <section className="section anniv-full">
              <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ maxWidth: "640px", textAlign: "center" }}
              >
                {/* 👉 ye dono text sirf tab dikhte hain jab envelope open nahi hua ho */}
                {!envelopeOpened && (
                  <>
                    <motion.p
                      variants={fadeUp}
                      style={{
                        fontSize: "1rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#f9a8d4",
                        marginBottom: "0.8rem",
                      }}
                    >
                      One last little surprise
                    </motion.p>

                    <motion.h2
                      variants={fadeUp}
                      style={{
                        fontSize: "clamp(2rem, 3.2vw, 2.5rem)",
                        fontWeight: 800,
                        marginBottom: "1.6rem",
                        color: "#ff8acb",
                      }}
                    >
                      Open This Envelope 💌
                    </motion.h2>
                  </>
                )}

                {/* envelope / photo area */}
                {!envelopeOpened ? (
                  <motion.div
                    variants={fadeUp}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{
                      opacity: 1,
                      scale: [1, 1.05, 1],
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                    onClick={() => {
                      play(paperRef);
                      playClickSound();
                      setEnvelopeOpened(true);
                    }}
                    style={{
                      margin: "0 auto",
                      width: "260px",
                      height: "180px",
                      borderRadius: "24px",
                      background: "linear-gradient(135deg,#111827,#020617)",
                      boxShadow: "0 20px 45px rgba(12, 21, 42, 0.9)",
                      position: "relative",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                        background: "linear-gradient(135deg,#1f2937,#020617)",
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: "40%",
                        background: "linear-gradient(135deg,#020617,#111827)",
                      }}
                    />
                    {/* heart seal with pulse */}
                    <motion.div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        width: "54px",
                        height: "54px",
                        borderRadius: "999px",
                        background:
                          "radial-gradient(circle at 30% 20%,#fecaca,#fb7185)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 12px 30px rgba(248,113,113,0.65)",
                      }}
                      animate={{
                        scale: [1, 1.03, 1],
                        y: [0, -1.5, 0],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }}
                    >
                      <span style={{ fontSize: "1.8rem" }}>💗</span>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4, y: 40 }}
                    animate={{
                      opacity: 1,
                      scale: [0.4, 1.1, 1],
                      y: [40, -6, 0],
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      margin: "0 auto",
                      marginTop: "1rem",
                      width: "360px",
                      height: "440px",
                      perspective: "1200px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: "-40px",
                        borderRadius: "36px",
                        background:
                          "radial-gradient(circle, rgba(255,150,200,0.5), rgba(255,150,200,0))",
                        filter: "blur(26px)",
                        animation: "pulseGlow 3s ease-in-out infinite",
                        zIndex: 0,
                      }}
                    />
                    <div
                      onClick={() => {
                        play(flipRef);
                        playClickSound();
                        setPhotoFlipped((prev) => !prev);
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        transformStyle: "preserve-3d",
                        transform: photoFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        transition:
                          "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                    >
                      {/* front photo */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "24px",
                          overflow: "hidden",
                          boxShadow: "0 20px 45px rgba(15,23,42,0.9)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <img
                          src="/couple.jpg"
                          alt="Us together"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            backgroundColor: "#000",
                          }}
                        />
                      </div>

                      {/* back text */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "24px",
                          background: "linear-gradient(135deg,#020617,#111827)",
                          boxShadow: "0 20px 45px rgba(15,23,42,0.9)",
                          padding: "1.6rem 1.4rem",
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#e5e7eb",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "1.02rem",
                            lineHeight: 1.7,
                            marginBottom: "0.8rem",
                          }}
                        >
                          This story doesn&apos;t end here…
                          <br />
                          It continues with you and me.
                        </p>
                        <span style={{ fontSize: "1.6rem" }}>💖</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.p
                  variants={fadeUp}
                  style={{
                    marginTop: "1.8rem",
                    fontSize: "0.95rem",
                    color: "#9ca3af",
                  }}
                />
              </motion.div>
            </section>
          )}

        </div>
      </main>

      {/* CONFETTI + HEART RAIN */}
      {(showCelebration || showHeartRain) &&
        Array.from({ length: 70 }).map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 0.6;
          const duration = 2 + Math.random();
          const xMove = Math.random() * 200 - 100;
          const emojis = showHeartRain
            ? ["💖", "💗", "💕", "💓"]
            : ["🎉", "🎊", "✨", "💖", "🥳"];
          const emoji = emojis[i % emojis.length];

          return (
            <span
              key={i}
              className="confetti-piece"
              style={{
                position: "fixed",
                top: "-10%",
                left: `${left}%`,
                fontSize: "2rem",
                pointerEvents: "none",
                zIndex: 9999,
                animation: `confettiFall ${duration}s ease-out ${delay}s forwards`,
                "--x-move": `${xMove}px`,
              }}
            >
              {emoji}
            </span>
          );
        })}

      {/* HEART EXPLOSION */}
      {heartBoom && (
        <div className="heart-explosion">
          {Array.from({ length: 22 }).map((_, i) => {
            const x = Math.random() * 300 - 150;
            const y = Math.random() * -260 - 80;
            const r = Math.random() * 60 - 30;
            return (
              <span
                key={i}
                className="floating-heart"
                style={{ "--x": `${x}px`, "--y": `${y}px`, "--r": `${r}deg` }}
              >
                ❤️
              </span>
            );
          })}
        </div>
      )}

      {/* HEART CENTER BUTTON */}
      {slide < totalSlides - 1 &&
        slide !== 2 &&
        slide !== 3 &&
        slide !== 4 &&
        slide !== 5 &&
        slide !== 6 && (
          <div className="heart-center">
            <button
              className="heart-btn"
              onClick={() => {
                playClickSound();
                handleHeroHeartClick();
              }}
              disabled={slide === 0 && isIntroLoading}
            >
              ❤️
            </button>
          </div>
        )}

      <footer className="footer">
        <p>Made with ♥ just for you.</p>
      </footer>

      {/* AUDIO TAGS */}
      <audio ref={audioRef} src="/typing.mp3?v=2" preload="auto" />
      <audio ref={yayAudioRef} src="/yay.mp3" preload="auto" />
      <audio ref={clickAudioRef} src="/click.mp3" preload="auto" />
      <audio ref={whooshRef} src="/whoosh.mp3" preload="auto" />
      <audio ref={tickRef} src="/tick.mp3" preload="auto" />
      <audio ref={dingRef} src="/ding.mp3" preload="auto" />
      <audio ref={wrongRef} src="/wrong.mp3" preload="auto" />
      <audio ref={correctRef} src="/correct.mp3" preload="auto" />
      <audio ref={finishRef} src="/finish.mp3" preload="auto" />
      <audio ref={paperRef} src="/paper.mp3" preload="auto" />
      <audio ref={popRef} src="/pop.mp3" preload="auto" />
      <audio ref={flipRef} src="/flip.mp3" preload="auto" />
      <audio ref={bellRef} src="/bell.mp3" preload="auto" />
    </div>
  );
}
