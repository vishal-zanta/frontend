import React, { useState, useEffect } from "react";
import moment from "moment";

/**
 * Isolated call timer component that uses moment and setTimeout to count call duration.
 *
 * @param {string} startTime - ISO string timestamp of call start/answer
 * @param {string} className - Optional Tailwind CSS classes
 */
export default function CallTimer({ startTime, className = "" }) {
  const calculateDuration = () => {
    if (!startTime || !moment(startTime).isValid()) {
      return "00:00";
    }

    const diffMs = Math.max(0, moment().diff(moment(startTime)));
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

  const [durationText, setDurationText] = useState(calculateDuration);

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
  }, [startTime]);

  return <span className={className}>{durationText}</span>;
}
