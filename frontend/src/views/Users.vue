<template>
    <div class="w3-container">
        <h1>Read2be</h1>
        <h3>Utilizadores do read2be</h3>
        <table class="w3-table-all">
            <tr>
                <th>ID</th><th>User</th><th>Name</th><th>Email</th>
            </tr>
            <tr @click="goUser(u.username)" v-for="u in users" :key="u.user_id">
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
        
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjA0M2Y4NGI2ZTY2NTJmMzk1ZjZkYzc5IiwidXNlcm5hbWUiOiJhODUyNzIiLCJyb2xlIjoxLCJleHAiOjE2MjEyNTg1NzMsImlhdCI6MTYyMDY1Mzc3M30.HtqDxRG-GAh6OeZ3MyFoXf6OYLFTSI8IYCUsLcdI0qk';

        const options = {
            crossdomain: true,
            headers: { Authorization: `Bearer ${token}` }
        };

        // get users
        axios
            .get('/read2be/api/users/', options)
            .then(res => {
                this.users = res.data.users;
            })
            .catch(e => console.log('Erro no GET dos users: ' + e))
    },

    methods: {
        goUser: function(username){
            this.$router.push('/users/' + username);
        }
    }
}
</script>