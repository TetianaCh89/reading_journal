# Reading Journal

A full-stack application for managing a personal digital library and tracking reading progress.
Includes a Java Spring Boot backend and a React + TypeScript frontend.

## Description

The backend provides:

-CRUD REST API

-User authentication with Spring Security (JWT)

-Persistence using Spring Data JPA + Hibernate

-Auto-generated REST endpoints via Spring Data REST

-Integration with Google Books API

-MariaDB database support

The frontend:

-Built with React + TypeScript (Vite)

-Communicates with the backend through a clean API layer

-Provides pages for adding books, viewing all books, and managing personal reading records

Main Features:

-Add a book by title

-Automatically fetch book info from Google Books API

-Save personal reading records (status, notes, ratings)

-View a global book list

-View a personal reading journal

## Technologies

Backend: Java 17, Spring Boot, Spring Security, Spring Data REST, Spring Data JPA, Hibernate, Gradle, MariaDB
Frontend: React, TypeScript, Vite
External API: Google Books API

## Project Structure
```Backend (Spring Boot + Gradle)
backend/
├── src/main/java/com/packt/readingjournal
│   ├── AuthenticationFilter.java
│   ├── AuthEntryPoint.java
│   ├── OpenApiConfig.java
│   ├── ReadingjournalApplication.java
│   ├── RequestWrapperFilter.java
│   ├── SecurityConfig.java
│
│   ├── domain/
│   │   ├── ACred.java
│   │   ├── AppUser.java
│   │   ├── AppUserRepository.java
│   │   ├── Book.java
│   │   ├── BookRepository.java
│   │   ├── ReadingEntry.java
│   │   ├── ReadingEntryRepository.java
│   │   └── ReadingStatus.java
│
│   ├── service/
│   │   ├── JwtService.java
│   │   └── UserDetailsServiceImpl.java
│
│   └── web/
│       ├── BookController.java
│       ├── LoginController.java
│       ├── ReadingEntryController.java
│       └── ReadingEntryEventHandler.java
│
├── src/main/resources
│   └── application.properties
│
├── build.gradle
└── gradlew
```
```Frontend (React + TypeScript)
frontend/
├── public/
│   └── vite.svg
│
├── src/
│   ├── api/
│   │   ├── bookapi.ts
│   │   └── googleBooksapi.ts
│   │
│   ├── assets/
│   │   └── react.svg
│   │
│   ├── components/
│   │   ├── AddBook.tsx
│   │   ├── AddRecord.tsx
│   │   ├── AllBookList.tsx
│   │   ├── Book.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── OpinionCell.tsx
│   │   ├── RatingCell.tsx
│   │   ├── StatusCell.tsx
│   │   └── UserBookList.tsx
│   │
│   ├── utils/
│   │   ├── DashboardStyle.ts
│   │   ├── OpinionStyle.ts
│   │   └── ReadingStatusUtils.ts
│   │
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```
## Installation
Backend

Clone and run:

git clone https://github.com/TetianaCh89/reading_journal/readingjournal.git
cd <readingjournal>
./gradlew bootRun


Configure application.properties:

spring.datasource.url=jdbc:mariadb://localhost:3306/bookdb?createDatabaseIfNotExist=true
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver


Runs at:
http://localhost:8080

Frontend

Clone and run:

git clone https://github.com/TetianaCh89/reading_journal/Readingjournalfront.git
cd <Readingjournalfront>
npm install
npm start


Create .env:

VITE_API_URL=http://localhost:8080

## Screenshots

(Add screenshots here)
