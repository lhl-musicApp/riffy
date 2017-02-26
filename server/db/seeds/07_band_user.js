
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('band_user').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('band_user').insert({user_id: 2, band_id: 1, user_instrument: 'Piano', isBandAdmin: 1}),
        knex('band_user').insert({user_id: 1, band_id: 1, user_instrument: 'Trumpet', isBandAdmin: 0}),
        knex('band_user').insert({user_id: 5, band_id: 1, user_instrument: 'Violin', isBandAdmin: 1}),
        knex('band_user').insert({user_id: 4, band_id: 2, user_instrument: 'Electric Guitar', isBandAdmin: 1}),
        knex('band_user').insert({user_id: 3, band_id: 2, user_instrument: 'Singer', isBandAdmin: 0}),
        knex('band_user').insert({user_id: 6, band_id: 3, user_instrument: 'Song Writer', isBandAdmin: 1}),
        knex('band_user').insert({user_id: 7, band_id: 3, user_instrument: 'Saxophone', isBandAdmin: 0}),
        knex('band_user').insert({user_id: 8, band_id: 4, user_instrument: 'Drum', isBandAdmin: 1}),
        knex('band_user').insert({user_id: 9, band_id: 4, user_instrument: 'Base', isBandAdmin: 0}),
        knex('band_user').insert({user_id: 5, band_id: 4, user_instrument: 'Piano', isBandAdmin: 0}),
        knex('band_user').insert({user_id: 10, band_id: 5, user_instrument: 'Singer', isBandAdmin: 1})
      ]);
    });
};
