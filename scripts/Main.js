// JavaScript source code
// Main script
//boolean for checking correct answer
//-1 for no answer, 0 for incorrect answer and 1 for correct answer
$(document).ready(function () {
    resizeWindow();
});
var hint = 1;
selectPractice();
//Select Panel
$('#introSelectButton').click(function () {
    selectIntro();
});
$("#practiceSelectButton").click(function () {
    selectPractice();
})
$("#advancedSelectButton").click(function () {
    selectAdvanced();
})

function selectIntro() {
    $("#selectPanel").hide();
    $("#part1").show();
}

function selectPractice() {
    hint = 1;
    $("#selectPanel").hide();
    $("#part2").show();
}

function selectAdvanced() {
    hint = 0;
    $("#selectPanel").hide();
    $("#part2").show();
}
//selectPractice();
//Intro Mode
$("#backFromIntro").click(function () {
    backToMenu();
})
$("#backFromPractice").click(function () {
    backToMenu();
})
var el = document.getElementById('answerDiv');
var sortable = Sortable.create(el, {
    animation: 400
    , ghostClass: 'ghost'
    , onUpdate: function ( /**Event*/ evt) {
        evt.oldIndex; // element index within parent
        checkOrder();
        if (checkAnswer()) {
            succeed();
        }
    }
});
checkOrder();

function checkOrder() {
    for (i = 1; i < 13; i++) {
        if ($("#answer" + i).next().attr("id") == "answer" + (i + 1) || $("#answer" + i).prev().attr("id") == "answer" + (i - 1)) {
            $("#answer" + i).addClass("rightAnswer");
        }
        else {
            $("#answer" + i).removeClass("rightAnswer");
        }
    }
}

function checkAnswer() {
    for (i = 1; i < 12; i++) {
        if ($("#answer" + i).index() != i - 1) {
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
            Answer: answer
        , } //And send this data to it
    ).done(function (msg) {
        alert("Data Saved: " + msg);
    }).fail(function () {
        alert("There was an error with the server :(");
    });
}

function backToMenu() {
    $("#part1").hide();
    $("#part2").hide();
    $("#selectPanel").show();
}
//paractice mode
var gameState = 0;
var tube = 0;
var pipetteFluid = false;
$("#pipette2").hide();
var labelCounter = 0;

