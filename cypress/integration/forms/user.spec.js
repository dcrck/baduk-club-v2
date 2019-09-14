describe('User Form', () => {
  before(() => {
    cy.visit('test/UserForm')
  })

  it('does not allow submission by default', () => {
    cy.get('[data-cy="submit-user-fields"]').should('be.disabled')
  })

  it('requires picture', () => {
    cy.get('#name')
      .type('Derek')
      .blur()
    cy.get('[data-cy="submit-user-fields"]').should('be.disabled')
    cy.get('[data-cy="cancel-user-fields"]').click()
  })

  it('requires name', () => {
    cy.get('#picture').type('https://cdn.auth0.com/avatars/dm.png')
    cy.get('[data-cy="submit-user-fields"]').should('be.disabled')
    cy.get('[data-cy="cancel-user-fields"]').click()
  })

  it('allows submission when name, phone, and picture are valid', () => {
    cy.get('#name').type('Derek')
    cy.get('#picture').type('https://cdn.auth0.com/avatars/dm.png')
    cy.get('#phone')
      .type('4406224096')
      .wait(500)
    cy.get('[data-cy="submit-user-fields"]').should('not.be.disabled')
    cy.get('[data-cy="cancel-user-fields"]').click()
  })
})
