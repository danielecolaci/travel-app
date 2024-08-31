<template>
    <div class="container mt-5">
        <h2>Trip Details</h2>
        <div v-if="trip">
            <h3>{{ trip.title }}</h3>
            <p><strong>From:</strong> {{ trip.startDate }}</p>
            <p><strong>To:</strong> {{ trip.endDate }}</p>
            <div v-for="(stage, index) in trip.stages" :key="index" class="card my-3">
                <div class="card-header">
                    Day {{ index + 1 }} - {{ getDateForDay(index + 1) }}
                </div>
                <div class="card-body">
                    <p><strong>Stage Name:</strong> {{ stage.name }}</p>
                    <p><strong>Description:</strong> {{ stage.description }}</p>
                    <p><strong>Link:</strong> <a :href="stage.link" target="_blank">{{ stage.link }}</a></p>
                    <p><strong>Price:</strong> {{ stage.price }}</p>
                    <div v-if="stage.image">
                        <img :src="stage.image" alt="Day Image" class="img-fluid"
                            style="max-height: 200px; object-fit: cover;">
                    </div>
                </div>
            </div>
        </div>
        <router-link to="/" class="btn btn-secondary mt-3">Go Back</router-link>
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
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>
