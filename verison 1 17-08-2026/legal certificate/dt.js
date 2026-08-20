console.log('test');

//===================
// Age Calculation
//===================
$(document).ready(function () {

    function calculateDTAge($dob) {
        var $row = $dob.closest('.trow');
        var $age = $row.find('input[name^="345390_"]');

        if (!$dob.val()) {
            $age.val('');
            return;
        }

        // Get selected date from jQuery UI Datepicker
        var dob = $dob.datepicker('getDate');

        if (!dob) {
            $age.val('');
            return;
        }

        var today = new Date();

        var age = today.getFullYear() - dob.getFullYear();

        var monthDifference = today.getMonth() - dob.getMonth();

        // Reduce age if birthday has not occurred this year
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        $age.val(age);
    }

    // Make all Age fields read-only
    $('input[name^="345390_"]').prop('readonly', true);

    // Calculate age for all existing rows on page load
    $('input[name^="345389_"]').each(function () {
        calculateDTAge($(this));
    });

    // Calculate when DOB changes
    $(document).on('change', 'input[name^="345389_"]', function () {
        calculateDTAge($(this));
    });

});

// ----------------------------------------------------------------------
// Hide Taluk, Certificate Taluk, Gender, and Salutation fields
//-----------------------------------------------------------------------

function hideFields() {
    // 1. Hide Taluk dropdown (has ID)
    var taluk = document.getElementById("344835");
    if (taluk) {
        var row = taluk.closest('.trow');
        if (row) row.style.display = "none";
    }

    // 2. Hide Certificate Taluk text field (has ID)
    var certTaluk = document.getElementById("344836");
    if (certTaluk) {
        var row = certTaluk.closest('.trow');
        if (row) row.style.display = "none";
    }

    // 3. Hide Gender section – find by label or radio name
    var genderLabel = document.querySelector('label[for="344847"]');
    if (genderLabel) {
        var container = genderLabel.closest('.tdata'); // or .trow
        if (container) {
            var row = container.closest('.trow');
            if (row) row.style.display = "none";
            else container.style.display = "none";
        }
    } else {
        // Fallback: find radio buttons with name="344847"
        var radios = document.getElementsByName("344847");
        if (radios.length > 0) {
            var container = radios[0].closest('.tdata');
            if (container) {
                var row = container.closest('.trow');
                if (row) row.style.display = "none";
                else container.style.display = "none";
            }
        }
    }

    // 4. Hide Salutation dropdown (has ID)
    var salutation = document.getElementById("344848");
    if (salutation) {
        var row = salutation.closest('.trow');
        if (row) row.style.display = "none";
    }
}

// Run on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideFields);
} else {
    hideFields();
}
// ----------------------------------------------------------------------
// 8. Function to set the Taluk Office based on the selected dropdown value
//-----------------------------------------------------------------------

