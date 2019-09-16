describe('event page', () => {
  before(() => {
    cy.visit('events/rnbmwlunsd')
  })

  it('renders', () => {
    cy.get('[data-cy="details-tab"]').should('exist')
  })

  it('renders logged-in tabs', () => {
    cy.request('login?test=1').then(() => cy.visit('events/rnbmwlunsd'))
    cy.get('[data-cy="details-tab"]').should('exist')
    cy.get('[data-cy="attendees-tab"]').should('exist')
    cy.get('[data-cy="games-tab"]').should('exist')
  })
})
