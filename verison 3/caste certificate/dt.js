// console.log(" DT/Tah check");
//=======================================
// Make remarks/CKEditor-style textareas user-resizable
// (drag the corner handle to adjust height/width)
//=======================================
$(document).ready(function () {
    $('textarea[data-type="remarks"], textarea[cken="T"]').css({
        'resize': 'vertical',   // drag height only, keeps the two-column layout intact
        'overflow': 'auto',     // required for resize to work reliably cross-browser
        'min-height': '60px',
        'max-width': '100%'
    });
});
// -----------------------------
// 0. Sync 342415 only when checkboxes exist
// -----------------------------
function syncCertificateHiddenField() {

    var hidden = document.getElementById("342415");
    if (!hidden) return;

    var checkboxes = document.querySelectorAll("input[name='341869']");

    if (checkboxes.length > 0) {

        var checkedVals = Array.prototype.filter
            .call(checkboxes, function (cb) { return cb.checked; })
            .map(function (cb) { return cb.value; });

        if (checkedVals.length > 0) {
            hidden.value = checkedVals.join(",");
        }

        return;
    }
}

syncCertificateHiddenField();


$(document).ready(function () {

    $('input[type="file"]').css({
        'font-size': '12px',
        'color': 'black'
    });

});

$("[name='344566'], [name='343241']").on("input", function () {
    this.value = this.value.toUpperCase();
});

// -----------------------------
// 1. label update on bold
// -----------------------------
 
    $('label[for="339359"]').html(
        'Tahsildar / Deputy Tahsildar <strong style="font-weight:800;">Action</strong> <span class="mandatory">*</span>'
    );
     $('label[for="339360"]').html(
        'Tahsildar / Deputy Tahsildar <strong style="font-weight:800;">Remarks</strong>'
    );

    $('label[for="341690"]').html(
        'Tahsildar / Deputy Tahsildar <strong style="font-weight:800;">Send To</strong> <span class="mandatory">*</span>'
    );
 


// -----------------------------
// 1. Hide input of Applicant
// -----------------------------

//hide the checkbox of applicant

// $('label[for="341869"]').closest(".tdata").hide();

// $('label[for="341883"]').closest(".tdata").hide();

    
// -----------------------------
// 2. Hide input of Applicant
// -----------------------------

// Hide all applicant detail rows first
var container = $("#342386").closest(".table_cont");
container.find(".trow").hide();

$('label[for="341869"]').closest(".trow").show();
$('label[for="346598"]').closest(".trow").show();
$('label[for="346593"]').closest(".trow").show();
$('label[for="344587"]').closest(".trow").show();

// Type of Certificate -> Applicant Details mapping
const map = {

  // Residence
  "341869_1": [
    "342386",
    "999999",
    "343642_1",
    "343642_2",
    "344716",
    "344587"
  ],

  // Nativity
  "341869_2": [
    "342386",
    "344714",
    "344716",
    "344587"
  ],

  // Income
  "341869_3": [
    "342058",
    "342059",
    "342348",
    "344716",
    "343652",
  ],

  // EWS
  "341869_4": [
    "EWS_HEADER",
    "342058",
    "342059",
    "342348",
    "343227", // Religion
    "343238", // General Caste
    "343239", // General Category
    // "343240_1", // Others Yes
    // "343240_2", // Others No
    "344716",
    "343652"
  ],

  // Caste/Community - Puducherry Educational
  "341869_5": [
    "STATE_HEADER",
    // "341883_1",
    // "341883_2",
    "343227", // Religion
    "343228", // State Caste
    "343229", // State Category
    "343255", // State Serial No
    "343230",  // State Resolution
    "344716",
    "344857",
    "343652"
  ],

  // Caste/Community - Puducherry Employment
  "341869_6": [
    "STATE_HEADER",
    // "341883_1",
    // "341883_2",
    "344569",
    "343227",
    "343228",
    "343229",
    "343255",
    "343230",
    "344716",
    "344857",
    "344587"
  ],

  // Caste/Community - Govt. of India
  "341869_7": [
    "CENTRAL_HEADER",
    // "341883_1",
    // "341883_2",
    "343227", // Religion
    "343233", // Central Caste
    "343256", // Central Category
    "343234", // Central Serial No
    "343235",  // Central Resolution
    "344716",
    "344857",
    "344587"
  ]
};

// Hide all rows initially
$.each(map, function (_, fields) {
  $.each(fields, function (_, id) {
    switch (id) {
      case "STATE_HEADER":
        $("#343227").closest(".trow").prev().hide();
        break;

      case "CENTRAL_HEADER":
        $("#343233").closest(".trow").prev().hide();
        break;

      case "EWS_HEADER":
        $("#343238").closest(".trow").prev().hide();
        break;

      default:
        $("#" + id)
          .closest(".trow")
          .hide();
    }
  });
});

// Show rows based on selected certificate
var selectedCertificates = ($("#342415").val() || "").split(",");

$.each(map, function (checkId, fields) {
  var value = checkId.split("_")[1];

  if (selectedCertificates.indexOf(value) !== -1) {
    $.each(fields, function (_, id) {
      switch (id) {
        case "STATE_HEADER":
          $("#343227").closest(".trow").prev().show();
          break;

        case "CENTRAL_HEADER":
          $("#343233").closest(".trow").prev().show();
          break;

        case "EWS_HEADER":
          $("#343238").closest(".trow").prev().show();
          break;

        default:
          $("#" + id)
            .closest(".trow")
            .show();
      }
    });
  }
});


// -----------------------------
// 3 Convert checkbox group → dropdown
// -----------------------------

// 1 Convert checkbox group → dropdown

function convertToDropdown(groupId, dropdownId, labelText) {
  var group = document.getElementById(groupId);
  if (!group) return;

  var checkboxes = group.querySelectorAll("input[type='checkbox']");
  if (!checkboxes.length) return;

  var select = document.createElement("select");
  select.id = dropdownId;
  select.style.width = "250px";
  select.setAttribute("required", "required"); // <-- add required

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
    checkboxes.forEach(function (cb) {
      cb.checked = false;
    });
    if (this.value) {
      var target = group.querySelector("input[value='" + this.value + "']");
      if (target) target.checked = true;
    }
    // Clear error when user selects
    var errorId = dropdownId === "dtDropdown" ? "error_341691" : "error_341692";
    var err = document.getElementById(errorId);
    if (err) {
      err.style.display = "none";
    }
  };
}

