
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.boolean('verified_email').defaultTo(false);
      t.string('role').defaultTo('regular');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.dropColumn('verified_email');
      t.dropColumn('role');
    })
  ])
};