
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('skills').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('skills').insert({skill_name: 'Guitar'}),
        knex('skills').insert({skill_name: 'Base'}),
        knex('skills').insert({skill_name: 'Drum'}),
        knex('skills').insert({skill_name: 'Trumpet'}),
        knex('skills').insert({skill_name: 'Piano'}),
        knex('skills').insert({skill_name: 'Violin'}),
        knex('skills').insert({skill_name: 'Singing'}),
        knex('skills').insert({skill_name: 'Writing a song'}),
        knex('skills').insert({skill_name: 'Ukulele'}),
        knex('skills').insert({skill_name: 'Saxophone'}),
        knex('skills').insert({skill_name: 'Electric Guitar'}),
        knex('skills').insert({skill_name: 'Acoustic Guitar'})
      ]);
    });
};