// 2 Convert both groups

convertToDropdown("user_341691", "dtDropdown", "Deputy Tahsildar");
convertToDropdown("user_341692", "riDropdown", "Revenue Inspector");

// 3 Enable / Disable based on Send To

function handleSendToChange() {
  var dtRadio = document.getElementById("341690_2");
  var riRadio = document.getElementById("341690_1");
  var dtGroup = document.getElementById("user_341691");
  var riGroup = document.getElementById("user_341692");
  var dtDropdown = document.getElementById("dtDropdown");
  var riDropdown = document.getElementById("riDropdown");

  function setState(group, dropdown, enabled) {
    if (!group || !dropdown) return;
    var checkboxes = group.querySelectorAll("input[type='checkbox']");
    if (enabled) {
      dropdown.disabled = false;
      dropdown.removeAttribute("disabled");
      checkboxes.forEach(function (cb) {
        cb.disabled = false;
      });
    } else {
      dropdown.value = "";
      dropdown.disabled = true;
      checkboxes.forEach(function (cb) {
        cb.checked = false;
        cb.disabled = true;
      });
    }
  }

  if (dtRadio.checked) {
    setState(dtGroup, dtDropdown, true);
    setState(riGroup, riDropdown, false);
  } else if (riRadio.checked) {
    setState(dtGroup, dtDropdown, false);
    setState(riGroup, riDropdown, true);
  }

  // Clear errors on switch
  var err1 = document.getElementById("error_341691");
  var err2 = document.getElementById("error_341692");
  if (err1) err1.style.display = "none";
  if (err2) err2.style.display = "none";
}

// 4 Validation function

function validateSendTo() {
  var dtRadio = document.getElementById("341690_2");
  var riRadio = document.getElementById("341690_1");
  var dtDropdown = document.getElementById("dtDropdown");
  var riDropdown = document.getElementById("riDropdown");
  var dtError = document.getElementById("error_341691");
  var riError = document.getElementById("error_341692");

  dtError.style.display = "none";
  riError.style.display = "none";

  if (dtRadio.checked) {
    if (!dtDropdown.value) {
      dtError.textContent = "Please select a Deputy Tahsildar.";
      dtError.style.display = "block";
      dtDropdown.focus();
      return false;
    }
  } else if (riRadio.checked) {
    if (!riDropdown.value) {
      riError.textContent = "Please select a Revenue Inspector.";
      riError.style.display = "block";
      riDropdown.focus();
      return false;
    }
  } else {
    // If no radio is selected, let the HTML5 required attribute on the radio group handle it
    return true;
  }
  return true;
}

// 5 Bind events

document.getElementById("341690_1").onchange = handleSendToChange;
document.getElementById("341690_2").onchange = handleSendToChange;

// Form submit interceptor
var form = document.querySelector("form"); // adjust selector if needed
if (form) {
  form.addEventListener("submit", function (e) {
    if (!validateSendTo()) {
      e.preventDefault();
    }
  });
}

// Also validate on blur of dropdowns
document.getElementById("dtDropdown").addEventListener("blur", function () {
  if (document.getElementById("341690_2").checked && !this.value) {
    var err = document.getElementById("error_341691");
    err.textContent = "Please select a Deputy Tahsildar.";
    err.style.display = "block";
  } else {
    document.getElementById("error_341691").style.display = "none";
  }
});

document.getElementById("riDropdown").addEventListener("blur", function () {
  if (document.getElementById("341690_1").checked && !this.value) {
    var err = document.getElementById("error_341692");
    err.textContent = "Please select a Revenue Inspector.";
    err.style.display = "block";
  } else {
    document.getElementById("error_341692").style.display = "none";
  }
});

// Initial load
handleSendToChange();

// -----------------------------
// 2 Generate Certificates Hide and Show
// -----------------------------

// =====================================================
// SHOW / HIDE INDIVIDUAL CERTIFICATE
// 345191 = Certificate checkbox field
// =====================================================
$('label[for="345191"]').closest(".trow").show();

function showHideCertificate(value, show) {

    var checkbox = document.querySelector(
        'input[name="345191"][value="' + value + '"]'
    );

    if (checkbox) {

        var option = checkbox.closest(".tdata");

        if (option) {
            option.style.display = show ? "" : "none";
        }

        // Uncheck when hiding
        if (!show) {
            checkbox.checked = false;
        }
    }
}


// =====================================================
// SHOW ONLY REQUIRED CERTIFICATES
// =====================================================

function showCertificates(valuesToShow) {

    document.querySelectorAll(
        'input[name="345191"]'
    ).forEach(function (checkbox) {

        var option = checkbox.closest(".tdata");

        if (!option) {
            return;
        }

        if (valuesToShow.includes(checkbox.value)) {

            // Show checkbox + certificate name
            option.style.display = "";

        } else {

            // Hide checkbox + certificate name
            option.style.display = "none";

            // Uncheck hidden checkbox
            checkbox.checked = false;
        }
    });
}


// =====================================================
// MAIN LOGIC
// =====================================================

