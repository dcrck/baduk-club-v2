describe('Typeahead component', () => {
  before(() => {
    cy.visit('test/Typeahead')
  })

  it('shows results on type', () => {
    cy.get('[data-cy="typeahead"]')
      .clear()
      .type('Davi')
    cy.get('[data-cy="typeahead-result"]').should('have.length', 2)
  })
  it('allows users to select an option', () => {
    cy.get('[data-cy="typeahead"]')
      .clear()
      .type('Davi')
    cy.get('[data-cy="typeahead-result"]')
      .first()
      .click()
    cy.get('[data-cy="typeahead"]').should('have.value', 'David')
  })
  it('shows an error on invalid input', () => {
    cy.get('[data-cy="typeahead"]')
      .clear()
      .type('Davi')
      .blur()
    cy.get('[data-cy="validation-error"]').should('exist')
  })
  it('typing a valid option shows up as "ok"', () => {
    cy.get('[data-cy="typeahead"]')
      .clear()
      .type('David')
    cy.get('[data-cy="validation-status-ok"]').should('exist')
    cy.get('[data-cy="typeahead-result"]').should('not.exist')
  })
})
