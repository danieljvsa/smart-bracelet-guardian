
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('profiles').del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert([
        {profileName: 'Zodwa Olukayode', battery: '-'},
        {profileName: 'Gudina Nkosazana', battery: '50'},
        {profileName: 'Cabdulqaadir Nekesa', battery: '-'}
      ]);
    });
};
