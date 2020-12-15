let isUpdate = false;
let empPayrollObj = {};

class EmployeePayrollData {

    get name() { return this._name; }
    set name(name) {
        let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
        if (nameRegex.test(name)) {
            this._name = name;
        }
        else throw 'Name is incorrect!';
    }

    get id() { return this._id; }
    set id(id) {
        this._id = id;
    }

    get salary() { return this._salary; }
    set salary(salary) {
        this._salary = salary;
    }

    get startDate() { return this._startDate; }
    set startDate(startDate) {
        let now = new Date();
        if (startDate > now)
            throw "Start Date cannot be a future date";
        let diff = Math.abs(now.getTime() - startDate.getTime());
        if (diff / (1000 * 60 * 60 * 24) > 30)
            throw "Start date is beyond 30 days";
        this._startDate = startDate;
    }

    get profilePic() { return this._profilePic; }
    set profilePic(profilePic) {
        this._profilePic = profilePic;
    }
    get gender() { return this._gender; }
    set gender(gender) {
        this._gender = gender;
    }
    get department() { return this._department; }
    set department(department) {
        this._department = department;
    }

    get notes() { return this._notes; }
    set notes(notes) {
        this._notes = notes;
    }

    toString() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const empDate = this.startDate === undefined ? "undefined" :
            (new Date(this.startDate)).toLocaleDateString("en-US", options);
        return "id = " + this.id + ", name = " + this.name + ", gender = " + this.gender +
            ", salary = " + this.salary + ", ProfilePic = " + this.profilePic + ", department = " + this.department +
            ", start date = " + this.startDate + ", Notes = " + this.notes;
    }
}
window.addEventListener('DOMContentLoaded', () => {

    const name = document.querySelector('#name');
    name.addEventListener('input', function () {
        if (name.value.length == 0 || name.value == null) {
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;
            setTextValue('.text-error', '');
        } catch (e) {
            setTextValue('.text-error', e);
        }
    });
    const date = document.querySelector('#date');
    date.addEventListener('input', function () {
        let startDate = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
        try {
            (new EmployeePayrollData()).startDate = new Date(Date.parse(startDate));
            setTextValue('.date-error', '');
        } catch (e) {
            setTextValue('.date-error', e);
        }
    });
    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });
    checkForUpdate();
});
const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        setEmployeePayrollObject();
        createAndUpdateStorage();
        resetForm();
        window.location.replace("../pages/homePage.html");
    } catch (e) {
        console.log(e);
        return;
    }

}
const setEmployeePayrollObject = () => {
    empPayrollObj._name = getInputValueById('#name');
    empPayrollObj._profilePic = getSelectedValues('[name = profile]').pop();
    empPayrollObj._gender = getSelectedValues('[name = gender]').pop();
    empPayrollObj._department = getSelectedValues('[name = department]');
    empPayrollObj._salary = getInputValueById('#salary');
    empPayrollObj._notes = getInputValueById('#notes');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + ' ' + getInputValueById('#year');
    empPayrollObj._startDate = date;
}
const createAndUpdateStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList) {
        let empPayrollData = employeePayrollList.find(empData => empData._id == empPayrollObj._id)
        if (!empPayrollData) {
            employeePayrollList.push(createEmployeePayrollData());
        } else {
            const index = employeePayrollList.map(empData => empData._id).indexOf(empPayrollData._id);
            employeePayrollList.splice(index, 1, createEmployeePayrollData(empPayrollData._id));
        }
    } else {
        employeePayrollList = [createEmployeePayrollData()];
    }
    // alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}
const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData) => {

    try {
        employeePayrollData.name = getInputValueById('#name');
    }
    catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }

    employeePayrollData.profilePic = empPayrollObj._profilePic;
    employeePayrollData.gender = empPayrollObj._gender;
    employeePayrollData.department = empPayrollObj._department;
    employeePayrollData.salary = empPayrollObj._salary;
    employeePayrollData.notes = empPayrollObj._notes;
    try {
        employeePayrollData.startDate = new Date(Date.parse(empPayrollObj._startDate));
    } catch (e) {
        setTextValue('.date-error', e);
        throw e;
    }
    alert(employeePayrollData.toString());
}
const createNewEmployeeId = () => {
    let empID = localStorage.getItem('EmployeeID');
    empID = !empID ? 1 : (parseInt(empID) + 1).toString();
    localStorage.setItem('EmployeeID', empID);
    return empID;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if (item.checked) selItems.push(item.value);
    });
    return selItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getInputElementValue = (id) => {
    let value = document.getElementById(id).value;
    return value;
}

const setForm = () => {
    setValue('#name', empPayrollObj._name);
    setSelectedValues('[name = profile]', empPayrollObj._profilePic);
    setSelectedValues('[name = gender]', empPayrollObj._gender);
    setSelectedValues('[name = department]', empPayrollObj._department);
    setValue('#salary', empPayrollObj._salary);
    setTextValue('.salary-output', empPayrollObj._salary);
    setValue('#notes', empPayrollObj._notes);
    let date = stringifyDate(empPayrollObj._startDate).split(/[\s,]+/);
    setValue('#day', date[1]);
    setValue('#month', date[0]);
    setValue('#year', date[2]);
}

const setSelectedValues = (propertyValue, value) => {

    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        else if (item.value == value)
            item.checked = true;
    });
}
const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name = gender');
    unsetSelectedValues('[name = department');
    unsetSelectedValues('[name = profile');
    setValue('#salary', '');
    setValue('#day', 0);
    setValue('#month', 0);
    setValue('#year', 0);
    setValue('#notes', '');
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}
const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}

checkForUpdate = () => {
    const empPayrollJson = localStorage.getItem('editEmp');
    isUpdate = empPayrollJson ? true : false;
    if (!isUpdate) return;
    empPayrollObj = JSON.parse(empPayrollJson);
    setForm();
}
