$('#switch').on('click', function(event) {
  if ($(this).prop('checked') == true) {
    console.log('Checkbox is checked.');
  } else if ($(this).prop('checked') == false) {
    console.log('Checkbox is unchecked.');
  }
});

$('.assigned').on('click', async function(event) {
  $('#checkList').empty();
  $('#teamList').empty();
  var TaskId = $(event.target).attr('id');

  //--- data grab to populate the modal
  //--- variable names that will be populated by the api calls
  let subtasks;
  let taskMembers;
  let projectMembers;
  let taskDetails;
  //-- getting details about this specific task
  await $.ajax({
    url: `/api/tasks/getdetail`,
    type: 'POST',
    data: {
      taskID: `${TaskId}`
    },
    success: function(result) {
      //console.log(result)
      taskDetails = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });
  //-- getting list of subtask (in order of due date)
  await $.ajax({
    url: `/api/subtasks/list`,
    type: 'POST',
    data: {
      taskID: `${TaskId}`
    },
    success: function(result) {
      //console.log(result)
      subtasks = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });

  //--- getting list of existing users that are assigned to the task (no order)
  await $.ajax({
    url: `/api/tasks/getusers`,
    type: 'POST',
    data: {
      taskID: `${TaskId}`
    },
    success: function(result) {
      //console.log(result)
      taskMembers = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });

  //---- Rendering out Task Detail information
  taskName = taskDetails[0]['name'];
  taskDesc = taskDetails[0]['desc'];
  taskDue = new Date(taskDetails[0]['due_date']);
  let months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  let dateDue =
    taskDue.getDate() +
    ' ' +
    months[taskDue.getMonth()] +
    ', ' +
    taskDue.getFullYear();
  $('#TaskTitle').html(`${taskName}`);
  $('#TaskModalDescription').html(`${taskDesc}`);
  $('#TaskDue').html(`${dateDue}`);

  //---- Rendering out checklist

  for (let x in subtasks) {
    if (subtasks[x]['complete_date'] == null) {
      $('#checkList')
        .append(` <label id="${subtasks[x]['id']}" class="checker">${subtasks[x]['name']}
    <input id="${subtasks[x]['id']}"type="checkbox">
    <span id="${subtasks[x]['id']}" class="checkmark"></span>
</label>`);
    } else {
      $('#checkList')
        .append(` <label id="${subtasks[x]['id']}" class="checker">${subtasks[x]['name']}
        <input id="${subtasks[x]['id']}"type="checkbox" checked="checked">
        <span id="${subtasks[x]['id']}" class="checkmark"></span>
    </label>`);
    }
  }

  //---- Rendering out task members

  for (let y in taskMembers) {
    $('#teamList').append(
      `<ul>${taskMembers[y]['f_name']} ${taskMembers[y]['l_name']}, ${taskMembers[y]['email']}</ul>`
    );
  }

  $('#taskNameEdit').on('click', function(event) {
    $('#newtaskName').val('');
  });

  $('#nameChange').on('click', async function(event) {
    if ($('#newtaskName').val() == '') {
      alert('Need a valid name to replace existing name!');
      return;
    }
    

    let newName = $('#newtaskName').val();
    console.log(TaskId)
    console.log(newName)
    await $.ajax({
      url: `/api/tasks/amendname`,
      type: 'PUT',
      data: {
        taskID: `${TaskId}`,
        name: `${newName}`
      },
      success: function(result) {
        console.log('name changed!');
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
    $('#TaskTitle').html(`${newName}`);

    $('#editTaskName').modal('hide');
  });
});
