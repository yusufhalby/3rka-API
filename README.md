[![GitHub stars](https://img.shields.io/github/stars/yusufhalby/3rka-API)](https://github.com/yusufhalby/3rka-API)
[![GitHub forks](https://img.shields.io/github/forks/yusufhalby/3rka-API)](https://github.com/yusufhalby/3rka-API)
[![GitHub license](https://img.shields.io/github/license/yusufhalby/3rka-API)](https://github.com/yusufhalby/3rka-API)

<img src="/3rka_logo.png" alt="Project Logo" width="200">

# 3rka API - Express.js RESTful API for Men Fight Booking

**Disclaimer: This program is made for fun and entertainment purposes only. It does not endorse or support any form of violence, harm, or illegal activities.**




This is a RESTful API built with Express.js that allows users to book and manage men fights. The API is based on an existing simple PHP app created by [Mohamed Saady](https://github.com/0xSaady407/3rka), and it duplicates the functionality while enhancing security and performance. It uses stateless sessions implemented via JSON Web Tokens (JWT) and includes both user and admin endpoints.



## Table of Contents

- [Features](#features)

- [Getting Started](#getting-started)

- [Endpoints](#endpoints)

- [User Endpoints](#user-endpoints)

- [Admin Endpoints](#admin-endpoints)

- [Environment Variables](#environment-variables)

- [Dependencies](#dependencies)

- [Installation](#installation)

- [Usage](#usage)

- [Contributing](#contributing)

- [License](#license)

  

## Features

  

- User registration and profile creation

- Booking men fights and managing fight details

- Secure password storage using MD5 hashing

- Stateless sessions with JSON Web Tokens (JWT)

- Admin functionalities for managing men and fights

  

## Getting Started

  

To get started with this project, follow the installation instructions provided in the [Installation](#installation) section below.

  

## Endpoints

### User Endpoints

| Endpoint | Method | Description                              | Request Body                            | Response                               |
|----------|--------|------------------------------------------|-----------------------------------------|----------------------------------------|
| `/login` | POST   | User login                              | {uname or email, password}              | JWT token                  |
| `/men`   | GET    | Get confirmed fighters               | N/A                                     | Array of confermed men objects                   |
| `/men`   | POST   | Create a new fighter                | {uname, name, password, email, Phone, crecord, address, fav_weapon, usr_img}               | ID of the created user     |
| `/fights`| GET    | Get confirmed fights (requires sign-in) | N/A                                     | Array of fights objects                 |
| `/fights`| POST   | Order a new fight                       | {ClientName, FightAddress, FightTime, phone, details, email, selectedIDs}                            | Details of the ordered fight |


### Admin Endpoints

| Endpoint         | Method | Description                              | Request Body                            | Response                               |
|------------------|--------|------------------------------------------|-----------------------------------------|----------------------------------------|
| `/admin/login`   | POST   | Admin login                              | {uname, password}                       | JWT token                  |
| `/admin/men`     | GET    | Get unconfirmed fighters             | N/A                                     | Array of unconfirmed men objects       |
| `/admin/men`     | PATCH  | Accept a new fighter                | {price, ManID}                          | Updated man object         |
| `/admin/men/{ManId}` | DELETE | Delete a fighter                   | N/A                                     | Message                                |
| `/admin/fights`  | GET    | Get unconfirmed fights                   | N/A                                     | Array of unconfirmed fight objects     |
| `/admin/fights`  | PATCH  | Accept a new fight                      | {FightID}                                     | Updated fight object       |
| `/admin/fights/{FightID}` | DELETE | Delete a fight                       | N/A                                     | Message                                |


## Environment Variables

Make sure to set the following environment variables:

- `DB_SCHEMA`, `DB_USER`, `DB_PASS`, `DB_HOST`: Database connection details.
- `JWT_SECRET`: Secret key for JWT token generation.
- `JWT_DURATION`: Duration of JWT token validity (e.g., 1d for 1 day, 1h for 1 hour).
- `ADMIN_UNAME`, `ADMIN_PASS`: Admin credentials.


## Dependencies

  

-  `body-parser`: ^1.20.2

-  `express`: ^4.18.2

-  `express-validator`: ^7.0.1

-  `jsonwebtoken`: ^9.0.1

-  `md5`: ^2.3.0

-  `multer`: ^1.4.5-lts.1

-  `mysql2`: ^3.6.0

-  `sequelize`: ^6.32.1

-  `helmet`: ^7.0.0

  

## Installation

  

1. Clone this repository: `git clone https://github.com/yusufhalby/3rka-API.git`

2. Navigate to the project directory: `cd your-repo`

3. Install dependencies: `npm install`

  

## Usage

  

1. Set up your environment variables as described in [Environment Variables](#environment-variables) section.

2. Start the server: `npm start`

3. The API will be available at `http://localhost:3000` by default.

  

## Contributing

  

Contributions are welcome! Feel free to submit issues and pull requests.

  

## License

  

This project is licensed under the [GPL-3.0 License](LICENSE).