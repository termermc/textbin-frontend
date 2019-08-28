<template>
	<center v-if="loaded">
		<textarea v-if="category_code" id="banner" disabled v-model="ascii"></textarea>
		<h1>{{ name }}</h1>
		<span>Posted at <b>{{ time }}</b> on <b>{{ date }}</b> {{ category > -1 ? "in" : "" }} <b v-if="category > -1">{{ category_name }}</b></span>
		<img v-if="sticky" class="sticky" title="Sticky" src="/static/pin.svg">
		<template v-if="$root.rank > 0">
			<br><br>
			<button @click="toggleSticky()">{{ sticky ? "Remove Sticky" : "Make Sticky" }}</button>
		</template>
		<br/><br/>
		<div id="markdown" v-if="type == 'markdown'" v-html="renderMarkdown(text)"></div>
		<textarea v-else id="text" readonly v-model="text"></textarea>
		<br/>
		<br/>
		<div style="text-align:left;margin-left:10vw">
			<a :href="api+'raw/'+id">
				<button>View raw</button>
			</a>
			<a v-if="type == 'html'" :href="api+'html/'+id">
				<button>View as HTML</button>
			</a>
			<a v-if="type == 'markdown'" :href="api+'markdown/'+id">
				<button>View as markdown</button>
			</a>
			<br/><br/>
			<template v-if="$root.rank > 0">
				<button @click="ban(false)">Ban poster</button>
				<button @click="ban(true)">Ban and delete post</button>
				<br/><br/>
			</template>
			<h2 id="comments">Comments</h2>
			<form @submit.prevent="reply()">
				<table>
					<tr>
						<td style="width: 10%">Name</td>
						<td>
							<input type="text" maxlength="40" name="name" ref="name" placeholder="Anonymous"/>
							<input type="submit" :value="posting ? 'Posting...' : 'Reply'" style="width:100px"/>
						</td>
					</tr>
					<tr>
						<td style="width: 10%">Email</td>
						<td>
							<input type="text" maxlength="30" name="email" ref="email" placeholder=""/>
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
			<br><br>
			<div id="update-options">
				<button @click="refresh()">{{ updating ? "Refreshing..." : "Refresh" }}</button> <input type="checkbox" name="autoUpdate" v-model="autoUpdate"/> <label for="autoUpdate">Auto-refresh replies</label>
				<template v-if="autoUpdate">
					<br><br>
					Refreshing replies in {{ updateTimer }}...
				</template>
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

import figlet from 'figlet';
import fonts from '../fonts.json';
import hljs from 'highlight.js';
import 'highlight.js/styles/agate.css';
import Vue from 'vue';
import Post from './partial/Post';
Vue.component("post", Post);

