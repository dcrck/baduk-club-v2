import { execute, del } from '../../../src/api/db/index'

const cyreq = (endpoint, options) =>
  cy.request({ url: endpoint, ...options, failOnStatusCode: true })
const headers = {
  'x-hasura-admin-secret': Cypress.env('HASURA_ADMIN_SECRET'),
}
const gql = q =>
  execute(
    {
      query: q,
      headers,
      endpoint: Cypress.env('DATABASE_ENDPOINT'),
      extractJSON: r => r.body,
    },
    cyreq
  )

describe('Event form', () => {
  before(() => {
    cy.request('login?test=1').then(() => cy.visit('test/EventForm'))
  })

  it('only allows a single meeting time entry for one-time meetups', () => {
    cy.get('label[for="__once__"]')
      .wait(500)
      .click()
      .click()
    cy.get('[data-cy="start-date"]').type('2019-09-01')
    cy.get('[data-cy="end-date"]').type('2019-09-01')
    cy.get('[data-cy="start-time"]').type('12:00')
    cy.get('[data-cy="end-time"]').type('13:00')
    cy.get('[data-cy="add-time"]').click()
    cy.get('[data-cy="add-time"]').should('not.exist')
    cy.get('[data-cy="cancel-event-form"]').click()
  })

  it('prevents no name', () => {
    cy.get('#name').clear()
    cy.get('[data-cy="submit-event-form"]').should('be.disabled')
    cy.get('[data-cy="cancel-event-form"]').click()
  })

  it('prevents no address', () => {
    cy.get('#address').clear()
    cy.get('[data-cy="submit-event-form"]').should('be.disabled')
    cy.get('[data-cy="cancel-event-form"]').click()
  })

  it('prevents invalid address', () => {
    cy.get('#address')
      .type('15198')
      .blur()
    cy.get('[data-cy="submit-event-form"]').should('be.disabled')
    cy.get('[data-cy="cancel-event-form"]').click()
  })

  it('prevents clearing a valid address', () => {
    cy.get('#address')
      .clear()
      .type('15198')
    cy.get('[data-cy="search-result"]')
      .first()
      .click()
    cy.get('#address')
      .type('{backspace}')
      .wait(500)
      .blur()
    cy.get('[data-cy="submit-event-form"]').should('be.disabled')
    cy.get('[data-cy="cancel-event-form"]').click()
  })

  it('allows a user to create a meetup', () => {
    cy.get('#address')
      .clear()
      .type('15198 Hook Hollow Road, Novelty')
    cy.get('[data-cy="search-result"]')
      .contains('15198 Hook Hollow')
      .click()
    cy.get('label[for="__weekly__"]').click()
    cy.get('#name').type('Test Meetup')
    cy.get('[data-cy="start-time"]').type('17:00')
    cy.get('[data-cy="end-time"]').type('19:00')
    cy.get('[data-cy="add-time"]')
      .should('not.be.disabled')
      .click()
    cy.get('#description').type('Sample description!')
    cy.get('#private')
      .click()
      .click()
    cy.get('[data-cy="submit-event-form"]')
      .should('not.be.disabled')
      .click()
  })

  it('allows users to edit an already-created meetup', () => {
    cy.get('#name').should('have.value', 'Test Meetup')
    cy.get('[data-cy="submit-event-form"]').should('be.disabled')
    cy.get('#name').clear()
    cy.get('[data-cy="submit-event-form"]').should('be.disabled')
    cy.get('#name').type('Test Meetup ABC')
    cy.get('[data-cy="submit-event-form"]')
      .should('not.be.disabled')
      .click()
    cy.get('#name').should('have.value', 'Test Meetup ABC')
  })

  after(() => {
    gql(
      del('events', {
        filters: {
          where: {
            address: {
              _eq: '15198 Hook Hollow Road, Novelty, Ohio 44072, United States',
            },
          },
        },
      })
    )
  })
})
