<template>
	<center v-if="loaded">
		<h1>Staff Dashboard</h1>
		<a href="javascript:;" @click="logout()">Log Out</a>
		<br>
		<br>
		<template v-if="loaded">
			<stats/>
			<bans/>
			<template v-if="$root.rank > 1">
				<bulletins/>
				<boards/>
				<accounts/>
			</template>
			<account/>
		</template>
	</center>
</template>

<style scoped>
.item {
	width: 80vw;
	max-width: 80vw;
}
</style>

<script>
import { apiUrl } from '../constants.js';
import { api } from '../utils.js';

import Vue from 'vue';
import Stats from './mod/Stats';
import Bans from './mod/Bans';
import Bulletins from './mod/Bulletins';
import Boards from './mod/Boards';
import Accounts from './mod/Accounts';
import Account from './mod/Account';

Vue.component("stats", Stats);
Vue.component("bans", Bans);
Vue.component("bulletins", Bulletins);
Vue.component("boards", Boards);
Vue.component("accounts", Accounts);
Vue.component("account", Account);

export default {
	name: 'Mod',
	data() {
		return {
			loaded: false
		}
	},
	methods: {
		logout() {
			api.post(apiUrl+'logout').then(r => {
				if(r.status == "success") {
					this.$root.rank = 0;
					this.$root.username = null;
					this.$router.push("/login");
				} else if(r.status == "error") {
					alert("Error while logging out: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
	},
	mounted() {
		// Redirect to login if no username is detected
		if(this.$root.username == null) {
			this.$router.push('/login');
		} else {
			this.loaded = true;
		}
	}
}
</script>
