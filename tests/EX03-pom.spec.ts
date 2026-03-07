import { test } from './fixtures';
import { CuraAppointmentPage } from './pages/cura-appointment.page';

test('make-appointment-success-pom', async ({ page, credentials }) => {
  const curaPage = new CuraAppointmentPage(page);
  const appointmentDetails = {
    facility: 'Seoul CURA Healthcare Center' as const,
    applyReadmission: true,
    healthcareProgram: 'Medicaid' as const,
    visitDate: '10/10/2026',
    comment: 'Book appointment with Page Object Model',
  };

  await curaPage.openHomePage();
  await curaPage.goToLogin();
  await curaPage.login(credentials.username, credentials.password);
  await curaPage.bookAppointment(appointmentDetails);
  await curaPage.expectAppointmentSuccess(appointmentDetails);
});
