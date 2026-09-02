# Bubble Tea Time App

## Overview

**Bubble Tea Time** is a full-stack e-commerce web application for ordering bubble tea online. The project combines a customer-facing React/Next.js application with a PostgreSQL database, payment processing through the Clover REST API, and automated merchant email notifications through Resend.

The application is designed around a complete order lifecycle: customers build an order, the server validates and creates the order, Clover processes the payment, Clover notifies the application of the payment result, and the application updates the order and can notify the merchant.

The Bubble Tea Time App is currently **under development**.

## Features

* Interactive menu and customization options
* Server-side order and pricing validation
* PostgreSQL database managed through Supabase
* Clover Hosted Checkout for payment processing
* Clover payment webhooks for receiving payment results
* Database-backed merchant notification queue
* Merchant email notifications through Resend
* Deployment through Vercel

## How It Works

The application follows a server-controlled order flow to keep important operations such as pricing, payment status, and order state on the server.

### 1. Customer Builds an Order

The **React/Next.js frontend** allows customers to browse the menu, select products and customizations, and create an order.

The frontend communicates with the application's server-side API rather than being trusted with final pricing or payment information.

### 2. Order Validation

When the customer checks out, the server:

1. Validates the submitted cart.
2. Retrieves the relevant menu items and customization options from the **PostgreSQL database**.
3. Recalculates item and customization prices on the server.
4. Calculates the applicable tax.
5. Checks the store's operating hours.
6. Creates the order in the database with an initial `pending` status.

This prevents the client from simply submitting modified prices or other order information and having those values become the final order.

### 3. Payment Through Clover

After the order is created, the application creates a **Clover Hosted Checkout** session using the Clover REST API.

The customer is then sent to Clover's hosted payment experience to complete the transaction.

The application associates the Clover checkout session with the corresponding database order so that a later payment notification can be matched to the correct order.

### 4. Clover Payment Webhook

After payment is processed, **Clover** sends a payment webhook to the application's Next.js API.

The webhook handler does not simply trust the incoming request. It verifies the Clover webhook signature and validates important information from the payment notification before changing the order.

For an approved payment, the application verifies information including:

* The webhook signature
* The webhook timestamp
* The webhook type and payment status
* The payment and checkout session identifiers
* The configured Clover merchant ID
* The approved payment amount against the order total
* The associated order's current status

### 5. Order Status Update

Once an approved payment has passed validation, the corresponding order can transition from:

`pending → paid`

Declined payments can transition from:

`pending → failed`

The status transition is constrained so that an already-processed order is not simply overwritten by a later webhook.

Webhook records are also stored in the database to support duplicate-event handling and tracking of received payment notifications.

### 6. Merchant Notification

After an approved order is successfully processed, the application creates a notification job in **Supabase/PostgreSQL**.

A separate authenticated worker processes these jobs and uses **Resend** to send the merchant an email notification.

Using a database-backed job queue separates payment processing from email delivery, so the Clover webhook does not have to perform the entire notification process itself.

## Payment & Security

Payment processing is handled through **Clover**, while the application remains responsible for validating the relationship between the payment and the order.

The webhook endpoint uses Clover's signed webhook mechanism and performs additional validation before modifying an order. This includes replay protection using the webhook timestamp, validation of identifiers and payment status, merchant ID verification, payment amount verification, checkout-session-to-order matching, and constrained order-state transitions.

The application also avoids placing sensitive server credentials in the client-side application. Server-only credentials such as the Clover API credentials, Clover webhook secret, Supabase service-role key, Resend API key, and worker authentication secret are used by server-side code.

These security measures have been **implemented and tested locally/sandbox-side**, but the project should not be considered fully production-security verified.

## Tech Stack

### Frontend & Application

* **Next.js** — Full-stack React framework used for the web application and server-side API routes.
* **React** — Builds the interactive customer-facing interface.
* **TypeScript** — Used for typed application and server-side code.
* **JavaScript** — Used throughout parts of the application alongside TypeScript.
* **HTML & CSS** — Used for the structure and styling of the web interface.
* **Node.js** — Provides the server-side runtime for the Next.js application and API logic.

### Database

* **PostgreSQL** — Stores application data such as menu information, orders, webhook events, and notification jobs.
* **Supabase** — Provides the hosted PostgreSQL database and database services used by the application.

### Payments

* **Clover REST API** — Used to create and manage the Clover Hosted Checkout payment flow.
* **Clover Webhooks** — Used to receive payment status notifications from Clover after checkout.

### Email

* **Resend** — Handles merchant email notifications after successfully processed orders.

### Deployment

* **Vercel** — Hosts and deploys the Next.js application.


## Known Limitations

* The project is still under development, so some functionality and infrastructure is subject to change.
* The notification worker is not currently automatically scheduled multiple times per day under the Vercel Hobby plan's Cron limitations.
* Security and payment handling have been tested in the development/sandbox environment, but full production verification has not been completed.
* The application currently relies on Clover's payment webhook to receive the final payment status rather than treating the browser's return from checkout as proof of payment.

## Project Status

**Under development**

The core e-commerce, database, payment, webhook, and merchant-notification architecture is implemented, with continued development and testing focused on making the system more robust and production-ready.
