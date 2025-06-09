Project Goal:
Build a web application that allows users to search, filter, save, edit, and delete lists of HTTP response codes along with their corresponding dog images from https://http.dog/.

Functional Requirements:
User Authentication:

User can sign up and log in.

Each user has their own saved lists.

Search and Filter Page:

User can filter HTTP response codes using patterns:

Exact code (e.g., 203)

Pattern with wildcards like 2xx, 20x, 3xx, 21x (x means any digit).

Show dog images matching the filtered codes dynamically.

Save Filtered Lists:

After filtering, user can save the list with a custom name.

Saved list includes: list name, creation date, response codes, and image URLs.

Lists Management Page:

Display all saved lists of the logged-in user.

User can:

View list details with images

Edit list (add/remove response codes, rename)

Delete list

Editing Lists:

Allow flexible editing of saved lists (e.g., adding/removing response codes).

UI/UX creativity is encouraged here.

Technical Notes:
Use a backend database to store user credentials and lists.

Use API or direct URLs from https://http.dog/ to fetch images for response codes.

Filtering logic must support patterns with x as a wildcard digit.

The app must have at least three pages: Login/Signup, Search, and Lists Management.

The app should be deployed on a free hosting service (not just localhost).