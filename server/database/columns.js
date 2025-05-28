
const db = require('./db');

const eventsCol = [
    'event VARCHAR(255) NOT NULL',
    'time VARCHAR(255) NOT NULL'
];

db.query(`CREATE TABLE IF NOT EXISTS events (${eventsCol.join(', ')})`);

const examDatesCol = [
    'subject varchar(255)',
    'date varchar(255)'
];

db.query(`CREATE TABLE IF NOT EXISTS exam_dates (${examDatesCol.join(', ')})`);

const examResultsCol = [
    'percentage int',
    'student_id bigint',
    'subject varchar(100)'
];

db.query(`CREATE TABLE IF NOT EXISTS exam_results (${examResultsCol.join(', ')})`);

const progressCol = [
    'id int AUTO_INCREMENT PRIMARY KEY',
    'student_name varchar(100)',
    'student_id varchar(100)',
    'test_name varchar(100)',
    'obtained_mark int',
    'test_mark int'
];

db.query(`CREATE TABLE IF NOT EXISTS progress (${progressCol.join(', ')})`);

const pswRecoveryCol = [
    'email varchar(100)',
    'code varchar(100)',
    'expires_at datetime'
];

db.query(`CREATE TABLE IF NOT EXISTS pswrecovery (${pswRecoveryCol.join(', ')})`);

const studentRegistryCols = [
    'student_name varchar(100)',
    'id_number bigint',
    'coarse varchar(100)',
    'subjects json',
    'grade varchar(100)',
    'attendance varchar(100)'
];

db.query(`CREATE TABLE IF NOT EXISTS student_registry (${studentRegistryCols.join(', ')})`);

const studentSubmissionsCols = [
    'id int AUTO_INCREMENT PRIMARY KEY',
    'student_name varchar(255)',
    'student_email varchar(255)',
    'student_id bigint',
    'time_submitted varchar(255)',
    'subject varchar(255)',
    'submitted_pdf blob'
];

db.query(`CREATE TABLE IF NOT EXISTS student_submissions (${studentSubmissionsCols.join(', ')})`);

const studentTasksCols = [
    'id int',
    'student_id bigint',
    'due_date varchar(255)',
    'task_pdf longblob',
    'subject varchar(255)'
];

db.query(`CREATE TABLE IF NOT EXISTS student_tasks (${studentTasksCols.join(', ')})`);

const transactionsCols = [
    'id bigint',
    'amount_owed varchar(100)',
    'amount_payed varchar(100)',
    'date datetime'
];

db.query(`CREATE TABLE IF NOT EXISTS transactions (${transactionsCols.join(', ')})`);

const absenteesCol = [
    'reason TEXT NOT NULL',
    'subject VARCHAR(255) NOT NULL',
    'date DATE NOT NULL'
];

db.query(`CREATE TABLE IF NOT EXISTS absentees (${absenteesCol.join(', ')})`);

const announcementCol = [
    'id int AUTO_INCREMENT PRIMARY KEY',
    'text TEXT NOT NULL',
    'date DATE NOT NULL'
];

db.query(`CREATE TABLE IF NOT EXISTS announcements (${announcementCol.join(', ')})`);

const sessionCol = [
   
   'session_id VARCHAR(128) PRIMARY KEY',
   'expires INT UNSIGNED',
   'data MEDIUMTEXT'
]

const studentCol = [
    'id int AUTO_INCREMENT PRIMARY KEY',
    'email varchar(255) not null',
    'password varchar(255) not null',
    'firstname varchar(255) not null',
    'lastname varchar(255) not null',
    'cellphone varchar(255) not null',
    'grade varchar(255) not null',
    'coarse varchar(255) not null',
    'attendance varchar(255) not null',
    'id_number varchar(255) not null'
]  
       db.query(`CREATE TABLE IF NOT EXISTS students(${studentCol.join(', ')})`); 
        db.query(`CREATE TABLE IF NOT EXISTS sessions(${sessionCol.join(', ')})`)
