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


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

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

// class specific questions
function engineer() {
    return inquirer
    .prompt([
        {
            name:"github",
            message: "What is the engineers github username?",
         
        }
    ])
}

// class specific questions
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

function replay() {
    check()
    .then(function(confirm) {
        if (confirm.add === true) {
            employee().then(function(employee) {
                const test = employee.type
                switch (test) {
                    case "Manager":
                        manager().then(function(manager) {
                            const newManager = new Manager(employee.name, employee.id, employee.email, manager.officeNum) 
                            teamMember.push(newManager);
                            console.log(teamMember);
                            replay();
                        }) 
                        .catch((err) => {if (err) throw err})
                        break;
                    
                    case "Engineer":
                        engineer().then(function(engineer) {
                            const newEngineer = new Engineer(employee.name, employee.id, employee.email, engineer.github) 
                            teamMember.push(newEngineer);
                            console.log(teamMember);
                            replay();
                        }) 
                        .catch((err) => {if (err) throw err})
                        break;

                    case "Intern":
                        intern().then(function(intern) {
                            const newIntern = new Intern(employee.name, employee.id, employee.email, intern.school) 
                            teamMember.push(newIntern);
                            console.log(teamMember);
                            replay();
                        }) 
                        .catch((err) => {if (err) throw err})
                        break;

                    default:
                        break;
                }
            }).catch((err) => {if (err) throw err})   
        } else {
            checkAndCreate();
        }
    })
}

replay()
