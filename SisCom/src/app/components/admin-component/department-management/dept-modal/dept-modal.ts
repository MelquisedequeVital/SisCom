import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Department } from '../../../../models/department.model';

@Component({
  selector: 'app-dept-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dept-modal.html'
})
export class DeptModal implements OnInit {
  private fb = inject(FormBuilder);

  public deptToEdit = input<Department | null>(null);
  public onClose = output<void>();
  public onSave = output<Partial<Department>>();

  public deptForm!: FormGroup;
  public isEditing = () => !!this.deptToEdit();

  constructor() {
    effect(() => {
      const dept = this.deptToEdit();
      if (dept && this.deptForm) {
        this.deptForm.patchValue({
          name: dept.name,
          code: dept.code
        });
      }
    });
  }

  ngOnInit(): void {
    this.deptForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });
  }

  public salvar(): void {
    if (this.deptForm.invalid) {
      this.deptForm.markAllAsTouched();
      return;
    }

    const rawValues = this.deptForm.value;
    const deptData: Partial<Department> = {
      name: rawValues.name,
      code: rawValues.code,
      ...(this.isEditing() && { id: this.deptToEdit()?.id })
    };

    this.onSave.emit(deptData);
  }
}
