<template>
    <div class="w3-container">
        <h1 class="armwrestler x-large dark my-5">Authors</h1>

        <!-- Search author -->
        <SearchAuthor />
        
        <table class="w3-table-all mt-8">
            <thead>
                <tr>
                    <th>Author</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    @click="goAuthor(a.name)"
                    v-for="a in authors"
                    v-bind:key="a.name"
                    class="w3-hover-pale-red"
                >
                    <td>{{a.name}}</td>
                </tr>
            </tbody>
        </table>
        <div class="text-center mt-5">
            <v-pagination
                color="teal lighten-1"
                v-model="page"
                :length="num_pages"
                :total-visible="7"
                @input="changePage"
            ></v-pagination>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import SearchAuthor from "@/components/SearchAuthor.vue";

export default {
    name: 'Authors',
    
    data: function() {
        return {
            authors: null,
            num_pages: null,
            page: 1
        };
    },

    components: {
        SearchAuthor,
    },
    
    created: function() {

        // get authors
        axios
            .get('/read2be/api/authors?page_num=' + this.page + '&page_limit=12', this.$getOptions())
            .then(res => {
                this.num_pages = res.data.authors.num_pages;
                this.authors = res.data.authors.authors;
            })
            .catch(e => console.log('Erro no GET dos authors: ' + e))
    },

    methods: {
        goAuthor: function(name){
            this.$goTo('/authors/' + name);
        },

        changePage: function() {
        // get books' name and image
        axios
            .get('/read2be/api/authors?page_num=' + this.page + '&page_limit=12', this.$getOptions())
            .then(res => {
                this.num_pages = res.data.authors.num_pages;
                this.authors = res.data.authors.authors;
            })
            .catch(e => console.log('Erro no GET dos authors: ' + e));
        },
    }
}
</script>