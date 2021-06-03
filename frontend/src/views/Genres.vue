<template>
    <div class="w3-container">
        <h1 class="armwrestler x-large dark my-5">Genres</h1>

        <!-- Search genre -->
        <SearchGenre />
        
        <table class="w3-table-all mt-8">
            <thead>
                <tr>
                    <th>Genre</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    @click="goGenre(g.name)"
                    v-for="g in genres"
                    v-bind:key="g.name"
                    class="w3-hover-pale-red"
                >
                    <td>{{g.name}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
// import axios from 'axios'
import SearchGenre from "@/components/SearchGenre.vue";

export default {
    name: 'Genres',
    
    data: function() {
        return {
            genres: null,
        };
    },

    components: {
        SearchGenre,
    },
    
    created: function() {

        // get genres
        // axios
        //     .get('/read2be/api/authors/', this.$getOptions())
        //     .then(res => {
        //         this.authors = res.data.authors.authors;
        //     })
        //     .catch(e => console.log('Erro no GET dos authors: ' + e))
    },

    methods: {
        goGenre: function(genre){
            this.$goTo('/books?genre=' + genre);
        }
    }
}
</script>