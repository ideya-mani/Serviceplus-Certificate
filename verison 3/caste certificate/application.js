  
//=======================================
// Auto-fetch Name in Family Annual Income rows
// based on selected "Applicant's Relation"
//=======================================
$(document).ready(function () {

    var RELATION_SOURCE_FIELD = {
        "1": "#339491",  // Father
        "2": "#339497",  // Mother
        "3": "#344707",  // Spouse
        "5": "#339158"   // Self
     
        // "4" (Sibling) has no fixed source — left editable, no auto-fill
    };

    function applyIncomeNameAutofetch($relationSelect) {
        var $row = $relationSelect.closest('.trow');
        var $nameField = $row.find('input[name^="340979_"]');
        if (!$nameField.length) return;

        var relationValue = $relationSelect.val();
        var sourceSelector = RELATION_SOURCE_FIELD[relationValue];

        if (sourceSelector) {
            var sourceValue = $(sourceSelector).val() || '';
            $nameField.val(sourceValue)
                .prop('readonly', false)
                .css('background-color', '#f5f5f5');
        } else {
            // Sibling, or nothing selected — leave it editable
            $nameField.prop('readonly', false)
                .css('background-color', '').val('');
            if (relationValue === "" ) {
                $nameField.val('');
            }
        }
    }

    // Fire when any relation dropdown in this fieldset changes
    $(document).on('change', 'select[name^="340980_"]', function () {
        applyIncomeNameAutofetch($(this));
    });

    // Keep already-mapped rows in sync if the source field itself
    // changes later (e.g. Father's Name edited after this row was set)
    $('#339491, #339497, #344707, #339158').on('input change', function () {
        $('select[name^="340980_"]').each(function () {
            applyIncomeNameAutofetch($(this));
        });
    });

    // Initial pass — covers rows already populated in edit mode,
    // where the relation dropdown's selected option won't fire 'change'
    function initAllIncomeRows() {
        $('select[name^="340980_"]').each(function () {
            applyIncomeNameAutofetch($(this));
        });
    }
    initAllIncomeRows();

    // Newly added rows (via add_bttn) get their relation dropdown
    // reset to blank by the platform, so nothing to autofetch yet —
    // but re-run in case the platform clones a prefilled row
    $(document).on('click', '.add_bttn, .remove_bttn', function () {
        setTimeout(initAllIncomeRows, 200);
    });
});

//=======================================
 // Function to toggle Organization dropdown and "Other" field
//=======================================
    function toggleOrganization() {
        var employmentStatus = $('#339243').val();
        var isGovtOrPublic = (employmentStatus === '2' || employmentStatus === '3');
        // List of fields to show/hide based on employment status
        var fieldsToToggle = ['339244', '341871'];
        // Toggle fields based on employment status
        fieldsToToggle.forEach(function(id) {
            var $field = $('#' + id);
            var $label = $('label[for="' + id + '"]');
            if (isGovtOrPublic) {
                $label.hide();
                $field.closest('.cont').hide();
                $field.val('');
            } else {
                $label.show();
                $field.closest('.cont').show();
            }
        });
        // Handle "Others" selection in organization dropdown
        var selectedOrg = $('#339244').val();
        var $specifyOrg = $('#341871');
        if (selectedOrg == "5") {
            $specifyOrg.parents(".tdata").show();
        } else {
            $specifyOrg.parents(".tdata").hide();
            $specifyOrg.val('');
        }
    }
    // Event listeners
    $('#339243').on('change', toggleOrganization);
    $('#339244').on('change', toggleOrganization);
    // Initial page load (new application — field still blank, this is fine)
    toggleOrganization();

    // Re-run after everything (including edit-mode prefill) has loaded,
    // since edit data is populated after ready without firing 'change'
    $(window).on('load', function () {
        setTimeout(toggleOrganization, 500);
    });

 //=======================================
// Hide Puducherry Village from Village Dropdown
//=======================================
$(document).ready(function () {
    function hidePuducherryVillage() {
        $('#339134 option')
            .filter(function () {
                return (
                    $(this).text().trim().toLowerCase() ===
                    'puducherry village'
                );
            })
            .hide();
    }

    // Initial check
    hidePuducherryVillage();

    // Check when dropdown is opened/focused
    $(document).on('focus', '#339134', function () {
        hidePuducherryVillage();
    });
});

//========================================================
// Based on age, Father and Mother fields will be
// required or not
//========================================================

function calculateAge(dob) {

    if (!dob) {
        return null;
    }

    // Expected format: DD/MM/YYYY
    var parts = dob.split('/');

    if (parts.length !== 3) {
        return null;
    }

    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);

    var birthDate = new Date(year, month, day);

    // Validate date
    if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month ||
        birthDate.getDate() !== day
    ) {
        return null;
    }

    var today = new Date();

    var age = today.getFullYear() - birthDate.getFullYear();

    var monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}


function applyParentFieldLogic() {

    var dob = $('#339162').val();
    var age = calculateAge(dob);

    console.log('DOB:', dob);
    console.log('Age:', age);


    // ========================================================
    // AGE ABOVE 40
    // ========================================================
    if (age !== null && age > 40) {

        // =========================
        // Father section
        // =========================
        $('h4').filter(function () {
            return $.trim($(this).text()) === 'Details of Father of Applicant';
        }).closest('div.table_cont').each(function () {

            // Remove required except Father's Name
            $(this).find(':input[required]').each(function () {

                if ($(this).attr('id') !== '339491') {
                    $(this).removeAttr('required');
                }

            });

            // Remove * except Father's Name
            $(this).find('span.mandatory').each(function () {

                if ($(this).closest('label').attr('for') !== '339491') {
                    $(this).remove();
                }

            });

            // Remove validation messages
            $(this).find('label.error').each(function () {

                if ($(this).attr('for') !== '339491') {
                    $(this).remove();
                }

            });

        });


        // =========================
        // Mother section
        // =========================
        $('h4').filter(function () {
            return $.trim($(this).text()) === 'Details of Mother of Applicant';
        }).closest('div.table_cont').each(function () {

            // Remove required except Mother's Name
            $(this).find(':input[required]').each(function () {

                if ($(this).attr('id') !== '339497') {
                    $(this).removeAttr('required');
                }

            });

            // Remove * except Mother's Name
            $(this).find('span.mandatory').each(function () {

                if ($(this).closest('label').attr('for') !== '339497') {
                    $(this).remove();
                }

            });

            // Remove validation messages
            $(this).find('label.error').each(function () {

                if ($(this).attr('for') !== '339497') {
                    $(this).remove();
                }

            });

        });

    }


    // ========================================================
    // AGE 40 OR BELOW
    // RESTORE ORIGINAL STATE
    // ========================================================
    else {

        // =========================
        // Father section
        // =========================
        $('h4').filter(function () {
            return $.trim($(this).text()) === 'Details of Father of Applicant';
        }).closest('div.table_cont').each(function () {

            $(this).find(':input').each(function () {

                if ($(this).attr('id') !== '343057' ) {
                    $(this).attr('required', 'true');
                }

            });

            $(this).find('label.lbl').each(function () {

                var fieldId = $(this).attr('for');

                if (fieldId && fieldId !== '339491' && fieldId !== '343057') {

                    if ($(this).find('span.mandatory').length === 0) {
                        $(this).append(' <span class="mandatory">*</span>');
                    }

                }

            });

        });


        // =========================
        // Mother section
        // =========================
        $('h4').filter(function () {
            return $.trim($(this).text()) === 'Details of Mother of Applicant';
        }).closest('div.table_cont').each(function () {

            $(this).find(':input').each(function () {

                if ($(this).attr('id') !== '343082') {
                    $(this).attr('required', 'true');
                }

            });

            $(this).find('label.lbl').each(function () {

                var fieldId = $(this).attr('for');

                if (fieldId && fieldId !== '339497' && fieldId !== '343082') {

                    if ($(this).find('span.mandatory').length === 0) {
                        $(this).append(' <span class="mandatory">*</span>');
                    }

                }

            });

        });

    }
}


// ========================================================
// DOB DATEPICKER
// ========================================================

$('#339162').datepicker({

    dateFormat: 'dd/mm/yy',

    onSelect: function (dateText) {

        // Make sure selected DOB is in the input
        $('#339162').val(dateText);

        // Run immediately after date selection
        applyParentFieldLogic();

    }

});


// ========================================================
// Also handle manual changes
// ========================================================

$('#339162').on('change', function () {
    applyParentFieldLogic();
});


// ========================================================
// Run on page load
// ========================================================

applyParentFieldLogic();
 

//=============================
// address copy on past 5 years
//============================= 
 
 $(document).ready(function () {

    function updateCombinedField() {

        var values = [
            $('#341662').val(),
            $('#341663').val(),
            $('#341664').val(),
            $('#341749').val(),
            $('#341674').val()
        ];

        // Add comma after each field and ignore empty values
        var result = values
            .map(function (value) {
                return (value || '').trim();
            })
            .filter(function (value) {
                return value !== '';
            })
            .join(', ');

        $('#339280_0').val(result);
    }

    // Update whenever any of the source fields changes
    $(document).on(
        'input change keyup',
        '#341662, #341663, #341664, #341749, #341674',
        updateCombinedField
    );

    // Initial update
    updateCombinedField();

}); 
 
 //=============================
 // hide the puducherry village 
 //============================= 
 $(document).ready(function () {
    $('#339134 option[value="2816916"]').hide();
});
 //===============================================
 // on submit clear  
 //================================================ 

$('#submit_btn').on('click', function () {

    //==============================
    //central serial no and resoultion
    //==============================
      $('#343182').val('');
      $('#343184').val('');

    // -------------------------------
    // Address for Past Five Years
    // Clear when neither Residence nor Nativity is checked
    // (matches the show/hide condition in updateVisibility)
    // -------------------------------
    var residenceChecked = $('#339504_1').is(':checked');
    var nativityChecked = $('#339504_2').is(':checked');

    if (!residenceChecked && !nativityChecked) {
        $('textarea[name^="339280_"]').val('');
        $('input[name^="339281_"]').val('');
        $('input[name^="339282_"]').val('');
        $('input[name^="339283_"]').val('');
        $('input[name^="344535_"]').val('');
    }

    if (!nativityChecked) {
        $('#342361_1').prop('checked', false);
        $('input[name^="341709"]').val('');
        $('input[name^="341710"]').val('');
        $('input[name^="341711"]').val('');
        $('input[name^="341868"]').val('');
        $('input[name^="341714"]').val('');
    }

    // -------------------------------
    // Question 341694 = NO
    // -------------------------------
    if ($('input[name="341694"]:checked').val() === '2') {
        $('#343178').val('');
        $('#343179').val('');
        $('#341873_1').prop('checked', false);
    }

    // -------------------------------
    // Check EWS and Income
    // -------------------------------
    var ews = $('#339504_4').is(':checked');
    var income = $('#339504_3').is(':checked');

    // -------------------------------
    // Check caste certificates
    // -------------------------------
    var casteEducational = $('#339504_5').is(':checked');
    var casteEmployment = $('#339504_6').is(':checked');
    var casteCentral = $('#339504_7').is(':checked');
    var centralCasteOBC = isCentralCasteSelectedfn() && iscentralCasteOBC();
    var stateCasteOBC = isStateCasteSelectedfn() && isstateCasteOBC();

    // -------------------------------
    // caste certificates UNCHECKED
    // -------------------------------
    if(!casteEducational || !casteEmployment || !casteCentral) {
      $('#341873_1').prop('checked', false);
    }

    // -------------------------------
    // EWS UNCHECKED
    // -------------------------------
    if (!ews) {

        // Clear Asset Details
        $('input[name^="344523_"]').val('');
        $('input[name^="344524_"]').val('');
        $('input[name^="344525_"]').val('');
        $('input[name^="344526_"]').val('');
        $('input[name^="344527_"]').val('');


        // -------------------------------
        // Income UNCHECKED
        // Only clear Income Details when
        // EWS is ALSO unchecked
        // -------------------------------
        if (!income && !centralCasteOBC && !stateCasteOBC) {

            $('input[name^="340979_"]').val('');
            $('select[name^="340980_"]').val('');
            $('input[name^="340981_"]').val('');
            $('select[name^="341708_"]').val('');

            // Total Annual Income
            $('#339476').val('');
        }
    }

});  

//====================================
//central caste hide m/f category hide 
//=====================================
jQuery(document).ready(function($) {
    function toggleFamilyCategory() {
        var casteCentral = $('#339504_7').is(':checked');
        var casteEducational = $('#339504_5').is(':checked');
        var casteEmployment = $('#339504_6').is(':checked');
        $('#343311, #343320').closest('.tdata').toggle(
            !(casteCentral && !casteEducational && !casteEmployment)
        );
    }
    toggleFamilyCategory();
    $(document).on('change click', '#339504_5, #339504_6, #339504_7', toggleFamilyCategory);
});
//===============================
//btn color 
//===============================
$(document).ready(function () {

    $('#342395, #344733').css({
        'background-color': '#00a65a',
        'color': '#ffffff',
        'border': 'none',
        'padding': '10px 22px',
        'font-size': '14px',
        'font-weight': '600',
        'font-family': 'Arial, sans-serif',
        'border-radius': '4px',
        'cursor': 'pointer',
        'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.15)',
        'transition': 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease'
    });

    // Keep green background with !important
    $('#342395, #344733').each(function () {
        this.style.setProperty(
            'background-color',
            '#00a65a',
            'important'
        );
    });

    // Hover effect
    $('#342395, #344733').hover(
        function () {
            this.style.setProperty(
                'background-color',
                '#008d4c',
                'important'
            );

            $(this).css({
                'box-shadow': '0 3px 6px rgba(0, 0, 0, 0.20)'
            });
        },
        function () {
            this.style.setProperty(
                'background-color',
                '#00a65a',
                'important'
            );

            $(this).css({
                'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.15)'
            });
        }
    );

    // Click effect
    $('#342395, #344733').on('mousedown', function () {
        $(this).css({
            'transform': 'translateY(1px)',
            'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.15)'
        });
    });

    $('#342395, #344733').on('mouseup mouseleave', function () {
        $(this).css({
            'transform': 'translateY(0)',
            'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.15)'
        });
    });

});
//=======================================
// Central Category Cut-off Date Label
// Run only if State Caste is empty
//=======================================
$(document).ready(function () {

    function updateCentralResidentLabel() {

        // Check State Caste first
        var stateCaste = $('#343176').length
            ? ($('#343176').val() || '').trim()
            : '';

        // If State Caste has a value, stop Central logic
        if (stateCaste !== '') {
            return;
        }

        // Central Category
        var category = ($('#343250').val() || '')
            .trim()
            .toUpperCase();

        // Central Caste
        var caste = ($('#343181').val() || '')
            .trim()
            .toUpperCase();

        var dateText = "19th February 2001";

        if (category === 'SC') {

            if (caste === 'PUTHIRAI VANNAN') {
                dateText = "17th December 2002";
            } else {
                dateText = "5th March 1964";
            }

        } else if (category === 'ST') {

            dateText = "22nd December 2016";
        }


        // Find label by its text instead of ID
       // $('label').filter(function () {
         //   return $(this).text().trim().startsWith(
         //       'Whether the candidate or his/her father or paternal grandfather'
          //  );
      //  }).html(
       //     'Whether the candidate or his/her father or paternal grandfather was continuously residing in the UT of Puducherry prior to <b>' +
        //    dateText +
       //     '</b>'
       // );
    // Set dateText into input field
        $('#345778').val(dateText).prop('disabled', true);
    }

    // Run when Central values change
    $(document).on(
        'change keyup input',
        '#343250, #343181',
        updateCentralResidentLabel
    );

    // Initial call
    updateCentralResidentLabel();

});

