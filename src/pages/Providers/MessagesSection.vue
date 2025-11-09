<template>
  <div class="messages-section">
    <h2 class="title">💬 Messages</h2>
    <p class="subtitle">Communicate with your clients in real time</p>

    <div class="chat-container">
      
      <!-- ✅ USERS LIST -->
      <div class="chat-list">
        <div
          class="chat-user"
          v-for="user in users"
          :key="user.id"
          @click="selectUser(user)"
          :class="{ active: selectedUser && selectedUser.id === user.id }"
        >
          <div class="avatar">
            <span>{{ user.name.charAt(0) }}</span>
            <span class="online-dot"></span>
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="last-message">{{ user.messages[user.messages.length - 1]?.text || '' }}</div>
          </div>
        </div>
      </div>

      <!-- ✅ CHAT BOX -->
      <div class="chat-box" v-if="selectedUser">
        <div class="chat-header">
          <div class="header-left">
            <div class="avatar big">
              <span>{{ selectedUser.name.charAt(0) }}</span>
              <span class="online-dot"></span>
            </div>
            <h3>{{ selectedUser.name }}</h3>
          </div>
        </div>

        <div class="chat-messages" ref="messageContainer">
          <div
            v-for="(msg, i) in selectedUser.messages"
            :key="i"
            :class="['message', msg.from === 'me' ? 'sent' : 'received']"
          >
            <p class="msg-text">{{ msg.text }}</p>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
        </div>

        <div class="chat-input">
          <input
            v-model="messageText"
            type="text"
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">Send</button>
        </div>
      </div>

      <!-- ✅ Placeholder -->
      <div v-else class="chat-placeholder">
        Select a user to start chatting 💬
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

/* ========= MOCKED USERS FOR NOW ========= */
const users = ref([
  { id: 1, name: "Sara", messages: [{ from: "Sara", text: "Hello! 😊", time: "10:30 AM" }] },
  { id: 2, name: "Dawit", messages: [{ from: "Dawit", text: "Is the service available?", time: "11:00 AM" }] },
]);

const selectedUser = ref(null);
const messageText = ref("");
const messageContainer = ref(null);

/* SELECT USER */
function selectUser(user) {
  selectedUser.value = user;
  nextTick(scrollToBottom);
}

/* SEND MESSAGE */
function sendMessage() {
  if (!messageText.value.trim() || !selectedUser.value) return;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  selectedUser.value.messages.push({
    from: "me",
    text: messageText.value,
    time,
  });

  messageText.value = "";
  nextTick(scrollToBottom);
}

/* AUTO SCROLL */
function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}
</script>

<style scoped>
.messages-section {
  padding: 1.5rem;
  font-family: "Poppins", sans-serif;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e40af;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* ✅ CHAT LAYOUT */
.chat-container {
  display: flex;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  min-height: 500px;
}

/* ✅ USERS LIST */
.chat-list {
  width: 30%;
  background: #f1f5ff;
  border-right: 1px solid #dbe1f1;
  overflow-y: auto;
}

.chat-user {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: 0.2s;
  border-bottom: 1px solid #e5e9f5;
}

.chat-user:hover {
  background: #e3ecff;
}

.chat-user.active {
  background: #1d4ed8;
  color: white;
}

/* ✅ Avatars */
.avatar {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 12px;
  font-size: 1rem;
  font-weight: 600;
}

.avatar.big {
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
}

.online-dot {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  position: absolute;
  bottom: 2px;
  right: 2px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
}

.last-message {
  font-size: 0.85rem;
  color: #64748b;
}

/* ✅ CHAT BOX */
.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem;
  background: #f7f9ff;
  border-bottom: 1px solid #dbe1f1;
  display: flex;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ✅ MESSAGES */
.chat-messages {
  flex: 1;
  padding: 1rem 1.3rem;
  overflow-y: auto;
  background: #f8fafc;
}

.message {
  max-width: 75%;
  padding: 0.7rem 1rem;
  margin-bottom: 10px;
  border-radius: 14px;
  display: inline-flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease;
}

.sent {
  background: #2563eb;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.received {
  background: #e2e8f0;
  color: #111;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.msg-time {
  font-size: 0.7rem;
  margin-top: 2px;
  opacity: 0.8;
}

/* ✅ INPUT AREA */
.chat-input {
  display: flex;
  padding: 0.8rem;
  background: #f7f9ff;
  border-top: 1px solid #dbe1f1;
}

.chat-input input {
  flex: 1;
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  border: 1px solid #cdd6e5;
  font-size: 0.95rem;
}

.chat-input button {
  margin-left: 0.6rem;
  background: #2563eb;
  color: white;
  padding: 0.6rem 1.3rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
}

.chat-input button:hover {
  background: #1e4acb;
}

.chat-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #909db6;
}

/* ✅ Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
