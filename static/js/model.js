var Field = Backbone.Model.extend({
  defaults: {
    name: '',
    'class': '',
    label: '',
    multiline: false,
    url: '',
    sort_id: -1
  }
});

var Fields = Backbone.Collection.extend({
  model: Field,
  comparator: function(that) {
    return that.get("sort_id");
  }
});

// var FieldDatum = Backbone.Model.extend({
//   text: '',
//   url: ''
// });
// var FieldData = Backbone.Collection.extend({
//   model: FieldDatum
// });
var Entry = Backbone.Model.extend({
  defaults: {
    data: null,
    // FieldData
    sort_id: -1
  }
});

var Entries = Backbone.Collection.extend({
  model: Entry,
  comparator: function(that) {
    return Number(that.get("sort_id"));
  }
});

// var RevisionSummary = Backbone.Model.extend({
//   defaults: {
//     description: '',
//     time: 0,
//     file: ''
//   }
// });
// var RevisionsSummary = Backbone.Collection.extend({
//   model: RevisionSummary
// });
var Revision = Backbone.Model.extend({
  defaults: function() {
    return {
      entries: new Entries(),
      fields: new Fields()
    };
  }
});

var WatEditModel = Backbone.Model.extend({
  defaults: function() {
    return {
      edit_mode: false,
      admin: false,
      // revisions_summary: new RevisionsSummary(),
      current_revision: new Revision(),
      current_revision_id: 0
    };
  }
});