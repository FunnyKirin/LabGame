// JavaScript source code
// Main script
//boolean for checking correct answer
//-1 for no answer, 0 for incorrect answer and 1 for correct answer
$(document).ready(function () {});

$('#tube1').click(function (e) {
    $("#nameField").show();
});
$('#nameField').bind('keydown keyup keypress', function () {
    $('#nameDisplay').html(this.value);
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

//Intro Mode
$("#backFromIntro").click(function () {
    backToMenu();
})


var el = document.getElementById('answerDiv');
var sortable = Sortable.create(el, {
    animation: 400,
    onUpdate: function ( /**Event*/ evt) {
        evt.oldIndex; // element index within parent
        if(checkAnswer()){
            succeed();
        }
    }
});

function checkAnswer() {
    for (i = 1; i < 12; i++) {
            if($("#answer"+i).index()!=i-1){
                return false;
            }
    }
    return true;
}

$(".answer").on('mouseover', function () {
    var number = $(this).attr("data-pic");
    $("#answerImg").attr("src", "pictures/" + number + ".PNG");
    if ($(this).attr("id") == "answer1") {}
}).mouseout(function () {
    $(this).css('background-color', 'white');
});



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
    $.post( //call the server
        "data.php", //At this url
        {
            Answer: answer,
        } //And send this data to it
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
state5();
var gameState = 1;
var tube = 0;
var pipetteFluid = false;
$("#pipette2").hide();
$("#tube1Pos").css("left", $("#cube").position().left / $("#part2").width() * 100 + 3 + "%");
$("#tube1Pos").css("top", $("#cube").position().top / $("#part2").height() * 100 + 1 + "%");
$("#tube2Pos").css("left", $("#cube").position().left / $("#part2").width() * 100 - 3 + "%");
$("#tube2Pos").css("top", $("#cube").position().top / $("#part2").height() * 100 + 1 + "%");

function setupTable() {
    //$("#tube1").css("left","90%")
}

function dragMoveListener(event) {
    var target = event.target, // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

//state 1
interact('.pipette').draggable({
    // enable inertial throwing
    inertia: false, // keep the element within the area of it's parent
    restrict: {
        restriction: "#part2",
        endOnly: true,
        elementRect: {
            top: 0,
            left: 0,
            bottom: 1,
            right: 1
        }
    }, // enable autoScroll
    autoScroll: true, // call this function on every dragmove event
    onmove: dragMoveListener, // call this function on every dragend event
    onend: function (event) {
        var textEl = event.target.querySelector('p');
        textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
    }
});
// enable draggables to be dropped into this
interact('#container').dropzone({
    // only accept elements matching this CSS selector
    accept: '#pipette1', // Require a 75% element overlap for a drop to be possible
    overlap: 0.15, // listen for drop related events:
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
        if ($("#pipette1").offset().top + $("#pipette1").height() < ($("#container").offset().top + $("#container").height())) $("#pipette1").attr("src", "pictures/Resized pipette with fluid.svg");
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
    accept: '#pipette1', // Require a 75% element overlap for a drop to be possible
    overlap: 0.10, // listen for drop related events:
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
            if (event.target.parentElement.getAttribute("data-state") == "0") {
                event.target.parentElement.setAttribute("data-state", "1")
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
interact('.tubeItem').draggable({
    // enable inertial throwing
    inertia: false, // keep the element within the area of it's parent
    restrict: {
        restriction: "parent",
        endOnly: true,
        elementRect: {
            top: 0,
            left: 0,
            bottom: 1,
            right: 1
        }
    }, // enable autoScroll
    autoScroll: true, // call this function on every dragmove event
    onmove: dragMoveListener, // call this function on every dragend event
    onend: function (event) {
        var textEl = event.target.querySelector('p');
        textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
    }
});
interact('.loop').draggable({
    // enable inertial throwing
    inertia: false, // keep the element within the area of it's parent
    restrict: {
        //restriction: "parent",
        endOnly: true,
        elementRect: {
            top: 0,
            left: 0,
            bottom: 1,
            right: 1
        }
    }, // enable autoScroll
    autoScroll: true, // call this function on every dragmove event
    onmove: dragMoveListener, // call this function on every dragend event
    onend: function (event) {
        var textEl = event.target.querySelector('p');
        textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
    }
});
//state 2 
function state2() {
    var state = 0;
    $("#pipette1").hide();
    $("#pipette2").show();
    interact('.tubeItem').draggable({
        // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2",
            endOnly: true,
            elementRect: {
                top: 0,
                left: 0,
                bottom: 1,
                right: 1
            }
        },
    });
    interact('.icebox').dropzone({
        // only accept elements matching this CSS selector
        accept: '.tubeItem', // Require a 75% element overlap for a drop to be possible
        overlap: 0.50, // listen for drop related events:
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
            if (event.relatedTarget.getAttribute("id") == "tube1Pos") {
                var left = $(event.target).position().left / $("#part2").width() * 100 + 8;
                $(event.relatedTarget).css("left", left + "%");
                var top = $(event.target).position().top / $("#part2").height() * 100 - 3;
                $(event.relatedTarget).css("top", top + "%");
                $(event.relatedTarget).css("transform", "");
            }
            if (event.relatedTarget.getAttribute("id") == "tube2Pos") {
                var left = $(event.target).position().left / $("#part2").width() * 100;
                $(event.relatedTarget).css("left", left + "%");
                var top = $(event.target).position().top / $("#part2").height() * 100 - 3;
                $(event.relatedTarget).css("top", top + "%");
                $(event.relatedTarget).css("transform", "");
            }
            event.relatedTarget.setAttribute("data-x", "0");
            event.relatedTarget.setAttribute("data-y", "0");
            if (event.relatedTarget.getAttribute("data-state") == "1") {
                event.relatedTarget.setAttribute("data-state", "2");
                state++;
            }
            if (state == 2) {
                gameState++;
                state3();
                state++;
            }
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}
//state 3 
function state3() {
    var state = 0;
    interact('.cube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.tubeItem', // Require a 75% element overlap for a drop to be possible
        overlap: 0.50, // listen for drop related events:
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
            if (event.relatedTarget.getAttribute("id") == "tube1Pos") {
                $("#tube1Pos").css("left", $("#cube").position().left / $("#part2").width() * 100 + 3 + "%");
                $("#tube1Pos").css("top", $("#cube").position().top / $("#part2").height() * 100 + 1 + "%");
                $(event.relatedTarget).css("transform", "");
            }
            if (event.relatedTarget.getAttribute("id") == "tube2Pos") {
                $("#tube2Pos").css("left", $("#cube").position().left / $("#part2").width() * 100 - 3 + "%");
                $("#tube2Pos").css("top", $("#cube").position().top / $("#part2").height() * 100 + 1 + "%");
                $(event.relatedTarget).css("transform", "");
            }

            event.relatedTarget.setAttribute("data-x", "0");
            event.relatedTarget.setAttribute("data-y", "0");
            if (event.relatedTarget.getAttribute("data-state") == "2") {
                event.relatedTarget.setAttribute("data-state", "3");

                gameState++;
            }
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.starterPlate').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop', // Require a 75% element overlap for a drop to be possible
        overlap: 0.05, // listen for drop related events:
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
            if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                if (event.relatedTarget.getAttribute("data-state") == "0") {
                    event.relatedTarget.setAttribute("data-state", "1")
                }
            }
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });

    interact('.tubeItem').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop', // Require a 75% element overlap for a drop to be possible
        overlap: 0.05, // listen for drop related events:
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
                if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                    if (event.target.getAttribute("data-state") == "3") {
                        event.target.setAttribute("data-state", "4")
                        $("#loop2").show();
                        $(event.relatedTarget).hide();
                        state++;
                        if (state == 2) {
                            state4();
                            $("#loop3").show();
                        }
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
}

function state4() {
    interact('#plasmidContainer').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop',
        overlap: 0.05,
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
            if (event.relatedTarget.getAttribute("data-state") == "0") {
                if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                    event.relatedTarget.setAttribute("data-state", 1);

                }
            }
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    //testing
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop', // Require a 75% element overlap for a drop to be possible
        overlap: 0.10, // listen for drop related events:


        ondrop: function (event) {
            if (pipetteFluid == true && $("#pipette1").offset().top + $("#pipette1").height() < ($(event.target).offset().top + $(event.target).height())) {
                event.target.setAttribute("src", "pictures/closed centrifuge tube with fluid.svg");

                gameState++;
                $(event.relatedTarget).hide();
                state5();
            }
        },
    });

    $(".tube").click(function (event) {
        event.target.setAttribute("src", "pictures/closed centrifuge tube with fluid.svg");
    });

}

function state5() {
    $("#cubeWithTubes").show();
    $(".origin").hide();
    interact('#cubeWithTubes').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2",
            endOnly: true,
            elementRect: {
                top: 0,
                left: 0,
                bottom: 1,
                right: 1
            }
        }, // enable autoScroll
        autoScroll: true, // call this function on every dragmove event
        onmove: dragMoveListener, // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
        }
    });

    interact('#waterBath1').dropzone({
        // only accept elements matching this CSS selector
        accept: '#cubeWithTubes', // Require a 75% element overlap for a drop to be possible
        overlap: 0.10, // listen for drop related events:
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
            openWaterBath();
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
            closeWaterBath();
        },
        ondrop: function (event) {
            $(event.relatedTarget).hide(1000, function () {
                $("#tubeInWaterbath").show()
            });
            closeWaterBath()
            setTimeout(openWaterBath, 2500);
            setTimeout(function () {
                $("#tubeInWaterbath").hide()
            }, 3000);
            setTimeout(function () {
                $(event.relatedTarget).show(1000)
            }, 3000);
            state6();
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state6() {
    interact('#icebox').dropzone({
        accept: "#cubeWithTubes",
        ondrop: function (event) {

            $(event.relatedTarget).hide(1000, function () {
                $("#tubeInIcebox").show()
            });
            setTimeout(function () {
                $("#tubeInIcebox").hide();
                $(event.relatedTarget).show(1000);
            }, 2000);
        }
    });
}

function openWaterBath() {

    $("#waterBath2").css("animation", "waterBathRight 1s forwards");
    $("#waterBath3").css("animation", "waterBathLeft 1s forwards");
}

function closeWaterBath() {

    $("#waterBath2").css("animation", "waterBathRight2 1s forwards");
    $("#waterBath3").css("animation", "waterBathLeft2 1s forwards");
}

window.setInterval(function () {
    $("#debug").text("game state: " + gameState);
}, 500);