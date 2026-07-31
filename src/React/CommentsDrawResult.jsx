<template>
    <div class="drawer-overlay" @click.self="$emit('close')">
        <div class="drawer">
            <div class="top">
                <span class="title">Details</span>
                <button class="close" @click="$emit('close')">×</button>
            </div>
            <div class="block">
                <div class="block-head" @click="exifOpen = !exifOpen">
                    <span>EXIF Details</span>
                    <span class="chev">{{ exifOpen ? "⌃" : "⌄" }}</span>
                </div>

                <div v-if="exifOpen" class="exif-grid">
                    <div class="exif-item">
                        <label>Camera</label><br>
                        <span>{{ exif?.camera_model }}</span>
                    </div>
                    <div class="exif-item">
                        <label>Focal Length</label><br>
                        <span>{{ exif?.focal_length }}</span>
                    </div>

                    <div class="exif-item">
                        <label>Lens</label><br>
                        <span>{{ exif?.lens }}</span>
                    </div>
                    <div class="exif-item">
                        <label>Aperture</label><br>
                        <span>{{ exif?.aperture }}</span>
                    </div>

                    <div class="exif-item">
                        <label>Shutter Speed</label><br>
                        <span>{{ exif?.shutter_speed }}</span>
                    </div>
                    <div class="exif-item">
                        <label>ISO</label><br>
                        <span>{{ exif?.iso }}</span>
                    </div>
                </div>
            </div>

            <div class="block comments-block">
                <div class="block-head" @click="commentsOpen = !commentsOpen">
                    <span>Comments</span>
                    <span class="chev">{{ commentsOpen ? "⌃" : "⌄" }}</span>
                </div>

                <div v-if="commentsOpen" class="comments" ref="commentsRef">
                    <div class="comment" v-for="c in comments" :key="c.id">
                        <strong>
                            {{ c.user?.first_name || "User" }}
                            {{ c.user?.last_name || "" }}
                        </strong>
                        <p>{{ c.comment }}</p>
                        <small>{{ time(c.created_at) }}</small>
                    </div>
                    <p v-if="!loading && !comments.length" class="empty">
                        No comments yet
                    </p>
                    <div class="input-bar">
                        <input v-model="newComment" placeholder="Add a comment..." @keyup.enter="postComment" />
                        <button @click="postComment">➤</button>
                    </div >
  <div class="comment-stats">
    <div class="stat">
      <span class="icon heart">♥</span>
      <span class="count">{{ like }}</span>
    </div>

    <div class="stat">
      <span class="icon comment">💬</span>
      <span class="count">{{ comments.length }}</span>
    </div>
  </div>

                </div >
            </div >
            <label></label>
            <span></span>
        </div >
    </div >
</template >


<script setup>
import { ref, watch, computed, nextTick } from "vue"
import commentsApi from "@/api/club_public/allcomments"

const props = defineProps({
  photo: {
    type: Object,
    required: true
  }
})

const newComment = ref("")
const commentsRef = ref(null)

const exifOpen = ref(true)
const commentsOpen = ref(true)

const exif = computed(() => props.photo?.exif ?? {})
const like = computed(() => props.photo?.likes )

const comments = ref([])

watch(
  () => props.photo,
  (val) => {
    comments.value = val?.comments ? [...val.comments] : []
  },
  { immediate: true }
)

const postComment = async () => {
  if (!newComment.value.trim()) return

  await commentsApi.postComment(
    props.photo.entry_id,   
    newComment.value
  )

  comments.value.push({
    id: Date.now(),
    comment: newComment.value,
    created_at: new Date().toISOString(),
    user: {
      first_name: "You",
      last_name: ""
    }
  })

  newComment.value = ""
  await nextTick()
  commentsRef.value.scrollTop = commentsRef.value.scrollHeight
}

const time = (t) =>
  t ? new Date(t).toLocaleString() : ""
</script>





<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 680px;      
  background: transparent;
  pointer-events: auto;
  z-index: 50;
}

.drawer {
   width: 610px;
  background: #121212;
  height: 90vh;
  display: flex;
  flex-direction: column;
  color: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 70px
}

.top {
   display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #1f1f1f;
  height: 57px;
}

.close {
  background: none;
  border: none;
  color: #aaa;
  width: 36px;
  height: 36px;
  top: 30px;
  right: 80px
}

.block {
  padding: 14px 16px;
  border-bottom: 1px solid #1f1f1f;
}

.block-head {
  display: flex;
  justify-content: space-between;
  color: #ddd;
  cursor: pointer;
  font-family: Inter;
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 20px;
letter-spacing: 0px;

}

.exif-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.exif-item label {
  font-family: Inter;
font-weight: 400;
font-style: Regular;
font-size: 12px;
line-height: 20px;
letter-spacing: 0px;
color: rgba(255, 255, 255, 0.4);
}

.exif-item span {
  font-family: Inter;
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 20px;
letter-spacing: 0px;
color: rgba(255, 255, 255, 0.9);
}

.comments {
  margin-top: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.comment {
  margin-bottom: 14px;
}

.comment strong {
  font-size: 13px;
}

.comment p {
  font-size: 13px;
  color: #ccc;
  margin: 2px 0;
}

.comment small {
  font-size: 11px;
  color: #777;
}

.input-bar {
  margin-top: auto;
  padding: 12px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #1f1f1f;
}

.input-bar input {
  flex: 1;
  background: #1e1e1e;
  border: none;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
}

.input-bar button {
  background: #1db954;
  border: none;
  padding: 0 14px;
  border-radius: 6px;
}
.comment-stats {
  display: flex;
  gap: 22px;
  align-items: center;
  padding: 10px 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.02),
    rgba(0,0,0,0.4)
  );
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #ddd;
}

.stat .icon {
  font-size: 16px;
}

.stat .heart {
  color: #ff4d6d;
}

.stat .comment {
  color: #aaa;
}

.stat .count {
  font-weight: 500;
}

</style>

