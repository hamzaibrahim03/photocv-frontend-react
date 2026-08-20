<template>
    <div className="form-container">
        <form style={{margin-left: 2%; margin-right: 2%">
            <h5 className="role" style={{font-family: Inter; font-weight: 400; font-size: 32px; line-height: 100%; letter-spacing: 0%;">Membership Settings</h5>
            <p style={{font-family: Inter; font-weight: 400; font-size: 22.88px; line-height: 100%; letter-spacing: 0%; color: #4C4036;">Let us know how do you want your members to interact.</p>
            <br /><br />
            <div className="row">
                <div className="col-md-6">
                    <label for="Registration">Registration & Access Control</label>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-control">
                                <input type="radio" name="registration" value="Open" ref="registrationOpen" v-model="clubStore.step3.registration" className="icheck-registration" />&nbsp;
                                <span>Open</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-control">
                                <input type="radio" name="registration" value="Invite Only" ref="registrationInvite Only" v-model="clubStore.step3.registration" className="icheck-registration" />&nbsp;
                                <span>Invite only</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-control">
                                <input type="radio" name="registration" value="Manual Approval" ref="registrationManual Approval" v-model="clubStore.step3.registration" className="icheck-registration" />&nbsp;
                                <span>Manual Approval</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <label for="members">Members Directory Public Visibility</label>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-control">
                                <input type="radio" name="directory_visibility" value="Visible" ref="directory_visibilityVisible" v-model="clubStore.step3.directory_visibility" className="icheck-directory_visibility" />&nbsp;
                                <span>Visible</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-control">
                                <input type="radio" name="directory_visibility" value="Club Only" ref="directory_visibilityClub Only" v-model="clubStore.step3.directory_visibility" className="icheck-directory_visibility" />&nbsp;
                                <span>Club Only</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="divider3"></div>
            <div className="row">
                <div className="col-md-6">
                    <label for="comments">Comments</label>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-control">
                                <input type="radio" name="comments" value="Enable" ref="commentsEnable" v-model="clubStore.step3.comments" className="icheck-comments" />&nbsp;
                                <span>Enable</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-control">
                                <input type="radio" name="comments" value="Disable" ref="commentsDisable" v-model="clubStore.step3.comments" className="icheck-comments" />&nbsp;
                                <span>Disable</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <label for="likes">Likes</label>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-control">
                                <input type="radio" name="likes" value="Enable" ref="likesEnable" v-model="clubStore.step3.likes" className="icheck-likes" />&nbsp;
                                <span>Enable</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-control">
                                <input type="radio" name="likes" value="Disable" ref="likesDisable" v-model="clubStore.step3.likes" className="icheck-likes" />&nbsp;
                                <span>Disable</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="button-group" style={{justify-content:left">
    < button className = "btn btn-sm" id = "view" > Cancel</button >
        <button type="submit" @click="console.log(clubStore.step3)" className = "btn btn-sm" id = "edit" > Save</button >
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
