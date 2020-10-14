// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var trash = document.getElementsByClassName("fa-trash");
var deletebutton = document.getElementsByClassName('deleteButton')

// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });









Array.from(deletebutton).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(element.value);

        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('removeCampaign', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // console.log();
            '_id':element.value

          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
