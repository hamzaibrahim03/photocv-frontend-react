<template>
<NavigationRoute />
<HeaderRoute title="Profile" />
<section class="content">
    <div class="dashboard-card">
        <div class="profile-card">
            <div class="profile-left" style="align-items: center">
                <img class="img-fluid" :src="user.profile_image" alt="Profile Picture" />
                <div class="profile-info">
                    <h2 class="name">{{ user.first_name }}</h2>
                </div>
            </div>
            <div class="profile-icons">
                <div class="icon">
                    <span>20</span>
                    <i class="fas fa-comments"></i>
                </div>
                <div class="icon">
                    <span>53</span>
                    <i class="fas fa-desktop"></i>
                </div>
                <div class="icon">
                    <span>39</span>
                    <i class="fas fa-users"></i>
                </div>
            </div>
        </div>
        <div class="card-section">
            <div class="stat-card">
                <small class="ca-details">My Photos</small>
                <h3 class="number">21</h3>
            </div>
            <div class="event-card">
                <small class="ca-details">Interactions</small>
                <div class="row">
                    <div class="col-md-5">
                        <h3 class="number">99</h3>
                    </div>
                    <div class="days col-md-7">
                        <span>Likes & Coments</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card" style="height: auto; padding: 15px;">
        <div class="d-flex justify-content-between align-items-center">
            <div class="dt-search">
                <div class="input-group">
                    <span class="input-group-text" style="background-color: #fff; border: 1px solid #a0846c;">
                        <i class="fas fa-search" style="color: #a0846c;"></i>
                    </span>
                    <input v-model="search" type="search" class="form-control" placeholder="Search" aria-label="Search" style="border: 1px solid #a0846c;" />
                </div>
            </div>

            <div class="button-group d-flex align-items-center gap-2">
                <button class="btn d-flex align-items-center gap-2 px-3 py-2 text-white" style="background-color: #99816B;">
                    <i class="fas fa-sticky-note"></i> Note
                </button>
                <button class="btn d-flex align-items-center gap-2 px-3 py-2 text-white" style="background-color: #99816B;">
                    <i class="fas fa-list"></i> Add List
                </button>
                <button class="btn d-flex justify-center align-items-center" style="width: 43px; height: 43px; border-radius: 8px; background-color: #EBE6E1; color: #99816B;">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        </div>
    </div>
    <div class="notes-app d-flex">
        <aside class="sidebars p-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">My Notes</h5>
                <span class="text-muted small">{{ notes.length }} Notes</span>
            </div>
            <div v-for="(note, index) in notes" :key="index" class="note-preview p-3 rounded mb-3" :class="{ 'active-note': note.title === selectedNote.title }">
                <h6 class="fw-bold mb-1">{{ note.title }}</h6>
                <p class="text-secondary small mb-2">{{ note.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-light text-dark small">{{ note.time }}</span>
                    <div class="d-flex gap-2">
                        <button class="icon-btn"><i class="fas fa-trash-alt"></i></button>
                        <button class="icon-btn"><i class="fas fa-edit"></i></button>
                    </div>
                </div>
            </div>
            <div class="note-preview p-3 rounded" style="text-align: center">
                <img src="@/assets/images/profile/icon.png" alt="Create Note" class="note-icon" />
                <p class="note-label">Create New Note</p>
            </div>

        </aside>

        <main class="editor p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <span class="small text-muted">Last edited on Feb 7, 2025</span>
                </div>
                <button class="btn me-2" id="view" >Share</button>
            </div>

            <input class="form-control form-control-lg fw-bold border-0 mb-3" v-model="selectedNote.title" placeholder="Note Title" />

            <input type="hidden" name="description" id="description">
            <div class="editor-container" aria-rowspan="5">
                <div id="toolbar">
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-underline"></button>
                    <button class="ql-strike"></button>
                    <button class="ql-align" value=""></button>
                    <button class="ql-align" value="center"></button>
                    <button class="ql-align" value="right"></button>
                    <button class="ql-align" value="justify"></button>
                    <button class="ql-list" value="ordered"></button>
                    <button class="ql-list" value="bullet"></button>
                    <button class="ql-script" value="sub"></button>
                    <button class="ql-script" value="super"></button>
                    <button class="ql-blockquote"></button>
                    <button class="ql-link"></button>
                    <button class="ql-image"></button>
                    <button class="ql-code-block"></button>
                </div>
                <div id="editor"></div>
            </div>

            <textarea class="form-control border-0 mb-3" rows="8" v-model="selectedNote.content" placeholder="Start writing your note..."></textarea>

            <div class="note-image my-3">
                <img :src="selectedNote.image" alt="Note Image" class="img-fluid rounded w-100" />
            </div>

            <div class="d-flex gap-2">
                <span class="badge bg-secondary">{{ selectedNote.tag }}</span>
            </div>
        </main>
    </div>
</section>
</template>

<script setup>
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
import {
    useUserStore
} from "@/stores/club_admin/UserStore";

const user = useUserStore();
import {
    ref
} from 'vue';

const notes = ref([{
        title: 'Camera Focus',
        description: 'Lorem ipsum dolor sit amet...',
        time: '20 mins ago'
    },
    {
        title: 'Shutter Speed in Photography',
        description: 'Lorem ipsum...',
        time: '30 mins ago'
    },
    {
        title: 'Exposure in Photography',
        description: 'Lorem ipsum...',
        time: '50 mins ago'
    },
    {
        title: 'Camera Lenses and Focal Length',
        description: 'Lorem ipsum...',
        time: '4 hours ago'
    },
    {
        title: 'Understanding Light',
        description: 'Lorem ipsum...',
        time: '1 day ago'
    }
]);


const selectedNote = ref({
    title: 'Exposure in Photography',
    content: 'Exposure in photography refers to the amount of light...',
    image: require('@/assets/images/dashboard/c1.jpg'),
    tag: 'Exposure'
});
</script>

<style scoped>
.notes-app {
    display: flex;
    height: 100vh;
}

.sidebars {
    width: 400px;
    background-color: #ede5dd;
    border-right: 1px solid #ddd;
    overflow-y: auto;
}

.note-preview {
    background-color: #fff;
    border-left: 3px solid #a0846c;
    cursor: pointer;
    transition: background 0.3s, box-shadow 0.3s;
}

.note-preview:hover,
.note-preview.active-note {
    background-color: #f5f2ef;
    box-shadow: 0 0 0 2px #a0846c33;
}

.icon-btn {
    background: none;
    border: none;
    color: #a0846c;
    cursor: pointer;
}

.create-note-btn {
    position: fixed;
    bottom: 30px;
    left: 30px;
    right: 30px;
}

.editor {
    background-color: #FFFFFF;
    overflow-y: auto;
    width: 70%;
    border-radius: 10px;
}

.toolbar i {
    cursor: pointer;
    color: #7a6451;
}

.note-image img {
    max-height: 300px;
    object-fit: cover;
}
</style>
