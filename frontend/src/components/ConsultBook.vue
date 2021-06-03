<template>
   <div>
		<v-card class="mx-auto pt-8 pb-8 pb-3 mt-16" color="rgb(255, 0, 0, 0.2)"  width="1300px">
			<v-container>

				<!-- v-row 1 -->
				<v-row>
					
					<!-- v-col 1.1 -->
					<v-col>
						<v-img
							height="380"
							width="270"
							:src=info.cover_url
						></v-img>
					</v-col>

					<!-- v-col 1.2 -->
					<v-col>

						<!-- v-row 3 -->
						<v-row>
							
							<!-- v-col 3.1 -->
							<v-col>
								<v-card
									height="50"
									width="850"
									color="red lighten-4"
									elevation="0"
								>
									<p class="armwrestler small dark">
										{{info.title}}
									</p>
								</v-card>
							</v-col>
						</v-row>

						<!-- v-row 4 -->
						<v-row>

							<!-- v-col 4.1 -->
							<v-col>
								<v-card
									height="305"
									width="360"
									color="red lighten-4"
									elevation="0"
								>
									<p class="main-color" style="font-size:130%; padding-top:10px;">
										<strong class="armwrestler dark x-small">ISBN:<br></strong>
										{{info.isbn}}
									</p>
									<p class="main-color" style="font-size:130%; margin-bottom:2px;">
										<strong class="armwrestler dark x-small">Authors: </strong>
									</p>
									<p
										class="armwrestler main-color"
										style="font-size:150%; margin-bottom:4px;"
										v-for="a in info.authors"
										:key=a
									>
										{{a}}
									</p>
									<p class="main-color" style="font-size:130%; margin-bottom:2px;">
										<strong class="armwrestler dark x-small">Year: </strong>
									</p>
									<p
										class="armwrestler main-color"
										style="font-size:150%; margin-bottom:4px;">
										{{info.published_year}}
									</p>
								</v-card>
							</v-col>
							
							<!-- v-col 4.2 -->
							<v-col>
								<v-card
									height="305"
									width="464"
									color="red lighten-4"
									elevation="0"
								>
									<p class="armwrestler main-color">
										Status<br>Add Book
									</p>
								</v-card>
							</v-col>
						</v-row>
					</v-col>
				</v-row>

				<!-- v-row 2 -->
				<v-row>

					<!-- v-col 2.1 -->
					<v-col>
						<v-card
							height="380"
							width="270"
							color="red lighten-4"
							elevation="0"
						>

							<p class="main-color" style="font-size:130%; margin-bottom:2px; padding-top:12px;">
								<strong class="armwrestler dark x-small">Language: </strong>
							</p>
							<p
								class="armwrestler main-color"
								style="font-size:150%; margin-bottom:4px;">
								{{info.language}}
							</p>

							<p class="main-color" style="font-size:130%; margin-bottom:2px; padding-top:6px;">
								<strong class="armwrestler dark x-small">Genres: </strong>
							</p>
							<p
								class="armwrestler main-color"
								style="font-size:150%; margin-bottom:4px;"
								v-for="g in info.genres"
								:key=g
							>
								{{g}}
							</p>
						</v-card>
					</v-col>

					<!-- v-col 2.2 -->
					<v-col>
						<v-card
							height="380"
							width="850"
							color="red lighten-4"
							elevation="0"
						>
							<v-textarea
								background-color="red lighten-4"
								disabled
								rounded
								no-resize
								rows="12"
								readonly
								:value=info.description
							></v-textarea>							
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-card>
	</div>
</template>

<script>
import axios from "axios";

export default {
	
	name: 'ConsultBook',

	props: ["idb"],

	data() {
		return {
			info: null,
		};
	},

	created: function() {
		
		// get books' name and image
		axios
			.get('/read2be/api/books/' + this.idb, this.$getOptions())
			.then(res => {
				this.info = res.data;
			})
			.catch(e => console.log('Erro no GET do book: ' + e));


	},

}
</script>

<style scoped>
	.v-input {
		font-size: 20px;
		line-height: 30px;
	}
</style>