describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testuser'
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function() {
    cy.contains('login to the application');
    cy.contains('username');
    cy.contains('password');
    cy.get('button').contains('login');
  });

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser');
      cy.get('#password').type('testuser');
      cy.get('#login-btn').click();

      cy.contains('Test User logged-in');
    });

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-btn').click();

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

});