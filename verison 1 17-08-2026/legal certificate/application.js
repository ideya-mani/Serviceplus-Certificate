

 //====================
// hide grid unremoveable
//======================
$(document).ready(function () {

    // Hide Marital Status old field
    $('#340068_0').closest('.tdata').hide();

    // Hide Marital Status old label/header
    $('.label_header .tdata').filter(function () {
        return $(this).text().trim().includes('Marital Status old');
    }).hide();

});
//=====================
// legal heir declaration update full sentance
//=====================
$(document).ready(function () {

    var declarationText =
        "I hereby declare that the information furnished by me and the documents uploaded in support of this application are true and correct to the best of my knowledge and belief. I understand that furnishing false information or false/forged documents for obtaining a Government certificate may attract action under the applicable law (BNS 212, 216, 217 and other such laws), apart from cancellation of the certificate and recovery of benefits obtained on the basis of such certificate.";

    // Keep the checkbox and replace only the declaration text
    $('#200063_1').closest('label').contents().filter(function () {
        return this.nodeType === Node.TEXT_NODE;
    }).last().replaceWith(' ' + declarationText);

});


//===================
// Age Calculation
//===================
$(document).ready(function () {

    function calculateAge($dob) {
        var $row = $dob.closest('.trow');
        var $age = $row.find('input[name^="345368_"]');

        if (!$dob.val()) {
            $age.val('');
            return;
        }

        var dob = $dob.datepicker('getDate');

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
    $('input[name^="345368_"]').prop('readonly', true);


    // Calculate age for existing rows
    $('input[name^="345367_"]').each(function () {
        calculateAge($(this));
    });


    // Calculate when DOB changes
    $(document).on('change', 'input[name^="345367_"]', function () {
        calculateAge($(this));
    });


    // Handle jQuery UI Datepicker selection
    $(document).on('focus', 'input[name^="345367_"]', function () {

        var $dob = $(this);

        if (!$dob.hasClass('hasAgeHandler')) {

            $dob.addClass('hasAgeHandler');

            $dob.datepicker('option', 'onSelect', function () {
                calculateAge($(this));
            });
        }
    });

});


// ============================================
// hide fields
// ============================================

$(document).ready(function() {
    // Hide the select elements
    $('#345295').hide();
   

    // Hide the labels for both fields
    $('label[for="345295"]').hide(); 

});


// ----------------------------------------------------------------------
// Deceased Details - Spouse Logic (Fixed: clears values on hide, uses
// delegated listeners so it keeps working even if rows are re-rendered)
// ----------------------------------------------------------------------

var spouseConfigs = [
    {
        spouseNumber: 1,
        nameFieldId: "342568",
        aliveFieldName: "344855",
        deathDateFieldId: "344864",
        divorcedFieldName: "344856",
        divorcedOrderFieldId: "344858"
    },
    {
        spouseNumber: 2,
        nameFieldId: "342569",
        aliveFieldName: "344868",
        deathDateFieldId: "344869",
        divorcedFieldName: "344870",
        divorcedOrderFieldId: "344871"
    },
    {
        spouseNumber: 3,
        nameFieldId: "342570",
        aliveFieldName: "344872",
        deathDateFieldId: "344873",
        divorcedFieldName: "344874",
        divorcedOrderFieldId: "344875"
    },
    {
        spouseNumber: 4,
        nameFieldId: "342571",
        aliveFieldName: "344876",
        deathDateFieldId: "344877",
        divorcedFieldName: "344878",
        divorcedOrderFieldId: "344879"
    },
    {
        spouseNumber: 5,
        nameFieldId: "342572",
        aliveFieldName: "344880",
        deathDateFieldId: "344881",
        divorcedFieldName: "344883",
        divorcedOrderFieldId: "344884"
    }
];

// ---------- DOM helpers ----------
function getContainer(elementId) {
    var el = document.getElementById(elementId);
    return el ? el.closest('.tdata') : null;
}

function getParentRow(elementId) {
    var el = document.getElementById(elementId);
    return el ? el.closest('.trow') : null;
}

function getSelectedRadioValue(name) {
    var radios = document.getElementsByName(name);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) return radios[i].value;
    }
    return null;
}

// ---------- Value-clearing helpers (this is what was missing) ----------
function clearTextInput(id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
}

function clearRadioGroup(name) {
    var radios = document.getElementsByName(name);
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }
}

