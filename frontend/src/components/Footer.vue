<template>
   <v-footer
      dark
      padless
      class="mt-16"
   >
      <v-card
         class="flex"
         color="rgba(23, 0, 158, 0.25)"
      >
         <v-card-title class="py-2 white--text text-center">
            <div class="mr-16">
               {{ }}
            </div>
            <v-spacer></v-spacer>
            
            <div class="ml-16">
               {{ new Date().getFullYear() }} — <strong>Read2Be</strong>
            </div>

            <v-spacer></v-spacer>

            <div class="d-flex align-baseline justify-end ml-n16">
               <v-btn
                  v-for="i in icons"
                  :key="i.icon"
                  class="mx-3"
                  dark
                  icon
                  :href="i.url"
               >
                  <v-icon size="22px">{{ i.icon }}</v-icon>
               </v-btn>
            </div>
         </v-card-title>
      </v-card>
   </v-footer>
</template>

<script>

export default {
   name: 'Footer',

   data: () => ({

      icons: [

         {
            'icon':'mdi-facebook',
            'url':'https://www.facebook.com/read2be.project'
         },
         {
            'icon':'mdi-twitter',
            'url':'https://www.twitter.com/read2be_project'
         },
         {
            'icon':'mdi-instagram',
            'url':'https://www.instagram.com/read2be_project'
         },
      ],
   }),
};
</script>