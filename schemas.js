const joi = require('joi');
studentSchema = joi.object({
    student_name: joi.string().required(),
    email: joi.string().required(),
    address: joi.string().required(),
    img: joi.required(),
    rollno: joi.number().required(),
    branch: joi.string().required()
});

reportSchema = joi.object({
    begin_date: joi.date().required(),
    last_date: joi.date().required()
});

module.exports = { studentSchema, reportSchema };