var md = require('markdown-it')({
	highlight(str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) {}
		}
		return '';
	}
}).disable('image');

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
			sticky: 0,
			jumpComment: null,
			id: this.$route.params.id,
			comments: [],
			api: apiUrl,
			captcha: "/static/captcha.png",
			posting: false,
			category: -1,
			category_name: "Private",
			ascii: "",
			autoUpdate: true,
			updateTimer: 10,
			updateReset: 10,
			updating: false,
			updater: null
		}
	},
	updated() {
		this.$nextTick(function() {
			if(this.jumpComment) {
				var vm = this;
				setTimeout(function() {
					if(vm.jumpComment) {
						document.getElementById('p'+vm.jumpComment).scrollIntoView();
						vm.$refs.comment.value += ">>"+vm.jumpComment+'\n';
					}
					vm.jumpComment = null;
				}, 100);
			}
		});
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
				vm.sticky = r.sticky;
				vm.category = r.category;
				vm.category_name = r.category_name;
				vm.category_code = r.category_code;
				this.loaded = true;
				
				// Jump to comment if present in URL
				if(location.toString().includes("#p")) {
					this.jumpComment = location.toString().split("#p")[1];
				}
				
				// Correct URL if need be
				let path = vm.$route.path;
				if(vm.category > -1) {
					if(/\/(.|..|...|....)\//.test(path) && !path.startsWith("/view/")) {
						let code = path.substr(1, path.lastIndexOf('/'));
						if(code != vm.category_code) {
							vm.$router.push('/'+vm.category_code+'/'+vm.$route.params.id);
						}
					} else {
						vm.$router.push('/'+vm.category_code+'/'+vm.$route.params.id);
					}
				} else if(!path.startsWith("/view/")) {
					vm.$router.push("/view/"+vm.$route.params.id);
				}
				
				// Load Figlet fonts
				figlet.defaults({ fontPath: '/static/fonts' });
				
				// Set banner text
				if(vm.category_code) {
					figlet('/'+vm.category_code+'/ - '+r.category_name, 'Standard', function(err, txt) {
						if(err) {
							console.error("Failed to render banner:");
							console.error(err);
							vm.category_code = null;
						} else {
							vm.ascii = txt;
						}
					});
				}
				
				document.title = r.name + (r.category > -1 ? " - " + r.category_name : "") + " - TextBin";
				
				// Register comment auto-updater
				
				vm.updater = setInterval(function() {
					if(vm.autoUpdate) {
						if(vm.updateTimer > 1) {
							vm.updateTimer--;
						} else {
							vm.updateReset+=10;
							vm.updateTimer = vm.updateReset;
							vm.fetchComments();
						}
					} else {
						vm.updateTimer = 10;
						vm.updateReset = 10;
					}
				}, 1000);
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
		ban(delPost) {
			var vm = this;
			api.post(apiUrl+'ban', {
				post_id: vm.$route.params.id,
				delete: delPost,
				reason: prompt("Ban reason")
			}).then(r => {
				if(r.status == "success") {
					alert("Poster banned");
					if(delPost)
						vm.$router.push('/'+vm.category_code+'/');
				} else if(r.status == "error") {
					alert("API returned error: "+r.error);
					console.error("API returned error: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		toggleSticky() {
			// Prematurely update value
			this.sticky = !this.sticky;
			
			var vm = this;
			api.post(apiUrl+'post_sticky', {
				sticky: vm.sticky,
				post_id: vm.$route.params.id
			}).then(r => {
				if(r.status == "success") {
					// Success
				} else if(r.status == "error") {
					alert("API returned error: "+r.error);
					console.error("API returned error: "+r.error);
					vm.sticky = !vm.sticky;
				} else {
					alert("API returned unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
					vm.sticky = !vm.sticky;
				}
			});
		},
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
			this.updating = true;
			var vm = this;
			api.get(apiUrl+"comments", {
				post_id: this.$route.params.id
			}).then(r => {
				if(r.status == "success") {
					vm.comments = r.comments;
					if(callback)
						callback();
				} else if(r.status == "error") {
					console.error("API returned error: "+r.error);
				} else {
					console.error("API returned unknown status");
					console.error(r);
				}
				vm.updating = false;
			});
		},
		refresh() {
			this.updateReset = 10;
			this.updateTimer = 10;
			this.fetchComments();
		},
		renderMarkdown(content) {
			return md.render(content);
		},
		reply() {
			let comment = this.$refs.comment.value.trim();
			let name = this.$refs.name.value.trim();
			name = name.length > 0 ? name : "Anonymous";
			let email = this.$refs.email.value.trim();
			email = email.length > 0 ? email : null;
			if(comment.length > 0) {
				this.posting = true;
				var vm = this;
				api.post(apiUrl+"post_reply", {
					name: name,
					comment: comment,
					captcha: this.$refs.captcha.value.trim(),
					post_id: this.$route.params.id,
					email: email
				}).then(r => {
					if(r.status == "success") {
						vm.$refs.comment.value = "";
						vm.fetchComments(() => window.scrollTo(0, document.body.scrollHeight));
					} else if(r.status == "error") {
						if(r.error == "invalid_captcha") {
							alert("You failed the captcha!");
						} else if(r.error == "bump") {
							alert("Nope!");
							vm.$refs.comment.value = "I don't have anything meaningful to add to the conversation :D";
						} else if(r.error == "banned") {
							alert("Your IP address is banned!");
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
			document.getElementById("comments").scrollIntoView();
			this.$refs.comment.focus();
		},
	},
	beforeRouteLeave(to, from, next) {
		clearInterval(this.updater);
		next();
	}
}
</script>

<style scoped>
#banner {
	text-align: center;
	width: 90vw;
	height: 100px;
	margin-bottom: 4vw;
	background: none;
	border: none;
	resize: none;
	font-size: 1vw;
	text-shadow: 2px 2px gray;
	color: white;
	font-weight: bold;
}
#text {
	height: 48vh;
}
#comment {
	height: 200px;
}
#update-options button {
	width: inherit;
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
#markdown {
	text-align: left;
	width: 80vw;
	height: 50vh;
	background: rgb(20, 20, 20);
	border: 2px solid rgb(70, 70, 70);
	color: white;
	padding: 10px;
	overflow: auto;
}
button {
	width: 40vw;
}
</style>
