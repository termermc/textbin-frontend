<template>
	<center>
		<h1>Source Code</h1>
		All of {{ name }}'s source code is freely available on GitHub.<br/>
		Below are the frontend and backend repositories.
		<br/><br/>
		<h2>
			<span title="Ooooh look! I'm an ES6 arrow function!">=></span> <a :href="repo+frontend">Frontend</a><br/>
			<br/>
			<span title="Ooooh look! I'm an ES6 arrow function!">=></span> <a :href="repo+backend">Backend</a><br/>
		</h2>
	</center>
</template>

<script>
import { serviceName, repoRoot, repoFrontend, repoBackend } from '../constants';

export default {
	name: 'Source',
	data() {
		return {
			name: serviceName,
			repo: repoRoot,
			frontend: repoFrontend,
			backend: repoBackend
		}
	}
}
</script>