//==========================
// toggle Spouse Organisation
//==========================
$(document).ready(function () {

    function toggleSpouseOrganisation() {
        var occupation = $('#343092').val();

        if (occupation === '1') {
            // Employed → Show Organisation
            $('#344536').closest('.tdata').show();
        } else {
            // UnEmployed or no selection → Hide Organisation
            $('#344536').closest('.tdata').hide();

            // Clear Organisation value when hidden
            $('#344536').val('');
        }
    }

    // Run when Spouse's Occupation changes
    $('#343092').on('change', function () {
        toggleSpouseOrganisation();
    });

    // Run on page load
    toggleSpouseOrganisation();

});

//================================
// spouse other caste
//================================
$(document).ready(function () {

    function toggleSpouseOthersField() {
        var casteValue = ($('#343325').val() || '')
            .trim()
            .toLowerCase();

        if (casteValue === 'others' || casteValue === 'other') {
            $('#345381').closest('.tdata').show();
        } else {
            $('#345381').closest('.tdata').hide();
            $('#345381').val('');
        }
    }

    // Run on page load
    toggleSpouseOthersField();

    // Detect caste value changes
    $(document).on(
        'input change blur keyup',
        '#343325',
        toggleSpouseOthersField
    );

});

//=============================
// mother other catse 
//=============================
$(document).ready(function () {

    function toggleMotherOthersField() {
        var casteValue = ($('#343319').val() || '')
            .trim()
            .toLowerCase();

        if (casteValue === 'others' || casteValue === 'other') {
            $('#345362').closest('.tdata').show();
        } else {
            $('#345362').closest('.tdata').hide();
            $('#345362').val('');
        }
    }

    // Run on page load
    toggleMotherOthersField();

    // Check when Mother's Caste changes
    $(document).on(
        'input change blur keyup',
        '#343319',
        toggleMotherOthersField
    );

});

//=============================
// father other catse 
//=============================
$(document).ready(function () {

    // Function to show/hide "If Others Please Specify"
    function toggleOthersField() {
        var casteValue = $('#343310').val().trim().toLowerCase();

        if (casteValue === 'others' || casteValue === 'other') {
            $('#345361').closest('.tdata').show();
        } else {
            $('#345361').closest('.tdata').hide();
            $('#345361').val(''); // Clear value when hidden
        }
    }

    // Run on page load
    toggleOthersField();

    // Check whenever caste value changes
    $(document).on('input change blur', '#343310', function () {
        toggleOthersField();
    });

});


//============================
// label update for application type
//============================
$(document).ready(function () {

    $('label[for="342397"]').contents()
        .filter(function () {
            return this.nodeType === 3;
        })
        .first()
        .replaceWith('Have you Already Applied on this Portal ? ');

    $('#344733').val('Click to View Instructions ');

});

//============================
// uppercase
//============================
$(document).on(
    'input',
    '#341662, #341663, #341664, #341749, ' +
    '#341669, #341670, #341671, #341750',
    function () {
        this.value = this.value.toUpperCase();
    }
);
$(document).on(
    'input',
    '#341662, #341663, #341664, #341749, ' +
    '#341669, #341670, #341671, #341750, ' +
    '#341677, #341678, #341679, #341751, ' +
    '#341698, #341703, #341700, ' +
    '#341704, #341705,#341697, #341706, #341707',
    function () {
        this.value = this.value.toUpperCase();
    }
);

//============================
// hide and show the sch name
//============================
$(document).ready(function () {

    function toggleSchoolName() {
        var $schoolNameRow = $('#345461').closest('.tdata').parent();

        if ($('#345342_2').is(':checked')) {
            $schoolNameRow.show();
            $('#345461').prop('required', true);
        } else {
            $schoolNameRow.hide();
            $('#345461')
                .val('')
                .prop('required', false);
        }
    }

    // When Application Submitted By changes
    $(document).on('change', 'input[name="345342"]', toggleSchoolName);

    // Initial page load
    toggleSchoolName();

});


// ----------------------------------------------------------------------
// Function to handle Organisation dropdown and show/hide text fields
//-----------------------------------------------------------------------

// Function to toggle text field for a specific dropdown
function toggleTextFieldForOrganisation(dropdownId, textFieldId, containerId) {
    var dropdown = document.getElementById(dropdownId);
    var textField = document.getElementById(textFieldId);
    var container = textField ? textField.closest('.tdata') : null;
    
    if (!dropdown || !textField) return;
    
    if (dropdown.value === "12") { // "Others" selected
        if (container) {
            container.style.display = "block";
        }
        setTimeout(function() {
            textField.focus();
        }, 100);
    } else {
        if (container) {
            container.style.display = "none";
        }
        textField.value = ""; // Clear the value
    }
}

// Hide both containers initially
var fatherContainer = document.getElementById("344532") ? document.getElementById("344532").closest('.tdata') : null;
var motherContainer = document.getElementById("344534") ? document.getElementById("344534").closest('.tdata') : null;

if (fatherContainer) fatherContainer.style.display = "none";
if (motherContainer) motherContainer.style.display = "none";

var timeoutIdFather, timeoutIdMother;

// Father's Organisation
function toggleFatherTextField() {
    toggleTextFieldForOrganisation("343075", "344532");
}

document.getElementById("343075").addEventListener("change", function() {
    clearTimeout(timeoutIdFather);
    timeoutIdFather = setTimeout(toggleFatherTextField, 400);
});

// Mother's Organisation
function toggleMotherTextField() {
    toggleTextFieldForOrganisation("343076", "344534");
}

document.getElementById("343076").addEventListener("change", function() {
    clearTimeout(timeoutIdMother);
    timeoutIdMother = setTimeout(toggleMotherTextField, 400);
});

// Initial load
toggleFatherTextField();
toggleMotherTextField();


//=====================================
// MARITAL STATUS - SPOUSE NAME LOGIC
//=====================================
$(document).ready(function () {
    var $maritalStatus = $('#339245');
    var $spouseRow = $('#344707').closest('.trow');
    var $spouseMandatory = $spouseRow.find('.mandatory');

    // Function to toggle spouse name field
    function toggleSpouseField() {
        var maritalStatus = $maritalStatus.val();

        if (maritalStatus !== '2') { // UnMarried — confirm '2' is the correct value
            $spouseRow.show();
            $('#344707').prop('required', true);
            $spouseMandatory.show();
        } else {
            $spouseRow.hide();
            $('#344707').prop('required', false);
            $('#344707').val(''); // Clear value
            $spouseMandatory.hide();
        }
    }

    // Run on page load
    toggleSpouseField();

    // Run on marital status change
    $maritalStatus.on('change', function () {
        toggleSpouseField();
    });
});

//=============================
 // EWS Central description
 //=============================
    $('label.lbl[for="344727_1"]').html(`
        <input type="checkbox" tabindex="184" value="1" name="344727" id="344727_1" required="true" aria-required="true" style="margin: 5px;">
        I hereby declare that the information given by me in this application form and its self-attached enclosures is true to the best of knowledge and that the information furnished is exhaustive and I have not suppressed any fact. I declare that I do not belong to OBC(Central List). I further declare that there are no other immovable properties in other States/U.Ts except the one declared in the application. That, I am solely responsible for the accuracy of the declaration and information furnished and I am liable for action under section 199 and 200 of the Indian Penal Code in case of wrong declaration and information. I am aware of the fact that the certificate shall be summarily cancelled and all benefits availed by me shall summarily withdrawn in case of wrong declaration and information.
    `);
//=====================================
// Find the label and replace its content
//=====================================
    $('label.lbl[for="344728_1"]').html(`
        <input type="checkbox" tabindex="185" value="1" name="344728" id="344728_1" required="true" aria-required="true" style="margin: 5px;">
        I certify that the above said particulars are true to the best of my knowledge and belief and that I do not belong to the Creamy Layer of OBCs and am eligible to be considered for posts reserved for OBCs. In the event of any information being found false or incorrect, or ineligibility being detected before or after the selection, I understand that my candidature/appointment is liable to be cancelled.
    `);
 
 
//=====================================
// POP UP INSTRUCTIONS WITH ACCORDION DRAWERS (Only one open at a time)
//=====================================