function clearFileInput(id) {
    var fileEl = document.getElementById(id);
    if (fileEl) fileEl.value = "";
    var hiddenImg = document.getElementById(id + "_image");
    if (hiddenImg) hiddenImg.value = "";
    var addDoc = document.getElementById(id + "_additionalDoc");
    if (addDoc) addDoc.value = "";
}

function clearSpouseValues(config) {
    clearTextInput(config.nameFieldId);
    clearRadioGroup(config.aliveFieldName);
    clearFileInput(config.deathDateFieldId);
    clearRadioGroup(config.divorcedFieldName);
    clearFileInput(config.divorcedOrderFieldId);
}

// ---------- Show / hide ----------
// clearValues=true wipes the data too (used when a spouse slot goes out of scope)
function hideAllSpouseFields(config, clearValues) {
    if (clearValues) clearSpouseValues(config);

    var nameContainer = getContainer(config.nameFieldId);
    if (nameContainer) nameContainer.style.display = "none";

    var aliveLabel = document.querySelector('label[for="' + config.aliveFieldName + '"]');
    if (aliveLabel) {
        var aliveContainer = aliveLabel.closest('.tdata');
        if (aliveContainer) aliveContainer.style.display = "none";
    }

    var deathDateContainer = getContainer(config.deathDateFieldId);
    if (deathDateContainer) deathDateContainer.style.display = "none";

    var divorcedLabel = document.querySelector('label[for="' + config.divorcedFieldName + '"]');
    if (divorcedLabel) {
        var divorcedContainer = divorcedLabel.closest('.tdata');
        if (divorcedContainer) divorcedContainer.style.display = "none";
    }

    var divorcedOrderContainer = getContainer(config.divorcedOrderFieldId);
    if (divorcedOrderContainer) divorcedOrderContainer.style.display = "none";
}

function toggleSpouseFields() {
    var spouseCountDropdown = document.getElementById("342565");
    var selectedCount = parseInt(spouseCountDropdown.value) || 0;

    spouseConfigs.forEach(function(config, index) {
        var spouseNumber = index + 1;

        var nameFieldRow = getParentRow(config.nameFieldId);
        var nameFieldContainer = getContainer(config.nameFieldId);

        var aliveQuestionLabel = document.querySelector(
            'label[for="' + config.aliveFieldName + '"]'
        );

        var aliveContainer = null;

        if (aliveQuestionLabel) {
            aliveContainer = aliveQuestionLabel.closest('.tdata');
        }

        if (spouseNumber <= selectedCount) {

            // Show spouse name
            if (nameFieldRow) {
                nameFieldRow.style.display = "block";
            }

            if (nameFieldContainer) {
                nameFieldContainer.style.display = "block";
            }

            // Show alive question for every spouse
            // EXCEPT the last selected spouse
            if (aliveContainer) {
                if (spouseNumber < selectedCount) {
                    aliveContainer.style.display = "block";
                    handleSpouseAliveStatus(config);
                } else {
                    aliveContainer.style.display = "none";
                }
            }

        } else {

            // Spouse is outside selected count
            // Hide and clear all its data
            if (nameFieldRow) {
                nameFieldRow.style.display = "none";
            }

            if (nameFieldContainer) {
                nameFieldContainer.style.display = "none";
            }

            if (aliveContainer) {
                aliveContainer.style.display = "none";
            }

            hideAllSpouseFields(config, true);
        }
    });
}

function handleSpouseAliveStatus(config) {
    var aliveValue = getSelectedRadioValue(config.aliveFieldName);
    var deathDateContainer = getContainer(config.deathDateFieldId);
    var divorcedLabel = document.querySelector('label[for="' + config.divorcedFieldName + '"]');
    var divorcedContainer = divorcedLabel ? divorcedLabel.closest('.tdata') : null;
    var divorcedOrderContainer = getContainer(config.divorcedOrderFieldId);

    if (aliveValue === "1") { // Yes - Alive
        if (deathDateContainer) {
            deathDateContainer.style.display = "none";
            clearFileInput(config.deathDateFieldId); // wipe any death-cert doc left over
        }
        if (divorcedContainer) divorcedContainer.style.display = "block";
        handleDivorcedStatus(config);

    } else if (aliveValue === "2") { // No - Not alive
        if (deathDateContainer) deathDateContainer.style.display = "block";

        if (divorcedContainer) {
            divorcedContainer.style.display = "none";
            clearRadioGroup(config.divorcedFieldName); // wipe leftover divorced answer
        }
        if (divorcedOrderContainer) {
            divorcedOrderContainer.style.display = "none";
            clearFileInput(config.divorcedOrderFieldId);
        }
    } else {
        if (deathDateContainer) deathDateContainer.style.display = "none";
        if (divorcedContainer) divorcedContainer.style.display = "none";
        if (divorcedOrderContainer) divorcedOrderContainer.style.display = "none";
    }
}

