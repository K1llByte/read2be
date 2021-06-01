<template>
	<div>
		<h1 class="armwrestler x-large dark my-4">Home</h1>
		<Filters />
		<Books />
	</div>
</template>


<script>
import Books from '../components/Books.vue';
import Filters from '../components/Filters.vue';

export default {
	name: 'Home',
	components: { Books, Filters},

	data: () => ({
	})
}
</script>
