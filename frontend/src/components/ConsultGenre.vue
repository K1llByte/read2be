<template>
    <div>
        <h1 class="main-color large my-4"><strong>{{ida}} Books</strong></h1>
        <v-card class="mx-auto mt-6" color="rgb(255, 0, 0, 0.2)"  width="1300px">
            <v-container>
                <v-row>
                    <v-col
                        v-for="b in books"
                        :key="b.name"
                        cols="2"
                    >
                        <Book :b="b" />
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
// import axios from "axios";
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
        };
    },

    created: function() {

        // get author's books' name and image
        // axios
        //     .get('/read2be/api/authors/' + this.ida + '?inline_books=1', this.$getOptions())
        //     .then(res => {
        //         this.books = res.data.books;
        //     })
        //     .catch(e => console.log('Erro no GET dos books do author: ' + e));
    },

}
</script>