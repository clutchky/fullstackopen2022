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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({username: 'testuser', password: 'testuser'});
      cy.createBlog({
        title: 'E2E default blog one',
        author: 'E2E author one',
        url: 'e2eurlone.com'
      });
      cy.createBlog({
        title: 'E2E default blog two',
        author: 'E2E author two',
        url: 'e2eurltwo.com'
      });
    });

    it('a blog can be created', function() {
      cy.contains('create new blog').click();
      cy.get('#blog-title').type('E2E test blog');
      cy.get('#blog-author').type('E2E test user');
      cy.get('#blog-url').type('localhost:3003');
      cy.get('#create-btn').click();
      cy.contains('E2E test blog - E2E test user');
    });
  });

});