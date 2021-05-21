<template>
    <div class="w3-container">
        <h1 class="armwrestler x-large dark my-5">Authors</h1>
        <table class="w3-table-all">
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
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Authors',
    
    data: function() {
        return {
            authors: null,
        };
    },

    created: function() {

        // get authors
        axios
            .get('/read2be/api/authors/', this.$getOptions())
            .then(res => {
                this.authors = res.data.authors;
            })
            .catch(e => console.log('Erro no GET dos authors: ' + e))
    },

    methods: {
        goAuthor: function(name){
            this.$goTo('/authors/' + name);
        }
    }
}
</script>