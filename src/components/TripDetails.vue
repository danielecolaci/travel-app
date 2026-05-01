<template>
  <div>
    <div v-if="trip">
      <!-- Header -->
      <div class="flex items-start gap-3 mb-8">
        <router-link to="/" class="btn-ghost p-2 rounded-xl mt-1">
          <ArrowLeft :size="18" />
        </router-link>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-slate-100">{{ trip.title }}</h1>
          <p class="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
            <Calendar :size="13" />
            {{ formatDate(trip.startDate) }} → {{ formatDate(trip.endDate) }}
            <span class="badge bg-indigo-500/15 text-indigo-400 ml-1">
              {{ tripDuration }} giorni
            </span>
          </p>
        </div>
        <router-link
          :to="{ name: 'EditTrip', query: { index: $route.query.index } }"
          class="btn-secondary"
        >
          <Pencil :size="14" />
          Modifica
        </router-link>
      </div>

      <!-- Progress bar -->
      <div class="card p-5 mb-6">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-slate-300 flex items-center gap-2">
            <CheckCircle2 :size="15" class="text-emerald-400" />
            Tappe completate
          </span>
          <span class="text-sm font-bold text-slate-200">{{ completedStages }}/{{ trip.stages.length }}</span>
        </div>
        <div class="h-2 rounded-full bg-slate-700 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
        <div v-if="totalBudget > 0" class="mt-3 flex items-center justify-between text-sm">
          <span class="text-slate-500 flex items-center gap-1.5">
            <Wallet :size="13" /> Budget totale
          </span>
          <span class="text-emerald-400 font-semibold">{{ totalBudget }} €</span>
        </div>
      </div>

      <!-- Map -->
      <div class="card mb-6 overflow-hidden">
        <div class="card-header">
          <Map :size="16" class="text-indigo-400" />
          <span class="text-sm font-semibold text-slate-200">Mappa del viaggio</span>
        </div>
        <div id="map" class="h-72 w-full"></div>
      </div>

      <!-- Stage cards -->
      <div class="space-y-4">
        <div
          v-for="(stage, index) in trip.stages"
          :key="index"
          class="card overflow-hidden transition-all duration-300"
          :class="stage.completed ? 'opacity-70' : ''"
        >
          <!-- Stage image -->
          <div v-if="stage.image" class="relative h-40 overflow-hidden">
            <img :src="stage.image" :alt="stage.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <div class="absolute bottom-3 left-4 text-white font-bold text-lg">{{ stage.name }}</div>
          </div>

          <div class="card-header" :class="stage.completed ? 'bg-emerald-900/20' : 'bg-slate-800/80'">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-xl flex items-center justify-center border"
                  :class="stage.completed
                    ? 'bg-emerald-500/20 border-emerald-500/40'
                    : 'bg-indigo-600/20 border-indigo-500/30'"
                >
                  <span
                    class="font-bold text-sm"
                    :class="stage.completed ? 'text-emerald-400' : 'text-indigo-400'"
                  >{{ index + 1 }}</span>
                </div>
                <div>
                  <p class="text-slate-100 font-semibold text-sm">
                    {{ stage.name || 'Tappa senza nome' }}
                  </p>
                  <p class="text-slate-500 text-xs">{{ getDateForDay(index + 1) }}</p>
                </div>
              </div>
              <!-- Completed toggle -->
              <label class="flex items-center gap-2 cursor-pointer">
                <span class="text-xs text-slate-500">Completata</span>
                <div
                  class="w-9 h-5 rounded-full transition-colors duration-200 relative"
                  :class="stage.completed ? 'bg-emerald-600' : 'bg-slate-700'"
                  @click="toggleCompleted(index)"
                >
                  <div
                    class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                    :class="stage.completed ? 'translate-x-4' : 'translate-x-0.5'"
                  ></div>
                </div>
              </label>
            </div>
          </div>

          <div class="p-5 space-y-3">
            <p v-if="stage.description" class="text-slate-400 text-sm leading-relaxed">
              {{ stage.description }}
            </p>
            <div class="flex flex-wrap gap-3">
              <div v-if="stage.location" class="flex items-center gap-1.5 text-slate-500 text-xs">
                <MapPin :size="12" class="text-indigo-400" />
                {{ stage.location }}
              </div>
              <div v-if="stage.price" class="flex items-center gap-1.5 text-slate-500 text-xs">
                <Euro :size="12" class="text-emerald-400" />
                {{ stage.price }} €
              </div>
            </div>
            <a
              v-if="stage.link"
              :href="stage.link"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors"
            >
              <ExternalLink :size="12" />
              Apri link
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom actions -->
      <div class="mt-8 flex flex-wrap gap-3">
        <router-link to="/" class="btn-secondary">
          <ArrowLeft :size="15" />
          Indietro
        </router-link>
        <router-link
          :to="{ name: 'EditTrip', query: { index: $route.query.index } }"
          class="btn-primary"
        >
          <Pencil :size="14" />
          Modifica viaggio
        </router-link>
        <button class="btn-danger ml-auto" @click="showDeleteModal = true">
          <Trash2 :size="14" />
          Elimina
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="showDeleteModal = false"></div>
          <div class="relative card w-full max-w-sm shadow-2xl">
            <div class="card-header justify-between">
              <div class="flex items-center gap-2">
                <AlertTriangle :size="18" class="text-rose-400" />
                <h3 class="font-semibold text-slate-100">Elimina viaggio</h3>
              </div>
              <button class="btn-ghost p-1.5 rounded-lg" @click="showDeleteModal = false">
                <X :size="16" />
              </button>
            </div>
            <div class="p-6 text-slate-400 text-sm leading-relaxed">
              Sei sicuro di voler eliminare <strong class="text-slate-200">{{ trip?.title }}</strong>?
              L'azione non può essere annullata.
            </div>
            <div class="px-6 pb-6 flex gap-3 justify-end">
              <button class="btn-secondary" @click="showDeleteModal = false">Annulla</button>
              <button class="btn-danger" @click="deleteTrip">
                <Trash2 :size="14" />
                Elimina
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>


