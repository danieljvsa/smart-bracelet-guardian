
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('nurses').del()
    .then(function () {
      // Inserts seed entries
      return knex('nurses').insert([
        {nurseName: 'Fabian Wood', phone: '+351914906145', 'division': 'front'},     
      ]);
    });
};
