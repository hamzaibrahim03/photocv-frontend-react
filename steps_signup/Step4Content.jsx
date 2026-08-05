<template>
<div class="form">
    <label for="website"> Website Sections </label>
    <div class="row">
        <div class="col-md-3">
            <div class="form-control">
                <input type="checkbox" /> <span>News</span>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-control">
                <input type="checkbox" /> <span>Events</span>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-control">
                <input type="checkbox" /> <span>Galleries</span>
            </div>
        </div>
        <div class="col-md-3">
            <div class="form-control">
                <input type="checkbox" /> <span>Competitions</span>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <label for="homepage">Homepage Content Blocks</label>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-control">
                        <input type="radio" id="all" name="homepage" value="All" />&nbsp;
                        <span>All</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-control">
                        <input type="radio" id="fewer" name="homepage" value="Fewer" />&nbsp;
                        <span>Fewer</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-control">
                        <input type="radio" id="fewest" name="homepage" value="Fewest" />&nbsp;
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
                        <input type="radio" id="all" name="reminder" value="All" />&nbsp;
                        <span>All</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-control">
                        <input type="radio" id="some" name="reminder" value="Some" />&nbsp;
                        <span>Some</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-control">
                        <input type="radio" id="none" name="reminder" value="None" />&nbsp;
                        <span>None</span>
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
