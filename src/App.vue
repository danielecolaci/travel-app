<template>
  <div class="min-h-screen bg-slate-950 font-sans">
    <!-- Ambient background blobs -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 -right-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-sky-600/8 rounded-full blur-3xl"></div>
    </div>

    <!-- Top nav bar -->
    <nav class="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
        <router-link to="/" class="flex items-center gap-2 group">
          <span class="text-2xl">✈️</span>
          <span class="font-bold text-slate-100 text-base tracking-tight group-hover:text-indigo-400 transition-colors">
            Travel Planner
          </span>
        </router-link>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>
