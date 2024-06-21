import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks'; // Import the tasks collection and methods

Meteor.startup(() => {
  console.log('MONGO_URL:', process.env.MONGO_URL);

  // Verify database connection
  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.client.db();
  db.admin().ping((err, result) => {
    if (err) {
      console.error('MongoDB connection failed:', err);
    } else {
      console.log('MongoDB connection succeeded:', result);
    }
  });
});
