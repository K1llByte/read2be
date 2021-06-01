<template>
	<div>
		<h1 class="armwrestler x-large dark my-4">Home</h1>
		<Books />
	</div>
</template>


<script>
import Books from '../components/Books.vue';

export default {
	name: 'Home',
	components: { Books },

	data: () => ({
	})
}
</script>
