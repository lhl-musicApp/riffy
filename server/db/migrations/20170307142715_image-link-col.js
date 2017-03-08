exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.string('image_link');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.dropColumn('image_link');
    })
  ])
};
