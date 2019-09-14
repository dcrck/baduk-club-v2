describe('Game form', () => {
  before(() => {
    cy.visit('test/GameForm')
  })

  it('disallows submission by default', () => {
    cy.get('[data-cy="game-form-submit"]').should('be.disabled')
  })

  it('allows changing of komi and handicap', () => {
    cy.get('#komi')
      .should('have.value', '0')
      .clear()
      .type('4')
    cy.get('#handicap')
      .should('have.value', '0')
      .clear()
      .type('4')
    cy.get('[data-cy="game-form-reset"]').click()
  })
  it('allows the user to select a winner', () => {
    cy.get('[data-cy="black"]').trigger('mouseover')
    cy.get('label[for="black-won-new"]')
      .should('be.visible')
      .click()
    cy.get('[data-cy="white"]').trigger('mouseover')
    cy.get('label[for="black-won-new"]').should('have.css', 'opacity', '1')
    cy.get('[data-cy="white"]').trigger('mouseover')
    cy.get('label[for="white-won-new"]')
      .should('be.visible')
      .click()
    cy.get('label[for="black-won-new"]').should('have.css', 'opacity', '0')
    cy.get('[data-cy="game-form-reset"]').click()
  })

  it('allows the user to enter player names and submit', () => {
    cy.get('[data-cy="typeahead-black"]')
      .type('David')
      .blur()
    cy.get('[data-cy="typeahead-white"]')
      .type('Devin')
      .blur()
    cy.get('[data-cy="game-form-submit"]').should('not.be.disabled')
    cy.get('[data-cy="game-form-reset"]')
      .trigger('mouseover')
      .wait(200)
      .click()
  })
})
