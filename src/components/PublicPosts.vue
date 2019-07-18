<template>
	<center>
		<h1>Public Posts</h1>
		<p v-if="error">{{ error }}</p>
		<p v-else-if="!loaded">Loading...</p>
		<div v-else id="posts">
			<div v-for="post in posts" class="item">
				<h2><router-link :to="'/view/'+post.post_id" :title="post.name">{{ limit(post.name) }}</router-link></h2>
				Posted at {{ post.time }} on {{ post.date }}
			</div>
		</div>
	</center>
</template>

<script>
import { apiUrl } from '../constants';
import { api } from '../utils';

export default {
	name: 'PublicPosts',
	data() {
		return {
			loaded: false,
			posts: [],
			error: false
		}
	},
	methods: {
		limit(str) {
			// Limit string to 20 characters
			let val = str;
			if(val.length > 20) {
				val = val.substr(0, 17)+'...';
			}
			return val;
		}
	},
	mounted() {
		var vm = this;
		api.get(apiUrl+'public_posts').then(r => {
			if(r.status == "success") {
				vm.posts = r.posts;
				vm.loaded = true;
			} else if(r.status == "error") {
				vm.error = 'API returned error: '+r.error;
			} else {
				console.error("API returned unknown status");
				console.error(r);
				vm.error = 'Unknown error occurred while fetching posts';
			}
		});
	}
}
</script>
