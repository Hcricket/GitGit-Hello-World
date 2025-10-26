function factorial (n) {
  if (n === 0) 
    return 1;
  if (n < 0)throw("throw error")

  let result = 1;
  for( i = n ; i >= 1 ; i--){
      result *= i;
    }
    return result; 
}
 
console.log(factorial(4))