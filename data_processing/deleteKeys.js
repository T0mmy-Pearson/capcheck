const fs = require('fs');


const data = JSON.parse(fs.readFileSync('./jsons/mushroom_a_data.json', 'utf8'));


const keysToRemove = ['scientificName', 'fruitingBody', 'pores', 'flesh', 'habitat', 'confusion', 'taste', 'facts'];
const newData = data.map(obj => {
  keysToRemove.forEach(key => {
    delete obj[key];
  });
  return obj;
});


fs.writeFileSync('mushroom_a_data.json', JSON.stringify(newData, null, 2));