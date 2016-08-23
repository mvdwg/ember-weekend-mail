import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  from: faker.internet.email,
  to: faker.internet.email,
  subject: faker.lorem.sentence(),
  body: faker.lorem.sentences()
});
