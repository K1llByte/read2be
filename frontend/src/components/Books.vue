<template>
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
   
</template>


<script>
import axios from "axios";
import Book from "@/components/Book.vue";

export default {
      name: 'Books',

      components: {
         Book,
      },

      data: () => ({
         books: [],
         page: 1,
      }),

      methods: {
         changePage: function() {
            // get books' name and image
            axios
               .get('/read2be/api/books?page_num=' + this.page + '&page_limit=12', this.$getOptions())
               .then(res => {
                  this.books = res.data.books;
               })
               .catch(e => console.log('Erro no GET dos books da home: ' + e));
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
            .catch(e => console.log('Erro no GET dos books da home: ' + e));
      },
};

</script>

<style lang="sass" scoped>
.v-card.on-hover.theme--light
   background-color: rgba(#FFF, 0.8)
   >.v-card__text
      color: #fff
</style>