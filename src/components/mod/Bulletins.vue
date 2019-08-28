<template>
	<div class="item">
		<h2>Bulletins</h2>
		<center>
			<table style="width: 100%">
				<tr>
					<th>Content</th>
					<th>Date</th>
					<th>Poster</th>
					<th>Action</th>
				</tr>
				<tr v-for="bulletin in bulletins">
					<td>{{ bulletin.content }}</td>
					<td>{{ bulletin.date+' '+bulletin.time }}</td>
					<td>{{ bulletin.poster_username }}</td>
					<td><a href="javascript:;" @click="deleteBulletin(bulletin.id)">Delete</a></td>
				</tr>
			</table>
		</center>
		<br>
		<a href="javascript:;" @click="loadBulletins()">Reload</a>
		<div>
			<br><br>
			<b>Create Bulletin</b>
			<br>
			<form @submit.prevent="bulletinSubmit()">
				<input type="text" placeholder="Content" ref="content"/>
				<input type="submit" value="Create"/>
			</form>
		</div>
	</div>
</template>

<script>
import { apiUrl } from '../../constants.js';
import { api } from '../../utils.js';

export default {
	name: "Bulletins",
	data() {
		return {
			bulletins: [{content: "Loading...", date: "", time: "", account_username: "", id: -1}]
		}
	},
	mounted() {
		this.loadBulletins();
	},
	methods: {
		loadBulletins() {
			var vm = this;
			api.get(apiUrl+'bulletins').then(r => {
				if(r.status == "success") {
					vm.bulletins = r.bulletins;
				} else if(r.status == "error") {
					vm.bulletins = [{ content: "Error retrieving bans: "+r.error }];
				} else {
					vm.bulletins = [{ content: "API returned unknown status: "+r.status }];
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		deleteBulletin(id) {
			var vm = this;
			api.post(apiUrl+'delete_bulletin', { id: id }).then(r => {
				if(r.status == "success") {
					vm.loadBulletins()
				} else if(r.status == "error") {
					alert("API returned error: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		bulletinSubmit() {
			let content = this.$refs.content.value.trim();
			
			if(content.length > 0) {
				var vm = this;
				api.post(apiUrl+'create_bulletin', {
					content: content
				}).then(r => {
					if(r.status == "success") {
						vm.loadBulletins();
					} else if(r.status == "error") {
						alert("API returned error: "+r.error);
					} else {
						alert("API returned unknown status: "+r.status);
						console.error("API returned unknown status");
						console.error(r);
					}
				});
			} else {
				alert("Bulletins cannot be blank");
			}
		}
	}
}
</script>
