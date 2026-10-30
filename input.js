class Input {
    static validate(thisContext) {
        const value = thisContext.value;
        const min = thisContext.minlength;
        const max = thisContext.maxlength;
        const state = { isValid: false };

        if (thisContext.required && value.trim() === "") {
            state.errormessage = "This field is required";
        }

        else if (value.length < min) {
            state.errormessage = `The value must be longer than ${min} characters`;
        }

        else if (value.length > max) {
            state.errormessage = `The value must be shorter than ${max} characters`;
        }

        else {
            state.isValid = true;
            state.errormessage = "";
        }

        return state;
    }

    constructor(init = {}) {
        let minlength = null;
        let maxlength = null;

        function string(value) {
            const type = typeof value === "string";
            return type ? value.trim() : "";
        }

        function min(value) {
            value = Number(value);

            minlength = Number.isSafeInteger(value) && value >= 0
                ? value
                : 0;

            return minlength;
        }

        function max(value) {
            value = Number(value);

            if (Number.isSafeInteger(value) && value > minlength) {
                return maxlength = value;
            }

            return maxlength =
                minlength < Number.MAX_SAFE_INTEGER
                    ? Number.MAX_SAFE_INTEGER
                    : Infinity;
        }

        const rules = {
            name: string,
            type: string,
            value: string,
            minlength: min,
            maxlength: max,
            required: (value) => value === true,
            errormessage: string
        }

        for (const prop in rules) {
            const normalize = rules[prop];
            this[prop] = normalize(init[prop]);
        }
    }
}

export class TextInput extends Input {
    constructor(init = {}) {
        super(init);
        this.type = "text";
    }

    validate() {
        return Input.validate(this);
    }
}

export class TextAreaInput extends TextInput {
    constructor(init = {}){
        super(init);
        this.type = "textarea";
    }
}

export class EmailInput extends Input {
    constructor(init = {}) {
        super(init);
        this.type = "email";
    }

    validate() {
        const status = Input.validate(this);

        if (status.isValid) {
            const email = this.value;
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!pattern.test(email)) {
                status.isValid = false;
                status.errormessage = this.errormessage;
            }
        }

        return status;
    }
}

export class RadioInput extends Input {
    constructor(init = {}){
        super(init);
        this.type = "radio";
        this.minlength = 0;
        this.maxlength = Number.MAX_SAFE_INTEGER;
    }

    validate() {
        return Input.validate(this);
    }
}

export class CheckBoxInput extends Input {
    constructor(init = {}){
        super(init);
        this.type = "checkbox";
        this.minlength = 0;
        this.maxlength = Number.MAX_SAFE_INTEGER;
    }
    
    validate(){
        const status = { isValid: false };
        
        if (this.required && (!(this.value !== "off") || this.value.trim() === "")) {
            status.errormessage = this.errormessage.length > 0
                ? this.errormessage
                : "Invalid";
        }

        else {
            status.isValid = true;
            status.errormessage = "";
        }

        return status;
    }
}