function handleDivorcedStatus(config) {
    var divorcedValue = getSelectedRadioValue(config.divorcedFieldName);
    var divorcedOrderContainer = getContainer(config.divorcedOrderFieldId);

    if (divorcedValue === "1") { // Yes - Divorced
        if (divorcedOrderContainer) divorcedOrderContainer.style.display = "block";
    } else {
        // "No" or no selection - hide AND clear the leftover upload
        if (divorcedOrderContainer) {
            divorcedOrderContainer.style.display = "none";
            clearFileInput(config.divorcedOrderFieldId);
        }
    }
}

function initializeSpouseFields() {
    spouseConfigs.forEach(function(config) {
        var nameRow = getParentRow(config.nameFieldId);
        if (nameRow) nameRow.style.display = "none";
        hideAllSpouseFields(config, false); // false: nothing to clear on first load
    });
}

// ---------- Event wiring ----------
var timeoutIdSpouse;

function addSpouseEventListeners() {
    var countDropdown = document.getElementById("342565");
    if (countDropdown) {
        countDropdown.addEventListener("change", function() {
            clearTimeout(timeoutIdSpouse);
            timeoutIdSpouse = setTimeout(toggleSpouseFields, 400);
        });
    }

    // Single delegated listener instead of looping over every radio.
    // This also keeps working if the platform ever re-renders/re-inserts
    // these rows, since we're not holding references to the old nodes.
    document.addEventListener("change", function(e) {
        var target = e.target;
        if (!target || target.tagName !== "INPUT" || target.type !== "radio") return;

        var aliveConfig = spouseConfigs.find(function(c) {
            return c.aliveFieldName === target.name;
        });
        if (aliveConfig) {
            clearTimeout(timeoutIdSpouse);
            timeoutIdSpouse = setTimeout(function() {
                handleSpouseAliveStatus(aliveConfig);
            }, 400);
            return;
        }

        var divorcedConfig = spouseConfigs.find(function(c) {
            return c.divorcedFieldName === target.name;
        });
        if (divorcedConfig) {
            clearTimeout(timeoutIdSpouse);
            timeoutIdSpouse = setTimeout(function() {
                handleDivorcedStatus(divorcedConfig);
            }, 400);
        }
    });
}

function initializeDeceasedSpouseLogic() {
    initializeSpouseFields();
    addSpouseEventListeners();
    toggleSpouseFields();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDeceasedSpouseLogic);
} else {
    initializeDeceasedSpouseLogic();
}

