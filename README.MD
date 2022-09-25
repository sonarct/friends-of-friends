### To run application

```
npm i
npm start
```

There were my attempts to build query only with JOINs, but
it was extremely hard to avoid duplicated records. So I continued with subqueries.

To keep search performant there have been created indexes:
- for column **name** in **Users**;
- for column **userId** in **Friends**;
- for column **friendId** in **Friends**

Also, using of EXISTS instead of IN significantly increased performance of search query.

Current implementation works with 3 connection levels.
*If you want you can uncomment part of the search query with 4 connection level
and check how it works. It's really slow :)*

On my Macbook Air (M1/16GB) average query for 3 connection level takes ~90ms.

Unfortunately, with current db structure and sqlite I didn't find ways
to make performant 4 connection level. The reason - extremely
high complexity u*f^4 that is approximately O(n^5).

Solution - start using graph database (like neo4j). It's overkill for
regular friend's relations. But, if our goal is to manage so deep connection levels
it's highly desirable to use graph database.

We can also build something like graph database on top of sql database. Using sql database as simple storage
and javascript as layer with all logic. But, I'm not sure that such solution will be competitive with neo4j.
