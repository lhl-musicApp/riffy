exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.string('instrument');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.dropColumn('instrument');
    })
  ])
};
