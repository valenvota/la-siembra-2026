import type { Activity } from "../data/types";
import { LEVEL_LABEL } from "../data/types";
import { useApp, areaById } from "../lib/app";
import { activityStatus, statusLabel, timeRange, dayLabel } from "../lib/time";

export function ActivityCard({
  activity,
  variant = "full",
  showDay = false,
}: {
  activity: Activity;
  variant?: "full" | "mini";
  showDay?: boolean;
}) {
  const { mode, now, selectArea, selectedAreaId } = useApp();
  const area = areaById(activity.areaId);
  const status = activityStatus(activity, now);
  const showStatus = mode === "durante";
  const active = selectedAreaId === activity.areaId;

  function focusOnMap(e: React.MouseEvent) {
    e.stopPropagation();
    selectArea(activity.areaId);
    document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <article className={`act act-${variant}${active ? " act-active" : ""}${status === "finalizada" && showStatus ? " act-done" : ""}`}>
      <div className="act-top">
        {showStatus ? (
          <span className={`tag st-${status}`}>
            {status === "ahora" && <span className="dot live-dot" />}
            {status !== "ahora" && <span className="dot" />}
            {statusLabel(status)}
          </span>
        ) : (
          <span className="act-time">{timeRange(activity)}</span>
        )}
      </div>

      <h4 className="act-name">{activity.name}</h4>

      {variant === "full" && activity.description && <p className="act-desc">{activity.description}</p>}

      <div className="act-meta">
        {showStatus && <span className="act-time small">{timeRange(activity)}</span>}
        {showDay && <span className="act-day">{dayLabel(activity.day)}</span>}
        {activity.level && <span className="act-level">{LEVEL_LABEL[activity.level]}</span>}
      </div>

      <div className="act-foot">
        <button className="area-chip" onClick={focusOnMap} title={`Ver ${area?.displayName} en el mapa`}>
          <span className="ref-badge">{area?.referenceNumber}</span>
          {area?.displayName}
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
        {activity.requiresReservation && (
          <a className="resv" href={activity.reservationUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            Reservar lugar
          </a>
        )}
      </div>
    </article>
  );
}
