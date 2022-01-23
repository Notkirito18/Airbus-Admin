# VouchyQR

## Video Demo: https://youtu.be/gJ2ESV8JAkw

## Description

    The goal of VouchyQR is to make voucher system easier for hotels using QR codes, by making the process of getting ones vouchers possible with one qr code scan, and so is consuming a voucher wich is possible by just showing a code to be scanned. And for this process to work, the app has three types of users, an Admin (requires log in + not all logged in users are admins), a Vender (requires log in) and a Geust (doesn't require log in). The admin creates a new guest and give the guest a QR code to scan that will take him to his page, where he can see all his vouchers as QR codes and can also see his history of vouchers usage. To use a voucher, the guest can go to the vender and show him one of the vouchers QR codes, the vender than scans it to consume the voucher (if the voucher is expired or the vender is not logged in the consuming wont work).

## The Admins

    Admins are users who's accounts have access to more powerfull features, the admin can create, delete and edit guests, he can also see the records of all usage and can get those records as a PDF file (wich is usefull because the hotel may needs these records) and can also clear these records. (the admin should also be able to register a new vender or a new admin but i haven't implemented this feature yet)

## The Venders

    Venders are users with regular accounts, the can see information about all the guests and their voucher's + all the records, but they can't create, delete or edit the guest's information, the goal of the venders is to be able to consume vouchers by either scanning a voucher's QR code or putting the voucher id in an input field.

## The Guests

    Guests doesn't need to have an account or login, the admin can create a guest and give him a number of vouchers, the guest then will have access to these vouchers on his page (the guest should need to enter a pin code that the admin gives him when creating his page but this feature hasn't been implemented yet) and the guest can also see his history of vouchers usage.

# How it works

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.2. I used [Angular Materials](https://material.angular.io/) library for styling and other libraries to add some features ( [easyqrcodejs](https://www.npmjs.com/package/easyqrcodejs) for QR codes implementations and [pdfmake](https://www.npmjs.com/package/pdfmake) for making pdf files).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## The files

The fiels of this project are structured according to angular's [Workspace and project file structure](https://angular.io/guide/file-structure).

## Pages/Componants

Each page or componants has a folder to it's name containing 4 files responsoble for the content, styling and functionality of that page or componant, and you can find these folders in **src/app/pages** and **src/app/componants**

## Services

In the directory **src/shared** you can find 4 service's folders.

- **storage service** wich has functions resposible for creating, editing and deleting guests from the database.
- **records service** wich has a subject that's resonsible for manipulating the records.
- **vouchers service** wich has functions resposible for generating, consuming, unvalidating the vouchers and updating the database with the new state of the vouchers.
- **auth service** wich has functions resposible for logging in and logging out and registering users

## helper.ts and models.ts

In the directory **src/shared** you can find the two files **helper.ts** and **models.ts**, And in helper.ts file there are a few functions that are used across the entire app that help with certen functionalities. On the other hand models.ts is where i'm defining all the object structueres that are used across the entire app (like the Guest object and the Voucher object for example)

## Guards

In the directory **src/shared/guards** there are two files that act like guards for specific routes.

- **auth guard** protect the routes that require logged in user to visit.
- **super user guard** protect the routes that require an admin account to be logged in to visit.

## Database and Hosting

I used firebase's realtime database to take care of the data of this project. and i also used there free hosting feature to host this web app on this url : https://airbus-900f9.web.app/
