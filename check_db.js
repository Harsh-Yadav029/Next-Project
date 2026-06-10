const mongoose = require('mongoose');

const uri = "mongodb://feedback:feedback@ac-djgdakr-shard-00-00.rbjwaks.mongodb.net:27017,ac-djgdakr-shard-00-01.rbjwaks.mongodb.net:27017,ac-djgdakr-shard-00-02.rbjwaks.mongodb.net:27017/?ssl=true&replicaSet=atlas-do60i1-shard-0&authSource=admin&appName=Cluster0";

async function checkUsers() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(uri, {});
    console.log('Connected!');
    
    // Fetch all documents from the users collection
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('\n--- REGISTERED USERS ---');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      users.forEach(u => {
        console.log(`Username: "${u.username}", Email: "${u.email}", Verified: ${u.isVerified}, Code: "${u.verifyCode}"`);
      });
    }
    console.log('------------------------\n');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
