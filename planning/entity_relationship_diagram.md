# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

[👉🏾👉🏾👉🏾 List each table in your diagram]

## Add the Entity Relationship Diagram

- User: Stores user account information (email, password, display name, etc.).
- Category: Stores the predefined categories for filtering (e.g., "Furniture," "Tools").
- Listing: Stores all the details for each item posted for sale (title, price, seller, etc.).
- Photo: Stores the images associated with each listing.
- Favorite: A junction table that links Users to the Listings they have saved.
- Message: Stores the in-app messages sent between users about a specific listing.


[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | name of the shoe model |
| ... | ... | ... |


```mermaid
erDiagram
    User {
        INTEGER id PK "Unique user ID"
        VARCHAR email "Login email"
        VARCHAR password_hash "Hashed password"
        VARCHAR display_name "Public name"
        VARCHAR location_zip "Zip code for search"
        TIMESTAMP created_at
    }

    Category {
        INTEGER id PK "Unique category ID"
        VARCHAR name "e.g., Furniture, Tools"
    }

    Listing {
        INTEGER id PK "Unique listing ID"
        INTEGER seller_id FK "References User.id"
        INTEGER category_id FK "References Category.id"
        VARCHAR title
        TEXT description
        DECIMAL price
        BOOLEAN is_available
        TEXT pickup_notes
        TIMESTAMP created_at
    }

    Photo {
        INTEGER id PK "Unique photo ID"
        INTEGER listing_id FK "References Listing.id"
    }

    Favorite {
        INTEGER user_id FK "References User.id (Composite PK)"
        INTEGER listing_id FK "References Listing.id (Composite PK)"
        TIMESTAMP favorited_at
    }

    Message {
        INTEGER id PK "Unique message ID"
        INTEGER listing_id FK "References Listing.id"
        INTEGER sender_id FK "References User.id"
        INTEGER receiver_id FK "References User.id"
        TEXT content
        TIMESTAMP sent_at
    }

    %% --- Relationships ---
    User ||--o{ Listing : "posts"
    User }o--|| Favorite : "saves"
    User ||--o{ Message : "sends"
    User ||--o{ Message : "receives"
    
    Category ||--o{ Listing : "categorizes"
    
    Listing }o--|| Favorite : "is_saved"
    Listing ||--o{ Photo : "has"
    Listing ||--o{ Message : "concerns"
