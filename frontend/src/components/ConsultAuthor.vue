<template>
    <div>
        <h3>Author: {{ida}}</h3>
            <h4>{{books.length}} books</h4>
        <pre>{{books}}</pre>
        <v-container>
            <v-row
            >
                <v-col
                    v-for="b in books"
                    :key="b"
                    cols="3"
                >
                    <!-- <v-card color="rgb(255, 0, 0, 0.2)"> -->
                        <!-- {{b.name}} -->
                    <!-- </v-card> -->
                    <v-hover>
                        <template v-slot:default="{ hover }">
                            <v-card
                                class="mx-auto mb-14 mt-11"
                                height="220"
                                width="170"
                            >
                                <v-img src=b.cover_url></v-img>

                                <v-card-text>
                                    <h2 class="title primary--text">
                                        {{b.name}}
                                    </h2>
                                </v-card-text>

                                <v-fade-transition>
                                    <v-overlay
                                        v-if="hover"
                                        absolute
                                        color="#036358"
                                    >
                                        <v-btn>More info</v-btn>
                                    </v-overlay>
                                </v-fade-transition>
                            </v-card>
                        </template>
                    </v-hover>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from "axios";

export default {
    
    name: 'ConsultAuthor',

    props: ["ida", "mensagem"],

    data() {
        return {
            books: [],
        };
    },

    created: function() {
        
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjA0M2Y4NGI2ZTY2NTJmMzk1ZjZkYzc5IiwidXNlcm5hbWUiOiJhODUyNzIiLCJyb2xlIjoxLCJleHAiOjE2MjA1NzQ5NjUsImlhdCI6MTYxOTk3MDE2NX0.RwH1CnWvXXCj03XYRrDSK8tPVVC2hZhG7nBU47fArXg';

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