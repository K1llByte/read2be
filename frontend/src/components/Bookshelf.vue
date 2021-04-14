<template>
   <v-card color="rgb(255, 0, 0, 0.2)" height="900px" width="1300px" class="mx-auto mt-5">
      <v-container>
         <v-row
            v-for="j in 3"
            :key="j"
         >
            <v-col
               v-for="k in 5"
               :key="k"
            >
               <v-hover>
                  <template v-slot:default="{ hover }">
                     <v-card
                     class="mx-auto mt-11"
                     height="220"
                     width="170"
                     >
                     <v-img src="https://cdn.vuetifyjs.com/images/cards/forest-art.jpg"></v-img>

                     <v-card-text>
                        <h2 class="title primary--text">
                           Magento Forests
                        </h2>
                     </v-card-text>

                     <v-fade-transition>
                        <v-overlay
                           v-if="hover"
                           absolute
                           color="#036358"
                        >
                           <v-btn>More info</v-btn>
                        </v-overlay>
                     </v-fade-transition>
                     </v-card>
                  </template>
               </v-hover>
            </v-col>
         </v-row>
      </v-container>
   </v-card>
</template>


<script>
export default {
     name: 'bookshelf',

     data: () => ({})
};

</script>

<style lang="sass" scoped>
.v-card.on-hover.theme--light
   background-color: rgba(#FFF, 0.8)
   >.v-card__text
      color: #fff
</style>