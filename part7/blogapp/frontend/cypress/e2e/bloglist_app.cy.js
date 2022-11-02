describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const userOne = {
      name: "Test User",
      username: "testuser",
      password: "testuser",
    };
    const userTwo = {
      name: "John Smith",
      username: "johnsmith",
      password: "johnsmith",
    };
    cy.request("POST", "http://localhost:3003/api/users", userOne);
    cy.request("POST", "http://localhost:3003/api/users", userTwo);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("login to the application");
    cy.contains("username");
    cy.contains("password");
    cy.get("button").contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("testuser");
      cy.get("#password").type("testuser");
      cy.get("#login-btn").click();

      cy.contains("Test User logged-in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("salainen");
      cy.get("#login-btn").click();

      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "testuser", password: "testuser" });
      cy.createBlog({
        title: "E2E default blog one",
        author: "E2E author one",
        url: "e2eurlone.com",
        likes: 3,
      });
      cy.createBlog({
        title: "E2E default blog two",
        author: "E2E author two",
        url: "e2eurltwo.com",
        likes: 4,
      });
    });

    it("a blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#blog-title").type("E2E test blog");
      cy.get("#blog-author").type("E2E test user");
      cy.get("#blog-url").type("localhost:3003");
      cy.get("#create-btn").click();
      cy.contains("E2E test blog - E2E test user");
    });

    describe("blogs are ordered by most likes", function () {
      it("blog with most likes is on top", function () {
        // default order
        cy.get(".blog").eq(0).should("contain", "E2E default blog two");
        cy.get(".blog").eq(1).should("contain", "E2E default blog one");
        cy.get(".blog").eq(1).find("button").as("toggleButton");
        cy.get("@toggleButton").click();
        cy.contains("like").click();
        // same number of likes, no change
        cy.get(".blog").eq(0).should("contain", "E2E default blog two");
        cy.get(".blog").eq(1).should("contain", "E2E default blog one");
        cy.wait(6000);
        cy.contains("like").click();
        // most liked is updated
        cy.get(".blog").eq(0).should("contain", "E2E default blog one");
        cy.get(".blog").eq(1).should("contain", "E2E default blog two");
      });
    });

    it("a blog can be liked", function () {
      cy.contains("E2E default blog two - E2E author two")
        .parent()
        .find("button")
        .as("toggleButton");
      cy.get("@toggleButton").click();
      cy.contains("like").click();
      cy.contains("likes").parent().find("span").should("contain", "5");
    });

    it("a blog can be deleted", function () {
      cy.contains("E2E default blog one - E2E author one")
        .parent()
        .find("button")
        .as("toggleButton");
      cy.get("@toggleButton").click();
      cy.contains("remove").click();
      cy.contains("E2E default blog one - E2E author one").should("not.exist");
    });

    describe("when logged in with another user", function () {
      it("blog by other users cannot be deleted", function () {
        cy.contains("logout").click();
        cy.login({ username: "johnsmith", password: "johnsmith" });
        cy.contains("John Smith logged-in");
        cy.contains("E2E default blog one - E2E author one")
          .parent()
          .find("button")
          .as("toggleButton");
        cy.get("@toggleButton").click();
        cy.get("@toggleButton").parent().should("not.contain", "remove");
      });
    });
  });
});
