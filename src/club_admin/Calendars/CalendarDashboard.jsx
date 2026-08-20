import { useMemo, useState } from "react";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

function CalendarDashboard({ activities = { events: [], competitions: [] } }) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOffset = new Date(currentYear, currentMonth, 1).getDay();
    const eventsByDate = useMemo(() => {
        const grouped = {};
        [...(activities.events || []), ...(activities.competitions || [])].forEach((item) => {
            const date = item.date?.slice?.(0, 10) || item.date;
            if (date) grouped[date] = [...(grouped[date] || []), item];
        });
        return grouped;
    }, [activities]);
    const changeMonth = (offset) => {
        const next = new Date(currentYear, currentMonth + offset, 1);
        setCurrentMonth(next.getMonth());
        setCurrentYear(next.getFullYear());
    };
    const dayKey = (day) => `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return <div className="calendar">
        <div className="calendar-header">
            <button type="button" className="previous" onClick={() => changeMonth(-1)} aria-label="Previous month">&lsaquo;</button>
            <h2>{monthNames[currentMonth]} {currentYear}</h2>
            <button type="button" className="next" onClick={() => changeMonth(1)} aria-label="Next month">&rsaquo;</button>
        </div>
        <div className="calendar-grid weekdays">{weekDays.map((day, index) => <div key={`${day}-${index}`} className="weekday">{day}</div>)}</div>
        <div className="calendar-grid days">
            {Array.from({ length: firstDayOffset }, (_, index) => <div key={`empty-${index}`} className="day empty" />)}
            {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const items = eventsByDate[dayKey(day)] || [];
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                return <div key={day} className={`day hoverable ${items.length ? "has-events" : ""}`}>
                    <span className={isToday ? "day-number today-badge" : "day-number"}>{day}</span>
                    <div className="labels-container">{items.map((item, itemIndex) => <div key={`${item.name}-${itemIndex}`} className="event-label">{item.name || item.eventName}</div>)}</div>
                </div>;
            })}
        </div>
    </div>;
}

export default CalendarDashboard;
