const ProjID = $('.secretIDHolder').attr('id');
//----clearing forms when loaded
$('#ProjNameEdit').click(function(event) {
  $('#newProjName').val('');
});
$('#projDueEdit').click(function(event) {
  console.log('DescEdit');
});
$('#ProjManUse').click(function(event) {});

//----- simple edit forms ajax calls
$('#nameChangeProj').click(async function(event) {
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
    success: function(result) {
      location.reload();
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });
});

$('#dueChangeProj').click(async function(event) {
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
    success: function(result) {
      location.reload();
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });
});



$('#projectDelete').click(async function(event){
    await $.ajax({
        url: `/api/projects/remove`,
        type: 'DELETE',
        data: {
          projectId: `${ProjID}`,
        },
        success: function(result) {
        window.location.href=result
        },
        error: function(request, msg, error) {
          console.log('failed');
        }
      });
})