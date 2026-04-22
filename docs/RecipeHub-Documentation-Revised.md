# RecipeHub

Submitted by:
(Names of members)

Submitted to:
(Instructor Name)

(School Name)
March 22, 2026

JAR Solutions  
Cook, Share, Learn

---

## About RecipeHub
RecipeHub is a web-based integrated platform where users can discover, save, and interact with recipes in one place. The system supports user engagement through comments, reactions, favorites, and account-level personalization. Premium subscription features provide access to locked recipe content and enhanced user experience. RecipeHub also includes role-based management with dedicated Admin and Staff panels to ensure controlled recipe publishing and quality moderation.

## Project Summary
This project focuses on developing a secure and scalable recipe platform that combines recipe management, user role control, premium access, and moderation workflow. RecipeHub addresses common issues in existing recipe platforms such as scattered information, inconsistent quality, and limited content governance by introducing a structured Admin-Customer-Staff ecosystem.

Prepared By:
(Team members)

---

## Project Overview
RecipeHub is a community-driven recipe platform designed for food lovers who want to discover, save, and interact with culinary content. Customers can browse recipes, search content, view recipe details, engage through comments and likes, save favorites, and manage account settings. The platform also supports subscription-based premium access for locked recipe content.

A key implementation rule in the current version is that customers cannot post recipes. Recipe submission is handled only by Staff users through a dedicated staff panel. Submitted recipes pass through approval workflow states (pending, approved, rejected), while Admin users oversee moderation, user governance, and staff account management.

In terms of industry focus, RecipeHub currently operates at the intersection of Food Technology, Community Content Platforms, and Digital Subscription Services.

---

## Table of Contents
This document covers the following sections in order: Problem Analysis, Proposed Solution, Terms of Reference (TOR), Scope of Work, Deliverables and Modularization, System Integration with Description, Team Composition and Job Roles, Technical Requirements, Feasibility Study, Financial Analysis, Future Improvements, and System Architecture.

---

## 1. Problem Analysis
Many users currently rely on social media and random websites for recipes. While easy to access, these channels often lack quality control, consistency, and structured content management. Recipe information is fragmented, trust in quality is uneven, and users may struggle to locate reliable instructions quickly.

Another major challenge is content governance. If every user can freely post recipes without moderation, content quality and platform reliability may decline over time. For growing platforms, clear role separation is needed to maintain consistent publishing standards, reduce misuse, and improve user confidence.

As a result, there is a clear need for an integrated recipe platform with organized content, role-based permissions, moderated publishing, premium subscription options, and strong customer interaction features.

## 2. Proposed Solution
To address these gaps, the team proposes RecipeHub as an integrated web-based platform with three operational roles: Admin, Staff, and Customer.

In the current setup, the Customer role focuses on registration and login, recipe browsing, search and filtering, recipe detail viewing, reactions and comments, favorites, account settings, and premium-content access where applicable. The Staff role handles recipe creation and submission through structured forms that include title, ingredients, steps, duration, course type, and media, and also monitors recipe status under approved, pending, or rejected states. The Admin role manages users, creates staff accounts, moderates submitted recipes, and maintains platform governance through approval workflows and oversight tools.

This approach improves quality control by restricting recipe publishing to staff members while keeping customers focused on consumption and engagement.

---

## 3. Terms of Reference (TOR)
### 3.1 Project Background
RecipeHub is proposed as an integrated information system for digital food content management. Existing recipe sources are often fragmented and inconsistent. The project unifies recipe access, user engagement, premium access, and role-based moderation into one web platform.

### 3.2 Project Objectives
The project aims to deliver a functional and scalable platform that provides secure user authentication and account management, implements role-based access control for Admin, Staff, and Customer users, enables structured recipe catalog management with moderation workflow, supports search and filtering together with favorites, comments, and reactions, provides subscription-based premium content access, and establishes a maintainable technical foundation for future feature expansion.

### 3.3 Project Scope
The current operational scope includes user registration and login, customer recipe browsing with search, filtering, and detail viewing, interaction features such as likes, comments, and favorites, premium subscription access flow, staff-only recipe creation and submission, admin moderation through approved, pending, and rejected states with user management and staff creation, and account settings with contact or feedback support.

### 3.4 Project Limitations
The project is limited by an academic development timeline up to the first week of May. Infrastructure and hosting capacity may also limit high-concurrency usage during initial deployment. Third-party services are dependent on external API terms and usage limits, and the current release prioritizes core platform operations over advanced real-time features.

---

## 4. Scope of Work
### 4.1 Software Development Methodology
The project follows an iterative Agile-inspired process with short delivery cycles and continuous validation.

### 4.2 Phases of Development
The project phases include planning and requirement consolidation, UI/UX and architecture design, backend and database implementation, integration of authentication with premium and moderation workflows, implementation of staff submission and admin governance features, and final testing, bug fixing, documentation, and deployment preparation.

### 4.3 Activities
Requirement analysis, wireframing, schema design, API development, frontend implementation, integration testing, user acceptance validation, and documentation.

---

## 5. Deliverables / Modularization
Major modules include Authentication and Access Control, Role Management for Admin/Staff/Customer, Recipe Catalog and Content Display, Search and Filter Engine, Community Interaction for likes, comments, and favorites, Subscription and Premium Access, Staff Recipe Submission, Admin Moderation and Governance, and Account Settings with Contact Support.