function updateGenerateCertificates() {

    // -------------------------------------------------
    // Certificates selected in 342415
    // -------------------------------------------------

    var selectedCertificates = ($("#342415").val() || "")
        .split(",")
        .map(function (v) {
            return $.trim(v);
        });


    function hasCertificate(value) {
        return selectedCertificates.indexOf(value) !== -1;
    }


    // -------------------------------------------------
    // Values to show inside 345191
    // -------------------------------------------------

    var valuesToShow = [];


    // -------------------------------------------------
    // Applicant Details
    // -------------------------------------------------

    var isResident = $("#341883_1").is(":checked");

    var isOthers = ($("[name='343233']").val() || "").trim().toUpperCase() === "OTHERS";

    var stateCategory =
        ($("#343229").val() || "")
            .trim()
            .toUpperCase();

    var centralCategory =
        ($("#343256").val() || "")
            .trim()
            .toUpperCase();

    var generalReligion =
        ($("#343227").val() || "")
            .trim()
            .toUpperCase();

    var generalCaste =
        ($("#343238").val() || "")
            .trim()
            .toUpperCase();


    // =================================================
    // EWS CENTRAL APPROVED CASTES
    // =================================================

    var ewsCentralCastes = {

        "BALIJA NAIDU": "HINDU",
        "CHAKKALA": "HINDU",
        "CHETTIAR": "HINDU",
        "DEKKANI MUSLIMS": "MUSLIM",
        "DEVANGA": "HINDU",
        "DOODEKULA SAIBU": "HINDU",
        "DUDEKULA": "HINDU",
        "GOUNDER": "HINDU",
        "GOWDA": "HINDU",
        "KANAKKUPILLAI": "HINDU",
        "KANNADA SAINEEGAR": "HINDU",
        "KANNADIAR": "HINDU",
        "KARUNEEGAR": "HINDU",
        "KONDA REDDY": "HINDU",
        "KONGU VELLALAR": "HINDU",
        "KUDUMBI": "HINDU",
        "KURUMAN": "HINDU",
        "KURUMANS": "HINDU",
        "MALAIKURAVAN": "HINDU",
        "MALAKURAVAN": "HINDU",
        "MARUDHA NAIDU": "HINDU",
        "MEENAVA CHETTIAR": "HINDU",
        "MUKYA": "HINDU",
        "PALAYAPATTU NAIDU": "HINDU",
        "PATTINAVA CHETTIAR": "HINDU",
        "PERIKA": "HINDU",
        "PERIKE": "HINDU",
        "REDDY (GANJAM)": "HINDU",
        "SHAIK": "MUSLIM",
        "SOZHIA CHETTY": "HINDU",
        "SOZHIA VELLALAR": "HINDU",
        "SYED": "MUSLIM",
        "TELIKULA": "HINDU",
        "TELUKULA": "HINDU",
        "UPPARA": "HINDU",
        "VANDAYAR": "HINDU",
        "VANIYA CHETTY": "HINDU",
        "VELLALA CHETTIAR": "HINDU",
        "VELLAN CHETTY": "HINDU"
    };


    // =================================================
    // BASIC CERTIFICATES
    // =================================================

    // Manual Certificate
    valuesToShow.push("22");

    //combined caste certificate

     var combinedCert =
            $("input[name='346576']:checked").val();

        if (combinedCert === "1") {

            //combined caste certificate
            valuesToShow.push("21");
        }


    // -------------------------------------------------
    // Residence Certificate
    // -------------------------------------------------

    if (hasCertificate("1")) {

        var residenceType =
            $("input[name='343642']:checked").val();

        if (residenceType === "1") {

            // Residence Certificate
            valuesToShow.push("1");

        } else {

            // 2B Residence Certificate
            valuesToShow.push("2");
        }
    }


    // -------------------------------------------------
    // Nativity Certificate
    // -------------------------------------------------

    if (hasCertificate("2")) {

        valuesToShow.push("3");
    }


    // -------------------------------------------------
    // Income Certificate
    // -------------------------------------------------

    if (hasCertificate("3")) {

        valuesToShow.push("4");
    }


    // =================================================
    // EWS CERTIFICATE
    // =================================================

    if (hasCertificate("4")) {

        // Listed General Caste
        if (
            ewsCentralCastes.hasOwnProperty(generalCaste) &&
            ewsCentralCastes[generalCaste] === generalReligion
        ) {

            // EWS Central Certificate
            valuesToShow.push("6");

        } else {

            // EWS Certificate
            valuesToShow.push("5");
        }
    }


    // =================================================
    // EDUCATIONAL / BENEFICIARY
    // GOVERNMENT OF PUDUCHERRY - STATE CATEGORY
    // =================================================

    if (hasCertificate("5")) {

        switch (stateCategory) {

            case "BCM":

                // BCM Caste Certificate
                if (isResident) {
                    valuesToShow.push("11");
                } else {
                    valuesToShow.push("18");
                }

                break;


            case "BT":

                // BT Caste Certificate
                if (isResident) {
                    valuesToShow.push("12");
                } else {
                    valuesToShow.push("18");
                }

                break;


            case "EBC":

                // EBC Caste Certificate
                if (isResident) {
                    valuesToShow.push("13");
                } else {
                    valuesToShow.push("18");
                }

                break;


            case "OBC":

                // OBC Study / Migrant
                if (isResident) {
                    valuesToShow.push("16");
                } else {
                    valuesToShow.push("18");
                }

                break;


            case "MBC":

                // MBC Study / Migrant
                if (isResident) {
                    valuesToShow.push("14");
                } else {
                    valuesToShow.push("18");
                }

                break;


            case "SC":

                if (isResident) {
                    valuesToShow.push("7");
                } else {
                    valuesToShow.push("8");
                }

                break;


            case "ST":

                if (isResident) {
                    valuesToShow.push("9");
                } else {
                    valuesToShow.push("10");
                }

                break;
        }
    }


    // =================================================
    // EMPLOYMENT
    // GOVERNMENT OF PUDUCHERRY
    // =================================================

    if (hasCertificate("6")) {

        switch (stateCategory) {

            // -----------------------------------------
            // BCM
            // -----------------------------------------

            case "BCM":

                if (isResident) {
                    valuesToShow.push("11");
                } else {
                    valuesToShow.push("18");
                }

                break;


            // -----------------------------------------
            // BT
            // -----------------------------------------

            case "BT":

                if (isResident) {
                    valuesToShow.push("12");
                } else {
                    valuesToShow.push("18");
                }

                break;


            // -----------------------------------------
            // EBC
            // -----------------------------------------

            case "EBC":

                if (isResident) {
                    valuesToShow.push("13");
                } else {
                    valuesToShow.push("18");
                }

                break;


            // -----------------------------------------
            // OBC
            // -----------------------------------------

            case "OBC":

                if (isResident) {

                    // OBC Employment
                    valuesToShow.push("17");

                } else {

                    // OBC Migrant
                    valuesToShow.push("18");
                }

                break;


            // -----------------------------------------
            // MBC
            // -----------------------------------------

            case "MBC":

                if (isResident) {

                    // MBC Employment
                    valuesToShow.push("15");

                } else {

                    // MBC Migrant
                    valuesToShow.push("18");
                }

                break;


            // -----------------------------------------
            // SC
            // -----------------------------------------

            case "SC":

                if (isResident) {
                    valuesToShow.push("7");
                } else {
                    valuesToShow.push("8");
                }

                break;


            // -----------------------------------------
            // ST
            // -----------------------------------------

            case "ST":

                if (isResident) {
                    valuesToShow.push("9");
                } else {
                    valuesToShow.push("10");
                }

                break;
        }
    }


    // =================================================
    // GOVERNMENT OF INDIA
    // CENTRAL CATEGORY
    // =================================================

    if (hasCertificate("7")) {

        switch (centralCategory) {

            case "BCM":
            case "BT":
            case "EBC":
            case "OBC":
            case "MBC":

                if (!isOthers) {

                    // OBC Central Certificate
                    valuesToShow.push("19");

                } else {

                    // OBC Central Migrant Certificate
                    valuesToShow.push("20");
                }

                break;


            case "SC":

                if (isResident) {
                    valuesToShow.push("7");
                } else {
                    valuesToShow.push("8");
                }

                break;


            case "ST":

                if (isResident) {
                    valuesToShow.push("9");
                } else {
                    valuesToShow.push("10");
                }

                break;
        }
    }


    // =================================================
    // REMOVE DUPLICATES
    // =================================================

    valuesToShow = valuesToShow.filter(function (value, index) {
        return valuesToShow.indexOf(value) === index;
    });


    // =================================================
    // FINALLY SHOW / HIDE 345191 OPTIONS
    // =================================================

    showCertificates(valuesToShow);
}


