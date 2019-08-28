<template>
	<div class="item">
		<h2>Bans</h2>
		<center>
			<table style="width: 100%">
				<tr>
					<th>IP Hash</th>
					<th>Ban Reason</th>
					<th>Banned By</th>
					<th>Timestamp</th>
					<th>Action</th>
				</tr>
				<tr v-for="ban in bans">
					<td>{{ ban.ip }}</td>
					<td>{{ ban.reason }}</td>
					<td>{{ ban.banner_username }}</td>
					<td>{{ ban.timestamp }}</td>
					<td><a href="javascript:;" @click="revokeBan(ban.id)">Revoke</a></td>
				</tr>
			</table>
		</center>
		<br>
		<a href="javascript:;" @click="loadBans()">Reload</a>
		<div>
			<br><br>
			<b>Ban IP</b>
			<br>
			<form @submit.prevent="banSubmit()">
				<input type="text" placeholder="IP" ref="ip"/>
				<input type="text" placeholder="Reason" ref="reason"/>
				<input type="submit" value="Ban IP"/>
			</form>
		</div>
	</div>
</template>

<script>
import { apiUrl } from '../../constants.js';
import { api } from '../../utils.js';

export default {
	name: "Bans",
	data() {
		return {
			bans: [{hash: "Loading...", reason: "", id: -1}]
		}
	},
	mounted() {
		this.loadBans();
	},
	methods: {
		loadBans() {
			var vm = this;
			api.get(apiUrl+'bans').then(r => {
				if(r.status == "success") {
					vm.bans = r.bans;
				} else if(r.status == "error") {
					vm.bans = [{ ip: "Error retrieving bans: "+r.error }];
				} else {
					vm.ban = [{ ip: "API returned unknown status: "+r.status }];
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		revokeBan(id) {
			var vm = this;
			api.post(apiUrl+'revoke_ban', { id: id }).then(r => {
				if(r.status == "success") {
					vm.loadBans()
				} else if(r.status == "error") {
					alert("API returned error: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.error("API returned unknown status");
					console.error(r);
				}
			});
		},
		banSubmit() {
			let ip = this.$refs.ip.value.trim();
			let reason = this.$refs.reason.value.trim();
			
			if(ip.length > 0 && reason.length > 0) {
				let ipv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm;
				let ipv6 = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/g;
				
				if(ipv4.test(ip) || ipv6.test(ip)) {
					var vm = this;
					api.post(apiUrl+'ban', {
						ip: ip,
						reason: reason
					}).then(r => {
						if(r.status == "success") {
							vm.loadBans();
						} else if(r.status == "error") {
							alert("API returned error: "+r.error);
						} else {
							alert("API returned unknown status: "+r.status);
							console.error("API returned unknown status");
							console.error(r);
						}
					});
				} else {
					alert("Invalid IP address");
				}
			} else {
				alert("You must provide an IP address and ban reason");
			}
		}
	}
}
</script>
