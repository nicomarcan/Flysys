function Node(value){
  this.value=value;
  this.left=null;
  this.right=null;
}

function Tree(comparator){
  this.root=null;
  this.comparator=comparator;
}

var insertR = function(node,value,c){
  if(node === null){
    return new Node(value);
  }
  if(c(node.value,value) >= 0){
    node.left = insertR(node.left,value,c);
  } else {
    node.right = insertR(node.right,value,c);
  }
  return node;
};

var inOrderR = function(node,array,i){
  if(node === null){
    return i;
  }
  var i = inOrderR(node.left,array,i);
  array[i++]=node.value;
  return inOrderR(node.right,array,i);
};


Tree.prototype.insert = function(value){
  this.root=insertR(this.root,value,this.comparator);
}

Tree.prototype.inOrder = function(){
  var array = [];
  inOrderR(this.root,array,0);
  return array;
}
