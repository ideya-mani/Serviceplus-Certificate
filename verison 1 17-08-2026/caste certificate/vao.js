console.log('VAO');




// -----------------------------
// 1. Hide details based on selected certificate
// -----------------------------

const certificateMap = {

    // Residence
    "339530_1": [
        "341735",
        "341737",
        "343640_1"
    ],

    // Nativity
    "339530_2": [
        "341735",
        "341737",
        "344518",
        "344711"

    ],

    // Income
    "339530_3": [
        "341740",
        "342050",
        "342332"
    ],

    // EWS
    "339530_4": [
        "EWS_HEADER",
        "343193",
        "341740",
        "342050",
        "342332",
        "343209",
        "343202",
        "343203",
        "343200_1",
        "343204",
        "ASSET_DETAILS"
    ],

    // Caste - Educational
    "339530_5": [
        "STATE_HEADER",
        "343193",
        "343194",
        "343195",
        "343251",
        "343196"
    ],

    // Caste - Employment
    "339530_6": [
        "STATE_HEADER",
        "343193",
        "343194",
        "343195",
        "343251",
        "343196"
    ],

    // Govt. of India
    "339530_7": [
        "CENTRAL_HEADER",
        "343193",
        "343197",
        "343198",
        "343252",
        "343199",
        "343201"
    ]
};

// Hide all rows initially
$.each(certificateMap, function (_, fields) {

    $.each(fields, function (_, id) {

        switch(id){

            case "STATE_HEADER":
                $("#343193").closest(".trow").prev().hide();
                break;

            case "CENTRAL_HEADER":
                $("#343198").closest(".trow").prev().hide();
                break;

            case "EWS_HEADER":
                $("#343202").closest(".trow").prev().hide();
                break;
            case "ASSET_DETAILS":
              $("[data-type='DIV'][value='344546']").closest(".trow").hide();
              break;

            default:
                $("#" + id).closest(".trow").hide();

        }

    });

});

// Show rows based on checked certificate
var selectedCertificates = ($("#342413").val() || "").split(",");

$.each(certificateMap, function(checkId, fields){

    var value = checkId.split("_")[1];

    if(selectedCertificates.indexOf(value) !== -1){

        $.each(fields, function(_, id){

            switch(id){

                case "STATE_HEADER":
                    $("#343193").closest(".trow").prev().show();
                    break;

                case "CENTRAL_HEADER":
                    $("#343197").closest(".trow").prev().show();
                    break;

                case "EWS_HEADER":
                    $("#343209").closest(".trow").prev().show();
                    break;
                case "ASSET_DETAILS":
                    $("[data-type='DIV'][value='344546']").closest(".trow").show();
                    break;

                default:
                    $("#" + id).closest(".trow").show();

            }

        });

    }

});

// -----------------------------
// 2. Hide values
// -----------------------------

$('label[for="339530"]').closest('.tdata').hide(); //checkbox of applicant
$("#344734_1").closest(".trow").hide(); //gender
$("#344736").closest(".tdata").hide(); // married


// -----------------------------
// 3. Convert checkbox group → dropdown
// -----------------------------

const config = {
    sendToFirstRadio: "341684_1",
    sendToSecondRadio: "341684_2",

    firstGroup: "user_341685",
    secondGroup: "user_341686",

    firstDropdown: "riDropdown",
    secondDropdown: "dtDropdown",

    firstError: "error_341685",
    secondError: "error_341686",

    firstLabel: "Revenue Inspector",
    secondLabel: "Village Administrative Officer"
};

// Convert Checkbox Group to Dropdown

function convertToDropdown(groupId, dropdownId, labelText, errorId) {
    var group = document.getElementById(groupId);
    if (!group) return;

    var checkboxes = group.querySelectorAll("input[type='checkbox']");
    if (!checkboxes.length) return;

    var select = document.createElement("select");
    select.id = dropdownId;
    select.style.width = "250px";
    select.setAttribute('required', 'required'); // <-- ADDED this

    var option = document.createElement("option");
    option.value = "";
    option.text = "-- Select " + labelText + " --";
    select.appendChild(option);

    checkboxes.forEach(function (cb) {
        var label = group.querySelector("label[for='" + cb.id + "']");
        if (!label) return;

        var opt = document.createElement("option");
        opt.value = cb.value;
        opt.text = label.textContent.trim();
        select.appendChild(opt);
    });

    group.style.display = "none";
    group.parentNode.insertBefore(select, group);

    select.onchange = function () {
        checkboxes.forEach(cb => cb.checked = false);

        if (this.value) {
            var target = group.querySelector("input[value='" + this.value + "']");
            if (target) target.checked = true;
        }

        var err = document.getElementById(errorId);
        if (err) err.style.display = "none";
    };
}

// Call It
convertToDropdown(config.firstGroup, config.firstDropdown, config.firstLabel, config.firstError);
convertToDropdown(config.secondGroup, config.secondDropdown, config.secondLabel, config.secondError);

// Handle Send To Change
function handleSendToChange(cfg) {
    var dtRadio = document.getElementById(cfg.sendToFirstRadio);
    var riRadio = document.getElementById(cfg.sendToSecondRadio);

    var firstGroup = document.getElementById(cfg.firstGroup);
    var secondGroup = document.getElementById(cfg.secondGroup);

    var firstDropdown = document.getElementById(cfg.firstDropdown);
    var secondDropdown = document.getElementById(cfg.secondDropdown);

    function setState(group, dropdown, enabled) {
        if (!group || !dropdown) return;

        var checkboxes = group.querySelectorAll("input[type='checkbox']");

        if (enabled) {
            dropdown.disabled = false;
            dropdown.removeAttribute('disabled');
            checkboxes.forEach(cb => { cb.disabled = false; });
        } else {
            dropdown.value = "";
            dropdown.disabled = true;
            checkboxes.forEach(cb => { cb.checked = false; cb.disabled = true; });
        }
    }

    if (dtRadio.checked) {
        setState(firstGroup, firstDropdown, true);
        setState(secondGroup, secondDropdown, false);
    } else if (riRadio.checked) {
        setState(firstGroup, firstDropdown, false);
        setState(secondGroup, secondDropdown, true);
    }

    // Clear errors on switch
    var err1 = document.getElementById(cfg.firstError);
    var err2 = document.getElementById(cfg.secondError);
    if (err1) err1.style.display = 'none';
    if (err2) err2.style.display = 'none';
}

