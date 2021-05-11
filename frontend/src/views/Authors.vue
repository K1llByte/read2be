<template>
    <div class="w3-container">
        <h1>Read2be</h1>
        <h2>{{(new Date()).toISOString().substring(0,10)}}</h2>
        <h3>Autores do read2be</h3>
        <table class="w3-table-all">
            <thead>
                <tr>
                    <th>Author</th>
                </tr>
            </thead>
            <tbody>
                <tr @click="goAuthor(a.name)" v-for="a in authors" v-bind:key="a.name">
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
        
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjA0M2Y4NGI2ZTY2NTJmMzk1ZjZkYzc5IiwidXNlcm5hbWUiOiJhODUyNzIiLCJyb2xlIjoxLCJleHAiOjE2MjEyNTg1NzMsImlhdCI6MTYyMDY1Mzc3M30.HtqDxRG-GAh6OeZ3MyFoXf6OYLFTSI8IYCUsLcdI0qk';

        const options = {
            crossdomain: true,
            headers: { Authorization: `Bearer ${token}` }
        };

        // get authors
        axios
            .get('/read2be/api/authors/', options)
            .then(res => {
                this.authors = res.data.authors;
            })
            .catch(e => console.log('Erro no GET dos authors: ' + e))
    },

    methods: {
        goAuthor: function(name){
            this.$router.push('/authors/' + name);
        }
    }
}
</script>