function dragMoveListener(event) {
    var target = event.target, // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        , y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
state0();
//setTimer(300, 1000);
function state0() {
    if (hint == 1) {
        $("#messager").text("instruction message.");
    }
    var state01 = 0;
    $("#tube1").click(function () {
        if ($(this).attr("data-state") == "-1") {
            state01++;
            $("#tube1").css("animation", "largerTube 1s forwards");
            setTimeout(function () {
                $("#penMover").show();
            }, 1000);
            setTimeout(function () {
                $("#penMover").hide();
                $("#tube1").attr("src", "pictures/open centrifuge tube without fluid M.svg")
            }, 1800);
            setTimeout(function () {
                $("#tube1").css("animation", "smallerTube 1s forwards");
            }, 2300);
            if (state01 >= 2) {
                gameState++;
                state1();
            };
            $(this).attr("data-state", "0");
        }
    });
    $("#tube2").click(function () {
        if ($(this).attr("data-state") == "-1") {
            state01++;
            $("#tube2").css("animation", "largerTube 1s forwards");
            setTimeout(function () {
                $("#penMover").show();
            }, 1000);
            setTimeout(function () {
                $("#penMover").hide();
                $("#tube2").attr("src", "pictures/open centrifuge tube without fluid P.svg")
            }, 1800);
            setTimeout(function () {
                $("#tube2").css("animation", "smallerTube 1s forwards");
            }, 2300);
            if (state01 >= 2) {
                gameState++;
                state1();
            };
            $(this).attr("data-state", "0");
        }
    });
}

function state1() {
    //state 1
    interact('.pipette').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
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
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($("#pipette1").offset().top + $("#pipette1").height() < ($("#container").offset().top + $("#container").height())) $("#pipette1").attr("src", "pictures/1000 ul pipette (250 ul).svg");
            $("#pipette1").attr("data-state", "1");
            pipetteFluid = true;
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    var tubeCounter = 0;
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '#pipette1', // Require a 75% element overlap for a drop to be possible
        overlap: 0.10, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (pipetteFluid == true && $("#pipette1").offset().top + $("#pipette1").height() < ($(event.target).offset().top + $(event.target).height()) && $("#pipette1").attr("data-state") == 1) {
                if ($(event.target).attr("id") == "tube2") {
                    event.target.setAttribute("src", "pictures/closed centrifuge tube with fluid P.svg");
                }
                else {
                    event.target.setAttribute("src", "pictures/closed centrifuge tube with fluid M.svg");
                }
                $("#pipette1").attr("src", "pictures/Resized pipette without fluid.svg");
                $("#pipette1").attr("data-state", "0");
                if (event.target.getAttribute("data-state") == "0") {
                    event.target.setAttribute("data-state", "1")
                    tubeCounter++;
                    if (tubeCounter == 2) {
                        gameState++;
                        interact('#trashBin').dropzone({
                            // only accept elements matching this CSS selector
                            accept: '#pipette1', // Require a 75% element overlap for a drop to be possible
                            overlap: 0.10, // listen for drop related events:
                            ondropactivate: function (event) {
                                // add active dropzone feedback
                                event.target.classList.add('drop-active');
                            }
                            , ondragenter: function (event) {
                                var draggableElement = event.relatedTarget
                                    , dropzoneElement = event.target;
                                // feedback the possibility of a drop
                                dropzoneElement.classList.add('drop-target');
                                draggableElement.classList.add('can-drop');
                            }
                            , ondragleave: function (event) {
                                // remove the drop feedback style
                                event.target.classList.remove('drop-target');
                                event.relatedTarget.classList.remove('can-drop');
                            }
                            , ondrop: function (event) {
                                $(event.relatedTarget).hide(1000);
                                state2();
                            }
                            , ondropdeactivate: function (event) {
                                // remove active dropzone feedback
                                event.target.classList.remove('drop-active');
                                event.target.classList.remove('drop-target');
                            }
                        });
                    }
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.tube').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "parent"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
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
            endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }, // enable autoScroll
        autoScroll: true, // call this function on every dragmove event
        onmove: dragMoveListener, // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
        }
    });
}
//state 2 
function state2() {
    var state = 0;
    $("#pipette2").show();
    interact('.tube').draggable({
        // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }
    , });
    interact('.icebox').dropzone({
        // only accept elements matching this CSS selector
        accept: '.tube', // Require a 75% element overlap for a drop to be possible
        overlap: 0.50, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (event.relatedTarget.getAttribute("id") == "tube1") {
                if (event.relatedTarget.getAttribute("data-state") == "5") {
                    state++;
                }
                var left = $(event.target).position().left / $("#part2").width() * 100 + 22;
                $(event.relatedTarget).css("left", left + "%");
                var top = $(event.target).position().top / $("#part2").height() * 100 - 3;
                $(event.relatedTarget).css("top", top + "%");
                $(event.relatedTarget).css("transform", "");
            }
            if (event.relatedTarget.getAttribute("id") == "tube2") {
                if (event.relatedTarget.getAttribute("data-state") == "5") {
                    state++;
                }
                var left = $(event.target).position().left / $("#part2").width() * 100 + 14;
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
                $("#timer").show();
                $("#timerConfirm").click(function () {
                
                var time = $("#timerInput").val();
                    if(time==600){
                        
                        $("#timerInput").hide();
                        $("#timerConfirm").hide();
                    setTimer(time, 10);
                    }else{
                        alert("wrong time");
                    }
                });
                state3();
                state++;
            }
            if (state == 5) {
                $(".petriDish").click(function () {
                    if ($(this).attr("data-state3") == "0") {
                        switch ($(this).attr("id")) {
                        case "petriDish1":
                            $("#writeDish").show(1000);
                            setTimeout(function () {
                                $("#penMover1").show();
                            }, 1000);
                            setTimeout(function () {
                                $("#penMover1").hide();
                                $(".dishLabel").attr("src", "pictures/dishLabel" + "1" + ".svg");
                                $(".dishLabel").show();
                                $("#label1").show();
                                $("#writeDish").hide(2500);
                                $(".dishLabel").hide(2000);
                            }, 2000);
                            labelCounter++;
                            if (labelCounter == 4) {
                                state6();
                            }
                            break;
                        case "petriDish2":
                            $("#writeDish").show(1000);
                            setTimeout(function () {
                                $("#penMover1").show();
                            }, 1000);
                            setTimeout(function () {
                                $("#penMover1").hide();
                                $(".dishLabel").attr("src", "pictures/dishLabel" + "2" + ".svg");
                                $(".dishLabel").show();
                                $("#label2").show();
                                $("#writeDish").hide(2500);
                                $(".dishLabel").hide(2000);
                            }, 2000);
                            labelCounter++;
                            if (labelCounter == 4) {
                                state6();
                            }
                            break;
                        case "petriDish3":
                            $("#writeDish").show(1000);
                            setTimeout(function () {
                                $("#penMover1").show();
                            }, 1000);
                            setTimeout(function () {
                                $("#penMover1").hide();
                                $(".dishLabel").attr("src", "pictures/dishLabel" + "3" + ".svg");
                                $(".dishLabel").show();
                                $("#label3").show();
                                $("#writeDish").hide(2500);
                                $(".dishLabel").hide(2000);
                            }, 2000);
                            labelCounter++;
                            if (labelCounter == 4) {
                                state6();
                            }
                            break;
                        case "petriDish4":
                            $("#writeDish").show(1000);
                            setTimeout(function () {
                                $("#penMover1").show();
                            }, 1000);
                            setTimeout(function () {
                                $("#penMover1").hide();
                                $(".dishLabel").attr("src", "pictures/dishLabel" + "4" + ".svg");
                                $(".dishLabel").show();
                                $("#label4").show();
                                $("#writeDish").hide(2500);
                                $(".dishLabel").hide(2000);
                            }, 2000);
                            labelCounter++;
                            if (labelCounter == 4) {
                                state6();
                            }
                            break;
                        default:
                            break;
                        }
                        $(this).attr("data-state3", "1");
                    }
                });
            }
        }
        , ondropdeactivate: function (event) {
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
        accept: '.tube', // Require a 75% element overlap for a drop to be possible
        overlap: 0.50, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (event.relatedTarget.getAttribute("id") == "tube1") {
                $("#tube1").css("left", "53.5%");
                $("#tube1").css("top", "51%");
                $(event.relatedTarget).css("transform", "");
                $("#tube1").attr("src", "pictures/open centrifuge tube with fluid M.svg");
            }
            if (event.relatedTarget.getAttribute("id") == "tube2") {
                $("#tube2").css("left", "47.5%");
                $("#tube2").css("top", "51%");
                $(event.relatedTarget).css("transform", "");
                $("#tube2").attr("src", "pictures/open centrifuge tube with fluid P.svg");
            }
            event.relatedTarget.setAttribute("data-x", "0");
            event.relatedTarget.setAttribute("data-y", "0");
            if (event.relatedTarget.getAttribute("data-state") == "2") {
                event.relatedTarget.setAttribute("data-state", "3");
                gameState++;
            }
        }
        , ondropdeactivate: function (event) {
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
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                if (event.relatedTarget.getAttribute("data-state") == "0") {
                    event.relatedTarget.setAttribute("data-state", "1")
                    $(event.relatedTarget).css("animation", "loop 1s forwards");
                    $(event.relatedTarget).finish();
                    $(event.target).attr("src", "pictures/starterplate without.svg");
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop', // Require a 75% element overlap for a drop to be possible
        overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (event.relatedTarget.getAttribute("data-state") == "1") {
                $(event.relatedTarget).attr("data-state", "0");
                if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                    if (event.target.getAttribute("data-state") == "3") {
                        event.target.setAttribute("data-state", "4")
                        $("#loop2").show();
                        gotoTrashBin($(event.relatedTarget).attr("id"));
                        state++;
                        if (state == 2) {
                            gameState++;
                            state4();
                            $("#loop3").show();
                        }
                    }
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state4() {
    interact('#plasmidContainer').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop'
        , overlap: 0.3, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (event.relatedTarget.getAttribute("data-state") == "0") {
                if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                    $(event.relatedTarget).attr("src", "pictures/yellow loop rainbow.svg");
                    event.relatedTarget.setAttribute("data-state", 1);
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    //testing
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop', // Require a 75% element overlap for a drop to be possible
        overlap: 0.02, // listen for drop related events:
        ondrop: function (event) {
            if ($(event.target).attr("id") == "tube2") {
                gameState = 9;
                event.target.setAttribute("src", "pictures/closed centrifuge tube with fluid M.svg");
                $("#tube1").attr("src", "pictures/closed centrifuge tube with fluid M.svg");
                $(event.relatedTarget).hide();
                state5();
            }
        }
    , });
}

function state5() {
    $(".tube").attr("data-state", "5");
}

function state6() {
    $("#cubeWithTubes").show();
    $(".origin").hide();
    interact('#cubeWithTubes').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
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
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
            openWaterBath();
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
            closeWaterBath();
        }
        , ondrop: function (event) {
            $(event.relatedTarget).hide(1000, function () {
                $("#tubeInWaterbath").show()
            });
            closeWaterBath()
            setTimeout(openWaterBath, 2500);
            setTimeout(function () {
                $("#tubeInWaterbath").hide()
            }, 3000);
            setTimeout(function () {
                $(event.relatedTarget).show(1000);
                interact('#icebox').dropzone({
                    // only accept elements matching this CSS selector
                    accept: '#cubeWithTubes', // Require a 75% element overlap for a drop to be possible
                    overlap: 0.10, // listen for drop related events:
                    ondropactivate: function (event) {
                        // add active dropzone feedback
                        event.target.classList.add('drop-active');
                    }
                    , ondragenter: function (event) {
                        var draggableElement = event.relatedTarget
                            , dropzoneElement = event.target;
                        // feedback the possibility of a drop
                        dropzoneElement.classList.add('drop-target');
                        draggableElement.classList.add('can-drop');
                    }
                    , ondragleave: function (event) {
                        // remove the drop feedback style
                        event.target.classList.remove('drop-target');
                        event.relatedTarget.classList.remove('can-drop');
                    }
                    , ondrop: function (event) {
                        $("#tubeInIcebox").show();
                        $("#cubeWithTubes").hide();
                        setTimeout(function () {
                            $("#tubeInIcebox").hide();
                            $(".tube").show();
                            $("#tube1").css("top", "10");
                            $("#tube1").css("left", "10");
                            $("#tube2").css("top", "10");
                            $("#tube2").css("left", "10");
                            $("#cube").show();
                            $("#cubeTop").show();
                            state7();
                        }, 2000);
                    }
                    , ondropdeactivate: function (event) {
                        // remove active dropzone feedback
                        event.target.classList.remove('drop-active');
                        event.target.classList.remove('drop-target');
                    }
                });
            }, 3000);
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state7() {
    interact('#BrothContainer').dropzone({
        // only accept elements matching this CSS selector
        accept: '.pipette'
        , overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($("#pipette2").attr("data-state") == "0") {
                $("#pipette2").attr("data-state", "1");
                $("#pipette2").attr("src", "pictures/Resized pipette with fluid.svg");
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    var counter = 0
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.pipette'
        , overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($("#pipette2").attr("data-state") == "1") {
                $("#pipette2").attr("data-state", "0");
                $("#pipette2").attr("src", "pictures/Resized pipette without fluid.svg");
                $(".pipette").css("left", "2%");
                $(".pipette").css("top", "2%");
                counter++;
                if (counter == 2) {
                    //11
                    gameState++;
                    state8();
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state8() {
    var counter = 0;
    interact('.petriDish').dropzone({
        // only accept elements matching this CSS selector
        accept: '.pipette'
        , overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($(event.target).attr("data-state") == "P" && $("#pipette2").attr("data-state") == "2") {
                $("#pipette2").attr("data-state", "0");
                $("#pipette2").attr("src", "pictures/Resized pipette without fluid.svg");
                counter++;
                if (counter == 4) {
                    state9();
                }
            }
            if ($(event.target).attr("data-state") == "M" && $("#pipette2").attr("data-state") == "3") {
                $("#pipette2").attr("data-state", "0");
                $("#pipette2").attr("src", "pictures/Resized pipette without fluid.svg");
                counter++;
                if (counter == 4) {
                    state9();
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.pipette'
        , overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($(event.target).attr("id") == "tube2") {
                $("#pipette2").attr("data-state", "2");
                $("#pipette2").attr("src", "pictures/Resized pipette with fluid.svg");
            }
            if ($(event.target).attr("id") == "tube1") {
                $("#pipette2").attr("data-state", "3");
                $("#pipette2").attr("src", "pictures/Resized pipette with fluid.svg");
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state9() {
    gameState++;
    var thisDish;
    if (hint == 1) {
        $("#messager").text("Click petri Dishes to draw e-coli lines on them.");
    }
    $(".petriDish").click(function () {
        if ($(this).attr("data-state2") == "0") {
            $("#topview").show();
            $("#rotate").show();
            thisDish = this;
        }
    });
    $("#topview").click(function () {
        var state = $(this).attr("data-state");
        switch (state) {
        case "0":
            $(this).attr("src", "pictures/top%20view%201.svg");
            $(this).attr("data-state", "1");
                loopDraw();
            break;
        case "1":
            if ($(this).attr("data-rotate") == "1") {
                $(this).attr("src", "pictures/top%20view%202.svg");
                $(this).attr("data-state", "2");
                $(this).attr("data-rotate", "0");
                loopDraw();
            }
            break;
        case "2":
            if ($(this).attr("data-rotate") == "1") {
                $(this).attr("src", "pictures/top%20view%203.svg");
                $(this).attr("data-state", "3");
                $(this).attr("data-rotate", "0");
                loopDraw();
            }
            break;
        case "3":
            if ($(this).attr("data-rotate") == "1") {
                $(this).attr("src", "pictures/top%20view%204.svg");
                $(this).attr("data-state", "4");
                $(this).attr("data-rotate", "0");
                loopDraw();
                $("#rotate").hide();
            }
            break;
        case "4":
            $(this).hide();
            $(this).attr("src", "pictures/top%20view%200.svg");
            $(this).attr("data-state", "0");
            //$(thisDish).attr("src", "pictures/top%20view%204.svg");
            $(thisDish).attr("data-state2", "1");
            $("#topview").css("transform", "rotate(0deg)");
                loopDraw();
            break;
        }
        var checkValue = 0;
        $('.petriDish').each(function () {
            //if statement here
            // use $(this) to reference the current div in the loop
            //you can try something like...
            if ($(this).attr("data-state2") == "1") {
                checkValue++;
            }
        });
        if (checkValue == 4) {
            state10();
        }
        else {
            checkValue = 0;
        }
    })
    var angle = 90;
    $("#rotate").click(function () {
        if ($("#topview").attr("data-rotate") == "0") {
            $("#topview").attr("data-rotate", "1");
            $("#topview").css("transform", "rotate(" + angle + "deg)");
            angle += 90;
            if (angle == 360) {
                angle = 90;
            }
        }
    })
}

function loopDraw(){
    $("#drawLoop").show();
    setTimeout(function(){
        $("#drawLoop").hide();
    },1000)

}

function state10() {
    var state = 0
    gameState++;
    if (hint == 1) {
        $("#messager").text("Click petri Dishes to stack them");
    }
    $("#petriDish1").css("animation", "stack1 1s forwards");
    $("#petriDish2").css("animation", "stack2 1s forwards");
    $("#petriDish3").css("animation", "stack3 1s forwards");
    $("#petriDish4").css("animation", "stack4 1s forwards");
    setTimeout(function () {
        $(".petriDish").hide();
        $("#stack").show(1000);
        if (hint == 1) $("#messager").text("Click the petri Dishe stack to turn it up side down");
    }, 1000);
    $("#stack").click(function () {
        if (state == 0) {
            $(this).css("animation", "upSideDown 1s forwards");
            state++;
            if (hint == 1) $("#messager").text("Drag the stack into incubator");
            setTimeout(function () {
                $("#stack").css("animation", "null");
                $("#stack").removeClass("stackUpSideDown");
            }, 1000);
            setTimeout(function () {
                state11();
            }, 2000);
        }
    })
}

function state11() {
    $("#gameTable").hide();
    $("#gameTable2").show();
    interact('#stack').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }, // enable autoScroll
        autoScroll: true, // call this function on every dragmove event
        onmove: dragMoveListener, // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
        }
    });
    interact('#incubator').dropzone({
        // only accept elements matching this CSS selector
        accept: '#stack', // Require a 75% element overlap for a drop to be possible
        overlap: 0.15, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            $(event.relatedTarget).hide(1000);
            $(event.target).attr("src", "pictures/043_ rezized petri dish stack in incubator.svg");
            setTimeout(function(){
                $("#nextDay").show();
            }, 500);
            setTimeout(function(){
                $("#nextDay").hide(1000);
            }, 3000);
            state12();
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state12() {
    var dishType = 0;
    var exam = 0;
    var counter = 0;
    if (hint == 1) $("#messager").text("click the incubator to get dishes");
    $("#incubator").click(function () {
        $("#incubator").attr("src", "pictures/incubator.svg")
        $(".label").show();
        $(".dish2").show();
        if (hint == 1) $("#messager").text("Drag dishes into the transilluminator to exam them.");
        interact('.dish2').draggable({
            // enable inertial throwing
            inertia: false, // keep the element within the area of it's parent
            restrict: {
                restriction: "#part2"
                , endOnly: true
                , elementRect: {
                    top: 0
                    , left: 0
                    , bottom: 1
                    , right: 1
                }
            }, // enable autoScroll `
            autoScroll: true, // call this function on every dragmove event
            onmove: dragMoveListener, // call this function on every dragend event
            onend: function (event) {
                var textEl = event.target.querySelector('p');
                textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
            }
        });
    });
    interact('.transilluminator').dropzone({
        // only accept elements matching this CSS selector
        accept: '.dish2', // Require a 75% element overlap for a drop to be possible
        overlap: 0.15, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            $(event.target).hide();
            $(event.relatedTarget).hide();
            if ($(event.relatedTarget).attr("id") == "petriDish22") {
                dishType = 2
                $("#transillumintorWithDish").attr("src", "pictures/058_green dots transiluminator.svg")
            }
            else {
                dishType = 1;
                $("#transillumintorWithDish").attr("src", "pictures/053_rotated%20transiliuminator.svg")
            }
            $("#transillumintorWithDish").show();
            exam = 1;
            if (hint == 1) $("#messager").text("click the transilluminator to zoom in");
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    $(".transilluminator").click(function () {
        if (exam == 1) {
            if (dishType == 0) {
                $("#zoomedPic").attr("src", "pictures/016_transiluminatorC2.svg");
            }
            else if (dishType == 1) {
                $("#zoomedPic").attr("src", "pictures/017_transiluminatorC3.svg");
            }
            else {
                $("#zoomedPic").attr("src", "pictures/018_transiluminatorC4.svg");
            }
            $("#zoomedPic").show();
            exam = 0;
            counter++;
        }
        if (hint == 1) $("#messager").text("click again to close it");
    })
    $("#zoomedPic").click(function () {
        if (hint == 1) $("#messager").text("Drag dishes into the transilluminator to exam them.");
        $("#zoomedPic").hide();
        if (counter == 4) {
            alert("End");
        }
    })
}

function openWaterBath() {
    $("#waterBath2").css("animation", "waterBathLeft 1s forwards");
}

function closeWaterBath() {
    $("#waterBath2").css("animation", "waterBathLeft2 1s forwards");
}

function instruction() {
    var picSrc = $("#insPic").attr("src");
    switch (gameState) {
    case 1:
        $("#insPic").attr("src", "pictures/02.PNG");
        break;
    case 2:
        $("#insPic").attr("src", "pictures/03.PNG");
        break;
    case 3:
        $("#insPic").attr("src", "pictures/04.PNG");
        break;
    case 6:
        $("#insPic").attr("src", "pictures/05.PNG");
        break;
    case 7:
        $("#insPic").attr("src", "pictures/06.PNG");
        break;
    case 8:
        $("#insPic").attr("src", "pictures/07.png");
        break;
    case 9:
        $("#insPic").attr("src", "pictures/08.PNG");
        break;
    case 10:
        $("#insPic").attr("src", "pictures/09.PNG");
        break;
    case 11:
        $("#insPic").attr("src", "pictures/10.PNG");
        break;
    case 12:
        $("#insPic").attr("src", "pictures/11.PNG");
        break;
    case 13:
        $("#insPic").attr("src", "pictures/12.PNG");
        break;
    }
    var newSrc = $("#insPic").attr("src");
    if (picSrc != newSrc) {
        $("#insPic").prev().css("background-color", "#99ff99");
        $("#insPic").insertAfter($("#insPic").next());
        console.log(newSrc);
    }
}
window.setInterval(function () {
    $("#debug").text("game state: " + gameState);
    instruction();
    9
}, 500);

function gotoTrashBin(x) {
    interact('#trashBin').dropzone({
        // only accept elements matching this CSS selector
        accept: x, // Require a 75% element overlap for a drop to be possible
        overlap: 0.10, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            $(event.relatedTarget).hide(1000);
            state2();
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function setTimer(duration, speed, answer) {
    var timer = duration
        , minutes, seconds;
    display = document.querySelector('#timerNumber');
    var myVar = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(myVar);
            $("#timer").hide();
        }
    }, speed);
}