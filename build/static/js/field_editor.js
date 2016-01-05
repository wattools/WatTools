// These properties will not be displayed in the description of fields
var field_hidden_properties = ['order', 'name', 'sort_id'];

// This is a list of all properties a field may define.
// Currently anything other than bool is a text value and bool is a
// checkbox which results in true/false when saved
var field_possible_properties = {
  //property name : property type
  'name': 'text',
  'class': 'text',
  'label': 'textarea',
  'multiline': 'bool',
  'url': 'bool'
};

var FieldEditor = Backbone.View.extend({
  el: '#field-editor',

  events: {
    'click .btn[type="edit_field"]': 'edit_field_btn',
    'click .btn[type="delete_field"]': 'delete_field_btn'
  },

  complex_behaviors: function() {
    if(this.model.get('edit_mode')) {
      var $ul = this.$('#fields');
      var current_revision = this.model.get('current_revision');
      var that = this;
      $ul.sortable({
        placeholder: "field placeholder",
        update: function(event, ui) {
          var sort_order = $(this).sortable('toArray');
          var fields = current_revision.get('fields');
          var unsorted_entries = [];
          for(var pos in sort_order) {
            fields.at(Number(sort_order[pos].substr(6))).set({
              'sort_id': pos
            }, {
              silent: true
            });
          }
          current_revision.get('fields').sort();
        }
      });
      $ul.disableSelection();
    }
  },

  delete_field_btn: function(e) {
    if(confirm('Are you sure you want to delete this item?')) {
      if(!$(e.target).hasClass('btn')){
        e.target= $(e.target).parent()[0];
      }
      var index = $(e.target).attr('parameter');
      this.model.get('current_revision').get('fields').remove(
      this.model.get('current_revision').get('fields').at(index));
    }
  },

  initialize: function(model) {
    this.model = model;
    var fields = this.model.get('current_revision').get('fields');

    function notify_entries_and_render() {
      this.model.get('current_revision').get('entries').trigger('change');
      this.render();
    }
    fields.on('add', notify_entries_and_render, this);
    fields.on('change', notify_entries_and_render, this);
    fields.on('remove', notify_entries_and_render, this);
  },

  render: function() {
    debug.time('render fields');
    //safety first, frosh
    if(!this.model.get('edit_mode')) return;

    this.$el = $('#field-editor');

    var field, fields_data, this_field, property, view, properties, field_data, fields = this.model.get('current_revision').get('fields');

    fields_data = [];
    fields.forEach(function(this_field, field, fields) {

      properties = [];
      for(var property in this_field.toJSON()) {
        var value = this_field.get(property);
        if(field_hidden_properties.indexOf(property) == -1) {
          properties.push({
            property: property,
            value: value
          });
        }
      }

      field_data = {
        id: 'field_' + field,
        title: this_field.get('name'),
        properties: properties,
        buttons: {
          buttons: [{
            icon: 'pencil',
            type: 'edit_field',
            parameter: field
          },
          view = {
            icon: 'trash',
            type: 'delete_field',
            parameter: field
          }]
        }
      };

      fields_data.push(field_data);
    }.bind(this));

    view = {
      fields: fields_data,
      partials: ['buttons']
    };

    this.$el.html($.mustache('fields', view));
    this.complex_behaviors();
    this.delegateEvents(this.events);
    debug.timeEnd('render fields');
    return this;
  },
  // Open a modal to edit the field with this index
  //
  // Modifies watedit.LinkData and triggers redraw of everything
  edit_field_btn: function(e) {
      if(!$(e.target).hasClass('btn')){
        e.target= $(e.target).parent()[0];
      }
    this.edit_field($(e.target).attr('parameter'));
  },

  edit_field: function(index) {
    var property, prop_type, view, properties_data, field = this.model.get('current_revision').get('fields').at(index);

    properties_data = [];
    //go through each property that a field can have
    for(property in field_possible_properties) {
      if(Object.prototype.hasOwnProperty.call(field_possible_properties, property)) {
        prop_type = field_possible_properties[property];

        properties_data.push({
          val: field.get(property),
          label: property,
          name: property,
          checked: field.get(property) === true,
          checkbox: prop_type === 'bool',
          multiline: prop_type === 'multiline',
          input: prop_type !== 'multiline'
        });
      }
    }
    view = {
      inputs: properties_data
    };

    var that = this;
    var submit = function() {
        var $dialog = $(this),
          $inputs = $('input,textarea', $dialog),
          n, $input, val, name, entry, length, old_name = field.get('name'),
          entries = that.model.get('current_revision').get('entries');

        //get all the inputs and text areas
        for(n = 0, length = $inputs.length; n < length; n += 1) {
          $input = $($inputs[n]); //get the input element
          val = $input.val(); //new value to set
          name = $input.attr('name'); //name of the property to edit
          //we have to not lose the relationship if we change the name!
          if(name === 'name' && val !== old_name) {
            entries.forEach(function(entry) {
              entry.set(mkobj(val, entry.get(old_name)), {
                silent: true
              });
              entry.unset(old_name, {
                silent: true
              });
            }.bind(this));
          }

          //create the property if it didn't exist but we are giving it a value
          if($input.attr('type') === 'checkbox') {
            if($input.is(':checked')) {
              field.set(mkobj(name, true), {
                silent: true
              });
            } else {
              field.unset(name, {
                silent: true
              });
            }
          } else {
            if(val !== '') {
              field.set(mkobj(name, val), {
                silent: true
              });
            } else {
              field.unset(name, {
                silent: true
              });
            }
          }
        }
        that.model.get('current_revision').get('entries').trigger('change');
        that.model.get('current_revision').get('fields').trigger('change');
        $dialog.modal('hide');
        return false;
      };

    submit_cancel_dialog($.mustache('form', view), field.get('name'), submit, 'Save', function($dialog) {
      $dialog.find('form').submit(submit.bind($dialog));
    });
  }

});