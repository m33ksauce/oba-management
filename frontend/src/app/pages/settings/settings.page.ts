import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private _unsubscribeAll: Subject<any>;

  currentTranslation: any;

  formSubmitting = false;

  activeEmail: any;

  translationList = [];

  isSettings = true;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService) {
    this._unsubscribeAll = new Subject();
    this.activeEmail = this.authService.currentUser.email;
    this.translationList = this.authService.currentUser.available_translations;
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe((params: ParamMap) => {
      this.currentTranslation = params.get('translation');
    });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
