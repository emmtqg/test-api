// import { MapsLocalGasStation } from "material-ui/svg-icons";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
Cypress.Commands.add('login', () => {
  cy.server();
  cy.route(
    'POST',
    'https://players-api.developer.alchemy.codes/api/login',
    'fixture:login.json',
  ).as('loginUser');
  cy.route(
    'GET',
    'https://players-api.developer.alchemy.codes/api/players',
    'fixture:getPlayers.json',
  ).as('getPlayers');
  cy.visit('/login');
  cy.get('#email').type('billybob@example.com');
  cy.get('#password').type('abc123');
  cy.get('#login').click();
  cy.wait(['@loginUser', '@getPlayers']);
});
