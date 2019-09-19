describe('Item List', () => {
  before(() => {
    cy.visit('test/List')
  })

  it('renders User List', () => {
    cy.get('[data-cy="user-list"]')
      .should('exist')
      .find('[data-cy="user-card"]')
      .should('have.length', 3)
  })

  it('text search works for User list', () => {
    cy.get('[data-cy="user-list"]')
      .find('[data-cy="list-text-search"]')
      .should('exist')
      .type('Rechl')
    cy.get('[data-cy="user-list"]')
      .find('[data-cy="user-card"]')
      .should('have.length', 1)
    cy.get('[data-cy="user-list"]')
      .find('[data-cy="list-text-search"]')
      .clear()
  })

  it('renders Game List', () => {
    cy.get('[data-cy="game-list"]')
      .should('exist')
      .find('[data-cy="game-card"]')
      .should('have.length', 2)
  })

  it('text search works for Game list', () => {
    cy.get('[data-cy="game-list"]')
      .find('[data-cy="list-text-search"]')
      .should('exist')
      .type('Rechl')
    cy.get('[data-cy="game-list"]')
      .find('[data-cy="game-card"]')
      .should('have.length', 1)
    cy.get('[data-cy="game-list"]')
      .find('[data-cy="list-text-search"]')
      .clear()
  })

  it('adds/removes item to/from game list when buttons clicked', () => {
    cy.get('[data-cy="game-list"]')
      .find('[data-cy="add-new-Game"]')
      .click()
    cy.get('[data-cy="game-card"]').should('have.length', 3)
    cy.get('[data-cy="del-Game-3"]').click()
    cy.get('[data-cy="game-card"]').should('have.length', 2)
  })

  it('renders Event List', () => {
    cy.get('[data-cy="event-list"]')
      .should('exist')
      .find('[data-cy="event-card"]')
      .should('have.length', 2)
  })

  it('text search works for Event list', () => {
    cy.get('[data-cy="event-list"]')
      .find('[data-cy="list-text-search"]')
      .should('exist')
      .type('Colum')
    cy.get('[data-cy="event-list"]')
      .find('[data-cy="event-card"]')
      .should('have.length', 1)
    cy.get('[data-cy="event-list"]')
      .find('[data-cy="list-text-search"]')
      .clear()
  })

  it('allows hovering and clicking on event list items', () => {
    cy.get('[data-cy="event-list"]')
      .find('a[href="events/1"]')
      .should('have.length', 1)
  })
})
