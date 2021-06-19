<template>
    <div>
        <h1 class="main-color large my-4"><strong>{{idg}} Books</strong></h1>
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
                           @input="changePage"
                        ></v-pagination>
                     </div>
                  </v-col>
               </v-row>
            </v-container>
         </v-card>
    </div>
</template>

<script>
import axios from "axios";
import Book from "@/components/Book.vue";

export default {
    
    name: 'ConsultGenre',

    props: ["idg"],

    components: {
        Book,
    },

    data() {
        return {
            books: [],
            num_pages: null,
            page: 1,
        };
    },

    methods: {

        changePage: function() {
            const params = new URLSearchParams();

            params.append('page_num', this.page);
            params.append('page_limit', 12);
            
            axios
                .get('/read2be/api/books?genre=' + this.idg + '&page_num=' + this.page +  '&page_limit=12', this.$cookies.get('options'))
                .then(res => {
                    this.num_pages = res.data.num_pages;
                    this.books = res.data.books;
                })
                .catch(e => console.log('Erro no GET dos books da search: ' + e));

      },
   },

    created: function() {

        // get genre's books' name and image
        axios
            .get('/read2be/api/books?genre=' + this.idg + '&page_num=' + this.page +  '&page_limit=12', this.$cookies.get('options'))
            .then(res => {
                this.num_pages = res.data.num_pages;
                this.books = res.data.books;
            })
            .catch(e => console.log('Erro no GET dos books do genre: ' + e));
    },

}
</script>