describe('Segments component', () => {
  before(() => {
    cy.visit('test/Segments')
    cy.get('[data-cy="segment-content"]').contains('default')
  })

  it('shows different content when a segment is clicked', () => {
    cy.get('label[for="first"]')
      .click()
      .click()
      .should('have.class', 'selected')
    cy.get('[data-cy="segment-content"]').contains('first')
  })

  it('switches the selected class when a different segment is clicked', () => {
    cy.get('label[for="second"]')
      .click()
      .click()
      .should('have.class', 'selected')
    cy.get('[data-cy="segment-content"]').contains('second')
    cy.get('label[for="first"]').should('not.have.class', 'selected')
  })
})
