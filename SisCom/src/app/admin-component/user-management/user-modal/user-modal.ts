import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Department } from '../../../models/department.model';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-modal.html'
})
export class UserModal implements OnInit {
  private fb = inject(FormBuilder);

  public userToEdit = input<User | null>(null);
  public departments = input.required<Department[]>();

  public onClose = output<void>();
  public onSave = output<Partial<User>>();

  public userForm!: FormGroup;
  
  public isEditing = () => !!this.userToEdit();

  constructor() {
    effect(() => {
      const user = this.userToEdit();
      if (user && this.userForm) {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          departmentId: user.department.id,
          isAdmin: user.isAdmin,
          isManager: user.isManager,
          active: user.active
        });
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      departmentId: ['', [Validators.required]],
      isAdmin: [false],
      isManager: [false],
      active: [true]
    });
  }

  public salvar(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const rawValues = this.userForm.value;
    const selectedDept = this.departments().find(d => d.id === rawValues.departmentId);

    const userData: Partial<User> = {
      name: rawValues.name,
      email: rawValues.email,
      phone: rawValues.phone,
      isAdmin: rawValues.isAdmin,
      isManager: rawValues.isManager,
      active: rawValues.active,
      department: selectedDept,
      ...(this.isEditing() && { id: this.userToEdit()?.id })
    };

    this.onSave.emit(userData);
  }
}