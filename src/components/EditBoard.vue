<template>
	<center>
		<p v-if="error">{{ error }}</p>
		<template v-else-if="loaded">
			<h1>/{{ code }}/ - {{ name }}</h1>
			<div class="item">
				<form @submit.prevent="save()">
					<label>Name</label>
					<br>
					<input type="text" v-model="name">
					<br><br>
					<label>Description</label>
					<br>
					<input type="text" v-model="desc">
					<br><br>
					<label>Code</label>
					<br>
					<input type="text" v-model="code" maxlength="4">
					<br><br>
					<label>Minimum poster rank required</label>
					<br>
					<select v-model="rank">
						<template v-for="rank in ranks">
							<option v-if="rank.id <= $root.rank" :value="rank.id">{{ rank.name }}</option>
						</template>
					</select>
					<br><br>
					<input type="submit" :value="saving ? 'Saving...' : 'Save Board'">
				</form>
			</div>
		</template>
		<p v-else>Loading...</p>
	</center>
</template>

<script>
import { apiUrl } from '../constants.js';
import { api } from '../utils.js';

export default {
	name: 'EditBoard',
	data() {
		return {
			saving: false,
			loaded: false,
			error: null,
			name: null,
			desc: null,
			code: null,
			rank: -1,
			ranks: []
		}
	},
	mounted() {
		if(this.$root.rank < 2) {
			this.$router.push('/login');
		} else {
			var vm = this;
			api.get(apiUrl+'category', { id: vm.$route.params.id }).then(r => {
				if(r.status == "success") {
					vm.name = r.name;
					vm.desc = r.description;
					vm.code = r.code;
					vm.rank = r.rank_required;
				} else if(r.status == "error") {
					vm.error = "API returned error: "+r.error;
				} else {
					vm.error = "API returned unknown status: "+r.status;
					console.error("API returned unknown status");
					console.error(r);
				}
			});
			api.get(apiUrl+'ranks').then(r => {
				if(r.status == "success") {
					vm.ranks = r.ranks;
					vm.loaded = true;
				} else if(r.status == "error") {
					vm.error = "API returned error: "+r.error;
				} else {
					vm.error = "API returned unknown status: "+r.status;
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		}
	},
	methods: {
		save() {
			this.saving = true;
			if(this.name.length > 0 && this.desc.length > 0 && this.code.length > 0) {
				var vm = this;
				api.post(apiUrl+'edit_category', {
					id: vm.$route.params.id,
					name: vm.name,
					description: vm.desc,
					code: vm.code,
					rank_required: vm.rank
				}).then(r => {
					if(r.status == "success") {
						// Success
					} else if(r.status == "error") {
						alert("API returned error: "+r.error);
					} else {
						alert("API returned unknown status: "+r.status);
						console.error("API returned unknown status");
						console.error(r);
					}
					vm.saving = false;
				});
			} else {
				alert("No fields may be empty");
				this.saving = false;
			}
		}
	}
}
</script>
