
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('messages', (t) => {
      t.increments('id').primary();
      t.integer('profile_id');
      t.foreign('profile_id').references('users.id');
      t.integer('author_id');
      t.foreign('author_id').references('users.id');
      t.text('content', 'mediumtext');
      t.timestamps();
    }),
    knex.schema.table('users', (t) => {
      t.renameColumn('soundcloud_link', 'youtube_link');
    })
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (t) => {
      t.renameColumn('youtube_link', 'soundcloud_link');
    }),

    knex.schema.table('messages', (t) => {
      t.dropColumns('profile_id', 'author_id');
    }),

    knex.schema.dropTable('messages')
  ])
};
