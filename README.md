## Backend challenge

This is the backend challenge.

# Requirements

**NodeJS** >= 8.9.4
**Windows x64 or Unix**
Connection to internet.

# Setup

Clone the repository and install all the dependencies with:

```sh
yarn
```

After that, rename the `.env.example` file to `.env`. I've already defined the database values because I'm using Mongo Atlas to host the project, I had no time to configure it on localhost ;).

### Development mode

Just run the following commands to run on development mode:

```sh
yarn dev
```

It will run a instance of ts-node with nodemon. It will refresh automatically the project if a change have been detected.

### Production mode

This project have been designed to be used with typescript. You can use `ts-node` or the default `node` instance by running the following command to compile the project.

```sh
yarn dist
```

And then run:

```sh
node -r dotenv/config ./dist/server.js
```

# Project architecture

I've decided to split the project into two services: **Mongo** and **Express**. I've turned it into a promise, because when the server is bootstrapping, it will only start the express service only if a connection is stablished to the Mongo database. Both are running by separated instances.

The endpoints are considered as **modules**, because it will be much more easier to maintain and find them on their own folder.

## Modules

The folder architecture on modules must be
| module-name
| --> controllers
| --> models
| --> module-name.route.ts

The controllers folder will contain all the business logic for the specified module.
The models folder will contain the Mongo typegoose model.
The module-name.route.ts will contain the routes to be accessed by the defined endpoint.

## Available endpoints

All endpoints are respective to a restaurant.

The header **Content-Type** must be:
|Content-Type|
|--|
|application/json|

The routes does not have an authentication functionality.

All post content must be a valid JSON and should be submitted as a body content.

### Restaurants routes

| METHOD   | URL              | BODY DATA           | RESPONSE                       |
| -------- | ---------------- | ------------------- | ------------------------------ |
| GET      | /restaurants     |                     | Returns all restaurants.       |
| GET      | /restaurants/:id |                     | Returns a specific restaurant. |
| POST     | /restaurants     | **RestaurantModel** | Creates a new restaurant.      |
| [PATCH]  | /restaurants/:id | **RestaurantModel** | Updates a existing restaurant. |
| [DELETE] | /restaurants/:id |                     | Deletes a restaurant.          |

**Restaurant Model**
|Property|Type|Value|Length
|--|--|--|--|
|name|string|Name of the restaurant|min:3 max:50 |
|address|string|Where is located|min:5 max:50|
|photo|url|A valid url||
|activityDate|**IWorkingDays[]**|Restaurant Working Days||

**IWorkingDays Model**
|Property|Type|Value|Length
|--|--|--|--|
|dayOfWeek|`monday|tuesday|wednesday|thursday|friday|saturday`|Working days. You can do a combination of days: `monday-sunday` is ready as `monday to sunday`||
|times|object|The starting and ending hours. `{"start": "00:00", "end": "12:00"}`||

**Example JSON:**

```json
{
  "name": "Doces da vovó",
  "address": "Rua XV, 15",
  "photo": "https://url.com/a.png",
  "activityDate": [
    {
      "dayOfWeek": "monday-friday",
      "times": {
        "start": "08:00",
        "end": "18:15"
      }
    },
    {
      "dayOfWeek": "saturday-sunday",
      "times": {
        "start": "10:00",
        "end": "14:30"
      }
    }
  ]
}
```

### Categories routes

All categories routes are available after a valid restaurant id. For example:
`/restaurants/:id/categories`

| METHOD   | URL             | BODY DATA         | RESPONSE                                                  |
| -------- | --------------- | ----------------- | --------------------------------------------------------- |
| GET      | /categories     |                   | Returns all categories for the specified restaurant.      |
| GET      | /categories/:id |                   | Returns a specific category for the specified restaurant. |
| POST     | /categories     | **CategoryModel** | Creates a new category for the specified restaurant.      |
| [PATCH]  | /categories/:id | **CategoryModel** | Updates a existing category for the specified restaurant. |
| [DELETE] | /categories/:id |                   | Deletes a specified category.                             |

**Category Model**
|Property|Type|Value|Length
|--|--|--|--|
|restaurantId|string|The restaurant id that you're interacting.||
|name|string|The category name.|min: 3 max: 50|

Example json:

```json
{
    "restaurantId": "123",
    "name", "Sodas"
}
```

### Products Routes

All products routes are available after a valid restaurant id. For example:
`/restaurants/:id/products`
|METHOD|URL|BODY DATA|RESPONSE
|--|--|--|--|
|GET|/products||Returns all products for the specified restaurant.|
|GET|/products/:id||Returns a specific product for the specified restaurant.|
|POST|/products|**ProductModel**|Creates a new product for the specified restaurant.|
|[PATCH]|/products/:id|**ProductModel**|Updates a existing product for the specified restaurant.|
|[DELETE]|/products/:id||Deletes a specified product.|

**Product Model**
|Property|Type|Value|Length
|--|--|--|--|
|restaurantId|string|The restaurant id that you're interacting.||
|name|string|The product name.|min: 3 max: 50|
|photo|url|Valid url photo.||
|price|number|A valid number entity.||
|category|**CategoryModel.id**|You need to place here the created category id.||
|promotion|**IProductPromotion**|If this product has support to a promotions.||

**IProductPromotion**
|Property|Type|Value|Length
|--|--|--|--|
|price|number|A valid number entity.||
|description|string|Promotion description.||
|days|**IWorkingDays**|The definition for when this promotion will be active.||

Example json:

```json
{
  "name": "Coca-Cola",
  "category": "generated category id",
  "price": 10.99,
  "photo": "http://url.com/a.png",
  "promotion": {
    "description": "Coke for 1.99",
    "price": 1.99,
    "days": [
      {
        "dayOfWeek": "monday",
        "times": {
          "start": "10:00",
          "end": "12:00"
        }
      },
      {
        "dayOfWeek": "sunday",
        "times": {
          "start": "09:00",
          "end": "09:15"
        }
      }
    ]
  }
}
```

# TESTS

Todo.

### Developed by

Lucas Reis Máximo Dias - thereis@live.com
