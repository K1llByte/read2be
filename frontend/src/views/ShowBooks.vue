<template>
	<v-app>
		<div>
			<h1 class="armwrestler x-large dark my-4">Books</h1>
			
			<!-- Search Bar -->
			<v-card
				class="mx-auto mb-5 d-flex justify-space-around mt-2"
				color="rgba(255,0,0,0.1)"
				height="95"
				width="1300"
			>
				<v-text-field
					v-model="search"
					class="my-auto mx-12"
					color="#f07977"
					background-color="#f9f2f2"
					hide-details
					label="Search"
					solo
					single-line
					append-icon="mdi-magnify"
					@click:append="sendSearch"
					@keydown.enter="sendSearch"
					@keydown.esc="search = ''"
				></v-text-field>
			</v-card>
			
			<!-- Filters -->
			<v-card
				class="mx-auto mt-2"
				color="rgba(255,0,0,0.1)"
				height="95"
				width="1300"
			>
				<v-container fluid>
					<v-row class="mx-3 mr-n10">
						<v-col
							v-for="(t, i) in teste"
							:key="i"
						>
							<v-container fluid>
								<v-select
									v-model="t.value"
									:items="t.items"
									:label="t.title"
									solo
								>
									<template v-slot:selection="{ item, index }">
									<v-chip v-if="index === 0">
										<span>{{ item }}</span>
									</v-chip>
									</template>
								</v-select>
							</v-container>
						</v-col>
						
						<v-col>
							<v-btn
								height="40"
								width="120"
								class="mt-4 ml-16 grey lighten-4"
							>
								<!-- @click="submitFilter" -->
								Search
							</v-btn>
						</v-col>
						<v-col>
							<v-btn
								height="40"
								width="120"
								class="mt-4 ml-n16 grey lighten-4"
								@click="resetFilter"
							>
								Reset
							</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</v-card>
			
			<!-- Books -->
			<v-card class="mx-auto pt-5 pb-3 mt-6" color="rgb(255, 0, 0, 0.2)"  width="1300px">
				<v-container>
					<v-row>
						<v-col
							v-for="b in books"
							:key="b.name"
							cols="2"
						>
							<Book :b="b"/>
						</v-col>
					</v-row>
					<v-row class="mt-4">
						<v-col>
							<div class="text-center">
								<v-pagination
									color="teal lighten-1"
									v-model="page"
									:length="10"
									:total-visible="7"
									@input="changePage"
								></v-pagination>
							</div>
						</v-col>
					</v-row>
				</v-container>
			</v-card>
		</div>
	</v-app>
</template>

<script>
import axios from "axios";
import Book from "@/components/Book.vue";

export default {
	name: 'ShowBooks',

	components: { Book },

	data: () => ({
		search: '',
		books: [],
		page: 1,
		updated: false,
		teste: [
			{
				title: 'Genre',
				items: ['Fantasy', 'Mystery', 'Romance', 'Biography', 'Non-Fiction', 'Sci-Fi'],
				value: [],
			},
			{
				title: 'Unread',
				items: ['Unread', 'Read'],
				value: [],
			},
			{
				title: 'Year',
				items: ['1980', '1990', '2000', '2010', '2020'],
				value: [],
			},
			{
				title: 'Sort By',
				items: ['Relevance', 'Most Recent', 'Less Recent'],
				value: [],
			},
		],
	}),

	methods: {
		changePage: function() {
			// get books' name and image
			axios
				.get('/read2be/api/books?page_num=' + this.page + '&page_limit=12', this.$getOptions())
				.then(res => {
					this.books = res.data.books;
				})
				.catch(e => console.log('Erro no GET dos books do author: ' + e));
		},
		sendSearch: function() {
			// get books' by search
			axios
				.get('/read2be/api/books?q=' + this.search + "&" + this.page + '&page_limit=12', this.$getOptions())
				.then(res => {
					this.books = res.data.books;
				})
				.catch(e => console.log('Erro no GET dos books do author: ' + e));
		},
		resetFilter: function() {
			for(var i = 0; i < this.teste.length; i++) {
				this.teste[i].value = [];
			}
		},
	},

	created: function() {
		// get books' name and image
		// existe maneira de usar aqui o changePage para não repetir?
		axios
			.get('/read2be/api/books?page_num=' + this.page + '&page_limit=12', this.$getOptions())
			.then(res => {
				this.books = res.data.books;
			})
			.catch(e => console.log('Erro no GET dos books do author: ' + e));
	},
};

</script>

<style scoped>
	.v-card.on-hover.theme--light {
		background-color: rgba(#FFF, 0.8);
	}
	.v-card__text {
			color: #fff;
	}
</style>