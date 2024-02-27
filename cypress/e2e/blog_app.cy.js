describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      username: 'tomerzibman',
      password: 'testing',
      name: 'Tomer Zibman',
    });
    cy.visit('');
  });

  it('Login form is shown', function () {
    cy.contains('login');
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('tomerzibman');
      cy.get('#password').type('testing');
      cy.get('#login-button').click();
      cy.contains('Tomer Zibman is logged in');
      cy.get('.success')
        .should('contain', 'Successfully logged in as tomerzibman')
        .and('have.css', 'color', 'rgb(74, 200, 74)');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('tomerzibman');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();
      cy.should('not.contain', 'Tomer Zibman is logged in');
      cy.get('.error')
        .should('contain', 'invalid credentials')
        .and('have.css', 'color', 'rgb(243, 72, 72)');
    });

    describe('When logged in', function () {
      beforeEach(function () {
        cy.login('tomerzibman', 'testing');
        cy.visit('');
      });

      it('A blog can be created', function () {
        cy.contains('new blog').click();
        cy.get('#title').type('like wtf?');
        cy.get('#author').type('mr glock');
        cy.get('#url').type('www.url.com');
        cy.get('#create-button').click();

        cy.contains('like wtf?');
        cy.contains('mr glock');
        cy.get('.success').should(
          'contain',
          'Successfully added like wtf? by mr glock',
        );
      });

      describe('And a blog exists', function () {
        beforeEach(function () {
          cy.createBlog('like wtf?', 'mr glock', 'www.url.com');
          cy.visit('');
        });

        it('user can like a blog', function () {
          cy.contains('show').click();
          cy.contains('like').click();

          cy.get('html').should('contain', '1');
        });

        it('user can delete own blog', function () {
          cy.contains('show').click();
          cy.contains('remove').click();

          cy.should('not.contain', 'like wtf?');
          cy.get('.success').should('contain', 'Successfully removed blog');
        });

        describe('when there are multiple blogs', function () {
          beforeEach(function () {
            cy.createBlog('blog1', 'mr glock', 'www.url.com', 10);
            cy.createBlog('blog2', 'mr glock', 'www.url.com', 5);
            cy.visit('');
          });

          it('they are displayed by order of likes', function () {
            cy.get('.blog').then((blogs) => {
              for (let i = 0; i < blogs.length - 1; i++) {
                const curBlogLikes = parseInt(
                  blogs.eq(i).find('.likes').text(),
                );
                const nextBlogLikes = parseInt(
                  blogs
                    .eq(i + 1)
                    .find('.likes')
                    .text(),
                );

                expect(curBlogLikes).to.be.at.least(nextBlogLikes);
              }
            });
          });
        });
      });
    });
  });
});
