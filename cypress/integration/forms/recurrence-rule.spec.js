describe('Recurrence Rule test', () => {
  before(() => {
    cy.visit('test/RecurrenceRuleForm')
  })

  it('renders weekly meetup fields', () => {
    cy.get('label[for="__weekly__"]').click()
    cy.get('[data-cy="MO"]').should('have.css', 'opacity', '1')
    cy.get('[data-cy="TU"]')
      .click()
      .should('have.css', 'opacity', '1')
    cy.get('[data-cy="preview"]').contains('Tuesdays')
    cy.get('[data-cy="reset-rrule-form"]').click()
  })

  it('prevents end time before start time', () => {
    cy.get('label[for="__weekly__"]').click()
    cy.get('[data-cy="start-time"]').type('12:00')
    cy.get('[data-cy="end-time"]').type('08:00')
    cy.get('[data-cy="add-time"]').should('be.disabled')
    cy.get('[data-cy="reset-rrule-form"]').click()
  })

  it('renders monthly fields', () => {
    cy.get('label[for="__monthly__"]').click()
    cy.get('[data-cy="+1MO"]').should('have.css', 'opacity', '1')
    cy.get('[data-cy="+1TU"]')
      .click()
      .should('have.css', 'opacity', '1')
    cy.get('[data-cy="preview"]').contains('first Tuesday')
    cy.get('[data-cy="reset-rrule-form"]').click()
  })

  it('prevents end date/time before start date/time (one-time)', () => {
    cy.get('label[for="__once__"]').click()
    cy.get('[data-cy="start-date"]').type('2019-09-01')
    cy.get('[data-cy="end-date"]').type('2019-08-31')
    cy.get('[data-cy="add-time"]').should('be.disabled')
    cy.get('[data-cy="end-date"]').type('2019-09-01')
    cy.get('[data-cy="start-time"]').type('12:00')
    cy.get('[data-cy="end-time"]').type('08:00')
    cy.get('[data-cy="add-time"]').should('be.disabled')
    cy.get('[data-cy="reset-rrule-form"]').click()
  })
})
