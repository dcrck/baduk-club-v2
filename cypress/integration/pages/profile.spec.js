describe('profile page', () => {
  before(() => {
    cy.request('login?test=1').then(() => cy.visit('profile'))
  })

  it('renders tabs', () => {
    cy.get('[data-cy="statistics-tab"]').should('exist')
    cy.get('[data-cy="attendances-tab"]').should('exist')
    cy.get('[data-cy="settings-tab"]').should('exist')
  })
})
