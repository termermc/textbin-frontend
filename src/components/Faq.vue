<template>
	<center>
		<h1>TextBin FAQ</h1>

		<div class="item">
			<h2>What is it?</h2>
			<p>
				TextBin is a text hosting and anonymous text board that's designed to be privacy-respecting and liberal in regards to rules.
				<br/><br/>
			</p>
		</div>
		<div class="item">
			<h2>Privacy-respecting?</h2>
			<p>
				A privacy-respecting service is a service that does not store excessive user data and respects the privacy preferences of its users.
				<br/><br/>
			</p>
		</div>
		<div class="item">
			<h2>How much text can I store?</h2>
			<p>
				You are free to store 5MB or less of text in a post. You may make a maximum of 20 posts per day (not including comments).
				Private posts will automatically be deleted after 24 hours, public ones will be deleted after 7 days.
			</p>
		</div>
		<div class="item">
			<h2>Do I need an account?</h2>
			<p>
				Nope! Accounts are unnecessary and inconvenient for a service like this.
				<br/><br/><br/>
			</p>
		</div>
		<div class="item">
			<h2>Why?</h2>
			<p>
				Because I feel like it, and it's useful to me. It's also a fun web project to maintain.
				<br/><br/><br/>
			</p>
		</div>
		<div class="item">
			<h2>Who runs {{ name }}?</h2>
			<p>
				It's run by <a :href="authorLink">{{ author }}</a>.
				<br/><br/><br/>
			</p>
		</div>
		<div class="item">
			<h2>I want the source!</h2>
			<p>
				All of {{ name }}'s source code (including frontend) is available on GitHub.<br/>
				See the <router-link to="/source">source</router-link> page for links.
				<br/><br/>
			</p>
		</div>
	</center>
</template>

<script>
import { serviceName, author, authorLink } from '../constants.js';

export default {
	name: 'Faq',
	data() {
		return {
			name: serviceName,
			author: author,
			authorLink: authorLink
		}
	}
}
</script>
