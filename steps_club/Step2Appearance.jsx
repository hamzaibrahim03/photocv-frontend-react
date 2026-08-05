<template>
<div class="form-container">
    <form @submit.prevent style="margin-left: 2%; margin-right: 2%">
        <h5 class="role" style="font-family: Inter; font-weight: 400; font-size: 32px; line-height: 100%; letter-spacing: 0%;">Appearance & Branding</h5>
        <p style="font-family: Inter; font-weight: 400; font-size: 22.88px; line-height: 100%; letter-spacing: 0%; color: #4C4036;">Each club has its own design Preference, let us know yours.</p>
        <br /><br />
        <div class="row">
            <div class="col-md-6">
                <label for="theme"> Theme & Colours </label>
                <img src="@/assets/images/club/theme.png" alt="theme" /><br />
                <label for="specific"> Choose Specific Colours </label>
                <img src="@/assets/images/club/color.png" alt="color" />
            </div>
            <div class="col-md-6">
                <label for="fonts"> Typography & Fonts </label>
                <img src="@/assets/images/club/font.png" alt="font" style="height: 250px" />
            </div>
        </div>
        <div class="divider3"></div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <h5>Header Customization</h5>
                <label for="header">Title</label>
                <input type="text" class="form-control" v-model="clubStore.step2.header_text" />
            </div>
            <div class="col-md-6 mb-3">
                <h5>Footer Customization</h5>
                <label for="footer">Title</label>
                <input type="text" class="form-control" v-model="clubStore.step2.footer_text" />
            </div>
        </div>
        <div class="divider3"></div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="header">Description</label>
                <textarea type="text" class="form-control" v-model="clubStore.step2.header_desc"> </textarea>
            </div>
            <div class="col-md-6 mb-3">
                <label for="header">Description</label>
                <textarea type="text" class="form-control" v-model="clubStore.step2.footer_desc"> </textarea>
            </div>
        </div>
        <div class="divider3"></div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="logo"> Upload Image </label>
                <input type="file" class="form-control" @change="onHeaderImageChange" />
            </div>
            <div class="col-md-6 mb-3">
                <label for="banner"> Upload Image </label>
                <input type="file" class="form-control" @change="onFooterImageChange" />
            </div>
        </div>
        <div class="divider3"></div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="logo"> Logo </label>
                <input type="file" class="form-control" @change="onLogoChange" />
            </div>
            <div class="col-md-6 mb-3">
                <label for="banner"> Club Banner and Cover Image </label>
                <input type="file" class="form-control" @change="onCoverImageChange" />
            </div>
        </div>
        <div class="button-group" style="justify-content:left">
            <button class="btn btn-sm" id="view">Cancel</button>
            <button type="submit" @click="console.log(clubStore)" class="btn btn-sm" id="edit">Save</button>
        </div>
    </form>
</div>
</template>

<script setup>
import { useClubFormStore } from '@/stores/club_admin/ClubFormData';
import { ref } from 'vue';

const clubStore = useClubFormStore();
const logoFile = ref(null);
const coverimageFile = ref(null);
const headerimageFile = ref(null);
const footerimageFile = ref(null);

function onLogoChange(event) {
    const file = event.target.files[0];
    if (file) {
        logoFile.value = file;
        clubStore.step2.logo = file;
    }
}

function onCoverImageChange(event) {
    const file = event.target.files[0];
    if (file) {
        coverimageFile.value = file;
        clubStore.step2.cover_image = file;
    }
}

function onHeaderImageChange(event) {
    const file = event.target.files[0];
    if (file) {
        headerimageFile.value = file;
        clubStore.step2.header_img = file;
    }
}

function onFooterImageChange(event) {
    const file = event.target.files[0];
    if (file) {
        footerimageFile.value = file;
        clubStore.step2.footer_img = file;
    }
}
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
</style>
