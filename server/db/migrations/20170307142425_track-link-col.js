exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tracks', (t) => {
      t.string('track_link');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tracks', (t) => {
      t.dropColumn('track_link');
    })
  ])
};
