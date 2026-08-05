<template>
<div class="calendar" :style="{ '--border-color': '#7FA483' }">

    <div class="calendar-header" :style="{ backgroundColor: '#99816B', color: 'white' }">
        <button class="previous" @click="prevMonth" :style="{ backgroundColor: '#99816B', color: 'white' }">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
        <h2>{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
        <button class="next" @click="nextMonth" :style="{ backgroundColor: '#99816B', color: 'white' }">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    </div>

    <div class="calendar-grid weekdays">
        <div v-for="(day, idx) in weekDays" :key="day" class="weekday" :style="idx === 0 ? { color: '#DD9757' } : {}">
            {{ day }}
        </div>
    </div>

    <div class="calendar-grid days">
        <div v-for="n in firstDayOffset" :key="'empty-' + n" class="day empty"></div>

        <div v-for="day in daysInMonth" :key="day" class="day hoverable" :class="getDayClass(day)" :style="isSunday(day) ? { color: Color.accent_color } : {}">

            <div class="labels-container">
                <div v-if="eventsByDate[`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`]" class="event-labels">
                    <div v-for="ev in eventsByDate[`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`]" :key="ev.eventName" class="event-label" :style="{ color: ev.type === 'events' ? Color.accent_color : Color.primary_color, backgroundColor: Color.background_color }">
                        {{ ev.eventName }}
                    </div>
                </div>

                <span class="day-number" :class="{ 'today-badge': isToday(day) }" :style="isToday(day) ? { backgroundColor: Color.primary_color, color: Color.background_color } : {}">
                    {{ day }}
                </span>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import {
    computed,
    ref
} from "vue";
import {
    useDashboardStore
} from "@/stores/club_admin/DashboardStore";
import {
    useHomeStore
} from "@/stores/club_public/ClubData";

const homeStore = useHomeStore();
const dashboardStore = useDashboardStore();

const Color = computed(() => homeStore.clubSettings || {});

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const daysInMonth = computed(() =>
    new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
);

const firstDayOffset = computed(() =>
    new Date(currentYear.value, currentMonth.value, 1).getDay()
);

const calendarData = computed(() =>
    dashboardStore.dashboardData?.data?.current_month_activities || {
        events: [],
        competitions: [],
    }
);

const allEvents = computed(() => {
    const parseEvents = (arr, type) =>
        (arr || []).map((ev) => ({
            date: new Date(ev.date),
            eventName: ev.name,
            type,
        }));

    return [
        ...parseEvents(calendarData.value.events, "events"),
        ...parseEvents(calendarData.value.competitions, "competitions"),
    ];
});

const eventsByDate = computed(() => {
    const grouped = {};

    allEvents.value.forEach((ev) => {
        const y = ev.date.getFullYear();
        const m = String(ev.date.getMonth() + 1).padStart(2, "0");
        const d = String(ev.date.getDate()).padStart(2, "0");
        const key = `${y}-${m}-${d}`;

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(ev);
    });

    return grouped;
});
const activities = dashboardStore?.dashboardData.data.current_month_activities;

eventsByDate.value = {};

// Events
activities.events.forEach(event => {
  if (!eventsByDate.value[event.date]) {
    eventsByDate.value[event.date] = [];
  }

  eventsByDate.value[event.date].push({
    ...event,
    type: "event"
  });
});

// Competitions
activities.competitions.forEach(comp => {
  if (!eventsByDate.value[comp.date]) {
    eventsByDate.value[comp.date] = [];
  }

  eventsByDate.value[comp.date].push({
    ...comp,
    type: "competition"
  });
});
const isToday = (day) =>
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear();

const isSunday = (day) =>
    new Date(currentYear.value, currentMonth.value, day).getDay() === 0;

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
};

const getDayKey = (day) => {
  const month = (currentMonth.value + 1).toString().padStart(2, "0");
  const date = day.toString().padStart(2, "0");
  return `${currentYear.value}-${month}-${date}`;
};

const getDayClass = (day) => {
  const key = getDayKey(day);
  const activities = eventsByDate.value[key];

  if (!activities) return "";

  const hasEvent = activities.some(a => a.type === "event");
  const hasCompetition = activities.some(a => a.type === "competition");

  if (hasEvent && hasCompetition) return "has-competition";
  if (hasCompetition) return "has-competition";
  if (hasEvent) return "has-event";

  return "";
};
</script>

<style scoped>
.calendar {
     border-radius: 10px;
     margin: 0;
     font-family: sans-serif;
}
 h2 {
     margin-top: 2%;
     font-size: 22px;
     font-weight: 400;
     line-height: 100%;
     letter-spacing: 0%;
}
 .calendar-header {
     display: flex;
     width: 100%;
     justify-content: space-between;
     align-items: center;
     border-top-left-radius: 10px;
     border-top-right-radius: 10px;
     height: 60px;
}
 .calendar-grid {
     display: grid;
     grid-template-columns: repeat(7, 1fr);
     margin-bottom: 15px;
}
 .days {
     margin-top: 10px;
}
 .labels-container {
     display: flex;
     justify-content: center;
     flex-wrap: nowrap;
     gap: 4px;
     margin-top: 4px;
}
 .previous, .next {
     font-size: 28px;
     width: 40px;
     height: 40px;
     align-items: center;
     border: none;
}
 .weekdays {
     font-weight: bold;
     text-align: center;
     margin-top: 35px;
}
 .day {
     min-height: 48px;
     text-align: center;
     padding: 4px;
     position: relative;
     border: 2px solid transparent;
}
 .day-number {
     font-size: 16px;
     border-radius: 7px;
     border: 2px solid transparent;
     display: flex;
     width: 38px;
     height: 30px;
     justify-content: center;
     align-items: center;
     margin: auto;
}
 .day.hoverable:hover span {
     border: 2px solid var(--border-color);
     cursor: pointer;
}
 .today-badge {
     border-radius: 7px;
     display: inline-block;
     width: 40px;
     height: 32px;
     display: flex;
     justify-content: center;
     text-align: center;
     align-items: center;
}
 .event-labels {
     position: absolute;
     top: -15px;
     left: 50%;
     transform: translateX(-50%);
     display: none;
     gap: 2px;
     z-index: 2;
}
 .event-label {
     font-size: 12px;
     padding: 2px 6px;
     border-radius: 4px;
     white-space: nowrap;
}
 .day.hoverable:hover .event-labels {
     display: flex;
}
 .day.has-event .day-number {
     border: 2px solid v-bind(Color.accent_color);
}
 .day.has-competition .day-number {
     border: 2px solid v-bind(Color.primary_color);
}
/* Hover label color */
 .day.has-event:hover .event-label {
     color: v-bind(Color.accent_color);
}
 .day.has-competition:hover .event-label {
     color: v-bind(Color.primary_color);
}
</style>
