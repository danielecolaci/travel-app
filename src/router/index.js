import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import TripPlanner from '../components/TripPlanner.vue';
import TripDetails from '../components/TripDetails.vue';
import EditTrip from '../components/EditTrip.vue';

const routes = [
    { path: '/', name: 'Welcome', component: WelcomePage },
    { path: '/plan', name: 'TripPlanner', component: TripPlanner },
    { path: '/details', name: 'TripDetails', component: TripDetails },
    { path: '/edit', name: 'EditTrip', component: EditTrip }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
