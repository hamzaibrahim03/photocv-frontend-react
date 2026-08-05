<template>
<NavigationRoute />
<HeaderRoute title="Club" />

<section class="content">
    <div class="dashboard-card">
        <ClubProfile />
        <div class="card-section">
            <div class="stat-card">
                <small class="ca-details">Members</small>
                <h3 class="number">{{ MemberCount }}</h3>
            </div>
            <div class="event-card">
                <small class="ca-details">Next Event</small>
                <div class="row">
                    <div class="col-md-5">
                        <h3 class="number">{{ EventDay }}</h3>
                    </div>
                    <div class="days col-md-7">
                        <span>days to go</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="tab-control">
        <div v-for="(step, index) in steps" :key="index" class="step" :class="{ active: index === currentStep }" @click="selectStep(index)">
            <span class="circle">{{ index + 1 }}</span>
            <span class="label">{{ step }}</span>
        </div>
    </div>

    <Step1General v-if="currentStep === 0" />
    <Step2Appearance v-if="currentStep === 1" />
    <Step3Membership v-if="currentStep === 2" />
    <Step4Content v-if="currentStep === 3" />
    <Step5Privacy v-if="currentStep === 4" />
</section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavigationRoute from "@/components/NavigationRoute.vue";
import HeaderRoute from "@/components/HeaderRoute.vue";
import ClubProfile from "@/partials/club_admin/club/ClubProfile.vue";
import { useEventStore } from "@/stores/club_admin/EventStore";
import Step1General from '@/steps_club/Step1General.vue';
import Step2Appearance from '@/steps_club/Step2Appearance.vue';
import Step3Membership from '@/steps_club/Step3Membership.vue';
import Step4Content from '@/steps_club/Step4Content.vue';
import Step5Privacy from '@/steps_club/Step5Privacy.vue';

const steps = ['General Settings', 'Appearance & Branding', 'Membership Settings', 'Content Management', 'Privacy Settings'];
const currentStep = ref(0);
const selectStep = (index) => {
    currentStep.value = index;
};

const {
    memberCount,
    eventDay,
    fetchEvents
} = useEventStore();
const EventDay = eventDay;
const MemberCount = memberCount;

onMounted(() => {
    fetchEvents();
});
</script>

<style scoped>
body {
     font-family: sans-serif;
     background-color: #f5f0eb;
     display: flex;
     justify-content: center;
     padding: 50px;
}
 .tab-control {
     display: flex;
     justify-content: space-between;
     margin-bottom: 30px;
     gap: 15px;
}
 .step {
     display: flex;
     flex-direction: column;
     align-items: center;
     cursor: pointer;
     flex: 1;
     transition: all 0.3s ease;
}
 .step .circle {
     background-color: #ccc;
     color: white;
     width: 40px;
     height: 40px;
     font-weight: bold;
     font-size: 18px;
     border-radius: 50%;
     display: flex;
     align-items: center;
     justify-content: center;
}
 .step .label {
     margin-top: 8px;
     font-size: 14px;
     text-align: center;
     color: #333;
}
 .step.active .circle {
     background-color: #CC445E;
}
 .step.active .label {
     font-weight: bold;
     color: #CC445E;
}
</style>