// =====================================================
// EVENTS
// =====================================================

$(function () {

    updateGenerateCertificates();

    $("#342415").on("change", updateGenerateCertificates);

    $("input[name='341883']").on("change", updateGenerateCertificates);

    $("input[name='343642']").on("change", updateGenerateCertificates);

    $("#343229").on("change", updateGenerateCertificates);

    $("#343256").on("change", updateGenerateCertificates);

    $("#343237").on("change", updateGenerateCertificates);

    $("#343238").on("change blur", updateGenerateCertificates);

    $("input[name='343240']").on("change", updateGenerateCertificates);

    $("input[name='346576']").on("change", updateGenerateCertificates);

});


// -----------------------------
// 3 ruppees in words
// -----------------------------

function numberToWords(num) {
  if (num == 0) return "Zero Only";

  var ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  var tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

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

var amountInput = document.getElementById("342058");
var wordsInput = document.getElementById("342059");

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
// 4 years in words
// -----------------------------
function numberOfYearsToWords(num) {
  var ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen"
  ];

  var tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"
  ];

  if (num === 0) return "Zero";

  if (num < 20) {
    return ones[num];
  }

  if (num < 100) {
    return tens[Math.floor(num / 10)] +
      (num % 10 !== 0 ? " " + ones[num % 10] : "");
  }

  if (num === 100) {
    return "One Hundred";
  }

  return "";
}

// Year input
var yearInput = document.getElementById("342386");
var yearWordsInput = document.getElementById("345705");

yearWordsInput.readOnly = true;

function updateYearInWords() {
  var value = yearInput.value.trim();

  if (value === "" || isNaN(value)) {
    yearWordsInput.value = "";
    return;
  }

  var year = parseInt(value, 10);

  // Only allow 1 to 100
  if (year < 1 || year > 100) {
    yearWordsInput.value = "";
    return;
  }

  yearWordsInput.value = numberOfYearsToWords(year);
}

yearInput.addEventListener("input", updateYearInWords);

// Populate existing value when page loads
updateYearInWords();