$(document).ready(function () {

    function showInstructionsPopup() {

        // Remove existing popup
        $('.alert-box').remove();

        var $alertBox = $('<div class="alert-box"></div>');

        // Close icon
        var $closeIcon = $('<span class="close-icon">&times;</span>');
        $alertBox.append($closeIcon);

        // =====================================
        // GET CATEGORY AND CASTE
        // =====================================

        var category = $('#343177').val()
            ? $('#343177').val().trim().toUpperCase()
            : '';

        var caste = $('#343176').val()
            ? $('#343176').val().trim().toUpperCase()
            : '';

        // =====================================
        // DETERMINE CUT-OFF DATE
        // =====================================

        var dateText = '';

        if (category === 'SC') {
            if (caste === 'PUTHIRAI VANNAN') {
                dateText = '17th December 2002';
            } else {
                dateText = '5th March 1964';
            }
        } else if (category === 'ST') {
            dateText = '22nd December 2016';
        }

        // =====================================
        // CATEGORY DOCUMENT INSTRUCTION
        // =====================================

        var categoryDocumentInstruction = '';

        if (category === 'SC' || category === 'ST') {
            categoryDocumentInstruction = `
                <li>
                    If the applicant belongs to <strong>${category}</strong>
                    ${caste ? 'and caste is <strong>' + caste + '</strong>' : ''}
                    and the applicant or his/her family members had resided
                    before the cut-off date of
                    <strong>${dateText}</strong>, the applicant shall upload
                    the required supporting documents as proof.
                </li>
            `;
        }

        // =====================================
        // BUILD DRAWER HTML
        // =====================================

        var instructions = `
            <div class="instruction-content">

                <!-- Helpdesk Info -->
                <p style="
                    text-align:center;
                    font-size:14px;
                    color:#333;
                    margin:0 0 15px 0;
                    padding-bottom:10px;
                    border-bottom:1px solid #ddd;
                ">
                    <strong>Helpdesk / Support:</strong> 0413-2299543
                    &nbsp;|&nbsp;
                    <strong>Email:</strong>
                    <a href="mailto:helpdesk.revenue.py@gmail.com" style="color:#1e5aa8;">helpdesk.revenue.py@gmail.com</a>
                </p>

                <!-- =====================================
                     DRAWER 1: IMPORTANT INSTRUCTIONS
                ====================================== -->
                <div class="drawer-container">
                    <div class="drawer-header" data-target="drawer-1">
                        <span class="drawer-icon">▶</span>
                        <span class="drawer-title">IMPORTANT INSTRUCTIONS FOR APPLICANTS</span>
                    </div>
                    <div class="drawer-body" id="drawer-1" style="display:none;">
                        <ol style="padding-left:25px;margin:10px 0;">
                            <li>While entering the name of the candidate, type the spelling as per the Birth Certificate or 10th/12th Mark Sheet.</li>
                            <li>Even if the candidate is female and married, her parents' details should be mentioned.</li>
                            <li>In case the applicant is female and married, her husband's name should be mentioned in the relation name field rather than her father's name.</li>
                            <li>In case the applicant is female and deserted, she may apply using her father's or husband's name in the relation field.</li>
                            <li>
                                The employment status of both father and mother should be mentioned correctly in the below fields:
                                <ul style="padding-left:25px;margin-top:8px;">
                                    <li>Service (Central or State)</li>
                                    <li>Designation</li>
                                    <li>Scale of pay including classification, if any</li>
                                    <li>Date of appointment in the post</li>
                                    <li>Gross salary</li>
                                    <li>Age at the time of promotion to the Class-I post, if applicable. Whether they belong to Group-A, B or C in the present position as well as initial appointment should be mentioned.</li>
                                </ul>
                            </li>
                            <li>The candidate has to submit the details of their parents' status in C-option if their parents are working in the Public Sector, such as Banks, Insurance and other PSUs.</li>
                            <li>If the parents are working in the Armed Forces including Para-military Forces, their Designation and Scale of Pay must be entered under D-option.</li>
                            <li>If the parents are not covered under items B and C, i.e., persons engaged in professions such as Professor, Doctor, Lawyer, Chartered Accountant, Income Tax Consultant, Financial or Management Consultant, Dental Surgeon, Engineer, Architect, Computer Specialist, Film Artist, other Film Professional, Author, Playwright, Sportsperson, Sports Professional, Media Professional or any other vocation of similar status, and those engaged in trade, business, industries and daily wages, their occupation shall be mentioned under Option-E.</li>
                            <li>
                                In Option-F(I), the applicant has to provide the details of agricultural land owned by his/her father, mother and minor children, such as:
                                <ul style="padding-left:25px;margin-top:8px;">
                                    <li>Location</li>
                                    <li>Size of holding</li>
                                    <li>Irrigated / Un-irrigated</li>
                                    <li>Percentage of irrigated land holding to the statutory ceiling limit under State Land Ceiling Laws</li>
                                    <li>If land holding is both irrigated and un-irrigated, total irrigated land holding based on the conversion formula under State Land Ceiling Laws</li>
                                    <li>Percentage of total irrigated land holding to the statutory ceiling limit</li>
                                </ul>
                            </li>
                            <li>
                                In Option-F(II), the applicant has to provide details of:
                                <ul style="padding-left:25px;margin-top:8px;">
                                    <li>Crops / Fruit</li>
                                    <li>Location of the plantation</li>
                                    <li>Area of the plantation owned by their parents</li>
                                </ul>
                            </li>
                            <li>
                                In Option-F(III), the applicant has to provide vacant land/building details such as:
                                <ul style="padding-left:25px;margin-top:8px;">
                                    <li>Location of the property</li>
                                    <li>Details of the property</li>
                                    <li>Use – Residential / Commercial</li>
                                </ul>
                            </li>
                            <li>In Option-G(I), the applicant has to provide the Annual Family Income from all sources, excluding salaries and income from agricultural land.</li>
                        </ol>
                    </div>
                </div>

                <!-- =====================================
                     DRAWER 2: RESIDENCE CERTIFICATE
                ====================================== -->
                <div class="drawer-container">
                    <div class="drawer-header" data-target="drawer-2">
                        <span class="drawer-icon">▶</span>
                        <span class="drawer-title">Documents Required for Residence Certificate</span>
                    </div>
                    <div class="drawer-body" id="drawer-2" style="display:none;">
                        <ul style="padding-left:25px;margin:10px 0;">
                            <li>Ration Card – Address Page and Name Page</li>
                            <li>Voter ID – Front and Back Page of Family Members</li>
                            <li>Aadhaar Card of Family Members</li>
                            <li>Rental Agreement – In case the applicant is residing in a rental house</li>
                            <li>Previous Residence Certificate</li>
                            <li>
                                If the applicant is a student and applying for study purpose or employment purpose, he/she shall provide:
                                <ul style="padding-left:25px;margin-top:8px;">
                                    <li>Applicant's Birth Certificate</li>
                                    <li>Applicant's Father's Birth Certificate</li>
                                    <li>Transfer Certificate / Study Certificate of the applicant</li>
                                    <li>If required – LPG Book / LIC Policy / Passport / Telephone Bill / Tax Bill</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- =====================================
                     DRAWER 3: COMMUNITY CERTIFICATE
                ====================================== -->
                <div class="drawer-container">
                    <div class="drawer-header" data-target="drawer-3">
                        <span class="drawer-icon">▶</span>
                        <span class="drawer-title">Documents Required for Community Certificate</span>
                    </div>
                    <div class="drawer-body" id="drawer-3" style="display:none;">
                        <ul style="padding-left:25px;margin:10px 0;">
                            <li>Ration Card – Address Page and Name Page</li>
                            <li>Voter ID – Front and Back Page of Family Members</li>
                            <li>Aadhaar Card of Family Members</li>
                            <li>Rental Agreement – In case the applicant is residing in a rental house</li>
                            <li>
                                If the applicant is a student and applying for study purpose or employment purpose, he/she shall provide:
                                <ul style="padding-left:25px;margin-top:8px;">
                                    <li>Applicant's Birth Certificate</li>
                                    <li>Applicant's Father's Birth Certificate</li>
                                    <li>Transfer Certificate / Study Certificate of the applicant and father</li>
                                    <li>If required – LPG Book / LIC Policy / Passport / Telephone Bill / Tax Bill</li>
                                </ul>
                            </li>
                            <li>
                                In case if the applicant belongs to MBC, EBC, BCM, OBC, BT and he/she or his/her family members had resided on the cut-off date (19.01.2001), then he/she should upload 2001 proof such as:
                                <ul style="padding-left:25px;margin-top:8px;">
                                    <li>Old voter id (issued during the year –1995/1996/1999/2001/2002)</li>
                                    <li>Father T/C or study certificate.</li>
                                </ul>
                            </li>
                            <li>
                                In case if the applicant belongs to SC and he/she or his/her family members had resided on the cut-off date (06.03.1964), then he/she should upload 1964 proof such as:
                                <ul style="padding-left:25px;margin-top:8px;">
                                    <li>Birth certificate of the applicant's father, Grandfather, paternal uncle and any paternal side blood relation's birth certificate</li>
                                    <li>Ad-dravidar welfare card.</li>
                                </ul>
                            </li>
                            <li>In case if the applicant belongs to SC – Puthirai Vannan and he/she or his/her family members had resided on or before the cut-off date (17.12.2002), then he/she should upload the required supporting documents as proof of residence prior to the said cut-off date.</li>
                            <li>In case if the applicant belongs to ST and he/she or his/her family members had resided on or before the cut-off date (22.12.2016), then he/she should upload the required supporting documents as proof of residence prior to the said cut-off date.</li>
                            <li>In case if the applicant or his/her family members had resided after the cut-off date for their respective category, then he/she should upload the caste certificate which is issued by the state of origin.</li>
                            ${categoryDocumentInstruction}
                        </ul>
                    </div>
                </div>

                <!-- =====================================
                     DRAWER 4: INCOME CERTIFICATE
                ====================================== -->
                <div class="drawer-container">
                    <div class="drawer-header" data-target="drawer-4">
                        <span class="drawer-icon">▶</span>
                        <span class="drawer-title">Documents Required for Income Certificate</span>
                    </div>
                    <div class="drawer-body" id="drawer-4" style="display:none;">
                        <ul style="padding-left:25px;margin:10px 0;">
                            <li>Salary Slip(s), or</li>
                            <li>Income Tax Returns (ITR) for the previous 3 years</li>
                        </ul>
                    </div>
                </div>

                <!-- =====================================
                     DRAWER 5: EWS CERTIFICATE
                ====================================== -->
                <div class="drawer-container">
                    <div class="drawer-header" data-target="drawer-5">
                        <span class="drawer-icon">▶</span>
                        <span class="drawer-title">Documents Required for EWS Certificate</span>
                    </div>
                    <div class="drawer-body" id="drawer-5" style="display:none;">
                        <ul style="padding-left:25px;margin:10px 0;">
                            <li>Ration Card of the family members (Name page and Address page)</li>
                            <li>Aadhar card of the family members</li>
                            <li>Voter Id of the family members (Father and mother)</li>
                            <li>Birth certificate of the applicant</li>
                            <li>TC of the applicant and applicant's father</li>
                            <li>Salary slip/ Form-16/IR Returns of the applicant and his/her family members</li>
                            <li>If the applicant resides in own house and having any property then – Registered land document in the name of the applicant and his/her family Members</li>
                            <li>If the applicant is residing in rental house then - Rental Agreement</li>
                        </ul>
                    </div>
                </div>

                <p style="color:red;font-weight:bold;text-align:center;margin-top:20px;">
                    Please ensure that all the required information and supporting
                    documents are provided correctly before submitting the application.
                </p>

            </div>
        `;

        // Add instructions
        $alertBox.append(instructions);

        // OK Button
        var $okButton = $('<button class="ok-button">OK</button>');
        $alertBox.append($okButton);

        // Add popup to body
        $('body').append($alertBox);

        // =====================================
        // ACCORDION TOGGLE - Only one open at a time
        // =====================================

        $('.drawer-header').on('click', function() {
            var targetId = $(this).data('target');
            var $body = $('#' + targetId);
            var $icon = $(this).find('.drawer-icon');
            var isCurrentlyOpen = $body.is(':visible');
            
            // First, close all drawers
            $('.drawer-body').slideUp(300);
            $('.drawer-icon').text('▶');
            $('.drawer-header').removeClass('active');
            
            // If the clicked drawer was closed, open it
            if (!isCurrentlyOpen) {
                $body.slideDown(400);
                $icon.text('▼');
                $(this).addClass('active');
            }
            // If it was open, it stays closed (accordion behavior)
        });

        // =====================================
        // CLOSE ICON STYLE
        // =====================================

        $('.close-icon').css({
            'position': 'absolute',
            'top': '10px',
            'right': '15px',
            'font-size': '30px',
            'font-weight': 'bold',
            'color': '#1e5aa8',
            'cursor': 'pointer',
            'line-height': '1',
            'transition': 'color 0.3s ease',
            'z-index': '10000'
        });

        $('.close-icon').hover(
            function () { $(this).css('color', '#ff0000'); },
            function () { $(this).css('color', '#1e5aa8'); }
        );

        $('.close-icon').click(function () {
            $alertBox.remove();
        });

        // =====================================
        // DRAWER STYLES
        // =====================================

        $('.drawer-container').css({
            'margin-bottom': '8px',
            'border': '1px solid #e0e0e0',
            'border-radius': '6px',
            'overflow': 'hidden'
        });

        $('.drawer-header').css({
            'background': '#1e5aa8',
            'color': '#fff',
            'padding': '12px 18px',
            'cursor': 'pointer',
            'display': 'flex',
            'align-items': 'center',
            'gap': '10px',
            'font-size': '15px',
            'font-weight': 'bold',
            'transition': 'background 0.3s ease',
            'user-select': 'none'
        });

        $('.drawer-header:hover').css({
            'background': '#164a8a'
        });

        $('.drawer-icon').css({
            'font-size': '14px',
            'transition': 'transform 0.3s ease',
            'display': 'inline-block'
        });

        $('.drawer-title').css({
            'flex': '1'
        });

        $('.drawer-body').css({
            'padding': '15px 20px',
            'background': '#f8f9fa',
            'border-top': '1px solid #e0e0e0'
        });

        $('.drawer-body ul, .drawer-body ol').css({
            'padding-left': '25px',
            'margin': '10px 0'
        });

        $('.drawer-body li').css({
            'margin-bottom': '6px',
            'line-height': '1.6',
            'font-size': '18px',
            'color': '#333'
        });

        // =====================================
        // POPUP STYLE
        // =====================================

        $('.alert-box').css({
            'background': '#fff',
            'border': '3px solid #1e5aa8',
            'padding': '20px',
            'border-radius': '10px',
            'width': '90%',
            'max-width': '900px',
            'max-height': '85vh',
            'overflow-y': 'auto',
            'box-shadow': '0 0 20px rgba(0,0,0,0.3)',
            'position': 'fixed',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'z-index': '9999',
            'font-family': 'Segoe UI, Arial, sans-serif'
        });

        $('.alert-box h2').css({
            'text-align': 'center',
            'color': '#1e5aa8',
            'margin-bottom': '15px'
        });

        $('.alert-box h3').css({
            'color': '#1e5aa8',
            'border-bottom': '1px solid #ddd',
            'padding-bottom': '5px',
            'margin-top': '25px'
        });

        // =====================================
        // OK BUTTON STYLE
        // =====================================

        $('.ok-button').css({
            'display': 'block',
            'margin': '20px auto 0',
            'padding': '10px 30px',
            'background': '#1e5aa8',
            'color': '#fff',
            'border': 'none',
            'border-radius': '5px',
            'cursor': 'pointer',
            'font-size': '16px'
        });

        $('.ok-button').click(function () {
            $alertBox.remove();
        });

        // =====================================
        // KEYBOARD SHORTCUT - ESC TO CLOSE
        // =====================================

        $(document).keydown(function(e) {
            if (e.key === 'Escape') {
                $alertBox.remove();
            }
        });

    }

    // =====================================
    // SHOW POPUP ON PAGE LOAD
    // =====================================

    showInstructionsPopup();

    // =====================================
    // SHOW POPUP ON BUTTON CLICK
    // =====================================

    $('#344733').on('click', function () {
        showInstructionsPopup();
    });

});
// ============================================
// EWS: Caste (General) = OTHERS toggle
// ============================================
function initGeneralCasteOthersToggle() {
    var $otherStatesRow = $('#344530').closest('.trow');
    var $othersSpecifyRow = $('#343191').closest('.trow');
    var $categoryGeneralRow = $('#343190').closest('.trow');
    
    function apply() {
        var isOthers = $.trim($('#343189').val()).toUpperCase() === 'OTHERS';

        if (isOthers) {
            $('#343207_1').prop('checked', true); // Yes

            $otherStatesRow.show();
            $othersSpecifyRow.show();

            $categoryGeneralRow.hide();
            $('#343190').val('');
        } else {
            $('#343207_1, #343207_2').prop('checked', false);

            $otherStatesRow.hide();
            $('#344530').val('');

            $othersSpecifyRow.hide();
            $('#343191').val('');

            $categoryGeneralRow.show();
        }
    }

    // #343190 (Category General) is set/cleared by the caste widget on
    // every real selection or clear of #343189, same reasoning as the
    // Central Caste field earlier.
    $(document).on('change', '#343190, #343189', apply);

    apply();
}

$(document).ready(function () {
    initGeneralCasteOthersToggle();
});

// ============================================
// Show "Other States" / "If Others caste Please specify"
// only when Caste (Central) = OTHERS
// ============================================
function initOthersCasteFields() {
    var $otherStatesRow = $('#344529').closest('.trow');
    var $othersSpecifyRow = $('#344552').closest('.trow');
  var $categoryGeneralField = $('#343250').closest('.trow');
    
    function apply() {
        var isOthers = $.trim($('#343181').val()).toUpperCase() === 'OTHERS';

        if (isOthers) {
                // $categoryGeneralField.hide();
            $('#344529').val('');

            $otherStatesRow.show();
            $othersSpecifyRow.show();
             
        } else {

            $otherStatesRow.hide();
            $('#344529').val('');
            
            $othersSpecifyRow.hide();
            $('#344552').val('');

            //  $categoryGeneralField.show();
        }
    }

    // #343184 (Central Resolution) is set/cleared by the caste widget on
    // every real selection or clear of #343181, so it's a reliable trigger
    // even when the caste field's own change/blur doesn't fire (e.g. picking
    // an item from the dropdown list).
    $(document).on('change', '#343184, #343181', apply);

    apply();
}

$(document).ready(function () {
    initOthersCasteFields();
});

// ============================================
// Auto-answer residency question based on State of Origin selection
// (#344529 / #344530)
// - Any state selected in either field → "Continuously residing in
//   Puducherry" = No, and that question is hidden (already answered
//   by inference); Caste/Community certificate question = Yes
// - Neither field has a state selected → residency question is shown
//   again, and both auto-set answers are cleared back to unanswered
//
// Uses delegated events so this still works even if #344529/#344530
// get replaced later (e.g. converted from <input> to <select> by
// another script that runs after this one).
// ============================================
function initStateOfOriginResidencyTrigger() {

    function isAnyStateSelected() {
        return $.trim($('#343181').val()).toUpperCase() === 'OTHERS';
    }

    function apply(isInitialLoad) {
        var $residingRow = $('#341694_1').closest('.trow');

        if (isAnyStateSelected()) {
            $('#341694_2').prop('checked', true).trigger('change'); // No
            $residingRow.hide();
            $('#341696_1').prop('checked', true).trigger('change'); // Yes
        } else {
            $residingRow.show();

            if (!isInitialLoad) {
                // Only reset when the user actively changes AWAY from OTHERS —
                // never on page load, or we wipe out saved/edit values.
            $('input[name="341694"]').prop('checked', false);
            $('input[name="341696"]').prop('checked', false);
            }

            $('input[name="341696"]').trigger('change');
        }
    }

    $(document).on('change', '#343181', function () {
        apply(false);
    });

    apply(true); // initial load — don't touch existing checked state
}

$(document).ready(function () {
    initStateOfOriginResidencyTrigger();
});
 // ============================================
// Convert text inputs to State dropdowns
// (all Indian states, Puducherry excluded)
// ============================================
$(document).ready(function () {
    var INDIAN_STATES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    function convertToStateDropdown(fieldId) {
        var $oldInput = $("#" + fieldId);
        if (!$oldInput.length) return;

        var $select = $("<select>");

        $select.attr({
            id: fieldId,
            name: fieldId,
            tabindex: $oldInput.attr("tabindex"),
            "data-type": "select",
            "data-groupno": $oldInput.attr("data-groupno"),
            required: $oldInput.attr("required"),
            "aria-required": $oldInput.attr("aria-required")
        });
        $select.addClass($oldInput.attr("class"));

        $select.append($("<option>").val("").text("Please Select"));
        INDIAN_STATES.forEach(function (state) {
            $select.append($("<option>").val(state).text(state));
        });

        $oldInput.replaceWith($select);
    }

    ["344529", "344530"].forEach(convertToStateDropdown);
});

// ============================================
// SHARED HELPERS - MUST BE DEFINED FIRST
// ============================================
function showField(id) {
    $(id).closest(".trow").show().find(".lbl").show();
}

function hideField(id) {
    $(id).val("").closest(".trow").hide();
}

function showRows(ids) {
    ids.forEach(showField);
}

function hideRows(ids) {
    ids.forEach(hideField);
}

function getFieldsetByRowId(fieldsetId) {
    return $('input#fieldSetId[value="' + fieldsetId + '"]').closest(".column_5.fieldSet");
}

// ============================================
// Father/Mother Organisation dropdown — either 1-7 OR 8-12, based on Purpose & Certificate
// ============================================
var ORG_GROUP_A = ["1", "2", "3", "4", "5", "6", "7"];
var ORG_GROUP_B = ["8", "9", "10", "11", "12"];

// Purpose values
var PURPOSE_EDUCATION = "1";
var PURPOSE_EMPLOYMENT = "2";

// Certificate values
var CERT_CASTE_EMPLOYMENT = "6";   // State - Employment
var CERT_CASTE_CENTRAL = "7";      // Central

// Field keys, in the order every organisation-config object supplies them
var FIELD_KEYS = [
    "designation", "serviceType", "scalePay", "appointment", "grossSalary",
    "promotionAge", "organisationName", "periodFrom", "periodTo",
    "deathDate", "details", "profession"
];

// Rules for Group A organisation types (Constitutional/Govt/PSU/etc.)
var ORG_RULES = {
    "1": ["designation"],
    "2": ["designation", "serviceType", "scalePay", "appointment", "grossSalary", "promotionAge"],
    "3": ["designation", "organisationName", "periodFrom", "periodTo"],
    "4": ["deathDate", "details"],
    "5": ["designation", "organisationName", "appointment"],
    "6": ["designation", "scalePay"],
    "7": ["profession"]
};

// Rules for Group B (educational institution types) — all identical, built from the group list
var EDUCATION_ORG_FIELDS = ["designation", "organisationName", "periodFrom", "periodTo"];
var ORG_RULES_EDUCATION = ORG_GROUP_B.reduce(function(acc, id) {
    acc[id] = EDUCATION_ORG_FIELDS;
    return acc;
}, {});

// Single combined lookup so toggleOrganisation doesn't need to branch on group
var ALL_ORG_RULES = Object.assign({}, ORG_RULES, ORG_RULES_EDUCATION);