<script>
import L from 'leaflet';
import {
  ArrowLeft, Calendar, Pencil, CheckCircle2, Wallet, Map,
  MapPin, Euro, ExternalLink, Trash2, AlertTriangle, X
} from 'lucide-vue-next';

export default {
  components: {
    ArrowLeft, Calendar, Pencil, CheckCircle2, Wallet, Map,
    MapPin, Euro, ExternalLink, Trash2, AlertTriangle, X
  },
  data() {
    return {
      trip: null,
      leafletMap: null,
      markers: [],
      showDeleteModal: false
    };
  },
  computed: {
    tripDuration() {
      if (!this.trip) return 0;
      const s = new Date(this.trip.startDate);
      const e = new Date(this.trip.endDate);
      return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    },
    completedStages() {
      return this.trip?.stages.filter(s => s.completed).length ?? 0;
    },
    progressPercent() {
      if (!this.trip?.stages.length) return 0;
      return Math.round((this.completedStages / this.trip.stages.length) * 100);
    },
    totalBudget() {
      return this.trip?.stages.reduce((sum, s) => sum + (Number(s.price) || 0), 0) ?? 0;
    }
  },
  created() {
    const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
    const i = this.$route.query.index;
    if (i !== undefined && savedTrips[i]) {
      this.trip = savedTrips[i];
    } else {
      this.$router.push('/');
    }
  },
  mounted() {
    if (this.trip?.stages.length) this.initMap();
  },
  beforeUnmount() {
    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
    }
  },
  methods: {
    formatDate(d) {
      if (!d) return '';
      return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    getDateForDay(day) {
      const start = new Date(this.trip.startDate);
      const date = new Date(start);
      date.setDate(start.getDate() + (day - 1));
      return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' });
    },
    initMap() {
      this.leafletMap = L.map('map').setView([51.505, -0.09], 2);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
      }).addTo(this.leafletMap);

      this.trip.stages.forEach((stage) => {
        if (stage.location) this.addMarker(stage.location, stage.name);
      });
    },
    addMarker(location, title) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(r => r.json())
        .then(data => {
          if (!data?.length) return;
          const { lat, lon } = data[0];
          const marker = L.marker([parseFloat(lat), parseFloat(lon)]).addTo(this.leafletMap);
          marker.bindPopup(`<b>${title || location}</b><br>${location}`);
          this.markers.push(marker);
          if (this.markers.length === 1) this.leafletMap.setView([parseFloat(lat), parseFloat(lon)], 10);
        })
        .catch(err => console.error('Geocoding error:', err));
    },
    toggleCompleted(index) {
      this.trip.stages[index].completed = !this.trip.stages[index].completed;
      this.saveTrip();
    },
    saveTrip() {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
      const i = this.$route.query.index;
      if (i !== undefined && savedTrips[i]) {
        savedTrips[i] = this.trip;
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
      }
    },
    deleteTrip() {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
      const i = this.$route.query.index;
      if (i !== undefined) {
        savedTrips.splice(i, 1);
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
        this.$router.push('/');
      }
    }
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
