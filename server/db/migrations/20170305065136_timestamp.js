exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('messages', (t) => {
      t.dropTimestamps();
    }),
    knex.schema.table('messages', (t) => {
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([

    knex.schema.table('messages', (t) => {
      t.dropTimestamps();
    }),
    knex.schema.table('messages', (t) => {
      t.timestamps();
    }),

  ])
};
