<template>
<div class="form-container">
    <form style="margin-left: 2%; margin-right: 2%">
        <h5 class="role" style="font-family: Inter; font-weight: 400; font-size: 32px; line-height: 100%; letter-spacing: 0%;">Content Management</h5>
        <p style="font-family: Inter; font-weight: 400; font-size: 22.88px; line-height: 100%; letter-spacing: 0%; color: #4C4036;">How do you want your club website to shape up.</p>
        <br /><br />
        <label for="website"> Website Sections </label>
        <div class="row">
            <div class="col-md-3">
                <div class="form-control">
                    <input type="checkbox" value="News" v-model="clubStore.step4.news" /> <span>News</span>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-control">
                    <input type="checkbox" value="Events" v-model="clubStore.step4.events" /> <span>Events</span>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-control">
                    <input type="checkbox" value="Galleries" v-model="clubStore.step4.galleries" /> <span>Galleries</span>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-control">
                    <input type="checkbox" value="Competitions" v-model="clubStore.step4.competitions" /> <span>Competitions</span>
                </div>
            </div>
        </div>

        <div class="divider3"></div>
        <div class="row">
            <div class="col-md-6">
                <label for="homepage">Homepage Content Blocks</label>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-control">
                            <input type="radio" name="home_page_blocks" value="All" ref="home_page_blocksAll" v-model="clubStore.step4.home_page_blocks" class="icheck-home_page_blocks" />&nbsp;
                            <span>All</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-control">
                            <input type="radio" name="home_page_blocks" value="Fewer" ref="home_page_blocksFewer" v-model="clubStore.step4.home_page_blocks" class="icheck-home_page_blocks" />&nbsp;
                            <span>Fewer</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-control">
                            <input type="radio" name="home_page_blocks" value="Fewest" ref="home_page_blocksFewest" v-model="clubStore.step4.home_page_blocks" class="icheck-home_page_blocks" />&nbsp;
                            <span>Fewest</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <label for="reminder">Reminders</label>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-control">
                            <input type="radio" name="reminders" value="All" ref="remindersAll" v-model="clubStore.step4.reminders" class="icheck-reminders" />&nbsp;
                            <span>All</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-control">
                            <input type="radio" name="reminders" value="Some" ref="remindersSome" v-model="clubStore.step4.reminders" class="icheck-reminders" />&nbsp;
                            <span>Some</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-control">
                            <input type="radio" name="reminders" value="None" ref="remindersNone" v-model="clubStore.step4.reminders" class="icheck-reminders" />&nbsp;
                            <span>None</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="divider3"></div>
        <div class="row">
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" v-model="clubStore.step4.email" />
                    </div>
                    <div class="col-md-6">
                        <label for="phone" class="form-label">Phone</label>
                        <input type="number" class="form-control" v-model="clubStore.step4.phone" />
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" v-model="clubStore.step4.address" />
            </div>
        </div>
        <div class="divider3"></div>
        <label for="social">Social Media Links</label>
        <div class="row align-items-center mb-3">
            <div class="col-auto">
                <input type="checkbox" id="facebook" />
            </div>
            <div class="col">
                <label for="facebook" class="form-label">Facebook</label>
                <input type="text" class="form-control" placeholder="Facebook link..." v-model="clubStore.step4.fb_link" />
            </div>
        </div>

        <div class="row align-items-center mb-3">
            <div class="col-auto">
                <input type="checkbox" id="instagram" />
            </div>
            <div class="col">
                <label for="instagram" class="form-label">Instagram</label>
                <input type="text" class="form-control" placeholder="Instagram link..." v-model="clubStore.step4.insta_link" />
            </div>
        </div>

        <div class="row align-items-center mb-3">
            <div class="col-auto">
                <input type="checkbox" id="flickr" />
            </div>
            <div class="col">
                <label for="flickr" class="form-label">Flickr</label>
                <input type="text" class="form-control" placeholder="Flickr link..." v-model="clubStore.step4.flickr_link" />
            </div>
        </div>

        <div class="button-group" style="justify-content:left">
            <button class="btn btn-sm" id="view">Cancel</button>
            <button class="btn btn-sm" id="edit">Save</button>
        </div>
    </form>
</div>
</template>

<script setup>
import { useClubFormStore } from '@/stores/club_admin/ClubFormData';

const clubStore = useClubFormStore();
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
