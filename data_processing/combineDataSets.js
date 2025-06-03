const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, 'mushroom-database');
const aPath = path.join(jsonDir, 'OLDmushroom_a_data.json');
const bPath = path.join(jsonDir, 'OLDmushroom_b_data.json');

const aData = JSON.parse(fs.readFileSync(aPath, 'utf-8'));
const bData = JSON.parse(fs.readFileSync(bPath, 'utf-8'));

function mergeMushroomData(aArr, bArr) {

  const bMap = {};
  bArr.forEach(obj => {
    if (obj.name && typeof obj.name === 'string') {
      bMap[obj.name.trim().toLowerCase()] = obj;
    }
  });

  aArr.forEach(obj => {
    if (!obj.name || typeof obj.name !== 'string') return;
    const normName = obj.name.trim().toLowerCase();
    if (bMap[normName]) {
      Object.assign(bMap[normName], obj);
    } else {

      bArr.push(obj);
      bMap[normName] = obj;
    }
  });

  return bArr;
}

const merged = mergeMushroomData(aData, bData);

const outputPath = path.join(__dirname, 'mushroom_db.json');
fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');