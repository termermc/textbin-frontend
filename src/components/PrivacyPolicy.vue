<template>
	<div>
		<center><h1>Privacy Policy</h1></center>
		<p class="para">
			This privacy notice discloses the privacy practices for {{ name }}. This privacy notice applies solely to information collected by this website. It will notify you of the following:<br/>
			<br/>
				What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.<br/>
				What choices are available to you regarding the use of your data.<br/>
				The security procedures in place to protect the misuse of your information.<br/>
				How you can correct any inaccuracies in the information.<br/>
			<br/>
			<b>Information Collection, Use, and Sharing</b><br/>
			We are the sole owners of the information collected on this site. We only have access to/collect information that you voluntarily give us via forms on the website. We will not sell or rent this information to anyone.<br/>
			<br/>
			We will use this information to display content on the site, and reduce spam and service abuse.<br/>
			<br/>
			<b>Data retention</b><br/>
			All data submitted through the website will be kept for a maximum of seven (7) days, after which it will be permanently deleted.<br/>
			<br/>
			If you feel that we are not abiding by this privacy policy, you should contact the owner via email at termer{{ '@' }}{{ 'protonmail' }}.{{ 'com' }}<br/>
		</p>
	</div>
</template>

<script>
import { serviceName } from '../constants';

export default {
	name: 'PrivacyPolicy',
	data() {
		return {
			name: serviceName
		}
	}
}
</script>
