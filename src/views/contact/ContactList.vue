<template>
  <v-data-table
    :headers="headers"
    :items="contacts"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Contacts</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>

        <div class="flex-grow-1"></div>

        <!-- START::Form Dialog -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="contactForm.first_name" label="First Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="contactForm.last_name" label="Last Name"></v-text-field>
                  </v-col>
                </v-row>

                <v-row v-for="(phone, index) in contactForm.phones" v-bind:key="index" class="row">
                  <v-col cols="10">
                    <v-text-field v-model="contactForm.phones[index]" label="Phone Number"></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-icon
                      small
                      class="mr-2"
                      @click="removeLine(index)"
                    >
                      mdi-delete
                    </v-icon>
                    <v-icon
                      small
                      class="mr-2"
                      v-if="(index + 1 === contactForm.phones.length)"
                      @click="addLine"
                    >
                      mdi-plus-thick
                    </v-icon>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog><!-- END::Form Dialog -->
      </v-toolbar>
    </template>

    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import ContactApiResource from '@/api/ContactApiResource';

  @Component({
    components: {},
  })

  export default class ContactList extends Vue {

    public dialog: boolean = false;
    public headers?: any = [
      {
        text: 'First Name',
        align: 'left',
        sortable: false,
        value: 'first_name',
      },
      {
        text: 'Last Name',
        align: 'left',
        sortable: false,
        value: 'last_name',
      },
      {text: 'Phone', value: 'phone'},
      {text: 'Created', value: 'created_at'},
      {text: 'Updated', value: 'updated_at'},
      {text: 'Actions', value: 'action', sortable: false},
    ];

    public contacts?: [{
      first_name: string
      last_name: string,
      phones: [string],
      created_at: string,
      updated_at: string,
    }];

    public editedIndex: number = -1;
    public contactForm: any;

    public defaultItem: any = {
      first_name: '',
      last_name: '',
      phones: [''],
    };

    public blockRemoval: boolean = false;

    constructor() {
      super();
      this.contacts = [{
        first_name: 'no data',
        last_name: 'no data',
        phones: ['no data'],
        created_at: 'no data',
        updated_at: 'no data',
      }];

      this.contactForm = {
        first_name: '',
        last_name: '',
        phones: [''],
      };
    }

    public created() {
      this.initialize();
    }

    /**
     * Adds another index to the phones array
     * used for adding phone input element to contact form
     *
     * @return void
     */
    public addLine(): boolean | void {
      const phoneNumbers = this.contactForm.phones.length;
      if (phoneNumbers >= 1) {
        this.contactForm.phones.splice(phoneNumbers, 0, '');
      }
    }

    /**
     * Populate the data table with contact data
     *
     * @return Promise<any>
     */
    public async initialize() {
      // get data for data tables
      const contactApiResource = new ContactApiResource();

      return await contactApiResource
        .setResourcePath('/contacts')
        .get()
        .then((response) => {
          const {data} = response.data;
          this.contacts = data;
        });
    }

    public removeLine(lineId: number) {
      const phoneNumbers = this.contactForm.phones.length;
      if (!this.blockRemoval && phoneNumbers > 1) {
        this.contactForm.phones.splice(lineId, 1);
      }
    }

    get formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    }

    /**
     * Opens the contact form dialog
     *
     * @param value
     * @return boolean
     */
    @Watch('dialog')
    public onDialog(value: boolean) {
      return value || this.close();
    }

    @Watch('phones')
    public onPhoneUpdate(value: boolean) {
      this.blockRemoval = (this.contactForm.phones.length <= 1);
    }

    public editItem(item: any) {
      if (this.contacts) {
        this.editedIndex = this.contacts.indexOf(item);
        this.contactForm = Object.assign({}, item);
        this.dialog = true;
      }
    }

    /**
     * Deletes a resource item from the api endpoint
     *
     * @return void
     */
    public async deleteItem(item: any): Promise<any> {
      if (this.contacts) {
        const index = this.contacts.indexOf(item);
        if (confirm('Are you sure you want to delete this item?') && this.contacts.splice(index, 1)) {
          // get data for data tables
          const contactApiResource = new ContactApiResource();
          const params = {
            resource: item,
          };

          return await contactApiResource
            .setResourcePath('/contacts')
            .setParams(params)
            .delete();
        }
      }
    }

    /**
     * Closes the dialog form
     *
     * @return void
     */
    public close() {
      this.dialog = false;
      setTimeout(() => {
        this.contactForm = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }

    /**
     * Saves the form data
     * sends data to the api endpoint
     */
    public async save() {

      // add form data to contact model
      if (this.contacts) {
        this.contacts.push(this.contactForm);
      }

      await this.store();

      // close dialog form
      this.close();
    }

    /**
     * Inserts new record to api endpoint
     *
     * @return void
     */
    public async store() {
      // send new contact data to api
      const contactApiResource = new ContactApiResource();
      const params = {
        resource: this.contactForm,
      };

      return await contactApiResource
        .setResourcePath('/contacts')
        .setParams(params)
        .post()
        .then((response) => {
          this.initialize();
        });
    }

    public async update() {
      // send new contact data to api
      const contactApiResource = new ContactApiResource();
      const params = {
        resource: this.contactForm,
      };

      return await contactApiResource
        .setResourcePath('/contacts')
        .setParams(params)
        .patch()
        .then(() => {
          this.initialize();
        });
    }
  }
</script>

<style lang="scss" scoped>
</style>
