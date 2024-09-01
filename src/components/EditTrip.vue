<template>
    <div class="container mt-5">
        <h2>Edit Trip</h2>
        <div v-if="trip">
            <h3>Editing: {{ trip.title }}</h3>
            <div v-for="(stage, index) in trip.stages" :key="index" class="card my-3">
                <div class="card-header">
                    Day {{ index + 1 }} - {{ getDateForDay(index + 1) }}
                </div>
                <div class="card-body">

                    <div class="mb-3">
                        <label class="form-label">Stage Name</label>
                        <input type="text" class="form-control" v-model="stage.name">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" v-model="stage.description"></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Link</label>
                        <input type="url" class="form-control" v-model="stage.link">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Price</label>
                        <input type="number" class="form-control" v-model="stage.price">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Location</label>
                        <input type="text" class="form-control" v-model="stage.location">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Upload Image</label>
                        <input type="file" class="form-control" @change="handleImageUpload($event, index)">
                        <div v-if="stage.image" class="mt-2">
                            <img :src="stage.image" alt="Day Image" class="img-fluid"
                                style="max-height: 200px; object-fit: cover;">
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <router-link :to="{ name: 'TripDetails', query: { index: this.$route.query.index } }"
            class="btn btn-secondary my-5 me-3">
            Cancel
        </router-link>
        <button class="btn btn-success my-5" @click="saveChanges">Save Changes</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            trip: null
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
    methods: {
        getDateForDay(day) {
            const start = new Date(this.trip.startDate);
            const date = new Date(start);
            date.setDate(start.getDate() + (day - 1));
            return date.toDateString();
        },
        handleImageUpload(event, index) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.trip.stages[index].image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        saveChanges() {
            const savedTrips = JSON.parse(localStorage.getItem('savedTrips')) || [];
            const tripIndex = this.$route.query.index;
            if (tripIndex !== undefined) {
                savedTrips[tripIndex] = this.trip;
                localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
                this.$router.push({ name: 'TripDetails', query: { index: tripIndex } });
            }
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>
