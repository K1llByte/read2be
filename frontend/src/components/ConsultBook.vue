<template>
   <div>
      <!-- Book info -->
      <v-card class="mx-auto pt-8 pb-8 pb-3 mt-16" color="rgb(255, 0, 0, 0.2)"  width="1300px">
         <v-container>

            <!-- v-row 1 -->
            <v-row>
               
               <!-- v-col 1.1 - cover -->
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
                     
                     <!-- v-col 3.1 - title -->
                     <v-col>
                        <v-card
                           :height="info.title.length < 50 ? 50 : 100"
                           :class="info.title.length < 50 ? 'mb-5' : ''"
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

                        <!-- v-row 5 -->
                        <v-row>
                           
                           <!-- v-col 5.1 - add book / status -->
                           <v-col>
                              <v-card
                                 height="90"
                                 width="360"
                                 color="red lighten-4"
                                 elevation="0"
                                 class="py-7"
                              >
                                 <BookStatus :idb="idb" />
                              </v-card>
                           </v-col>
                        </v-row>
                        
                        <!-- v-row 6 -->
                        <v-row>
                           
                           <!-- v-col 6.1 - isbn / year -->
                           <v-col>
                              <v-card
                                 height="145"
                                 width="360"
                                 color="red lighten-4"
                                 elevation="0"
                              >
                                 <p class="main-color pt-3" style="font-size:130%; margin-bottom:2px;">
                                    <strong class="armwrestler dark x-small">ISBN: </strong>
                                    {{info.isbn}}
                                 </p>
                                 <p class="main-color" style="font-size:130%; margin-bottom:2px;">
                                    <strong class="armwrestler dark x-small">Language: </strong> {{info.language}}
                                 </p>
                                 <p class="main-color" style="font-size:130%; margin-bottom:2px;">
                                    <strong class="armwrestler dark x-small">Year: </strong>
                                    {{info.published_year}}
                                 </p>
                              </v-card>
                           </v-col>
                        </v-row>
                     </v-col>
                     
                     <!-- v-col 4.2 - authors -->
                     <v-col>
                        <v-card
                           :height="info.title.length < 50 ? 265 : 259"
                           width="450"
                           color="red lighten-4"
                           elevation="0"
                        >
                           <p class="main-color pt-5" style="font-size:130%; margin-bottom:2px;">
                              <strong class="armwrestler dark x-small">Authors: </strong>
                           </p>
                           <p
                              id="clickable"
                              class="armwrestler main-color"
                              style="font-size:150%; margin-bottom:4px;"
                              v-for="a in info.authors"
                              :key=a
                              @click="goAuthor(a)"
                           >
                              {{a}}
                           </p>
                        </v-card>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>

            <!-- v-row 2 -->
            <v-row>

               <!-- v-col 2.1 - language / genres -->
               <v-col>
                  <v-card
                     height="380"
                     width="270"
                     color="red lighten-4"
                     elevation="0"
                  >


                     <p class="main-color" style="font-size:130%; margin-bottom:2px; padding-top:6px;">
                        <strong class="armwrestler dark x-small">Genres: </strong>
                     </p>
                     <p
                        id="clickable"
                        class="armwrestler main-color"
                        style="font-size:150%; margin-bottom:4px;"
                        v-for="g in info.genres"
                        :key=g
                        @click="goGenre(g)"
                     >
                        {{g}}
                     </p>
                  </v-card>
               </v-col>

               <!-- v-col 2.2 - description -->
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
      
      <!-- Book recommendations -->
      <h1 class="armwrestler large dark my-4">More books</h1>
      <v-card class="mx-auto pt-8 pb-4 mt-6" color="rgb(255, 0, 0, 0.2)"  width="1300px">
         <v-container>
            <v-row>
               <v-col
                  v-for="b in books"
                  :key="b.name"
                  cols="2"
                  class="ml-8"
               >
                  <Book :b="b"/>
               </v-col>
            </v-row>
         </v-container>
      </v-card>
   </div>
</template>

<script>
import axios from "axios";
import Book from "@/components/Book.vue";
import BookStatus from "@/components/BookStatus.vue";

export default {
   
   name: 'ConsultBook',

   props: ["idb"],

   components: { Book, BookStatus },

   data() {
      return {
         info: null,
         books: [],
      };
   },

   methods: {
      goAuthor: function(name){
         this.$goTo('/authors/' + name);
      },
      goGenre: function(genre){
         this.$goTo('/genres/' + genre);
      }
   },

   created: function() {
      
      // get books' name and image
      axios
         .get('/read2be/api/books/' + this.idb, this.$getOptions())
         .then(res => {
            this.info = res.data;
         })
         .catch(e => console.log('Erro no GET do book: ' + e));

      // get books' recommendations
      axios
         .get('/read2be/api/books/' + this.idb + '/recommendations', this.$getOptions())
         .then(res => {
            this.books = res.data.recommendations;
         })
         .catch(e => console.log('Erro no GET das recommendations: ' + e));


   },

}
</script>

<style scoped>
   .v-input {
      font-size: 20px;
      line-height: 30px;
   }
   #clickable:hover {
      color: #fbe9e9;
   }
</style>