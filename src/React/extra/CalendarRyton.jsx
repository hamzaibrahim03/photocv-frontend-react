import { useState, useMemo, useEffect } from "react";
import "../assets/css/Calendar.css"
function Calendar() {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [homeData, sethomeData] = useState([]);

    const monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    const daysInMonth = useMemo(() => {
        return new Date(currentYear, currentMonth + 1, 0).getDate();
    }, [currentMonth, currentYear]);

    const firstDayOffset = useMemo(() => {
        return new Date(currentYear, currentMonth, 1).getDay();
    }, [currentMonth, currentYear]);

    const calendarData = homeData?.calendar || {};

    const allEvents = useMemo(() => {
        const key = `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}`;

        const monthData = calendarData[key] || {
            events: [],
            competitions: [],
        };

        const parseEvents = (type) =>
            (monthData[type] || []).map((ev) => ({
                date: new Date(ev.date),
                eventName: ev.name,
                type,
            }));

        return [
            ...parseEvents("events"),
            ...parseEvents("competitions"),
        ];
    }, [calendarData]);

    const eventsByDate = useMemo(() => {
        const grouped = {};

        allEvents.forEach((ev) => {
            const key = `${ev.date.getFullYear()}-${ev.date.getMonth()}-${ev.date.getDate()}`;

            if (!grouped[key]) grouped[key] = [];

            grouped[key].push(ev);
        });

        return grouped;
    }, [allEvents]);

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    const isSunday = (day) => {
        return new Date(currentYear, currentMonth, day).getDay() === 0;
    };

    const getDayClass = (day) => {
        const key = `${currentYear}-${currentMonth}-${day}`;
        const events = eventsByDate[key];

        if (!events) return "";

        if (events.some((e) => e.type === "competitions")) {
            return "has-competition";
        }

        if (events.some((e) => e.type === "events")) {
            return "has-event";
        }

        return "";
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
        } else {
            setCurrentMonth((prev) => prev - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
    };

    useEffect(() => {
        console.log(calendarData);
    }, [calendarData]);
    useEffect(() => {
        gethomeData();
    }, [])

    async function gethomeData() {
        const url = "http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/public/home"
        let response = await fetch(url)
        response = await response.json()
        sethomeData(response.data)
    }

    return (
        <>
            <div className="calendar" style={{ "--border-color": homeData?.clubSettings?.original?.data?.settings?.primary_color }} >
                <div className="calendar-header" style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color, color: homeData?.clubSettings?.original?.data?.settings?.background_color, }}>
                    <button className="previous" onClick={prevMonth} style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color, color: homeData?.clubSettings?.original?.data?.settings?.background_color, }} >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <h2>
                        {monthNames[currentMonth]} {currentYear}
                    </h2>

                    <button className="next" onClick={nextMonth} style={{ backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color, color: homeData?.clubSettings?.original?.data?.settings?.background_color, }} >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

                <div className="calendar-grid weekdays">
                    {weekDays.map((day, idx) => (
                        <div key={idx} className="weekday" style={idx === 0 ? { color: homeData?.clubSettings?.original?.data?.settings?.accent_color } : {}} >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="calendar-grid days">
                    {[...Array(firstDayOffset)].map((_, index) => (
                        <div key={index} className="day empty"></div>
                    ))}

                    {[...Array(daysInMonth)].map((_, index) => {
                        const day = index + 1;

                        return (
                            <div key={day} className={`day hoverable ${getDayClass(day)}`} style={isSunday(day) ? { color: homeData?.clubSettings?.original?.data?.settings?.accent_color } : {}} >
                                <div className="labels-container">
                                    {eventsByDate[
                                        `${currentYear}-${currentMonth}-${day}`
                                    ] && (
                                            <div className="event-labels">
                                                {eventsByDate[
                                                    `${currentYear}-${currentMonth}-${day}`
                                                ].map((ev, idx) => (
                                                    <div key={idx} className="event-label" style={{ color: ev.type === "events" ? homeData?.clubSettings?.original?.data?.settings?.accent_color : homeData?.clubSettings?.original?.data?.settings?.primary_color, backgroundColor: homeData?.clubSettings?.original?.data?.settings?.background_color, }} >
                                                        {ev.eventName}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    <span className={`day-number ${isToday(day) ? "today-badge" : ""}`} style={isToday(day) ? { backgroundColor: homeData?.clubSettings?.original?.data?.settings?.primary_color, color: homeData?.clubSettings?.original?.data?.settings?.background_color, } : {}} >
                                        {day}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Calendar;