var ORGANISATION_LABELS = {
    "1": "Constitutional Posts",
    "2": "Government Services",
    "3": "International Organisation (UNO, UNICEF, WHO, etc.)",
    "4": "Death / Permanent Incapacitation (omit if not applicable)",
    "5": "Public Sector Undertaking (PSU) Employment",
    "6": "Armed Forces / Para-Military (Excluding Civil Posts)",
    "7": "Professional / Trade / Business / Industry (Excluding Govt. & PSU)",
    "8": "PSU Bank",
    "9": "Quesi Government",
    "10": "Private",
    "11": "Government",
    "12": "Others"
};

function getOrganisationLabel(value) {
    return ORGANISATION_LABELS[value] || "Option " + value;
}

// ============================================
// Helper Functions for Organisation
// ============================================
function getCheckedCertificates() {
    return $('input[name="339504"]:checked').map(function() {
        return $(this).val();
    }).get();
}

function isCentralCategorySCorST() {
    var centralCategory = $.trim($("#343250").val()).toUpperCase();
    return centralCategory === "SC" || centralCategory === "ST";
}

function isStateCategorySCorST() {
    var stateCategory = $.trim($("#343177").val()).toUpperCase();
    return stateCategory === "SC" || stateCategory === "ST";
}

// NOTE ON THIS SIMPLIFICATION:
// The original had a long if/else chain per purpose, but tracing every branch shows:
//  - Education purpose: every branch resolves to Group B *except* "central caste
//    selected and not SC/ST", which resolves to Group A. So it collapses to one check.
//  - Employment purpose: the only branches that resolve to Group A are
//    "state employment selected and not SC/ST" and "central caste selected and not SC/ST"
//    (the others are either redundant supersets of those or fall through to Group B).
//    So it collapses to an OR of those two checks.
// Please spot-check this against your existing test cases before relying on it —
// the logic is equivalent by inspection, but this is exactly the kind of business
// rule worth double-checking against real form scenarios.
function shouldShowGroupA() {
    var purpose = $("#342041").val();
    var checkedCerts = getCheckedCertificates();

    var isCentralCasteSelected = checkedCerts.indexOf(CERT_CASTE_CENTRAL) !== -1;
    var isStateEmploymentSelected = checkedCerts.indexOf(CERT_CASTE_EMPLOYMENT) !== -1;
    var isStateSCorST = isStateCategorySCorST();
    var isCentralSCorST = isCentralCategorySCorST();

    if (purpose === PURPOSE_EDUCATION) {
        return isCentralCasteSelected && !isCentralSCorST;
    }
    if (purpose === PURPOSE_EMPLOYMENT) {
        return (isStateEmploymentSelected && !isStateSCorST) ||
               (isCentralCasteSelected && !isCentralSCorST);
    }
    return false;
}

function updateSingleOrganisation(selector, useGroupA) {
    var $org = $(selector);
    if (!$org.length) return;

    var currentValue = $org.val();
    var options = useGroupA ? ORG_GROUP_A : ORG_GROUP_B;

    $org.empty().append($('<option>', { value: '', text: 'Please Select' }));

    options.forEach(function(value) {
        $org.append($('<option>', { value: value, text: getOrganisationLabel(value) }));
    });

    if (currentValue && options.indexOf(currentValue) !== -1) {
        $org.val(currentValue);
    } else {
        $org.val('').trigger('change');
    }
}

function updateOrganisationOptions() {
    var useGroupA = shouldShowGroupA();
    updateSingleOrganisation("#343075", useGroupA); // Father's Organisation
    updateSingleOrganisation("#343076", useGroupA); // Mother's Organisation
}

// ============================================
// Main Organisation Module
// ============================================
function initOrganisationModule(cfg) {
    var allFieldSelectors = FIELD_KEYS.map(function(key) { return cfg[key]; });

    function toggleOccupation() {
        var isEmployed = $(cfg.occupation).val() === "1";
        $(cfg.organisation).closest(".trow").toggle(isEmployed);
        if (!isEmployed) $(cfg.organisation).val("");

        updateOrganisationOptions();
        toggleOrganisation();
    }

    function toggleOrganisation() {
        hideRows(allFieldSelectors);

        if ($(cfg.organisation).closest(".trow").is(":hidden")) return;

        var selectedOrg = $(cfg.organisation).val();
        (ALL_ORG_RULES[selectedOrg] || []).forEach(function(key) {
            showField(cfg[key]);
        });
    }

    $(cfg.occupation).on("change", toggleOccupation);
    $(cfg.organisation).on("change", toggleOrganisation);
    toggleOccupation();
}

// Builds a per-parent config object from an occupation/organisation id pair
// plus an ordered array of field ids matching FIELD_KEYS.
function buildOrgConfig(occupationId, organisationId, fieldIds) {
    var cfg = { occupation: occupationId, organisation: organisationId };
    FIELD_KEYS.forEach(function(key, i) {
        cfg[key] = fieldIds[i];
    });
    return cfg;
}

var FATHER_FIELD_IDS = [
    "#343052", "#343053", "#343054", "#343055", "#343056", "#343057",
    "#343058", "#343059", "#343060", "#343069", "#343070", "#343071"
];

var MOTHER_FIELD_IDS = [
    "#343077", "#343078", "#343079", "#343080", "#343081", "#343082",
    "#343083", "#343084", "#343085", "#343086", "#343087", "#343088"
];

// ============================================
// Initialize everything
// ============================================
$(document).ready(function() {
    initOrganisationModule(buildOrgConfig("#339493", "#343075", FATHER_FIELD_IDS));
    initOrganisationModule(buildOrgConfig("#339500", "#343076", MOTHER_FIELD_IDS));

    // Recompute organisation options whenever an input feeding shouldShowGroupA() changes
    $("#342041, #343177, #343250, #343176, #343181").on("change", function() {
        setTimeout(updateOrganisationOptions, 100);
    });
    $('input[name="339504"]').on("change", function() {
        setTimeout(updateOrganisationOptions, 100);
    });

    setTimeout(updateOrganisationOptions, 300);
});

// Expose to console for debugging
window.refreshOrganisationOptions = updateOrganisationOptions;

// ============================================
// hide fields
// ============================================

$(document).ready(function() {
    // Hide the select elements
    $('#342374, #344440, #343208,#345294, #343178, #343179').hide();
  
    // Hide the labels for both fields
    $('label[for="342374"]').hide();
    $('label[for="344440"]').hide();
    $('label[for="343208"]').hide();
    $('label[for="345294"]').hide();
    $('label[for="343178"]').hide();
    $('label[for="343179"]').hide();
});

// ============================================
// asset details
// ============================================

var relations = {
    0: "Self",
    1: "Parent",
    2: "Siblings below 18 years",
    3: "Spouse",
    4: "Children below 18 years",
    5: "Total Family Asset Value"
};

$("[id^='344523_']").each(function () {

    var row = this.id.split("_")[1];

    if (relations[row]) {
        $(this).val(relations[row]);
    }

    $(this).prop("readonly", true).css({
             "background-color": "#36578a",
             "color": "white",
             "cursor": "not-allowed"
         });

});
// ============================================
// total value calculate
// ============================================
function calculateAssetTotals() {

    var fieldPrefixes = [
        "344524", // Agricultural Land
        "344525", // Residential Flat
        "344526", // Residential Plot in Notified Municipal Areas
        "344527"  // Residential Plot in Areas Other Than Notified Municipalities
    ];

    $.each(fieldPrefixes, function (_, prefix) {

        var total = 0;

        // Sum rows 0 to 4
        for (var i = 0; i < 5; i++) {
            var value = parseFloat($("#" + prefix + "_" + i).val()) || 0;
            total += value;
        }

        // Set total in row 5
        $("#" + prefix + "_5")
            .val(total)
            .prop("disabled", true);

    });

}

// Recalculate when an EWS asset value changes
$(document).on("input", "[id^='344524_'], [id^='344525_'], [id^='344526_'], [id^='344527_']", function () {
    calculateAssetTotals();
});

// Initial calculation
calculateAssetTotals();

// ============================================
// asset placeholder
// ============================================

// Agricultural Land
$("[id^='344524_']").attr("placeholder", "Enter area in acres (e.g., 2.50)");

// Residential Flat
$("[id^='344525_']").attr("placeholder", "Enter area in sq.ft (e.g., 1200)");

// Residential Plot in Notified Municipal Areas
$("[id^='344526_']").attr("placeholder", "Enter area in sq.yd (e.g., 150)");

// Residential Plot in Areas Other Than Notified Municipalities
$("[id^='344527_']").attr("placeholder", "Enter area in sq.yd (e.g., 200)");

// ============================================
// EWS Details - Others toggle
// ============================================
$(document).ready(function() {
    function toggleEWSOthersFields() {
        var isYes = $('#343207_1').is(':checked');
        
        if (isYes) {
            // Yes - Show "Others Please specify", Hide General fields
            $("#343191").closest('.trow').show();
            $("#343208").closest('.trow').hide();  // General Religion
            $("#343189").closest('.trow').hide();  // General Caste
            $("#343190").closest('.trow').hide();  // General Category
        } else {
            // No - Hide "Others Please specify", Show General fields
            $("#343191").closest('.trow').hide();
            $("#343191").val('');  // Clear the field
            $("#343208").closest('.trow').show();  // General Religion
            $("#343189").closest('.trow').show();  // General Caste
            $("#343190").closest('.trow').show();  // General Category
        }
    }
    
    $('input[name="343207"]').on('change', toggleEWSOthersFields);
    toggleEWSOthersFields(); // Initial state
});

// ============================================
// Hide Central Caste Details section and extra fields always
// ============================================

 
// Hide fields after 400ms delay
setTimeout(function() {
    $("h4:contains('Central Caste Details')").closest('.table_cont').hide();
     $("h4:contains('Details of Spouse of Applicant')").closest('.table_cont').hide();
    $("h4:contains('EWS Declaration')").closest('.table_cont').hide();
}, 400);
 $("#339445, #339164, #341779, #341814").closest('.trow').hide();

// ============================================
// Caste Details section (State Caste / Central Caste)
// ============================================
initCasteDetailsSection({
    certCheckboxGroup: "339504",           // Type of Certificate checkbox group
    stateTriggerValues: ["5", "6"],
    centralTriggerValues: ["7"],
    sectionSelector: ".table_cont:has(h4:contains('Caste Details'))",
    stateHeaderText: "Details of Caste (State)",
    stateVisibleFields: [ "#343176", "#343177"],
    stateHiddenFields:  ["#343178", "#343179"],
    centralHeaderText: "Details of Caste (Central)",
    centralVisibleFields: [  "#343181", "#343250"],
    centralHiddenFields:  ["#343182", "#343184"]
});

// ============================================
// Sections that show only when EWS is checked
// ============================================
initEWSDetailsSection({
    certCheckboxGroup: "339504",
    ewsTriggerValue: "4",
    othersRadio: "343207",
    othersSpecifyField: "#343191"
});

function initCasteDetailsSection(cfg) {
    function isAnyChecked(values) {
        return values.some(function (v) {
            return $('input[name="' + cfg.certCheckboxGroup + '"][value="' + v + '"]').is(":checked");
        });
    }

    function headerRow(text) {
        return $(".lbl").filter(function () {
            return $(this).text().trim().indexOf(text) === 0;
        }).closest(".trow");
    }

    function toggleSubsection(show, headerText, visibleFields, hiddenFields) {
        headerRow(headerText).toggle(show);

        visibleFields.forEach(function (id) {
            $(id).closest(".trow").toggle(show);
            if (!show) $(id).val("");
        });

        hiddenFields.forEach(function (id) {
            $(id).closest(".trow").hide();
            $(id).val("");
        });
    }

    function update() {
        var showState = isAnyChecked(cfg.stateTriggerValues);
        var showCentral = isAnyChecked(cfg.centralTriggerValues);

        $(cfg.sectionSelector).toggle(showState || showCentral);

        toggleSubsection(showState, cfg.stateHeaderText, cfg.stateVisibleFields, cfg.stateHiddenFields);
        toggleSubsection(showCentral, cfg.centralHeaderText, cfg.centralVisibleFields, cfg.centralHiddenFields);
    }

    $('input[name="' + cfg.certCheckboxGroup + '"]').on("change", update);
    update();
}

function initEWSDetailsSection(cfg) {
    function isEWSChecked() {
        return $('input[name="' + cfg.certCheckboxGroup + '"][value="' + cfg.ewsTriggerValue + '"]').is(":checked");
    }

    function update() {
        var showEWS = isEWSChecked();
        
        var $ewsDeclaration = getEWSDeclarationSection();
        if ($ewsDeclaration.length) {
            if (showEWS) {
                $ewsDeclaration.show();
            } else {
                $ewsDeclaration.hide();
                $ewsDeclaration.find('input[type="checkbox"]').prop('checked', false);
            }
        }
        
        var $ewsFields = $('h4:contains("EWS Details")').closest('.table_cont');
        if ($ewsFields.length) {
            if (showEWS) {
                $ewsFields.show();
            } else {
                $ewsFields.hide();
                $ewsFields.find('input[type="text"]').val('');
                $ewsFields.find('select').val('');
            }
        }
    }

    $('input[name="' + cfg.certCheckboxGroup + '"]').on("change", update);
    update();
}

// ============================================
// Father and Mother fields organization script
// ============================================

var SC = "SC";
var ST = "ST";

var PURPOSE_EMPLOYMENT = "2";
var PURPOSE_WELFARE = "3";

var CERT_EWS = "4";
var CERT_CASTE_EDUCATIONAL = "5";
var CERT_CASTE_EMPLOYMENT = "6";
var CERT_CASTE_CENTRAL = "7";

function getCheckedCertificates() {
    return $('input[name="339504"]:checked')
        .map(function () {
            return $(this).val();
        })
        .get();
}

function isEligiblePurpose() {
    var purpose = $("#342041").val();
    return purpose === PURPOSE_EMPLOYMENT || purpose === PURPOSE_WELFARE;
}

function isEligibleCertificateForParents() {
    var checked = getCheckedCertificates();
    return (
        checked.indexOf(CERT_EWS) !== -1 ||
        checked.indexOf(CERT_CASTE_EMPLOYMENT) !== -1 ||
        checked.indexOf(CERT_CASTE_CENTRAL) !== -1
    );
}

// Get the correct applicant category based on which caste section is visible
function getApplicantCategoryForParentCheck() {
    var checked = getCheckedCertificates();
    var hasState = (checked.indexOf(CERT_CASTE_EDUCATIONAL) !== -1 || checked.indexOf(CERT_CASTE_EMPLOYMENT) !== -1);
    var hasCentral = (checked.indexOf(CERT_CASTE_CENTRAL) !== -1);
    
    var categoryValue = "";
    
    if (hasState && hasCentral) {
        // Both present - use State category
        categoryValue = $.trim($("#343177").val());
    } else if (hasState) {
        // Only State present
        categoryValue = $.trim($("#343177").val());
    } else if (hasCentral) {
        // Only Central present
        categoryValue = $.trim($("#343250").val());
    }
    
    return categoryValue.toUpperCase();
}

function isEligibleCategory() {
    var categoryValue = getApplicantCategoryForParentCheck();
    return categoryValue !== "" && categoryValue !== SC && categoryValue !== ST;
}

function toggleRadioField(radioName, show) {
    var $radios = $('input[name="' + radioName + '"]');
    var $row = $radios.first().closest(".trow");
    if (!$row.length) return;

    if (show) {
        $row[0].style.removeProperty("display");
    } else {
        $radios.prop("checked", false);
        $row[0].style.setProperty("display", "none", "important");
    }
}

function runParentModule(radioNames) {
    var show =
        isEligiblePurpose() &&
        isEligibleCertificateForParents() &&
        isEligibleCategory();

    // Only toggle radio fields (property sections)
    // Occupation fields (#339493, #339500) are always visible
    radioNames.forEach(function (name) {
        toggleRadioField(name, show);
    });
}

