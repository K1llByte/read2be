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
                                 width="390"
                                 color="red lighten-4"
                                 elevation="0"
                                 class="py-4 pr-5 pl-6"
                              >
                                 <v-select
                                    v-if="added"
                                    outlined
                                    :items="values_s"
                                    item-text="label"
                                    item-value="value"
                                    v-model="status"
                                    item-color= "red"
                                    color='#e09393'
                                    :menu-props="{
                                       bottom: true,
                                       offsetY: true,
                                       'max-width': 305,
                                       'nudge-right': 4,
                                    }"
                                    append-outer-icon="mdi-trash-can-outline"
                                    @click:append-outer="removeBook"
                                    @input="editBook"
                                 ></v-select>
                                 <v-btn
                                    v-else
                                    dark
                                    color="#f07977"
                                    class="mt-1"
                                    width=280
                                    height=45
                                    large
                                    @click="addBook"
                                 >
                                    Add Book
                                    <v-icon right>
                                       mdi-bookmark-outline
                                    </v-icon>
                                 </v-btn>
                              </v-card>
                           </v-col>
                        </v-row>
                        
                        <!-- v-row 6 -->
                        <v-row>
                           
                           <!-- v-col 6.1 - isbn / year -->
                           <v-col>
                              <v-card
                                 height="145"
                                 width="390"
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
                     
                     <!-- v-col 4.2 -->
                     <v-col>
                        
                        <!-- rating -->
                        <v-row>
                           <v-col>
                              <v-card
                                 height="90"
                                 width="430"
                                 color="red lighten-4"
                                 elevation="0"
                                 class="py-6"
                              >
                                 <v-rating
                                    v-model="rating"
                                    background-color="grey"
                                    color="red darken-3"
                                    empty-icon="mdi-heart-outline"
                                    full-icon="mdi-heart"
                                    hover
                                    length="10"
                                    size="25"
                                    value="0"
                                    @input="editBook"
                                    :readonly="added ? false : true"
                                 ></v-rating>
                              </v-card>
                           </v-col>
                        </v-row>
                        
                        <!-- authors -->
                        <v-row>
                           <v-col>
                              <v-card
                                 :height="info.title.length < 50 ? 145 : 130"
                                 width="430"
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
                        class="desc"
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

      <!-- Snackbar for alerts -->
      <v-snackbar
         v-model="snackbar"
         timeout="2500"
         color="#221D45"
         right
         class="mb-16 mr-5"
      >
         <strong>{{ text }}</strong>

         <template v-slot:action="{ attrs }">
         <v-btn
            color="#f7a8a8"
            text
            v-bind="attrs"
            @click="snackbar = false"
         >
            Close
         </v-btn>
         </template>
      </v-snackbar>
   </div>
</template>

<script>
import axios from "axios";
import Book from "@/components/Book.vue";

export default {
   
   name: 'ConsultBook',

   props: ["idb"],

   components: { Book },

   data() {
      return {
         info: null,
         books: [],
         user_books: [],
         added: false,
         // values_s: ['Plan To Read', 'Reading', 'Finished', 'Dropped'],
         values_s: [
            {
               label: 'Plan To Read',
               value: 3
            }, 
            {
               label: 'Reading',
               value: 1
            }, 
            {
               label: 'Finished',
               value: 2
            }, 
            {
               label: 'Dropped',
               value: 4
            }],
         status: 3,
         rating: 0,
         snackbar: false,
         text: '',
      };
   },

   methods: {
      goAuthor: function(name){
         this.$goTo('/authors/' + name);
      },
      goGenre: function(genre){
         this.$goTo('/genres/' + genre);
      },
      addBook: function(){
         var form = {
            isbn: this.idb,
            status: this.status,
            rate: this.rating
         };

         // add book to user's books
         axios
            .post('/read2be/api/users/' + this.$cookies.get('user') + '/books', form, this.$cookies.get('options'))
            .then(res => {
               console.log(res);
               this.added = true;
               this.text = "Book added with success!";
               this.snackbar = true;
            })
            .catch(e => console.log('Erro no POST do book: ' + e));

      },
      editBook: function(){
         var form = {
            status: this.status,
            rate: this.rating
         };

         // edit book status from user's books
         axios
            .patch('/read2be/api/users/' + this.$cookies.get('user') + '/books/' + this.idb, form, this.$cookies.get('options'))
            .then(res => {
               res.data = null;
               this.text = "Book edited with success!";
               this.snackbar = true;
            })
            .catch(e => console.log('Erro no PATCH do book: ' + e));

      },
      removeBook: function(){
         
         // remove book from user's books
         axios
            .delete('/read2be/api/users/' + this.$cookies.get('user') + '/books/' + this.idb, this.$cookies.get('options'))
            .then(res => {
               res.data = null;
               this.added = false;
               this.text = "Book removed with success!";
               this.snackbar = true;
            })
            .catch(e => console.log('Erro no DELETE do book: ' + e));

      },
   },

   created: function() {
      
      // get books' name and image
      axios
         .get('/read2be/api/books/' + this.idb, this.$cookies.get('options'))
         .then(res => {
            this.info = res.data;
         })
         .catch(e => console.log('Erro no GET do book: ' + e));

      // get books' recommendations
      axios
         .get('/read2be/api/books/' + this.idb + '/recommendations', this.$cookies.get('options'))
         .then(res => {
            this.books = res.data.recommendations;
         })
         .catch(e => console.log('Erro no GET das recommendations: ' + e));

      // get user's books
      axios
         .get('/read2be/api/users/' + this.$cookies.get('user'), this.$cookies.get('options'))
         .then(res => {
            this.user_books = res.data.books;
            this.added = this.user_books.some(b => b.isbn === this.idb);
            if (this.added){
               var aux = this.user_books.filter(b => b.isbn === this.idb)[0];
               this.rating = aux.rate;
               this.status = aux.status;
            }
         })
         .catch(e => console.log('Erro no GET dos books do user: ' + e));

   },

}
</script>

<style scoped>
   .v-input.desc {
      font-size: 20px;
      line-height: 30px;
   }
   #clickable:hover {
      color: #fbe9e9;
      cursor: pointer;
   }
   .theme--light.v-application{
   background-color: #f09c9c;
   }

   .theme--light.v-list{
   background: #ffcaca;
   }
   .theme--light.v-list-item:hover:before {
      opacity: 0
   }
</style>