// -----------------------------
// 7 Caste Script Loaded
// -----------------------------
// console.log("Caste Script Loaded");

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
        serial: "5",
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
        serial: "5",
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
        serial: "5",
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
        serial: "5",
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
        serial: "5",
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
      caste: "PARVATHARAJAKULAM",
      STATE: {
        category: "EBC",
        serial: "5",
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
        serial: "5",
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
        serial: "5",
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
        serial: "5",
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
        serial: "5",
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
        serial: "5",
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
        serial: "20",
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
        serial: "24",
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
        serial: "24",
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
        serial: "24",
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
        serial: "24",
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
        serial: "24",
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
        serial: "24",
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
  BUDDHIST: [
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
      updateGeneralCaste();
      updateCentralCaste();
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

// 1. State Caste Details
initializeCasteControl({
    religionId: "343227",
    casteId: "343228",
    categoryId: "343229",
    serialId: "343255",
    resolutionId: "343230",
    gazzettenoId: "344829", // new: Gazette No field for State certificate
    gazzettedateId: "344830", // new: Gazette Date field
    source: "STATE",
    mode: "NORMAL"
});

// 1.2 State Caste Details
initializeCasteControl({
    religionId: "343227",
    casteId: "346578",
    categoryId: "9999999",
    serialId: "3432558888",
    resolutionId: "34323077777",
    gazzettenoId: "3448297777",
    gazzettedateId: "34483066666",
    source: "STATE",
    mode: "NORMAL",
    others:true
});

// 2. Central Caste Details
initializeCasteControl({
    religionId: "343227",
    casteId: "343233",
    categoryId: "343256",
    serialId: "343234",
    resolutionId: "343235",
    source: "CENTRAL",
    mode: "NORMAL",
    others:true
});

// 3. EWS Details (General Category)
initializeCasteControl({
    religionId: "343227",
    casteId: "343238",
    categoryId: "343239",   // Hidden field with value GENERAL
    serialId: "999999",      // Not available in DT HTML
    resolutionId: "888888",  // Not available in DT HTML
    source: "CENTRAL",
    mode: "EWS",
    others:true
});

// -----------------------------
// 7 Common input of SC/ST
// -----------------------------

function setCommonSCSTValues() {
    const stateCategory = $("#343229").val().trim().toUpperCase();
    const centralCategory = $("#343256").val().trim().toUpperCase();

    const isStateSCST = stateCategory === "SC" || stateCategory === "ST";
    const isCentralSCST = centralCategory === "SC" || centralCategory === "ST";

    if (isStateSCST) {
        // Copy State values
        $("#343649").val($("#343228").val());
        $("#343650").val($("#343255").val());
        $("#343651").val($("#343230").val());

        // $("#343649, #343650, #343651").closest(".trow").show();
    }
    else if (isCentralSCST) {
        // Copy Central values
        $("#343649").val($("#343233").val());
        $("#343650").val($("#343234").val());
        $("#343651").val($("#343235").val());

        // $("#343649, #343650, #343651").closest(".trow").show();
    }
    else {
        // Clear and hide
        $("#343649, #343650, #343651").val("");
        $("#343649, #343650, #343651").closest(".trow").hide();
    }
}

// Initial load
setCommonSCSTValues();

// On category change
$("#343229, #343256").on("change", setCommonSCSTValues);

// -----------------------------
// 7 common input of EWS 
// -----------------------------

function updateCommonEWSCaste() {

    var $commonRow = $("#343648").closest(".trow");
    var isOthers = $("#343240_1").is(":checked");

    if (isOthers) {
        // Yes -> copy "If Others Please Specify"
        $("#343648").val($("#343241").val());
    } else {
        // No -> copy "General Caste"
        $("#343648").val($("#343238").val());
    }

    // Hide Common EWS Caste row
    $commonRow.hide();
}

// Initial call
updateCommonEWSCaste();

// Events
$("input[name='343240']").on("change", updateCommonEWSCaste);
$("#343238").on("input change", updateCommonEWSCaste);
$("#343241").on("input change", updateCommonEWSCaste);

// ----------------------------------------------------------------------
// 8. Function to set the Taluk Office based on the selected dropdown value
//-----------------------------------------------------------------------

function setTalukOffice() {
    var dropdown = document.getElementById("344587");
    var selectedText = dropdown.options[dropdown.selectedIndex].text;

    if (selectedText === "Please Select") {
        document.getElementById("344588").value = "";
        return;
    }

    // Remove suffixes
    var officeName = selectedText
        .replace(" Sub Taluk", "")
        .replace(" Taluk", "");

    // Correct known spelling issues
    var corrections = {
        "Villlianur": "Villianur"
    };

    if (corrections[officeName]) {
        officeName = corrections[officeName];
    }

    document.getElementById("344588").value = officeName.toUpperCase();
}

// On dropdown change
document.getElementById("344587").addEventListener("change", setTalukOffice);

// initial load
setTalukOffice();


// ----------------------------------------------------------------------
// 9. Function to set the validation year in the format "YYYY-YYYY"
//-----------------------------------------------------------------------
function setValidationYear() {
    var currentYear = new Date().getFullYear();
    var nextYear = currentYear + 1;

    document.getElementById("343652").value = currentYear + "-" + nextYear;
}

// initial load
setValidationYear();

// ----------------------------------------------------------------------
// 10. Function to set the 2nd para His/Her Text as of gender
//-----------------------------------------------------------------------
    function updateGenderText() {

        var gender = $("input[name='344726']:checked").val();

        if (gender == "1") { // Male
            $("#344715").val("his");
        }
        else {
            $("#344715").val("her");
        }
    }

    // ONLOAD
    updateGenderText();

    // GENDER CHANGE
    $("input[name='344726']").on("change", updateGenderText);


// ----------------------------------------------------------------------
// 11. Function to set the Creamy Layer Text
//-----------------------------------------------------------------------
function setCreamyLayerText() {
  var hiddenValue = $("#342415").val().split(",");

  if ($.inArray("6", hiddenValue) !== -1) {
    var gender = $("input[name='344726']:checked").val();
    var pronoun = "he/she";

    if (gender === "1") {
      pronoun = "he";
    } else if (gender === "2") {
      pronoun = "she";
    } // Others will remain "he/she"

    var creamyLayerText =
      "3. This is also to certify that " +
      pronoun +
      " does not belong to the persons/sections (Creamy Layer) mentioned in column 3 of the Schedule to the Government of India, Department of Personnel and Training O.M. No. 36012/22/93-Estt.(SCT), dated 08-09-1993 and O.M. No. 36033/1/2013-Estt.(Res.), dated 13-09-2017.";

    $("#344569").val(creamyLayerText);
  } else {
    $("#344569").val("");
  }
}

// Initial load
setCreamyLayerText();

// Update when gender changes
$("input[name='339161']").on("change", function () {
  setCreamyLayerText();
});

// ----------------------------------------------------------------------
// 12. Function of relation with name by gender
//-----------------------------------------------------------------------

// Male: Son of → Father's Name | Female: Daughter of → Father's Name, Wife of → Spouse's Name

    function updateRelation() {
        const gender = $("input[name='344726']:checked").val();
        const relation = $("#344716");

        // Keep the existing selected value
        const selectedValue = relation.val();

        // Show all options
        relation.find("option").show();

        if (gender === "1") { // Male
            relation.find("option[value='2'], option[value='3']").hide();

            // Set default only if nothing is selected
            if (!selectedValue) {
                relation.val("1");
            }
        } else { // Female / Others
            relation.find("option[value='1']").hide();

            // Clear only if an invalid option is selected
            if (selectedValue === "1") {
                relation.val("");
            }
        }

        updateCertificateName();
    }

    function updateCertificateName() {
        const relation = $("#344716").val();

        $("#344719").val(
            relation === "2"
                ? $("#344718").val() // Wife of -> Spouse Name
                : (relation === "1" || relation === "3")
                    ? $("#344717").val() // Son/Daughter -> Father Name
                    : ""
        );
    }

    // Initial load
    updateRelation();

    // Events
    $("input[name='344726']").on("change", updateRelation);
    $("#344716").on("change", updateCertificateName);
    $("#344717, #344718").on("input change", updateCertificateName);


// ----------------------------------------------------------------------
// 13. Function to set Father/Mother for SC/ST caste 2nd para
//-----------------------------------------------------------------------

    const $stateCategory = $("#343229");
    const $centralCategory = $("#343256");

    const $parentType = $("#344723");
    const $fatherName = $("#344717");
    const $motherName = $("#344724");
    const $parentName = $("#344725");

    // const $scstRows = $("[id='344723'], [id='344724'], [id='344725']").closest(".trow");


    function updateSCSTVisibility() {

        const category = (
            ($stateCategory.val() || "") +
            ($centralCategory.val() || "")
        ).toUpperCase();

        const isSCST = category.includes("SC") || category.includes("ST");

        // $scstRows.toggle(isSCST);

        if (!isSCST) {
            $parentType.val("");
            $parentName.val("");
        }

        updateParentName();
    }


    function updateParentName() {

        const type = $parentType.val();

        if (type === "1") {
            $parentName.val(
                "Thiru. " + ($fatherName.val() || "")
            );
        }
        else if (type === "2") {
            $parentName.val(
                "Tmt. " + ($motherName.val() || "")
            );
        }
        else {
            $parentName.val("");
        }
    }


    // ONLOAD
    updateSCSTVisibility();


    // CATEGORY CHANGE
    $stateCategory.add($centralCategory).on("input change", updateSCSTVisibility);


    // PARENT / NAME CHANGE
    $parentType
        .add($fatherName)
        .add($motherName)
        .on("input change", updateParentName);


// --------------------------------------------------------------------------------
// 14. Function to set Other caste hide/show and common field for EWS and central 
//---------------------------------------------------------------------------------

    function updateGeneralCaste() {

        var caste = ($("#343238").val() || "").trim().toLowerCase();
        var isOther = caste === "others";

        $("#343241").closest(".trow").toggle(isOther);

        $("#343648").val(
            isOther ? $("#343241").val() : $("#343238").val()
        );
    }


    function updateCentralCaste() {

        var caste = ($("#343233").val() || "").trim().toLowerCase();
        var isOther = caste === "others";

        $("#344566").closest(".trow").toggle(isOther);

        $("#344586").val(
            isOther ? $("#344566").val() : $("#343233").val()
        );
    }

    function updateCombinedCaste() {
        var caste = ($("#346578").val() || "").trim();
        var isOther = caste.toLowerCase() === "others";

        $("#346594").closest(".trow").toggle(isOther);

        if (isOther) {
            $("#346590").val($("#346594").val());
        } else {
            $("#346580").val(caste);
        }
    }

    function updateCombinedCaste() {
        var caste = ($('#346578').val() || '').trim().toLowerCase();
        var isOther = caste === 'others';

        $('#346594').closest('.trow').toggle(isOther);

        $('#346595').val(
            isOther ? $('#346594').val() : $('#346578').val()
        );
    }



    // ONLOAD
    updateGeneralCaste();
    updateCentralCaste();
    updateCombinedCaste();


    // GENERAL CASTE CHANGE
    $("#343238, #343241").on("input change", function () {
        updateGeneralCaste();
    });


    // CENTRAL CASTE CHANGE
    $("#343233, #344566").on("input change", function () {
        updateCentralCaste();
    });

    // Combined CASTE CHANGE
    $("#346578, #346594").on("input change", function () {
        updateCombinedCaste();
    });

// ----------------------------------------------------------------------
// 10. Function to set the 2nd para he/she Text as of gender CENTRAL
//-----------------------------------------------------------------------
    function updateGenderTextCentral() {

        var gender = $("input[name='344726']:checked").val();

        if (gender == "1") { // Male
            $("#344817").val("he");
            $("#346614").val("He");
            $("#346615").val("His");
        }
        else {
            $("#344817").val("she");
            $("#346614").val("She");
            $("#346615").val("Her");
        }
    }

    // ONLOAD
    updateGenderTextCentral();

    // GENDER CHANGE
    $("input[name='344726']").on("change", updateGenderTextCentral);


// ----------------------------------------------------------------------
// 11. Applicant/Family Relation ( and / or )
//-----------------------------------------------------------------------

var relationAndOr = document.getElementById("344857");

    // If nothing is selected, select "and"
    if (relationAndOr.value === "") {
        relationAndOr.value = "1";
    }


// -----------------------------
// 12. 2B Residence Certificate
// -----------------------------

  if (!$("input[name='343642']:checked").length) {
      $("#343642_1").prop("checked", true);
  }

  function toggleFields() {
      if ($("#343642_1").is(":checked")) {
          $("#345363").closest(".trow").hide();
          $("#345363").closest(".tdata").hide();
          $("#345709_additionalDoc").closest(".tdata").hide();
          $("#345709_additionalDoc").closest(".trow").hide();
      } else {
          $("#345363").closest(".trow").show();
          $("#345363").closest(".tdata").show();
          $("#345709").closest(".tdata").show();
          $("#345709").closest(".trow").show();
          $("#345709_additionalDoc").closest(".tdata").show();
          $("#345709_additionalDoc").closest(".trow").show();
      }
  }

  toggleFields();

  $("input[name='343642']").on("change", toggleFields);


// ----------------------------------------------------------------------
//  13. ALWAYS SHOW COMMON APPLICANT DETAILS
// Female + Married => Show Spouse Name
// Otherwise => Hide Spouse Name
// ----------------------------------------------------------------------

function updateApplicantBasicDetails() {

    // --------------------------------------------------
    // Always visible fields
    // --------------------------------------------------

    var alwaysShow = [
        "#345776", // Applicant's Full Name
        "#344717", // Applicant's Father's Name
        "#345827", // Address
        "#345828", // Town / Village / City
        "#345829", // District / Division
        "#345830", // State / Union Territory
        "#345831"  // PIN Code
    ];

    alwaysShow.forEach(function (selector) {

        var $field = $(selector);

        if ($field.length) {
            $field.closest(".trow").show();

            // Make sure required is enabled
            $field.prop("required", true);
        }
    });


    // --------------------------------------------------
    // Present Address heading
    // --------------------------------------------------

    // Find the "Present Address" heading row
    $("#345827")
        .closest(".table_cont")
        .find(".trow")
        .filter(function () {
            return $.trim($(this).text()) === "Present Address";
        })
        .show();


    // --------------------------------------------------
    // Spouse Name
    // Female + Married ONLY
    // --------------------------------------------------

    var gender = $("input[name='344726']:checked").val();
    var maritalStatus = $("#344738").val();

    var isFemale = gender === "2";
    var isMarried = maritalStatus === "1" || maritalStatus === "4";

    var $spouseField = $("#344718");
    var $spouseRow = $spouseField.closest(".trow");

    if (isFemale && isMarried) {

        // Show spouse name
        $spouseRow.show();

        // Spouse is mandatory when Female + Married
        $spouseField.prop("required", true);

    } else {

        // Hide spouse name
        $spouseRow.hide();

        // Remove required validation when hidden
        $spouseField.prop("required", false);

        // Optional: clear spouse value when not applicable
        // Uncomment if you want to clear it automatically
        // $spouseField.val("");
    }
}


// Initial load

$(function () {
    updateApplicantBasicDetails();
});


// Update when Gender changes

$("input[name='344726']").on("change", function () {
    updateApplicantBasicDetails();
});


// Update when Marital Status changes

$("#344738").on("change", function () {
    updateApplicantBasicDetails();
});


// -----------------------------
// 14. VAO & RI Recommend - Hide/Show
// -----------------------------

setTimeout(function () {

    // Get the VAO & RI section
    var container = $("#345832").closest(".table_cont");

    // Hide all recommendation rows first
    container.find(".trow").not(":first").css("display", "none");


    // Certificate value -> VAO + RI row IDs mapping
    const recommendMap = {

        // Residence
        "1": [
            "345832", "345846",   // VAO + RI Recommend
            "345833", "345847"    // VAO + RI Remarks
        ],

        // Nativity
        "2": [
            "345834", "345848",   // VAO + RI Recommend
            "345835", "345849"    // VAO + RI Remarks
        ],

        // Income
        "3": [
            "345836", "345850",   // VAO + RI Recommend
            "345837", "345851"    // VAO + RI Remarks
        ],

        // EWS
        "4": [
            "345838", "345852",   // VAO + RI Recommend
            "345839", "345853"    // VAO + RI Remarks
        ],

        // Caste - Govt. of Puducherry
        "5": [
            "345840", "345854",   // VAO + RI Recommend
            "345841", "345855"    // VAO + RI Remarks
        ],
        // Caste - Govt. of Puducherry
        "6": [
            "345840", "345854",   // VAO + RI Recommend
            "345841", "345855"    // VAO + RI Remarks
        ],

        // Caste - Govt. of India
        "7": [
            "345842", "345856",   // VAO + RI Recommend
            "345843", "345857"    // VAO + RI Remarks
        ]
    };


    // Read hidden variable
    var hideVariable = $("#342415").val();

    if (!hideVariable) {
        return;
    }


    // If multiple values are possible, e.g. "1,3,7"
    var selectedValues = hideVariable.split(",");


    // Show matching VAO + RI rows
    $.each(selectedValues, function (_, value) {

        value = value.trim();

        if (recommendMap[value]) {

            $.each(recommendMap[value], function (_, fieldId) {

                $("#" + fieldId)
                    .closest(".trow")
                    .css("display", "flex");

            });

        }

    });


}, 500);





// -----------------------------
// 15. Common Caste Visibility Logic
// -----------------------------

function commonCasteVisibility() {

    var config = {
        hidden: "342415",

        residenceYes: "341883_1",
        residenceNo: "341883_2",
        residenceRow: ["341883_1", "341883_2"],

        cutOffDate: "345869",

        originYes: "345777_1",
        originNo: "345777_2",
      originRow: ["345777_1", "345777_2"],

        // Readonly text field, usually auto-populated by another
        // ServicePlus lookup rather than typed by the user.
        centralCategory: "343256",
        centralCategoryOBCValue: "OBC",

        stateFields: [
            "343228",
            "343229",
            "343255",
            "343230"
        ],

        centralFields: [
            "343233",
            // "343256",
            "343234",
            "343235"
        ],

        certificateFields: [
            "345780",
            "345781",
            "345782",
            "345783",
            "345784",
            "345785",
            "345786",
            "345787",
            "345788",
            "345789",
            "345790"
        ]
    };


    function getRow(ids) {

        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        for (var i = 0; i < ids.length; i++) {

            var el = document.getElementById(ids[i]);

            if (el) {

                var row = el.closest(".trow");

                if (row) {
                    return row;
                }
            }
        }

        return null;
    }


    function show(ids) {

        var row = getRow(ids);

        if (row) {
            row.style.display = "";
        }
    }


    function hide(ids) {

        var row = getRow(ids);

        if (row) {
            row.style.display = "none";
        }
    }


    function showAll(ids) {

        for (var i = 0; i < ids.length; i++) {
            show(ids[i]);
        }
    }


    function hideAll(ids) {

        for (var i = 0; i < ids.length; i++) {
            hide(ids[i]);
        }
    }


    function isChecked(id) {

        var el = document.getElementById(id);

        return !!(el && el.checked);
    }


    function getHiddenValues() {

        var el = document.getElementById(config.hidden);

        if (!el) {
            return [];
        }

        var value = String(el.value || "").trim();

        if (!value) {
            return [];
        }

        return value
            .split(",")
            .map(function (v) {
                return v.trim();
            })
            .filter(function (v) {
                return v !== "";
            });
    }


    function getCentralCategory() {

        var el = document.getElementById(
            config.centralCategory
        );

        if (!el) {
            return "";
        }

        return String(el.value || "")
            .trim()
            .toUpperCase();
    }


    function resetFields() {

        hide(config.residenceRow);
        hide(config.cutOffDate);
        hide(config.originRow);

        hideAll(config.stateFields);
        hideAll(config.centralFields);
        hideAll(config.certificateFields);
    }


    function updateVisibility() {

        var values = getHiddenValues();

        var has5 = values.indexOf("5") !== -1;
        var has6 = values.indexOf("6") !== -1;
        var has7 = values.indexOf("7") !== -1;

        var hasState = has5 || has6;
        var hasCentral = has7;

        var centralCategory = getCentralCategory();

        var isOBC = centralCategory === "OBC";


        resetFields();


        /* =====================================================
           5 / 6 PRESENT
           ===================================================== */

        if (hasState) {

            show(config.residenceRow);
            show(config.cutOffDate);


            /* Residence = YES */

            if (isChecked(config.residenceYes)) {

                showAll(config.stateFields);

                if (hasCentral) {
                    showAll(config.centralFields);
                }

                return;
            }


            /* Residence = NO */

            if (isChecked(config.residenceNo)) {

                show(config.originRow);

                if (isChecked(config.originYes)) {
                    showAll(config.certificateFields);
                }

                /*
                 * 5/6 + 7 + OBC
                 * Central details remain visible.
                 */

                if (hasCentral && isOBC) {
                    showAll(config.centralFields);
                }

                return;
            }


            /*
             * 5/6 + 7 + OBC
             * Show Central even before Residence selection.
             */

            if (hasCentral && isOBC) {
                showAll(config.centralFields);
            }

            return;
        }


        /* =====================================================
           7 ONLY
           ===================================================== */

        if (hasCentral) {


            /* -------------------------------------------------
               7 + OBC

               Direct Central flow.

               345725 hidden
               345726 hidden
               Certificate fields hidden
               Central fields shown
               ------------------------------------------------- */

            if (isOBC) {

                showAll(config.centralFields);

                return;
            }


            /* -------------------------------------------------
               7 + NON-OBC

               Show 345725 YES / NO
               ------------------------------------------------- */

            show(config.residenceRow);
            show(config.cutOffDate);


            /* 345725 = YES */

            if (isChecked(config.residenceYes)) {

                showAll(config.centralFields);

                return;
            }


            /* 345725 = NO */

            if (isChecked(config.residenceNo)) {

                show(config.originRow);


                /* 345726 = YES */

                if (isChecked(config.originYes)) {
                    showAll(config.certificateFields);
                }

                return;
            }

            return;
        }
    }


    /* =====================================================
       RADIO EVENTS
       ===================================================== */

    document.addEventListener("change", function (event) {

        var target = event.target;

        if (!target) {
            return;
        }

        if (
            target.id === config.residenceYes ||
            target.id === config.residenceNo ||
            target.id === config.originYes ||
            target.id === config.originNo
        ) {

            updateVisibility();
        }
    });


    /* =====================================================
       CENTRAL CATEGORY WATCH

       343252 is readonly and may be populated by ServicePlus
       without firing change/input.
       ===================================================== */

    var lastCategory = "";

    setInterval(function () {

        var currentCategory = getCentralCategory();

        if (currentCategory !== lastCategory) {

            lastCategory = currentCategory;

            updateVisibility();
        }

    }, 300);


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    updateVisibility();

    setTimeout(updateVisibility, 300);
    setTimeout(updateVisibility, 800);
    setTimeout(updateVisibility, 1500);
    setTimeout(updateVisibility, 2500);
}


/* Call common function */

commonCasteVisibility();


// -----------------------------
// 16. Document Name Color Highlight
//------------------------------
document.querySelectorAll('input[type="file"][data-type="file_doc"]').forEach(function(input) {
    input.style.color = 'black';
});



// -----------------------------
// DT refreshCertificate
// -----------------------------

function refreshCertificate() {

    // 1. Update hidden field 342415
    syncCertificateHiddenField();
    setCreamyLayerText();

    // 2. Get latest certificate values
    var selectedCertificates = ($("#342415").val() || "")
        .split(",")
        .map(function (v) {
            return $.trim(v);
        })
        .filter(Boolean);


    // =========================================
    // Applicant Details
    // =========================================

    $.each(map, function (_, fields) {

        $.each(fields, function (_, id) {

            switch (id) {

                case "STATE_HEADER":
                    $("#343227").closest(".trow").prev().hide();
                    break;

                case "CENTRAL_HEADER":
                    $("#343233").closest(".trow").prev().hide();
                    break;

                case "EWS_HEADER":
                    $("#343238").closest(".trow").prev().hide();
                    break;

                default:
                    $("#" + id).closest(".trow").hide();
            }

        });

    });


    // Show selected certificate fields
    $.each(map, function (checkId, fields) {

        var value = checkId.split("_")[1];

        if (selectedCertificates.indexOf(value) !== -1) {

            $.each(fields, function (_, id) {

                switch (id) {

                    case "STATE_HEADER":
                        $("#343227").closest(".trow").prev().show();
                        break;

                    case "CENTRAL_HEADER":
                        $("#343233").closest(".trow").prev().show();
                        break;

                    case "EWS_HEADER":
                        $("#343238").closest(".trow").prev().show();
                        break;

                    default:
                        $("#" + id).closest(".trow").show();
                }

            });

        }

    });


    // =========================================
    // Generate Certificate section
    // =========================================

    updateGenerateCertificates();


    // =========================================
    // Other dependent logic
    // =========================================

    if (typeof commonCasteVisibility === "function") {
        commonCasteVisibility();
    }
}


// -----------------------------------------
// Certificate onchange
// -----------------------------------------

$(document).on("change", "input[name='341869']", function () {
    refreshCertificate();
});

$(document).on("change", "input[name='341869']", function () {

    if (this.id === "341869_5" && this.checked) {
        $("#341869_6").prop("checked", false);
    }

    if (this.id === "341869_6" && this.checked) {
        $("#341869_5").prop("checked", false);
    }

    refreshCertificate();
});


// -----------------------------------------
// Initial load
// -----------------------------------------

refreshCertificate();



function toggleCombinedCertFields_RIVAO() {
    var isCasteChecked = $('#341869_5').is(':checked');
    var purposeVal = $('#346598').val();

    if (isCasteChecked && purposeVal === '3') {
        $('#346576_1').closest('.trow').show();
    } else {
        $('#346576_1').closest('.trow').hide();
        $('input[name="346576"]').prop('checked', false);
        hideCombinedCertDetails_RIVAO();
    }
}

function toggleCombinedCertDetails_RIVAO() {
    var combinedSelected = $('input[name="346576"]:checked').val();

    if (combinedSelected === '1') { // Yes
        $('#346577').closest('.trow').show();
        $('#346578').closest('.trow').show();
        updateCombinedCaste_RIVAO(); // decide 346594 visibility based on current 346578 value
    } else {
        hideCombinedCertDetails_RIVAO();
    }
}

function hideCombinedCertDetails_RIVAO() {
    $('#346577').closest('.trow').hide();
    $('#346578').closest('.trow').hide();
    $('#346594').closest('.trow').hide();
}

function updateCombinedCaste_RIVAO() {
    var caste = ($('#346578').val() || '').trim().toLowerCase();
    var isOther = caste === 'others';

    $('#346594').closest('.trow').toggle(isOther);

    $('#346594').val(
        isOther ? $('#346594').val() : $('#346578').val()
    );
}

$(document).ready(function () {
    toggleCombinedCertFields_RIVAO();
    toggleCombinedCertDetails_RIVAO();

    $('#341869_5').on('change', function () {
        toggleCombinedCertFields_RIVAO();
    });

    $('#346598').on('change', function () {
        toggleCombinedCertFields_RIVAO();
    });

    $('input[name="346576"]').on('change', function () {
        toggleCombinedCertDetails_RIVAO();
    });

    $('#346578, #346594').on('input change', function () {
        updateCombinedCaste_RIVAO();
    });
});