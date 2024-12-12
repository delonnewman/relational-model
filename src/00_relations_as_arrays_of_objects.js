// A small database of the likes and dislikes of my wife, my dog and myself
let likes = [
  { subject: 'Jazz', Jackie: true, Delon: true, Blu: false },
  { subject: 'Drawing', Jackie: true, Delon: false, Blu: false },
  { subject: 'Dogs', Jackie: true, Delon: true, Blu: false },
  { subject: 'Coffee', Jackie: true, Delon: true, Blu: false },
  { subject: 'Delon', Jackie: true, Delon: true, Blu: true },
  { subject: 'Jackie', Jackie: true, Delon: true, Blu: true },
  { subject: 'Blu', Jackie: true, Delon: true, Blu: true },
  { subject: 'Music', Jackie: true, Delon: true, Blu: true },
  { subject: 'Programming', Jackie: false, Delon: true, Blu: false },
  { subject: 'Hiking', Jackie: true, Delon: true, Blu: true },
  { subject: 'Snow', Jackie: true, Delon: true, Blu: true },
  { subject: 'Water', Jackie: false, Delon: true, Blu: true },
  { subject: 'Mud', Jackie: false, Delon: false, Blu: true },
];

function where(relation, predicates) {
  return relation.filter((record) =>
    Object.entries(predicates).every(([field, value]) => record[field] === value)
  );
}

where(likes, { subject: 'Blu' });

function select(relation, fields) {
  return relation.map((record) => fields.reduce((newRecord, field) => {
    newRecord[field] = record[field];
    return newRecord;
  }, {}));
}

select(likes, ['subject', 'Jackie']);

function rename(relation, mapping) {
  return relation.map((record) =>
    Object.entries(mapping).reduce((newRecord, [oldName, newName]) => {
      newRecord[newName] = record[oldName];
      return newRecord;
    }, {})
  );
}

rename(likes, { subject: 'thing' });

// This is what it looks like all together
rename(select(where(likes, { Jackie: true, Delon: false }), ['subject']), { subject: 'object' });

// Let's redefine where a bit
function where2(relation, predicates) {
  return relation.filter((record) =>
    predicates.every(([op, field, value]) => op(record[field], value))
  );
}
const eq = (a, b) => a === b
const like = (value, pattern) => pattern.test(value)

where2(likes, [[eq, 'subject', 'Jackie']]);

where2(likes, [[like, 'subject', /j/i]]);

rename(select(where2(likes, [[eq, 'Jackie', true], [eq, 'Delon', true], [eq, 'Blu', true]]), ['subject']), { subject: 'loves' });

// Let's redefine where again
function where3(relation, joining) {
  return relation.filter((record) =>
    joining((predicate) => {
      if (typeof predicate === 'function') {
        return predicate(([op, field, value]) => op(record[field], value));
      } else {
        const [op, field, value] = predicate;
        return op(record[field], value)
      }
    })
  );
}
const and = (...predicates) => (matching) => predicates.every(matching);
const or = (...predicates) => (matching) => predicates.some(matching);

where3(likes, and([eq, 'Jackie', true], [eq, 'Delon', true], [eq, 'Blu', true]));

where3(likes, or(and([eq, 'Jackie', true], [eq, 'Blu', true]), and([eq, 'Delon', true], [eq, 'Blu', true])));
