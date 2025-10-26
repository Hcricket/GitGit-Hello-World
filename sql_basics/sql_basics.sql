-- Drop existing tables if they exist
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS students;

-- Create students table
CREATE TABLE students (
  id          SERIAL PRIMARY KEY,
  first_name  VARCHAR(255) NOT NULL,
  last_name   VARCHAR(255) NOT NULL,
  birthdate   DATE NOT NULL,
  address_id  INTEGER
);

-- Create addresses table
CREATE TABLE addresses (
  id       SERIAL PRIMARY KEY,
  line_1   VARCHAR(255),
  city     VARCHAR(255),
  state    VARCHAR(2),
  zipcode  INTEGER
);

-- Create classes table
CREATE TABLE classes (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(255) NOT NULL,
  credits  INTEGER
);

-- Create enrollments table
CREATE TABLE enrollments (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER REFERENCES students(id),
  class_id    INTEGER REFERENCES classes(id),
  grade       CHAR(1)
);


