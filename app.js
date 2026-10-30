import {
    TextInput,
    TextAreaInput,
    EmailInput,
    RadioInput,
    CheckBoxInput
} from "./input.js";

const fields = {};

fields.firstName = new TextInput({
    name: "firstName",
    maxlength: 50,
    required: true
});

fields.lastName = new TextInput({
    name: "lastName",
    maxlength: 50,
    required: true
});

fields.email = new EmailInput({
    name: "email",
    required: true,
    errormessage: "Please enter a valid email address"
});

fields.queryType = new RadioInput({
    name: "queryType",
    required: true,
    errormessage: "Please select a query type"
});

fields.message = new TextAreaInput({
    name: "message",
    minlength: 50,
    maxlength: 2000,
    required: true,
});

fields.consent = new CheckBoxInput({
    name: "consent",
    required: true,
    errormessage: "To submit this form, please consent to being contacted"
});

const form = document.getElementById("form");
const inputs = document.querySelectorAll(".data");
const success = document.getElementById("success");

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

Array.from(inputs).forEach(el => {
    const target = el.getAttribute("name");
    const error = document.getElementById(el.getAttribute("aria-describedby"));

    el.addEventListener("input", debounce(() => {
        const field = fields[target];
        field.value = el.value;
        const status = field.validate();
        el.setAttribute("aria-invalid", !status.isValid)
    }, 1000));
});

form.addEventListener("submit", function(event){
    event.preventDefault();
    const data = new FormData(this);
    const errorstack = [];
    for (const name in fields) {
        const field = fields[name];
        const input = this.querySelector(`[name="${name}"]`);
        const error = document.getElementById(
            input.getAttribute("aria-describedby")
        );

        field.value = data.get(name) || "";
        const status = field.validate();
        input.setAttribute("aria-invalid", !status.isValid)
        error.textContent = status.errormessage;

        if (status.isValid === false) errorstack.push(status);
    }

    if (errorstack.length === 0) success.style = "display: block;"
});