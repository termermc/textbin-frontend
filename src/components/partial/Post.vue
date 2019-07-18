<template>
	<div class="item">
		<span style="position:relative;bottom:120px;" :id="'p'+post.id"></span>
		<b>{{ post.name }}</b> <i v-if="post.you">(You)</i> <span>{{ post.date }}</span> <span>{{ post.time }}</span> No.
		<a href="#comments" style="color:white;cursor:pointer" class="num" @click="$parent.quote(post.id)">{{ post.id }}</a>
		<br/>
		<p v-html="process(post.text)"></p>
	</div>
</template>

<script>
export default {
	name: 'Post',
	props: ['post'],
	methods: {
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
		}
	}
}
</script>
