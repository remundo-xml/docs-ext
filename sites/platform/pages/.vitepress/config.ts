import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/docs-ext/",
  title: "Remundo Docs",
  description: "Remundo platform documentation",
  themeConfig: {
    sidebar: [
      {
        text: "Client",
        collapsed: false,
        items: [
          { text: "Dashboard", link: "/client/dashboard" },
          { text: "Workers", link: "/client/workers" },
          { text: "Manage Offers", link: "/client/manage-offers" },
          { text: "Contract & Quote", link: "/client/contract-quote" },
          { text: "Invoices", link: "/client/invoices" },
          {
            text: "Create Offer",
            link: "/client/create-offer/",
            collapsed: true,
            items: [
              { text: "Employee", link: "/client/create-offer/employee" },
              { text: "Contractor", link: "/client/create-offer/contractor" },
            ],
          },
          {
            text: "Worker Details",
            link: "/client/worker-details/",
            collapsed: true,
            items: [
              { text: "Details", link: "/client/worker-details/details" },
              { text: "Engagements", link: "/client/worker-details/engagements" },
              { text: "Modify Engagements", link: "/client/worker-details/modify-engagements" },
              { text: "Timesheets", link: "/client/worker-details/timesheets" },
              { text: "Expenses", link: "/client/worker-details/expenses" },
              { text: "Absences", link: "/client/worker-details/absences" },
              { text: "Annual Leave", link: "/client/worker-details/annual-leave" },
              { text: "Calendar", link: "/client/worker-details/calendar" },
              { text: "Emergency Contacts", link: "/client/worker-details/emergency-contacts" },
              { text: "Employee Work Offer", link: "/client/worker-details/employee-work-offer" },
              { text: "General Settings", link: "/client/worker-details/general-settings" },
              { text: "History", link: "/client/worker-details/history" },
            ],
          },
          {
            text: "Pending Approvals",
            link: "/client/pending-approvals/",
            collapsed: true,
            items: [
              { text: "Detail", link: "/client/pending-approvals/detail" },
              { text: "Timesheet Detail", link: "/client/pending-approvals/timesheet-detail" },
              { text: "Expense Detail", link: "/client/pending-approvals/expense-detail" },
              { text: "Absence Detail", link: "/client/pending-approvals/absence-detail" },
            ],
          },
          {
            text: "Company Settings",
            link: "/client/company-settings/",
            collapsed: true,
            items: [
              { text: "Details", link: "/client/company-settings/details" },
              { text: "Billing Entities", link: "/client/company-settings/billing-entities" },
              { text: "Manage Users", link: "/client/company-settings/manage-users" },
              { text: "Manage Teams", link: "/client/company-settings/manage-teams" },
              { text: "Workers Availability", link: "/client/company-settings/workers-availability" },
              { text: "General Settings", link: "/client/company-settings/general-settings" },
            ],
          },
        ],
      },
      {
        text: "Worker",
        collapsed: false,
        items: [
          { text: "Dashboard", link: "/worker/dashboard" },
          { text: "Timesheets", link: "/worker/timesheets" },
          { text: "Expenses", link: "/worker/expenses" },
          { text: "Absences", link: "/worker/absences" },
          { text: "Payslips", link: "/worker/payslips" },
          { text: "Invoices", link: "/worker/invoices" },
          { text: "Accept Offer", link: "/worker/accept-offer" },
          { text: "Minimum Terms", link: "/worker/minimum-terms" },
          { text: "Service Company Wizard", link: "/worker/service-company-wizard" },
          {
            text: "Candidate Details",
            link: "/worker/candidate-details/",
            collapsed: true,
            items: [
              { text: "Profile", link: "/worker/candidate-details/profile" },
              { text: "Bank Details", link: "/worker/candidate-details/bank-details" },
              { text: "Emergency Contact", link: "/worker/candidate-details/emergency-contact" },
              { text: "Calendar", link: "/worker/candidate-details/calendar" },
              { text: "Service Companies", link: "/worker/candidate-details/service-companies" },
            ],
          },
          {
            text: "My Documents",
            link: "/worker/my-documents/",
            collapsed: true,
            items: [
              { text: "Preview", link: "/worker/my-documents/preview" },
            ],
          },
          {
            text: "My Engagements",
            link: "/worker/my-engagements/",
            collapsed: true,
            items: [
              { text: "Details", link: "/worker/my-engagements/details" },
              { text: "Agreement", link: "/worker/my-engagements/agreement" },
            ],
          },
          {
            text: "Onboarding",
            link: "/worker/onboarding/",
            collapsed: true,
            items: [
              { text: "Review", link: "/worker/onboarding/review" },
              { text: "Sign", link: "/worker/onboarding/sign" },
            ],
          },
        ],
      },
      {
        text: "Common",
        collapsed: false,
        items: [
          { text: "Login", link: "/common/login" },
          { text: "Register", link: "/common/register" },
          { text: "Recover Password", link: "/common/recover-password" },
          { text: "Renew Password", link: "/common/renew-password" },
          { text: "Invite", link: "/common/invite" },
          { text: "Callback", link: "/common/callback" },
          { text: "Settings", link: "/common/settings" },
          { text: "QR Code", link: "/common/qr-code" },
          { text: "Share", link: "/common/share" },
          { text: "Tutorial Videos", link: "/common/tutorial-videos" },
          { text: "Terms of Service", link: "/common/terms-of-service" },
          { text: "Unsubscribe", link: "/common/unsubscribe" },
          { text: "Error Pages", link: "/common/error-pages" },
        ],
      },
    ],
    search: {
      provider: "local",
    },
  },
});
