# Homework 3.1

```bash
$ mongoimport -d school -c students < students.json
$ node index.js
Done
$ mongo
MongoDB shell version: 2.4.9
connecting to: test
> use school
switched to db school
> db.students.aggregate({'$unwind':'$scores'},{'$group':{'_id':'$_id', 'average':{$avg:'$scores.score'}}}, {'$sort':{'average':-1}}, {'$limit':1})
{
	"result" : [
		{
			"_id" : 13,
			"average" : 91.98315917172745
		}
	],
	"ok" : 1
}
```

## Answer: `13`
