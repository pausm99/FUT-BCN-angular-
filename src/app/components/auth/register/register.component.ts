import { CustomValidators } from './../../../validators/custom.validator';
import { Component, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TitleService } from '../../../services/title/title.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../interfaces/user';
import { firstValueFrom } from 'rxjs';
import { validateIBAN } from 'ngx-iban-validator';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  activeModal = inject(NgbActiveModal);
  public title!: string;

  public company: boolean = false;

  public duplicatedEmail: boolean = false;

  public steps: boolean[] = [false, false];

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(256)]),
    password: new FormControl('', [Validators.required, CustomValidators.passwordValidator]),
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    userRole: new FormControl('player', [Validators.required]),
    position: new FormControl('GK', CustomValidators.conditionalRequired('position', this.company)),
    age: new FormControl('', [Validators.max(100), Validators.min(14), CustomValidators.conditionalRequired('age', this.company)]),
    bank_account: new FormControl('', CustomValidators.conditionalRequired('bank_account', this.company)),
    phone: new FormControl(null, [Validators.minLength(9), Validators.maxLength(9), CustomValidators.conditionalRequired('phone', this.company)])
  });

  constructor(
    private titleService: TitleService,
    private navbarService: NavbarService,
    private toastService: ToastService,
    private userService: UserService) {
    this.title = this.titleService.getPageTitle();
  }

  ngOnInit(): void {
    this.registerForm.get('userRole')?.valueChanges.subscribe(() => {
      this.company = !this.company;
      const isCompany = this.registerForm.get('userRole')?.value === 'company';

      const positionControl = this.registerForm.get('position');
      const ageControl = this.registerForm.get('age');
      const bankAccountControl = this.registerForm.get('bank_account');
      const phoneControl = this.registerForm.get('phone');

      if (isCompany) {
        positionControl?.clearValidators();
        ageControl?.clearValidators();
        bankAccountControl?.setValidators([CustomValidators.conditionalRequired('bank_account', this.company), validateIBAN]);
        phoneControl?.setValidators([Validators.minLength(9), Validators.maxLength(9), CustomValidators.conditionalRequired('phone', this.company)]);
      } else {
        bankAccountControl?.clearValidators();
        phoneControl?.clearValidators();
        positionControl?.setValidators([CustomValidators.conditionalRequired('position', this.company)]);
        ageControl?.setValidators([Validators.max(100), Validators.min(14), CustomValidators.conditionalRequired('age', this.company)]);
      }

      positionControl?.updateValueAndValidity();
      ageControl?.updateValueAndValidity();
      bankAccountControl?.updateValueAndValidity();
      phoneControl?.updateValueAndValidity();
    });
  }

  registerUser(): void {
    if (this.registerForm.valid) {
      const values = this.registerForm.controls;
      const user: User = {
        email: values.email.value!,
        password: values.password.value!,
        name: values.name.value!,
        role: values.userRole.value!,
        position: !this.company ? values.position.value! : undefined,
        age: !this.company ? values.age.value! : undefined,
        bank_account: this.company ? values.bank_account.value! : undefined,
        phone: this.company ? values.phone.value! : undefined
      }
      this.userService.register(user).subscribe({
        next: () => {
          this.toastService.showSuccess('User registered successfully')
          this.activeModal.close();
          this.registerForm.reset();
          const { email, password } = user;
          this.userService.login({ email, password }).subscribe();
        },
        error: () => this.toastService.showDanger('Failed to register user')
      })
    }
  }

  async firstStepCompleted(): Promise<void> {
    const controls = this.registerForm.controls;
    let duplicated = await this.checkDuplicatedEmail(controls.email.value!);
    if (controls.email.valid && !duplicated) {
      if (controls.password.valid) this.steps[0] = true;
    }
  }

  secondStepCompleted(): void {
    const controls = this.registerForm.controls;
    if (controls.userRole.valid && controls.name.valid) this.steps[1] = true;
  }

  stepBack(i: number): void {
    this.steps[i] = false;
  }

  openLogIn(): void {
    this.activeModal.close();
    this.navbarService.openModal('login');
  }

  // return true if email duplicated
  async checkDuplicatedEmail(email: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(this.userService.getUserByEmail(email));
      this.duplicatedEmail = res.isDuplicated;
      return this.duplicatedEmail;
    } catch (error) {
      return false;
    }
  }


  checkRequired(controlName: string): boolean {
    return this.registerForm.get(controlName)!.hasValidator(Validators.required);
  }

}
