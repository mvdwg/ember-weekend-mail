import { test } from 'qunit';
import moduleForAcceptance from 'mail/tests/helpers/module-for-acceptance';

import folderPage from 'mail/tests/pages/folder';

moduleForAcceptance('Acceptance | favorites');

test('User favorites email from inbox', function(assert) {
  server.create('email', { from: 'bill@hotmail.com', tags: [] });

  folderPage.visit();
  folderPage.emails(0).star();

  andThen(function() {
    assert.ok(folderPage.emails(0).starred, 'email was not favorited');
  });

  folderPage
    .clickOn('Starred')
    .clickOn('bill@hotmail.com')
    .trash();

  andThen(function() {
    assert.equal(folderPage.emails().count, 0);
  });
});

test('User deletes multiple emails at the same time', function(assert) {
  server.createList('email', 10);

  folderPage.visit();
  folderPage.emails(0).checked();
  folderPage.emails(1).checked();
  folderPage
    .clickOn('Move to')
    .clickOn('Delete')
    .clickOn('Trash');

  andThen(function() {
    assert.equal(folderPage.emails().count, 2);
  });
});
