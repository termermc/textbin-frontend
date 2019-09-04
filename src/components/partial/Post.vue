<template>
	<div class="item">
		<span style="position:relative;bottom:130px;" :id="'p'+post.id"></span>
		<b>
			<a v-if="post.email && post.email != 'null' && post.email != 'sage'" :href="'mailto:'+post.email" :class="post.trip ? 'trip' : ''">{{ post.name }}<span v-if="post.trip" style="font-weight:100">!{{ post.trip }}</span></a>
			<span v-else :class="post.trip ? 'trip' : ''">{{ post.name }}<span style="font-weight:100" v-if="post.trip">!{{ post.trip }}</span></span>
		</b>
		<i v-if="post.you">(You)</i>
		<b v-if="post.poster_rank > 0" style="color:yellow">{{ post.rank_flare }}</b>
		<b v-if="post.email == 'sage'" style="color:red">SAGE!</b> <span>{{ post.date }}</span> <span>{{ post.time }}</span> No.
		<a :href="'#p'+post.id" style="color:white;cursor:pointer" class="num" @click.prevent="$parent.quote(post.id)">{{ post.id }}</a>
		<br/>
		<template v-if="post.text.length <= 1000 || expanded">
			<p v-html="process(post.text)"></p>
			<a v-if="post.text.length > 1000" href="javascript:;" @click="expanded = false">Collapse reply</a>
		</template>
		<template v-else>
			<p v-html="process(limit(post.text))"></p><a href="javascript:;" @click="expanded = true">Expand reply</a>
		</template>
		<span v-if="post.ban_text" class="ban">({{ post.ban_text }})</span>
		<div v-if="$root.rank > 0 && !post.you" class="mod-tools">
			<button v-if="!post.ban_text" @click="ban(post)">Ban Poster</button> <button @click="banDelete(post)">Ban Poster and Delete Post</button>
		</div>
	</div>
</template>

<script>
import { apiUrl } from '../../constants.js';
import { api } from '../../utils.js';

export default {
	name: 'Post',
	props: ['post'],
	data() {
		return {
			expanded: false
		}
	},
	methods: {
		limit(str) {
			// Limit string to 20 characters
			let val = str;
			if(val.length > 1000) {
				val = val.substr(0, 1000-3)+'...';
			}
			return val;
		},
		process(text) {
			let txt = "";
			text = text
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;");
			var lns = text.split(/\n/g);
			for(let i = 0; i < lns.length; i++) {
				let ln = lns[i];
				if(ln.startsWith("&gt;&gt;")) {
					let ref = ln.split(/ /g)[0];
					txt+="<a href='#p"+ref.substr(8)+"'>"+ref+"</a>"+ln.substr(ref.length);
				} else if(ln.startsWith("&gt;")) {
					txt+="<span style='color:lime'>"+ln+"</span>";
				} else if(ln.startsWith("&lt;")) {
					txt+="<span style='color:red'>"+ln+"</span>";
				} else {
					txt+=ln;
				}
				txt+="<br/>";
			}

			return txt;
		},
		ban(post) {
			let reason = prompt("Ban reason");
			let text = prompt("Ban text", "User was banned for this post");
			
			api.post(apiUrl+'ban', {
				comment_id: post.id,
				reason: reason,
				ban_text: text
			}).then(r => {
				if(r.status == "success") {
					post.ban_text = text;
				} else if(r.status == "error") {
					alert("API returned error: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.log("API returned unknown status");
					console.error(r);
				}
			});
		},
		banDelete(post) {
			let reason = prompt("Ban reason");
			
			var vm = this;
			api.post(apiUrl+'ban', {
				comment_id: post.id,
				reason: reason,
				delete: true
			}).then(r => {
				if(r.status == "success") {
					for(let i = 0; i < vm.$parent.comments.length; i++) {
						if(vm.$parent.comments[i] === post) {
							vm.$parent.comments.splice(i, 1);
						}
					}
				} else if(r.status == "error") {
					alert("API returned error: "+r.error);
				} else {
					alert("API returned unknown status: "+r.status);
					console.log("API returned unknown status");
					console.error(r);
				}
			});
		}
	}
}
</script>

<style scoped>
	.trip {
		color: green;
	}
	.ban {
		font-size: 20px;
		font-weight: bold;
		color: red;
		text-transform: uppercase;
	}
</style>
