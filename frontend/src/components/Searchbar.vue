<template>
   <v-card class="mx-auto mt-14" color="rgba(255,0,0,0.1)" width="1300" height="76">
      <v-row class="ml-10" justify="space-around">
         <!-- <v-menu
            bottom
            offset-y="true"
            transition="slide-y-transition"
         >
            <template v-slot:activator="{ on, attrs }">
               <v-btn
                  class="pink lighten-3"
                  dark
                  v-bind="attrs"
                  v-on="on"
               >
                  Slide Y Transition
               </v-btn>
            </template>
            <v-list>
               <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
               >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
               </v-list-item>
            </v-list>
         </v-menu> -->
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
               class="mx-auto ml-6 mt-4 grey lighten-4"
            >
               Reset
            </v-btn>
         </v-col>
      </v-row>
   </v-card>
</template>

<script>
export default {
   name: 'searchbar',

   // data: () => ({
   //    items: [
   //       { title: 'Click Me' },
   //       { title: 'Click Me' },
   //       { title: 'Click Me' },
   //       { title: 'Click Me 2' },
   //    ],
   // }),
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
};

</script>