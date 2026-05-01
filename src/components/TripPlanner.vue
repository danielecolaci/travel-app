<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <router-link to="/" class="btn-ghost p-2 rounded-xl">
        <ArrowLeft :size="18" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-slate-100">{{ tripTitle }}</h1>
        <p class="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
          <Calendar :size="13" />
          {{ formatDate(startDate) }} → {{ formatDate(endDate) }}
          <span class="badge bg-indigo-500/15 text-indigo-400 ml-1">{{ days }} giorni</span>
        </p>
      </div>
    </div>

    <!-- Day cards -->
    <div class="space-y-5">
      <div
        v-for="day in daysArray"
        :key="day"
        class="card overflow-hidden"
      >
        <div class="card-header bg-slate-800/80">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <span class="text-indigo-400 font-bold text-sm">{{ day }}</span>
              </div>
              <div>
                <p class="text-slate-100 font-semibold text-sm">Giorno {{ day }}</p>
                <p class="text-slate-500 text-xs">{{ getDateForDay(day) }}</p>
              </div>
            </div>
            <div v-if="stages[day - 1].name" class="badge bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 :size="11" />
              Compilato
            </div>
          </div>
        </div>

        <div class="p-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="form-label">
              <MapPin class="inline mr-1" :size="11" />Nome tappa
            </label>
            <input type="text" class="form-input" placeholder="es. Roma centro" v-model="stages[day - 1].name" />
          </div>
          <div>
            <label class="form-label">
              <Navigation class="inline mr-1" :size="11" />Posizione (per la mappa)
            </label>
            <input type="text" class="form-input" placeholder="es. Roma, Italia" v-model="stages[day - 1].location" />
          </div>
          <div class="sm:col-span-2">
            <label class="form-label">
              <FileText class="inline mr-1" :size="11" />Descrizione
            </label>
            <textarea
              class="form-input resize-none"
              rows="3"
              placeholder="Cosa farai in questo giorno..."
              v-model="stages[day - 1].description"
            ></textarea>
          </div>
          <div>
            <label class="form-label">
              <Link2 class="inline mr-1" :size="11" />Link utile
            </label>
            <input type="url" class="form-input" placeholder="https://..." v-model="stages[day - 1].link" />
          </div>
          <div>
            <label class="form-label">
              <Euro class="inline mr-1" :size="11" />Costo stimato (€)
            </label>
            <input type="number" class="form-input" placeholder="0" min="0" v-model="stages[day - 1].price" />
          </div>
          <div class="sm:col-span-2">
            <label class="form-label">
              <ImageIcon class="inline mr-1" :size="11" />Immagine
            </label>
            <input
              type="file"
              accept="image/*"
              class="form-input file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 cursor-pointer"
              @change="handleImageUpload($event, day - 1)"
            />
            <div v-if="stages[day - 1].image" class="mt-3 rounded-xl overflow-hidden">
              <img :src="stages[day - 1].image" alt="Preview" class="w-full max-h-48 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget summary -->
    <div v-if="totalBudget > 0" class="mt-6 card p-5 flex items-center justify-between">
      <div class="flex items-center gap-2 text-slate-400 text-sm">
        <Wallet :size="16" class="text-emerald-400" />
        Budget totale stimato
      </div>
      <span class="text-emerald-400 font-bold text-xl">{{ totalBudget }} €</span>
    </div>

    <!-- Actions -->
    <div class="mt-8 flex gap-3">
      <router-link to="/" class="btn-secondary">
        <ArrowLeft :size="15" />
        Indietro
      </router-link>
      <button class="btn-success" @click="saveTrip">
        <Save :size="15" />
        Salva Viaggio
      </button>
    </div>
  </div>
</template>

<script>
import {
  ArrowLeft, Calendar, MapPin, Navigation, FileText, Link2,
  Euro, ImageIcon, CheckCircle2, Wallet, Save
} from 'lucide-vue-next';

export default {
  components: {
    ArrowLeft, Calendar, MapPin, Navigation, FileText, Link2,
    Euro, ImageIcon, CheckCircle2, Wallet, Save
  },
  computed: {
    days() { return Number(this.$route.query.days); },
    startDate() { return this.$route.query.startDate; },
    endDate() { return this.$route.query.endDate; },
    tripTitle() { return this.$route.query.tripTitle; },
    daysArray() { return Array.from({ length: this.days }, (_, i) => i + 1); },
    totalBudget() {
      return this.stages.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
    }
  },
  data() {
    return { stages: [] };
  },
  created() {
    this.stages = Array.from({ length: this.days }, () => ({
      name: '', description: '', link: '', price: '', image: '', location: '', completed: false
    }));
  },
  methods: {
    formatDate(d) {
      if (!d) return '';
      return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    getDateForDay(day) {
      const start = new Date(this.startDate);
      const date = new Date(start);
      date.setDate(start.getDate() + (day - 1));
      return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
    },
    handleImageUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { this.stages[index].image = e.target.result; };
      reader.readAsDataURL(file);
    },
    saveTrip() {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
      savedTrips.push({
        title: this.tripTitle,
        startDate: this.startDate,
        endDate: this.endDate,
        stages: this.stages
      });
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
      this.$router.push('/');
    }
  }
};
</script>