function updateParentSections() {
    // Mother's property radio fields
    runParentModule(["343141", "343152", "343159"]);
       
    // Father's property radio fields
    runParentModule(["343130", "343148", "343156"]);
    
    console.log("Parent Sections Updated - Applicant Category:", getApplicantCategoryForParentCheck());
}

function forceInitialHideParents() {
    // Only hide property radio fields initially
    // Occupation fields remain visible
    toggleRadioField("343141", false);
    toggleRadioField("343152", false);
    toggleRadioField("343159", false);

    toggleRadioField("343130", false);
    toggleRadioField("343148", false);
    toggleRadioField("343156", false);
}

/* ============================================================
   MODULE 2: Spouse Details section
   ============================================================ */

var MARITAL_MARRIED = "1";

function getSpouseSection() {
    return $(".table_cont h4")
        .filter(function () {
            return $.trim($(this).text()) === "Details of Spouse of Applicant";
        })
        .closest(".table_cont");
}

function getEWSDeclarationSection() {
    var section = $(".table_cont h4")
        .filter(function () {
            return $.trim($(this).text()) === "EWS Declaration";
        })
        .closest(".table_cont");
    console.log("EWS Section found:", section.length);
    return section;
}

function getOBCDeclarationSection() {
    var section = $(".table_cont h4")
        .filter(function () {
            return $.trim($(this).text()) === "NON Creamy Layer OBC Declaration";
        })
        .closest(".table_cont");
    console.log("OBC Section found:", section.length);
    return section;
}

// ============================================
// EWS DEPENDENT SECTIONS - Family Relationship & Asset Details
// ============================================

function getFamilyRelationshipSection() {
    return $('input#fieldSetId[value="343011"]').closest('.table_cont');
}

function getAssetDetailsSection() {
    return $(".table_cont h4")
        .filter(function () {
            return $.trim($(this).text()) === "Asset Details";
        })
        .closest(".table_cont");
}

function toggleEWSDependentSections(show) {
    var $familySection = getFamilyRelationshipSection();
    var $assetSection = getAssetDetailsSection();
    
    // Toggle Family Relationship Details
    if ($familySection.length) {
        if (show) {
            $familySection.show();
        } else {
                $familySection.hide(); 
              $("h4:contains('Family Relationship Details')").closest('.table_cont').hide();
        }
    }
    
    // Toggle Asset Details
    if ($assetSection.length) {
        if (show) {
            $assetSection.show();
        } else {
            $assetSection.hide();
            $assetSection.find('textarea').val('');
        }
    }
    
    console.log("EWS Dependent Sections - Show:", show);
}

function isCasteCertificateSelected() {
    var checked = getCheckedCertificates();
    return (
        checked.indexOf(CERT_CASTE_EDUCATIONAL) !== -1 ||
        checked.indexOf(CERT_CASTE_EMPLOYMENT) !== -1 ||
        checked.indexOf(CERT_CASTE_CENTRAL) !== -1
    );
}

function isEwsTriggerSelected() {
    var checked = getCheckedCertificates();
    return checked.indexOf(CERT_EWS) !== -1;
}

function isOBCTriggerSelected() {
    var checked = getCheckedCertificates();
    return (
        checked.indexOf(CERT_CASTE_EDUCATIONAL) !== -1 ||
        checked.indexOf(CERT_CASTE_EMPLOYMENT) !== -1
    );
}

function isMarried() {
    return $.trim($("#339245").val()) === MARITAL_MARRIED;
}
 
function toggleSpouseSection(show) {
    var $section = getSpouseSection();
    if (!$section.length) return;

    if (show) {
        $section.show();
    } else {
        $section.hide();
        $section.find("input[type='text']").val("");
        $section.find("select").val("");
    }
}

function toggleEWSDeclarationSection(show) {
    var $section = getEWSDeclarationSection();
    if (!$section.length) return;

    if (show) {
        $section.show();
    } else {
        $section.hide();
        $section.find('input[type="checkbox"]').prop('checked', false);
        $section.find('input[type="text"]').val('');
        $section.find('select').val('');
    }
}

function toggleOBCDeclarationSection(show) {
    var $section = getOBCDeclarationSection();
    if (!$section.length) return;

    if (show) {
        $section.slideDown(300);
        // Make OBC checkbox required when shown
        $('#344728_1').prop('required', true);
    } else {
        $section.slideUp(300);
        // Uncheck and remove required attribute when hidden
        $('#344728_1').prop('required', false);
        $('#344728').prop('required', false);
        // Clear any validation errors
        $('.error[for="344728_1"]').hide();
    }
}

function updateSpouseSection() {
    var show = isEwsTriggerSelected() && isMarried();
 
    toggleSpouseSection(show);
}

function forceInitialHideSpouse() {
    toggleSpouseSection(false);
}

function updateEWSSection() {
    var show = isEwsTriggerSelected();
    console.log("EWS Section - Show:", show);
    
    var $ewsSection = getEWSDeclarationSection();
    if ($ewsSection.length) {
        if (show) {
            $ewsSection.show();
        } else {
            $ewsSection.hide();
            $ewsSection.find('input[type="checkbox"]').prop('checked', false);
        }
    }
    
    // Toggle Family Relationship and Asset Details sections
    toggleEWSDependentSections(show);
}

function forceInitialHideEWSDeclaration() {
    toggleEWSDeclarationSection(false);
}

function updateOBCTriggerSection() {
    var show = isOBCTriggerSelected();
    console.log("OBC Section - Show:", show);
    
    // var $obcSection = getOBCDeclarationSection();
    // if ($obcSection.length) {
    //     if (show) {
    //         $obcSection.show();
    //     } else {
    //         $obcSection.hide();
    //         $obcSection.find('input[type="checkbox"]').prop('checked', false);
    //     }
    // }
}

function isCentralCasteSelectedfn() {
    var checked = getCheckedCertificates();
    return checked.indexOf(CERT_CASTE_CENTRAL) !== -1;
}
function isStateCasteSelectedfn() {
    var checked = getCheckedCertificates();
    return checked.indexOf(CERT_CASTE_EMPLOYMENT) !== -1||
           checked.indexOf(CERT_CASTE_EMPLOYMENT) !== -1;;
}

function iscentralCasteOBC(){
  let centralCaste = $.trim($("#343250").val()).toUpperCase();
  return centralCaste === "OBC";
  
}

function isstateCasteOBC(){
  let stateCaste = $.trim($("#343177").val()).toUpperCase();
  return stateCaste === "OBC" || stateCaste === "BCM" || stateCaste === "MBC" || stateCaste === "BT" || stateCaste === "EBC";
  
}

function updateOBCDeclarationSection() {
    var show = (isCentralCasteSelectedfn() && iscentralCasteOBC()||
               isStateCasteSelectedfn() && isstateCasteOBC());
    console.log("OBC Section - Show:", show);
    toggleOBCDeclarationSection(show);
}

function forceInitialHideOBCDeclaration() {
    toggleOBCDeclarationSection(false);
}

function forceInitialHideEWSDependentSections() {
    toggleEWSDependentSections(false);
}

/* ============================================================
   Shared init: run all modules together
   ============================================================ */

function updateAll() {
    updateParentSections();
    updateSpouseSection();
    updateEWSSection();
    updateOBCDeclarationSection(); // Update OBC section too
    updateOBCTriggerSection();
}

function forceInitialHideAll() {
    forceInitialHideParents();
    forceInitialHideSpouse();
    forceInitialHideEWSDeclaration();
    forceInitialHideOBCDeclaration();
    forceInitialHideEWSDependentSections();
}

$(document).ready(function () {
    forceInitialHideAll();

    setTimeout(updateAll, 500);

    $("#342041").on("change", function () {
        setTimeout(updateAll, 100);
    });

    $('input[name="339504"]').on("change", function () {
        setTimeout(updateAll, 100);
    });

    // Watch APPLICANT'S State Category field
    $("#343177").on("change", function () {
        setTimeout(updateAll, 100);
    });

    // Watch APPLICANT'S Central Category field
    $("#343250").on("change", function () {
        setTimeout(updateAll, 100);
    });

    $("#339245").on("change", function () {
        setTimeout(updateAll, 100);
    });
});

$(window).on("load", function () {
    setTimeout(updateAll, 300);
});

////////////////////////////////////////////////////////////////
// optimzed code for mother and father occupation and property section
////////////////////////////////////////////////////////////////

$(document).ready(function () {

    // ============================================
    // Purpose of Application → Type of Certificate
    // ============================================
    initPurposeCertificateMapping({
        purposeSelect: "#342041",
        certCheckboxGroup: "339504",
        rules: {
            "1": ["1","2", "3", "4", "5", "7"],
            "2": ["2", "4", "6", "7"],
            "3": ["1", "3", "4", "5"],
            "4": ["1", "3"]
        }
    });

    // ============================================
    // Occupation → Organisation → dependent fields (Father / Mother)
    // ============================================
    [
        { occupation: "#339493", organisation: "#343075", designation: "#343052", serviceType: "#343053",
          scalePay: "#343054", appointment: "#343055", grossSalary: "#343056", promotionAge: "#343057",
          organisationName: "#343058", periodFrom: "#343059", periodTo: "#343060", deathDate: "#343069",
          details: "#343070", profession: "#343071" },

        { occupation: "#339500", organisation: "#343076", designation: "#343077", serviceType: "#343078",
          scalePay: "#343079", appointment: "#343080", grossSalary: "#343081", promotionAge: "#343082",
          organisationName: "#343083", periodFrom: "#343084", periodTo: "#343085", deathDate: "#343086",
          details: "#343087", profession: "#343088" }
    ].forEach(initOrganisationModule);

    // ============================================
    // Property section: Agri land / Plantation / Urban property (Father / Mother)
    // ============================================
    [
        { agriRadio: "343130", fieldsetId: "343131", pctFields: ["#343142", "#343143", "#343144"],
          plantationRadio: "343148", plantationFields: ["#343149", "#343150", "#343151"],
          urbanRadio: "343156", urbanFields: ["#343157", "#343158", "#343162"] },

        { agriRadio: "343141", fieldsetId: "343136", pctFields: ["#343145", "#343146", "#343147"],
          plantationRadio: "343152", plantationFields: ["#343153", "#343154", "#343155"],
          urbanRadio: "343159", urbanFields: ["#343160", "#343161", "#343163"] }
    ].forEach(initPropertySection);

});

/* =====================================================================
   MODULE: Purpose of Application → Type of Certificate checkboxes
   ===================================================================== */
function initPurposeCertificateMapping(cfg) {

    function applyMapping() {
        var allowed = cfg.rules[$(cfg.purposeSelect).val()] || [];

        $('input[name="' + cfg.certCheckboxGroup + '"]').each(function () {
            var isAllowed = allowed.indexOf($(this).val()) !== -1;
            $(this).prop("disabled", !isAllowed)
                   .closest(".tdata").toggleClass("disabled-option", !isAllowed);
            if (!isAllowed) $(this).prop("checked", false);
        });
    }

    $(cfg.purposeSelect).on("change", applyMapping);
    applyMapping();
}

/* =====================================================================
   MODULE: Occupation → Organisation → dependent fields
   ===================================================================== */
var ORG_RULES = {
    "1": ["designation"],
    "2": ["designation", "serviceType", "scalePay", "appointment", "grossSalary", "promotionAge"],
    "3": ["designation", "organisationName", "periodFrom", "periodTo"],
    "4": ["deathDate", "details"],
    "5": ["designation", "organisationName", "appointment"],
    "6": ["designation", "scalePay"],
    "7": ["profession"]
};
var ALL_ORG_FIELD_KEYS = ["designation", "serviceType", "scalePay", "appointment", "grossSalary",
    "promotionAge", "organisationName", "periodFrom", "periodTo", "deathDate", "details", "profession"];

function initOrganisationModule(cfg) {

    function toggleOrganisation() {
        hideRows(ALL_ORG_FIELD_KEYS.map(function (key) { return cfg[key]; }));

        if ($(cfg.organisation).closest(".trow").is(":hidden")) return;

        (ORG_RULES[$(cfg.organisation).val()] || [])
            .forEach(function (key) { showField(cfg[key]); });
    }

    function toggleOccupation() {
        var isEmployed = $(cfg.occupation).val() === "1";
        $(cfg.organisation).closest(".trow").toggle(isEmployed);
        if (!isEmployed) $(cfg.organisation).val("");
        toggleOrganisation();
    }

    $(cfg.occupation).on("change", toggleOccupation);
    $(cfg.organisation).on("change", toggleOrganisation);
    toggleOccupation();
}

/* =====================================================================
   MODULE: Property section — Agri land / Plantation / Urban property
   ===================================================================== */
function initPropertySection(cfg) {

    var groups = [
        { radio: cfg.agriRadio, fields: cfg.pctFields, fieldsetId: cfg.fieldsetId },
        { radio: cfg.plantationRadio, fields: cfg.plantationFields },
        { radio: cfg.urbanRadio, fields: cfg.urbanFields }
    ];

    function toggle(group) {
        var isYes = $('input[name="' + group.radio + '"]:checked').val() === "1";

        if (group.fieldsetId) {
            var fieldset = getFieldsetByRowId(group.fieldsetId);
            fieldset.closest(".tdata").toggle(isYes);
            fieldset.find(".trow, .lbl").toggle(isYes);
            if (!isYes) fieldset.find("input, select, textarea").not("[type=hidden]").val("");
        }

        isYes ? showRows(group.fields) : hideRows(group.fields);
    }

    groups.forEach(function (group) {
        $('input[name="' + group.radio + '"]').on("change", function () { toggle(group); });
        toggle(group);
    });
}

/* =====================================================================
   SHARED HELPERS
   ===================================================================== */
function showField(id) {
    $(id).closest(".trow").show().find(".lbl").show();
}

function hideField(id) {
    $(id).val("").closest(".trow").hide();
}

function showRows(ids) { ids.forEach(showField); }
function hideRows(ids) { ids.forEach(hideField); }

function getFieldsetByRowId(fieldsetId) {
    return $('input#fieldSetId[value="' + fieldsetId + '"]').closest(".column_5.fieldSet");
}  
  
  
// ============================================
// EWS Self-Declaration text builder
// ============================================
$(document).ready(function () {
    initEWSDeclaration({
        salutation: "#342374",
        applicantName: "#339158",
        fatherName: "#339159",
        spouseName: "#343089",
        age: "#339163",
        houseNo: "#341669",
        addr1: "#341670",
        addr2: "#341671",
        addr3: "#341750",
        pin: "#341667",
        district: "#339153",
        state: "#339138",
        declarationCheckbox: "343164_1"
    });

});

function initEWSDeclaration(cfg) {

    var PLACEHOLDER = ".........";
    var SALUTATION = { "1": "Shri", "2": "Tmt", "3": "Selvi" };

    function val(id) { return $(id).val() || PLACEHOLDER; }

    function selectedText(id) { return $(id).val() ? $(id + " option:selected").text() : PLACEHOLDER; }

    function relationship(sal) {
        var father = val(cfg.fatherName), spouse = $(cfg.spouseName).val();
        if (sal === "2") return "wife of " + (spouse || father);
        if (sal === "3") return "daughter of " + father;
        return "son of " + father;
    }

    function address() {
        var parts = [cfg.houseNo, cfg.addr1, cfg.addr2, cfg.addr3]
            .map(function (id) { return $(id).val(); })
            .filter(Boolean);
        return parts.length ? parts.join(", ") : PLACEHOLDER;
    }

    function updateDeclaration() {
        var label = $('label[for="' + cfg.declarationCheckbox + '"]');
        if (!label.length) return;

        var sal = $(cfg.salutation).val();
        var declarationText =
            " I, " + (SALUTATION[sal] || PLACEHOLDER) + " " + val(cfg.applicantName) +
            " " + relationship(sal) +
            " age " + val(cfg.age) +
            " permanent resident of " + address() +
            ", District " + selectedText(cfg.district) +
            " in the State/Union Territory " + selectedText(cfg.state) +
            ", Pin Code " + val(cfg.pin) +
            " do hereby declare that the information given by me in this application " +
            "form and its self-attached enclosures is true to the best of knowledge and " +
            "that the information furnished is exhaustive and I have not suppressed any fact.";

        label.html(label.find("input[type='checkbox']").prop("outerHTML") + declarationText);
    }

    var watchedFields = [
        cfg.salutation, cfg.applicantName, cfg.fatherName, cfg.spouseName, cfg.age,
        cfg.houseNo, cfg.addr1, cfg.addr2, cfg.addr3, cfg.pin, cfg.district, cfg.state
    ];
    $(watchedFields.join(", ")).on("change keyup", updateDeclaration);

    updateDeclaration();
}

