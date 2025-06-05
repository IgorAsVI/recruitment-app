
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CandidateService } from '../services/candidate.service';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  candidateId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      // Basic info (some might be read-only or pre-filled from registration)
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      linkedin: [''],
      // Detailed sections
      experiences: this.fb.array([]),
      education: this.fb.array([]),
      skills: this.fb.array([]),
      // Reserve candidate section
      is_reserve: [false],
      interests: this.fb.array([]) // Array for future interests
    });

    this.loadProfileData();
  }

  loadProfileData(): void {
    this.loading = true;
    this.candidateService.getCurrentCandidateProfile().pipe(first()).subscribe({
      next: (profile) => {
        if (profile) {
          this.candidateId = profile.id;
          this.profileForm.patchValue({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            linkedin: profile.linkedin,
            is_reserve: profile.is_reserve || false
          });

          // Patch FormArrays
          profile.experiences?.forEach((exp: any) => this.experiences.push(this.createExperienceGroup(exp)));
          profile.education?.forEach((edu: any) => this.education.push(this.createEducationGroup(edu)));
          profile.skills?.forEach((skill: string) => this.skills.push(this.fb.control(skill, Validators.required)));
          profile.interests?.forEach((interest: string) => this.interests.push(this.fb.control(interest, Validators.required)));

        } else {
          this.errorMessage = 'Não foi possível carregar o perfil.';
          // Maybe redirect to login if profile is null and user should be logged in
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar o perfil.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  // --- Experiences FormArray --- //
  get experiences(): FormArray {
    return this.profileForm.get('experiences') as FormArray;
  }

  createExperienceGroup(exp: any = { company: '', role: '', years: null }): FormGroup {
    return this.fb.group({
      company: [exp.company, Validators.required],
      role: [exp.role, Validators.required],
      years: [exp.years, [Validators.required, Validators.min(0)]]
    });
  }

  addExperience(): void {
    this.experiences.push(this.createExperienceGroup());
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  // --- Education FormArray --- //
  get education(): FormArray {
    return this.profileForm.get('education') as FormArray;
  }

  createEducationGroup(edu: any = { institution: '', course: '', level: '' }): FormGroup {
    return this.fb.group({
      institution: [edu.institution, Validators.required],
      course: [edu.course, Validators.required],
      level: [edu.level, Validators.required] // e.g., Licenciatura, Mestrado, Curso Técnico
    });
  }

  addEducation(): void {
    this.education.push(this.createEducationGroup());
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  // --- Skills FormArray --- //
  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

   // --- Interests FormArray (for reserve candidates) --- //
   get interests(): FormArray {
    return this.profileForm.get('interests') as FormArray;
  }

  addInterest(): void {
    this.interests.push(this.fb.control('', Validators.required));
  }

  removeInterest(index: number): void {
    this.interests.removeAt(index);
  }

  // --- Form Submission --- //
  get f() { return this.profileForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.profileForm.invalid) {
       this.errorMessage = 'Por favor, corrija os erros no formulário.';
      return;
    }

    this.loading = true;
    const profileData = { ...this.profileForm.value, id: this.candidateId }; // Ensure ID is included if needed by API/service

    this.candidateService.updateCandidateProfile(profileData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.successMessage = 'Perfil atualizado com sucesso!';
          this.loading = false;
          this.submitted = false; // Reset submitted state
          // Optionally reload data or just show success message
        },
        error: (err) => {
          this.errorMessage = 'Falha ao atualizar o perfil. Tente novamente.';
          console.error(err);
          this.loading = false;
        }
      });
  }
}

