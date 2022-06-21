import React from 'react';
import { mount } from '@cypress/react';
import App from './App';

it('Loads', () => {
  mount(<App />);
  cy.get('p').contains('Breed');
});


it('renders list of dog breeds', () => {
  mount(<App />);
  cy.get('#breed_select').contains('australian');
});
it('renders list of dog sub breeds', () => {
  mount(<App />);
  cy.get('#breed_select').select('australian');
  cy.get('p').contains('Sub Breed');
  cy.get('#sub_breed_select').select('shepherd');
});


it('can search for images and gets right number', () => {
  mount(<App />);
  cy.get('#breed_select').select('australian');
  cy.get('#sub_breed_select').select('shepherd');
  cy.get('#number_of_images_requested').type('{backspace}{backspace}3');
  cy.get('#submit_image_search').click();
  cy.get('img')
	.should('be.visible').and(($img) => {
	  expect($img[0].naturalWidth).to.be.greaterThan(0)
	});
  cy.get('img').each((item,index,list) => {
  	expect(list).to.have.length(3);
  });
});