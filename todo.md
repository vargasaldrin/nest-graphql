# Registration

-  [x] Users must be able to register an account using email/username and password and other info like (first name, last name, aboutMe, birth date, gender, etc.)
-  [x] Passwords must be encrypted

# Login

-  [x] Registered user must be able to login using bearer token

# User

-  [x] User must be able to post an NFT with required image, title, description, category, price
-  [x] User must be able to view other users profile
-  [x] User must be able to view his/her wallet balance
-  [x] Other user must not be able to view other users wallet balance
-  [x] User must be able to update profile
-  [x] User must be able to buy not deleted NFTs and <= currentBalance
-  [x] User must not be able to softDelete other NFT post
-  [x] User must be able to softDelete his/her NFT
-  [x] If User is taken down, he/she must not be able to login the app / access any APIs that requires credentials except registration

# Comment

-  [x] User must be able to add comment on NFT
-  [x] User must be able to update his/her comment
-  [x] User must be able to delete his/her comment
-  [O] Add paginations in comments

# Admin

-  [x] Must be able to softDelete any NFT
-  [x] Must be able to take down a user
-  [x] Must be able to lift a taken down user

# Marketplace

-  [x] Users must be able to perform an advanced search of NTFs. return any NFT that matches the keywords on (title, description, category, owner, creator, etc.)
-  [x] User must be able to sort NFTs with advanced search results
-  [O] Marketplace advanced search and filter must have pagination (total, limit, offset, page, totalPage, etc)
-  [x] Advanced search and filter must not include deleted NFTs

# NFT Details

-  [x] User must be able to view NFT details including comments
-  [x] Wallet must increase/decrease when buying NFT or posted NFT has been bought

# Best Practice

-  [o] Validations and error handling must be applied in any API you will create
-  [o] Apply unit tests on business logic/service layer
