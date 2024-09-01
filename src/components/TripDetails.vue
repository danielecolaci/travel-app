<template>
    <div class="container mt-5">
        <h2>Trip Details</h2>
        <div v-if="trip">
            <h3>{{ trip.title }}</h3>
            <p><strong>From:</strong> {{ trip.startDate }}</p>
            <p><strong>To:</strong> {{ trip.endDate }}</p>

            <div id="map" style="height: 400px;" class="mb-4 rounded-3"></div>

            <div v-for="(stage, index) in trip.stages" :key="index" class="card my-3">
                <div class="card-header">
                    Day {{ index + 1 }} - {{ getDateForDay(index + 1) }}
                </div>
                <div class="card-body">
                    <p><strong>Stage Name:</strong> {{ stage.name }}</p>
                    <p><strong>Description:</strong> {{ stage.description }}</p>
                    <a v-if="stage.link" :href="stage.link" target="_blank" class="btn btn-primary btn-sm my-3">View
                        Link</a>
                    <p><strong>Estimated Price:</strong> {{ stage.price }}€</p>
                    <p><strong>Location:</strong> {{ stage.location }}</p>
                    <div v-if="stage.image">
                        <img :src="stage.image" alt="Day Image" class="img-fluid rounded-3"
                            style="max-height: 200px; object-fit: cover;">
                    </div>
                    <div class="form-check my-3">
                        <input type="checkbox" class="form-check-input" v-model="stage.completed" @change="saveTrip">
                        <label class="form-check-label">Stage Completed</label>
                    </div>
                </div>
            </div>

            <!-- Delete Button -->
            <button class="btn btn-danger my-5" @click="showDeleteModal = true">Delete Trip</button>

            <!-- Confirmation Modal -->
            <div v-if="showDeleteModal" class="modal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" class="btn-close" @click="showDeleteModal = false"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to delete this trip? This action cannot be undone.
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary"
                                @click="showDeleteModal = false">Cancel</button>
                            <button type="button" class="btn btn-danger" @click="deleteTrip">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Backdrop -->
            <div v-if="showDeleteModal" class="modal-backdrop" @click="showDeleteModal = false"></div>
        </div>
        <router-link to="/" class="btn btn-secondary my-5 me-3">Go Back</router-link>
        <router-link :to="{ name: 'EditTrip', query: { index: this.$route.query.index } }" class="btn btn-success my-5">
            Edit Trip
        </router-link>
    </div>
</template>


<script>
import L from 'leaflet';

export default {
    data() {
        return {
            trip: null,
            map: null,
            markers: [],
            showDeleteModal: false
        };
    },
    created() {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
        const tripIndex = this.$route.query.index;
        if (tripIndex !== undefined && savedTrips[tripIndex]) {
            this.trip = savedTrips[tripIndex];
        } else {
            this.$router.push('/');
        }
    },
    mounted() {
        if (this.trip && this.trip.stages.length) {
            this.initMap();
        }
    },
    methods: {
        initMap() {
            this.map = L.map('map').setView([51.505, -0.09], 2);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
            }).addTo(this.map);

            this.trip.stages.forEach((stage) => {
                if (stage.location) {
                    this.addMarker(stage.location, stage.name);
                }
            });
        },
        addMarker(location, title) {
            this.geocodeLocation(location, (lat, lng) => {
                const marker = L.marker([lat, lng]).addTo(this.map);
                marker.bindPopup(`<b>${title}</b><br>${location}`).openPopup();
                this.markers.push(marker);

                if (this.markers.length === 1) {
                    this.map.setView([lat, lng], 10);
                }
            });
        },
        geocodeLocation(location, callback) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const { lat, lon } = data[0];
                        callback(parseFloat(lat), parseFloat(lon));
                    }
                })
                .catch(err => {
                    console.error('Geocoding error:', err);
                });
        },
        getDateForDay(day) {
            const start = new Date(this.trip.startDate);
            const date = new Date(start);
            date.setDate(start.getDate() + (day - 1));
            return date.toDateString();
        },
        saveTrip() {
            const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
            const tripIndex = this.$route.query.index;
            if (tripIndex !== undefined && savedTrips[tripIndex]) {
                savedTrips[tripIndex] = this.trip;
                localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
            }
        },
        deleteTrip() {
            const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
            const tripIndex = this.$route.query.index;
            if (tripIndex !== undefined && savedTrips[tripIndex]) {
                savedTrips.splice(tripIndex, 1);
                localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
                this.$router.push('/');
            }
        }
    }
}
</script>



<style scoped>
.container {
    max-width: 800px;
}

.modal-backdrop {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    z-index: 1040;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal {
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1050;
}
</style>
