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
    userType: new FormControl('user', [Validators.required]),
    position: new FormControl('GK', CustomValidators.conditionalRequired('bank_account', this.company)),
    age: new FormControl('', CustomValidators.conditionalRequired('bank_account', this.company)),
    bank_account: new FormControl('', CustomValidators.conditionalRequired('bank_account', this.company)),
  });

  constructor(
    private titleService: TitleService,
    private navbarService: NavbarService,
    private userService: UserService) {
    this.title = this.titleService.getPageTitle();
  }

  ngOnInit(): void {
    this.registerForm.get('userType')?.valueChanges.subscribe(() => {
      this.company = !this.company;
    });
    this.registerForm.get('bank_account')?.addValidators(validateIBAN)
  }

  registerUser(): void {
    if (this.registerForm.valid) {
      const values = this.registerForm.controls;
      const user: User = {
        email: values.email.value!,
        password: values.password.value!,
        name: values.name.value!,
        position: !this.company ? values.position.value! : undefined,
        age: !this.company ? values.age.value! : undefined,
        bank_account: this.company ? values.bank_account.value! : undefined,
      }
      this.userService.register(user).subscribe({
        next: () => {
          this.activeModal.close();
          this.registerForm.reset();
          const { email, password } = user;
          this.userService.login({ email, password }).subscribe();
        }
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
    if (controls.userType.valid && controls.name.valid) this.steps[1] = true;
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
      console.error('Error al verificar el correo electrónico:', error);
      return false;
    }
  }


  checkRequired(controlName: string): boolean {
    return this.registerForm.get(controlName)!.hasValidator(Validators.required);
  }

}
