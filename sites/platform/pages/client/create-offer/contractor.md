# Contractor Offer Wizard

Five-step wizard for creating a new contractor engagement offer. Structurally parallel to the employee wizard but with contractor-specific fields for pay rate, time unit, and agreement period.

## Route

`/organisations/:organisationId/create-eorinstance/contractor`

## Steps

### Step 1: Contractor Details

Collects the contractor's personal information. Includes an `AddTeamForm` component for optionally assigning the contractor to a team at creation time. Team form fields:
- Team Name (required)
- Manager Name (required; combobox of available managers)

### Step 2: Job Location

`JobLocation` component. Country and region selection. On completion, fetches job constraints for the selected country/region and sets the default currency.

### Step 3: Job Description

`JobDetailsForm` component. Fields:
- Job Title (required; max 50 characters; combobox with custom value allowed; populated from `fetchedJobDescriptions`)
- Role Description (Markdown editor; required; minimum 3 characters)
  - Option to write a custom description or select a preset description (stepper to cycle through available presets)
  - Preset descriptions are loaded from `fetchedJobDescriptions` matching the selected title

### Step 4: Work Schedule

`WorkSchedule` component. Working hours, days per week, and schedule type configuration. The schedule type (e.g. On Demand) affects available time units in the next step.

### Step 5: Start Date, Pay Rate & Agreement Period

`StartDateAndSalaryForm` component. Fields:

- **Start Date** (required; date picker; minimum date calculated from `estimatedPrepTimeInBusinessDays` plus bank holidays)
- **Contract Length** -- when `showOpenEndedOptionForContractors` is enabled and the country allows open-ended contracts:
  - Fixed Term (radio option)
  - Open Ended (radio option; disabled when `allowOpenEnded` is false)
- **End Date / Agreement Period** -- for fixed-term contracts, a radio group:
  - Set End Date -- date picker with minimum end date derived from `minimumContractorAgreementPeriod` months after start date; maximum limited by `maxFixedPeriodMonths`
  - Agreement Period -- number field for months (min: `minimumContractorAgreementPeriod`; max: `maximumContractorAgreementPeriod` or 36)
- **Billing Entity** (required; select dropdown; "Add Billing Entity" option navigates to entity creation)
- **Time Unit** (required; Hourly, Daily, or Monthly; Monthly is excluded for On Demand schedule type)
- **Currency** (required; combobox; always includes the engagement country's currency, the organisation country's currency, EUR, USD, GBP; billing entity currency added when selected)
- **Pay Rate** (required when pricing is enabled; validated against country minimum rates per time unit, adjusted by exchange rate):
  - Hourly: minimum is `minimumHourlyPayRate * exchangeRate`
  - Daily: minimum is `minimumDailyPayRate * exchangeRate`
  - Monthly: minimum is `minimumMonthlyPayRate * exchangeRate`
  - Maximum: 1,000,000,000
  - Monthly pay rate uses integer input; hourly/daily use decimal input
- **Remaining Holiday** (required when pricing is disabled; integer 0-30)
- **Enable Pricing** checkbox (shown when `allowDisablePricing` is true)

### Differences from Employee Wizard

- Uses pay rate with time unit (Hourly/Daily/Monthly) instead of annual salary.
- Agreement period can be specified as months or an explicit end date.
- Open-ended contract option is available (conditional on feature flag and country).
- Minimum pay rates are validated per time unit with exchange rate adjustment.
- INR currency is excluded for India engagements under certain tenants (`ecolab`).

## Submission Process

Same eight-step process as the employee wizard. On success, redirects to `/organisations/:organisationId/contract-quote/:eorId`.

## Wizard State Persistence

Same as the employee wizard: state persisted to local storage, cleared on successful submission.

## Behavior notes

- Currency exchange rate is fetched via `getExchangeRate` when the selected currency differs from the engagement country's currency.
- Start date validation accounts for business days and bank holidays.
- The "Get Quote" button is disabled until all required fields are valid.
