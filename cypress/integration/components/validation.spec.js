describe('Validation component', () => {
  before(() => {
    cy.visit('test/Validation')
  })

  it('rejects an empty component', () => {
    cy.get('[data-cy="name-input"]')
      .focus()
      .clear()
      .focus()
      .blur()
    cy.get('[data-cy="validation-error"]')
      .should('exist')
      .contains('Please enter a name')
  })

  it('accepts content', () => {
    cy.get('[data-cy="name-input"]')
      .focus()
      .type('Name here')
    cy.get('[data-cy="validation-error"]').should('not.exist')
  })

  it('rejects cleared content', () => {
    cy.get('[data-cy="name-input"]')
      .focus()
      .clear()
    cy.get('[data-cy="validation-error"]').should('exist')
  })
})
