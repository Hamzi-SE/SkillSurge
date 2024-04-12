# SkillSurge - An online subscription based course platform

## Features

- Responsive UI built with Chakra UI
- Authentication and Authorization
- Protection of sensitive routes
- Forget password functionality
- Reset password functionality
- Cloudinary for images hosting
- Mailtrap for email testing
- Stripe subscription integration

- Built with JavaScript
- Chakra UI
- Icons from React-icons
- Charts using Chart.js
- Animations using Framer-motion
- State management using Redux
- Node-cron for cron job
- Separate admin dashboard

## Requirements

- Node.js v18.xx.x
- npm greater than 9.x.x

## Environment Variables

To run this project, you will need to add the following environment variables in the skillsurgeserver/config/config.env file

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_TIME`
- `COOKIE_EXPIRES_TIME`
- `FRONTEND_URL`
- `SMTP_SERVICE`
- `SMTP_MAIL`
- `SMTP_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`

## Quick start

- `npm install`
- `npm run dev`

## SkillSurgeServer File Structure

Within the download you'll find the following directories and files:

```
skillsurgeserver
.
├── app.js
├── package.json
├── README.md
├── server.js
├── config
│   ├── config.env
│   └── database.js
├── controllers
│   ├── courseController.js
│   └── otherController.js
│   └── paymentController.js
│   └── userController.js
├── middlewares
│   ├── auth.js
│   ├── catchAsyncError.js
│   └── Error.js
│   └── multer.js
├── models
│   └── Course.js
│   └── Stats.js
│   └── User.js
├── routes
│   ├── courseRoutes.js
│   ├── otherRoutes.js
│   ├── paymentRoutes.js
│   └── userRoutes.js
└─── utils
    ├── ErrorHandler.js
    ├── dataUri.js
    ├── sendEmail.js
    └── sendToken.js
```


The SkillSurge frontend was bootstrapped with Create React App.


## Feedback

If you have any feedback, please reach out to me at hamzii.se@gmail.com

## License

[MIT](https://choosealicense.com/licenses/mit/)
