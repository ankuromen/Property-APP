# Owner Approval Flow (Short Plan)

- User selects **Owner flow** from the website account area.
- User fills full property details and submits the property.
- Submitted property is marked as **Pending Admin Approval** (not publicly visible yet).
- Admin reviews the property details in admin panel.
- If admin **approves**:
  - property status becomes approved/active and is visible on website.
  - user role is updated to include **owner**.
- If admin **rejects**:
  - property remains not visible publicly.
  - rejection reason is shared with user for correction and resubmission.
- Visibility rule: only admin-approved owner properties appear in public listing/search.
- Role rule: owner role is granted only after first owner-property approval.
- Audit rule: keep approval timestamp + admin reviewer id for tracking.