// =============================================
//  display none id's
// =============================================

$("#341973_openCamra").css("display", "none");

// =============================================
// CALCULATE YEARS AND MONTHS FOR DYNAMIC GRID (Read-Only)
// =============================================
$(document).ready(function() {
    
    function handleYearsAndMonths() {
        $('input[name^="339281_"]').each(function() {
            var index = $(this).attr('name').split('_')[1];
            if (isNaN(index)) return;
            
            // Set up years field (339283)
            var $years = $('input[name="339283_' + index + '"]');
            $years.prop('readonly', true).css({
                'background-color': '#f5f5f5',
                'cursor': 'not-allowed'
            });
            
            // Set up months field (344535)
            var $months = $('input[name="344535_' + index + '"]');
            $months.prop('readonly', true).css({
                'background-color': '#f5f5f5',
                'cursor': 'not-allowed'
            });
            
            var fromDate = $(this).val();
            var toDate = $('input[name="339282_' + index + '"]').val();
            
            if (fromDate && toDate) {
                var f = fromDate.split('/');
                var t = toDate.split('/');
                
                if (f.length === 3 && t.length === 3) {
                    var fromYear = parseInt(f[2]);
                    var toYear = parseInt(t[2]);
                    var fromMonth = parseInt(f[1]);
                    var toMonth = parseInt(t[1]);
                    var fromDay = parseInt(f[0]);
                    var toDay = parseInt(t[0]);
                    
                    if (!isNaN(fromYear) && !isNaN(toYear) && 
                        !isNaN(fromMonth) && !isNaN(toMonth)) {
                        
                        // Calculate total months difference
                        var totalMonths = (toYear - fromYear) * 12 + (toMonth - fromMonth);
                        
                        // Adjust for days if needed
                        if (toDay < fromDay) {
                            totalMonths--;
                        }
                        
                        // Calculate years and remaining months
                        var years = Math.floor(totalMonths / 12);
                        var months = totalMonths % 12;
                        
                        // Ensure non-negative values
                        if (totalMonths < 0) {
                            years = 0;
                            months = 0;
                        }
                        
                        // Set values
                        $years.val(years);
                        $months.val(months);
                        
                    } else {
                        $years.val('');
                        $months.val('');
                    }
                } else {
                    $years.val('');
                    $months.val('');
                }
            } else {
                $years.val('');
                $months.val('');
            }
            
            // Attach event handlers
            $(this).off('change blur').on('change blur', function() {
                handleYearsAndMonths();
            });
            $('input[name="339282_' + index + '"]').off('change blur').on('change blur', function() {
                handleYearsAndMonths();
            });
        });
    }
    
    handleYearsAndMonths();
    
    $(document).on('click', '.add_bttn, .remove_bttn', function() {
        setTimeout(handleYearsAndMonths, 200);
    });
});

// =============================================
// SYNC FATHER NAME FIELDS
// =============================================
$(document).ready(function() {
    var $fatherName1 = $('#339159');
    var $fatherName2 = $('#339491');
    
    $fatherName2.prop('readonly', true);
    $fatherName2.css('background-color', '#f5f5f5');
    
    function syncFatherName() {
        $fatherName2.val($fatherName1.val());
    }
    
    $fatherName1.on('input change', syncFatherName);
    
    syncFatherName();
});
 
$(document).ready(function() {
    var $spouseName1 = $('#344707');
    var $spouseName2 = $('#343089');
    
    $spouseName2.prop('readonly', true);
    $spouseName2.css('background-color', '#f5f5f5');
    
    function syncspouseName() {
        $spouseName2.val($spouseName1.val());
    }
    
    $spouseName1.on('input change', syncspouseName);
    
    syncspouseName();
});
 
     
// =============================================
// SHOW/HIDE BASED ON "HAVE YOU ALREADY APPLIED!"
// =============================================
$(document).ready(function() {
     function toggleAppliedFields() {
         var show = $('#342397_1').is(':checked');
        
         $('#342392, #342396, #342394, #344441, #344441_1, #344441_2, #344441_3, #344442 , #342395').each(function() {
             $(this).closest('.trow').toggle(show);
         });
        
         $('label[for="342392"], label[for="342396"], label[for="342394"], label[for="344441"], label[for="344442"]').toggle(show);
        
         if (!show) {
             $('#342392, #342396, #342394, #344441, #344442').val('');
         }
     }
    
     $('input[name="342397"]').on('change', toggleAppliedFields);
    
     toggleAppliedFields();
 });


// =============================================
// AUTO-SET SALUTATION based on Gender & Marital Status
// =============================================
function autoSetSalutation() {
    var genderRadios = document.querySelectorAll("input[name='339161']");
    var maritalDropdown = document.getElementById("339245");
    var salutationDropdown = document.getElementById("342374");
    var relationdropdown = document.getElementById("344440");

    if (!genderRadios.length || !maritalDropdown || !salutationDropdown || !relationdropdown) return;

    function updateSalutation() {
        var selectedGender = null;
        genderRadios.forEach(function(radio) {
            if (radio.checked) selectedGender = radio.value;
        });

        var maritalStatus = maritalDropdown.value;
        var salutationValue = "";

        if (selectedGender === "1") {
            salutationValue = "1";
        } else if (selectedGender === "2" || selectedGender === "3") {
            if (maritalStatus === "1" || maritalStatus === "3" || maritalStatus === "4") {
                salutationValue = "2";
            } else if (maritalStatus === "2") {
                salutationValue = "3";
            }
        }

        salutationDropdown.value = salutationValue;
        relationdropdown.value = salutationValue;
        var event = new Event('change', { bubbles: true });
        salutationDropdown.dispatchEvent(event);
        relationdropdown.dispatchEvent(event);
    }

    genderRadios.forEach(function(radio) {
        radio.addEventListener('change', updateSalutation);
    });
    maritalDropdown.addEventListener('change', updateSalutation);
    updateSalutation();
}

// =============================================
// CUTOFF VISIBILITY
// =============================================
var resFields = ['341677', '341678', '341679', '341751', '341682'];

var stateresfield = ['345778','343178','343179'];
var centralresfield = ['343182','343184'];

var certFields = ['341698', '341880', '341703', '341700', '341701', '341697', '341702', '341704', '341705', '341706', '341707'];

function toggle(fields, show) {
    fields.forEach(function(id) {
        var $el = $('#' + id);
        show ? $el.closest('.trow').show() : ($el.closest('.trow').hide() && $el.val(''));
    });
}
function cutcastetoggle(fields, show) {
    fields.forEach(function(id) {
        var $el = $('#' + id);
        show ? $el.closest('.trow').show() : ($el.closest('.trow').hide());
    });
}
// Get the cutoff date based on applicant's caste selection
function getCutoffDateFromCaste() {
    var checked = getCheckedCertificates();
    var hasState = (checked.indexOf(CERT_CASTE_EDUCATIONAL) !== -1 || checked.indexOf(CERT_CASTE_EMPLOYMENT) !== -1);
    var hasCentral = (checked.indexOf(CERT_CASTE_CENTRAL) !== -1);
    
    var selectedCaste = "";
    var selectedReligion = "";
    
    if (hasState && hasCentral) {
        // Both present - use State caste
        selectedCaste = $.trim($("#343176").val()).toUpperCase();
        selectedReligion = $("#344528").val();
    } else if (hasState) {
        // Only State present
        selectedCaste = $.trim($("#343176").val()).toUpperCase();
        selectedReligion = $("#344528").val();
    } else if (hasCentral) {
        // Only Central present
        selectedCaste = $.trim($("#343181").val()).toUpperCase();
        selectedReligion = $("#344528").val();
    }
    
    // Search casteMaster for the selected caste
    if (selectedReligion && selectedCaste && casteMaster[selectedReligion]) {
        var casteList = casteMaster[selectedReligion];
        for (var i = 0; i < casteList.length; i++) {
            if (casteList[i].caste.toUpperCase() === selectedCaste) {
                // Return the resolution (cutoff date) from STATE data
                if (hasState && hasCentral) {
                    return casteList[i].STATE.resolution || "";
                } else if (hasState) {
                    return casteList[i].STATE.resolution || "";
                } else if (hasCentral) {
                    return casteList[i].CENTRAL.resolution || "";
                }
            }
        }
    }
    
    return "";
}

// Update cutoff date field with caste resolution
function updateCutoffDateField() {
    var cutoffDate = getCutoffDateFromCaste();
    if (cutoffDate) {
        // Update the cutoff date field - replace with actual cutoff date field ID
        // For example: $("#cutoff_date_field_id").val(cutoffDate);
        console.log("Cutoff Date from Caste:", cutoffDate);
    }
}

var cutoffVisibilityTimer;

function cutoffupdateVisibility() {
    let cutoffcasteEducational = $('#339504_5').is(':checked');
    let cutoffcasteEmployment = $('#339504_6').is(':checked');
    var resYes = $('#341694_1').is(':checked');
    var resNo = $('#341694_2').is(':checked');
    var certYes = $('#341696_1').is(':checked');

    $("label:contains('Residential address')").closest('.trow').toggle(resYes);
    $('#341873_1').closest('.tdata').toggle(resYes); 
    $('label[for="341873"]').closest('.tdata').toggle(resYes);
 
    toggle(resFields, resYes);
    if(cutoffcasteEducational || cutoffcasteEmployment) cutcastetoggle(stateresfield, resYes);
    $("label:contains('Do you have Caste / Community certificate')").closest('.trow').toggle(resNo);
    toggle(certFields, resNo && certYes);

    // Update cutoff date from caste data
    updateCutoffDateField();
}

function debouncedUpdatecutoff() {
    clearTimeout(cutoffVisibilityTimer);
    cutoffVisibilityTimer = setTimeout(cutoffupdateVisibility, 500);
}

// =============================================
// UPPERCASE FOR NAME FIELDS
// =============================================
function setupUppercaseFields() {
    $("#339158, #339159, #339491, #339497, #344707, #343089, #341698")
        .css("text-transform", "uppercase")
        .off("input")
        .on("input", function () {
            $(this).val($(this).val().toUpperCase());
        });

$("#339248")
        .css("text-transform", "lowercase")
        .off("input")
        .on("input", function () {
            $(this).val($(this).val().toLowerCase());
        });
         
    $(document).on("input", "input[name^='340979_']", function () {
        $(this).val($(this).val().toUpperCase());
    });
}

// =============================================
// PHOTO DOCUMENT HIDE
// =============================================
function setupPhotoDocumentHide() {
    var photoEl = document.getElementById("341604");
    if (photoEl) photoEl.closest(".tdata").style.display = "none";

    var altEl = document.getElementById("339243");
    if (altEl) altEl.closest(".trow").style.display = "block";
}

// =============================================
// READ ONLY / DISABLED FIELDS
// =============================================
function setupReadOnlyFields() {
    $('#339163').prop('readonly', true);
    $('#339476').prop('readonly', true);
    $('#342374').prop('disabled', true);
}

// =============================================
// COLOR FOR COPY ADDRESS / FILE-SIZE LABELS
// =============================================
function setupLabelColors() {
    document.querySelectorAll('.lbl').forEach(function(label) {
       if (label.textContent.includes('Max File Size: 1 MB | Accepted Formats: JPG, JPEG, PNG)')||label.textContent.includes('Auto-selected based on Gender and Marital Status.')) {
            label.style.color = '#C77405';
            label.style.backgroundColor = '#ffeeab';
            label.style.padding = '3px 6px';
            label.style.borderRadius = '4px';
            const checkbox = document.getElementById(label.getAttribute('for'));
            if (checkbox) checkbox.style.accentColor = '#C77405';
        }
    });

    document.querySelectorAll('.lbl').forEach(function(label) {
       if (label.textContent.includes('Permanent address is same as Present Address')||label.textContent.includes('Address at Birth is the same as the Permanent Address')) {
            label.style.color = 'white';
            label.style.backgroundColor = 'green';
            label.style.padding = '3px 6px';
            label.style.borderRadius = '4px';
            const checkbox = document.getElementById(label.getAttribute('for'));
            if (checkbox) checkbox.style.accentColor = 'white';
        }
    });
}

// =============================================
// MARGIN FOR CHECKBOX AND RADIO BTN
// =============================================
function setupInputMargins() {
    document.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
        cb.style.margin = '5px';
    });
    document.querySelectorAll('input[type="radio"]').forEach(function(rb) {
        rb.style.margin = '5px';
    });
}

// =============================================
// DYNAMIC VISIBILITY OF SECTIONS (checkbox-driven)
// =============================================
var sectionVisibilityTimer;

function updateVisibility() {
    var residence = $('#339504_1').is(':checked');
    var nativity = $('#339504_2').is(':checked');
    var income = $('#339504_3').is(':checked');
    var ews = $('#339504_4').is(':checked');
    var casteEducational = $('#339504_5').is(':checked');
    var casteEmployment = $('#339504_6').is(':checked');
    var casteCentral = $('#339504_7').is(':checked');

    var anyCasteSelected = casteEducational || casteEmployment || casteCentral;
    var anyCasteSelectedforcutoff = casteEducational || casteEmployment;
    //new
var centralCategoryValue = ($('#343250').val() || '').toUpperCase();
var centralIsSCorST = centralCategoryValue === 'SC' || centralCategoryValue === 'ST';
 
var showCutOffDate = casteEducational || casteEmployment || (casteCentral && centralIsSCorST);

 // NEW — Purpose = Welfare overrides caste-driven visibility for these sections
    var purposeIsWelfare = $('#342041').val() === PURPOSE_WELFARE;
    if (purposeIsWelfare) {
        anyCasteSelected = false;
        showCutOffDate = false;
    }
    var anyResidenceNativity = residence || nativity;
    var anyIncomeEWS = income || ews;
    var centralCasteOBC = isCentralCasteSelectedfn() && iscentralCasteOBC();
    var stateCasteOBC = isStateCasteSelectedfn() && isstateCasteOBC();

    var showIncomeSection = anyIncomeEWS || centralCasteOBC || stateCasteOBC;

    var applicationType = $("h4:contains('Application Type')").closest('.table_cont');
    var applicantDetails = $("h4:contains('Applicant Details')").closest('.table_cont');
    var centralCasteDetails = $("h4:contains('Central Caste Details')").closest('.table_cont');
    var educationalDetails = $("h4:contains('Educational Details')").closest('.table_cont');
    var applicantAddress = $("h4:contains('Applicant's Address')").closest('.table_cont');
    var addressPastFiveYears = $("h4:contains('Address for Past Five Years')").closest('.table_cont');
    var addressAtTimeBirth = $("h4:contains('Address at Time of Birth')").closest('.table_cont');
    var addressCutOffDate = $("h4:contains('Address as on Cut Off Date')").closest('.table_cont');
    var fatherDetails = $("h4:contains('Details of Father of Applicant')").closest('.table_cont');
    var motherDetails = $("h4:contains('Details of Mother of Applicant')").closest('.table_cont');
    var familyAnnualIncome = $("h4:contains('Family Annual Income')").closest('.table_cont');
    var totalFamilyIncome = $("h4:contains('Total Family Income')").closest('.table_cont');
    // var declaration = $("h4:contains('Declaration')").closest('.table_cont');

    applicationType.show();
    applicantDetails.show();
    educationalDetails.show();
    applicantAddress.show();
    // declaration.show();
  
     // ✅ FIX: Always show the Religion field #344528
    //$('#344528').closest('.trow').show();
    //$('label[for="344528"]').show();
 
    anyResidenceNativity ? addressPastFiveYears.show() : addressPastFiveYears.hide();

    if (nativity) {
        addressAtTimeBirth.show();
    } else {
        addressAtTimeBirth.hide();
        addressAtTimeBirth.find('input[type="text"]').val('');
    }

    showCutOffDate ? addressCutOffDate.show() : addressCutOffDate.hide();

    if (anyCasteSelected) {
        fatherDetails.show();
        motherDetails.show();
    } else {
        fatherDetails.hide();
        motherDetails.hide();
    }

    if (showIncomeSection ) {
        familyAnnualIncome.show();
        totalFamilyIncome.show();
    } else {
        familyAnnualIncome.hide();
        totalFamilyIncome.hide();
        $('#339476').val('');
    }

    if (anyCasteSelected) {
        $('#341605').closest('.cont').show();
        $('label[for="341605"]').show();
    } else {
        $('#341605').closest('.cont').hide();
        $('label[for="341605"]').hide();
        $('#341605').val('');
    }
}

