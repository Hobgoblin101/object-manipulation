class ObjectManager{}

ObjectManager.getDiffList = function(obj1, obj2){

  if (this.isFunction(obj1) || this.isFunction(obj2)){
    throw 'Invalid argument. Function given, object expected.';
  }
  if (this.isValue(obj1) || this.isValue(obj2)){
    return this.compareValues(obj1, obj2);
  }

  var diff = {};

  for (let key in obj1){
    if (this.isValue(obj1[key])){
      diff[key] = this.compareValues(obj1[key], obj2[key]);
    }else{
      if (this.isObject(obj2[key]) || this.isArray(obj2[key])){
        if (JSON.stringify(obj1[key]) == JSON.stringify(obj2[key])){
          diff[key] = 'equal';
        }else{
          diff[key] = this.getDiffList(obj1[key], obj2[key]);
        }
      }else{
        diff[key] = this.compareValues(obj1[key], obj2[key]);
      }
    }
  }

  for (let key in obj2){
    if (typeof(diff[key]) == 'string'){
      continue;
    }

    if (this.isValue(obj1[key])){
      diff[key] = this.compareValues(obj1[key], obj2[key]);
    }else{
      if (this.isObject(obj2[key]) || this.isArray(obj2[key])){
        if (JSON.stringify(obj1[key]) == JSON.stringify(obj2[key])){
          diff[key] = 'equal';
        }else{
          diff[key] = this.getDiffList(obj1[key], obj2[key]);
        }
      }else{
        diff[key] = this.compareValues(obj1[key], obj2[key]);
      }
    }
  }

  return diff;
};

ObjectManager.passNew = function(obj1, obj2){
  console.log('1', obj1);
  console.log('2', obj2);
  var diff = this.getDiffList(obj1, obj2);
  console.log('diff', diff);

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
          output[key] = this.passNew(obj1[key], obj2[key]);
        }
    }
  }

  return output;
};

ObjectManager.compareValues = function(original, current){
  //Equal?
  if (original === current){
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

ObjectManager.isFunction = function(obj){
  return {}.toString.apply(obj) === '[object Function]';
};

ObjectManager.isObject = function(obj){
  return {}.toString.apply(obj) === '[object Object]';
};

ObjectManager.isArray = function(obj){
  return {}.toString.apply(obj) === '[object Array]';
};

ObjectManager.isValue  = function(obj){
  return !this.isObject(obj) && !this.isArray(obj);
};

ObjectManager.merg = function (obj1, obj2, recursive = true){
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

ObjectManager.firstUndefined = function(array = [], overflow = 1000){
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

module.exports = ObjectManager;
