import { Students } from '../models/students.js';

export const getAllStudents = async () => {
    const students = await Students.find();
    return students;
};

export const getStudentById = async (studentId) => {
    const student = await Students.findById(studentId);
    return student;
};