//===============================================
//===============================================
formatFields();

    console.log(
        "Child Rows = ",
        parseInt($("#fieldSetRowNum_200153").val()) + 1
    );

    // INITIAL LOAD (IMPORTANT: delay to ensure DOM is ready)
    setTimeout(function () {
        lockCountry();
        toggleOtherPurpose();
        hideIssuedID();
        hideChildBirthDocs();
        initializeSpouseSection();
        
        // autoSalutation(salutationId, genderId, maritalId)
        autoSalutation(342777, 200049, 342805) // for applicant
        autoSalutation(342573, 342574, 342575) // for Deceased 

        //Hide the salutation
        document.getElementById("342777").closest(".trow").style.display = "none";
        document.getElementById("342573").closest(".trow").style.display = "none";

        // Initialize Region
        $("#340607").html(
            '<option value="">Please Select</option>'
        );

    }, 800);


    // FIELDSET 1 - Issued ID
    $(document).on('click', "*[name^='200055_add'], *[name^='200055_remove']", function () {

        fieldsetAddRemoveFun(this);

        setTimeout(function () {
            hideIssuedID();
        }, 500);

    });

    // FIELDSET 2 - Child Birth Docs
    $(document).on('click', "*[name^='200153_add'], *[name^='200153_remove']", function () {

        fieldsetAddRemoveFun(this);

        setTimeout(function () {
            hideChildBirthDocs();
        }, 1000);

    });

        // Toggle Other Purpose field
    $(document).on('change', "#340066", function () {
        toggleOtherPurpose();
    });

    // =====================================
    // District -> Region
    // =====================================
    $(document).on('change', '#339381', function () {

        var district = $("#339381 option:selected").text().trim();

        // Reset Region
        $("#340607").html(
            '<option value="">Please Select</option>'
        );

        // Reset Taluk
        $("#339382").html(
            '<option value="">Please Select</option>'
        );

        // Reset Village
        $("#339383").html(
            '<option value="">Please Select</option>'
        );

        if (district === "PONDICHERRY") {

            $("#340607").append(
                '<option value="1">Puducherry</option>'
            );

            $("#340607").append(
                '<option value="3">Mahe</option>'
            );

            $("#340607").append(
                '<option value="4">Yanam</option>'
            );

        } else if (district === "KARAIKAL") {

            $("#340607").append(
                '<option value="2">Karaikal</option>'
            );
        }
    });


    // =====================================
    // Region -> Taluk
    // =====================================
    $(document).on('change', '#340607', function () {

        var region = $("#340607 option:selected").text().trim();

        $("#339382").html(
            '<option value="">Please Select</option>'
        );

        $("#339383").html(
            '<option value="">Please Select</option>'
        );

        switch (region) {

            case "Puducherry":

                $("#339382").append(
                    '<option value="2816892" data-entity-level="null">Bahour Taluk</option>'
                );

                $("#339382").append(
                    '<option value="2816890" data-entity-level="null">Oulgaret Taluk</option>'
                );

                $("#339382").append(
                    '<option value="2816889" data-entity-level="null">Puducherry Taluk</option>'
                );

                $("#339382").append(
                    '<option value="2816891" data-entity-level="null">Villlianur Taluk</option>'
                );

                break;

            case "Mahe":

                $("#339382").append(
                    '<option value="2816893" data-entity-level="null">Mahe Sub Taluk</option>'
                );

                break;

            case "Yanam":

                $("#339382").append(
                    '<option value="2816894" data-entity-level="null">Yanam Sub Taluk</option>'
                );

                break;

            case "Karaikal":

                $("#339382").append(
                    '<option value="2816895" data-entity-level="null">Thirunallar Taluk</option>'
                );

                $("#339382").append(
                    '<option value="2816896" data-entity-level="null">Karaikal Taluk</option>'
                );

                break;
        }
    });


    // =====================================
    // Taluk -> Village (Existing LGD)
    // =====================================
    $(document).on('change', '#339382', function () {

        populateCustomLgd(
            '339382',
            'O',
            'O',
            '339383',
            '7084',
            '7082',
            this
        );

    });

    return true;


    function formatFields() {

        // FORCE uppercase input fields
        $("#339469, #200048, #200053, #200184")
            .css("text-transform", "uppercase")
            .off("input")
            .on("input", function () {
                $(this).val($(this).val().toUpperCase());
            });

        // Dropdown formatting (Proper Case)
        $("#339381")
            .off("change")
            .on("change", function () {

                var location = $("#339381 option:selected").text();

                location = location.toLowerCase().replace(/^./, function (c) {
                    return c.toUpperCase();
                });

                window.selectedLocation = location;
            });
    }

    function lockCountry() {
        // Country = India
        $("#340076").val("356");

        $("#340076 option:not(:selected)").remove();

        $("#340076").css({
            "pointer-events": "none",
            "background-color": "#f5f5f5"
        });

        // State = Puducherry
        $("#340077").val("34");
        $("#340077 option:not(:selected)").remove();
        $("#340077").css({
            "pointer-events": "none",
            "background-color": "#f5f5f5"
        });

        $("#340077").trigger("change");
    }

    function toggleOtherPurpose() {

        var purpose = $("#340066").val();

        var otherContainer = $("#340067").closest(".cont").parent();

        if (purpose === "4") {
            $("#340067").closest(".cont").show();
            $("#340067").closest(".cont").prev("label").show();
        } else {
            $("#340067").val("");
            $("#340067").closest(".cont").hide();
            $("#340067").closest(".cont").prev("label").hide();
        }
    }

    function hideIssuedID() {

        console.log("Issued ID hide");

        var maxMembers = 20;
        var startId = 340106;

        // IMPORTANT: count ONLY visible/active rows
        var memberCount = $("[name^='200055_']").closest(".trow.left").length;

        $("#340126").val(memberCount);

        for (var i = 1; i <= maxMembers; i++) {

            var id = startId + (i - 1);
            var row = $("#" + id).closest(".trow");

            if (i <= memberCount) {
                row.show();
            } else {
                row.hide();

                $("#" + id).val("");
                $("#" + id + "_additionalDoc").val("");
                $("#" + id + "_image").val("");
            }
        }
    }

    function hideChildBirthDocs() {

        console.log("Child Birth Docs hide");

        // Count actual rows in child fieldset
        var childCount = $("input[id^='200154_']").length;

        console.log("Actual Child Rows = ", childCount);

        $("#340170").val(childCount);

        var startId = 340184;
        var maxDocs = 20;

        for (var i = 1; i <= maxDocs; i++) {

            var docId = startId + (i - 1);

            var row = $("#" + docId).closest(".trow");

            if (i <= childCount) {

                row.show();

            } else {

                row.hide();

                $("#" + docId).val("");
                $("#" + docId + "_additionalDoc").val("");
                $("#" + docId + "_image").val("");
            }
        }
    }



    // =====================================
    // Marital Status -> Spouse Details
    // =====================================
  

   function initializeSpouseSection() {

    var $maritalStatus = $("#342575");
    var $spouseCount = $("#342565");
    var $hiddenStatus = $("input[name='342776']");

    var $spouseCountRow = $spouseCount.closest(".trow");

    var spouseRows = [
        $("#342568").closest(".trow"),
        $("#342569").closest(".trow"),
        $("#342570").closest(".trow"),
        $("#342571").closest(".trow"),
        $("#342572").closest(".trow")
    ];

    var $childrenSection = $("h4").filter(function () {
        return $.trim($(this).text()) ===
            "Details of Another Spouse and Their Children";
    }).closest(".table_cont");

    function hideAll() {
        $spouseCountRow.hide();
        $.each(spouseRows, function (_, row) {
            row.hide();
        });
        $childrenSection.hide();
    }

    function updateHiddenStatus() {
        $hiddenStatus.val($.trim($maritalStatus.find("option:selected").text()));
    }

    function toggleSpouseDetails() {

        hideAll();

        var maritalStatus = ($hiddenStatus.val() || "").toLowerCase();

        if (maritalStatus !== "married") {
            return;
        }

        $spouseCountRow.show();

        var spouseCount = parseInt($spouseCount.find("option:selected").text(),10);

        if (isNaN(spouseCount)) {
            return;
        }

        for(var i=0;i<spouseCount && i<spouseRows.length;i++){
            spouseRows[i].show();
        }

        if(spouseCount >= 2){
            $childrenSection.show();
        }
    }

    updateHiddenStatus();
    toggleSpouseDetails();

    $maritalStatus.on("change",function(){
        updateHiddenStatus();
        toggleSpouseDetails();
    });

    $spouseCount.on("change",toggleSpouseDetails);
}


    // =====================================
    // Auto Salutation based on Gender and Marital Status
    // =====================================
  function autoSalutation(salutationId, genderId, maritalId) {

    var $salutation = $("#" + salutationId);
    var $gender = $("input[name='" + genderId + "']");
    var $marital = $("#" + maritalId);


    function updateSalutation() {

        var genderText = $gender.filter(":checked")
            .closest("label")
            .text()
            .trim()
            .toLowerCase();

        var maritalText = $marital.find("option:selected")
            .text()
            .trim()
            .toLowerCase();


        var salutationValue = "";


        // Male
        if (genderText === "male") {

            salutationValue = "Shri.";

        }

        // Female
        else if (genderText === "female") {

            if (maritalText === "married") {

                salutationValue = "Tmt.";

            } else {

                salutationValue = "Kumari.";

            }

        }

        // Other
        else if (genderText === "other") {

            salutationValue = "Kumari.";

        }


        // Set dropdown value by text
        $salutation.find("option").each(function () {

            if ($(this).text().trim() === salutationValue) {

                $salutation.val($(this).val());

            }

        });


        // Make readonly (disabled)
        if (salutationValue !== "") {

            $salutation.css({
                "pointer-events": "none",
                "background-color": "#f5f5f5"
            });

            $salutation.attr("readonly", true);

        } else {

            $salutation.css({
                "pointer-events": "",
                "background-color": ""
            });

            $salutation.removeAttr("readonly");

        }

    }


    // Initial load (Edit/Draft/Preview)
    updateSalutation();


    // Gender change
    $gender.on("change", function () {

        updateSalutation();

    });


    // Marital status change
    $marital.on("change", function () {

        updateSalutation();

    });

} 


