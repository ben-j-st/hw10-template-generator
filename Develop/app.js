const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMember = [];

// used for default in case of id
let idDefault = 1000;

// check function for confirming if user wants to add team members 
function check() {
   return inquirer
    .prompt([
        {
            name:"add",
            type: "confirm",
            message: "Would you like to add an Employee?",
        }
    ])
}
// questions specific to the employee class
function employee() {
    idDefault++
    return inquirer
    .prompt([
        {
            name: "type",
            type:"list",
            message: "What kind of Employee would you like to add?",
            choices: [
                "Manager",
                "Engineer",
                "Intern",
            ]
        },
        {
            name:"name",
            message: "What is the employees name?",
         
        },
        {
            name:"id",
            message: "What is the employees id?",
            default: `${idDefault}`,
         
        },
        {
            name:"email",
            message: "What is the employees email?",
         
        }
    ])
}

// class specific questions
function manager() {
    return inquirer
    .prompt([
        {
            name:"officeNum",
            message: "What is the managers office number?",
        }
    ])
}

function engineer() {
    return inquirer
    .prompt([
        {
            name:"github",
            message: "What is the engineers github username?",
         
        }
    ])
}

function intern() {
    return inquirer
    .prompt([
        {
            name:"school",
            message: "What school did the intern attend?",
        }
    ])
}

// function for created dir
function makeDir(dir) {
    return new Promise((resolve, reject) => {
        //  creates the outpath directory, recursive prevents an error when the dir you are creating already exists
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                reject(err)
            } else {
                console.log("directory was created successfully")
                resolve(dir)
            }
        });
    })
}

// function that runs render and writes a new html file
function writeFile(html) {
    return new Promise((resolve, reject) => {
        // write members to file 
        fs.writeFile(outputPath, html, "utf8", (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("File was created successfully")
                resolve(html)
            }
        })
    })
}

// function to check if array has anything in it. and hold creation functions
function checkAndCreate() {
    if (teamMember.length != 0) {
        console.log("team member length worked like expected")

        //call function to make directory
        makeDir(OUTPUT_DIR)

        //call write file function, passing in the render function and team member array 
        writeFile(render(teamMember));
       
    } else {
        console.log("rendered did not work like expected")
    }
}

// function to be called on loop until enough members are added
function replay() {
    check()
    .then(function(confirm) {
        //run if statment to check if user wants more team members, if not run checkAndCreate
        if (confirm.add === true) {
            //first ask the employee questions
            employee().then(function(employee) {
                // storage variable for holding the type of employee
                const test = employee.type
                //switch to test what code needs to run depending on employee type
                switch (test) {
                    case "Manager":
                        // runs the manager specific questions and then creates a new instance of the manager class to populate
                        manager().then(function(manager) {
                            const newManager = new Manager(employee.name, employee.id, employee.email, manager.officeNum) 
                            teamMember.push(newManager);
                            // starts the loop again
                            replay();
                        }) 
                        .catch((err) => {if (err) throw err})
                        break;
                    
                    case "Engineer":
                        engineer().then(function(engineer) {
                            const newEngineer = new Engineer(employee.name, employee.id, employee.email, engineer.github) 
                            teamMember.push(newEngineer);
                            replay();
                        }) 
                        .catch((err) => {if (err) throw err})
                        break;

                    case "Intern":
                        intern().then(function(intern) {
                            const newIntern = new Intern(employee.name, employee.id, employee.email, intern.school) 
                            teamMember.push(newIntern);
                            replay();
                        }) 
                        .catch((err) => {if (err) throw err})
                        break;

                    default:
                        break;
                }
            }).catch((err) => {if (err) throw err})   
        } else {
            // runs only when the user 
            checkAndCreate();
        }
    })
}

replay()
