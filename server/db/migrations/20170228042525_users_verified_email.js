
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.boolean('verified_email').defaultTo(false);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.dropColumn('verified_email');
    })
  ])
};