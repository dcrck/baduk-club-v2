describe('User Location Form', () => {
  before(() => {
    cy.visit('test/UserLocationForm')
  })

  it('does not allow submission by default', () => {
    cy.get('[data-cy="submit-user-location"]').should('be.disabled')
  })

  it('requires address if "show location" checkbox is checked', () => {
    cy.get('label[for="show-location"]')
      .click()
      .wait(400)
    cy.get('[data-cy="submit-user-location"]').should('be.disabled')
  })

  it('allows users to uncheck "show location" checkbox and not clear their address', () => {
    cy.get('#address').type('15198 Hook Hollow Road, Novelty')
    cy.get('[data-cy="search-result"]')
      .contains('15198 Hook Hollow')
      .click()
    cy.get('[data-cy="submit-user-location"]').should('not.be.disabled')
  })

  it('allows submission when both checkbox and address are valid', () => {
    cy.get('#address').type('15198 Hook Hollow Road, Novelty')
    cy.get('[data-cy="search-result"]')
      .contains('15198 Hook Hollow')
      .click()
    cy.get('label[for="show-location"]')
      .click()
      .wait(400)
    cy.get('[data-cy="submit-user-location"]').should('not.be.disabled')
  })

  afterEach(() => {
    cy.get('[data-cy="cancel-user-location"]').click()
  })
})
