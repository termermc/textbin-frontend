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
				</select>
				<i v-if="type == 'text'">
					Viewable as plain text
				</i>
				<i v-else>
					Viewable as an HTML page and plain text
				</i>
				<br/><br/>
				<label for="visibiliy">Visibility: </label>
				<select name="visibility" v-model="visibility">
					<option value="public">Public</option>
					<option value="private">Private</option>
				</select>
				<i v-if="visibility == 'public'">
					Will be listed on the <router-link to="/public">public posts</router-link> page
				</i>
				<i v-else>
					Will only be available via a link
				</i>
				<br/><br/>
				Posting content on the site means you agree to its <router-link to="/content">content policy</router-link>. Please read it before posting.<br/>
				<i>TL;DR Nothing illegal under United States law.</i>
			</div>
			<br/><br/>
			<input type="submit" value="Waiting for posting status..." ref="submit" disabled>
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
			visibility: "public",
			loaded: false,
			remaining: -1
		}
	},
	methods: {
		post() {
			if(this.loaded) {
				let name = this.$refs.name.value;
				let text = this.$refs.text.value;
				let type = this.type;
				let visibility = this.visibility;
				
				if(text.length < 1) {
					alert("Please enter some text to post");
				} else {
					this.$refs.submit.value = "Posting...";
					api.post(apiUrl+'post', {
						name: name,
						text: text,
						type: type,
						visibility: visibility
					}).then(r => {
						if(r.status == "success") {
							this.$root.$router.push("/view/"+r.post_id);
						} else if(r.status == "error") {
							alert("API returned error while posting: "+r.error);
						} else {
							console.error("API returned error");
							console.error(r);
							alert("Unknown error occurred while posting");
						}
					});
				}
			} else {
				alert("Waiting for posting status from server");
			}
		}
	},
	mounted() {
		var vm = this;
		api.get(apiUrl+"post_limit").then(r => {
			if(r.status == "success") {
				vm.remaining = r.remaining;
				if(r.remaining > 0) {
					vm.$refs.submit.disabled = false;
					vm.$refs.submit.value = "Post";
				} else {
					vm.$refs.submit.value = "You must wait for a post to expire before posting again";
				}
				vm.loaded = true;
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
