import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/shared/custom.validators';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../interfaces/IEmployee';
import { ISkill } from '../interfaces/ISkill';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  pageTitle!: string;
  employeeForm!: FormGroup;
  employee!: IEmployee;
  // all errors
  private validationMessages: {
    [key: string]: {
      [key: string]: string;
    };
  } = {
    fullName: {
      required: 'Full Name is required',
      minlength: 'Full Name must be greater than 2 Characters',
      maxlength: 'Full Name must be less than 13 Characters',
    },
    email: {
      required: 'Email is required',
      emailDomain: 'Email doamin should be nftech.com',
    },
    confirmEmail: {
      required: 'Confirm Email is required',
    },
    emailGroup: {
      emailMismatch: 'Email & Confirm Email do not match',
    },
    phone: {
      required: 'Phone Number is required',
    },
  };

  //only failed validation errors bind to the ui
  formErrors: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    //? form build form controls
    this.employeeForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(12),
        ],
      ],
      contactPref: ['', Validators.required],
      emailGroup: this.fb.group(
        {
          email: [
            '',
            [Validators.required, CustomValidators.emailDomain('nftech.com')],
          ],
          confirmEmail: ['', Validators.required],
        },
        { validators: matchEmail }
      ),
      phone: [''],
      skills: this.fb.array([this.addSkillFormGroup()]),
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPref')?.valueChanges.subscribe((data) => {
      this.onContactPrefChange(data);
    });

    //? get employee id from route
    this.route.paramMap.subscribe((params) => {
      const empID = Number(params.get('id'));
      if (empID) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empID);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: 0,
          fullName: '',
          contactPref: '',
          email: '',
          phone: '',
          skills: [],
        };
      }
    });
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe({
      next: (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      error: (err) => console.log(err),
    });
  }

  editEmployee(employee: IEmployee) {
    //?to bind data in formcontrol use patchValue
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPref: employee.contactPref,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email,
      },
      phone: employee.phone,
    });

    //?to bind data to formArray setcontrol is used
    this.employeeForm.setControl(
      'skills',
      this.setExistingSkills(employee.skills)
    );
  }

  get skillsArr() {
    return <FormArray>this.employeeForm.get('skills');
  }

  //seting existing skills
  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArr = new FormArray([]);
    skillSets.forEach((s) => {
      formArr.push(
        this.fb.group({
          skillName: s.skillName,
          experienceInYears: s.experienceInYears,
          proficiency: s.proficiency,
        })
      );
    });
    return formArr;
  }

  //add new skill btn
  addSkillButtonClick() {
    //typecast the return value as FormArray
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  //to add new skill
  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required],
    });
  }

  //remove a skill
  removeSkillBtnClk(skillGroupIndex: number): void {
    const skillsFormArr = <FormArray>this.employeeForm.get('skills');
    skillsFormArr.removeAt(skillGroupIndex);
    skillsFormArr.markAsDirty();
    skillsFormArr.markAsTouched();
  }

  onContactPrefChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl?.setValidators(Validators.required);
    } else {
      phoneControl?.clearValidators();
    }
    phoneControl?.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key) => {
      const abstactControl = group.get(key);
      this.formErrors[key] = '';

      if (
        abstactControl &&
        !abstactControl.valid &&
        (abstactControl.touched ||
          abstactControl.dirty ||
          abstactControl.value !== '')
      ) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstactControl.errors) {
          if (errorKey) {
            this.formErrors[key] += `${messages[errorKey]} `;
          }
        }
      }
      if (abstactControl instanceof FormGroup) {
        this.logValidationErrors(abstactControl);
      }
      /*       if (abstactControl instanceof FormArray) {
        for (const control of abstactControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }
      } */
    });
  }

  onLoadDataClick(): void {
    //formArray using form bulder
    const formArray = this.fb.array([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required),
    ]);

    console.log(formArray);

    //formGroup using formBuilder
    const formGroup = this.fb.group([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required),
    ]);

    console.log(formGroup);
  }

  onSubmit(): void {
    console.log(this.employee);

    this.mapFormValuesToEmpModel();
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe({
        next: () => this._router.navigate(['employees']),
        error: (err) => console.log(err),
      });
    } else {
      this.employeeService.addEmployee(this.employee).subscribe({
        next: () => this._router.navigate(['employees']),
        error: (err) => console.log(err),
      });
    }
  }

  mapFormValuesToEmpModel() {
    this.employee.fullName = this.employeeForm.value?.fullName;
    this.employee.email = this.employeeForm.value?.emailGroup?.email;
    this.employee.contactPref = this.employeeForm.value?.contactPref;
    this.employee.phone = this.employeeForm.value?.phone;
    this.employee.skills = this.employeeForm.value?.skills;
  }
}

//match two email fields
function matchEmail(group: AbstractControl): ValidationErrors | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (
    emailControl?.value === confirmEmailControl?.value ||
    (confirmEmailControl?.pristine && confirmEmailControl.value === '')
  ) {
    return null;
  } else {
    return { emailMismatch: true };
  }
}
