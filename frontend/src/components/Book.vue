<template>
    <div>
        <v-container>
            <v-hover>
                <template v-slot:default="{ hover }">
                    <v-card
                        height="220"
                        width="150"
                    >
                        <v-img
                            height="220"
                            width="150"
                            :src=b.cover_url
                        ></v-img>

                        <v-fade-transition>
                            <v-overlay
                                v-if="hover"
                                absolute
                                color="#036358"
                            >
                                <v-btn @click="goBook(b.isbn)">More info</v-btn>
                            </v-overlay>
                        </v-fade-transition>
                    </v-card>
                </template>
            </v-hover>
        </v-container>
        <v-container>
            <v-flex align-self-end>
                {{b.title}}
            </v-flex>
        </v-container>
    </div>
</template>

<script>

export default {
    
    name: 'Book',

    props: ["b"],

    data() {
        return {

        };
    },

    methods: {
        goBook: function(isbn){
            this.$router.push('/books/' + isbn);
        }
    }
}
</script>