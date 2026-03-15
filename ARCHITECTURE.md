# Architecture Documentation

## How would you scale this to 100k users?

To support more users, the system can be scaled in the following ways:

**Horizontal Scaling**
- Deploy the backend using serverless platforms (Netlify / Vercel / AWS)
- Multiple instances of the API can run simultaneously to handle more requests

**Database Optimization**
- Use a managed database like MongoDB Atlas
- Add indexes on important fields such as userId to speed up queries

**Load Balancing**
- A load balancer distributes incoming traffic across multiple servers

**Stateless APIs**
- Since APIs are stateless, new instances can be added easily when traffic increases

## How would you reduce LLM cost?

LLM calls are expensive, so we should reduce unnecessary requests.

**Analyze Only Once**
- Each journal entry should be analyzed only one time
- Store the emotion, keywords, and summary in the database after analysis

**Avoid Re-analysis**
- When the page reloads, reuse stored analysis instead of calling the LLM again

**Limit Input Size**
- Only send the journal text to the LLM instead of sending full user history

**Use Cheaper Models**
- Use fast and low-cost models like Gemini Flash instead of large models

## How would you cache repeated analysis?

If the same journal text is analyzed again, we can return the previous result instead of calling the LLM.

**Database Caching**
- Before calling the LLM, check if the journal entry already has emotion, keywords, and summary
- If it exists, return the stored result

**In-Memory Cache**
- Use tools like Redis to cache recent analysis results

**Hashing Text**
- Generate a hash of the journal text
- If the same text was analyzed earlier, return the cached result

## How would you protect sensitive journal data?

Journal entries contain personal thoughts, so protecting user data is important.

**HTTPS Encryption**
- All communication between client and server should use HTTPS

**Database Security**
- Store database credentials securely using environment variables
- Restrict database access using authentication and IP whitelisting

**Authentication**
- Add user authentication (login/signup) to prevent unauthorized access to journals

**Data Encryption**
- Sensitive fields can be encrypted before storing them in the database

**Access Control**
- Users should only be able to access their own journal entries using their user ID