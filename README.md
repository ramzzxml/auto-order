# Enterprise Multi-Tenant Catchmail Automation SaaS

A high-performance, single-repository, completely compiled multi-tenant platform architected via Next.js 14+ App Router, Prisma, PostgreSQL, Tailwind CSS, and Shadcn UI components. Integrates custom Catchmail routing automations with PayQRIS transaction processing nodes.

## System Architecture Blueprint

* **Framework Core**: Next.js 14 (App Router) running completely typed TypeScript configurations.
* **Database Engine**: Prisma ORM abstraction mapping into production-optimized PostgreSQL clusters.
* **Authentication Pipeline**: Zero-overhead context middleware intercepting requests natively using fast-decoding secure payload cookies.
* **External Interfaces**:
    * **PayQRIS Gateway API**: Handles generation (`/api/v1/qris/create`), transactional status check loops (`/api/v1/qris/status`), and mutations cleanly through instant webhooks.
    * **Automation Cluster Engine (`https://am-prem.vxz.my.id`)**: Dispatches forward parameters (`/api/send`) and verifies target parsing chains (`/api/verify`) using multi-threaded backend catchmail routines.

## Quickstart Runbook

### 1. Provision Environments
Duplicate `.env.example` to create `.env` and fill out your specific configuration parameters.

### 2. Install Infrastructure
```bash
npm install
