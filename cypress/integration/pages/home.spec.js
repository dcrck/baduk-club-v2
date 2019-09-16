describe('home page', () => {
  before(() => {
    cy.visit('/')
  })

  it('shows welcome page (logged out)', () => {
    cy.get('[data-cy="home-intro-text"]')
  })

  it('shows user count (logged out)', () => {
    cy.get('[data-cy="user-count"]').contains('1')
  })

  it('shows meetup count (logged out)', () => {
    cy.get('[data-cy="meetup-count"]').contains('2')
  })

  it('shows directory (logged in)', () => {
    cy.request('/login?test=1').then(() => cy.visit('/'))
    cy.get('[data-cy="directory-header"]').contains('Directory')
  })
})
