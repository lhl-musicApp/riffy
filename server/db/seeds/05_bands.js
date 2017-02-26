
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('bands').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('bands').insert({band_name: 'WSDocumentariesArchive07Pro Unlimited', band_bio: 'Throughout the week BBC World Service offers a wide range of documentaries and other factual programmes. This podcast offers you the chance to access landmark series from our archive.', band_influence: '', soundcloud_link: 'https://soundcloud.com/wsdocumentariesarchive07', is_new_band: 0, has_open_position: 0, looking_for: ''}),
        knex('bands').insert({band_name: 'Fifi and Jules', band_bio: '', band_influence: '', soundcloud_link: 'https://soundcloud.com/fifiandjules', is_new_band: 0, has_open_position: 0, looking_for: ''}),
        knex('bands').insert({band_name: 'Rick Steves', band_bio: 'Rick Steves, best-selling guidebook author and star of public television’s most-watched travel show, also hosts a fun, hour-long, radio talk show featuring lively conversations about travel, cultures, people, and how worldwide travel can broaden our perspective.', band_influence: 'Elvis Presley', soundcloud_link: 'https://soundcloud.com/rick-steves', is_new_band: 0, has_open_position: 0, looking_for: ''}),
        knex('bands').insert({band_name: 'Nick Czarnick', band_bio: "Snapchat Me @ nicholasjohn62, I am a College student, I've been been playing Guitar since i was 7. I also play Drums, and Bass and i would love to get to know other instruments as well. I am Currently in a band called Product Of The Broken, I am into Rock and Country and i am willing to try new types of music. If you need me as a player or would like to start a band feel free to message me on here or via Facebook! Rock On", band_influence: '', soundcloud_link: 'https://soundcloud.com/nick-czarnick', is_new_band: 0, has_open_position: 0, looking_for: ''}),
        knex('bands').insert({band_name: 'Band in Newera', band_bio: 'I am creating new band, and looking for people who can play and perform with me!', band_influence: 'Queen', soundcloud_link: '', is_new_band: 1, has_open_position: 1, looking_for: 'Drummer, Guitarist'})
      ]);
    });
};
