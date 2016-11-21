class ObjectManager{}

ObjectManager.prototype.getDiffList = function(obj1, obj2, skipableRecursive){
  if (this.isFunction(obj1) || this.isFunction(obj2)){
    throw 'Invalid argument. Function given, object expected.';
  }
  if (this.isValue(obj1) || this.isValue(obj2)){
    return this.compareValues(obj1, obj2);
  }

  var diff = {};

  for (let key in obj1){
    if (this.isValue(obj1)){
      diff[key] = this.compareValues(obj1[key], obj2[key]);
    }else{
      //if it is an array or object
      if (!this.isValue(obj2[key])){
        //if they are both objects/arrays
        diff[key] = this.getDiffList(obj1[key], obj2[key]);
      }else if (this.isObject(obj1[key])){
        if (this.isObject(obj2[key])){
          if (skipableRecursive){
            //Check if the two objects are completely the same
            if (JSON.stringify(obj1[key]) == JSON.stringify(obj1[key])){
              //if so then that part is equal
              diff[key] = "equal";
              continue;
            }
          }else{
            diff[key] = this.getDiffList(obj1[key], obj2[key], skipableRecursive);
            continue;
          }
        }else{
          if (skipableRecursive){
            diff[key] = "updated";
            continue;
          }else{
            diff[key] = this.getDiffList(obj1[key], obj2[key], skipableRecursive);
            continue;
          }
        }
      }else{
        if (skipableRecursive){
          diff[key] = "updated";
          continue;
        }else{
          diff[key] = this.getDiffList(obj1[key], obj2[key], skipableRecursive);
          continue;
        }
      }
    }
    continue;
  }

  for (let key in obj2){
    if (this.isValue(obj2)){
      diff[key] = this.compareValues(obj2[key], obj1[key]);
    }else{
      //if it is an array or object
      if (!this.isValue(obj1[key])){
        //if they are both objects/arrays
        diff[key] = this.getDiffList(obj2[key], obj1[key]);
      }else if (this.isObject(obj2[key])){
        if (this.isObject(obj1[key])){
          if (skipableRecursive){
            //Check if the two objects are completely the same
            if (JSON.stringify(obj2[key]) == JSON.stringify(obj2[key])){
              //if so then that part is equal
              diff[key] = "equal";
              continue;
            }
          }else{
            diff[key] = this.getDiffList(obj2[key], obj1[key], skipableRecursive);
            continue;
          }
        }else{
          if (skipableRecursive){
            diff[key] = "updated";
            continue;
          }else{
            diff[key] = this.getDiffList(obj2[key], obj1[key], skipableRecursive);
            continue;
          }
        }
      }else{
        if (skipableRecursive){
          diff[key] = "updated";
          continue;
        }else{
          diff[key] = this.getDiffList(obj2[key], obj1[key], skipableRecursive);
          continue;
        }
      }
    }
    continue;
  }

  return diff;
};

ObjectManager.prototype.passNew = function(obj1, obj2, skipableRecursive){
  var diff = this.getDiffList(obj1, obj2, skipableRecursive);

  var output = {};

  for (let key in diff){
    switch (diff[key]) {
      case "updated":
        output[key] = obj2[key];
        break;
      case "equal":
        break;
      case "deleted":
        output[key] = undefined;
        break;
      case "new":
        output[key] = obj2[key];
        break;
      default:
        //Is array or object?
        if (!this.isValue(diff[key])){
          output[key] = this.passNew(obj1[key], obj2[key], skipableRecursive);
        }
    }
  }

  return output;
};

ObjectManager.prototype.compareValues = function(original, current){
  //Equal?
  if (original == current){
    return 'equal';
  }
  //Has the item added?
  if (typeof(original) == 'undefined' && typeof(current) != 'undefined'){
    return 'new';
  }
  //Has the item been removed?
  if (typeof(current) == 'undefined' && typeof(original) != 'undefined'){
    return 'deleted';
  }
  //Changed?
  if (current != original){
    return 'updated';
  }
  //else
  return 'equal';
};

ObjectManager.prototype.isFunction = function(obj){
  return {}.toString.apply(obj) === '[object Function]';
};

ObjectManager.prototype.isObject = function(obj){
  return {}.toString.apply(obj) === '[object Object]';
};

ObjectManager.prototype.isArray = function(obj){
  return {}.toString.apply(obj) === '[object Array]';
};

ObjectManager.prototype.isValue  = function(obj){
  return !this.isObject(obj) && !this.isArray(obj);
};

ObjectManager.prototype.merg = function (obj1, obj2, recursive = true){
  if (typeof(obj1) != "object"){
    obj1 = {};
  }
  if (typeof(obj2) != "object"){
    obj2 = {};
  }
  for (var attrname in obj2){
    if (recursive){
      if (typeof(obj2[attrname]) == 'object' && typeof(obj1[attrname])){
        obj1[attrname] = module.exports.merg(obj1[attrname], obj2[attrname]);
      }else{
        if (typeof(obj2[attrname]) != 'undefined'){
          obj1[attrname] = obj2[attrname];
        }
      }
    }else{
      obj1[attrname] = obj2[attrname];
    }
  }
  return obj1;
};

ObjectManager.prototype.firstUndefined = function(array = [], overflow = 1000){
  if (this.isArray(array)){
    let index = 0;
    while(index < overflow){
      if (typeof(array[index]) == "undefined"){
        return index;
      }else{
        index += 1;
      }
    }

    console.error('***ERROR: Killing Process due to not finding empty index after 1000\nRecommend expanding overflow object-manipulation.firstUndefined(array, overflow)');

    return -1;
  }else{
    console.error("***ERROR: Array Invalid Input");
    return -1;
  }
};

module.exports = new ObjectManager();