// Validation
function validateSendTo(cfg) {
    var dtRadio = document.getElementById(cfg.sendToFirstRadio);
    var riRadio = document.getElementById(cfg.sendToSecondRadio);

    var firstDropdown = document.getElementById(cfg.firstDropdown);
    var secondDropdown = document.getElementById(cfg.secondDropdown);

    var firstError = document.getElementById(cfg.firstError);
    var secondError = document.getElementById(cfg.secondError);

    firstError.style.display = "none";
    secondError.style.display = "none";

    if (dtRadio.checked && !firstDropdown.value) {
        firstError.textContent = "Please select a Village Administration Officer (VAO).";
        firstError.style.display = "block";
        firstDropdown.focus(); // <-- ADDED focus
        return false;
    }

    if (riRadio.checked && !secondDropdown.value) {
        secondError.textContent = "Please select a Revenue Inspector.";
        secondError.style.display = "block";
        secondDropdown.focus(); // <-- ADDED focus
        return false;
    }

    // If no radio is selected, let HTML5 required handle it
    return true;
}

// Event Binding
document.getElementById(config.sendToFirstRadio).addEventListener("change", () => handleSendToChange(config));
document.getElementById(config.sendToSecondRadio).addEventListener("change", () => handleSendToChange(config));

// Form submit interceptor - ADDED this section
var form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
        if (!validateSendTo(config)) {
            e.preventDefault();
        }
    });
}

// Validate on blur of dropdowns - ADDED this section
document.getElementById(config.firstDropdown).addEventListener('blur', function() {
    if (document.getElementById(config.sendToFirstRadio).checked && !this.value) {
        var err = document.getElementById(config.firstError);
        err.textContent = 'Please select a Revenue Inspector.';
        err.style.display = 'block';
    } else {
        document.getElementById(config.firstError).style.display = 'none';
    }
});

document.getElementById(config.secondDropdown).addEventListener('blur', function() {
    if (document.getElementById(config.sendToSecondRadio).checked && !this.value) {
        var err = document.getElementById(config.secondError);
        err.textContent = 'Please select a RVillage Administration Officer.';
        err.style.display = 'block';
    } else {
        document.getElementById(config.secondError).style.display = 'none';
    }
});

// Initial load
handleSendToChange(config);




// -----------------------------
// 2 Task-based enable/disable logic
// -----------------------------
function handleTaskChange() {

    var taskRI = document.getElementById("341684_1");   // Revenue Inspector Report
    var taskVAO = document.getElementById("341684_2");  // VAO Report

    var riGroup = document.getElementById("user_341685");
    var vaoGroup = document.getElementById("user_341686");

    var riDropdown = document.getElementById("riDropdown");
    var vaoDropdown = document.getElementById("vaoDropdown");

    function setState(group, dropdown, enabled) {

        if (!group || !dropdown) return;

        var checkboxes = group.querySelectorAll("input[type='checkbox']");

        if (!enabled) {

            dropdown.value = "";
            dropdown.disabled = true;

            checkboxes.forEach(cb => {
                cb.checked = false;
                cb.disabled = true;
            });

        } else {

            dropdown.disabled = false;

            checkboxes.forEach(cb => {
                cb.disabled = false;
            });
        }
    }

    if (taskRI && taskRI.checked) {
        setState(riGroup, riDropdown, true);
        setState(vaoGroup, vaoDropdown, false);
    }

    if (taskVAO && taskVAO.checked) {
        setState(vaoGroup, vaoDropdown, true);
        setState(riGroup, riDropdown, false);
    }
}


// Bind radio events
var task1 = document.getElementById("341684_1");
var task2 = document.getElementById("341684_2");

if (task1) task1.onchange = handleTaskChange;
if (task2) task2.onchange = handleTaskChange;

// Initial run
handleTaskChange();  


//hide as of check box of certificate
const map = {
    "339530_1": ["341753","341780","341756"], // Residence
    "339530_2": ["341754","341781","341757"], // Nativity
    "339530_3": ["341755","341782","341758"], // Income
    "339530_4": ["341759","341783","341762"], // EWS

    // Both Educational & Employment use Puducherry Caste fields
    "339530_5": ["341760","341784","341763"],
    "339530_6": ["341760","341784","341763"],

    // Govt. of India
    "339530_7": ["341761","341785","341764"]
};

var container = $('#341753').closest('.table_cont');

container.find('.trow').hide();

var selectedCertificates = ($("#342413").val() || "").split(",");

$.each(map, function(checkId, fields) {

    var value = checkId.split("_")[1];   // 339530_3 -> 3

    if (selectedCertificates.indexOf(value) !== -1) {

        $.each(fields, function(_, id) {
            $("#" + id).closest(".trow").show();
        });

    }

});



// -----------------------------
// 3 ruppees in words
// -----------------------------

function numberToWords(num) {

    if (num == 0) return "Zero Only";

    var ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
        "Sixty", "Seventy", "Eighty", "Ninety"];

    function convert(n) {
        var str = "";

        if (n > 99) {
            str += ones[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
        }

        if (n > 19) {
            str += tens[Math.floor(n / 10)] + " ";
            n %= 10;
        }

        if (n > 0) {
            str += ones[n] + " ";
        }

        return str;
    }

    var result = "";

    var crore = Math.floor(num / 10000000);
    num %= 10000000;

    var lakh = Math.floor(num / 100000);
    num %= 100000;

    var thousand = Math.floor(num / 1000);
    num %= 1000;

    if (crore) result += convert(crore) + "Crore ";
    if (lakh) result += convert(lakh) + "Lakh ";
    if (thousand) result += convert(thousand) + "Thousand ";
    if (num) result += convert(num);

    return result.trim();
}

var amountInput = document.getElementById("341740");
var wordsInput = document.getElementById("342050");

wordsInput.readOnly = true;

function updateAmountInWords() {
    var value = amountInput.value.replace(/,/g, "").trim();

    if (value === "" || isNaN(value)) {
        wordsInput.value = "";
        return;
    }

    wordsInput.value = numberToWords(parseInt(value, 10)) + " Only";
}

amountInput.addEventListener("input", updateAmountInWords);

// Populate when the page loads (for existing value)
updateAmountInWords();


// -----------------------------
// 7 Caste Script Loaded
// -----------------------------

console.log("Caste Script Loaded");

// *** UPDATED casteMaster WITH gazetteNo & gazetteDate ***

