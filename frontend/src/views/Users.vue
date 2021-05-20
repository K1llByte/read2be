<template>
    <div class="w3-container">
        <h1>Read2be</h1>
        <h3>Utilizadores do read2be</h3>
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
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Users',
    
    data: function() {
        return {
            users: null,
        };
    },

    created: function() {

        // get users
        axios
            .get('/read2be/api/users/', this.$getOptions())
            .then(res => {
                this.users = res.data.users;
            })
            .catch(e => {
                console.log('Erro no GET dos users: ' + e);
            })
    },

    methods: {
        goUser: function(username){
            this.$goTo('/users/' + username).catch(e => console.log('Erro no router.push do user: ' + e));
        }
    }
}
</script>