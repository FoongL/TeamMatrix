const ProjID = $('.secretIDHolder').attr('id');
//----clearing forms when loaded
$('#ProjNameEdit').click(function (event) {
  $('#newProjName').val('');
});
$('#projDueEdit').click(function (event) {
  console.log('DescEdit');
});
$('#ProjManUse').click(function (event) { });

//----- simple edit forms ajax calls
$('#nameChangeProj').click(async function (event) {
  console.log('hello');
  if ($('#newProjName').val() == '') {
    alert('Please insert a usable new name!');
    return;
  }
  let newName = $('#newProjName').val();
  await $.ajax({
    url: `/api/projects/amendname`,
    type: 'POST',
    data: {
      projectId: `${ProjID}`,
      name: `${newName}`
    },
    success: function (result) {
      location.reload();
    },
    error: function (request, msg, error) {
      console.log('failed');
    }
  });
});

$('#dueChangeProj').click(async function (event) {
  let curTime = new Date();
  today = curTime.toISOString().slice(0, 10) + ' 00:00:00+08';
  taskDue = $('#newProjDue').val();
  if (taskDue == '') {
    alert('Please select target due date for your task');
    return;
  }
  if (taskDue < today) {
    alert('Due dates can only be set for the future.');
    return;
  }
  await $.ajax({
    url: `/api/projects/amenddate`,
    type: 'POST',
    data: {
      projectId: `${ProjID}`,
      dueDate: `${taskDue}`
    },
    success: function (result) {
      location.reload();
    },
    error: function (request, msg, error) {
      console.log('failed');
    }
  });
});

$('#projectDelete').click(async function (event) {
  await $.ajax({
    url: `/api/projects/remove`,
    type: 'DELETE',
    data: {
      projectId: `${ProjID}`
    },
    success: function (result) {
      window.location.href = result;
    },
    error: function (request, msg, error) {
      console.log('failed');
    }
  });
});
//---------------adding users modal

$('#ProjManUse').click(async function (event) {
  let databaseUsers = '';
  let inProjectUsers = '';
  let checkID = [];
  let addableUsers = [];
  $('#ProjteamList').empty();
  //---------------rendering out users list
  let usersAlreadyIn;
  await $.ajax({
    url: `/api/projects/getusers`,
    type: 'POST',
    data: {
      projectId: `${ProjID}`
    },
    success: function (result) {
      usersAlreadyIn = result;
    },
    error: function (request, msg, error) {
      console.log('failed');
    }
  });
  for (z in usersAlreadyIn) {
    console.log(usersAlreadyIn[z]);
    $('#ProjteamList').append(
      `<div  id="${usersAlreadyIn[z]['id']}"class='checkDiv'><div><ul>${usersAlreadyIn[z]['f_name']} ${usersAlreadyIn[z]['l_name']} (${usersAlreadyIn[z]['email']})</ul></div><i class="fas fa-user-minus trash"></i></div>`
    );
  }

  await $.ajax({
    url: `/api/projects/listallusers`,
    type: 'POST',
    success: function (result) {
      console.log('data ready!');
      databaseUsers = result;
    },
    error: function (request, msg, error) {
      console.log('failed');
    }
  });
  //console.log(databaseUsers);
  $('#addMemProject').on('input', async function (event) {
    if ($('#addMemProject').val().length <= 1) {
      checkID = [];
      addableUsers = [];
      console.log($('#addMemProject').val().length);
      await $.ajax({
        url: `/api/projects/getusers`,
        type: 'POST',
        data: {
          projectId: `${ProjID}`
        },
        success: function (result) {
          inProjectUsers = result;
        },
        error: function (request, msg, error) {
          console.log('failed');
        }
      });
      for (let x in inProjectUsers) {
        checkID.push(inProjectUsers[x]['id']);
      }

      for (y in databaseUsers) {
        if (checkID.includes(databaseUsers[y]['id']) === false) {
          //console.log(databaseUsers[y]);
          addableUsers.push(databaseUsers[y]);
        }
      }
    }
    searchText = $('#addMemProject').val();
    let matches = addableUsers.filter(user => {
      const regex = new RegExp(`^${searchText}`, 'gi');
      return (
        user.f_name.match(regex) ||
        user.l_name.match(regex) ||
        user.email.match(regex)
      );
    });
    if (searchText.length === 0) {
      matches = [];
    }
    const outputHTML = async matches => {
      if ($('#addMemProject').val().length === 0) {
        $('#addMemListProj').empty();
      }
      if (matches.length > 0) {
        const output = await matches
          .map(
            match => `
              <div>
              <a class='clickable' name='${match.f_name} ${match.l_name}(${match.email})' id='${match.id}'>${match.f_name} ${match.l_name} (${match.email})</a>
              </div>
              `
          )
          .join('');
        $('#addMemListProj').empty();
        $('#addMemListProj').append(output);
      }
    };
    outputHTML(matches);
  });
});
$('#addMemListProj,.clickable').on('click', async function (event) {
  console.log('hello')
  console.log(event.target.id)
  console.log(event.target.name)
  await $.ajax({
    url: `/api/projects/adduser`,
    type: 'POST',
    data: {
      projectId: `${ProjID}`,
      userId: `${event.target.id}`
    },
    success: function (result) {
      console.log('added someone');
    },
    error: function (request, msg, error) {
      console.log('failed');
    }
  });
  $('#ProjteamList').append(
    `<div  id="${event.target.id}"class='checkDiv'><div><ul>${event.target.name}</ul></div><i class="fas fa-user-minus trash"></i></div>`
  );
  $('#addMemProject').val('')
  $('#addMemListProj').empty();
})