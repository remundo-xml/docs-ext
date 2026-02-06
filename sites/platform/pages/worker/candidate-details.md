# Candidate Details

Manage personal and employment details across profile, banking, emergency contacts, service companies, and calendar.

## Route

`/candidate-details`

## Sub-routes

- `/candidate-details/profile` - Personal information
- `/candidate-details/bank-details` - Payment account details
- `/candidate-details/emergency-contact` - Emergency contact information
- `/candidate-details/service-companies` - Contractor service companies
- `/candidate-details/service-companies/:id/details` - Service company details
- `/candidate-details/calendar` - Personal calendar view

## Profile

The profile tab is the default view. It is split into two columns: a form on the left and verification/work permit cards on the right.

### Personal information

- First name (required, 2-56 chars; locked after nationality verification)
- Last name (required, 2-56 chars; locked after nationality verification)
- Date of birth (day/month/year dropdowns; locked after identity verification starts)
- Worker code (read-only, system-generated)
- Organisation code (read-only)

### Documentation

- Personal tax number (optional, 3-20 chars)
- Email (required; changing it requires password confirmation and triggers automatic logout)
- Document type (read-only, from identity verification)
- Document expiration date (read-only)
- Identification number (read-only)
- Work location ISO (read-only, derived from current engagement)
- Language (read-only)

### Address and residency

- Primary nationality (required, country dropdown; locked after nationality verification)
- Additional nationalities (read-only list of approved nationalities, with option to add more after primary is verified)
- Country of residence (required, country dropdown)
- Address autocomplete (Google Places integration, visible in edit mode only)
- Address line (required, 3-56 chars)
- City (required, 3-56 chars)
- Postal code (required, 3-56 chars, alphanumeric only)

### Contact

- Phone number (required, two parts: international dial code selector and number input)
- Validated with google-libphonenumber

### Profile photo

- Upload from file (.png, .jpg) or camera capture
- HEIC files are converted to JPEG automatically
- Max file size: 1MB
- Remove option available

### Identity and address verification

Two verification cards appear on the right side once a primary nationality is set:

- Identity verification via Idenfy KYC service
- Address verification via Idenfy

Each card shows a status: action-required, processing, in-progress, failed, or verified. A "Validate" button launches the verification flow with a confirmation modal.

### Additional nationality verification

Appears after primary nationality is verified (if enabled in settings). Allows selecting another country and initiating a separate verification process.

### Work permits

A card is shown for each work permit on the profile, displaying document type, expiration date, and an expiry warning:
- Green when more than 45 days remain
- Yellow when 45 days or fewer remain
- Red when expired

### Real-time updates

The profile subscribes to WebSocket events. When the backend confirms a profile change, the page refreshes automatically.

## Other features

- Bank account verification at `/candidate-details/bank-details`
- Emergency contact management at `/candidate-details/emergency-contact`
- Contractor service company management at `/candidate-details/service-companies`
- Personal calendar view at `/candidate-details/calendar`