function setTalukOffice() {
    var dropdown = document.getElementById("344835");
    var selectedText = dropdown.options[dropdown.selectedIndex].text;

    if (selectedText === "Please Select") {
        document.getElementById("344836").value = "";
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

    document.getElementById("344836").value = officeName.toUpperCase();
}
 
// On dropdown change - with 400ms delay and only if value exists
document.getElementById("344835").addEventListener("change", function() {
    var dropdown = document.getElementById("344835");
    if (dropdown.value && dropdown.value !== "") {
        setTimeout(setTalukOffice, 400);
    }
});
// initial load
setTalukOffice();


// ----------------------------------------------------------------------
// Function to set Salutation based on Gender selection
//-----------------------------------------------------------------------

function setSalutation() {
    // Get the selected gender radio button
    var genderRadios = document.getElementsByName("344847");
    var selectedGender = null;
    
    for (var i = 0; i < genderRadios.length; i++) {
        if (genderRadios[i].checked) {
            selectedGender = genderRadios[i].value;
            break;
        }
    }
    
    var salutationDropdown = document.getElementById("344848");
    
    // If no gender is selected, reset to "Please Select"
    if (!selectedGender) {
        salutationDropdown.value = "";
        return;
    }
    
    // Set salutation based on gender value
    // Value 1 = Male (Him), Value 2 = Female (Her), Value 3 = Other (Her)
    switch(selectedGender) {
        case "1": // Male
            salutationDropdown.value = "1"; // Him
            break;
        case "2": // Female
            salutationDropdown.value = "2"; // Her
            break;
        case "3": // Other
            salutationDropdown.value = "2"; // Her (same as Female)
            break;
        default:
            salutationDropdown.value = "";
    }
}

// Add change event listeners to all gender radio buttons with timeout
var genderRadios = document.getElementsByName("344847");
for (var i = 0; i < genderRadios.length; i++) {
    genderRadios[i].addEventListener("change", function() {
        setTimeout(setSalutation, 400);
    });
}

// Initial load
setSalutation();

// -----------------------------
// Configuration
// -----------------------------
const config = {
    // Radio buttons
    sendToFirstRadio: "342934_1",   // Revenue Inspector Report
    sendToSecondRadio: "342934_2",  // Deputy Tahsildar Report

    // Checkbox groups
    firstGroup: "user_342935",
    secondGroup: "user_342936",

    // Dropdown IDs
    firstDropdown: "dtDropdown",
    secondDropdown: "vaoDropdown",

    // Error IDs
    firstError: "error_342935",
    secondError: "error_342936",

    // Labels
    firstLabel: "Revenue Inspector",
    secondLabel: "Tahsildar or Deputy Tahsildar"
};

// -----------------------------
// Convert Checkbox Group to Dropdown
// -----------------------------
function convertToDropdown(groupId, dropdownId, labelText, errorId) {

    var group = document.getElementById(groupId);
    if (!group) return;

    var checkboxes = group.querySelectorAll("input[type='checkbox']");
    if (!checkboxes.length) return;

    var select = document.createElement("select");
    select.id = dropdownId;
    select.style.width = "250px";
    select.setAttribute("required", "required");

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

// -----------------------------
// Create Dropdowns
// -----------------------------
convertToDropdown(config.firstGroup, config.firstDropdown, config.firstLabel, config.firstError);
convertToDropdown(config.secondGroup, config.secondDropdown, config.secondLabel, config.secondError);

// -----------------------------
// Enable / Disable Dropdowns
// -----------------------------
function handleSendToChange(cfg) {

    var firstRadio = document.getElementById(cfg.sendToFirstRadio);
    var secondRadio = document.getElementById(cfg.sendToSecondRadio);

    var firstGroup = document.getElementById(cfg.firstGroup);
    var secondGroup = document.getElementById(cfg.secondGroup);

    var firstDropdown = document.getElementById(cfg.firstDropdown);
    var secondDropdown = document.getElementById(cfg.secondDropdown);

    function setState(group, dropdown, enabled) {

        if (!group || !dropdown) return;

        var checkboxes = group.querySelectorAll("input[type='checkbox']");

        if (enabled) {

            dropdown.disabled = false;

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

    if (firstRadio.checked) {

        setState(firstGroup, firstDropdown, true);
        setState(secondGroup, secondDropdown, false);

    } else if (secondRadio.checked) {

        setState(firstGroup, firstDropdown, false);
        setState(secondGroup, secondDropdown, true);

    } else {

        setState(firstGroup, firstDropdown, false);
        setState(secondGroup, secondDropdown, false);
    }

    var err1 = document.getElementById(cfg.firstError);
    var err2 = document.getElementById(cfg.secondError);

    if (err1) err1.style.display = "none";
    if (err2) err2.style.display = "none";
}

// -----------------------------
// Validation
// -----------------------------
function validateSendTo(cfg) {

    var firstRadio = document.getElementById(cfg.sendToFirstRadio);
    var secondRadio = document.getElementById(cfg.sendToSecondRadio);

    var firstDropdown = document.getElementById(cfg.firstDropdown);
    var secondDropdown = document.getElementById(cfg.secondDropdown);

    var firstError = document.getElementById(cfg.firstError);
    var secondError = document.getElementById(cfg.secondError);

    if (firstError) firstError.style.display = "none";
    if (secondError) secondError.style.display = "none";

    if (firstRadio.checked && !firstDropdown.value) {

        firstError.textContent = "Please select a " + cfg.firstLabel + ".";
        firstError.style.display = "block";
        firstDropdown.focus();
        return false;
    }

    if (secondRadio.checked && !secondDropdown.value) {

        secondError.textContent = "Please select a " + cfg.secondLabel + ".";
        secondError.style.display = "block";
        secondDropdown.focus();
        return false;
    }

    return true;
}

// -----------------------------
// Events
// -----------------------------
document.getElementById(config.sendToFirstRadio).addEventListener("change", function () {
    handleSendToChange(config);
});

document.getElementById(config.sendToSecondRadio).addEventListener("change", function () {
    handleSendToChange(config);
});

// -----------------------------
// Form Submit
// -----------------------------
var form = document.querySelector("form");

if (form) {

    form.addEventListener("submit", function (e) {

        if (!validateSendTo(config)) {
            e.preventDefault();
        }

    });

}

// -----------------------------
// Blur Validation
// -----------------------------
document.getElementById(config.firstDropdown).addEventListener("blur", function () {

    var err = document.getElementById(config.firstError);

    if (document.getElementById(config.sendToFirstRadio).checked && !this.value) {

        err.textContent = "Please select a " + config.firstLabel + ".";
        err.style.display = "block";

    } else {

        err.style.display = "none";
    }

});

document.getElementById(config.secondDropdown).addEventListener("blur", function () {

    var err = document.getElementById(config.secondError);

    if (document.getElementById(config.sendToSecondRadio).checked && !this.value) {

        err.textContent = "Please select a " + config.secondLabel + ".";
        err.style.display = "block";

    } else {

        err.style.display = "none";
    }

});

// -----------------------------
// Initial Load
// -----------------------------
handleSendToChange(config);



//---------
// 9. Set Relation with Deceased based on Gender and Marital Status
//---------

function setRelationWithDeceased() {
    var gender = $('input[name="344847"]:checked').val();
    var maritalStatus = $('#345470').val();
    var relation = $('#345472');

    // Hide Gender and Marital Status
    $('input[name="344847"]').closest('.trow').hide();
    $('#345470').closest('.trow').hide();

    // Hide Father, Husband/Spouse and Common Relation fields
    $('#345473').closest('.trow').hide();
    $('#345474').closest('.trow').hide();
    $('#345475').closest('.trow').hide();

    // Hide all relation options first
    relation.find('option[value="1"], option[value="2"], option[value="3"]').hide();

    if (gender === '1') {
        // Male -> Son of
        relation.find('option[value="1"]').show();
        relation.val('1');

    } else if (gender === '2' || gender === '3') {

        if (maritalStatus === '1') {
            // Married -> Wife of / Daughter of
            relation.find('option[value="2"], option[value="3"]').show();
            relation.val('3');

        } else if (maritalStatus === '2') {
            // Unmarried -> Daughter of
            relation.find('option[value="2"]').show();
            relation.val('2');
        }
    }

    // Set Common Deceased Relation Name
    setCommonRelationName();
}


function setCommonRelationName() {
    var relationValue = $('#345472').val();

    if (relationValue === '3') {
        // Wife of -> Husband / Spouse name
        $('#345475').val($('#345474').val());
    } else {
        // Son of / Daughter of -> Father's name
        $('#345475').val($('#345473').val());
    }
}


// Run initially
setRelationWithDeceased();


// Keep Common Deceased Relation Name updated
$('#345473, #345474').on('input change', function () {
    setCommonRelationName();
});


// If relation changes
$('#345472').on('change', function () {
    setCommonRelationName();
});


//-----------------------------
// 10. Set His/Her based on Gender
//----------------------------- 

function setHisHerByGender() {
    var gender = $('input[name="344847"]:checked').val();

    if (gender === '1') {
        // Male
        $('#345471').val('1'); // his
    } 
    else if (gender === '2' || gender === '3') {
        // Female
        $('#345471').val('2'); // her
    }
}

// Run on page load
setHisHerByGender();

// hide his/her 
$('#345471').closest('.trow').hide();