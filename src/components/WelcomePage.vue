<template>
    <div class="container text-center mt-5">
        <h1>Welcome to Travel Planner</h1>
        <button class="btn btn-primary mt-3" @click="showModal">Start Now</button>

        <!-- Elenco dei viaggi salvati -->
        <div v-if="savedTrips.length" class="mt-5">
            <h2>Saved Trips</h2>
            <ul class="list-group">
                <li v-for="(trip, index) in savedTrips" :key="index" class="list-group-item">
                    <h5>{{ trip.title }}</h5>
                    <p>Trip from {{ trip.startDate }} to {{ trip.endDate }}</p>
                    <button class="btn btn-info btn-sm" @click="viewTrip(index)">View Details</button>
                </li>
            </ul>
        </div>

        <!-- Modale per l'inserimento delle date e del titolo -->
        <div class="modal fade" id="dateModal" tabindex="-1" aria-labelledby="dateModalLabel" aria-hidden="true"
            ref="dateModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="dateModalLabel">Enter Your Travel Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="tripTitle" class="form-label">Trip Title</label>
                            <input type="text" class="form-control" id="tripTitle" v-model="tripTitle">
                        </div>
                        <div class="mb-3">
                            <label for="startDate" class="form-label">Start Date</label>
                            <input type="date" class="form-control" id="startDate" v-model="startDate">
                        </div>
                        <div class="mb-3">
                            <label for="endDate" class="form-label">End Date</label>
                            <input type="date" class="form-control" id="endDate" v-model="endDate">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="planTrip">Plan Trip</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const tripTitle = ref('');
const startDate = ref('');
const endDate = ref('');
const savedTrips = ref([]);
const router = useRouter();
let modal = null;

const showModal = () => {
    modal = new bootstrap.Modal(document.getElementById('dateModal'));
    modal.show();
};

const planTrip = async () => {
    if (tripTitle.value && startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

        if (days > 0) {
            modal.hide();
            router.push({
                name: 'TripPlanner',
                query: {
                    days,
                    startDate: startDate.value,
                    endDate: endDate.value,
                    tripTitle: tripTitle.value
                },
            });
        } else {
            alert('Please ensure the end date is after the start date.');
        }
    } else {
        alert('Please fill in all fields.');
    }
};

const viewTrip = (index) => {
    router.push({
        name: 'TripDetails',
        query: { index }
    });
};

onMounted(() => {
    savedTrips.value = JSON.parse(localStorage.getItem('savedTrips')) || [];
});
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>