var casteMaster = {
  HINDU: [
    {
      caste: "AGAMUDIYAS",
      STATE: {
        category: "OBC",
        serial: "1",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "1",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "THULUVA VELLALAS",
      STATE: {
        category: "OBC",
        serial: "1",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "1",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "AYEERAVAISIAR",
      STATE: {
        category: "OBC",
        serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "2",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ACHARAPAKKAM CHETTIAR",
      STATE: {
        category: "OBC",
        serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "2",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "BERI CHETTIAR",
      STATE: {
        category: "OBC",
        serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "2",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MANJAPUDOOR CHETTIAR",
      STATE: {
        category: "OBC",
        serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "2",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VADAMBAR CHETTIAR",
      STATE: {
        category: "OBC",
        serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "2",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SOZHIA CHETTY",
      STATE: {
        category: "OBC",
        serial: "2",
        resolution: "G.O.Ms.No.13/2002/WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "EZHAVA",
      STATE: {
        category: "OBC",
        serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "5",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "GRAMANI",
      STATE: {
        category: "OBC",
        serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "5",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NADAR",
      STATE: {
        category: "OBC",
        serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "5",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SANAR",
      STATE: {
        category: "OBC",
        serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "5",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "TIYYA",
      STATE: {
        category: "OBC",
        serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "5",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ISAI VELLALAR",
      STATE: {
        category: "OBC",
        serial: "8",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "7",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "JANGAM",
      STATE: {
        category: "OBC",
        serial: "9",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "8",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "JANGAMAR",
      STATE: {
        category: "OBC",
        serial: "10",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "8",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KALAVANTHULA",
      STATE: {
        category: "OBC",
        serial: "10",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "9",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KAMSALI",
      STATE: {
        category: "OBC",
        serial: "11",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "10",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "DEVANGA",
      STATE: {
        category: "OBC",
        serial: "12",
        resolution: "G.O.Ms.No.4/2017-SWS, dated 07-06-2017",
        gazetteNo: "84",
        gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KANNADA DEVANGA",
      STATE: {
        category: "OBC",
        serial: "12",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "11",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "TELUGU DEVANGA",
      STATE: {
        category: "OBC",
        serial: "12",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "11",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KANAKKUPILLAI",
      STATE: {
        category: "OBC",
        serial: "13",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KARUNEEGAR",
      STATE: {
        category: "OBC",
        serial: "13",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KSHATRIYAS",
      STATE: {
        category: "OBC",
        serial: "14",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "49",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KONDA REDDY",
      STATE: {
        category: "OBC",
        serial: "15",
        resolution: "G.O.Ms.No.18/2007-WEL(SW-V) dated 19-06-2007",
        gazetteNo: "28",
        gazetteDate: "10-07-2007",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KONGU VELLALAR",
      STATE: {
        category: "OBC",
        serial: "16",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MAHRATTA (NON-BRAHMIN)",
      STATE: {
        category: "OBC",
        serial: "19",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "14",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KHATIK",
      STATE: {
        category: "OBC",
        serial: "19",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "14",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MUKKULATHOR",
      STATE: {
        category: "OBC",
        serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "18",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "AGAMUDAYA DEVAR",
      STATE: {
        category: "OBC",
        serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "18",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KALLAR",
      STATE: {
        category: "OBC",
        serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "18",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MARAVAR",
      STATE: {
        category: "OBC",
        serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "18",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "DEVAR",
      STATE: {
        category: "OBC",
        serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "18",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAINAR",
      STATE: {
        category: "OBC",
        serial: "26",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "19",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PADMASALI",
      STATE: {
        category: "OBC",
        serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "21",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PADMASALIAR",
      STATE: {
        category: "OBC",
        serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "21",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PATTU SALIAR",
      STATE: {
        category: "OBC",
        serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "21",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SALIAN",
      STATE: {
        category: "OBC",
        serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "21",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SALIAR",
      STATE: {
        category: "OBC",
        serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "21",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SALIARS",
      STATE: {
        category: "OBC",
        serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "21",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PALAYAPATTU NAIDU",
      STATE: {
        category: "OBC",
        serial: "29",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MALAYAMAN",
      STATE: {
        category: "OBC",
        serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NATHAMAN",
      STATE: {
        category: "OBC",
        serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULA MOOPANAR",
      STATE: {
        category: "OBC",
        serial: "30",
        resolution: "G.O.Ms.No.40/2005-WEL(SW-V) dated 28-09-2005",
        gazetteNo: "44",
        gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULA PILLAI",
      STATE: {
        category: "OBC",
        serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULA UDAYAR",
      STATE: {
        category: "OBC",
        serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULAM",
      STATE: {
        category: "OBC",
        serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SURUTHIMAN",
      STATE: {
        category: "OBC",
        serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PATTU CHETTIAR",
      STATE: {
        category: "OBC",
        serial: "31",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "52",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "REDDY (GANJAM)",
      STATE: {
        category: "OBC",
        serial: "32",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "24 MANAI TELUGU CHETTY",
      STATE: {
        category: "OBC",
        serial: "33",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "23",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SADHU CHETTY",
      STATE: {
        category: "OBC",
        serial: "33",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "23",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "TELUGUPATTY CHETTY",
      STATE: {
        category: "OBC",
        serial: "33",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "23",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SALIA CHETTIAR",
      STATE: {
        category: "OBC",
        serial: "34",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "53",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SENAI THALAIVAR",
      STATE: {
        category: "OBC",
        serial: "35",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "59",
        resolution: "12015/13/2010-B.C.-II dated 08.12.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SENGUNTHAR",
      STATE: {
        category: "OBC",
        serial: "36",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "24",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KAIKOLAR",
      STATE: {
        category: "OBC",
        serial: "36",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "24",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SETTIBALIJA(EDIGA)",
      STATE: {
        category: "OBC",
        serial: "37",
        resolution: "G.O.Ms.No.26/2002-WEL(SW-II) dated 10-06-2002",
        gazetteNo: "117",
        gazetteDate: "20-06-2002",
      },
      CENTRAL: {
        category: "OBC",
        serial: "25",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SOZHIA VELLALAR",
      STATE: {
        category: "OBC",
        serial: "38",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VADAMALAI CHETTIAR",
      STATE: {
        category: "OBC",
        serial: "39",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "54",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "BALIJA NAIDU",
      STATE: {
        category: "OBC",
        serial: "40",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CAVARA NAIDU",
      STATE: {
        category: "OBC",
        serial: "40",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "51",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "GAVARALU",
      STATE: {
        category: "OBC",
        serial: "40",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "51",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VADUGAN",
      STATE: {
        category: "OBC",
        serial: "40",
        resolution: "G.O.Ms.No.12/2009-WEL(SW-V) dated 10.11.2009",
        gazetteNo: "47",
        gazetteDate: "24-11-2009",
      },
      CENTRAL: {
        category: "OBC",
        serial: "57",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VALAYAL NAIDU",
      STATE: {
        category: "OBC",
        serial: "40",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "51",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VANDAYAR",
      STATE: {
        category: "OBC",
        serial: "41",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VANIAR",
      STATE: {
        category: "OBC",
        serial: "42",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "26",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VANIYA CHETTY",
      STATE: {
        category: "OBC",
        serial: "42",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VELLALA CHETTIAR",
      STATE: {
        category: "OBC",
        serial: "45",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VISWAKARMA",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KALTHATCHAR",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KAMMALAR",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KANNAR",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KARUMAR",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PATHAR",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PORKOLLAR",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "THATCHAR",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "THATTAR",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VISWAKARMALA",
      STATE: {
        category: "OBC",
        serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "29",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KONAR",
      STATE: {
        category: "OBC",
        serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "30",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAMBAR YADAVA",
      STATE: {
        category: "OBC",
        serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "30",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "YADAVA",
      STATE: {
        category: "OBC",
        serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "30",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "IDAYAR",
      STATE: {
        category: "OBC",
        serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "30",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "GOLLALU",
      STATE: {
        category: "OBC",
        serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "30",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "YADAVA PILLAI",
      STATE: {
        category: "OBC",
        serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "30",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "YADAVA NAIDU",
      STATE: {
        category: "OBC",
        serial: "48",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "31",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KANNADA SAINEEGAR",
      STATE: {
        category: "OBC",
        serial: "50",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KANNADIAR",
      STATE: {
        category: "OBC",
        serial: "50",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "BHAT RAJU",
      STATE: {
        category: "OBC",
        serial: "51",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC",
        serial: "33",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MUTHU RAJA",
      STATE: {
        category: "OBC",
        serial: "51",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC",
        serial: "33",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "BONDILI",
      STATE: {
        category: "OBC",
        serial: "52",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC",
        serial: "34",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MUTHIRAYAR",
      STATE: {
        category: "OBC",
        serial: "54",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC",
        serial: "36",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAGARAM",
      STATE: {
        category: "OBC",
        serial: "55",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC",
        serial: "37",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAGARATHAR",
      STATE: {
        category: "OBC",
        serial: "55",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC",
        serial: "37",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VEERAKODI VELLALA",
      STATE: {
        category: "OBC",
        serial: "56",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002",
        gazetteNo: "13",
        gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC",
        serial: "38",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CHATTADI (CHATTADA OR SRIVAISHNAVA)",
      STATE: {
        category: "OBC",
        serial: "57",
        resolution: "G.O.Ms.No.18/2007-WEL(SW-V) dated 19-06-2007",
        gazetteNo: "28",
        gazetteDate: "10-07-2007",
      },
      CENTRAL: {
        category: "OBC",
        serial: "39",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "GAMALLA",
      STATE: {
        category: "OBC",
        serial: "59",
        resolution: "G.O.Ms.No.56/2003-WEL(SW-II) dated 01-12-2003",
        gazetteNo: "51",
        gazetteDate: "23-12-2003",
      },
      CENTRAL: {
        category: "OBC",
        serial: "41",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ODDE",
      STATE: {
        category: "OBC",
        serial: "60",
        resolution: "G.O.Ms.No.56/2003-WEL(SW-II) dated 01-12-2003",
        gazetteNo: "51",
        gazetteDate: "23-12-2003",
      },
      CENTRAL: {
        category: "OBC",
        serial: "42",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KURUMBA",
      STATE: {
        category: "OBC",
        serial: "61",
        resolution: "G.O.Ms.No.56/2003-WEL(SW-II) dated 01-12-2003",
        gazetteNo: "51",
        gazetteDate: "23-12-2003",
      },
      CENTRAL: {
        category: "OBC",
        serial: "43",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ANDIPANDARAM",
      STATE: {
        category: "OBC",
        serial: "64",
        resolution: "G.O.Ms.No.42/2004-WEL(SW-V) dated 09-11-2004",
        gazetteNo: "44",
        gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC",
        serial: "46",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KANISAN",
      STATE: {
        category: "OBC",
        serial: "65",
        resolution: "G.O.Ms.No.42/2004-WEL(SW-V) dated 09-11-2004",
        gazetteNo: "44",
        gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC",
        serial: "47",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KANIYAN",
      STATE: {
        category: "OBC",
        serial: "65",
        resolution: "G.O.Ms.No.42/2004-WEL(SW-V) dated 09-11-2004",
        gazetteNo: "44",
        gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC",
        serial: "47",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KUDUMBI",
      STATE: {
        category: "OBC",
        serial: "67",
        resolution: "G.O.Ms.No.19/2007-WEL(SW-V) dated 19-06-2007",
        gazetteNo: "28",
        gazetteDate: "10-07-2007",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "TELIKULA",
      STATE: {
        category: "OBC",
        serial: "68",
        resolution: "G.O.Ms.No.08/2014/SWS dated 13-02-2015",
        gazetteNo: "8",
        gazetteDate: "24-02-2015",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "TELUKULA",
      STATE: {
        category: "OBC",
        serial: "68",
        resolution: "G.O.Ms.No.08/2014/SWS dated 13-02-2015",
        gazetteNo: "8",
        gazetteDate: "24-02-2015",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VELLAN CHETTY",
      STATE: {
        category: "OBC",
        serial: "69",
        resolution: "G.O.Ms.No.02/2016/SWS dated 05-08-2016",
        gazetteNo: "33",
        gazetteDate: "16-08-2016",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "UPPARA",
      STATE: {
        category: "OBC",
        serial: "70",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017",
        gazetteNo: "84",
        gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "DOODEKULA SAIBU",
      STATE: {
        category: "OBC",
        serial: "71",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017",
        gazetteNo: "84",
        gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "DUDEKULA",
      STATE: {
        category: "OBC",
        serial: "71",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017",
        gazetteNo: "84",
        gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PERIKA",
      STATE: {
        category: "OBC",
        serial: "72",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017",
        gazetteNo: "84",
        gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PERIKE",
      STATE: {
        category: "OBC",
        serial: "72",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017",
        gazetteNo: "84",
        gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "GOWDA",
      STATE: {
        category: "OBC",
        serial: "73",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017",
        gazetteNo: "84",
        gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CHAKKALA",
      STATE: {
        category: "OBC",
        serial: "74",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017",
        gazetteNo: "84",
        gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    // EBC entries
    {
      caste: "CHETTIAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CHINNA PATTINAVAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MEENAVA CHETTIAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MEENAVAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NATTAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARVATHARAJAKUKAM",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PATTINAVA CHETTIAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PATTINAVAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PERIYA PATTINAVAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SEMBADAVAR",
      STATE: {
        category: "EBC",
        serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    // BT entries
    {
      caste: "MALAIKURAVAN",
      STATE: {
        category: "BT",
        serial: "2",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010",
        gazetteNo: "16",
        gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MALAKURAVAN",
      STATE: {
        category: "BT",
        serial: "2",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010",
        gazetteNo: "16",
        gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KATTUNAYAKAN",
      STATE: {
        category: "BT",
        serial: "3",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010",
        gazetteNo: "16",
        gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "6",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "YERUKULA",
      STATE: {
        category: "BT",
        serial: "4",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010",
        gazetteNo: "16",
        gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "32",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KURUMAN",
      STATE: {
        category: "BT",
        serial: "5",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010",
        gazetteNo: "16",
        gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KURUMANS",
      STATE: {
        category: "BT",
        serial: "5",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010",
        gazetteNo: "16",
        gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    // ST entries (gazette blank)
    {
      caste: "IRULAR",
      STATE: {
        category: "ST",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "ST",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VETTAIKARAN",
      STATE: {
        category: "ST",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "ST",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VILLI",
      STATE: {
        category: "ST",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "ST",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    // MBC entries
    {
      caste: "KUYAVAR",
      STATE: {
        category: "MBC",
        serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "12",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KULALAR",
      STATE: {
        category: "MBC",
        serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "12",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KUMBARAR",
      STATE: {
        category: "MBC",
        serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "12",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KUMMARI",
      STATE: {
        category: "MBC",
        serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "12",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MANNUDAYAR",
      STATE: {
        category: "MBC",
        serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "12",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PATHAR",
      STATE: {
        category: "MBC",
        serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "12",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "POONUL KUYAVAR",
      STATE: {
        category: "MBC",
        serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "12",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VELAAR",
      STATE: {
        category: "MBC",
        serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "12",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MARUDHA NAIDU",
      STATE: {
        category: "MBC",
        serial: "3",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MARUTHUVAR",
      STATE: {
        category: "MBC",
        serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "15",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAYEE BRAHMIN",
      STATE: {
        category: "MBC",
        serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "15",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MANGALI",
      STATE: {
        category: "MBC",
        serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "15",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "AMBATTAN",
      STATE: {
        category: "MBC",
        serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "15",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAVITHAR",
      STATE: {
        category: "MBC",
        serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "15",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PANDITHAR",
      STATE: {
        category: "MBC",
        serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "15",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARIYARI",
      STATE: {
        category: "MBC",
        serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "15",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PRONOPAKARI",
      STATE: {
        category: "MBC",
        serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "15",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "AGNIKULAKSHATRIYA",
      STATE: {
        category: "MBC",
        serial: "5",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MUKKUVAN",
      STATE: {
        category: "MBC",
        serial: "5",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARAVAR",
      STATE: {
        category: "MBC",
        serial: "5",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MUKYA",
      STATE: {
        category: "MBC",
        serial: "5",
        resolution: "G.O.Ms.No.7/2009-Wel(SW-V) dated 28.01.2009",
        gazetteNo: "10",
        gazetteDate: "10-02-2009",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VADABALIJA",
      STATE: {
        category: "MBC",
        serial: "5",
        resolution: "G.O.Ms.No.56/2003-WEL(SW-II) dated 01-12-2003",
        gazetteNo: "51",
        gazetteDate: "23-12-2003",
      },
      CENTRAL: {
        category: "OBC",
        serial: "16",
        resolution: "12015/05/2011-BC II dated 17.02.2014",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "OTTAR",
      STATE: {
        category: "MBC",
        serial: "6",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "55",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VANNAN",
      STATE: {
        category: "MBC",
        serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "56",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VANNAR",
      STATE: {
        category: "MBC",
        serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "56",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "EKALI",
      STATE: {
        category: "MBC",
        serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "56",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MANNAN",
      STATE: {
        category: "MBC",
        serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "56",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "RAJAKA",
      STATE: {
        category: "MBC",
        serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "56",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CHAKKALI",
      STATE: {
        category: "MBC",
        serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "56",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VANNIAKULA KSHATRIYA",
      STATE: {
        category: "MBC",
        serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "28",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "GOUNDER",
      STATE: {
        category: "MBC",
        serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAICKER",
      STATE: {
        category: "MBC",
        serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "28",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PADAYATCHI",
      STATE: {
        category: "MBC",
        serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "28",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PALLI",
      STATE: {
        category: "MBC",
        serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "28",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VANNIAR",
      STATE: {
        category: "MBC",
        serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "28",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NOKKAR",
      STATE: {
        category: "MBC",
        serial: "10",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "35",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NOKKAN",
      STATE: {
        category: "MBC",
        serial: "10",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "35",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NARIKURAVAR",
      STATE: {
        category: "MBC",
        serial: "11",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004",
        gazetteNo: "31",
        gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "40",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MEDARA OF YANAM",
      STATE: {
        category: "MBC",
        serial: "12",
        resolution: "G.O.Ms.No.43/2004-Wel (SW-V) dated 09.11.2004",
        gazetteNo: "49",
        gazetteDate: "07-12-2004",
      },
      CENTRAL: {
        category: "OBC",
        serial: "45",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "EZHUTHACHAN",
      STATE: {
        category: "MBC",
        serial: "13",
        resolution: "G.O.Ms.No.41/2005-Wel (SW-V) dated 28.09.2005",
        gazetteNo: "44",
        gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC",
        serial: "58",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "EZHUTHACHANS",
      STATE: {
        category: "MBC",
        serial: "13",
        resolution: "G.O.Ms.No.41/2005-Wel (SW-V) dated 28.09.2005",
        gazetteNo: "44",
        gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC",
        serial: "58",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KAVUTHIYA",
      STATE: {
        category: "MBC",
        serial: "14",
        resolution: "G.O.Ms.No.7/2009-Wel(SW-V) dated 28.01.2009",
        gazetteNo: "10",
        gazetteDate: "10-02-2009",
      },
      CENTRAL: {
        category: "OBC",
        serial: "44",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KAVUTHIYAN",
      STATE: {
        category: "MBC",
        serial: "14",
        resolution: "G.O.Ms.No.7/2009-Wel(SW-V) dated 28.01.2009",
        gazetteNo: "10",
        gazetteDate: "10-02-2009",
      },
      CENTRAL: {
        category: "OBC",
        serial: "44",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    // SC entries (gazette blank)
    {
      caste: "ADI ANDHRA",
      STATE: {
        category: "SC",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ADI DRAVIDA",
      STATE: {
        category: "SC",
        serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CHAKKILIYAN",
      STATE: {
        category: "SC",
        serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "JAMBUVULU",
      STATE: {
        category: "SC",
        serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KURAVAN",
      STATE: {
        category: "SC",
        serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MADIGA",
      STATE: {
        category: "SC",
        serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MALA",
      STATE: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MALA MASTI",
      STATE: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PAKY",
      STATE: {
        category: "SC",
        serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PALLAN",
      STATE: {
        category: "SC",
        serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARAYAN",
      STATE: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAMBAVAR",
      STATE: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAMBAN",
      STATE: {
        category: "SC",
        serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "THOTI",
      STATE: {
        category: "SC",
        serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VALLUVAN",
      STATE: {
        category: "SC",
        serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VETAN",
      STATE: {
        category: "SC",
        serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VETTIYAN",
      STATE: {
        category: "SC",
        serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PUTHIRAI VANNAN",
      STATE: {
        category: "SC",
        serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    // GENERAL entries (no STATE or empty)
    {
      caste: "BRAHMIN",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KAPU",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "REDDIAR",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KSHATRIYA",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "JAIN",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ARYA VYSYA",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAIR",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "AGARWAL",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "AADHI SAIVAR BRAHMIN",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "THONDAIMANDALA MUDALIAR",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAMBOODIRI",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAMBEESAN",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAMBIAR",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MENON",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MARAR",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KURUPP",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VAISHYA",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KAMMA",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "REDDY",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CHOWDARY",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KATTUNAICKER",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "6",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KULELA",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "20",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "NAMDEV MARATHA",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "14",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "UDAYAR",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULA UDAIYAR",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "22",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SALIAR",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "21",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAMBAR",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "30",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KHATRIYAS",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "49",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
  ],
  CHRISTIAN: [
    {
      caste:
        "CONVERTS TO CHRISTIANITY FROM ANY HINDU BACKWARD CLASSES COMMUNITY IRRESPECTIVE OF THE GENERATION OF CONVERSION",
      STATE: {
        category: "OBC",
        serial: "3",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "3",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste:
        "CONVERTS TO CHRISTIANITY FROM SCHEDULED CASTES IRRESPECTIVE OF THE GENERATION OF CONVERSION",
      STATE: {
        category: "OBC",
        serial: "4",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "4",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "LATIN CATHOLICS",
      STATE: {
        category: "OBC",
        serial: "18",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001",
        gazetteNo: "29",
        gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC",
        serial: "50",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ANGLO INDIAN",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ROMAN CATHOLIC",
      STATE: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
  ],
  MUSLIM: [
    {
      caste: "DEKKANI MUSLIMS",
      STATE: {
        category: "BCM",
        serial: "1",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MAPPILA",
      STATE: {
        category: "BCM",
        serial: "2",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "13",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "LABBAI",
      STATE: {
        category: "BCM",
        serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "17",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MARICAR",
      STATE: {
        category: "BCM",
        serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "17",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "RAVUTHAR",
      STATE: {
        category: "BCM",
        serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "17",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAIBU",
      STATE: {
        category: "BCM",
        serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC",
        serial: "17",
        resolution: "12015/15/2008-BCC dated 16.06.2011",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SHAIK",
      STATE: {
        category: "BCM",
        serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SYED",
      STATE: {
        category: "BCM",
        serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010",
        gazetteNo: "37",
        gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "LUBBAI",
      STATE: {
        category: "",
        serial: "",
        resolution: "",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC",
        serial: "17",
        resolution: "12011/14/2004-BCC dated 12.03.2007",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
  ],
  SIKH: [
    // SC list same as Hindu SC (with blank gazette)
    {
      caste: "ADI ANDHRA",
      STATE: {
        category: "SC",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ADI DRAVIDA",
      STATE: {
        category: "SC",
        serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CHAKKILIYAN",
      STATE: {
        category: "SC",
        serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "JAMBUVULU",
      STATE: {
        category: "SC",
        serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KURAVAN",
      STATE: {
        category: "SC",
        serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MADIGA",
      STATE: {
        category: "SC",
        serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MALA",
      STATE: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MALA MASTI",
      STATE: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PAKY",
      STATE: {
        category: "SC",
        serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PALLAN",
      STATE: {
        category: "SC",
        serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARAYAN",
      STATE: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAMBAVAR",
      STATE: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAMBAN",
      STATE: {
        category: "SC",
        serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "THOTI",
      STATE: {
        category: "SC",
        serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VALLUVAN",
      STATE: {
        category: "SC",
        serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VETAN",
      STATE: {
        category: "SC",
        serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VETTIYAN",
      STATE: {
        category: "SC",
        serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PUTHIRAI VANNAN",
      STATE: {
        category: "SC",
        serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
  ],
  BUDHIST: [
    // Same SC list (blank)
    {
      caste: "ADI ANDHRA",
      STATE: {
        category: "SC",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "ADI DRAVIDA",
      STATE: {
        category: "SC",
        serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "CHAKKILIYAN",
      STATE: {
        category: "SC",
        serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "JAMBUVULU",
      STATE: {
        category: "SC",
        serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "KURAVAN",
      STATE: {
        category: "SC",
        serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MADIGA",
      STATE: {
        category: "SC",
        serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MALA",
      STATE: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "MALA MASTI",
      STATE: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PAKY",
      STATE: {
        category: "SC",
        serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PALLAN",
      STATE: {
        category: "SC",
        serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PARAYAN",
      STATE: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAMBAVAR",
      STATE: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "SAMBAN",
      STATE: {
        category: "SC",
        serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "THOTI",
      STATE: {
        category: "SC",
        serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VALLUVAN",
      STATE: {
        category: "SC",
        serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VETAN",
      STATE: {
        category: "SC",
        serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "VETTIYAN",
      STATE: {
        category: "SC",
        serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
    {
      caste: "PUTHIRAI VANNAN",
      STATE: {
        category: "SC",
        serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002",
        gazetteNo: "",
        gazetteDate: "",
      },
      CENTRAL: {
        category: "SC",
        serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002",
        gazetteNo: "",
        gazetteDate: "",
      },
    },
  ],
};

// ============================================
// MODIFIED initializeCasteControl (now accepts optional gazzettenoId and gazzettedateId)
// ============================================

var convertedReligionDropdowns = {};

function initializeCasteControl(config) {
  var religion = $("#" + config.religionId);
  var caste = $("#" + config.casteId);
  var category = $("#" + config.categoryId);
  var serial = $("#" + config.serialId);
  var resolution = $("#" + config.resolutionId);
  var gazetteNo = config.gazzettenoId ? $("#" + config.gazzettenoId) : null;
  var gazetteDate = config.gazzettedateId
    ? $("#" + config.gazzettedateId)
    : null;

  if (religion.length === 0 || caste.length === 0) {
    console.log("Caste Control : Required fields not found.");
    return;
  }

  config.source = (config.source || "STATE").toUpperCase();
  if ($.inArray(config.source, ["STATE", "CENTRAL"]) === -1) {
    config.source = "STATE";
  }

  config.mode = (config.mode || "NORMAL").toUpperCase();
  if ($.inArray(config.mode, ["NORMAL", "EWS", "ALL"]) === -1) {
    config.mode = "NORMAL";
  }

  config.others = config.others === true;

  var resultBox = null;

  category.prop("readonly", true);
  serial.prop("readonly", true);
  resolution.prop("readonly", true);
  if (gazetteNo) gazetteNo.prop("readonly", true);
  if (gazetteDate) gazetteDate.prop("readonly", true);

  // Convert the religion dropdown ONCE per unique religionId.
  if (!convertedReligionDropdowns[config.religionId]) {
    convertReligionDropdown();
    convertedReligionDropdowns[config.religionId] = true;
  } else {
    religion = $("#" + config.religionId);
  }

  createSearchBox();
  loadExistingValue();

  religion
    .off("change.casteRebuild_" + config.casteId)
    .on("change.casteRebuild_" + config.casteId, function () {
      clearDetails();
      buildCasteList("");
    });

  function clearDetails() {
    caste.val("");
    category.val("").trigger("change");
    serial.val("").trigger("change");
    resolution.val("").trigger("change");

    if (gazetteNo) gazetteNo.val("").trigger("change");
    if (gazetteDate) gazetteDate.val("").trigger("change");

    serial.prop("readonly", true);
    resolution.prop("readonly", true);

    if (gazetteNo) gazetteNo.prop("readonly", true);
    if (gazetteDate) gazetteDate.prop("readonly", true);
  }

  function convertReligionDropdown() {
    var oldValue = religion.val();
    var select = $("<select>");
    select.attr({
      id: config.religionId,
      name: config.religionId,
    });
    select.addClass(religion.attr("class"));
    select.css({ width: "100%" });
    select.append($("<option>").val("").text("Select Religion"));

    $.each(Object.keys(casteMaster), function (index, religionName) {
      select.append($("<option>").val(religionName).text(religionName));
    });

    select.val(oldValue);
    religion.replaceWith(select);
    religion = $("#" + config.religionId);
  }

  function createSearchBox() {
    var wrapper = $("<div>");
    wrapper.css({ position: "relative", width: "100%" });
    caste.wrap(wrapper);

    resultBox = $("<div>");
    resultBox.css({
      position: "absolute",
      top: "100%",
      left: "0",
      right: "0",
      background: "#ffffff",
      border: "1px solid #cccccc",
      maxHeight: "220px",
      overflowY: "auto",
      zIndex: "99999",
      display: "none",
      color: "#000000",
      fontFamily: "Arial",
      fontSize: "12px",
      boxSizing: "border-box",
    });

    caste.after(resultBox);

    caste.on("focus keyup", function () {
      buildCasteList($(this).val());
    });

    caste.on("change blur", function () {
      var religionValue = religion.val();
      if (!religionValue) return;
      var value = $.trim($(this).val()).toUpperCase();
      if (config.others && value === "OTHERS") return;
      var list = casteSearchIndex[religionValue.toUpperCase()];
      var found = false;
      $.each(list, function (_, obj) {
        var details = getSourceDetails(obj.data);
        if (!details) return;
        if (obj.searchText === value) {
          fillDetails(details);
          found = true;
          return false;
        }
      });

      if (!found) {
        caste.val("");
        clearDetails();
      }
    });

    $(document).on("click.caste_" + config.casteId, function (e) {
      if ($(e.target).closest(resultBox).length) return;
      if ($(e.target).is(caste)) return;
      resultBox.hide();
    });
  }

  function buildCasteList(searchText) {
    resultBox.empty();
    var religionValue = religion.val();
    if (!religionValue) {
      resultBox.hide();
      return;
    }

    var list = casteSearchIndex[religionValue.toUpperCase()];
    if (!list) {
      resultBox.hide();
      return;
    }

    searchText = (searchText || "").toUpperCase();
    var displayList = [];

    $.each(list, function (index, obj) {
      var details = getSourceDetails(obj.data);
      if (!details) return;
      if (searchText !== "" && obj.searchText.indexOf(searchText) < 0) return;
      displayList.push({ data: obj.data, details: details });
    });

    displayList.sort(function (a, b) {
      return a.data.caste.localeCompare(b.data.caste);
    });

    $.each(displayList, function (_, item) {
      createOption(item.data, item.details);
    });

    if (config.others) {
      createOption(
        { caste: "OTHERS" },
        {
          category: config.mode === "EWS" ? "GENERAL" : "OBC",
          serial: "",
          resolution: "",
          gazetteNo: "",
          gazetteDate: "",
        },
      );
    }

    if (resultBox.children().length > 0) {
      resultBox.show();
    } else {
      resultBox.hide();
    }
  }

  function createOption(item, details) {
    var option = $("<div>");
    option.text(item.caste);
    option.css({
      padding: "7px",
      cursor: "pointer",
      color: "#000",
      background: "#fff",
      display: "block",
    });

    option.on("mouseenter", function () {
      $(this).css("background", "#eeeeee");
    });
    option.on("mouseleave", function () {
      $(this).css("background", "#ffffff");
    });

    option.on("mousedown", function (e) {
      e.preventDefault();
      caste.val(item.caste);
      fillDetails(details);
      resultBox.hide();
    });

    resultBox.append(option);
  }

  function fillDetails(item) {
    category.val(item.category).trigger("change");
    serial.val(item.serial).trigger("change");
    resolution.val(item.resolution).trigger("change");

    if (gazetteNo) gazetteNo.val(item.gazetteNo || "").trigger("change");
    if (gazetteDate) gazetteDate.val(item.gazetteDate || "").trigger("change");

    // Allow editing only for OTHERS
    var isOthers = caste.val().toUpperCase() === "OTHERS";

    serial.prop("readonly", !isOthers);
    resolution.prop("readonly", !isOthers);

    if (gazetteNo) gazetteNo.prop("readonly", !isOthers);
    if (gazetteDate) gazetteDate.prop("readonly", !isOthers);
  }

  function loadExistingValue() {
      var religionValue = religion.val();
      var casteValue = $.trim(caste.val());

      if (!religionValue || !casteValue) return;

      // Existing OTHERS record
      if (config.others && casteValue.toUpperCase() === "OTHERS") {

          if (!category.val()) {
              category.val(config.mode === "EWS" ? "GENERAL" : "OBC")
                      .trigger("change");
          }

          serial.prop("readonly", false);
          resolution.prop("readonly", false);

          if (gazetteNo) gazetteNo.prop("readonly", false);
          if (gazetteDate) gazetteDate.prop("readonly", false);

          return;
      }

      var list = casteSearchIndex[religionValue.toUpperCase()];
      if (!list) return;

      casteValue = casteValue.toUpperCase();

      $.each(list, function (index, obj) {
          if (obj.searchText == casteValue) {
              var details = getSourceDetails(obj.data);
              if (details) fillDetails(details);
              return false;
          }
      });
  }

  function getSourceDetails(item) {
    var details = item[config.source];
    if (!details) return null;
    var category = $.trim(details.category || "");
    if (config.mode === "EWS") {
      if (category.toUpperCase() !== "GENERAL") return null;
    } else {
      if (category === "") return null;
      if (category.toUpperCase() === "GENERAL") return null;
    }
    return details;
  }
}

// ============================================
// Create Caste Search Index
// ============================================

var casteSearchIndex = {};

Object.keys(casteMaster).forEach(function (religion) {
  casteSearchIndex[religion.toUpperCase()] = casteMaster[religion].map(
    function (item) {
      return {
        searchText: item.caste.toUpperCase(),
        data: item,
      };
    },
  );
});


// 1. State + Hide General (Normal Caste Certificate)
initializeCasteControl({
  religionId: "343193",

  casteId: "343194",

  categoryId: "343195",

  serialId: "343251",

  resolutionId: "343196",

  source: "STATE",

  mode: "NORMAL",
});

// 2. Central Caste Certificate
initializeCasteControl({
  religionId: "343193",

  casteId: "343198",

  categoryId: "343252",

  serialId: "343199",

  resolutionId: "343201",

  source: "CENTRAL",

  mode: "NORMAL",
  others:true
});

// 3. Central + Show General (EWS Caste Certificate)
initializeCasteControl({
  religionId: "343193",

  casteId: "343202",

  categoryId: "343203",

  serialId: "999999",

  resolutionId: "888888",

  source: "CENTRAL",

  mode: "EWS",
  others:true
});


// -----------------------------
// 3. 2B Residence Certificate
// -----------------------------

  if (!$("input[name='343640']:checked").length) {
      $("#343640_1").prop("checked", true);
  }

  function toggleFields() {
      if ($("#343640_1").is(":checked")) {
          $("#344709").closest(".tdata").hide();
          $("#344710_additionalDoc").closest(".tdata").hide();
      } else {
          $("#344709").closest(".tdata").show();
          $("#344710_additionalDoc").closest(".tdata").show();
      }
  }

  toggleFields();

  $("input[name='343640']").on("change", toggleFields);

// ---------------------------------------------------------
// 4. default value select for dropdown of navitiy & parent 
// ---------------------------------------------------------

//Father select
if (!$("#344720").val()) {
    $("#344720").val("1").trigger("change");
}

//Continuous Residence
if (!$("#344711").val()) {
    $("#344711").val("2").trigger("change");
}

// ---------------------------------------------------------
// 5. Relation with the Applicant's
// ---------------------------------------------------------

function updateRelation() {

    var gender = $("input[name='344734']:checked").val();
    var marital = $("#344736").val();
    var $relation = $("#344708");

    // Clear dropdown
    $relation.empty();

    // Always add Please Select
    $relation.append('<option value="">Please Select</option>');


    if (gender == "1") { 
        // Male
        $relation.append('<option value="1">Son of</option>');
        $relation.val("1");
    }

    else if (gender == "2" || gender == "3") {

        if (marital == "2") {
            // Unmarried Female/Others
            $relation.append('<option value="3">Daughter of</option>');
            $relation.val("3");
        }

        else if (marital == "1") {
            // Married Female/Others
            $relation.append('<option value="2">Wife of</option>');
            $relation.append('<option value="3">Daughter of</option>');
            $relation.val("2");
        }

        else {
            // Default female/others
            $relation.append('<option value="2">Wife of</option>');
            $relation.append('<option value="3">Daughter of</option>');
            $relation.val("2");
        }
    }

    $relation.trigger("change");
}


$("input[name='344734']").on("change", updateRelation);
$("#344736").on("change", updateRelation);

if (!$("input[name='344734']:checked").length) {
    $("#344734_1").prop("checked", true);
}

if (!$("#344736").val()) {
    $("#344736").val("2").trigger("change");
}

// Initial load
updateRelation();

// ---------------------------------------------------------
// 6. Others hide/show for central / EWS
// ---------------------------------------------------------

    function toggleOtherCaste() {

        if ($("#343198").val().trim().toUpperCase() === "OTHERS") {
            $("#344553").closest(".tdata").show();
        } else {
            $("#344553").closest(".tdata").hide();
            $("#344553").val("");
        }

        if ($("#343202").val().trim().toUpperCase() === "OTHERS") {
            $("#343204").closest(".tdata").show();
        } else {
            $("#343204").closest(".tdata").hide();
            $("#343204").val("");
        }
    }

    // Initial page load
    toggleOtherCaste();

    // When the values change
    $("#343198, #343202").on("keyup change", toggleOtherCaste);


// -----------------------------
// 7 SC/ST parent hide/show
// -----------------------------

    function toggleParentCategory() {

        var stateCategory = ($("#343195").val() || "").trim().toUpperCase();
        var centralCategory = ($("#343252").val() || "").trim().toUpperCase();

        if (
            stateCategory.includes("SC") ||
            stateCategory.includes("ST") ||
            centralCategory.includes("SC") ||
            centralCategory.includes("ST")
        ) {
            $("#344720").closest(".trow").show();

            // Father select default
            if (!$("#344720").val()) {
                $("#344720").val("1").trigger("change");
            }

        } else {
            $("#344720").closest(".trow").hide();
            $("#344720").val("");
        }
    }

    // Initial page load
    toggleParentCategory();

    // On change
    $("#343195, #343252").on("change keyup", function () {
        toggleParentCategory();
    });

// -----------------------------
// 6 income financial year hide/show
// -----------------------------

const input = document.getElementById("342332");
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const currentFYStart = month >= 4 ? year : year - 1;
    input.value = `${currentFYStart - 1}-${currentFYStart}`;

