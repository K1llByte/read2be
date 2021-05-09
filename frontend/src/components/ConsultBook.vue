<template>
   <div>
      <h2>Book: {{info.title}}</h2>
      <h3>Authors: {{info.authors}}</h3>
      <h4>ISBN: {{info.isbn}}</h4>
      <v-img
         height="380"
         width="250"
         :src=info.cover_url
      ></v-img>
   </div>
</template>

<script>
import axios from "axios";

export default {
    
    name: 'ConsultBook',

    props: ["idb"],

    components: {
    },

    data() {
        return {
            info: null,
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
            .get('/read2be/api/books/' + this.idb, options)
            .then(res => {
                this.info = res.data;
            })
            .catch(e => console.log('Erro no GET do book: ' + e));


    },

}
</script>