use hotel_checkins;
db.dropDatabase();


db.bookings.insertMany(JOSN.parse(xml));
