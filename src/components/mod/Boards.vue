<template>
	<div class="item">
		<h2>Boards</h2>
		<center>
			<table style="width: 100%">
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Code</th>
					<th>Poster Rank Required</th>
				</tr>
				<tr v-for="board in boards">
					<td>{{ board.name }}</td>
					<td>{{ board.description }}</td>
					<td>{{ board.code }}</td>
					<td>{{ board.rank_name }}</td>
					<td>
						<a href="javascript:;" @click="deleteBoard(board.id)">Delete</a>
						<router-link :to="'/mod/board/'+board.id">Edit</router-link>
					</td>
				</tr>
			</table>
		</center>
		<br>
		<a href="javascript:;" @click="loadBoards()">Reload</a>
		<div>
			<br><br>
			<b>Create Board</b>
			<br>
			<form @submit.prevent="boardSubmit()">
				<input type="text" placeholder="Name" ref="name"/>
				<br>
				<input type="text" placeholder="Description" ref="description"/>
				<br>
				<input type="text" placeholder="Code" ref="code" maxlength="4"/>
				<br>
				<span>Minimum poster rank required</span>
				<br>
				<select ref="rank">
					<template v-for="rank in ranks">
						<option v-if="rank.id <= $root.rank" :value="rank.id">{{ rank.name }}</option>
					</template>
				</select>
				<input type="submit" value="Create"/>
			</form>
		</div>
	</div>
</template>

<script>
import { apiUrl } from '../../constants.js';
import { api } from '../../utils.js';

export default {
	name: "Boards",
	data() {
		return {
			boards: [{name: "Loading..."}],
			ranks: []
		}
	},
	mounted() {
		this.loadBoards();
		
		// Load ranks
		var vm = this;
		api.get(apiUrl+'ranks').then(r => {
			if(r.status == "success") {
					vm.ranks = r.ranks;
				} else if(r.status == "error") {
					alert("Failed to load ranks: "+r.error);
				} else {
					alert("Failed to load ranks, unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
				}
		});
	},
	methods: {
		loadBoards() {
			var vm = this;
			api.get(apiUrl+'categories').then(r => {
				if(r.status == "success") {
					vm.boards = r.categories;
				} else if(r.status == "error") {
					vm.boards = [{ name: "Error retrieving boards: "+r.error }];
				} else {
					vm.boards = [{ name: "API returned unknown status: "+r.status }];
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		deleteBoard(id) {
			if(confirm("Are you sure? Deleting a board will delete all of the board's posts and comments.")) {
				var vm = this;
				api.post(apiUrl+'delete_category', { id: id }).then(r => {
					if(r.status == "success") {
						vm.loadBoards()
					} else if(r.status == "error") {
						alert("API returned error: "+r.error);
					} else {
						alert("API returned unknown status: "+r.status);
						console.error("API returned unknown status");
						console.error(r);
					}
				});
			}
		},
		boardSubmit() {
			let name = this.$refs.name.value.trim();
			let description = this.$refs.description.value.trim();
			let code = this.$refs.code.value.trim();
			let rank = this.$refs.rank.value;
			
			if(name.length > 0 && description.length > 0 && code.length > 0) {
				var vm = this;
				api.post(apiUrl+'create_category', {
					name: name,
					description: description,
					code: code,
					rank: rank
				}).then(r => {
					if(r.status == "success") {
						vm.loadBoards();
					} else if(r.status == "error") {
						alert("API returned error: "+r.error);
					} else {
						alert("API returned unknown status: "+r.status);
						console.error("API returned unknown status");
						console.error(r);
					}
				});
			} else {
				alert("Fields may not be blank");
			}
		}
	}
}
</script>
