import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatAnchor, 
    RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {

}
