<template>
    <div class="w3-container">
        <h1 class="armwrestler x-large dark my-4">Users</h1>
        <table class="w3-table-all">
            <tr>
                <th>ID</th><th>User</th><th>Name</th><th>Email</th>
            </tr>
            <tr
                @click="goUser(u.username)"
                v-for="u in users"
                :key="u.user_id"
                class="w3-hover-pale-red"
            >
                <td>{{u.user_id}}</td>
                <td>{{u.username}}</td>
                <td>{{u.nickname}}</td>
                <td>{{u.email}}</td>
            </tr>
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

export default {
    name: 'Users',
    
    data: function() {
        return {
            users: null,
            num_pages: null,
            page: 1
        };
    },

    created: function() {

        // get users
        axios
            .get('/read2be/api/users?page_num=' + this.page + '&page_limit=12', this.$cookies.get('options'))
            .then(res => {
                this.num_pages = res.data.num_pages;
                this.users = res.data.users;
            })
            .catch(e => {
                console.log('Erro no GET dos users: ' + e);
            })
    },

    methods: {
        goUser: function(username){
            this.$goTo('/users/' + username).catch(e => console.log('Erro no router.push do user: ' + e));
        },
        changePage: function() {
        // get books' name and image
        axios
            .get('/read2be/api/users?page_num=' + this.page + '&page_limit=12', this.$cookies.get('options'))
            .then(res => {
                this.num_pages = res.data.num_pages;
                this.users = res.data.users;
            })
            .catch(e => console.log('Erro no GET dos users: ' + e));
        },
    }
}
</script>