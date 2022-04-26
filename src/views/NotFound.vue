<template>
  <div class="NotFound" style="height: 100vh">
    <v-container fill-height fluid>
      <v-row align="center"
             justify="center">
        <v-col>
          <v-flex xs12>
            <v-card height="400" color="transparent" flat>
              <div class="display-3 mt-5 text-center">Page not found.</div>
              <div class="grey--text lighten-5">
                <br>
                The page you are trying to get to never existed in this reality,
                or has migrated to a parallel universe.
              </div>
              <div class="paragraph-text mt-2">
                <br />Try going back to home page and repeating your action. Or,
                contact helpdesk for support.
              </div>
            </v-card>
          </v-flex>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
.paragraph-text {
  font-size: 18px;
}
</style>