<template>
    <div>
        <h3>Author: {{ida}}</h3>
            <h4>{{books.length}} books</h4>
        <pre>{{books}}</pre>
        <v-container>
            <v-row
                v-for="n1 in (Math.ceil(books.length/3))"
                :key="n1"
            >
                <v-col
                    v-for="n2 in 3"
                    :key="n2"
                >
                    
                    <v-card color="rgb(255, 0, 0, 0.2)">
                        {{books[counter++]}}
                    </v-card>
                </v-col>
            </v-row>
            <v-row
            >
                <v-col
                    v-for="n in (3 % books.length)"
                    :key="n"
                >
                    
                    <v-card color="rgb(255, 0, 0, 0.2)">
                        {{books[counter++]}}
                    </v-card>
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
            books: null,
            counter: 0,
        };
    },

    created: function() {
        
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjA0M2Y4NGI2ZTY2NTJmMzk1ZjZkYzc5IiwidXNlcm5hbWUiOiJhODUyNzIiLCJyb2xlIjoxLCJleHAiOjE2MjA1NzQ5NjUsImlhdCI6MTYxOTk3MDE2NX0.RwH1CnWvXXCj03XYRrDSK8tPVVC2hZhG7nBU47fArXg';

        const options = {
            crossdomain: true,
            headers: { Authorization: `Bearer ${token}` }
        };

        console.log(this.ida);
        // get books
        axios
            .get('/read2be/api/authors/' + this.ida, options)
            .then(res => {
                this.books = res.data.books;
            })
            .catch(e => console.log('Erro no GET dos books: ' + e))
    },

}
</script>