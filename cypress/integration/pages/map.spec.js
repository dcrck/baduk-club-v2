describe('Map page', () => {
  before(() => {
    cy.visit('map')
  })

  it('renders', () => {
    cy.get('.mapboxgl-map')
  })

  it('loads markers', () => {
    cy.get('.marker')
  })

  it('displays popup when marker is clicked', () => {
    cy.get('.marker')
      .first()
      .click({ force: true })
      .should('have.class', 'selected')
    cy.get('.popup')
    cy.get('.feather.x').click()
    cy.get('.popup').should('not.exist')
  })

  it('switches popup with another marker is clicked', () => {
    let firstPopup
    cy.get('.marker')
      .first()
      .click({ force: true })
      .then($marker => (firstPopup = $marker.attr('title')))
    cy.get('.marker')
      .first()
      .next()
      .click({ force: true })
    let name
    cy.get('.popup')
      .get('h2')
      .then($h2 => (name = $h2.text()))
    cy.get('.marker.selected').then($marker => {
      expect($marker.attr('title'))
        .to.equal(name)
        .and.to.not.equal(firstPopup)
    })
  })

  it('shows country by default when a country code is indicated', () => {
    cy.visit('map/FRA').then(() => {
      cy.wait(10000)
      cy.document().toMatchImageSnapshot({
        name: 'france',
        threshold: '0.01',
      })
    })
  })

  it('shows add meetup button on log in', () => {
    cy.request('login?test=1').then(() => cy.visit('map'))
    cy.wait(5000)
      .get('[data-cy="add-meetup-button"]')
      .should('exist')
      .click()
  })
})
