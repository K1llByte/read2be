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
            <div class="d-flex justify-space-around pt-6">
               <v-btn-toggle v-model="toggle" borderless style="background-color: transparent;">
                  <v-btn
                     v-for="t in teste"
                     :key=t.title
                     :value=t.value
                     color="red lighten-5"
                     class="ml-16 mr-8"
                  >
                     {{t.title}}
                  </v-btn>
               </v-btn-toggle>
               <v-btn :disabled="!toggle && !search" large elevation="1" class=" ml-n16 mr-10" @click="sendSearch">Search</v-btn>
            </div>
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
                           :length="num_pages"
                           :total-visible="7"
                           @input="sendSearch"
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
      num_pages: null,
      page: 1,
      updated: false,
      teste: [
         {
            title: 'Title (A-Z)',
            value: {
               param: 'title',
               order: 'A'
            },
         },
         {
            title: 'Title (Z-A)',
            value: {
               param: 'title',
               order: 'D'
            },
         },
         {
            title: 'Most Recent',
            value: {
               param: 'published_year',
               order: 'A'
            },
         },
         {
            title: 'Less Recent',
            value: {
               param: 'published_year',
               order: 'D'
            },
         },
      ],
      toggle: null,
   }),

   methods: {

      sendSearch: function() {
         const params = new URLSearchParams();
         
         // get books' by search
         if (this.search) {
            params.append('q', this.search);
         }
         if (this.toggle) {
            params.append('sort_by', this.toggle.param);
            params.append('order', this.toggle.order);
         }

         params.append('page_num', this.page);
         params.append('page_limit', 12);
         
         axios
            .get('/read2be/api/books', this.$getOptionsParams(params))
            .then(res => {
               this.num_pages = res.data.num_pages;
               this.books = res.data.books;
            })
            .catch(e => console.log('Erro no GET dos books da search: ' + e));

      },
   },

   created: function() {

      // get books' name and image
      // existe maneira de usar aqui o changePage para não repetir?
      axios
         .get('/read2be/api/books?page_num=' + this.page + '&page_limit=12', this.$getOptions())
         .then(res => {
            this.num_pages = res.data.num_pages;
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