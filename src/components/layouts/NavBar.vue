<template>
  <nav>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon>{{link.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{link.text}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="blue darken-2"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Solarfin</v-toolbar-title>
    </v-app-bar>
  </nav>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {},
  })

  export default class NavBar extends Vue {

    public drawer: boolean = false;
    public links: object = {
      dashboard: {
        icon: 'mdi-home',
        title: true,
        text: 'Home',
        route: '/',
      },
      about: {
        icon: 'mdi-home',
        text: 'About',
        route: '/about',
      },
      contacts: {
        icon: 'contact-phone',
        text: 'Contacts',
        route: '/contacts',
      },
    };
  }
</script>
<style scoped>
</style>
