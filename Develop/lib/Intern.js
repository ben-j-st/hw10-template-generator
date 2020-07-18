// TODO: Write code to define and export the Intern class.  HINT: This class should inherit from Employee.
const Employee = require("./Employee")

class Intern extends Employee {
    constructor(name, id, school) {
        super(name, id)
        this.name = name;
        this.id = id;
        this.school = school;
        this.role = "Intern"
    }

    getRole() {
        return this.role;
    }

    getSchool() {
        return this.school;
    }
}