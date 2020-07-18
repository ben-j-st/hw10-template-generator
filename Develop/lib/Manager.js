// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.
const Employee = require("./Employee") 

class Manager extends Employee {
    constructor(name, id, officeId) {
        super(name, id)
        this.name = name;
        this.id = id;
        this.officeId = officeId;
        this.role = "Manager"
    }

    getOffice() {
        return this.office
    }

    getRole() {
        return this.role
    }
}