function debouncedUpdate() {
    clearTimeout(sectionVisibilityTimer);
    sectionVisibilityTimer = setTimeout(updateVisibility, 300);
}

// =============================================
// INITIALIZE EVERYTHING
// =============================================
$(document).ready(function() {
    // Salutation
    autoSetSalutation();

    // Cutoff-date section visibility
    $('input[name="341694"], input[name="341696"]').on('change', cutoffupdateVisibility);
    cutoffupdateVisibility();
    debouncedUpdatecutoff();

    // Uppercase name fields
    setupUppercaseFields();

    // Photo document field
    setupPhotoDocumentHide();

    // Read-only / disabled fields
    setupReadOnlyFields();

    // Label colors
    setupLabelColors();

    // Checkbox/radio margins
    setupInputMargins();

    // Section visibility driven by checkbox group 339504
    $('input[name="339504"]').on('change', debouncedUpdate);
    updateVisibility();

    $("#343250").on("change", function() {
    setTimeout(updateVisibility, 100);
    });

    // Add this — State Category needs to retrigger updateVisibility too,
    // same as it already does for updateAll()
    $("#343177").on("change", function() {
        setTimeout(updateVisibility, 100);
    });
    console.log('✅ All systems initialized successfully!');
});


// =============================================
// UPDATE HIDDEN CERTIFICATE FIELD BASED ON CHECKBOXES
// =============================================

function updateHiddenCertificate() {

    var values = [];

    $("input[name='339504']:checked").each(function () {
        values.push($(this).val());
    });

    $("#342412").val(values.join(","));
}

$("input[name='339504']").on("change", updateHiddenCertificate);

updateHiddenCertificate();



// =============================================
//  4. Caste Function 
// =============================================


console.log("Caste Script Loaded");

// *** UPDATED casteMaster WITH gazetteNo & gazetteDate ***

