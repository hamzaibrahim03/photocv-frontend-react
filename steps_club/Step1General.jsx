<template>
    <div className="form-container">
        <form @submit.prevent style={{margin-left: 2%; margin-right: 2%">
        <h5 className="role" style={{font-family: Inter; font-weight: 400; font-size: 32px; line-height: 100%; letter-spacing: 0%;">General Settings</h5>
        <p style={{font-family: Inter; font-weight: 400; font-size: 22.88px; line-height: 100%; letter-spacing: 0%; color: #4C4036;">We need just a few basic details of the club</p>
        <br /><br />
        <div className="row">
            <div className="col-md-6 mb-3">
                <label for="names"> Club Name </label>
                <input type="text" className="form-control" v-model="clubStore.step1.club_name" />
            </div>
            <div className="col-md-6 mb-3">
                <label for="tagline"> Club Tagline </label>
                <input type="text" className="form-control" v-model="clubStore.step1.tag_line" />
            </div>
        </div>
        <div className="divider3"></div>
        <div className="row">
            <div className="col-md-6 mb-3">
                <label for="about"> About </label>
                <textarea type="text" className="form-control" v-model="clubStore.step1.about_title"></textarea>
            </div>
            <div className="col-md-6 mb-3">
                <label for="contact_details"> Contact Details </label>
                <textarea type="text" className="form-control" v-model="clubStore.step1.contact_details"></textarea>
            </div>
        </div>
        <div className="divider3"></div>
        <div className="row">
            <div className="col-md-6">
                <label for="domain_type">Domain Type</label>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-control">
                            <input type="radio" name="domain_type" value="customdomain" ref="domain_typecustomdomain" v-model="clubStore.step1.domain_type" className="icheck-domain_type" />&nbsp;
                            <span>Custom Domain</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-control">
                            <input type="radio" name="domain_type" value="Subdomain" ref="domain_typeSubdomain" v-model="clubStore.step1.domain_type" className="icheck-domain_type" />&nbsp;
                            <span>Sub Domain</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 mb-3">
                <label for="domain_name"> Domain Name </label>
                <input type="text" className="form-control" v-model="clubStore.step1.domain_name" />
            </div>
        </div>
        <div className="divider3"></div>
        <div className="row">
            <div className="col-md-6">
                <label for="time_zone"> Time Zone & Date </label>
                <select name="timezone_offset" id="timezone-offset" className="form-control" v-model="clubStore.step1.time_zone">
                    <option value="-12:00">(GMT -12:00) Eniwetok, Kwajalein</option>
                    <option value="-11:00">(GMT -11:00) Midway Island, Samoa</option>
                    <option value="-10:00">(GMT -10:00) Hawaii</option>
                    <option value="-09:50">(GMT -9:30) Taiohae</option>
                    <option value="-09:00">(GMT -9:00) Alaska</option>
                    <option value="-08:00">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                    <option value="-07:00">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                    <option value="-06:00">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                    <option value="-05:00">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                    <option value="-04:50">(GMT -4:30) Caracas</option>
                    <option value="-04:00">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                    <option value="-03:50">(GMT -3:30) Newfoundland</option>
                    <option value="-03:00">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                    <option value="-02:00">(GMT -2:00) Mid-Atlantic</option>
                    <option value="-01:00">(GMT -1:00) Azores, Cape Verde Islands</option>
                    <option value="+00:00">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                    <option value="+01:00">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                    <option value="+02:00">(GMT +2:00) Kaliningrad, South Africa</option>
                    <option value="+03:00">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                    <option value="+03:50">(GMT +3:30) Tehran</option>
                    <option value="+04:00">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                    <option value="+04:50">(GMT +4:30) Kabul</option>
                    <option value="+05:00" selected="selected">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                    <option value="+05:50">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                    <option value="+05:75">(GMT +5:45) Kathmandu, Pokhara</option>
                    <option value="+06:00">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                    <option value="+06:50">(GMT +6:30) Yangon, Mandalay</option>
                    <option value="+07:00">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                    <option value="+08:00">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                    <option value="+08:75">(GMT +8:45) Eucla</option>
                    <option value="+09:00">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                    <option value="+09:50">(GMT +9:30) Adelaide, Darwin</option>
                    <option value="+10:00">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                    <option value="+10:50">(GMT +10:30) Lord Howe Island</option>
                    <option value="+11:00">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                    <option value="+11:50">(GMT +11:30) Norfolk Island</option>
                    <option value="+12:00">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                    <option value="+12:75">(GMT +12:45) Chatham Islands</option>
                    <option value="+13:00">(GMT +13:00) Apia, Nukualofa</option>
                    <option value="+14:00">(GMT +14:00) Line Islands, Tokelau</option>
                </select>
            </div>
            <div className="col-md-6">
                <label for="club_privacy">Club Privacy</label>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-control">
                            <input type="radio" name="privacy" value="Public" ref="privacyPublic" v-model="clubStore.step1.privacy" className="icheck-privacy" />&nbsp;
                            <span>Public</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-control">
                            <input type="radio" name="privacy" value="Members Only" ref="privacyMembers" v-model="clubStore.step1.privacy" className="icheck-privacy" />&nbsp;
                            <span>Member Only</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-control">
                            <input type="radio" name="privacy" value="Private" ref="privacyPrivate" v-model="clubStore.step1.privacy" className="icheck-privacy" />&nbsp;
                            <span>Private</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="divider3"></div>
        <h5>Season</h5>
        <div className="row">
            <div className="col-md-6 mb-3">
                <label for="season_name"> Season Name </label>
                <input type="text" className="form-control" v-model="clubStore.step1.season_name" />
            </div>
            <div className="col-md-6">
                <label for="status">Status</label>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-control">
                            <input type="radio" name="status" value="Enable" ref="statusEnable" v-model="clubStore.step1.status" className="icheck-status" />&nbsp;
                            <span>Enable</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-control">
                            <input type="radio" name="status" value="Disable" ref="statusDisable" v-model="clubStore.step1.status" className="icheck-status" />&nbsp;
                            <span>Disable</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="divider3"></div>
        <div className="row">
            <div className="col-md-6 mb-3">
                <label for="start_date"> Start Date </label>
                <input type="date" className="form-control" v-model="clubStore.step1.start_date" />
            </div>
            <div className="col-md-6 mb-3">
                <label for="end_date"> End Date </label>
                <input type="date" className="form-control" v-model="clubStore.step1.end_date" />
            </div>
        </div>
        <div className="divider3"></div>
        <button className="btn btn-sm" id="view">+ Add</button>

        <div className="button-group">
            <button className="btn btn-sm" id="view">Cancel</button>
            <button @click="console.log(clubStore)" type="submit" className="btn btn-sm" id="edit">Save</button>
    </div >
</form >
</div >
</template >

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
