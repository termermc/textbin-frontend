<template>
	<center>
		<h1>{{ $route.params.category ? '/'+$route.params.category+'/ - '+cat($route.params.category).name : 'Public Posts' }}</h1>
		<p>{{ cat($route.params.category).description }}</p>
		<br>
		<p v-if="categoryError">{{ categoryError }}</p>
		<template v-else>
			<router-link to="/public" :style="'margin-right: 10px;'+($route.params.category ? '' : 'font-weight:bold')">all</router-link>
			<template v-for="cat in categories">
				<router-link :style="'margin-right: 10px;'+($route.params.category==cat.code ? 'font-weight:bold' : '')" :to="'/'+cat.code+'/'" :title="cat.name">/{{cat.code}}/</router-link>
			</template>
		</template>
		<br><br>
		<p v-if="error">{{ error }}</p>
		<p v-else-if="!loaded">Loading...</p>
		<div v-else id="posts">
			<div v-if="posts.length > 0" v-for="post in posts" class="item">
				<h2><router-link :to="'/'+post.category_code+'/'+post.post_id" :title="post.name">{{ limit(post.name) }}</router-link></h2>
				Posted at {{ post.time }} on {{ post.date }}
				<template v-if="!$route.params.category">
					<br>
					<b>{{ post.category_name }}</b>
				</template>
				<img v-else-if="post.sticky" class="sticky" title="Sticky" src="/static/pin.svg">
				<br>
				{{ post.comment_count }} repl{{post.comment_count!=1?'ies':'y'}}
			</div>
			<template v-if="!posts.length">
				<br>
				<p v-if="!$route.params.category">There are currently no posts. How about you <router-link :to="'/new'">create one</router-link>?</p>
				<p v-else-if="cat($route.params.category).rank_required <= $root.rank">There aren't any posts in this category. How about you <router-link :to="'/'+$route.params.category+'/new'">create one</router-link>?</p>
			</template>
			<template v-else>
				<br>
				<router-link v-if="cat($route.params.category).rank_required <= $root.rank && $route.params.category" to="new">New Post</router-link>
			</template>
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
			error: false,
			categories: [],
			categoryError: null
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
		},
		fetch() {
			this.loaded = false;
			
			var vm = this;
			
			let params = {};
			if(this.$route.params.category) params.category = this.$route.params.category;
			api.get(apiUrl+'public_posts', params).then(r => {
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
		},
		cat(code) {
			let cat = {name:"",description:"",code:""};
			
			for(let i = 0; i < this.categories.length; i++) {
				let c = this.categories[i];
				if(c.code == code) {
					cat = c;
					break;
				}
			}
			
			return cat;
		}
	},
	async mounted() {
		var vm = this;
		let r = await api.get(apiUrl+'categories');
		if(r.status == "success") {
			vm.categories = r.categories;
		} else if(r.status == "error") {
			vm.categoryError = "API returned error: "+r.error;
		} else {
			vm.categoryError = "Unknown error occurred";
			console.error("API returned unknown status:");
			console.error(r);
		}
		
		this.fetch();
	},
	watch: {
		'$route'(to, from, next) {
			this.fetch();
			if(typeof(next) == "function") next();
		}
	}
}
</script>
