describe('Icon component', () => {
  before(() => {
    cy.visit('test/Icon')
  })

  it('renders all icons', () => {
    cy.get('[data-cy="icons"]')
      .children()
      .should('have.length', 283)
  })
})
