console.log("test");
//=======================
// hide the verification section for return to applicant
//=======================
$(document).ready(function () {

    function toggleVAOSections() {

        // Get selected action radio button value
        var action = $('input[data-type="action"]:checked').val();

        // Find Enquiry Report of VAO Annexure-III-A section
        var $annexureIIIA = $('.table_cont').filter(function () {
            return $(this).find('h4').text().trim() === 'Enquiry Report of VAO Annexure-III-A';
        });

        // Find ANNEXURE-III-B section
        var $annexureIIIB = $('.table_cont').filter(function () {
            return $(this).find('h4').text().trim() === 'ANNEXURE-III-B';
        });

        // If Return to Applicant is selected
        if (action === '34') {

            $annexureIIIA.hide();
            $annexureIIIB.hide();

        } else {

            $annexureIIIA.show();
            $annexureIIIB.show();
        }
    }

    // Run when action radio button changes
    $('input[data-type="action"]').on('change', function () {
        toggleVAOSections();
    });

    // Run on page load
    toggleVAOSections();

});
//===================
// Age Calculation
//===================
$(document).ready(function () {

    function calculateAge($dob) {
        var $row = $dob.closest('.trow');
        var $age = $row.find('input[name^="345383_"]');

        if (!$dob.val()) {
            $age.val('');
            return;
        }

        // Get date from jQuery UI datepicker
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
    $('input[name^="345383_"]').prop('readonly', true);

    // Calculate age for all existing rows on page load
    $('input[name^="345382_"]').each(function () {
        calculateAge($(this));
    });

    // Calculate when DOB changes
    $(document).on('change', 'input[name^="345382_"]', function () {
        calculateAge($(this));
    });

});

// -----------------------------
// 1. Toggle Objection Details
// -----------------------------

function toggleObjectionDetails() {
  var selectedLabel = $("input[name='342600']:checked")
    .closest("label")
    .text()
    .trim()
    .toLowerCase();

  // Find the fieldset that contains the hidden input with value 342601
  var objectionSection = $("input[name='fieldSetId'][value='342601']").closest(
    ".tdata",
  );

  if (selectedLabel === "yes") {
    objectionSection.show();
  } else {
    objectionSection.hide();
  }
}

toggleObjectionDetails();

$("input[name='342600']").on("change", toggleObjectionDetails);

// -----------------------------
// 2. Convert checkbox group → dropdown
// -----------------------------

// CONFIG
const config = {
  // Action
  actionRI: "339409_1", // Forward to RI
  actionVAO: "339409_2", // Forward to VAO
  actionReturn: "339409_3", // Return to Edit

  // Send To
  riRadio: "339462_1",
  vaoRadio: "339462_2",

  // Checkbox Groups
  riGroup: "user_339464",
  vaoGroup: "user_339463",

  // Dropdowns
  riDropdown: "riDropdown",
  vaoDropdown: "vaoDropdown",

  // Errors
  riError: "error_339464",
  vaoError: "error_339463",

  riLabel: "Revenue Inspector",
  vaoLabel: "Village Administrative Officer",
};

// =========================================
// Convert Checkbox Group -> Dropdown
// =========================================
function convertToDropdown(groupId, dropdownId, labelText) {
  var group = document.getElementById(groupId);

  if (!group) return;

  var checkboxes = group.querySelectorAll("input[type='checkbox']");

  if (!checkboxes.length) return;

  var select = document.createElement("select");
  select.id = dropdownId;
  select.style.width = "250px";

  var defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "-- Select " + labelText + " --";

  select.appendChild(defaultOption);

  checkboxes.forEach(function (cb) {
    var lbl = group.querySelector("label[for='" + cb.id + "']");

    if (!lbl) return;

    var opt = document.createElement("option");
    opt.value = cb.value;
    opt.text = lbl.textContent.trim();

    select.appendChild(opt);
  });

  group.style.display = "none";
  group.parentNode.insertBefore(select, group);

  select.addEventListener("change", function () {
    checkboxes.forEach(function (cb) {
      cb.checked = false;
    });

    if (this.value) {
      var target = group.querySelector("input[value='" + this.value + "']");

      if (target) {
        target.checked = true;
      }
    }
  });
}

// =========================================
// Create Dropdowns
// =========================================
convertToDropdown(config.riGroup, config.riDropdown, config.riLabel);

convertToDropdown(config.vaoGroup, config.vaoDropdown, config.vaoLabel);

// =========================================
// Enable/Disable Dropdown
// =========================================
function toggleDropdown(groupId, dropdownId, enable) {
  var group = document.getElementById(groupId);
  var dropdown = document.getElementById(dropdownId);

  if (!group || !dropdown) return;

  dropdown.disabled = !enable;

  if (!enable) {
    dropdown.value = "";

    group.querySelectorAll("input[type='checkbox']").forEach(function (cb) {
      cb.checked = false;
      cb.disabled = true;
    });
  } else {
    group.querySelectorAll("input[type='checkbox']").forEach(function (cb) {
      cb.disabled = false;
    });
  }
}

// =========================================
// Handle Action Change
// =========================================
function handleAction() {
  var actionRI = document.getElementById(config.actionRI);
  var actionVAO = document.getElementById(config.actionVAO);
  var actionReturn = document.getElementById(config.actionReturn);

  var riRadio = document.getElementById(config.riRadio);
  var vaoRadio = document.getElementById(config.vaoRadio);

  // Forward to RI
  if (actionRI.checked) {
    riRadio.disabled = false;
    riRadio.checked = true;

    vaoRadio.checked = false;
    vaoRadio.disabled = true;

    toggleDropdown(config.riGroup, config.riDropdown, true);
    toggleDropdown(config.vaoGroup, config.vaoDropdown, false);
  }

  // Forward to VAO
  else if (actionVAO.checked) {
    vaoRadio.disabled = false;
    vaoRadio.checked = true;

    riRadio.checked = false;
    riRadio.disabled = true;

    toggleDropdown(config.riGroup, config.riDropdown, false);
    toggleDropdown(config.vaoGroup, config.vaoDropdown, true);
  }

  // Return to Edit
  else if (actionReturn.checked) {
    riRadio.checked = false;
    vaoRadio.checked = false;

    riRadio.disabled = true;
    vaoRadio.disabled = true;

    toggleDropdown(config.riGroup, config.riDropdown, false);
    toggleDropdown(config.vaoGroup, config.vaoDropdown, false);
  }
}

// =========================================
// Events
// =========================================
document
  .getElementById(config.actionRI)
  .addEventListener("change", handleAction);

document
  .getElementById(config.actionVAO)
  .addEventListener("change", handleAction);

document
  .getElementById(config.actionReturn)
  .addEventListener("change", handleAction);

// =========================================
// Initial Load
// =========================================
handleAction();



// =========================================
// 4. Relationship of deceased with father or husband
// =========================================

function setRelationWithDeceased() {
    var gender = $('input[name="345464"]:checked').val();
    var maritalStatus = $('#345465').val();
    var relation = $('#345466');

    // Always hide Gender and Marital Status fields
    $('input[name="345464"]').closest('.trow').hide();
    $('#345465').closest('.trow').hide();

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