var casteMaster = {
  HINDU: [
    {
      caste: "AGAMUDIYAS",
      STATE: {
        category: "OBC", serial: "1",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "1",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "THULUVA VELLALAS",
      STATE: {
        category: "OBC", serial: "1",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "1",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "AYEERAVAISIAR",
      STATE: {
        category: "OBC", serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "2",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ACHARAPAKKAM CHETTIAR",
      STATE: {
        category: "OBC", serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "2",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "BERI CHETTIAR",
      STATE: {
        category: "OBC", serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "2",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MANJAPUDOOR CHETTIAR",
      STATE: {
        category: "OBC", serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "2",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VADAMBAR CHETTIAR",
      STATE: {
        category: "OBC", serial: "2",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "2",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SOZHIA CHETTY",
      STATE: {
        category: "OBC", serial: "2",
        resolution: "G.O.Ms.No.13/2002/WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "EZHAVA",
      STATE: {
        category: "OBC", serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "5",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "GRAMANI",
      STATE: {
        category: "OBC", serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "5",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NADAR",
      STATE: {
        category: "OBC", serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "5",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SANAR",
      STATE: {
        category: "OBC", serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "5",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "TIYYA",
      STATE: {
        category: "OBC", serial: "6",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "5",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ISAI VELLALAR",
      STATE: {
        category: "OBC", serial: "8",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "7",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "JANGAM",
      STATE: {
        category: "OBC", serial: "9",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "8",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "JANGAMAR",
      STATE: {
        category: "OBC", serial: "10",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "8",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KALAVANTHULA",
      STATE: {
        category: "OBC", serial: "10",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "9",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KAMSALI",
      STATE: {
        category: "OBC", serial: "11",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "10",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "DEVANGA",
      STATE: {
        category: "OBC", serial: "12",
        resolution: "G.O.Ms.No.4/2017-SWS, dated 07-06-2017", gazetteNo: "84", gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KANNADA DEVANGA",
      STATE: {
        category: "OBC", serial: "12",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "11",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "TELUGU DEVANGA",
      STATE: {
        category: "OBC", serial: "12",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "11",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KANAKKUPILLAI",
      STATE: {
        category: "OBC", serial: "13",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KARUNEEGAR",
      STATE: {
        category: "OBC", serial: "13",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KSHATRIYAS",
      STATE: {
        category: "OBC", serial: "14",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "49",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KONDA REDDY",
      STATE: {
        category: "OBC", serial: "15",
        resolution: "G.O.Ms.No.18/2007-WEL(SW-V) dated 19-06-2007", gazetteNo: "28", gazetteDate: "10-07-2007",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KONGU VELLALAR",
      STATE: {
        category: "OBC", serial: "16",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MAHRATTA (NON-BRAHMIN)",
      STATE: {
        category: "OBC", serial: "19",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "14",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KHATIK",
      STATE: {
        category: "OBC", serial: "19",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "14",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MUKKULATHOR",
      STATE: {
        category: "OBC", serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "18",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "AGAMUDAYA DEVAR",
      STATE: {
        category: "OBC", serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "18",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KALLAR",
      STATE: {
        category: "OBC", serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "18",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MARAVAR",
      STATE: {
        category: "OBC", serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "18",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "DEVAR",
      STATE: {
        category: "OBC", serial: "25",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "18",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAINAR",
      STATE: {
        category: "OBC", serial: "26",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "19",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PADMASALI",
      STATE: {
        category: "OBC", serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "21",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PADMASALIAR",
      STATE: {
        category: "OBC", serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "21",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PATTU SALIAR",
      STATE: {
        category: "OBC", serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "21",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SALIAN",
      STATE: {
        category: "OBC", serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "21",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SALIAR",
      STATE: {
        category: "OBC", serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "21",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SALIARS",
      STATE: {
        category: "OBC", serial: "28",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "21",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PALAYAPATTU NAIDU",
      STATE: {
        category: "OBC", serial: "29",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MALAYAMAN",
      STATE: {
        category: "OBC", serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NATHAMAN",
      STATE: {
        category: "OBC", serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULA MOOPANAR",
      STATE: {
        category: "OBC", serial: "30",
        resolution: "G.O.Ms.No.40/2005-WEL(SW-V) dated 28-09-2005", gazetteNo: "44", gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULA PILLAI",
      STATE: {
        category: "OBC", serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULA UDAYAR",
      STATE: {
        category: "OBC", serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULAM",
      STATE: {
        category: "OBC", serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SURUTHIMAN",
      STATE: {
        category: "OBC", serial: "30",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PATTU CHETTIAR",
      STATE: {
        category: "OBC", serial: "31",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "52",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "REDDY (GANJAM)",
      STATE: {
        category: "OBC", serial: "32",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "24 MANAI TELUGU CHETTY",
      STATE: {
        category: "OBC", serial: "33",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "23",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SADHU CHETTY",
      STATE: {
        category: "OBC", serial: "33",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "23",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "TELUGUPATTY CHETTY",
      STATE: {
        category: "OBC", serial: "33",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "23",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SALIA CHETTIAR",
      STATE: {
        category: "OBC", serial: "34",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "53",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SENAI THALAIVAR",
      STATE: {
        category: "OBC", serial: "35",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "59",
        resolution: "G.O.M.s No. 12015/13/2010-B.C.-II dated 08.12.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SENGUNTHAR",
      STATE: {
        category: "OBC", serial: "36",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "24",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KAIKOLAR",
      STATE: {
        category: "OBC", serial: "36",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "24",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SETTIBALIJA(EDIGA)",
      STATE: {
        category: "OBC", serial: "37",
        resolution: "G.O.Ms.No.26/2002-WEL(SW-II) dated 10-06-2002", gazetteNo: "117", gazetteDate: "20-06-2002",
      },
      CENTRAL: {
        category: "OBC", serial: "25",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SOZHIA VELLALAR",
      STATE: {
        category: "OBC", serial: "38",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VADAMALAI CHETTIAR",
      STATE: {
        category: "OBC", serial: "39",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "54",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "BALIJA NAIDU",
      STATE: {
        category: "OBC", serial: "40",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CAVARA NAIDU",
      STATE: {
        category: "OBC", serial: "40",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "51",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "GAVARALU",
      STATE: {
        category: "OBC", serial: "40",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "51",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VADUGAN",
      STATE: {
        category: "OBC", serial: "40",
        resolution: "G.O.Ms.No.12/2009-WEL(SW-V) dated 10.11.2009", gazetteNo: "47", gazetteDate: "24-11-2009",
      },
      CENTRAL: {
        category: "OBC", serial: "57",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VALAYAL NAIDU",
      STATE: {
        category: "OBC", serial: "40",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "51",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VANDAYAR",
      STATE: {
        category: "OBC", serial: "41",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VANIAR",
      STATE: {
        category: "OBC", serial: "42",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "26",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VANIYA CHETTY",
      STATE: {
        category: "OBC", serial: "42",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VELLALA CHETTIAR",
      STATE: {
        category: "OBC", serial: "45",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VISWAKARMA",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KALTHATCHAR",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KAMMALAR",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KANNAR",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KARUMAR",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PATHAR",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PORKOLLAR",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "THATCHAR",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "THATTAR",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VISWAKARMALA",
      STATE: {
        category: "OBC", serial: "46",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "29",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KONAR",
      STATE: {
        category: "OBC", serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "30",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAMBAR YADAVA",
      STATE: {
        category: "OBC", serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "30",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "YADAVA",
      STATE: {
        category: "OBC", serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "30",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "IDAYAR",
      STATE: {
        category: "OBC", serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "30",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "GOLLALU",
      STATE: {
        category: "OBC", serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "30",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "YADAVA PILLAI",
      STATE: {
        category: "OBC", serial: "47",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "30",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "YADAVA NAIDU",
      STATE: {
        category: "OBC", serial: "48",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "31",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KANNADA SAINEEGAR",
      STATE: {
        category: "OBC", serial: "50",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KANNADIAR",
      STATE: {
        category: "OBC", serial: "50",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "BHAT RAJU",
      STATE: {
        category: "OBC", serial: "51",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC", serial: "33",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MUTHU RAJA",
      STATE: {
        category: "OBC", serial: "51",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC", serial: "33",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "BONDILI",
      STATE: {
        category: "OBC", serial: "52",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC", serial: "34",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MUTHIRAYAR",
      STATE: {
        category: "OBC", serial: "54",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC", serial: "36",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAGARAM",
      STATE: {
        category: "OBC", serial: "55",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC", serial: "37",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAGARATHAR",
      STATE: {
        category: "OBC", serial: "55",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC", serial: "37",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VEERAKODI VELLALA",
      STATE: {
        category: "OBC", serial: "56",
        resolution: "G.O.Ms.No.13/2002-WEL(SW-II) dated 12-03-2002", gazetteNo: "13", gazetteDate: "26-03-2002",
      },
      CENTRAL: {
        category: "OBC", serial: "38",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CHATTADI (CHATTADA OR SRIVAISHNAVA)",
      STATE: {
        category: "OBC", serial: "57",
        resolution: "G.O.Ms.No.18/2007-WEL(SW-V) dated 19-06-2007", gazetteNo: "28", gazetteDate: "10-07-2007",
      },
      CENTRAL: {
        category: "OBC", serial: "39",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "GAMALLA",
      STATE: {
        category: "OBC", serial: "59",
        resolution: "G.O.Ms.No.56/2003-WEL(SW-II) dated 01-12-2003", gazetteNo: "51", gazetteDate: "23-12-2003",
      },
      CENTRAL: {
        category: "OBC", serial: "41",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ODDE",
      STATE: {
        category: "OBC", serial: "60",
        resolution: "G.O.Ms.No.56/2003-WEL(SW-II) dated 01-12-2003", gazetteNo: "51", gazetteDate: "23-12-2003",
      },
      CENTRAL: {
        category: "OBC", serial: "42",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KURUMBA",
      STATE: {
        category: "OBC", serial: "61",
        resolution: "G.O.Ms.No.56/2003-WEL(SW-II) dated 01-12-2003", gazetteNo: "51", gazetteDate: "23-12-2003",
      },
      CENTRAL: {
        category: "OBC", serial: "43",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ANDIPANDARAM",
      STATE: {
        category: "OBC", serial: "64",
        resolution: "G.O.Ms.No.42/2004-WEL(SW-V) dated 09-11-2004", gazetteNo: "44", gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC", serial: "46",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KANISAN",
      STATE: {
        category: "OBC", serial: "65",
        resolution: "G.O.Ms.No.42/2004-WEL(SW-V) dated 09-11-2004", gazetteNo: "44", gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC", serial: "47",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KANIYAN",
      STATE: {
        category: "OBC", serial: "65",
        resolution: "G.O.Ms.No.42/2004-WEL(SW-V) dated 09-11-2004", gazetteNo: "44", gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC", serial: "47",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KUDUMBI",
      STATE: {
        category: "OBC", serial: "67",
        resolution: "G.O.Ms.No.19/2007-WEL(SW-V) dated 19-06-2007", gazetteNo: "28", gazetteDate: "10-07-2007",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "TELIKULA",
      STATE: {
        category: "OBC", serial: "68",
        resolution: "G.O.Ms.No.08/2014/SWS dated 13-02-2015", gazetteNo: "8", gazetteDate: "24-02-2015",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "TELUKULA",
      STATE: {
        category: "OBC", serial: "68",
        resolution: "G.O.Ms.No.08/2014/SWS dated 13-02-2015", gazetteNo: "8", gazetteDate: "24-02-2015",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VELLAN CHETTY",
      STATE: {
        category: "OBC", serial: "69",
        resolution: "G.O.Ms.No.02/2016/SWS dated 05-08-2016", gazetteNo: "33", gazetteDate: "16-08-2016",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "UPPARA",
      STATE: {
        category: "OBC", serial: "70",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017", gazetteNo: "84", gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "DOODEKULA SAIBU",
      STATE: {
        category: "OBC", serial: "71",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017", gazetteNo: "84", gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "DUDEKULA",
      STATE: {
        category: "OBC", serial: "71",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017", gazetteNo: "84", gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PERIKA",
      STATE: {
        category: "OBC", serial: "72",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017", gazetteNo: "84", gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PERIKE",
      STATE: {
        category: "OBC", serial: "72",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017", gazetteNo: "84", gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "GOWDA",
      STATE: {
        category: "OBC", serial: "73",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017", gazetteNo: "84", gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CHAKKALA",
      STATE: {
        category: "OBC", serial: "74",
        resolution: "G.O.Ms.No.04/2017/SWS dated 07-06-2017", gazetteNo: "84", gazetteDate: "14-06-2017",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    // EBC entries
    {
      caste: "CHETTIAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CHINNA PATTINAVAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MEENAVA CHETTIAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MEENAVAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NATTAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARVATHARAJAKULAM",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PATTINAVA CHETTIAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PATTINAVAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PERIYA PATTINAVAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SEMBADAVAR",
      STATE: {
        category: "EBC", serial: "1",
        resolution: "G.O.Ms.No.09/2010/WEL/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    // BT entries
    {
      caste: "MALAIKURAVAN",
      STATE: {
        category: "BT", serial: "2",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010", gazetteNo: "16", gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MALAKURAVAN",
      STATE: {
        category: "BT", serial: "2",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010", gazetteNo: "16", gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KATTUNAYAKAN",
      STATE: {
        category: "BT", serial: "3",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010", gazetteNo: "16", gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "6",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "YERUKULA",
      STATE: {
        category: "BT", serial: "4",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010", gazetteNo: "16", gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "32",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KURUMAN",
      STATE: {
        category: "BT", serial: "5",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010", gazetteNo: "16", gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KURUMANS",
      STATE: {
        category: "BT", serial: "5",
        resolution: "G.O.Ms.No.5/2009/WEL/SW-V dated 12.04.2010", gazetteNo: "16", gazetteDate: "20-04-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    // ST entries (gazette blank)
    {
      caste: "IRULAR",
      STATE: {
        category: "ST", serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "ST", serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VETTAIKARAN",
      STATE: {
        category: "ST", serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "ST", serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VILLI",
      STATE: {
        category: "ST", serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "ST", serial: "1",
        resolution:
          "THE CONSTITUTION (PUDUCHERRY) SCHEDULED TRIBES ORDER, 2016", gazetteNo: "", gazetteDate: "",
      },
    },
    // MBC entries
    {
      caste: "KUYAVAR",
      STATE: {
        category: "MBC", serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "12",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KULALAR",
      STATE: {
        category: "MBC", serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "12",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KUMBARAR",
      STATE: {
        category: "MBC", serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "12",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KUMMARI",
      STATE: {
        category: "MBC", serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "12",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MANNUDAYAR",
      STATE: {
        category: "MBC", serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "12",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PATHAR",
      STATE: {
        category: "MBC", serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "12",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "POONUL KUYAVAR",
      STATE: {
        category: "MBC", serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "12",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VELAAR",
      STATE: {
        category: "MBC", serial: "2",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "12",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MARUDHA NAIDU",
      STATE: {
        category: "MBC", serial: "3",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MARUTHUVAR",
      STATE: {
        category: "MBC", serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "15",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAYEE BRAHMIN",
      STATE: {
        category: "MBC", serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "15",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MANGALI",
      STATE: {
        category: "MBC", serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "15",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "AMBATTAN",
      STATE: {
        category: "MBC", serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "15",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAVITHAR",
      STATE: {
        category: "MBC", serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "15",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PANDITHAR",
      STATE: {
        category: "MBC", serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "15",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARIYARI",
      STATE: {
        category: "MBC", serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "15",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PRONOPAKARI",
      STATE: {
        category: "MBC", serial: "4",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "15",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "AGNIKULAKSHATRIYA",
      STATE: {
        category: "MBC", serial: "5",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MUKKUVAN",
      STATE: {
        category: "MBC", serial: "5",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARAVAR",
      STATE: {
        category: "MBC", serial: "5",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MUKYA",
      STATE: {
        category: "MBC", serial: "5",
        resolution: "G.O.Ms.No.7/2009-Wel(SW-V) dated 28.01.2009", gazetteNo: "10", gazetteDate: "10-02-2009",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VADABALIJA",
      STATE: {
        category: "MBC", serial: "5",
        resolution: "G.O.Ms.No.56/2003-WEL(SW-II) dated 01-12-2003", gazetteNo: "51", gazetteDate: "23-12-2003",
      },
      CENTRAL: {
        category: "OBC", serial: "16",
        resolution: "G.O.M.s No. 12015/05/2011-BC II dated 17.02.2014", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "OTTAR",
      STATE: {
        category: "MBC", serial: "6",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "55",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VANNAN",
      STATE: {
        category: "MBC", serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "56",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VANNAR",
      STATE: {
        category: "MBC", serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "56",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "EKALI",
      STATE: {
        category: "MBC", serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "56",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MANNAN",
      STATE: {
        category: "MBC", serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "56",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "RAJAKA",
      STATE: {
        category: "MBC", serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "56",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CHAKKALI",
      STATE: {
        category: "MBC", serial: "7",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "56",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VANNIAKULA KSHATRIYA",
      STATE: {
        category: "MBC", serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "28",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "GOUNDER",
      STATE: {
        category: "MBC", serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAICKER",
      STATE: {
        category: "MBC", serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "28",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PADAYATCHI",
      STATE: {
        category: "MBC", serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "28",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PALLI",
      STATE: {
        category: "MBC", serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "28",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VANNIAR",
      STATE: {
        category: "MBC", serial: "8",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "28",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NOKKAR",
      STATE: {
        category: "MBC", serial: "10",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "35",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NOKKAN",
      STATE: {
        category: "MBC", serial: "10",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "35",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NARIKURAVAR",
      STATE: {
        category: "MBC", serial: "11",
        resolution: "G.O.Ms.No.27/2004-Wel (SW-V) dated 14.07.2004", gazetteNo: "31", gazetteDate: "03-08-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "40",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MEDARA OF YANAM",
      STATE: {
        category: "MBC", serial: "12",
        resolution: "G.O.Ms.No.43/2004-Wel (SW-V) dated 09.11.2004", gazetteNo: "49", gazetteDate: "07-12-2004",
      },
      CENTRAL: {
        category: "OBC", serial: "45",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "EZHUTHACHAN",
      STATE: {
        category: "MBC", serial: "13",
        resolution: "G.O.Ms.No.41/2005-Wel (SW-V) dated 28.09.2005", gazetteNo: "44", gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC", serial: "58",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "EZHUTHACHANS",
      STATE: {
        category: "MBC", serial: "13",
        resolution: "G.O.Ms.No.41/2005-Wel (SW-V) dated 28.09.2005", gazetteNo: "44", gazetteDate: "01-11-2005",
      },
      CENTRAL: {
        category: "OBC", serial: "58",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KAVUTHIYA",
      STATE: {
        category: "MBC", serial: "14",
        resolution: "G.O.Ms.No.7/2009-Wel(SW-V) dated 28.01.2009", gazetteNo: "10", gazetteDate: "10-02-2009",
      },
      CENTRAL: {
        category: "OBC", serial: "44",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KAVUTHIYAN",
      STATE: {
        category: "MBC", serial: "14",
        resolution: "G.O.Ms.No.7/2009-Wel(SW-V) dated 28.01.2009", gazetteNo: "10", gazetteDate: "10-02-2009",
      },
      CENTRAL: {
        category: "OBC", serial: "44",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    // SC entries (gazette blank)
    {
      caste: "ADI ANDHRA",
      STATE: {
        category: "SC", serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ADI DRAVIDA",
      STATE: {
        category: "SC", serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CHAKKILIYAN",
      STATE: {
        category: "SC", serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "JAMBUVULU",
      STATE: {
        category: "SC", serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KURAVAN",
      STATE: {
        category: "SC", serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MADIGA",
      STATE: {
        category: "SC", serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MALA",
      STATE: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MALA MASTI",
      STATE: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PAKY",
      STATE: {
        category: "SC", serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PALLAN",
      STATE: {
        category: "SC", serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARAYAN",
      STATE: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAMBAVAR",
      STATE: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAMBAN",
      STATE: {
        category: "SC", serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "THOTI",
      STATE: {
        category: "SC", serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VALLUVAN",
      STATE: {
        category: "SC", serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VETAN",
      STATE: {
        category: "SC", serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VETTIYAN",
      STATE: {
        category: "SC", serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PUTHIRAI VANNAN",
      STATE: {
        category: "SC", serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002", gazetteNo: "", gazetteDate: "",
      },
    },
    // GENERAL entries (no STATE or empty)
    {
      caste: "BRAHMIN",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KAPU",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "REDDIAR",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KSHATRIYA",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "JAIN",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ARYA VYSYA",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAIR",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "AGARWAL",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "AADHI SAIVAR BRAHMIN",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "THONDAIMANDALA MUDALIAR",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAMBOODIRI",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAMBEESAN",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAMBIAR",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MENON",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MARAR",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KURUPP",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VAISHYA",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KAMMA",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "REDDY",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CHOWDARY",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KATTUNAICKER",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "6",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KULELA",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "20",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "NAMDEV MARATHA",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "14",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "UDAYAR",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARKAVAKULA UDAIYAR",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "22",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SALIAR",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "21",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAMBAR",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "30",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KHATRIYAS",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "49",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
  ],
  CHRISTIAN: [
    {
      caste:
        "CONVERTS TO CHRISTIANITY FROM ANY HINDU BACKWARD CLASSES COMMUNITY IRRESPECTIVE OF THE GENERATION OF CONVERSION",
      STATE: {
        category: "OBC", serial: "3",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "3",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste:
        "CONVERTS TO CHRISTIANITY FROM SCHEDULED CASTES IRRESPECTIVE OF THE GENERATION OF CONVERSION",
      STATE: {
        category: "OBC", serial: "4",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "4",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "LATIN CATHOLICS",
      STATE: {
        category: "OBC", serial: "18",
        resolution: "G.O.Ms.No.9/2001-WEL(SW-II) dated 19-02-2001", gazetteNo: "29", gazetteDate: "22-02-2001",
      },
      CENTRAL: {
        category: "OBC", serial: "50",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ANGLO INDIAN",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ROMAN CATHOLIC",
      STATE: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
  ],
  MUSLIM: [
    {
      caste: "DEKKANI MUSLIMS",
      STATE: {
        category: "BCM", serial: "1",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MAPPILA",
      STATE: {
        category: "BCM", serial: "2",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "13",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "LABBAI",
      STATE: {
        category: "BCM", serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "17",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MARICAR",
      STATE: {
        category: "BCM", serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "17",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "RAVUTHAR",
      STATE: {
        category: "BCM", serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "17",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAIBU",
      STATE: {
        category: "BCM", serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "OBC", serial: "17",
        resolution: "G.O.M.s No. 12015/15/2008-BCC dated 16.06.2011", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SHAIK",
      STATE: {
        category: "BCM", serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SYED",
      STATE: {
        category: "BCM", serial: "3",
        resolution: "G.O.Ms.No.8/2010/Wel/SW-V dated 28.08.2010", gazetteNo: "37", gazetteDate: "14-09-2010",
      },
      CENTRAL: {
        category: "GENERAL", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "LUBBAI",
      STATE: {
        category: "", serial: "",
        resolution: "", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "OBC", serial: "17",
        resolution: "G.O.M.s No. 12011/14/2004-BCC dated 12.03.2007", gazetteNo: "", gazetteDate: "",
      },
    },
  ],
  SIKH: [
    // SC list same as Hindu SC (with blank gazette)
    {
      caste: "ADI ANDHRA",
      STATE: {
        category: "SC", serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ADI DRAVIDA",
      STATE: {
        category: "SC", serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CHAKKILIYAN",
      STATE: {
        category: "SC", serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "JAMBUVULU",
      STATE: {
        category: "SC", serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KURAVAN",
      STATE: {
        category: "SC", serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MADIGA",
      STATE: {
        category: "SC", serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MALA",
      STATE: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MALA MASTI",
      STATE: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PAKY",
      STATE: {
        category: "SC", serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PALLAN",
      STATE: {
        category: "SC", serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARAYAN",
      STATE: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAMBAVAR",
      STATE: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAMBAN",
      STATE: {
        category: "SC", serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "THOTI",
      STATE: {
        category: "SC", serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VALLUVAN",
      STATE: {
        category: "SC", serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VETAN",
      STATE: {
        category: "SC", serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VETTIYAN",
      STATE: {
        category: "SC", serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PUTHIRAI VANNAN",
      STATE: {
        category: "SC", serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002", gazetteNo: "", gazetteDate: "",
      },
    },
  ],
  BUDDHIST: [
    // Same SC list (blank)
    {
      caste: "ADI ANDHRA",
      STATE: {
        category: "SC", serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "1",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "ADI DRAVIDA",
      STATE: {
        category: "SC", serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "2",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "CHAKKILIYAN",
      STATE: {
        category: "SC", serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "3",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "JAMBUVULU",
      STATE: {
        category: "SC", serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "4",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "KURAVAN",
      STATE: {
        category: "SC", serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "5",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MADIGA",
      STATE: {
        category: "SC", serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "6",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MALA",
      STATE: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "MALA MASTI",
      STATE: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "7",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PAKY",
      STATE: {
        category: "SC", serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "8",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PALLAN",
      STATE: {
        category: "SC", serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "9",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PARAYAN",
      STATE: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAMBAVAR",
      STATE: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "10",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "SAMBAN",
      STATE: {
        category: "SC", serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "11",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "THOTI",
      STATE: {
        category: "SC", serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "12",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VALLUVAN",
      STATE: {
        category: "SC", serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "13",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VETAN",
      STATE: {
        category: "SC", serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "14",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "VETTIYAN",
      STATE: {
        category: "SC", serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "15",
        resolution:
          "THE CONSTITUTION (PONDICHERRY) SCHEDULED CASTES ORDER, 1964", gazetteNo: "", gazetteDate: "",
      },
    },
    {
      caste: "PUTHIRAI VANNAN",
      STATE: {
        category: "SC", serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002", gazetteNo: "", gazetteDate: "",
      },
      CENTRAL: {
        category: "SC", serial: "16",
        resolution:
          "THE CONSTITUTION (SCHEDULED CASTES) ORDERS (SECOND AMENDMENT) ACT,2002", gazetteNo: "", gazetteDate: "",
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

    if (config.categoryId === "343177" || config.categoryId === "343250") {
      setTimeout(updateAll, 100);
    }
  }

  function loadExistingValue() {
    var religionValue = religion.val();
    var casteValue = caste.val();
    if (!religionValue || !casteValue) return;

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
  religionId: "344528",
  casteId: "343176",
  categoryId: "343177",
  serialId: "343178",
  resolutionId: "343179",
  source: "STATE",
  mode: "NORMAL",
  others:false
});

// 2. Central Caste Certificate
initializeCasteControl({
  religionId: "344528",
  casteId: "343181",
  categoryId: "343250",
  serialId: "343182",
  resolutionId: "343184",
  source: "CENTRAL",
  mode: "NORMAL",
  others:true
});

// 3. Central + Show General (EWS Caste Certificate)
initializeCasteControl({
  religionId: "344528",
  casteId: "343189",
  categoryId: "343190",
  serialId: "999999",
  resolutionId: "888888",
  source: "CENTRAL",
  mode: "EWS",
  others:true  
});

// 4. Father State + Show All Categories
initializeCasteControl({
  religionId: "343309",
  casteId: "343310",
  categoryId: "343311",
  serialId: "999999",
  resolutionId: "989898",
  source: "STATE",
  mode: "ALL",
  others:true 
});

// 5. Mother State + Show All Categories
initializeCasteControl({
  religionId: "343318",
  casteId: "343319",
  categoryId: "343320",
  serialId: "999999",
  resolutionId: "989899",
  source: "STATE",
  mode: "ALL",
  others:true 
});

// 6. Spouse State + Show All Categories
initializeCasteControl({
  religionId: "343324",
  casteId: "343325",
  categoryId: "343326",
  serialId: "999999",
  resolutionId: "989899",
  source: "CENTRAL",
  mode: "EWS",
  others:true 
});
