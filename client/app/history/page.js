"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSessions } from "../components/api";
import { formatDateTime, formatDuration } from "../components/time";

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchSessions()
      .then((data) => {
        if (mounted) {
          setSessions(data);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <header className="container">
        <span className="badge">📊 Session History</span>
        <h1>Milking Records</h1>
        <p>Review recent milking sessions stored in the tracker.</p>
      </header>
      <section className="container">
        <div className="card">
          {loading && <p className="notice">Loading sessions...</p>}
          {error && <p className="notice">{error}</p>}
          {!loading && !error && sessions.length === 0 && (
            <p className="notice">No sessions yet. Start a milking session to see records.</p>
          )}
          {!loading && !error && sessions.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Milk (L)</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const start = formatDateTime(session.start_time);
                  const end = formatDateTime(session.end_time);
                  return (
                    <tr key={session.id}>
                      <td>{start.date}</td>
                      <td>{start.time}</td>
                      <td>{end.time}</td>
                      <td>{formatDuration(session.duration)}</td>
                      <td>{session.milk_quantity.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="actions" style={{ marginTop: 20 }}>
          <Link className="secondary" href="/">
            Back to Tracker
          </Link>
        </div>
      </section>
    </>
  );
}
