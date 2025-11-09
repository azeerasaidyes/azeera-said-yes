import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css',
  imports: [ 
    CommonModule,
    FormsModule 
  ],
})
export class InvitationComponent {
  countdown: string | undefined;
  rsvp = {
    name: '',
    attendance: '',
    message: ''
  };
  isSubmitting = false;
  showSuccess = false;
  lastSubmittedName = '';

  showCopySuccess = false;

  ngOnInit() {
    this.setupCountdown();
  }

  setupCountdown() {
    // Set the date we're counting down to
    var countDownDate = new Date("Jan 1, 2026 00:00:00").getTime();

    // Update the count down every 1 second
    var x = setInterval(() => {

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      this.countdown = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        this.countdown = "EXPIRED";
      }
    }, 1000);
  }

  copyBankAccount() {
    const accNo = '123456789';
    
    // Copy the text inside the text field
    navigator.clipboard.writeText(accNo);
  
    // Alert the copied text
    //alert("Copied the text: " + accNo);
    this.showCopySuccess = true;

    // Hide message after 5 seconds
    setTimeout(() => {
      this.showCopySuccess = false;
    }, 3000);
  }

  submitRSVP() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxVyOXCsZ6iogvkJDMyXdM9FTf__hQobLicdwnEx0eifB7lpKazUAr8vAvMIaXwufQ/exec';
    const formData = new FormData();
    formData.append('Name', this.rsvp.name);
    formData.append('Attendance', this.rsvp.attendance);
    formData.append('Message', this.rsvp.message);
  
    this.isSubmitting = true;
    this.showSuccess = false;
  
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => {
        if (response.ok) {
          console.log('Success!', response);
          this.lastSubmittedName = this.rsvp.name;
          this.showSuccess = true;
          this.rsvp = { name: '', attendance: '', message: '' };
          setTimeout(() => this.showSuccess = false, 5000);
        } else {
          console.error('Google script returned error:', response);
          alert('Something went wrong. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error!', error.message);
        alert('Something went wrong. Please try again.');
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }
  
}
