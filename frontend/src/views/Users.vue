<template>
    <div class="w3-container">
        <h1>Read2be</h1>
        <h2>{{(new Date()).toISOString().substring(0,10)}}</h2>
        <h3>Utilizadores do read2be</h3>
        <table class="w3-table-all">
            <tr>
                <th>ID</th><th>User</th><th>Name</th><th>Email</th>
            </tr>
            <tr v-for="u in users" :key="u.id">
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
        
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjA0M2Y4NGI2ZTY2NTJmMzk1ZjZkYzc5IiwidXNlcm5hbWUiOiJhODUyNzIiLCJyb2xlIjoxLCJleHAiOjE2MjA1NzQ5NjUsImlhdCI6MTYxOTk3MDE2NX0.RwH1CnWvXXCj03XYRrDSK8tPVVC2hZhG7nBU47fArXg';

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
    }
}
</script>