describe('User Location Form', () => {
  before(() => {
    cy.visit('test/UserLocationForm')
  })
  it('does not allow submission by default', () => {
    cy.get('[data-cy="submit-user-location"]').should('be.disabled')
  })
  it('requires bio', () => {
    cy.get('#address').type('15198 Hook Hollow Road, Novelty')
    cy.get('[data-cy="search-result"]')
      .contains('15198 Hook Hollow')
      .click()
    cy.get('[data-cy="submit-user-location"]').should('be.disabled')
    cy.get('[data-cy="cancel-user-location"]').click()
  })

  it('requires address', () => {
    cy.get('#description').type('test description')
    cy.get('[data-cy="submit-user-location"]').should('be.disabled')
    cy.get('[data-cy="cancel-user-location"]').click()
  })

  it('allows submission when both bio and address are valid', () => {
    cy.get('#address').type('15198 Hook Hollow Road, Novelty')
    cy.get('[data-cy="search-result"]')
      .contains('15198 Hook Hollow')
      .click()
    cy.get('#description').type('test description')
    cy.get('[data-cy="submit-user-location"]').should('not.be.disabled')
    cy.get('[data-cy="cancel-user-location"]').click()
  })
})
