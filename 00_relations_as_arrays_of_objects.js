// 1) Relations as arrays of objects

let likes = [
  { name: 'Jackie', likes: 'Jazz' },
  { name: 'Jackie', likes: 'Drawing' },
  { name: 'Jackie', likes: 'Dogs' },
  { name: 'Jackie', likes: 'Coffee' },
  { name: 'Delon', likes: 'Jazz' },
  { name: 'Jackie', likes: 'Delon' },
  { name: 'Delon', likes: 'Jackie' }
];

function where(relation, predicates) {
  return relation.filter((record) =>
    Object.entries(predicates).some(([field, value]) => record[field] === value)
  );
}

function select(relation, fields) {
  return relation.map((record) => fields.reduce(([newRecord, field]) => {
    newRecord[field] = record[field];
    return newRecord;
  }, {}));
}

function rename(relation, mapping) {
  return relation.map((record) =>
    Object.entries(mapping).reduce((newRecord, [oldName, newName]) => {
      newRecord[newName] = record[oldName];
      return newRecord;
    }, {});
  );
}

rename(select(where(likes, { name: 'Delon' }), ['likes']), { likes: 'loves' });
