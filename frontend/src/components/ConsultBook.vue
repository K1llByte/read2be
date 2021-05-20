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

        // get author's books' name and image
        axios
            .get('/read2be/api/books/' + this.idb, this.$getOptions())
            .then(res => {
                this.info = res.data;
            })
            .catch(e => console.log('Erro no GET do book: ' + e));


    },

}
</script>