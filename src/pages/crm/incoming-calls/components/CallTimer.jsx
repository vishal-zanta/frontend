import React, { useState, useEffect, useRef } from "react";
import moment from "moment";

/**
 * Isolated call timer component that uses moment and setTimeout to count call duration.
 * Prevents re-rendering parent components or the CallContext every second.
 *
 * @param {string|number|Date} startTime - ISO string or timestamp of call answer (e.g. answerTimeISO, answerTime, createdAt)
 * @param {number} initialDurationSeconds - Initial duration in seconds from API (e.g. currentDurationSeconds)
 * @param {string} className - Optional Tailwind CSS classes
 * @param {string} fallbackText - Fallback display when duration cannot be calculated (e.g. currentDuration "00:01")
 */
export default function CallTimer({
  startTime,
  initialDurationSeconds,
  className = "",
  fallbackText = "00:00",
}) {
  const mountTimeRef = useRef(null);
  const fetchTimeRef = useRef(moment());

  if (!mountTimeRef.current) {
    mountTimeRef.current = moment();
  }

  useEffect(() => {
    fetchTimeRef.current = moment();
  }, [startTime, initialDurationSeconds]);

  const calculateDuration = () => {
    let start;
    if (startTime && moment(startTime).isValid()) {
      start = moment(startTime);
    } else {
      start = mountTimeRef.current;
    }

    let diffMs = moment().diff(start);
    if (typeof initialDurationSeconds === "number") {
      const elapsedSinceFetch = moment().diff(fetchTimeRef.current);
      const baselineMs = initialDurationSeconds * 1000 + elapsedSinceFetch;
      if (diffMs < baselineMs) {
        diffMs = baselineMs;
      }
    }
    diffMs = Math.max(0, diffMs);

    const duration = moment.duration(diffMs);

    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    const formattedMin = String(minutes).padStart(2, "0");
    const formattedSec = String(seconds).padStart(2, "0");

    if (hours > 0) {
      const formattedHours = String(hours).padStart(2, "0");
      return `${formattedHours}:${formattedMin}:${formattedSec}`;
    }

    return `${formattedMin}:${formattedSec}`;
  };

  const [durationText, setDurationText] = useState(() => {
    const calculated = calculateDuration();
    return calculated !== "00:00" ? calculated : fallbackText || calculated;
  });

  useEffect(() => {
    let timerId;

    const tick = () => {
      setDurationText(calculateDuration());
      timerId = setTimeout(tick, 1000);
    };

    tick();

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [startTime, initialDurationSeconds]);

  return <span className={className}>{durationText || fallbackText}</span>;
}
