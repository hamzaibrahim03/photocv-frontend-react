<template>
<div class="form-container">
    <form style="margin-left: 2%; margin-right: 2%">
        <h5 class="role" style="font-family: Inter; font-weight: 400; font-size: 32px; line-height: 100%; letter-spacing: 0%;">Privacy Settings</h5>
        <p style="font-family: Inter; font-weight: 400; font-size: 22.88px; line-height: 100%; letter-spacing: 0%; color: #4C4036;">Decide how cookies, data and reports are handled in your club.</p>
        <br /><br />
        <label for="GDPR"> GDPR & Privacy Policy Management </label>
        <input type="text" class="form-control" v-model="clubStore.step5.gdpr_privacy_policy_management" />

        <div class="divider3"></div>
        <h5>User Consent Settings</h5>
        <div class="row">
            <div class="col-md-6">
                <input type="radio" name="cookies" value="Cookies" ref="cookiesCookies" v-model="clubStore.step4.cookies" class="icheck-cookies" />&nbsp;
                <span></span> Cookies
                <textarea class="form-control" v-model="clubStore.step5.cookies_description"></textarea>
            </div>
            <div class="col-md-6">
                <input type="radio" name="data_collection_preferences" value="Data Collection Preferences" ref="data_collection_preferencesData Collection Preferences" v-model="clubStore.step4.data_collection_preferences" class="icheck-data_collection_preferences" />&nbsp;
                <span></span> Data Collection Preferences
                <textarea class="form-control" v-model="clubStore.step5.data_collection_preferences_description"></textarea>
            </div>
        </div>

        <div class="divider3"></div>
        <h5>Content Moderation & Reporting</h5>
        <input type="radio" name="allow_reporting" value="Allow Reporting" ref="allow_reporting" v-model="clubStore.step4.allow_reporting" class="icheck-allow_reporting" />&nbsp;
        <span></span> Allow Reporting
        <textarea class="form-control" v-model="clubStore.step5.allow_reporting_description"></textarea>

        <div class="button-group" style="justify-content: left">
            <button class="btn btn-sm" id="view">Cancel</button>
            <button @click="handleSubmit" class="btn btn-sm" id="edit">Save</button>
        </div>
    </form>
</div>
</template>

<script setup>
import { useClubFormStore } from '@/stores/club_admin/ClubFormData';

const clubStore = useClubFormStore();

const handleSubmit = async () => {
    try {
        await clubStore.submitForm();
        alert("Form submitted successfully!");
    } catch (error) {
        alert("Error submitting form.");
    }
};
</script>

<style scoped>
.form-control {
     font-size: 16.61px;
     font-weight: 400;
     padding: 12px;
     border-radius: 5px;
     color: #4C4036;
     border: 1.04px solid #99816B;
}
</style>
