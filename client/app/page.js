"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createSession } from "./components/api";
import { formatDuration } from "./components/time";

const DEFAULT_MESSAGE = "Press start to begin a calming milking session.";
const AUDIO_URL =
  process.env.NEXT_PUBLIC_AUDIO_URL ||
  "https://cdn.pixabay.com/download/audio/2022/08/12/audio_4ac10a6b79.mp3?filename=calm-ambient-113585.mp3";

export default function Home() {
  const audioRef = useRef(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [milkQuantity, setMilkQuantity] = useState("");
  const [statusMessage, setStatusMessage] = useState(DEFAULT_MESSAGE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let timer;

    if (isRunning && !isPaused) {
      timer = setInterval(() => {
        setElapsed((previous) => previous + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  const handleStart = () => {
    const start = new Date();
    setStartTime(start);
    setEndTime(null);
    setElapsed(0);
    setIsRunning(true);
    setIsPaused(false);
    setSaveSuccess(false);
    setMilkQuantity("");
    setStatusMessage("Playing soothing music for the herd.");

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setStatusMessage("Session paused. Tap resume when ready.");
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setStatusMessage("Back on track with relaxing music.");
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleStop = () => {
    const end = new Date();
    setEndTime(end);
    setIsRunning(false);
    setIsPaused(false);
    setStatusMessage("Session ended. Record the milk collected.");
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError("");

    try {
      const payload = {
        start_time: startTime?.toISOString(),
        end_time: endTime?.toISOString(),
        duration: elapsed,
        milk_quantity: Number(milkQuantity)
      };
      await createSession(payload);
      setSaveSuccess(true);
      setStatusMessage("Session saved! View history for details.");
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const showControls = isRunning;
  const showForm = !isRunning && startTime && endTime && !saveSuccess;

  return (
    <>
      <header className="container">
        <span className="badge">🐄 Calm Herd Tracker</span>
        <h1>Milking Tracker with Music</h1>
        <p>{statusMessage}</p>
      </header>
      <section className="container">
        <div className="card">
          <p className="notice">Music source: <strong>Soothing Field Melody</strong></p>
          <div className="timer">{formatDuration(elapsed)}</div>
          {!showControls && (
            <button className="primary" onClick={handleStart}>
              Start Milking
            </button>
          )}
          {showControls && (
            <div className="actions">
              {!isPaused ? (
                <button className="secondary" onClick={handlePause}>
                  Pause
                </button>
              ) : (
                <button className="secondary" onClick={handleResume}>
                  Resume
                </button>
              )}
              <button className="primary" onClick={handleStop}>
                Stop
              </button>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="actions" style={{ flexDirection: "column" }}>
              <label htmlFor="milk">Milk collected (litres)</label>
              <input
                id="milk"
                className="input"
                type="number"
                min="0"
                step="0.1"
                value={milkQuantity}
                onChange={(event) => setMilkQuantity(event.target.value)}
                required
              />
              {saveError && <p className="notice">{saveError}</p>}
              <button className="primary" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Session"}
              </button>
            </form>
          )}

          {saveSuccess && (
            <p className="notice">Session recorded. Ready for the next one!</p>
          )}
        </div>
        <div className="actions" style={{ marginTop: 20 }}>
          <Link className="secondary" href="/history">
            View Milking History
          </Link>
        </div>
      </section>
      <audio ref={audioRef} src={AUDIO_URL} loop preload="auto" />
    </>
  );
}
