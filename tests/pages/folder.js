import {
  create,
  visitable,
  collection,
  clickable,
  hasClass,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/inbox'),
  testContainer: '#test-root',

  emails: collection({
    itemScope: 'table tr',
    item: {
      checked: clickable('[type=checkbox]', { testContainer: '#test-root'}),
      star: clickable('td', { at: 1, testContainer: '#test-root'}),
      starred: hasClass('inbox-started', 'i', { scope: 'td:eq(1)', testContainer: '#test-root'})
    }
  }),

  trash: clickable('.mail-option .fa-trash', { testContainer: '#test-root' })
});
