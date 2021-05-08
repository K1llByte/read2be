<template>
   <v-container>
        <v-app-bar
            color="teal lighten-1"
            app
            dark
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title>Search</v-toolbar-title>

            <v-spacer></v-spacer>

            <h3>{{currentDateFormatted()}}</h3>
            
            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            absolute
            app
            left
            temporary
        >
            <v-list
                nav
                dense
            >
                <v-list-item-group
                v-model="group"
                active-class="teal--text text--accent-4"
                >
                    <v-list-item>
                        <v-list-item-title>Foo</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-title>Bar</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-title>Fizz</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-title>Buzz</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
   </v-container>
</template>

<script>
export default {
    name: 'menu-bar',

    data: () => ({
        drawer: false,
        group: null,
    }),

    methods: {
        currentDateFormatted: function(){
            var date = new Date();
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
            
            return monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear();
            }
    }

};
</script>

