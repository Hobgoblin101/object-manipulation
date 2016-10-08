A quick and easy object manipulation library.


##ObjectManager.getDiffList(obj1, obj2, skipableRecursive)  

obj1, and obj2, must be objects  
skipableRecursive must be either a boolean or undefined

Parse an array of strings listing whether each part is new, old, updated, or equal.  
skipableRecursive will stop the function from looping down into another layer  
if there is an object with an object.  


##ObjectManager.passNew(obj1, obj2, skipableRecursive)  

Similar to getDiffList, but it will pass a object of which is only the new items


##ObjectManager.merg(obj1, obj2, recursive)  

Will run though the two objects and merg objects 1 & 2 with 2 overwriting  
object 1 where necessary.  
recursive is default true



##ObjectManager.isFunction(item)  

Will parse a boolean on whether item is a function or not


##ObjectManager.isObject(item)  

Will parse a boolean on whether item is a object {} or not


##ObjectManager.isArray(item)  

Will parse a boolean on whether item is a array [] or not
