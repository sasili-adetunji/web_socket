(async function() {

  const ws = await connectToServer();

  $(document).on('click', 'input', function(e){
    e.preventDefault();
      var targetID = $(e.target).attr('id');
      const inputField = document.getElementById('inputField')
      if (targetID === 'submitButton') {
        const client_data = {
          type: 'event.interaction',
          data: `${inputField.value}`
        };
        ws.send(JSON.stringify(client_data));
        inputField.value = "";
      } 
      else if (targetID === 'errorButton') {
        const client_data = {
          type: 'event.error',
          data: `${uniqueId()}`
        };
        ws.send(JSON.stringify(client_data));
        inputField.value = "";
      }
    });

    function uniqueId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
    }

    async function connectToServer() {    
      const ws = new WebSocket('ws://localhost:9898/ws');
      return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if(ws.readyState === 1) {
              clearInterval(timer);
              resolve(ws);
          }
        }, 10);
      });   
    }
  })
();
