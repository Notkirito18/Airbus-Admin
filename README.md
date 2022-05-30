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

## The files

The fiels of this project are structured according to angular's [Workspace and project file structure](https://angular.io/guide/file-structure).

## Pages/Componants

Each page or componants has a folder to it's name containing 4 files responsoble for the content, styling and functionality of that page or componant, and you can find these folders in **src/app/pages** and **src/app/componants**

## Services

In the directory **src/shared** you can find 3 service's folders.

- **auth service** A service with functions resposible for logging in and logging out and registering users
- **guets service** A service with functions resposible for creating, editing and deleting guests from the database as well as consuming, unvalidating the vouchers.
- **records service** A service with functions resposible for creating, editing and deleting records from the database.


## helper.ts and models.ts

In the directory **src/shared** you can find the two files **helper.ts** and **models.ts**, And in helper.ts file there are a few functions that are used across the entire app that help with certain functionalities. On the other hand, models.ts is where I'm defining all the object structueres that are used across the app (like the Guests Records for example)

## Guards

In the directory **src/shared/guards** there are two files that act like guards for specific routes.

- **auth guard** protect the routes that require logged in user to visit.
- **super user guard** protect the routes that require an admin account to be logged in to visit.
