// JavaScript source code
// Main script

//boolean for checking correct answer
//-1 for no answer, 0 for incorrect answer and 1 for correct answer
$(document).ready(function () {
});
//Select Panel
$('#introSelectButton').click(function () {
    selectIntro();
});

$("#practiceSelectButton").click(function () {
    selectPractice();
})

function selectIntro() {
    $("#selectPanel").hide();
    $("#part1").show();
}

function selectPractice() {
    $("#selectPanel").hide();
    $("#part2").show();
    setupTable();
}

$(".answer").on('mouseover', function () {
    $(this).css('background-color', 'yellow');
    var number = $(this).attr("data-pic");
    $("#displayImg").attr("src", "pictures/" + number + ".PNG");
    if ($(this).attr("id") == "answer1") {
    }
}).mouseout(function () {
    $(this).css('background-color', 'white');
});


//Intro Mode
$("#backFromIntro").click(function () {
    backToMenu();
})

var answer = false;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

//drop event handler
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var dropElement = document.getElementById(data);
    //check drop position
    ev.target.appendChild(dropElement);
    //if all correct -> go to next part, otherwise restart
    for (i = 1; i <= 12 ; i++) {
        if ($("#answer" + i).parent().attr("id") == "position" + i) {
            answer = true;
        } else {
            answer = false;
            break;
        }
    }
    if (answer == true) {
        succeed();
    }
}

function succeed() {
    answer = true

    window.alert("Correct!");

    postAnswer();

    //or win
    //if (stepNumber == 5) {
    //    alert("GAME OVER");
    //    document.location.reload();
    //}

}

function postAnswer() {
    $.post(                             //call the server
    "data.php",                     //At this url
    {
        Answer: answer,
    }                               //And send this data to it
    ).done(function (msg) {
        alert("Data Saved: " + msg);
    }).fail(function () {
        alert("There was an error with the server :(");
    });
}

function backToMenu() {
    $("#part1").hide();
    $("#selectPanel").show();

}

//paractice mode
var gameState = 1;
var tube = 0;
var pipetteFluid = false;
$("#pipette2").hide();
function setupTable() {
    //$("#tube1").css("left","90%")
}

function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

//state 1
interact('.pipette')
  .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent

      restrict: {
          restriction: "#part2",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {
          var textEl = event.target.querySelector('p');

          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(event.dx * event.dx +
                         event.dy * event.dy) | 0) + 'px');
      }
  });


// enable draggables to be dropped into this
interact('.container').dropzone({
    // only accept elements matching this CSS selector
    accept: '#pipette1',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.15,

    // listen for drop related events:

    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');

    },
    ondragenter: function (event) {

        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        draggableElement.textContent = 'Dragged in';
    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        event.relatedTarget.textContent = 'Dragged out';
    },
    ondrop: function (event) {
        if ($("#pipette1").offset().top + $("#pipette1").height() < ($("#container").offset().top + $("#container").height()))
            $("#pipette1").attr("src", "pictures/Resized pipette with fluid.svg");
        
        pipetteFluid = true;
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');

    }
});

interact('.tube').dropzone({
    // only accept elements matching this CSS selector
    accept: '#pipette1',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.10,

    // listen for drop related events:

    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');

    },
    ondragenter: function (event) {

        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
    },
    ondrop: function (event) {
        if (pipetteFluid == true && $("#pipette1").offset().top + $("#pipette1").height() < ($(event.target).offset().top + $(event.target).height())) {
            event.target.setAttribute("src", "pictures/open centrifuge tube with fluid.svg");
            if (event.target.getAttribute("data-state") == "0") {
                event.target.setAttribute("data-state", "1")
                tube++;

                if (tube == 2) {
                    gameState++;
                    state2();
                }
            }
        }

    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');

    }
});


//state 2 
function state2() {
    var state = 0;
    $("#pipette1").hide();
    $("#pipette2").show();
    interact('.tube')
  .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent

      restrict: {
          restriction: "#part2",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {
          var textEl = event.target.querySelector('p');

          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(event.dx * event.dx +
                         event.dy * event.dy) | 0) + 'px');
      }
  });
    interact('.icebox').dropzone({
        // only accept elements matching this CSS selector
        accept: '.tube',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.50,

        // listen for drop related events:

        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');

        },
        ondragenter: function (event) {

            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        },
        ondrop: function (event) {
            if (event.relatedTarget.getAttribute("data-state") == "1") {
                event.relatedTarget.setAttribute("data-state", "2");
                state++;
            }
            if (state == 2) {
                gameState++;
            }
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');

        }
    });

}


window.setInterval(function () {
    $("#debug").text("game state: "+gameState);
}, 500);