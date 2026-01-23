<script setup>
const { data: users, refresh } = await useFetch("/api/users");

const newUser = ref({ name: "", email: "" });
const loading = ref(false);

const addUser = async () => {
  if (!newUser.value.name || !newUser.value.email) return;
  loading.value = true;
  try {
    await $fetch("/api/users", {
      method: "POST",
      body: newUser.value,
    });
    newUser.value = { name: "", email: "" };
    await refresh();
  } catch (e) {
    alert("Failed to add user: " + e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <header>
      <h1>Turso + Drizzle</h1>
      <p>基于 Nuxt 4 和 Cloudflare Workers 的极速数据库演示</p>
    </header>

    <main>
      <section class="form-section">
        <h2>添加用户</h2>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label for="name">姓名</label>
            <input
              id="name"
              v-model="newUser.name"
              type="text"
              placeholder="张三"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="newUser.email"
              type="email"
              placeholder="zhangsan@example.com"
              required
            />
          </div>
          <button type="submit" :disabled="loading">
            {{ loading ? "添加中..." : "添加用户" }}
          </button>
        </form>
      </section>

      <section class="list-section">
        <h2>用户列表</h2>
        <div v-if="!users || users.length === 0" class="empty">
          暂无用户数据
        </div>
        <ul v-else>
          <li v-for="user in users" :key="user.id">
            <div class="user-info">
              <span class="name">{{ user.name }}</span>
              <span class="email">{{ user.email }}</span>
            </div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style>
:root {
  --primary: #5100ff;
  --secondary: #00d4ff;
  --bg: #0f172a;
  --text: #f8fafc;
  --card-bg: #1e293b;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  margin: 0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.container {
  max-width: 900px;
  width: 100%;
  padding: 4rem 2rem;
}

header {
  text-align: center;
  margin-bottom: 4rem;
}

h1 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 1rem 0;
  letter-spacing: -0.025em;
}

header p {
  color: #94a3b8;
  font-size: 1.25rem;
}

main {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 3rem;
}

@media (max-width: 768px) {
  main {
    grid-template-columns: 1fr;
  }
}

section {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(12px);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h2 {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #f1f5f9;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
}

input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #60a5fa;
  ring: 2px solid #60a5fa;
}

button {
  width: 100%;
  padding: 1rem;
  background: #3b82f6;
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background: rgba(15, 23, 42, 0.3);
  padding: 1.25rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}

li:hover {
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(96, 165, 250, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name {
  font-weight: 600;
  font-size: 1.125rem;
  color: #f8fafc;
}

.email {
  font-size: 0.875rem;
  color: #94a3b8;
}

.empty {
  text-align: center;
  color: #64748b;
  padding: 3rem;
  font-style: italic;
}
</style>
