const db = require('./mushroom_b_data.json');
const fs = require('fs');

const TITLE_PHRASES = [
  "Fruiting Body", "Cap", "Stem", "Pores", "Flesh", "Habitat", "Possible Confusion",
  "Taste / Smell", "Other Facts", "Frequency", "Spores", "Gills", "Skirt", "Spore Print"
];

const titleRegex = new RegExp(
  `^(${TITLE_PHRASES.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(:?\\s*)`,
  'gm'
);

function parseGeneralInfo(mushrooms) {
  return mushrooms.map(mushroom => {
    const { generalInfo, ...rest } = mushroom;
    if (!generalInfo) return mushroom;


    const matches = [];
    let match;
    while ((match = titleRegex.exec(generalInfo)) !== null) {
      matches.push({
        title: match[1],
        index: match.index,
        length: match[0].length
      });
    }

    if (matches.length === 0) return mushroom;


    const sections = {};
    for (let i = 0; i < matches.length; i++) {
      const { title, index, length } = matches[i];
      const start = index + length;
      const end = i + 1 < matches.length ? matches[i + 1].index : generalInfo.length;
      sections[title] = generalInfo.slice(start, end).trim();
    }

    return { ...rest, ...sections };
  });
}

const parsed = parseGeneralInfo(db.mushrooms);
fs.writeFileSync('parsed_mushroomsB.json', JSON.stringify(parsed, null, 2), 'utf-8');
console.log('Parsed data written to parsed_mushrooms.json');