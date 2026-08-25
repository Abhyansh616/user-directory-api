const Joi = require("joi");

const studentSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),

  age: Joi.number()
    .min(3)
    .max(20)
    .required(),

  grade: Joi.string()
    .required(),

  isActive: Joi.boolean()
});

module.exports = {
  studentSchema
};