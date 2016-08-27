import { test } from 'qunit';
import moduleForAcceptance from 'mail/tests/helpers/module-for-acceptance';

import folderPage from 'mail/tests/pages/folder';

moduleForAcceptance('Acceptance | writing an email');

test('User writes an email', function(assert) {
  folderPage
    .visit()
    .clickOn('Compose')
    .fillIn('to', 'john@doe.com')
    .fillIn('subject', 'hello world')
    .fillIn('body', 'Lorem ipsum dolor')
    .clickOn('Send')
    .clickOn('Sent');

  andThen(function() {
    assert.ok(folderPage.emails(0).text, 'hello world');
  });
});
