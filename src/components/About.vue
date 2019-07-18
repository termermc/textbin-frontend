<template>
	<div>
		<center>
			<h1>About {{ name }}</h1>
		</center>
		<p class="para">
			{{ name }} is a free text and HTML host with an emphasis on privacy.
			User data is never stored for more than 24 hours, and IP addresses are stored in a hashed form,
			as to keep users anonymous. For extra transparency, all of the site's
			<router-link to="/source">source code</router-link> is publicly available on GitHub.
			It's currently paid for out of pocket, and does not run ads, nor will it in the forseeable future.
		</p>
	</div>
</template>

<script>
import { serviceName } from '../constants.js';
export default {
	data() {
		return {
			name: serviceName
		}
	}
}
</script>