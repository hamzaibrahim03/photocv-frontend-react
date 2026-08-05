<template>
<section class="signup-container">
    <div class="content-wrapper">
        <div class="form-section">
            <div class="logo-wrapper">
                <img src="@/assets/images/club.png" alt="Camera Club Logo" class="logo" />
            </div>

            <h2 class="title">{{ title }}</h2>
            <p class="subtitle">{{ subtitle }}</p>

            <div class="tab-control">
                <div v-for="(step, index) in steps" :key="index" class="step-wrapper">
                    <div class="step" :class="{ active: index === currentStep, completed: index < currentStep }" @click="selectStep(index)">
                        <span class="circle">{{ index + 1 }}</span>
                        <span class="label">{{ step }}</span>
                    </div>

                    <div v-if="index < steps.length - 1" class="line" :class="{ filled: index < currentStep }"></div>
                </div>
            </div>

            <component :is="currentComponent" />
        </div>

        <div class="image-section">
            <img src="@/assets/images/loginc.png" alt="Background" />
        </div>
    </div>
</section>
</template>

<script setup>
import { ref, computed } from 'vue'
import Step1General from '@/steps_signup/Step1General.vue'
import Step2Appearance from '@/steps_signup/Step2Appearance.vue'
import Step3Membership from '@/steps_signup/Step3Membership.vue'
import Step4Content from '@/steps_signup/Step4Content.vue'
import Step5Account from '@/steps_signup/Step5Account.vue'

const currentStep = ref(0)

const steps = [
    'General Settings',
    'Appearance & Branding',
    'Membership Settings',
    'Content Management',
    'Account Setup'
]

const titles = [
    "Let's Start!",
    "Let's Design!",
    "Let's manage memberships!",
    "Let's manage club website!",
    "You're almost there!"
]

const subtitles = [
    'We just need a few basic details of the club.',
    'Customize your branding and colors.',
    'Set up how people can join your club.',
    'Add photo albums, posts, and galleries.',
    'Finish up by setting admin credentials.'
]

const selectStep = (index) => {
    currentStep.value = index
}

const components = [
    Step1General,
    Step2Appearance,
    Step3Membership,
    Step4Content,
    Step5Account
]

const currentComponent = computed(() => components[currentStep.value])
const title = computed(() => titles[currentStep.value])
const subtitle = computed(() => subtitles[currentStep.value])
</script>

<style scoped>
.form-control {
     height: 50px;
     font-size: 16.61px;
     font-weight: 400;
     padding: 12px;
     border-radius: 5px;
     color: #4C4036;
     border: 1.04px solid #99816B;
}
 .signup-container, .content-wrapper {
     margin: 0;
     padding: 0;
     width: 100vw;
     height: 100vh;
     display: flex;
}
 .content-wrapper {
     display: flex;
     flex-direction: row;
     width: 100%;
}
 .form-section {
     flex: 0.7;
     padding: 60px 50px 40px 50px;
     background: #fff;
     display: flex;
     flex-direction: column;
     justify-content: center;
}
 .image-section {
     flex: 0.3;
     background-color: #000;
     display: flex;
     align-items: center;
     overflow: hidden;
     justify-content: right
}
 .image-section img {
     width: 100%;
     height: 100%;
     object-fit: cover;
}
 .logo-wrapper {
     display: flex;
     justify-content: center;
     align-items: center;
     margin-bottom: 20px;
}
 .logo {
     max-width: 200px;
     height: auto;
}
 .title {
     font-size: 48px;
     font-weight: 600;
     color: #4c4036;
     text-align: center;
}
 .subtitle {
     font-size: 20px;
     color: #4c4036;
     text-align: center;
     margin-bottom: 30px;
}
 .tab-control {
     width: 100%;
     margin: 30px 0;
     display: flex;
     margin-bottom: 30px;
     position: relative;
     padding: 0 10px;
}
 .step-wrapper {
     display: flex;
     align-items: center;
     position: relative;
     flex: 1;
}
 .step {
     display: flex;
     flex-direction: column;
     align-items: center;
     cursor: pointer;
     transition: all 0.3s ease;
     z-index: 2;
}
 .circle {
     background-color: #eae0d6;
     color: #555;
     width: 32px;
     height: 32px;
     border-radius: 50%;
     display: flex;
     align-items: center;
     justify-content: center;
     font-weight: bold;
     margin-bottom: 8px;
     transition: background-color 0.3s, color 0.3s;
}
 .label {
     font-size: 11px;
     text-align: center;
     color: #999;
     transition: color 0.3s;
}
 .step.active .circle, .step.completed .circle {
     background-color: #cc445e;
     color: #fff;
}
 .step.active .label, .step.completed .label {
     color: #cc445e;
     font-weight: 500;
}
 .line {
     height: 3px;
     background-color: #eae0d6;
     flex: 1;
     margin: 0 5px;
     margin-top: -20px;
     z-index: 1;
     border-radius: 4px;
     transition: background-color 0.3s;
}
 .line.filled {
     background-color: #cc445e;
}
</style>
