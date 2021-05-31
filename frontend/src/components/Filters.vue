<template>

   <v-card
      class="mx-auto mt-2"
      color="rgba(255,0,0,0.1)"
      height="95"
      width="1300"
   >
      <v-container fluid>
         <v-row class="mx-3">
            <v-col>
               <template>
                  <v-container fluid>
                     <v-select
                        v-model="value"
                        :items="items"
                        label="Genre"
                        multiple
                        solo
                     >
                        <template v-slot:selection="{ item, index }">
                           <v-chip v-if="index === 0">
                              <span>{{ item }}</span>
                           </v-chip>
                           <v-chip v-if="index === 1">
                              <span>+{{ value.length - 1 }}</span>
                           </v-chip>
                        </template>
                     </v-select>
                  </v-container>
               </template>
            </v-col>
            <v-col>
               <template>
                  <v-container fluid>
                     <v-select
                        v-model="value2"
                        :items="items2"
                        label="Unread"
                        solo
                     >
                        <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                           <span>{{ item }}</span>
                        </v-chip>
                        <span
                           v-if="index === 1"
                           class="grey--text caption"
                        >
                           (+{{ value.length - 1 }} others)
                        </span>
                        </template>
                     </v-select>
                  </v-container>
               </template>
            </v-col>
            <v-col>
               <template>
                  <v-container fluid>
                     <v-select
                        v-model="value3"
                        :items="items3"
                        label="Year"
                        solo
                     >
                        <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                           <span>{{ item }}</span>
                        </v-chip>
                        </template>
                     </v-select>
                  </v-container>
               </template>
            </v-col>
            <v-col>
               <template>
                  <v-container fluid>
                     <v-select
                        v-model="value4"
                        :items="items4"
                        label="Sort By"
                        solo
                     >
                        <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                           <span>{{ item }}</span>
                        </v-chip>
                        </template>
                     </v-select>
                  </v-container>
               </template>
            </v-col>
            <v-col>
               <v-btn
                  height="40"
                  width="120"
                  class="mt-4 ml-n16 grey lighten-4"
                  @click="submitSearch()"
               >
                  Search
               </v-btn>
            </v-col>
            <v-col>
               <v-btn
                  height="40"
                  width="120"
                  class="mt-4 mx-n16 grey lighten-4"
                  @click="resetSearch()"
               >
                  Reset
               </v-btn>
            </v-col>
         </v-row>
      </v-container>
   </v-card>
</template>

<script>
export default {
   name: 'Filters',

   data: () => ({
      items: ['Fantasy', 'Mystery', 'Romance', 'Biography', 'Non-Fiction', 'Sci-Fi'],
      value: [],
      items2: ['Unread', 'Read'],
      value2: '',
      items3: ['1980', '1990', '2000', '2010', '2020'],
      value3: '',
      items4: ['Relevance', 'Most Recent', 'Less Recent'],
      value4: '',
   }),

   methods: {
      resetData: function() {
         this.value = [];
         this.value2 = [];
         this.value3 = [];
         this.value4 = [];
      }
   }
};

</script>