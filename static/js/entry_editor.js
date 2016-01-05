var EntryEditor = Backbone.View.extend({
  el: '#item-editor',

  events: {
    'click .btn[type=edit_entry]': 'edit_entry_btn',
    'click .btn[type=delete_entry]': 'delete_entry_btn'
  },

  delete_entry_btn: function(e) {
    if(confirm('Are you sure you want to delete this item?')) {
      if(!$(e.target).hasClass('btn')){
        e.target= $(e.target).parent()[0];
      }
      var index = $(e.target).attr('parameter');
      this.model.get('current_revision').get('entries').remove(
      this.model.get('current_revision').get('entries').at(index));
    }
  },

  initialize: function(model) {
    this.model = model;
    var entries = this.model.get('current_revision').get('entries');
    entries.on('add', this.render, this);
    entries.on('change', this.render, this);
    entries.on('remove', this.render, this);
  },

  render: function() {
    debug.time('render entries');
    this.$el = $('#item-editor');
    var view, entry, field, fields_data, entries_data, this_entry, property, this_field, entries = this.model.get('current_revision').get('entries'),
      fields = this.model.get('current_revision').get('fields');

    //gather data from all entries
    entries_data = [];
    entries.forEach(function(this_entry, entry, entries) {

      fields_data = [];
      //go through each field to organize the data
      fields.forEach(function(this_field, field, fields) {
        this_field = fields[field];
        property = this_entry.get(this_field.get('name'));
        //if this entry has a property coresponding to this field
        if(property !== undefined && property.text !== '') {
          fields_data.push({
            'class': this_field.get('class'),
            link: property.url,
            label: this_field.get('label'),
            text: property.text
          });
        }
      }.bind(this));

      //build the data for this entry
      entry_data = {
        id: 'item_' + entry,
        fields: fields_data,
        buttons: { //partial
          buttons: [{
            icon: 'pencil',
            type: 'edit_entry',
            parameter: entry
          }, {
            icon: 'trash',
            type: 'delete_entry',
            parameter: entry
          }] //array
        }
      };

      entries_data.push(entry_data);
    }.bind(this));

    view = {
      entries: entries_data,
      edit_mode: this.model.get('edit_mode'),
      partials: ['buttons']
    };
    this.$el.html($.mustache('entries', view));
    this.complex_behaviors();
    this.delegateEvents(this.events);
    debug.timeEnd('render entries');
    return this;
  },

  complex_behaviors: function() {
    if(this.model.get('edit_mode')) {
      var $ul = this.$('#items');
      var current_revision = this.model.get('current_revision');
      var that = this;
      $ul.sortable({
        placeholder: "item placeholder",
        update: function(event, ui) {
          var sort_order = $(this).sortable('toArray');
          var entries = current_revision.get('entries');
          var unsorted_entries = [];
          for(var pos in sort_order) {
            entries.at(Number(sort_order[pos].substr(5))).set({
              'sort_id': pos
            }, {
              silent: true
            });
          }
          current_revision.get('entries').sort();
          // that.render();
        }
      });
      $ul.disableSelection();
    }
  },


  // Open a modal to edit the entry with this index
  // 
  // Modifies watedit.LinkData and triggers redraw of entries
  edit_entry_btn: function(e) {
    if(!$(e.target).hasClass('btn')){
      e.target= $(e.target).parent()[0];
    }
    this.edit_entry($(e.target).attr('parameter'));
  },

  edit_entry: function(index) {
    var this_field, property, field, $field, view, title, fields_data, field_data, entry = this.model.get('current_revision').get('entries').at(index),
      fields = this.model.get('current_revision').get('fields'),
      $fields = $('<div>');

    fields_data = [];
    fields.forEach(function(this_field, field, fields) {
      property = entry.get(this_field.get('name'));
      field_data = {
        val: property ? property.text : '',
        label: this_field.get('name'),
        purpose: 'text',
        field: this_field.get('name'),
        multiline: this_field.get('multiline'),
        input: !this_field.get('multiline')
      };

      //text input
      fields_data.push(field_data);

      //url input
      if(this_field.get('url')) {
        //make a copy of the old data
        field_data = $.extend({}, field_data);
        field_data.label += ' url';
        field_data.val = property ? property.url : '';
        field_data.purpose = 'url';
        field_data.input = true;
        //then add a field for the url
        fields_data.push(field_data);
      }
    });

    var submit = function() {
        var $dialog = $(this),
          $inputs = $('input,textarea', $dialog),
          $input, purpose, field, val, n, length;

        try {
          //get all the inputs and text areas
          for(n = 0, length = $inputs.length; n < length; n += 1) {
            $input = $($inputs[n]); //get the input element
            val = $input.val(); //new value to set
            field = $input.attr('field'); //field to edit
            purpose = $input.attr('purpose'); //text or url
            //create the field if it didn't exist but we are giving it a value
            if(entry.get(field) === undefined && val !== '') {
              entry.set(field, {});
            }

            //set the value
            if(entry.get(field) !== undefined) {
              if(val !== '') {
                if(purpose == 'url' && val.substr(0, 4) != 'http') {
                  throw 'Invalid URL';
                }
                var tmp = entry.get(field);
                tmp[purpose] = val;
                entry.set(field, tmp);
              } else {
                delete entry.get(field)[purpose];
              }
            }
            //remove empty object
            if($.isEmptyObject(entry.get(field))) {
              entry.unset(field);
            }
          }
          entry.trigger('change');
          $dialog.modal('hide');
        } catch(e) {
          $dialog.find('.form-error').text(e.toString());
        }
        return false;
      };

    submit_cancel_dialog(
    $.mustache('form', {
      inputs: fields_data
    }), entry.get(fields.first().get('name')) && entry.get(fields.first().get('name')).text || 'Untitled', submit, 'Save', function($dialog) {
      $dialog.find('form').submit(submit.bind($dialog));
    });
  }


});