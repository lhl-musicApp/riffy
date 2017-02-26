
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tracks').del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('tracks').insert({user_id: 1, track_name: 'Minim t-bone qui eiusmod ullamco', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 2, track_name: 'prosciutto ut', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 3, track_name: 'eiusmod ham', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({user_id: 4, track_name: 'Bacon ipsum dolor', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 5, track_name: 'landjaeger porchetta shankle', isCreator: 1, original_artist: '', isPublished: 0, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 6, track_name: 'Brisket meatball', isCreator: 0, original_artist: 'Nobody', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({user_id: 7, track_name: 'pork loin doner ball tip', isCreator: 1, original_artist: '', isPublished: 0, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 8, track_name: 'cow strip steak', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 8, track_name: 't-bone pork ham hock', isCreator: 0, original_artist: 'Coolman', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 10, track_name: 'andouille cupim leberkas', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 3, track_name: 'Drumstick doner chicken', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({user_id: 4, track_name: 'lorem ipsum text long for something', isCreator: 0, original_artist: 'Madonna', isPublished: 0, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 3, track_name: 'frankfurter bacon cow shankle', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 5, track_name: 'fatback landjaeger', isCreator: 0, original_artist: 'Metallica', isPublished: 0, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 8, track_name: 'Beef ribs fatback tenderloin', isCreator: 0, original_artist: 'Bob Marley', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({user_id: 10, track_name: 'culpa irure', isCreator: 1, original_artist: '', isPublished: 0, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 3, track_name: 'Beef ribs fatback', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 4, track_name: 'Sirloin ut chicken', isCreator: 1, original_artist: '', isPublished: 0, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 6, track_name: 'est shoulder', isCreator: 0, original_artist: 'Katy Perry', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({user_id: 7, track_name: 'Swine drumstick', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 7, track_name: 'culpa irure', isCreator: 0, original_artist: 'Justin Timberlake', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({user_id: 7, track_name: 'Boudin pork', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({band_id: 1, track_name: 'eatloaf bacon hamburger shoulder', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({band_id: 2, track_name: 'Do frankfurter', isCreator: 0, original_artist: 'Madonna', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({band_id: 3, track_name: 'Spare ribs ', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({band_id: 4, track_name: 'shank ball tip', isCreator: 1, original_artist: '', isPublished: 0, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({user_id: 3, band_id: 1, track_name: 'Ullamco', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({band_id: 1, track_name: 'Do frankfurter', isCreator: 1, original_artist: '', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({band_id: 1, track_name: 'Mollit incididunt', isCreator: 0, original_artist: 'Nobody', isPublished: 1, soundcloud_link: ''}),
        knex('tracks').insert({band_id: 2, track_name: 'Nostrud nisi salami', isCreator: 0, original_artist: 'Justin Timberlake', isPublished: 1, soundcloud_link: 'https://soundcloud.com/fifiandjules/what-we-learned-about-jules-2'}),
        knex('tracks').insert({band_id: 3, track_name: 'T-bone frankfurter', isCreator: 1, original_artist: '', isPublished: 0, soundcloud_link: ''})
      ]);
    });
};