---

## 6. System Integration with Description
| System | Description |
|---|---|
| Google Login | Fast and secure sign-in option. |
| Facebook Login | Alternative social login option. |
| Email Authentication | Standard account creation and login. |
| Firebase Storage / AWS S3 / Cloudinary | Storage for recipe images/media assets. |
| Firebase Realtime Database / MongoDB / MySQL | Core data persistence options. |
| Payment Gateway (Subscription) | Premium access billing and subscription handling. |

---

## 7. Team Composition and Job Roles
| Resource Person | Job Role | Task |
|---|---|---|
| Member 1 | Project Manager / Documentation Lead | Coordinates schedule, consolidates requirements, and prepares documentation outputs. |
| Member 2 | Frontend Developer | Builds customer, staff, and admin interfaces. |
| Member 3 | Backend Developer | Develops APIs, business logic, auth, and permissions. |
| Member 4 | Database and Integration Developer | Handles schema design and service integrations. |
| Member 5 | QA / Testing Support | Runs test cases, bug validation, and release checks. |

---

## 8. Technical Requirements
The platform is web-based and responsive for desktop and mobile browsers. The stack uses a JavaScript/TypeScript ecosystem such as React with Node.js services. The database may use Firebase Realtime Database, MongoDB, or MySQL depending on deployment needs. Development hardware requires standard laptops or desktops with stable internet. Security includes authentication controls, password hashing, role-based authorization, endpoint protection, and validation. Scalability is supported through modular backend design and cloud-ready media/database architecture.

---

## 9. Feasibility Study
### 9.1 Technical Feasibility
The system is technically feasible using mature web technologies and widely available cloud integrations. Core modules (auth, roles, recipes, moderation, premium access, and interactions) are achievable within student-level implementation constraints.

### 9.2 Operational Feasibility
Role separation supports practical operations where customers consume and interact with content, staff submit recipes, and admin users govern moderation and user control. This setup reduces publishing risk while preserving user engagement and platform consistency.

### 9.3 Economic Feasibility
The project has manageable startup costs and sustainable revenue opportunities through premium subscriptions. Initial implementation can use free-tier resources and scale gradually.

### 9.4 Schedule Feasibility
With phased delivery and disciplined scope management, target completion by the first week of May remains feasible.

---

## 10. Financial Analysis
This section evaluates the financial outlook of RecipeHub based on the currently implemented platform scope. The baseline model focuses on premium subscriptions as the primary monetization stream, with sponsorships and in-app promotions as secondary opportunities. Revenue from non-implemented features, such as live cooking instruction with professional cooks, is excluded from baseline projections and treated as future upside.

### 10.1 Cost and Investment Overview
Initial investment includes development effort, UI/UX preparation, testing, documentation, deployment setup, and basic cloud/service usage. During early-stage operation, costs are expected to remain manageable by using student-accessible tooling and free-tier resources where possible. As user activity grows, variable costs may increase for media storage, database usage, and payment processing.

### 10.2 Revenue Assessment (Current Scope)
The primary near-term revenue source is premium subscription access to locked recipe content and enhanced platform features. Additional optional revenue may come from sponsorship placements or carefully controlled in-app promotions that do not disrupt user experience.

### 10.3 ROI and Break-Even Notes
ROI and break-even estimates should use conservative assumptions tied to implemented modules only, including expected subscriber conversion, monthly retention, and operating cost growth. This keeps financial projections realistic and measurable within the current release scope.

### 10.4 Revenue Projection Table (Current vs Future)
To avoid confusion between implemented and planned features, revenue projections are separated by scope category.

| Revenue Stream | Basis | Estimated Annual Revenue (PHP) | Scope Category |
|---|---|---:|---|
| Premium subscriptions | 250 users x PHP 149/month x 12 months | PHP 447,000 | Current Scope |
| Sponsorships / in-app promotions | Approx. PHP 5,000/month x 12 | PHP 60,000 | Current Scope |
| Live cooking session access | 2 sessions/month x 80 users x PHP 99 x 12 months | PHP 190,080 | Future Potential |
| Platform commission from partner workshops (future) | Estimated annual platform share | PHP 12,000 | Future Potential |

| Summary Metric | Value |
|---|---:|
| Projected Annual Revenue (Current Scope Only) | PHP 507,000 |
| Projected Annual Revenue (Including Future Potential) | PHP 709,080 |

---

## 11. Future Improvements
The following are planned for future implementation after core platform stabilization:

Future improvements include adding verified professional cooks through profile verification flow, expert contributor tagging, and reputation indicators. Another enhancement is live cooking sessions with real-time class hosting, session scheduling, guided Q&A, and event access control for premium or special participation. The platform may also include advanced analytics and recommendations for personalized recipe discovery and stronger retention strategy. In addition, moderation can be expanded further with improved reporting workflows and more granular policy and audit controls.

---

## 12. System Architecture
The architecture follows role-based separation with Admin, Staff, and Customer workflows:

The Customer Layer handles browsing, search, viewing, comments, favorites, premium access, and account management. The Staff Layer focuses on recipe creation and submission management. The Admin Layer manages moderation pipeline, staff and user governance, and dashboard oversight. Core services include authentication, role control, recipe operations, premium module logic, and interaction services. The Data/Cloud Layer supports database storage, media handling, and payment integration.

(Insert updated architecture diagram reflecting current implemented scope.)
