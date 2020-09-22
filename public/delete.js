var deleteButton = document.getElementsByClassName('deleteButton')

Array.from(deleteButton).forEach(function(element) {
      element.addEventListener('click', function(){
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        // const msg = this.parentNode.parentNode.childNodes[3].innerText
        // const deleteButton = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('/deleteDonation', {
          method: 'delete',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'id': element.value,
            // 'msg': msg,
            // 'thumbUp':thumbUp
          })
        })
        .then(response => {
        response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});
