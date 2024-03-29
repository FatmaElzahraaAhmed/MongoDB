// Create new database named: FacultySystemV2.
// use FacultySystemV2

// Create student collection that has (FirstName, lastName, IsFired, FacultyID, array of objects, each object has CourseID, grade).
db.createCollection("student");

// Create Faculty collection that has (Faculty Name, Address).
db.createCollection("faculty");

// Create Course collection, which has (Course Name, Final Mark).
db.createCollection("course");

// Insert some data in previous collections.
db.student.insertMany([
  {
    FirstName: "mohamed",
    lastName: "ahmed",
    IsFired: false,
    FacultyID: 1,
    grades: [
      { CourseID: 1, grade: 90 },
      { CourseID: 2, grade: 80 },
    ],
  },
  {
    FirstName: "ahmed",
    lastName: "mohamed",
    IsFired: true,
    FacultyID: 2,
    grades: [
      { CourseID: 1, grade: 70 },
      { CourseID: 2, grade: 60 },
    ],
  },
  {
    FirstName: "ali",
    lastName: "mohamed",
    IsFired: false,
    FacultyID: 1,
    grades: [
      { CourseID: 1, grade: 80 },
      { CourseID: 2, grade: 70 },
    ],
  },
]);

db.faculty.insertMany([
  { FacultyName: "Engineering", Address: "Mansoura" },
  { FacultyName: "Computer Science", Address: "Cairo" },
]);

db.course.insertMany([
  { CourseName: "Math", FinalMark: 95 },
  { CourseName: "Science", FinalMark: 85 },
]);

// Display each student Full Name along with his average grade in all courses.
db.student.aggregate([
  {
    $project: {
      FullName: { $concat: ["$FirstName", " ", "$lastName"] },
      averageGrade: {
        $avg: "$grades.grade",
      },
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
  { $set: { courses: ["001", "002"] } }
);

// Select specific student with his name, and then display his courses.
db.student.aggregate([
  {
    $match: {
      FirstName: "John",
    },
  },
  {
    $lookup: {
      from: "course",
      localField: "courses",
      foreignField: "_id",
      as: "courses",
    },
  },
]);

// Implement relation between Student and faculty by adding the faculty object in the student using _id Relation using $Lookup.
db.student.updateMany(
  {},
  { $set: { faculty: "001" } }
);

// Select specific student with his name, and then display his faculty.
db.student.aggregate([
  {
    $match: {
      FirstName: "John",
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
