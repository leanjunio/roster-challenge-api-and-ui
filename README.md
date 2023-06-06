# Full Stack Development Challenge

## The Roster - Synopsis

You're a developer working for a music record label and the accounting team needs your help!

---

## The Task

Given a data dump of your artist roster, the task is to build a web application to store the data and serve it to a front end application of your design. This application will be used by the accounting team to pay out the correct streaming royalties to respective artists.

You receive the data in the form of a [json file](./roster.json) containing an array of objects with the following fields:

- artist => _Artist Name_
- rate => _Payment rate per stream_
- streams => _Number of Streams_

Your minimum application requirements include:

- A hosted MVC structure with separate front and back ends
- Displaying the list in a web browser [x]
- Extending the list to include the calculated payout amount per artist [x]
- CRUD services for artists and rates [x]
- Adding a field to toggle (and persist) whether the artist payout is complete (eg: checkbox) [x]
- Display is sorted in descending order by payout amount [x]

Bonus
- This data feed is, as it turns out, all-time cumulative streams. The artists get paid monthly. Add a column showing average payout per month. Assumptions: rate of streams per month is constant, for artists that predate streaming, assume streaming started with Spotify launch in April 2006. [x]

---

## Technical Specs

**This challenge is language and services agnostic. Use whatever you're comfortable with.**

eg:

- Front end: React, Angular, Vue.js, Vanilla JS, etc...
- API: RESTful or GraphQL
- Backend: .NET, Node.js, PHP, etc...
- Storage: S3, DB(SQL/NoSQL), etc...
- Infrastructure: Docker, Serverless, Heroku, etc.. 

---

## **Show us what you got!**

**Focus on the area of the stack in which you are most comfortable and would like to showcase.**

For example:

- Focusing more on the aesthetic design and interactions of the application while simply serving the data directly from the provided json file.
- Implementing a full database and backend while keeping the front end simpler.
- Anywhere in between

**You will be measured on:**

- Attention to detail
- Instructions to run your application
- A very brief explanation of your choices throughout the challenge
- Code quality
- UI Design (if that's the focus you chose)
- Testing

**Submission Requirements:**

- A link to your GitHub code repository (or silmilar) that allows us to view and download the code
- Instructions on how to run the code locally
- A link to your app which is hosted (using AWS, Azure, GCP, or similar)

## Good luck, and have fun!

## Instructions

NOTE: The backend is connected to a serverless mongodb instance on atlas. The uri is stored in a .env file.

Run the client and server separately

```bash
cd server
npm start
```

```bash
cd client
npm start
```

Navigate to `localhost:3000` to view the artist page

### Links

Render Backend URL: https://rebel-api-0x0n.onrender.com/

### Chosen considerations

I decided to opt for a MERN stack since that's where my comfort and familiarity lies.

