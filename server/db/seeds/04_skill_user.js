
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('skill_user').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('skill_user').insert({user_id: 1, skill_id: 2, skill_rating: 9, skill_comment: '10 years experience'}),
        knex('skill_user').insert({user_id: 1, skill_id: 12, skill_rating: 8, skill_comment: 'awesome'}),
        knex('skill_user').insert({user_id: 2, skill_id: 3, skill_rating: 5}),
        knex('skill_user').insert({user_id: 2, skill_id: 4, skill_rating: 6}),
        knex('skill_user').insert({user_id: 2, skill_id: 5, skill_rating: 2, skill_comment: 'just started to learn'}),
        knex('skill_user').insert({user_id: 3, skill_id: 8, skill_rating: 10, skill_comment: 'woo hoo'}),
        knex('skill_user').insert({user_id: 3, skill_id: 7, skill_rating: 6}),
        knex('skill_user').insert({user_id: 3, skill_id: 6, skill_rating: 8}),
        knex('skill_user').insert({user_id: 3, skill_id: 9, skill_rating: 6}),
        knex('skill_user').insert({user_id: 3, skill_id: 1, skill_rating: 4}),
        knex('skill_user').insert({user_id: 3, skill_id: 10, skill_rating: 3}),
        knex('skill_user').insert({user_id: 4, skill_id: 2, skill_rating: 2, skill_comment: 'novice'}),
        knex('skill_user').insert({user_id: 4, skill_id: 11, skill_rating: 8}),
        knex('skill_user').insert({user_id: 4, skill_id: 4, skill_rating: 9}),
        knex('skill_user').insert({user_id: 5, skill_id: 7, skill_rating: 7, skill_comment: 'testing'}),
        knex('skill_user').insert({user_id: 6, skill_id: 12, skill_rating: 4}),
        knex('skill_user').insert({user_id: 6, skill_id: 2, skill_rating: 9, skill_comment: 'I am master'}),
        knex('skill_user').insert({user_id: 7, skill_id: 5, skill_rating: 5}),
        knex('skill_user').insert({user_id: 9, skill_id: 7, skill_rating: 9})
      ]);
    });
};
