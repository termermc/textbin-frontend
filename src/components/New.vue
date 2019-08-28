<template>
	<center>
		<h1>New Post</h1>
		<form @submit.prevent="post()">
			<input maxlength="80" name="name" value="Untitled Post" type="text" ref="name" placeholder="Name"/>
			<br/><br/>
			<textarea name="text" ref="text" placeholder="Paste text here..."></textarea>
			<br/>
			<div class="para" style="text-align:left">
				<h2>Options</h2>
				<hr/><br/>
				<label for="type">Type: </label>
				<select name="type" v-model="type">
					<option value="text">Plain text</option>
					<option value="html">HTML</option>
					<option value="markdown">Markdown</option>
				</select>
				<i v-if="type == 'text'">
					Viewable as plain text
				</i>
				<i v-else-if="type == 'html'">
					Viewable as an HTML page and plain text
				</i>
				<i v-else>
					Viewable as markdown (on view page or via link) and plain text
				</i>
				<br/><br/>
				<label for="category">Category: </label>
				<select name="category" v-model="category">
					<template v-for="cat in categories">
						<option :value="cat.id">{{cat.name}}</option>
					</template>
				</select>
				<i>{{cat(category).description}}</i>
				<br/><br/>
				Posting content on the site means you agree to its <router-link to="/content">content policy</router-link>. Please read it before posting.<br/>
				<i>TL;DR Nothing illegal under United States law.</i>
			</div>
			<br/><br/>
			<input v-if="!$root.banned" type="submit" value="Waiting for posting status..." ref="submit" disabled>
			<template v-else>
				<input type="submit" value="Your IP address is banned" ref="submit" disabled>
				<br><br>
				<router-link to="/ban">View ban info</router-link>
			</template>
		</form>
	</center>
</template>

<script>
import { apiUrl } from '../constants';
import { api } from '../utils';

export default {
	name: "New",
	data() {
		return {
			type: "text",
			category: -1,
			loaded: false,
			remaining: -1,
			categories: []
		}
	},
	methods: {
		post() {
			if(this.loaded) {
				let name = this.$refs.name.value;
				let text = this.$refs.text.value;
				let type = this.type;
				let category = this.category;
				
				if(text.length < 1) {
					alert("Please enter some text to post");
				} else {
					this.$refs.submit.value = "Posting...";
					api.post(apiUrl+'post', {
						name: name,
						text: text,
						type: type,
						category: category
					}).then(r => {
						if(r.status == "success") {
							if(this.category > -1) {
								this.$root.$router.push('/'+this.cat(this.category).code+'/'+r.post_id);
							} else {
								this.$root.$router.push("/view/"+r.post_id);
							}
						} else if(r.status == "error") {
							if(r.error == "banned") {
								alert("Your IP address is banned!");
							} else {
								alert("API returned error while posting: "+r.error);
								this.$refs.submit.value = "Post";
							}
						} else {
							console.error("API returned error");
							console.error(r);
							alert("Unknown error occurred while posting");
							this.$refs.submit.value = "Post";
						}
					});
				}
			} else {
				alert("Waiting for posting status from server");
			}
		},
		cat(id) {
			let cat = "";
			for(let i = 0; i < this.categories.length; i++) {
				if(this.categories[i].id == id) {
					cat = this.categories[i];
					break;
				}
			}
			
			return cat;
		}
	},
	mounted() {
		var vm = this;
		api.get(apiUrl+"post_status").then(r => {
			if(r.status == "success") {
				vm.remaining = r.remaining;
				vm.categories = r.categories;
				if(r.remaining > 0) {
					vm.$refs.submit.disabled = false;
					vm.$refs.submit.value = "Post";
				} else {
					vm.$refs.submit.value = "You must wait for a post to expire before posting again";
				}
				vm.loaded = true;
				
				// Set category if route param present
				if(this.$route.params.category) {
					for(let i = 0; i < this.categories.length; i++) {
						let cat = this.categories[i];
						if(cat.code == this.$route.params.category) {
							this.category = cat.id;
							break;
						}
					}
					if(this.category < 0) {
						this.$router.push("/new");
					}
				}
			} else if(r.status == "error") {
				vm.$refs.submit.value = "API returned error: "+r.error;
			} else {
				vm.$refs.submit.value = "Unknown error occurred";
			}
		});
	}
}
</script>

<style scoped>
textarea {
	height: 70vh;
}
input[type="submit"] {
	width: 30vw;
}
</style>
