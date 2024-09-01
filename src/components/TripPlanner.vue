<template>
    <div class="container mt-5">
        <h2>Trip Planner</h2>
        <p>Planning your trip titled "{{ tripTitle }}" from {{ startDate }} to {{ endDate }}.</p>
        <div v-for="day in daysArray" :key="day" class="card my-3">
            <div class="card-header">
                Day {{ day }} - {{ getDateForDay(day) }}
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Stage Name</label>
                    <input type="text" class="form-control" v-model="stages[day - 1].name">
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" v-model="stages[day - 1].description"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Link</label>
                    <input type="url" class="form-control" v-model="stages[day - 1].link">
                </div>
                <div class="mb-3">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control" v-model="stages[day - 1].location">
                </div>
                <div class="mb-3">
                    <label class="form-label">Price</label>
                    <input type="number" class="form-control" v-model="stages[day - 1].price">
                </div>
                <div class="mb-3">
                    <label class="form-label">Upload Image</label>
                    <input type="file" class="form-control" @change="handleImageUpload($event, day - 1)">
                    <div v-if="stages[day - 1].image" class="mt-2">
                        <img :src="stages[day - 1].image" alt="Day Image" class="img-fluid"
                            style="max-height: 200px; object-fit: cover;">
                    </div>
                    <!-- <div class="mb-3 mt-3 form-check">
                        <input type="checkbox" class="form-check-input" v-model="stages[day - 1].completed">
                        <label class="form-check-label">Stage Completed</label>
                    </div> -->
                </div>
            </div>
        </div>

        <router-link to="/" class="btn btn-secondary my-5 me-3">Go Back</router-link>
        <button class="btn btn-success my-5" @click="saveTrip">Save Trip</button>

    </div>
</template>

<script>
export default {
    computed: {
        days() {
            return Number(this.$route.query.days);
        },
        startDate() {
            return this.$route.query.startDate;
        },
        endDate() {
            return this.$route.query.endDate;
        },
        tripTitle() {
            return this.$route.query.tripTitle;
        },
        daysArray() {
            return Array.from({ length: this.days }, (_, i) => i + 1);
        }
    },
    data() {
        return {
            stages: []
        };
    },
    created() {
        this.stages = Array.from({ length: this.days }, () => ({
            name: '',
            description: '',
            link: '',
            price: '',
            image: '',
            location: '',
            completed: false
        }));
    },
    methods: {
        getDateForDay(day) {
            const start = new Date(this.startDate);
            const date = new Date(start);
            date.setDate(start.getDate() + (day - 1));
            return date.toDateString();
        },
        handleImageUpload(event, index) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.stages[index].image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        saveTrip() {
            const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
            const trip = {
                title: this.tripTitle,
                startDate: this.startDate,
                endDate: this.endDate,
                stages: this.stages
            };
            savedTrips.push(trip);
            localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
            this.$router.push('/');
        },

    }
};
</script>

<style></style>
