import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AvailbleCarForRentComponent } from './availble-car-for-rent/availble-car-for-rent.component';
import { BookedCarsComponent } from './booked-cars/booked-cars.component';
import { BookingStatusComponent } from './booking-status/booking-status.component';
import { SelectedRentCarDetailsComponent } from './selected-rent-car-details/selected-rent-car-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModuleModule } from '../shared/shared-module.module';
import { RouterModule } from '@angular/router'
import { EnterShowroomDetailsComponent } from '../admin-showroom-side/enter-showroom-details/enter-showroom-details.component';
import { CarUploadPageComponent } from '../admin-showroom-side/car-upload-page/car-upload-page.component';
import { OrderdCarDetailsComponent } from '../admin-showroom-side/orderd-car-details/orderd-car-details.component';
import { EditShowCarDetailsComponent } from '../admin-showroom-side/edit-show-car-details/edit-show-car-details.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { ProfileSectionComponent } from '../shared/pages/profile-section/profile-section.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ContentComponent } from '../shared/pages/content/content.component';

@NgModule({
  declarations: [
    HomeComponent,
    AvailbleCarForRentComponent,
    SelectedRentCarDetailsComponent,
    BookedCarsComponent,
    BookingStatusComponent,
    DashboardComponent,
    EnterShowroomDetailsComponent,
    CarUploadPageComponent,
    OrderdCarDetailsComponent,
    EditShowCarDetailsComponent,
    ProfileSectionComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModuleModule,
    RouterModule.forChild([
      {
        path: '', component: HomeComponent,
        children: [
          {
            path: '',
            component: DashboardComponent
          },
          {
            path: 'booked-car-list',
            component: BookedCarsComponent,
            data: {
              routType: false,
              isUserBooking: true
            }
            },
          { path: 'my-orders/:showroomId', component: BookedCarsComponent, data: { routType: true } },

          {
            path: 'favorites',
            component: BookedCarsComponent,
            data: {

              isFavorite: true
            }
          },
          {
            path: 'showroom-booked-car-list',
            component: BookedCarsComponent,
            data: {
              routType: true,
              isUserBooking: true
            }
          },
          {
            path: 'enter-showroom-details',
            component: EnterShowroomDetailsComponent
          },
          {
            path: 'my-showroom',
            component: EnterShowroomDetailsComponent,
            data: {
              edit: 'true'
            }
          },
          {
            path: 'edit-car-details',
            component: EditShowCarDetailsComponent,
            data: {
              type: 'edit'
            }
          },
          {
            path: 'car-details/:mode/:id',
            component: EditShowCarDetailsComponent,
            data: {
              type: "view"
            }
          },
        ]
      },
      {
        path: 'availble-car-for-rent', component: AvailbleCarForRentComponent,
        data: {
          availCar: true,
          carForRent: true,
          isShowroom: false,
          pageTitle: 'Available Cars'
        }
      },
      {
        path: 'content/privacy-policy',
        component: ContentComponent,
        data: {
          title: 'Privacy Policy',
          key: 'privacy_policy'
        }
      },
      {
        path: 'content/terms-conditions',
        component: ContentComponent,
        data: {
          title: 'Terms & Conditions',
          key: 'terms_and_condition'
        }
      },
      {
        path: 'content/how-it-works',
        component: ContentComponent,
        data: {
          title: 'How It Works',
          key: 'how_it_works'
        }
      },
      {
        path: 'content/featured',
        component: ContentComponent,
        data: {
          title: 'Featured',
          key: 'featured'
        }
      },
      {
        path: 'content/partnership',
        component: ContentComponent,
        data: {
          title: 'Partnership',
          key: 'partnership'
        }
      },
      {
        path: 'content/business-relation',
        component: ContentComponent,
        data: {
          title: 'Business Relation',
          key: 'business_relation'
        }
      },
      {
        path: 'content/events',
        component: ContentComponent,
        data: {
          title: 'Event',
          key: 'events'
        }
      },
      {
        path: 'content/blogs',
        component: ContentComponent,
        data: {
          title: 'Blogs',
          key: 'blogs'
        }
      },
      {
        path: 'content/podcast',
        component: ContentComponent,
        data: {
          title: 'Podcast',
          key: 'podcast'
        }
      },
      {
        path: 'selected-car-details/:type/:id/:action',
        component: SelectedRentCarDetailsComponent
      },
      {
        path: 'booking-status-for-car-rent',
        component: BookingStatusComponent,
        data: {
          pageType: 'car-rent'
        }
      },
      {
        path: 'booking-status-for-car-upload',
        component: BookingStatusComponent,
        data: {
          pageType: 'car-upload'
        }
      },
      {
        path: 'add-upload-car-details',
        component: CarUploadPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'add-upload-car-details/:carId/:isEditable',
        component: CarUploadPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'orderd-car-details',
        component: OrderdCarDetailsComponent
      },
      { path: 'my-profile',
        component: ProfileSectionComponent,
        canActivate: [AuthGuard]
      },
      { path: 'notifications',
        component: NotificationsComponent,
        canActivate: [AuthGuard]
      },
    ])
  ],
  exports: [
    SharedModuleModule
  ]
})
export class UserSideMoudleModule { }
