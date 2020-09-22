var classTag = document.getElementById('classTag')
var workTag = document.getElementById('workTag')
var sumbitId = document.getElementById('sumbitId')
var spanId = document.getElementById('spanId')


classTag.addEventListener('change', () =>{
    if(classTag.value > 10) {
      sumbitId.disabled = true;
      spanId.innerHTML = "Too big"
    }
    else {
        sumbitId.disabled = false;
        spanId.innerHTML ="";

    }
});

workTag.addEventListener('change', () =>{
    if(workTag.value > 15) {
      sumbitId.disabled = true;
      spanId.innerHTML = "Too big"
    }
    else {
        sumbitId.disabled = false;
        spanId.innerHTML ="";

    }
});
