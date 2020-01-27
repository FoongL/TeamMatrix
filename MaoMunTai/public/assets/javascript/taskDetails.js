//---The magic begins when i click on a modal
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
    if (subtasks[x]['completed_date'] == null) {
      console.log(subtasks[x]['completed_date']);
      $('#checkList')
        .append(` <div id="${subtasks[x]['id']}" class='checkDiv'><div><label id="${subtasks[x]['id']}" class="checker">${subtasks[x]['name']}
    <input id="${subtasks[x]['id']} "type="checkbox">
    <span id="${subtasks[x]['id']}" class="checkmark"></span>
</label></div><i class="far fa-trash-alt trash"></i></div>`);
    } else {
      $('#checkList')
        .append(` <div  id="${subtasks[x]['id']}"class='checkDiv'><div><label id="${subtasks[x]['id']}" class="checker">${subtasks[x]['name']}
        <input id="${subtasks[x]['id']}"type="checkbox" checked>
        <span id="${subtasks[x]['id']}" class="checkmark"></span>
    </label></div><i class="far fa-trash-alt trash"></i></div>`);
    }
  }

  //---- Rendering out task members

  for (let y in taskMembers) {
    $('#teamList').append(
      `<div  id="${taskMembers[y]['id']}"class='checkDiv'><div><ul>${taskMembers[y]['f_name']} ${taskMembers[y]['l_name']}, ${taskMembers[y]['email']}</ul></div><i class="fas fa-user-minus trash"></i></div>`
    );
  }
  //--- edit task name functionality
  $('#taskNameEdit').on('click', function(event) {
    $('#newtaskName').val('');
  });

  $('#nameChange').on('click', async function(event) {
    if ($('#newtaskName').val() == '') {
      alert('Need a valid name to replace existing name!');
      return;
    }

    let newName = $('#newtaskName').val();
    console.log(TaskId);
    console.log(newName);
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
  //rendering out the project start checker
  let phaseCheck;
  await $.ajax({
    url: `/api/tasks/phasecheck`,
    type: 'PUT',
    data: {
      taskID: `${TaskId}`
    },
    success: function(result) {
      phaseCheck = result;
    },
    error: function(request, msg, error) {
      console.log('failed');
    }
  });

  if (phaseCheck[0]['phase'] !== 1) {
    $('#switch').prop('checked', true);
  }
  //---- edit task description
  $('#taskDescEdit').on('click', function(event) {
    $('#editedDescription').val('');
  });
  $('#descChange').on('click', async function(event) {
    if ($('#editedDescription').val() == '') {
      console.log($('#editedDescription').val());
      alert('Need a valid description to replace existing one!');
      return;
    }
    let newDescription = $('#editedDescription').val();
    await $.ajax({
      url: `/api/tasks/amenddesc`,
      type: 'PUT',
      data: {
        taskID: `${TaskId}`,
        description: `${newDescription}`
      },
      success: function(result) {
        console.log('description changed!');
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
    $('#TaskModalDescription').html(`${newDescription}`);

    $('#editTaskDesc').modal('hide');
  });
  //---- edit task due date
  $('#taskDueEdit').on('click', function(event) {
    $('#newDue').val('');
  });
  $('#dueChange').on('click', async function(event) {
    let curTime = new Date();
    let newTime = $('#newDue').val();
    today = curTime.toISOString().slice(0, 10) + ' 00:00:00+08';
    if (newTime == '') {
      alert('Please insert a due date');
      return;
    }
    if (newTime < today) {
      alert('Due dates can only be set for the future.');
      return;
    }
    await $.ajax({
      url: `/api/tasks/amendduedate`,
      type: 'PUT',
      data: {
        taskID: `${TaskId}`,
        dueDate: `${newTime}`
      },
      success: function(result) {
        console.log('date changed!');
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
    let months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
    taskDue = new Date(newTime);
    let NewdateDue =
      taskDue.getDate() +
      ' ' +
      months[taskDue.getMonth()] +
      ', ' +
      taskDue.getFullYear();
    $('#TaskDue').html(`${NewdateDue}`);

    $('#editTaskDue').modal('hide');
  });

  //---- adding a new subtask
  $('#addTaskButton').on('click', function(event) {
    $('#addsubtaskName').val('');
    $('#addsubtaskDue').val('');
  });
  $('#addSub').on('click', async function(event) {
    let newSubName = $('#addsubtaskName').val();
    let newSubdate = $('#addsubtaskDue').val();
    let curTime = new Date();
    today = curTime.toISOString().slice(0, 10) + ' 00:00:00+08';
    if (newSubName == '') {
      alert('Need a valid name for the subtask!');
      return;
    }
    if (newSubdate == '') {
      alert('Please insert a due date');
      return;
    }
    if (newSubdate < today) {
      alert('Due dates can only be set for the future.');
      return;
    }
    await $.ajax({
      url: `/api/subtasks/add`,
      type: 'POST',
      data: {
        taskID: `${TaskId}`,
        name: `${newSubName}`,
        dueDate: `${newSubdate}`
      },
      success: function(result) {
        return;
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });

    let subID = '';
    await $.ajax({
      url: `/api/subtasks/getid`,
      type: 'POST',
      data: {
        taskID: `${TaskId}`,
        name: `${newSubName}`
      },
      success: function(result) {
        console.log(result);
        subID = result[0]['id'];
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });

    //console.log(subID);
    $(
      '#checkList'
    ).append(` <div id="${subID}" class='checkDiv'><div><label id='${subID}' class="checker">${newSubName}
    <input id='${subID}' type="checkbox">
    <span id='${subID}' class="checkmark"></span>
</label></div><i class="far fa-trash-alt trash"></i></div>`);

    $('#addToChecklist').modal('hide');
  });

  //---- Deleting subtasks
  $('#checkList').on('click', '.trash', async function() {
    console.log($(this).parent()[0]['id']);
    delId = $(this).parent()[0]['id'];
    await $.ajax({
      url: `/api/subtasks/remove`,
      type: 'DELETE',
      data: {
        subtaskID: `${delId}`
      },
      success: function(result) {
        return;
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
    $('#checkList')
      .children(`#${delId}`)
      .hide();
  });
  //------------------ deleting team members from a task;
  $('#teamList').on('click', '.trash', async function() {
    delMemId = $(this).parent()[0]['id'];
    await $.ajax({
      url: `/api/tasks/removeuser`,
      type: 'PUT',
      data: {
        tasksID: `${TaskId}`,
        user: `${delMemId}`
      },
      success: function(result) {
        return;
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
    $('#teamList')
      .children(`#${delMemId}`)
      .hide();
  });

  //------ adding team member
  const hiddenID = $('.secretIDHolder').attr('id');
  let projectMemList = '';
  let taskMemList = '';
  let addUserList = [];
  let taskAssignList = new Set();
  let newUserOutput = [];

  $('#addMemkButton').click(async function(event) {
    newUserOutput = [];
    $('#addMemList').empty();
    taskAssignList = new Set();
    projectMemList = '';
    taskMemList = '';
    addUserList = [];
    $('#addMemSearch').val('');
    await $.ajax({
      url: `/api/projects/getusers`,
      type: 'POST',
      data: { projectId: `${hiddenID}` },
      success: function(result) {
        projectMemList = result;
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
    await $.ajax({
      url: `/api/tasks/getusers`,
      type: 'POST',
      data: {
        taskID: `${TaskId}`
      },
      success: function(result) {
        //console.log(result)
        taskMemList = result;
      },
      error: function(request, msg, error) {
        console.log('failed');
      }
    });
    let idCheck = [];
    for (let y in taskMemList) {
      idCheck.push(taskMemList[y]['id']);
    }

    for (x in projectMemList) {
      if (idCheck.includes(projectMemList[x]['id']) === false) {
        console.log(projectMemList[x]);

        addUserList.push(projectMemList[x]);
      }
    }
  });
  $('#addMemSearch').on('input', function() {
    searchText = $('#addMemSearch').val();
    let matches = addUserList.filter(user => {
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
      if ($('#addMemSearch').val().length === 0) {
        $('#addMemList').empty();
      }
      if (matches.length > 0) {
        const output = await matches
          .map(
            match => `
              <div>
              <a class='clickable' name='${match.f_name} ${match.l_name}' id='${match.id}'>${match.f_name} ${match.l_name}</a>
              </div>
              `
          )
          .join('');
        $('#addMemList').empty();
        $('#addMemList').append(output);
      }
    };
    outputHTML(matches);
    $('#addMemList,.clickable').on('click', function(event) {
      if (event.target.id !== 'addMemList' || event.target.name !== undefined) {
        if (taskAssignList.has(event.target.id) === false) {
          let nameOutput = `<p class='memberList'>${event.target.name}</p>`;

          newUserOutput.push(
            `<div  id="${event.target.id}"class='checkDiv'><div><ul>${event.target.name}</ul></div><i class="fas fa-user-minus trash"></i></div>`
          );

          $('#AddToTask').append(nameOutput);
        }
        taskAssignList.add(event.target.id);
        $('#addMemSearch').val('');
        $('#addMemList').empty();
      }
    });
  });
  $('#addMem').click(async function(event) {
    let userList = Array.from(taskAssignList);
    console.log('anNnyung world');
    console.log(TaskId);
    for (x in userList) {
      await $.ajax({
        url: `/api/tasks/adduser`,
        type: 'PUT',
        data: {
          tasksID: `${TaskId}`,
          user: `${userList[x]}`
        },
        success: function(result) {
          return;
        },
        error: function(request, msg, error) {
          console.log('failed');
        }
      });
    }
    for (y in newUserOutput) {
      $('#teamList').append(newUserOutput[y]);
    }

    $('#addTeaMate').modal('hide');
  });
  //------- dealing with the checklists
  $('#checkList').on('click', '.checkDiv', async function(event) {
    if (
      $(this)
        .find('input')
        .prop('checked') === true
    ) {
      console.log(event.target.id, 'is completed!');
      await $.ajax({
        url: `/api/subtasks/mark`,
        type: 'PUT',
        data: {
          subtaskID: `${event.target.id}`
        },
        success: function(result) {
          return;
        },
        error: function(request, msg, error) {
          console.log('failed');
        }
      });
      //-------if "start project is unchecked... help check it"
      if ($('#switch').prop('checked') == false) {
        //console.log('I WANT TO TURN THIS PROJECT ON');
        $('#switch').trigger('click');
      }
      //----- if all tasks are complete... move project to finished
      let taskCount;
      await $.ajax({
        url: `/api/subtasks/check`,
        type: 'PUT',
        data: {
          taskID: `${TaskId}`
        },
        success: function(result) {
          taskCount = result;
        },
        error: function(request, msg, error) {
          console.log('failed');
        }
      });
      if (taskCount[0]['count'] == 0) {
        await $.ajax({
          url: `/api/tasks/taskcomplete`,
          type: 'PUT',
          data: {
            taskID: `${TaskId}`
          },
          success: function(result) {
            console.log('task completed');
          },
          error: function(request, msg, error) {
            console.log('failed');
          }
        });
      }
    } else if (
      $(this)
        .find('input')
        .prop('checked') === false
    ) {
      console.log(event.target.id, 'is uncompleted :(');
      await $.ajax({
        url: `/api/subtasks/unmark`,
        type: 'PUT',
        data: {
          subtaskID: `${event.target.id}`
        },
        success: function(result) {
          return;
        },
        error: function(request, msg, error) {
          console.log('failed');
        }
      });
    }
  });
  $('#switch').on('click', async function(event) {
    if ($('#switch').prop('checked') == true) {
      await $.ajax({
        url: `/api/tasks/startproject`,
        type: 'PUT',
        data: {
          taskID: `${TaskId}`
        },
        success: function(result) {
          //console.log(result)
          return;
        },
        error: function(request, msg, error) {
          console.log('failed');
        }
      });
    } else if ($('#switch').prop('checked') == false) {
      console.log('Checkbox is unchecked.');
      alert(`I won't let you unstart a started project! KEEP GOING!`);
      $('#switch').prop('checked', true);
    }
  });
//----- DELETEING... NUKING THE TASK
$('#taskDelete').click(async function(event){
    console.log('hello')
    await $.ajax({
        url: `/api/tasks/remove`,
        type: 'DELETE',
        data: {
          taskID: `${TaskId}`
        },
        success: function(result) {
         location.reload()
        },
        error: function(request, msg, error) {
          console.log('failed');
        }
      });



})

});

//---- closing dialog box with done button only
$('#closeTaskDetail').on('click', function(event) {
  location.reload();
});

