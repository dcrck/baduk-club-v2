describe('Modal component', () => {
  before(() => {
    cy.visit('test/Modal')
  })

  beforeEach(() => {
    cy.get('[data-cy="show-modal"]').click()
    cy.get('[data-cy="modal"]').should('exist')
    cy.get('[data-cy="card"]').should('exist')
  })

  /*it('modal disappers when X is clicked', () => {
    cy.get('[data-cy="close-modal"]')
      .should('exist')
      .click()
    cy.get('[data-cy="modal"]').should('not.exist')
  })*/

  it('disappers when background is clicked', () => {
    cy.get('[data-cy="modal-background"]')
      .should('exist')
      .click({ force: true })
    cy.get('[data-cy="modal"]').should('not.exist')
  })
})
