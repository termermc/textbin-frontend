<template>
	<div class="item">
		<h2>Accounts</h2>
		<center>
			<table style="width: 100%">
				<tr>
					<th>Username</th>
					<th>Rank</th>
					<th>Action</th>
				</tr>
				<tr v-for="account in accounts">
					<td>{{ account.username }}</td>
					<td>{{ account.rank_name }}</td>
					<td>
						<template v-if="account.rank < $root.rank">
							<a href="javascript:;" @click="deleteAccount(account.id)">Delete</a>
							<a v-if="account.rank+1 < $root.rank && account.rank < $root.rank" href="javascript:;" @click="editAccount(account.id, account.rank+1)">Promote +</a>
							<a v-if="account.rank > 1 && account.rank < $root.rank" href="javascript:;" @click="editAccount(account.id, account.rank-1)">Demote -</a>
						</template>
						<template v-else>
							None
						</template>
					</td>
				</tr>
			</table>
		</center>
		<br>
		<a href="javascript:;" @click="loadAccounts()">Reload</a>
		<div>
			<br><br>
			<b>Create Account</b>
			<br>
			<form @submit.prevent="accountSubmit()">
				<input type="text" placeholder="Username" ref="username"/>
				<br>
				<input type="password" placeholder="Password" ref="password"/>
				<br>
				<select ref="rank">
					<template v-for="rank in ranks">
						<option v-if="rank.id < $root.rank && rank.id > 0" :value="rank.id">{{ rank.name }}</option>
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
	name: "Accounts",
	data() {
		return {
			accounts: [{username: "Loading...", rank: -1, rank_name: ""}],
			ranks: []
		}
	},
	mounted() {
		this.loadAccounts();
		
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
		loadAccounts() {
			var vm = this;
			api.get(apiUrl+'accounts').then(r => {
				if(r.status == "success") {
					vm.accounts = r.accounts;
				} else if(r.status == "error") {
					vm.accounts = [{ username: "Error retrieving accounts: "+r.error }];
				} else {
					vm.accounts = [{ username: "API returned unknown status: "+r.status }];
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		deleteAccount(id) {
			var vm = this;
			api.post(apiUrl+'delete_account', { id: id }).then(r => {
				if(r.status == "success") {
					vm.loadAccounts()
				} else if(r.status == "error") {
					alert("API returned error: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		accountSubmit() {
			let username = this.$refs.username.value.trim();
			let password = this.$refs.password.value;
			let rank = this.$refs.rank.value;
			
			if(username.length > 0) {
				var vm = this;
				api.post(apiUrl+'create_account', {
					username: username,
					password: password,
					rank: rank
				}).then(r => {
					if(r.status == "success") {
						vm.loadAccounts();
					} else if(r.status == "error") {
						alert("API returned error: "+r.error);
					} else {
						alert("API returned unknown status: "+r.status);
						console.error("API returned unknown status");
						console.error(r);
					}
				});
			} else {
				alert("Usernames cannot be blank");
			}
		},
		editAccount(id, rank) {
			var vm = this;
				api.post(apiUrl+'edit_account', {
					id: id,
					rank: rank
				}).then(r => {
					if(r.status == "success") {
						vm.loadAccounts();
					} else if(r.status == "error") {
						alert("API returned error: "+r.error);
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
