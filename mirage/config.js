import Ember from 'ember';

const { get } = Ember;

function filterByTags(mail, { include = [], exclude = [] }) {
  return mail.where((m) => {
    let passed = include.length === 0 ? true : false;
    include.forEach((i) => passed = passed || get(m, 'tags').includes(i));
    exclude.forEach((e) => passed = passed && !get(m, 'tags').includes(e));
    return passed;
  });
}

function getEmailMetaCounts(mail){
  const results = {
    inboxUnread: filterByTags(mail, { exclude: ['trashed', 'sent', 'read'] }),
    inbox: filterByTags(mail, { exclude: ['trashed', 'sent'] }),
    trash: filterByTags(mail, { include: ['trashed'] }),
    starred: filterByTags(mail, { include: ['starred'] }),
    sent: filterByTags(mail, { include: ['sent'] }),
  };

  const meta = {
    inboxCount: results['inboxUnread'].models.length,
    trashCount: results['trash'].models.length,
    starredCount: results['starred'].models.length
  };

  return [meta, results];
}

export default function() {
  this.passthrough('/telling-stories.json');

  this.patch('/emails/:id', function({ emails }, request){
    const id = request.params.id;
    const attrs = this.normalizedRequestAttrs();

    const json = this.serialize(emails.find(id).update(attrs));
    const [meta,] = getEmailMetaCounts(emails);

    // workaround because  `item.save()` returns an item that can't query its
    // requests' meta information
    json.data.attributes.meta = meta;

    return json;
  });

  this.post('/emails', function({ emails }) {
    const attrs = this.normalizedRequestAttrs();
    attrs.from = 'dev@me.com';
    attrs.sentAt = new Date();
    const json = this.serialize(emails.create(attrs));
    const [meta,] = getEmailMetaCounts(emails);

    // workaround because  `item.save()` returns an item that can't query its
    // requests' meta information
    json.data.attributes.meta = meta;

    return json;
  });

  this.get('/emails', function({ emails }, request) {
    const folderName = request.queryParams.folderName;

    const [meta, results] = getEmailMetaCounts(emails);

    const json = this.serialize(results[folderName], 'email');


    json.meta = meta;

    return json;
  });

  this.get('/emails/:id', function({ emails }, request) {
    const id = request.params.id;
    const json = this.serialize(emails.find(id));
    const [meta,] = getEmailMetaCounts(emails);

    // workaround because  `item.save()` returns an item that can't query its
    // requests' meta information
    json.data.attributes.meta = meta;

    return json;
  });
}
