 
// cut out date label
$(document).ready(function () {
    function updateResidentLabel() {
        // Get values from input fields
        var category = $('#343177').val() ? $('#343177').val().trim().toUpperCase() : '';
        var caste = $('#343176').val() ? $('#343176').val().trim().toUpperCase() : '';
        var dateText = "19th February 2001"; // default
        
        if (category === 'SC') {
            if (caste === 'PUTHIRAI VANNAN') {
                dateText = "17th December 200211";
            } else {
                dateText = "5th March 196411";
            }
        } else if (category === 'ST') {
            dateText = "22th December 2016";
        }
        // For OBC, MBC, EBC, BT - keep default "19th February 2001"
        // No else needed as default is already set
        
        // Find label by its text instead of ID
        // $('label').filter(function () {
        //     return $(this).text().trim().startsWith(
        //         'Whether the candidate or his/her father or paternal grandfather'
        //     );
        // }).html(
        //     'Whether the candidate or his/her father or paternal grand father was continiously residing in the UT of Pondicherry prior as on <b>' +
        //     dateText +
        //     '</b>'
        // );
             
     // Set dateText into input field
        $('#345778').val(dateText).prop('disabled', true);
    }
    
    // Bind change events to input fields
    $('#343177').on('change keyup', updateResidentLabel);
    $('#343176').on('change keyup', updateResidentLabel);
    // Initial call
    updateResidentLabel();
});
 