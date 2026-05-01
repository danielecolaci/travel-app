<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <router-link
        :to="{ name: 'TripDetails', query: { index: $route.query.index } }"
        class="btn-ghost p-2 rounded-xl"
      >
        <ArrowLeft :size="18" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-slate-100">Modifica Viaggio</h1>
        <p v-if="trip" class="text-slate-500 text-sm mt-0.5">{{ trip.title }}</p>
      </div>
    </div>

    <div v-if="trip">
      <div class="space-y-5">
        <div
          v-for="(stage, index) in trip.stages"
          :key="index"
          class="card overflow-hidden"
        >
          <div class="card-header bg-slate-800/80">
            <div class="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <span class="text-indigo-400 font-bold text-sm">{{ index + 1 }}</span>
            </div>
            <div>
              <p class="text-slate-100 font-semibold text-sm">Giorno {{ index + 1 }}</p>
              <p class="text-slate-500 text-xs">{{ getDateForDay(index + 1) }}</p>
            </div>
          </div>

          <div class="p-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">
                <MapPin class="inline mr-1" :size="11" />Nome tappa
              </label>
              <input type="text" class="form-input" placeholder="es. Roma centro" v-model="stage.name" />
            </div>
            <div>
              <label class="form-label">
                <Navigation class="inline mr-1" :size="11" />Posizione
              </label>
              <input type="text" class="form-input" placeholder="es. Roma, Italia" v-model="stage.location" />
            </div>
            <div class="sm:col-span-2">
              <label class="form-label">
                <FileText class="inline mr-1" :size="11" />Descrizione
              </label>
              <textarea
                class="form-input resize-none"
                rows="3"
                placeholder="Cosa farai in questo giorno..."
                v-model="stage.description"
              ></textarea>
            </div>
            <div>
              <label class="form-label">
                <Link2 class="inline mr-1" :size="11" />Link utile
              </label>
              <input type="url" class="form-input" placeholder="https://..." v-model="stage.link" />
            </div>
            <div>
              <label class="form-label">
                <Euro class="inline mr-1" :size="11" />Costo stimato (€)
              </label>
              <input type="number" class="form-input" placeholder="0" min="0" v-model="stage.price" />
            </div>
            <div class="sm:col-span-2">
              <label class="form-label">
                <ImageIcon class="inline mr-1" :size="11" />Immagine
              </label>
              <input
                type="file"
                accept="image/*"
                class="form-input file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 cursor-pointer"
                @change="handleImageUpload($event, index)"
              />
              <div v-if="stage.image" class="mt-3 rounded-xl overflow-hidden">
                <img :src="stage.image" alt="Preview" class="w-full max-h-48 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex flex-wrap gap-3">
        <router-link
          :to="{ name: 'TripDetails', query: { index: $route.query.index } }"
          class="btn-secondary"
        >
          <X :size="15" />
          Annulla
        </router-link>
        <button class="btn-success" @click="saveChanges">
          <Save :size="15" />
          Salva modifiche
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ArrowLeft, MapPin, Navigation, FileText, Link2,
  Euro, ImageIcon, X, Save
} from 'lucide-vue-next';

export default {
  components: {
    ArrowLeft, MapPin, Navigation, FileText, Link2,
    Euro, ImageIcon, X, Save
  },
  data() {
    return { trip: null };
  },
  created() {
    const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
    const i = this.$route.query.index;
    if (i !== undefined && savedTrips[i]) {
      this.trip = JSON.parse(JSON.stringify(savedTrips[i]));
    } else {
      this.$router.push('/');
    }
  },
  methods: {
    getDateForDay(day) {
      const start = new Date(this.trip.startDate);
      const date = new Date(start);
      date.setDate(start.getDate() + (day - 1));
      return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long' });
    },
    handleImageUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { this.trip.stages[index].image = e.target.result; };
      reader.readAsDataURL(file);
    },
    saveChanges() {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
      const i = this.$route.query.index;
      if (i !== undefined) {
        savedTrips[i] = this.trip;
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
        this.$router.push({ name: 'TripDetails', query: { index: i } });
      }
    }
  }
};
</script>
