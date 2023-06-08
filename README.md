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

- A hosted MVC structure with separate front and back ends [x]
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


## **Requirements**

1. There are 2 `.env` files for this project:
  - `client/.env` contains: 
    - the `REACT_APP_API_URL` that will be used by React locally to connect to the local backend. Default: `http://localhost:8080/api`
  - `server/.env` contains:
    - `PORT`: the server will be using in the machine. Default `8080`
    - `MONGO_URI`: the serverless MongoDB atlas instance used in the project

2. Make sure that npm is installed

## **Getting Started**

### **Running the app locally**

1. Clone the repository:
```bash
git clone https://github.com/leanjunio/roster-challenge-api-and-ui.git
```
2. Install the dependencies on both client and server folders:

```bash
cd client
npm install
```
```bash
cd server
npm install
```

3. Run the client and server separately

```bash
npm start
```

```bash
npm start
```

4. CRA should automatically open your default browser and navigation to [http://localhost:3000](http://localhost:3000) and render the artists list

5. (optional) On the browser, navigate to [http://localhost:8080/health](http://localhost:8080/health) to see if the server is running. You should receive an `OK` as a response.

## **Deployments**

**Server**: The Node.js server is hosted on a [Render](https://render.com) web service running on the following endpoint: [https://rebel-api-0x0n.onrender.com/health](https://rebel-api-0x0n.onrender.com/health)

**Client**: The frontend is hosted on Vercel, accessible though [https://roster-client.vercel.app/](https://roster-client.vercel.app/)

## **Choice Explanations**

I chose **React** due to my familiarity with the framework as well as the libraries that exists within its ecosystem. Libraries such as **React Hook Form**, **React Table**, and **React Query** are some of the libraries I've used in the past to develop web applications similar to the Roster application the Rebel team asked me to create. I knew what they were capable of and I believe that they fit the use cases that I had for the application.

For client-state management, I opted to use **React Query** as it performs as the best "server-client state synchronization" experience for both the developer and the user. It minimizes (sometimes removes) the necessity in an application to use `React.Context` and `Redux` for global state management due to its ability to handle caching, background updates, and stale data all in its library while also providing useful tools for a better user experience.

On the backend, I chose to go with **MongoDB** and **Node.js using Express as a framework**.

I opted for **Node.js + Express** since it's very quick to get started on it due to its minimalist approach to its setup.

For the database, I used a non-relational, document database in **MongoDB** hosted over the **MongoDB Atlas** cloud provider running in a serverless instance. This is due to a few reasons which comes with a few assumptions as well:
  1. Assuming that the artists' records are frequently updated, NoSQL databases provide great performance when it comes to read/writes.
  2. Assuming more fields are going to be added (or removed) later on, NoSQL provides dynamic changes to their data models.
  3. **MongoDB Atlas** with its serverless instances allows scale on demand depending on the usage of the app. Assuming the app is going to be primarily used in North America (the artist records in the `roster.json` files are primarily well known artists in North America), this means the following:
      - DB workload will automatically scale down to 0 or minimum at night
      - Can scale up again when traffic increases

For cloud hosting, I decided to host the frontend on **Vercel** due to its capability to automatically replicate the site across its global edge network to allowing the client to be served from the nearest CDN to the user. This is also beneficial since the database and the backend are provisioned in North America as well. If majority of the users will be from North America, this would increase the likelihood of reduced latency between the client and the server.

The backend is served on a **render.com**. A platform that allows for quick hosting of web services that provides an experience near to what Vercel offers. I chose this hosting platform mostly for the convenience since it allowed for seamless CI/CD triggered by pushes to the main branch without any GitHub Action setup.

**Rate Limiting**: Since the application is open to the public, it was essential to ensure that it wasn't possible to flood the server with requests. A rate limiter was added on the server to contain api requests to 100 requests from the same IP address for every 15 minutes.

**Pagination ( + Sorting)**: Pagination allows for the most scalable setup so that the client has the best chance for handling a lot of records while maintaining UX and delivering a large amount of records to the browser. The pagination is triggered on the frontend but the API endpoint on the backend is written so that the sorting and pagination happens on the server. This is done for the following reasons:
  1. The frontend won't get all the records at once. If the database had a record of 11M artists, only a subset of those records are delivered to the frontend at once depending on the page record the user is in.
  2. Paginating and sorting on the frontend will consume more memory as the number of records increase. Letting the browser handle this might not be the most optimum solution in the long run.
  3. Having the backend serve paginated and sorted on the backend makes it possible to add a caching layer between the server and the database down the line by using a service like **Redis** to cache repeated queries to the database.
