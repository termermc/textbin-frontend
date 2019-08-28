<template>
	<div class="item">
		<h2>Site Stats</h2>
		<div>
			Public Posts: <b>{{ stats.public_post_count }}</b><br>
			Private Posts: <b>{{ stats.private_post_count }}</b><br>
			Total Posts: <b>{{ stats.total_post_count }}</b><br>
			Total Comments: <b>{{ stats.comment_count }}</b><br>
			Unique Posters: <b>{{ stats.unique_posters }}</b><br>
		</div>
		<a href="javascript:;" @click="loadStats()">Reload</a>
	</div>
</template>

<script>
import { apiUrl } from '../../constants.js';
import { api } from '../../utils.js';

export default {
	name: "Stats",
	data() {
		return {
			stats: {}
		}
	},
	mounted() {
		this.loadStats();
	},
	methods: {
		loadStats() {
			var vm = this;
			api.get(apiUrl+'site_stats').then(r => {
				if(r.status == "success") {
					vm.stats = r;
				} else if(r.status == "error") {
					alert("Error while fetching site stats: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		}
	}
}
</script>
