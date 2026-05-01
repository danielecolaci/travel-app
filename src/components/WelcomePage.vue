<template>
  <div>
    <!-- Hero section -->
    <div class="text-center py-12">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6">
        <MapPin :size="12" />
        Plan your next adventure
      </div>
      <h1 class="text-5xl font-bold text-slate-50 mb-4 leading-tight">
        Travel<span class="text-indigo-400"> Planner</span>
      </h1>
      <p class="text-slate-400 text-lg mb-8 max-w-md mx-auto">
        Organizza i tuoi viaggi giorno per giorno, salva tappe e ricordi in un unico posto.
      </p>
      <button class="btn-primary text-base px-7 py-3" @click="showAddModal = true">
        <Plus :size="18" />
        Nuovo Viaggio
      </button>
    </div>

    <!-- Saved trips -->
    <div v-if="savedTrips.length" class="mt-4">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-slate-200 flex items-center gap-2">
          <Bookmark :size="18" class="text-indigo-400" />
          I tuoi viaggi
          <span class="badge bg-indigo-500/15 text-indigo-400">{{ savedTrips.length }}</span>
        </h2>
        <button class="btn-ghost text-rose-400 hover:text-rose-300 hover:bg-rose-500/10" @click="showClearModal = true">
          <Trash2 :size="14" />
          Cancella tutti
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="(trip, index) in savedTrips"
          :key="index"
          class="card group cursor-pointer hover:border-indigo-500/40 transition-all duration-300"
          @click="viewTrip(index)"
        >
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <h3 class="font-semibold text-slate-100 text-lg leading-tight group-hover:text-indigo-300 transition-colors">
                {{ trip.title }}
              </h3>
              <span class="badge bg-slate-700 text-slate-300 ml-2 shrink-0">
                {{ tripDuration(trip) }}g
              </span>
            </div>
            <div class="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar :size="13" />
              <span>{{ formatDate(trip.startDate) }}</span>
              <ArrowRight :size="13" />
              <span>{{ formatDate(trip.endDate) }}</span>
            </div>
            <div v-if="tripLocations(trip).length" class="flex flex-wrap gap-1.5 mt-3">
              <span
                v-for="loc in tripLocations(trip).slice(0, 3)"
                :key="loc"
                class="badge bg-slate-700/60 text-slate-400"
              >
                <MapPin :size="10" />{{ loc }}
              </span>
              <span v-if="tripLocations(trip).length > 3" class="badge bg-slate-700/60 text-slate-500">
                +{{ tripLocations(trip).length - 3 }}
              </span>
            </div>
          </div>
          <div class="px-5 pb-4 flex items-center gap-2">
            <span class="text-xs text-indigo-400 group-hover:underline font-medium flex items-center gap-1">
              Vedi dettagli <ChevronRight :size="12" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16 text-slate-600">
      <Globe :size="48" class="mx-auto mb-4 opacity-30" />
      <p class="text-sm">Nessun viaggio salvato. Inizia ora!</p>
    </div>

    <!-- Add Trip Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="showAddModal = false"></div>
          <div class="relative card w-full max-w-md shadow-2xl">
            <div class="card-header justify-between">
              <div class="flex items-center gap-2">
                <PlaneTakeoff :size="18" class="text-indigo-400" />
                <h3 class="font-semibold text-slate-100">Nuovo Viaggio</h3>
              </div>
              <button class="btn-ghost p-1.5 rounded-lg" @click="showAddModal = false">
                <X :size="16" />
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="form-label">Titolo del viaggio</label>
                <input type="text" class="form-input" placeholder="es. Estate in Giappone" v-model="tripTitle" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Data inizio</label>
                  <input type="date" class="form-input" v-model="startDate" />
                </div>
                <div>
                  <label class="form-label">Data fine</label>
                  <input type="date" class="form-input" v-model="endDate" />
                </div>
              </div>
            </div>
            <div class="px-6 pb-6 flex gap-3 justify-end">
              <button class="btn-secondary" @click="showAddModal = false">Annulla</button>
              <button class="btn-success" @click="planTrip">
                <Compass :size="15" />
                Pianifica
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Confirm Clear Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showClearModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="showClearModal = false"></div>
          <div class="relative card w-full max-w-sm shadow-2xl">
            <div class="card-header justify-between">
              <div class="flex items-center gap-2">
                <AlertTriangle :size="18" class="text-rose-400" />
                <h3 class="font-semibold text-slate-100">Conferma cancellazione</h3>
              </div>
              <button class="btn-ghost p-1.5 rounded-lg" @click="showClearModal = false">
                <X :size="16" />
              </button>
            </div>
            <div class="p-6 text-slate-400 text-sm leading-relaxed">
              Sei sicuro di voler eliminare tutti i viaggi salvati? L'azione non può essere annullata.
            </div>
            <div class="px-6 pb-6 flex gap-3 justify-end">
              <button class="btn-secondary" @click="showClearModal = false">Annulla</button>
              <button class="btn-danger" @click="clearStorage">
                <Trash2 :size="14" />
                Elimina tutto
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Plus, MapPin, Bookmark, Calendar, ArrowRight, ChevronRight,
  Trash2, Globe, PlaneTakeoff, X, Compass, AlertTriangle
} from 'lucide-vue-next';

const tripTitle = ref('');
const startDate = ref('');
const endDate = ref('');
const savedTrips = ref([]);
const showAddModal = ref(false);
const showClearModal = ref(false);
const router = useRouter();

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const tripDuration = (trip) => {
  const s = new Date(trip.startDate);
  const e = new Date(trip.endDate);
  return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
};

const tripLocations = (trip) =>
  trip.stages?.map(s => s.location).filter(Boolean) ?? [];

const planTrip = () => {
  if (!tripTitle.value || !startDate.value || !endDate.value) {
    alert('Compila tutti i campi.');
    return;
  }
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  if (days <= 0) {
    alert('La data di fine deve essere successiva alla data di inizio.');
    return;
  }
  showAddModal.value = false;
  router.push({
    name: 'TripPlanner',
    query: { days, startDate: startDate.value, endDate: endDate.value, tripTitle: tripTitle.value }
  });
};

const viewTrip = (index) => {
  router.push({ name: 'TripDetails', query: { index } });
};

const clearStorage = () => {
  localStorage.removeItem('savedTrips');
  savedTrips.value = [];
  showClearModal.value = false;
};

onMounted(() => {
  savedTrips.value = JSON.parse(localStorage.getItem('savedTrips')) || [];
  // reset form
  tripTitle.value = '';
  startDate.value = '';
  endDate.value = '';
});
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
