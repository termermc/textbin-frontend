<template>
	<div class="item">
		<h2>Account</h2>
		<div>
			<b>Update Password</b>
			<br>
			<br v-if="passError || passSuccess"/>
			<div class="error" v-if="passError">{{ passError }}</div>
			<div class="success" v-if="passSuccess">{{ passSuccess }}</div>
			<br v-if="passError || passSuccess"/>
			<br>
			<form @submit.prevent="updatePassword()">
				<input type="password" ref="curPass" placeholder="Current Password" />
				<br>
				<input type="password" ref="newPass" placeholder="New Password" />
				<br>
				<input type="password" ref="confPass" placeholder="Confirm New Password" />
				<br>
				<input type="submit" value="Update">
			</form>
			<br><br>
			<b>Logging Settings</b>
			<br><br>
			<p v-if="account.status == 'loading'">Loading...</p>
			<button v-else @click="toggleLogging()">{{ account.record_logins ? "Disable IP Logging" : "Enable IP Logging" }}</button>
			<template v-if="account.logins && account.logins.length > 0">
				<br><br><br>
				<b>Access Logs</b>
				<br>
				<table style="width: 100%">
					<tr>
						<th>IP</th>
						<th>Timestamp</th>
					</tr>
					<tr v-for="login in account.logins">
						<td>{{ login.ip }}</td>
						<td>{{ login.timestamp }}</td>
					</tr>
				</table>
			</template>
		</div>
	</div>
</template>

<script>
import { apiUrl } from '../../constants.js';
import { api } from '../../utils.js';

export default {
	name: "Account",
	data() {
		return {
			account: { status: "loading" },
			passError: null,
			passSuccess: null
		}
	},
	mounted() {
		this.loadAccount();
	},
	methods: {
		loadAccount() {
			var vm = this;
			api.get(apiUrl+'account').then(r => {
				if(r.status == "success" || r.status == "error") {
					vm.account = r;
				} else {
					vm.ban = [{ ip: "API returned unknown status: "+r.status }];
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		updatePassword() {
			var vm = this;
			
			api.post(apiUrl+'update_account', {
				current_password: vm.$refs.curPass.value,
				new_password: vm.$refs.newPass.value,
				confirm_password: vm.$refs.confPass.value
			}).then(r => {
				if(r.status == "success") {
					vm.passSuccess = "Password changed successfully";
					vm.passError = null;
				} else if(r.status == "error") {
					vm.passSuccess = null;
					vm.passError = "API returned error: "+r.error;
				} else {
					vm.passSuccess = null;
					vm.passError = "API returned unknown status: "+r.status;
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		toggleLogging() {
			// Toggle button display prematurely
			this.account.record_logins = !this.account.record_logins;
			
			var vm = this;
			api.post(apiUrl+'update_account', { record_logins: vm.account.record_logins }).then(r => {
				if(r.status == "success") {
					// Success
				} else if(r.status == "error") {
					alert("API returned error: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
				}
				
				// Correct value on failure
				if(r.status != "success") {
					vm.account.record_logins = !vm.account.record_logins;
				}
			});
		}
	}
}
</script>
