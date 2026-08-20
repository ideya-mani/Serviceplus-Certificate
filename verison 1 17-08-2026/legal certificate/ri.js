//=====================
// hide old grid scetion
//=====================
$(document).ready(function () {
    $('#fieldSetId[value="342658"]').closest('fieldset').hide();
});

//===================
// Age Calculation
//===================
$(document).ready(function () {

    // Calculate age for a particular DOB field
    function calculateRIAge($dob) {
        var dob = $dob.datepicker('getDate');
        var $row = $dob.closest('.trow');
        var $age = $row.find('input[name^="345397_"]');

        if (!dob) {
            $age.val('');
            return;
        }

        var today = new Date();

        var age = today.getFullYear() - dob.getFullYear();

        if (
            today.getMonth() < dob.getMonth() ||
            (
                today.getMonth() === dob.getMonth() &&
                today.getDate() < dob.getDate()
            )
        ) {
            age--;
        }

        $age.val(age);
    }


    // Make all Age fields readonly
    $('input[name^="345397_"]').prop('readonly', true);


    // Calculate age for all existing rows on page load
    $('input[name^="345396_"]').each(function () {
        calculateRIAge($(this));
    });


    // Calculate age when DOB changes
    $(document).on('change', 'input[name^="345396_"]', function () {
        calculateRIAge($(this));
    });

});


// -----------------------------
// Configuration
// -----------------------------
const config = {
    // Radio buttons
    sendToFirstRadio: "341658_1",   // Deputy Tahsildar Report
    sendToSecondRadio: "341658_2",  // VAO Report

    // Checkbox groups
    firstGroup: "user_341659",
    secondGroup: "user_341648",

    // Dropdown IDs
    firstDropdown: "dtDropdown",
    secondDropdown: "vaoDropdown",

    // Error IDs
    firstError: "error_341659",
    secondError: "error_341648",

    // Labels
    firstLabel: "Deputy Tahsildar",
    secondLabel: "Village Administrative Officer (VAO)"
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



// =========================================
// 4. Relationship of deceased with father or husband
// =========================================

function setRelationWithDeceased() {
    var gender = $('input[name="345467"]:checked').val();
    var maritalStatus = $('#345468').val();
    var relation = $('#345469');

    // Always hide Gender and Marital Status fields
    $('input[name="345467"]').closest('.trow').hide();
    $('#345468').closest('.trow').hide();

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
}

setRelationWithDeceased();