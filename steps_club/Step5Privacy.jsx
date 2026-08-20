<template>
    <div className="form-container">
        <form style={{margin-left: 2%; margin-right: 2%">
            <h5 className="role" style={{font-family: Inter; font-weight: 400; font-size: 32px; line-height: 100%; letter-spacing: 0%;">Privacy Settings</h5>
            <p style={{font-family: Inter; font-weight: 400; font-size: 22.88px; line-height: 100%; letter-spacing: 0%; color: #4C4036;">Decide how cookies, data and reports are handled in your club.</p>
            <br /><br />
            <label for="GDPR"> GDPR & Privacy Policy Management </label>
            <input type="text" className="form-control" v-model="clubStore.step5.gdpr_privacy_policy_management" />

            <div className="divider3"></div>
            <h5>User Consent Settings</h5>
            <div className="row">
                <div className="col-md-6">
                    <input type="radio" name="cookies" value="Cookies" ref="cookiesCookies" v-model="clubStore.step4.cookies" className="icheck-cookies" />&nbsp;
                    <span></span> Cookies
                    <textarea className="form-control" v-model="clubStore.step5.cookies_description"></textarea>
                </div>
                <div className="col-md-6">
                    <input type="radio" name="data_collection_preferences" value="Data Collection Preferences" ref="data_collection_preferencesData Collection Preferences" v-model="clubStore.step4.data_collection_preferences" className="icheck-data_collection_preferences" />&nbsp;
                    <span></span> Data Collection Preferences
                    <textarea className="form-control" v-model="clubStore.step5.data_collection_preferences_description"></textarea>
                </div>
            </div>

            <div className="divider3"></div>
            <h5>Content Moderation & Reporting</h5>
            <input type="radio" name="allow_reporting" value="Allow Reporting" ref="allow_reporting" v-model="clubStore.step4.allow_reporting" className="icheck-allow_reporting" /> & nbsp;
<span></span> Allow Reporting
    < textarea className = "form-control" v - model="clubStore.step5.allow_reporting_description" ></textarea >

        <div className="button-group" style={{ justify- content: left">
            < button className = "btn btn-sm" id = "view" > Cancel</button >
                <button @click="handleSubmit" className = "btn btn-sm" id = "edit" > Save</button >
    </div >
</form >
</div >
</template >

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
