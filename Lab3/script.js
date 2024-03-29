// Create new database named: FacultySystemV2.
// use FacultySystemV2

// Create student collection that has (FirstName, lastName, IsFired, FacultyID, array of objects, each object has CourseID, grade).
db.createCollection("student");

// Create Faculty collection that has (Faculty Name, Address).
db.createCollection("faculty");

// Create Course collection, which has (Course Name, Final Mark).
db.createCollection("course");

// Insert some data in previous collections.
var engineeringFaculty = db.faculty.insertOne({
  FacultyName: "Engineering",
  Address: "123 Main St",
});

var mathCourse = db.course.insertOne({ CourseName: "Math", FinalMark: 100 });
var physicsCourse = db.course.insertOne({
  CourseName: "Physics",
  FinalMark: 95,
});

db.student.insertMany([
  {
    FirstName: "ali",
    LastName: "ibraheem",
    IsFired: false,
    FacultyID: engineeringFaculty.insertedId,
    course: [
      { CourseID: mathCourse.insertedId, grade: 85 },
      { CourseID: physicsCourse.insertedId, grade: 90 },
    ],
  },
  {
    FirstName: "fatma",
    LastName: "elzahraa",
    IsFired: true,
    FacultyID: engineeringFaculty.insertedId,
    course: [
      { CourseID: mathCourse.insertedId, grade: 78 },
      { CourseID: physicsCourse.insertedId, grade: 95 },
    ],
  },
]);

// Display each student Full Name along with his average grade in all courses.
var studentsWithAverageGrade = db.student.aggregate([
  {
    $addFields: {
      FullName: { $concat: ["$FirstName", " ", "$LastName"] },
    },
  },
  {
    $unwind: "$course",
  },
  {
    $lookup: {
      from: "course",
      localField: "course",
      foreignField: "_id",
      as: "courseInfo",
    },
  },
  {
    $unwind: "$courseInfo",
  },
  {
    $group: {
      _id: "$_id",
      FullName: { $first: "$FullName" },
      averageGrade: { $avg: "$courseInfo.grade" },
    },
  },
]);

// Using aggregation display the sum of final mark for all courses in Course collection.
db.course.aggregate([
  {
    $group: {
      _id: null,
      totalFinalMark: {
        $sum: "$FinalMark",
      },
    },
  },
]);

// Implement (one to many) relation between Student and Course, by adding array of Courses IDs in the student object.
db.student.updateMany(
  {},
  { $set: { course: [mathCourse.insertedId, physicsCourse.insertedId] } }
);

// Select specific student with his name, and then display his courses.
db.student.aggregate([
  {
    $match: {
      FirstName: "fatma",
    },
  },
  {
    $lookup: {
      from: "course",
      localField: "course",
      foreignField: "_id",
      as: "course",
    },
  },
]);

// Implement relation between Student and faculty by adding the faculty object in the student using _id Relation using $Lookup.
db.student.updateMany(
  {},
  { $set: { faculty: engineeringFaculty.insertedId } }
);

// Select specific student with his name, and then display his faculty.
db.student.aggregate([
  {
    $match: {
      FirstName: "ali",
    },
  },
  {
    $lookup: {
      from: "faculty",
      localField: "faculty",
      foreignField: "_id",
      as: "faculty",
    },
  },
]);
