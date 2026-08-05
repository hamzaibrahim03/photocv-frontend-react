<template>
<div class="form">
    <div class="row">
        <div class="col-md-6">
            <label for="Registration">Registration & Access Control</label>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-control">
                        <input type="radio" id="open" name="Access" value="Open" />&nbsp;
                        <span>Open</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-control">
                        <input type="radio" id="invite" name="Access" value="Invite Only" />&nbsp;
                        <span>Invite</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-control">
                        <input type="radio" id="man" name="Access" value="Manual Approval" />&nbsp;
                        <span>Manual</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <label for="members">Members Directory Public Visibility</label>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-control">
                        <input type="radio" id="visible" name="visible" value="Visible" />&nbsp;
                        <span>Visible</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-control">
                        <input type="radio" id="invite" name="visible" value="Club Only" />&nbsp;
                        <span>Club Only</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <label for="comments">Comments</label>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-control">
                        <input type="radio" id="en" name="enable1" value="Enable" />&nbsp;
                        <span>Enable</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-control">
                        <input type="radio" id="disable1" name="enable1" value="Disable" />&nbsp;
                        <span>Disable</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <label for="likes">Likes</label>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-control">
                        <input type="radio" id="enable" name="enable" value="Enable" />&nbsp;
                        <span>Enable</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-control">
                        <input type="radio" id="disable" name="enable" value="Disable" />&nbsp;
                        <span>Disable</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="button-group" style="justify-content:left">
        <button class="btn btn-sm" id="view">Previous</button>
        <button class="btn btn-sm" id="edit">Next</button>
        <a href="#" style="color: #cc445e">Skip</a>
    </div>
</div>
</template>

<script>
export default {
    name: "Step3Membership",
};
</script>

<style scoped>
.form {
     display: flex;
     flex-direction: column;
     gap: 24px;
}
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
