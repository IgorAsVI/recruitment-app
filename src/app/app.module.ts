
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules (for AppComponent)
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import Core Services if needed globally (e.g., AuthService)
// import { AuthService } from './core/services/auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Add BrowserAnimationsModule
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule, // Keep if needed by root components or globally
    // Material Modules for AppComponent
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    // Provide global services here if necessary
    // AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

