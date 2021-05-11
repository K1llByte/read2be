<template>
    <div>
        <h3>Author: {{ida}}</h3>
        <h4>{{books.length}} books</h4>
        <v-card class="mx-auto pt-5 pb-3 mt-5" color="rgb(255, 0, 0, 0.2)"  width="1300px">
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
import axios from "axios";
import Book from "@/components/Book.vue";

export default {
    
    name: 'ConsultAuthor',

    props: ["ida"],

    components: {
        Book,
    },

    data() {
        return {
            books: [],
        };
    },

    created: function() {
        
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjA0M2Y4NGI2ZTY2NTJmMzk1ZjZkYzc5IiwidXNlcm5hbWUiOiJhODUyNzIiLCJyb2xlIjoxLCJleHAiOjE2MjEyNTg1NzMsImlhdCI6MTYyMDY1Mzc3M30.HtqDxRG-GAh6OeZ3MyFoXf6OYLFTSI8IYCUsLcdI0qk';

        const options = {
            crossdomain: true,
            headers: { Authorization: `Bearer ${token}` }
        };

        // get author's books' name and image
        axios
            .get('/read2be/api/authors/' + this.ida + '?inline_books=1', options)
            .then(res => {
                this.books = res.data.books;
            })
            .catch(e => console.log('Erro no GET dos books do author: ' + e));


    },

}
</script>