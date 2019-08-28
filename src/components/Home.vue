<template>
	<center>
		<h1>{{ name }}</h1>
		<p>
			<router-link to="/new">Create a post</router-link> / 
			<router-link to="/public">View Boards</router-link> / 
			<router-link to="/faq">FAQ</router-link> / 
			<router-link v-if="$root.rank > 0" to="/mod">Mod</router-link>
			<router-link v-else to="/login">Login</router-link>
		</p>
		<template v-if="bulletins.length > 0">
			<template v-if="showBulletins" v-for="bulletin in bulletins">
				<div class="item">
					<b>{{ bulletin.poster_username }} <span style="color:yellow">{{ bulletin.poster_flare }}</span></b> {{ bulletin.date+' '+bulletin.time }}
					<br>
					<p>
						{{ bulletin.content }}
					</p>
				</div>
				<br>
				<br>
			</template>
			<div v-if="!showBulletins" class="item">
				<b>{{ bulletins[0].poster_username }} <span style="color:yellow">{{ bulletins[0].poster_flare }}</span></b> {{ bulletins[0].date+' '+bulletins[0].time }}
				<br>
				<p>
					{{ bulletins[0].content }}
				</p>
				<a href="javascript:;" @click="showBulletins = true">All bulletins</a>
			</div>
		</template>
		<br v-if="bulletins.length > 0"><br>
		<div class="latest-container">
			<div class="latest">
				<div class="heading">
					<b>Latest Posts</b> <a v-on:click="loadPosts()" href="javascript:;">reload</a>
				</div>
				<p v-if="postsError">{{ postsError }}</p>
				<div v-else v-for="post in posts" class="post">
					<router-link :to="'/'+post.category_code+'/'+post.post_id">&gt;&gt;/{{ post.category_code }}/{{ post.post_id }}</router-link>
					<br>
					{{ post.name }} - {{ post.comment_count }} repl{{ post.comment_count == 1 ? 'y' : "ies" }}
				</div>
				<p v-if="posts.length < 1">No public posts currently</p>
			</div>
			<div class="latest">
				<div class="heading">
					<b>Latest Comments</b> <a v-on:click="loadComments()" href="javascript:;">reload</a>
				</div>
				<p v-if="commentsError">{{ postsError }}</p>
				<div v-else v-for="comment in comments" class="post">
					<router-link :to="'/'+comment.category_code+'/'+comment.post_id+'#p'+comment.id">&gt;&gt;/{{ comment.category_code }}/{{ comment.post_id+'#p'+comment.id }}</router-link>
					<br>
					{{ limit(comment.text, 200) }}
				</div>
				<p v-if="posts.length < 1">No public posts currently</p>
			</div>
		</div>
	</center>
</template>

<style scoped>
	.item {
		margin: 0px;
		padding: 10px;
		text-align: left;
	}
	.latest-container {
		max-width: 100vw;
		text-align: center;
		display: table;
	}
	.latest {
		padding: 10px;
		background: #1a1a1a;
		text-align: left;
		display: table-cell;
		max-width: 45vw;
		min-width: 300px;
		margin: 2vw;
		height: 100%;
	}
	.latest .heading {
		background: rgb(20, 20, 20);
		box-shadow: 0px 10px 10px #121212;
		padding: 5px;
		text-align: center;
	}
	.post {
		word-wrap: break-word;
		margin-top: 5px;
	}
	@media only screen and (max-width: 600px) {
		.latest-container {
			margin-right: 30vw;
			display: block;
		}
		.latest {
			display: inline-block;
		}
	}	
</style>

<script>
import { serviceName, author, authorLink, apiUrl } from '../constants.js';
import { api } from '../utils.js';

export default {
	name: 'Home',
	data() {
		return {
			name: serviceName,
			author: author,
			authorLink: authorLink,
			postsError: null,
			commentsError: null,
			posts: [],
			comments: [],
			bulletins: [],
			showBulletins: false
		}
	},
	methods: {
		limit(str, len) {
			let val = str;
			if(val.length > len) {
				val = val.substr(0, len-3)+'...';
			}
			return val;
		},
		loadPosts() {
			var vm = this;
			api.get(apiUrl+'latest_posts', { limit: 10 }).then(r => {
				if(r.status == "success") {
					vm.posts = r.posts;
				} else if(r.status == "error") {
					vm.postsError = "API returned error: "+r.error;
				} else {
					console.error("API returned unknown status:");
					console.error(r);
					vm.postsError = "Unknown error occurred.";
				}
			});
		},
		loadComments() {
			var vm = this;
			api.get(apiUrl+'latest_comments', { limit: 10 }).then(r => {
				if(r.status == "success") {
					vm.comments = r.comments;
				} else if(r.status == "error") {
					vm.commentsError = "API returned error: "+r.error;
				} else {
					console.error("API returned unknown status:");
					console.error(r);
					vm.commentsError = "Unknown error occurred.";
				}
			});
		},
		loadBulletins() {
			var vm = this;
			api.get(apiUrl+'bulletins').then(r => {
				if(r.status == "success") {
					vm.bulletins = r.bulletins;
				} else if(r.status == "error") {
					console.error("API returned error: "+r.error);
				} else {
					console.error("API returned unknown status:");
					console.error(r);
				}
			});
		}
	},
	mounted() {
		this.loadPosts();
		this.loadComments();
		this.loadBulletins();
		
		var vm = this;
		this.updater = setInterval(function() {
			// Update posts and comments
			vm.loadPosts();
			vm.loadComments();
		}, 10000);
	},
	beforeRouteLeave(to, from, next) {
		clearInterval(this.updater);
		next();
	}
}
</script>
