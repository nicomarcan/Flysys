function Node(value){
  this.value= [] ;
  this.value[0] = value;
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
  if(c(node.value[0],value) > 0){
    node.left = insertR(node.left,value,c);
  } else if (c(node.value[0],value) < 0) {
    node.right = insertR(node.right,value,c);
  } else {
    node.value[node.value.length]=value;
  }
  return node;
};

var inOrderR = function(node,array,i){
  if(node === null){
    return i;
  }
  i = inOrderR(node.left,array,i);
  for(var k=0; k<node.value.length ; k++,i++){
    array[i]=node.value[k];
  }
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
