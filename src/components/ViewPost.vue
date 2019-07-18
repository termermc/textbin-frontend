<template>
	<center v-if="loaded">
		<h1>{{ name }}</h1>
		<span>Posted at {{ time }} on {{ date }}</span>
		<br/><br/>
		<textarea id="text" readonly v-model="text"></textarea>
		<br/>
		<br/>
		<div style="text-align:left;margin-left:10vw">
			<a :href="api+'raw/'+id">
				<button>View raw</button>
			</a>
			<a v-if="type == 'html'" :href="api+'html/'+id">
				<button>View as HTML</button>
			</a>
			<br/><br/>
			<h2 id="comments">Comments</h2>
			<form @submit.prevent="reply()">
				<table>
					<tr>
						<td style="width: 10%">Name</td>
						<td>
							<input type="text" maxlength="25" name="name" ref="name" placeholder="Anonymous"/>
							<input type="submit" :value="posting ? 'Posting...' : 'Reply'" style="width:100px"/>
						</td>
					</tr>
					<tr>
						<td>Comment</td>
						<td><textarea maxlength="1000" name="comment" placeholder="Write a comment..." id="comment" ref="comment"></textarea></td>
					</tr>
					<tr>
						<td>Captcha</td>
						<td>
							<img :src="captcha" /><br/>
							<input type="text" ref="captcha" maxlength="20" placeholder="Captcha"/>
						</td>
					</tr>
				</table>
				<br/>
				Posting content on the site means you agree to its <router-link to="/content">content policy</router-link>. Please read it before posting.<br/>
				<i>TL;DR Nothing illegal under United States law.</i>
			</form>
			<br/><br/>
			<p v-if="comments.length < 1">There are no comments.</p>
			<div v-for="post in comments">
				<post :post="post"></post>
				<br/>
			</div>
		</div>
	</center>
	<center v-else-if="error">
		{{ error }}
	</center>
	<center v-else>
		Loading...
	</center>
</template>

<script>
import { apiUrl } from '../constants';
import { api } from '../utils';

import Vue from 'vue';
import Post from './partial/Post';
Vue.component("post", Post);

export default {
	name: 'ViewPost',
	data() {
		return {
			loaded: false,
			error: null,
			name: null,
			type: null,
			text: null,
			date: null,
			time: null,
			id: this.$route.params.id,
			comments: [],
			api: apiUrl,
			captcha: "/static/captcha.png",
			posting: false
		}
	},
	mounted() {
		var vm = this;
		this.fetchCaptcha();
		api.get(apiUrl+"get_post", {
			id: this.$route.params.id
		}).then(r => {
			if(r.status == "success") {
				vm.name = r.name;
				vm.type = r.type;
				vm.text = r.text;
				vm.date = r.date;
				vm.time = r.time;
				this.loaded = true;
			} else if(r.status == "error") {
				if(r.error == "not_found") {
					this.error = "Invalid post ID";
				} else {
					this.error = "API returned error: "+r.error;
				}
			} else {
				console.error("API returned unknown response status");
				console.error(r);
				this.error = "Unknown error occurred";
			}
		});
		this.fetchComments();
	},
	methods: {
		fetchCaptcha() {
			var vm = this;
			api.get(apiUrl+"captcha_image").then(r => {
				if(r.status == "success") {
					vm.captcha = 'data:image/jpeg;base64,'+r.base64;
				} else if(r.status == "error") {
					alert("API returned error while fetching captcha: "+r.error);
				} else {
					console.error("API returned unknown status");
					console.error(r);
					alert("Unknown error occurred while fetching captcha");
				}
			});
		},
		fetchComments(callback) {
			var vm = this;
			api.get(apiUrl+"comments", {
				post_id: this.$route.params.id
			}).then(r => {
				if(r.status == "success") {
					vm.comments = r.comments;
					if(callback) {
						callback();
					}
				} else if(r.status == "error") {
					console.error("API returned error: "+r.error);
				} else {
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		reply() {
			let comment = this.$refs.comment.value.trim();
			let name = this.$refs.name.value.trim();
			name = name.length > 0 ? name : "Anonymous";
			if(comment.length > 0) {
				this.posting = true;
				var vm = this;
				api.post(apiUrl+"post_reply", {
					name: name,
					comment: comment,
					captcha: this.$refs.captcha.value.trim(),
					post_id: this.$route.params.id
				}).then(r => {
					if(r.status == "success") {
						vm.$refs.comment.value = "";
						vm.fetchComments(() => window.scrollTo(0, document.body.scrollHeight));
					} else if(r.status == "error") {
						if(r.error == "invalid_captcha") {
							alert("You failed the captcha!");
						} else {
							alert("API returned error: "+r.error);
						}
					}
					vm.fetchCaptcha();
					vm.$refs.captcha.value = "";
					vm.posting = false;
				});
			} else {
				alert("Your comment may not be blank.")
			}
		},
		quote(id) {
			let cmt = this.$refs.comment.value;
			this.$refs.comment.value+=">>"+id+"\n";
			this.$refs.comment.focus();
		}
	}
}
</script>

<style scoped>
#text {
	height: 48vh;
}
#comment {
	height: 200px;
}

.item {
	margin: 0px;
	margin-bottom: 20px;
	word-wrap: break-word;
	max-width: calc(80vw - 80px);
}

table {
	width: calc(80vw - 25px);
}
td {
	padding: 10px;
	background: rgb(20, 20, 20);
}
td textarea {
	width: calc(100% - 15px);
}
button {
	width: 40vw;
}
</style>
