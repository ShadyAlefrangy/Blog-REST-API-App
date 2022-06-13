# Blog-REST-API-App
I created a Blog REST API app using Express, Node.js and MongoDB that fulfill the following requirements:
  1.	I exposed REST API endpoints for managing the Blog
    1.	All REST API endpoint should be exposed under /api/… route
    2.	I exposed /api/auth for user authentication using JWT
      1.	Authenticate users using email and password
      2.	Include User id as sub in JWT header and user type (admin, author) in payload.


  2.	I had has only 3 types of users:
    1.	Admin: a single user who is responsible for managing the Blog website from Admin Dashboard
    2.	Author: multiple user who write blog Posts
    3.	User: anonymous user who navigates to website to view public content
    4.	Each user has an id (unique and not guessable), email, password. All passwords should be stored hashed in the database.


  3.	The Post (article) is the main content published on website
  
  4.	Each Post has the following details:
    1.	Unique id: don’t use guessable ids like simple numbers 1, 2, 3... use complex id 1cNBDQILlp7wyndYwMoP, j5MossfJ4ex4oqULHziR…
    2.	title
    3.	content
    4.	image: allows uploading images and return a URL for that image
    5.	status:
      1.	draft: Post still under review, only admin can see
      2.	published: Post is public and users can read publicly
    6.	publish date (date when Post was published and went public)
    7.	author: Author id that should exist in Authors users
    8.	tags: list of tags ids that should exist in Tags list
  
  5.	The Posts endpoints /posts allow developers:
    1.	List Posts, only return 10 Posts by default with pagination to show other Posts, ?page=2&count=5
      1.	Allow selection of fields to return, for example: ?fields=id,title should return Posts with id and title fields only.
      2.	Use content to return all content or excerpt to return just first 50 characters of content
      3.	Allow filter Posts using tags ?tag=html,css
      4.	Allow searching Posts using title only ?query=node.js%20coding, it should return any Post that has this query in title ignoring the case
      5.	Always return read_more field that has a URL for that specific Post read_more: http://localhost:3000/api/posts/1cNBDQILlp7wyndYwMoP
    2.	Create, return, update or delete specific Post by id
    3.	Only return list of published Posts for Users
      1.	Only Admin is allowed to get all Posts for including draft
      2.	Only return list of published Post and Author draft Posts
    4.	Only Authors are allowed to create new Posts
    5.	Only Post Author is allowed to update Post title, content, image and tag
    6.	Only Admin is allowed to delete any Post


  6.	The Authors endpoints /authors allow developers:
    1.	List Authors
    2.	Each Author should has:
      1.	unique id: complex id not simple guessable ids
      2.	first name: only characters and spaces allowed
      3.	last name: only characters and spaces allowed
      4.	bio: simple brief about the Author
      5.	email: Author valid email address
      6.	links: list of links to Author’s website or social media accounts
    3.	Create, return, update or delete specific Author by id
    4.	Only Admin is allowed to create, update or delete Authors
    5.	Only Author is allowed to update their own details


  7.	The Tags endpoints /tags should developers:
    1.	List all Tags
    2.	Each Tag should has id and name
    3.	Create, return, update or delete specific Tag
    4.	Only Admin are allowed to update or delete tags
    5.	Only Admin and Authors are allowed to create new Tags
  
  8.	Allow developers to list a Tag Posts through /tags/:id/posts
  
  9.	Allow developers to list an Author Posts through /authors/:id/posts
  
  10.	The Comments endpoints /posts/:id/comments allow developers:
    1.	List all Post Comments
    2.	Each Comment should has:
      1.	unique id: complex id not simple guessable ids
      2.	name: the commenter name
      3.	email: commenter valid email address
      4.	comment: text of comment
    3.	Create, return or delete specific Comment
    4.	Listing and creating comments doesn’t require authentication
    5.	Only Admin is allowed to delete specific Comment
    6.	No one is allowed to edit a Comment


  11.	I had a swagger docs UI for all endpoints, that is working and can be used to test all endpoints.

  12.	I had a simple front-end UI that allow users to:
    1.	Display a list of Posts with pagination
    2.	Display only Post id, title, publish date and Author first name
    3.	I user ejs view engine to view posts

