
exports.up = function(knex, Promise) {

  return Promise.all([
    // Skills Table
    knex.schema.createTable('skills', (t) => {
      t.increments('id').primary();
      t.string('skill_name').unique();
      t.timestamps();
    }),

    // Users Table
    knex.schema.createTable('users', (t) => {
      t.increments('id').primary();
      t.string('email').unique().comment('Unique email as username');
      t.string('password');
      t.string('first_name');
      t.string('last_name');
      t.string('gender');
      t.string('user_city');
      t.string('user_country');
      t.text('user_bio', 'mediumtext');
      t.string('user_influence');
      t.string('soundcloud_link');
      t.boolean('isAvailable');
      t.string('looking_for');
      t.timestamps();
    }),


    // Skill_user Table
    knex.schema.createTable('skill_user', (t) => {
      t.integer('user_id');
      t.foreign('user_id').references('users.id');
      t.integer('skill_id');
      t.foreign('skill_id').references('skills.id');
      t.integer('skill_rating');
      t.text('skill_comment', 'mediumtext');
      t.timestamps();
    }),


    // Bands Table
    knex.schema.createTable('bands', (t) => {
      t.increments('id').primary();
      t.string('band_name');
      t.text('band_bio', 'mediumtext');
      t.string('band_influenece');
      t.boolean('is_new_band').comment('Checking if starting new band');
      t.string('has_open_position');
      t.string('looking_for');
      t.timestamps();
    }),

    // Tracks Table
    knex.schema.createTable('tracks', (t) => {
      t.increments('id').primary();
      t.integer('user_id');
      t.foreign('user_id').references('users.id');
      t.integer('band_id');
      t.foreign('band_id').references('bands.id');
      t.string('track_name');
      t.boolean('isCreator').comment('Checking if track is self-created');
      t.string('original_artist').comment('Original artist of the song if applicable');
      t.string('soundcloud_link')
      t.boolean('isPublished').comment('Publish or hide')
      t.timestamps();
    }),


    // Band_user Table
    knex.schema.createTable('band_user', (t) => {
      t.integer('user_id');
      t.foreign('user_id').references('users.id');
      t.integer('band_id');
      t.foreign('band_id').references('bands.id');
      t.string('user_instrument');
      t.boolean('isBandAdmin');
      t.timestamps();
    })



  ]) // end return
}; // end exports.up

exports.down = function(knex, Promise) {

  return Promise.all([

    // Drop foriegn keys
    // from Band_user
    knex.schema.table('band_user', (t) => {
      t.dropColumns('user_id', 'band_id');
    }),
    // from Skill_user
    knex.schema.table('skill_user', (t) => {
      t.dropColumns('skill_id');
    }),
    // from Tracks
    knex.schema.table('tracks', (t) => {
      t.dropColumns('user_id', 'band_id');
    }),
    knex.schema.dropTable('band_user'),
    knex.schema.dropTable('tracks'),
    knex.schema.dropTable('bands'),
    knex.schema.dropTable('skill_user'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('skills')


  ])


};
